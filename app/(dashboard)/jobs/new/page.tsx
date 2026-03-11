import Link from 'next/link';
import { RefreshOnOpen } from '@/components/refresh-on-open';
import { JobStatusForm } from '@/components/job-status-form';
import { getNewJobs } from '@/lib/services/jobs';
import { getOrCreateDefaultUser } from '@/lib/services/user';

export default async function NewJobsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const user = await getOrCreateDefaultUser();
  const jobs = await getNewJobs(
    user.id,
    {
      city: searchParams.city,
      keyword: searchParams.keyword,
      status: searchParams.status as any,
      language: searchParams.language as any,
      minScore: searchParams.minScore ? Number(searchParams.minScore) : undefined
    },
    (searchParams.sort as any) ?? 'newest'
  );

  return (
    <div className="space-y-4">
      <RefreshOnOpen />
      <h1 className="text-2xl font-bold">New jobs in last 24 hours</h1>
      <form className="grid grid-cols-2 gap-2 rounded border bg-white p-3 md:grid-cols-6" method="GET">
        <input name="keyword" placeholder="Keyword" className="rounded border px-2 py-1" />
        <input name="city" placeholder="City" className="rounded border px-2 py-1" />
        <input name="minScore" type="number" placeholder="Min ATS" className="rounded border px-2 py-1" />
        <select name="language" className="rounded border px-2 py-1"><option value="">Language</option><option>English</option><option>German</option></select>
        <select name="status" className="rounded border px-2 py-1"><option value="">Status</option><option>New</option><option>Applied</option><option>Interview</option><option>Reject</option><option>Accept</option></select>
        <select name="sort" className="rounded border px-2 py-1"><option value="newest">Newest</option><option value="score">Highest ATS</option><option value="company">Company</option></select>
        <button className="col-span-2 rounded bg-slate-900 px-3 py-2 text-white md:col-span-1" type="submit">Apply</button>
      </form>
      <div className="space-y-2">
        {jobs.map((job) => (
          <article key={job.id} className="rounded border bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <Link className="text-lg font-semibold" href={`/jobs/${job.id}`}>{job.title}</Link>
                <p className="text-sm text-slate-600">{job.company} • {job.city ?? 'Germany'} • {job.country}</p>
                <p className="text-sm">ATS: {job.atsScore} • {job.requiredLanguage ?? 'English'} • {job.isNewToday ? 'New today' : 'Seen before'}</p>
              </div>
              <JobStatusForm jobId={job.id} status={job.status} />
            </div>
            <a className="mt-2 inline-block text-sm text-blue-700" href={job.url} target="_blank">Apply link</a>
          </article>
        ))}
      </div>
    </div>
  );
}
