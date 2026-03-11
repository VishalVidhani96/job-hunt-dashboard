import { notFound } from 'next/navigation';
import { NoteForm } from '@/components/note-form';
import { JobStatusForm } from '@/components/job-status-form';
import { prisma } from '@/lib/prisma';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({ where: { id: params.id }, include: { notes: true, source: true } });
  if (!job) return notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p>{job.company} • {job.city ?? 'Germany'} • {job.country}</p>
      <p>ATS {job.atsScore}/100 - {job.atsExplanation}</p>
      <p>Status: <JobStatusForm jobId={job.id} status={job.status} /></p>
      <a className="text-blue-700" href={job.url} target="_blank">Open original post</a>
      <section className="rounded border bg-white p-4">
        <h2 className="font-semibold">Description</h2>
        <p className="whitespace-pre-wrap text-sm">{job.description}</p>
      </section>
      <section className="rounded border bg-white p-4">
        <h2 className="font-semibold">Notes</h2>
        {job.notes.map((note) => <p key={note.id} className="text-sm">• {note.content}</p>)}
        <NoteForm jobId={job.id} />
      </section>
    </div>
  );
}
