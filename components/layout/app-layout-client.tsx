'use client';

import { Sidebar } from './sidebar';
import { TopBar } from './topbar';

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:ml-64">
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
