import { shouldSync, runSync } from '@/lib/sync';
import { getOrCreateDefaultUser } from '@/lib/services/user';

export async function POST() {
  const user = await getOrCreateDefaultUser();
  const canSync = await shouldSync(user.id);
  if (!canSync) return Response.json({ ok: true, skipped: true });

  const result = await runSync({ userId: user.id, trigger: 'open' });
  return Response.json({ ok: true, ...result });
}
