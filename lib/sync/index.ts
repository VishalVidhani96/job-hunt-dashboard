import { prisma } from '@/lib/prisma';
import { computeAtsScore } from '@/lib/services/ats';
import { buildDedupKey, buildUrlFingerprint } from '@/lib/services/dedup';
import { sourceAdapters } from '@/lib/sources';

export async function shouldSync(userId: string) {
  const minInterval = Number(process.env.SYNC_MIN_INTERVAL_MINUTES ?? '30');
  const latest = await prisma.syncRun.findFirst({ where: { userId, success: true }, orderBy: { startedAt: 'desc' } });
  if (!latest) return true;
  return Date.now() - latest.startedAt.getTime() > minInterval * 60 * 1000;
}

export async function runSync(params: { userId: string; trigger: 'cron' | 'open' | 'manual' }) {
  const run = await prisma.syncRun.create({ data: { userId: params.userId, trigger: params.trigger } });

  try {
    const profile = await prisma.candidateProfile.findFirst({ where: { userId: params.userId }, orderBy: { updatedAt: 'desc' } });
    if (!profile) throw new Error('No candidate profile found. Upload CV first.');

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    let insertedCount = 0;
    let updatedCount = 0;

    for (const adapter of sourceAdapters) {
      const jobs = await adapter.fetchRecentJobs({ queryKeywords: profile.keywords, country: 'Germany', since });
      const source = await prisma.jobSource.upsert({
        where: { key: adapter.key },
        update: {},
        create: { key: adapter.key, name: adapter.key }
      });

      for (const candidate of jobs) {
        if (candidate.country !== 'Germany' || candidate.postedAt < since) continue;
        const urlFingerprint = buildUrlFingerprint(candidate.url);
        const dedupKey = buildDedupKey(candidate);

        const ats = computeAtsScore(profile, {
          title: candidate.title,
          description: candidate.description,
          city: candidate.city,
          country: candidate.country,
          requiredLanguage: candidate.requiredLanguage
        });

        const existing = await prisma.job.findFirst({
          where: {
            userId: params.userId,
            OR: [{ url: urlFingerprint }, { normalizedHash: dedupKey }]
          }
        });

        if (existing) {
          await prisma.job.update({
            where: { id: existing.id },
            data: {
              lastSeenAt: new Date(),
              isNewToday: false,
              atsScore: ats.score,
              atsExplanation: ats.explanation
            }
          });
          updatedCount += 1;
          continue;
        }

        const created = await prisma.job.create({
          data: {
            userId: params.userId,
            profileId: profile.id,
            sourceId: source.id,
            externalId: candidate.externalId,
            title: candidate.title,
            company: candidate.company,
            description: candidate.description,
            summary: candidate.summary,
            city: candidate.city,
            country: candidate.country,
            requiredLanguage: candidate.requiredLanguage,
            postedAt: candidate.postedAt,
            url: urlFingerprint,
            normalizedHash: dedupKey,
            atsScore: ats.score,
            atsExplanation: ats.explanation,
            isNewToday: true,
            status: 'New'
          }
        });

        await prisma.jobDedupMeta.create({
          data: {
            jobId: created.id,
            dedupKey,
            titleFingerprint: candidate.title.toLowerCase(),
            companyFingerprint: candidate.company.toLowerCase()
          }
        });
        insertedCount += 1;
      }
    }

    await prisma.syncRun.update({
      where: { id: run.id },
      data: { success: true, finishedAt: new Date(), insertedCount, updatedCount }
    });

    return { insertedCount, updatedCount };
  } catch (error) {
    await prisma.syncRun.update({
      where: { id: run.id },
      data: { success: false, finishedAt: new Date(), errorMessage: error instanceof Error ? error.message : 'Unknown error' }
    });
    throw error;
  }
}
