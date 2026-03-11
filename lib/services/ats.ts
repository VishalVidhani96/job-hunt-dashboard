import type { CandidateProfile, LanguageCode } from '@prisma/client';

export type AtsInput = {
  title: string;
  description: string;
  city?: string | null;
  country: string;
  requiredLanguage?: LanguageCode | null;
};

export function computeAtsScore(profile: CandidateProfile, job: AtsInput): { score: number; explanation: string } {
  const text = `${job.title} ${job.description}`.toLowerCase();
  const profileSkills = profile.skills.map((s) => s.toLowerCase());
  const skillHits = profileSkills.filter((skill) => text.includes(skill)).length;
  const skillScore = Math.min(40, skillHits * 8);

  const titleHits = profile.jobTitles.filter((title) => text.includes(title.toLowerCase())).length;
  const titleScore = Math.min(20, titleHits * 10);

  const keywordHits = profile.keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length;
  const keywordScore = Math.min(20, keywordHits * 2);

  const languageScore = !job.requiredLanguage || job.requiredLanguage === 'English' ? 10 : 8;
  const locationScore = job.country.toLowerCase() === 'germany' ? 10 : 0;

  const score = Math.max(0, Math.min(100, skillScore + titleScore + keywordScore + languageScore + locationScore));
  const explanation = `Skills matched: ${skillHits}, titles matched: ${titleHits}, keywords matched: ${keywordHits}, language: ${job.requiredLanguage ?? 'English'}, location: ${job.country}.`;

  return { score, explanation };
}
