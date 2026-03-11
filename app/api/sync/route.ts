import { runSync } from '@/lib/sync';
import { getOrCreateDefaultUser } from '@/lib/services/user';

export async function POST() {
  const user = await getOrCreateDefaultUser();
  const result = await runSync({ userId: user.id, trigger: 'manual' });
  return Response.json({ ok: true, ...result });
}
