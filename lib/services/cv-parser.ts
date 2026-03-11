import pdf from 'pdf-parse';

export type ParsedProfile = {
  summary: string;
  skills: string[];
  technologies: string[];
  jobTitles: string[];
  yearsExperience: number;
  education: string[];
  keywords: string[];
  rawText: string;
};

const techDictionary = ['typescript', 'javascript', 'react', 'next.js', 'node.js', 'postgresql', 'prisma', 'docker'];

export async function parseCvPdf(buffer: Buffer): Promise<ParsedProfile> {
  const result = await pdf(buffer);
  const text = result.text.replace(/\s+/g, ' ').trim();
  const lower = text.toLowerCase();

  const technologies = techDictionary.filter((tech) => lower.includes(tech));
  const yearsMatch = lower.match(/(\d{1,2})\+?\s+years?/);
  const yearsExperience = yearsMatch ? Number(yearsMatch[1]) : 0;
  const skills = extractKeywordList(text, ['skills', 'core competencies']);
  const jobTitles = extractKeywordList(text, ['experience', 'roles']);
  const education = extractKeywordList(text, ['education']);
  const keywords = Array.from(new Set([...skills, ...technologies, ...jobTitles])).slice(0, 30);

  return {
    summary: text.slice(0, 500),
    skills,
    technologies,
    jobTitles,
    yearsExperience,
    education,
    keywords,
    rawText: text
  };
}

function extractKeywordList(text: string, headings: string[]): string[] {
  const sentences = text.split(/[.;\n]/).map((v) => v.trim()).filter(Boolean);
  return sentences
    .filter((line) => headings.some((heading) => line.toLowerCase().includes(heading)))
    .flatMap((line) => line.split(/[:,|-]/).slice(1).join(' ').split(','))
    .map((item) => item.trim())
    .filter((item) => item.length > 2)
    .slice(0, 20);
}
