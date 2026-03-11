import { prisma } from '@/lib/prisma';
import { getOrCreateDefaultUser } from '@/lib/services/user';

export default async function ProfilePage() {
  const user = await getOrCreateDefaultUser();
  const profile = await prisma.candidateProfile.findFirst({ where: { userId: user.id }, orderBy: { updatedAt: 'desc' } });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">CV Profile</h1>
      <form action="/api/profile/upload" method="POST" encType="multipart/form-data" className="rounded border bg-white p-4">
        <label className="mb-2 block text-sm">Upload CV PDF</label>
        <input name="cv" type="file" accept="application/pdf" required className="mb-2" />
        <button type="submit" className="rounded bg-slate-900 px-3 py-2 text-white">Parse and Save</button>
      </form>
      {profile ? (
        <form action="/api/profile/upload" method="POST" className="space-y-2 rounded border bg-white p-4">
          <h2 className="font-semibold">Manual edit</h2>
          <input type="hidden" name="manual" value="true" />
          <textarea name="summary" defaultValue={profile.summary ?? ''} className="h-20 w-full rounded border p-2" />
          <input name="skills" defaultValue={profile.skills.join(', ')} className="w-full rounded border p-2" />
          <input name="technologies" defaultValue={profile.technologies.join(', ')} className="w-full rounded border p-2" />
          <input name="jobTitles" defaultValue={profile.jobTitles.join(', ')} className="w-full rounded border p-2" />
          <input name="education" defaultValue={profile.education.join(', ')} className="w-full rounded border p-2" />
          <input name="keywords" defaultValue={profile.keywords.join(', ')} className="w-full rounded border p-2" />
          <input name="yearsExperience" type="number" defaultValue={profile.yearsExperience} className="w-full rounded border p-2" />
          <button className="rounded bg-slate-900 px-3 py-2 text-white">Save profile edits</button>
        </form>
      ) : <p>No profile yet.</p>}
    </div>
  );
}
