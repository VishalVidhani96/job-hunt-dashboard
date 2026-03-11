import type { JobStatus, LanguageCode } from '@prisma/client';

export type JobFilters = {
  status?: JobStatus;
  city?: string;
  language?: LanguageCode;
  keyword?: string;
  minScore?: number;
};

export type JobSort = 'newest' | 'score' | 'company';
