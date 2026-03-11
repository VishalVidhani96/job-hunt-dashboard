import { describe, expect, it } from 'vitest';
import { computeAtsScore } from '@/lib/services/ats';

const profile: any = {
  skills: ['TypeScript', 'React'],
  jobTitles: ['Software Engineer'],
  keywords: ['typescript', 'react', 'prisma']
};

describe('computeAtsScore', () => {
  it('returns high score for matching german job', () => {
    const result = computeAtsScore(profile, {
      title: 'Software Engineer',
      description: 'TypeScript React Prisma role',
      country: 'Germany',
      requiredLanguage: 'English'
    });
    expect(result.score).toBeGreaterThan(70);
  });
});
