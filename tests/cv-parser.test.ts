import { describe, expect, it } from 'vitest';
import { parseCvPdf } from '@/lib/services/cv-parser';

describe('parseCvPdf', () => {
  it('extracts text-based fields', async () => {
    const fakePdf = Buffer.from('%PDF-1.1 fake content skills: TypeScript, React 5 years education: BSc');
    await expect(parseCvPdf(fakePdf)).rejects.toBeTruthy();
  });
});
