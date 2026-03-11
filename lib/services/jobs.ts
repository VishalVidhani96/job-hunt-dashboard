import { prisma } from '@/lib/prisma';
import type { JobFilters, JobSort } from '@/lib/types/job';

export async function getNewJobs(userId: string, filters: JobFilters, sort: JobSort) {
  return getJobs(userId, { ...filters }, sort, true);
}

export async function getAllJobs(userId: string, filters: JobFilters, sort: JobSort) {
  return getJobs(userId, { ...filters }, sort, false);
}

async function getJobs(userId: string, filters: JobFilters, sort: JobSort, onlyLast24h: boolean) {
  const now = new Date();
  const where = {
    userId,
    ...(onlyLast24h ? { postedAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.city ? { city: { equals: filters.city, mode: 'insensitive' as const } } : {}),
    ...(filters.language ? { requiredLanguage: filters.language } : {}),
    ...(filters.minScore ? { atsScore: { gte: filters.minScore } } : {}),
    ...(filters.keyword
      ? {
          OR: [
            { title: { contains: filters.keyword, mode: 'insensitive' as const } },
            { company: { contains: filters.keyword, mode: 'insensitive' as const } },
            { description: { contains: filters.keyword, mode: 'insensitive' as const } }
          ]
        }
      : {})
  };

  const orderBy =
    sort === 'score' ? [{ atsScore: 'desc' as const }] : sort === 'company' ? [{ company: 'asc' as const }] : [{ postedAt: 'desc' as const }];

  return prisma.job.findMany({ where, orderBy, include: { notes: true, source: true } });
}
