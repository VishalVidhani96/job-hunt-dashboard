import { redirect } from 'next/navigation';
import { parseCvPdf } from '@/lib/services/cv-parser';
import { prisma } from '@/lib/prisma';
import { getOrCreateDefaultUser } from '@/lib/services/user';

function parseCsvValues(value: FormDataEntryValue | null): string[] {
  if (!value || typeof value !== 'string') return [];
  return value.split(',').map((v) => v.trim()).filter(Boolean);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const user = await getOrCreateDefaultUser();

  if (form.get('manual') === 'true') {
    await prisma.candidateProfile.upsert({
      where: { id: (await prisma.candidateProfile.findFirst({ where: { userId: user.id } }))?.id ?? 'missing' },
      update: {
        summary: String(form.get('summary') ?? ''),
        skills: parseCsvValues(form.get('skills')),
        technologies: parseCsvValues(form.get('technologies')),
        jobTitles: parseCsvValues(form.get('jobTitles')),
        education: parseCsvValues(form.get('education')),
        keywords: parseCsvValues(form.get('keywords')),
        yearsExperience: Number(form.get('yearsExperience') ?? 0)
      },
      create: {
        userId: user.id,
        name: process.env.CV_PROFILE_NAME ?? 'Primary Profile',
        summary: String(form.get('summary') ?? ''),
        skills: parseCsvValues(form.get('skills')),
        technologies: parseCsvValues(form.get('technologies')),
        jobTitles: parseCsvValues(form.get('jobTitles')),
        education: parseCsvValues(form.get('education')),
        keywords: parseCsvValues(form.get('keywords')),
        yearsExperience: Number(form.get('yearsExperience') ?? 0)
      }
    });
    redirect('/profile');
  }

  const cv = form.get('cv');
  if (!cv || !(cv instanceof File)) return new Response('Missing cv file', { status: 400 });

  const arrayBuffer = await cv.arrayBuffer();
  const parsed = await parseCvPdf(Buffer.from(arrayBuffer));

  const existing = await prisma.candidateProfile.findFirst({ where: { userId: user.id } });
  if (existing) {
    await prisma.candidateProfile.update({
      where: { id: existing.id },
      data: {
        summary: parsed.summary,
        skills: parsed.skills,
        technologies: parsed.technologies,
        jobTitles: parsed.jobTitles,
        education: parsed.education,
        keywords: parsed.keywords,
        yearsExperience: parsed.yearsExperience,
        parsedRawText: parsed.rawText
      }
    });
  } else {
    await prisma.candidateProfile.create({
      data: {
        userId: user.id,
        name: process.env.CV_PROFILE_NAME ?? 'Primary Profile',
        summary: parsed.summary,
        skills: parsed.skills,
        technologies: parsed.technologies,
        jobTitles: parsed.jobTitles,
        education: parsed.education,
        keywords: parsed.keywords,
        yearsExperience: parsed.yearsExperience,
        parsedRawText: parsed.rawText
      }
    });
  }

  redirect('/profile');
}
