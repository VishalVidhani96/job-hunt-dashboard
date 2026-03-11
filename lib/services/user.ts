import { prisma } from '@/lib/prisma';

export async function getOrCreateDefaultUser() {
  const email = process.env.APP_USER_EMAIL ?? 'owner@example.com';
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email }
  });
}
