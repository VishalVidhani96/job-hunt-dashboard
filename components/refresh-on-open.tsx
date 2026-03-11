'use client';

import { useEffect } from 'react';

export function RefreshOnOpen() {
  useEffect(() => {
    void fetch('/api/sync/trigger', { method: 'POST' });
  }, []);

  return null;
}
