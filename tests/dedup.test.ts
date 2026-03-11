import { describe, expect, it } from 'vitest';
import { buildDedupKey, buildUrlFingerprint } from '@/lib/services/dedup';

describe('dedup helpers', () => {
  it('normalizes urls', () => {
    expect(buildUrlFingerprint('https://site.com/job?id=1')).toBe('https://site.com/job');
  });

  it('builds stable dedup key', () => {
    const a = buildDedupKey({ title: 'Engineer', company: 'ACME', city: 'Berlin' });
    const b = buildDedupKey({ title: 'engineer', company: 'Acme', city: 'Berlin' });
    expect(a).toBe(b);
  });
});
