import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({ content: z.string().min(1).max(1000) });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = schema.parse(body);
  await prisma.jobNote.create({ data: { jobId: params.id, content: parsed.content } });
  return Response.json({ ok: true });
}
