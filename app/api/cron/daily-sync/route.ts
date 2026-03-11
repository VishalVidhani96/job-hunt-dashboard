import { runSync } from '@/lib/sync';
import { getOrCreateDefaultUser } from '@/lib/services/user';

export async function GET(request: Request) {
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) return new Response('Unauthorized', { status: 401 });

  const user = await getOrCreateDefaultUser();
  const result = await runSync({ userId: user.id, trigger: 'cron' });
  return Response.json({ ok: true, ...result });
}
