import crypto from 'node:crypto';

export function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

export function buildDedupKey(input: { title: string; company: string; city?: string | null }): string {
  const payload = `${normalizeText(input.title)}|${normalizeText(input.company)}|${normalizeText(input.city ?? '')}`;
  return crypto.createHash('sha1').update(payload).digest('hex');
}

export function buildUrlFingerprint(url: string): string {
  return url.split('?')[0].replace(/\/$/, '').toLowerCase();
}
