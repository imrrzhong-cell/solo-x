import { Suspense } from 'react';
import CommandPanel from './command-panel';

export default function CommandPage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--char3)', fontSize: '.82rem', padding: '2rem' }}>加载中...</div>}>
      <CommandPanel />
    </Suspense>
  );
}
