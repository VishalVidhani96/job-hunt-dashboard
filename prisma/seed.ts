import { prisma } from '../lib/prisma';

async function main() {
  const user = await prisma.user.upsert({ where: { email: 'owner@example.com' }, update: {}, create: { email: 'owner@example.com' } });
  const source = await prisma.jobSource.upsert({ where: { key: 'mock_public_feed' }, update: {}, create: { key: 'mock_public_feed', name: 'Mock Public Feed' } });

  const profile = await prisma.candidateProfile.upsert({
    where: { id: (await prisma.candidateProfile.findFirst({ where: { userId: user.id } }))?.id ?? 'missing' },
    update: {},
    create: {
      userId: user.id,
      name: 'Primary Profile',
      summary: 'TypeScript full-stack engineer in Germany',
      yearsExperience: 5,
      skills: ['TypeScript', 'React', 'Node.js'],
      technologies: ['Next.js', 'Prisma', 'PostgreSQL'],
      jobTitles: ['Software Engineer', 'Full Stack Developer'],
      education: ['BSc Computer Science'],
      keywords: ['typescript', 'react', 'next.js', 'prisma']
    }
  });

  await prisma.job.create({
    data: {
      userId: user.id,
      profileId: profile.id,
      sourceId: source.id,
      title: 'Full Stack Engineer',
      company: 'Munich Apps GmbH',
      description: 'Looking for TypeScript and Next.js expertise',
      summary: 'Build SaaS products',
      city: 'Munich',
      country: 'Germany',
      requiredLanguage: 'English',
      postedAt: new Date(),
      url: 'https://example.com/jobs/seed-1',
      normalizedHash: 'seed-hash-1',
      atsScore: 86,
      atsExplanation: 'Strong skills overlap',
      status: 'New'
    }
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
