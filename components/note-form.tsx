'use client';

import { useState } from 'react';

export function NoteForm({ jobId }: { jobId: string }) {
  const [value, setValue] = useState('');

  return (
    <form
      className="mt-3 flex gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        await fetch(`/api/jobs/${jobId}/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: value })
        });
        setValue('');
        window.location.reload();
      }}
    >
      <input className="w-full rounded border px-3 py-2" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Add note" />
      <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">Save</button>
    </form>
  );
}
