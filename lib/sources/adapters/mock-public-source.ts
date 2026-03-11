import type { JobSourceAdapter } from '@/lib/sources/types';

/**
 * Replace this adapter with legitimate public feed adapters.
 * Source-specific logic is intentionally isolated here for easy replacement.
 */
export const mockPublicSourceAdapter: JobSourceAdapter = {
  key: 'mock_public_feed',
  async fetchRecentJobs({ country, since, queryKeywords }) {
    const now = new Date();
    return [
      {
        externalId: 'mock-1',
        title: `TypeScript Engineer (${queryKeywords[0] ?? 'General'})`,
        company: 'Berlin Tech GmbH',
        description: 'Build Next.js and Prisma products for EU clients. English working language.',
        summary: 'Full-stack TypeScript role',
        city: 'Berlin',
        country,
        requiredLanguage: 'English',
        postedAt: new Date(Math.max(now.getTime() - 3 * 60 * 60 * 1000, since.getTime() + 1000)),
        url: 'https://example.com/jobs/mock-1',
        sourceKey: 'mock_public_feed'
      }
    ];
  }
};
