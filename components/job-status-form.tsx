'use client';

import { useState } from 'react';

const statuses = ['New', 'Applied', 'Interview', 'Reject', 'Accept'] as const;

export function JobStatusForm({ jobId, status }: { jobId: string; status: string }) {
  const [value, setValue] = useState(status);

  return (
    <select
      className="rounded border px-2 py-1"
      value={value}
      onChange={async (e) => {
        const next = e.target.value;
        setValue(next);
        await fetch(`/api/jobs/${jobId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: next })
        });
      }}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
