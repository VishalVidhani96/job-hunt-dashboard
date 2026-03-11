export type SourceJob = {
  externalId?: string;
  title: string;
  company: string;
  description: string;
  summary?: string;
  city?: string;
  country: string;
  requiredLanguage?: 'English' | 'German';
  postedAt: Date;
  url: string;
  sourceKey: string;
};

export interface JobSourceAdapter {
  key: string;
  fetchRecentJobs(params: { queryKeywords: string[]; country: 'Germany'; since: Date }): Promise<SourceJob[]>;
}
