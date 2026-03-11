import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({ status: z.enum(['New', 'Applied', 'Interview', 'Reject', 'Accept']) });

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const parsed = schema.parse(body);

  const existing = await prisma.job.findUnique({ where: { id: params.id } });
  if (!existing) return new Response('Not found', { status: 404 });

  await prisma.$transaction([
    prisma.job.update({ where: { id: params.id }, data: { status: parsed.status } }),
    prisma.jobStatusHistory.create({
      data: { jobId: params.id, fromStatus: existing.status, toStatus: parsed.status }
    })
  ]);

  return Response.json({ ok: true });
}
