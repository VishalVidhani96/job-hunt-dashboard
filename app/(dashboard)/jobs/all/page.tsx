import Link from 'next/link';
import { JobStatusForm } from '@/components/job-status-form';
import { getAllJobs } from '@/lib/services/jobs';
import { getOrCreateDefaultUser } from '@/lib/services/user';

export default async function AllJobsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const user = await getOrCreateDefaultUser();
  const jobs = await getAllJobs(user.id, { keyword: searchParams.keyword }, (searchParams.sort as any) ?? 'newest');

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">All jobs history</h1>
      <form className="flex gap-2" method="GET">
        <input name="keyword" placeholder="Keyword" className="rounded border px-2 py-1" />
        <button className="rounded bg-slate-900 px-3 py-1 text-white">Search</button>
      </form>
      {jobs.map((job) => (
        <article key={job.id} className="rounded border bg-white p-4">
          <div className="flex items-center justify-between">
            <Link href={`/jobs/${job.id}`} className="font-semibold">{job.title} - {job.company}</Link>
            <JobStatusForm jobId={job.id} status={job.status} />
          </div>
          <p className="text-sm">Posted: {job.postedAt.toISOString().slice(0, 10)} | ATS: {job.atsScore}</p>
        </article>
      ))}
    </div>
  );
}
