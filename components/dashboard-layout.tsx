'use client';

import { ReactNode } from 'react';
import { Sidebar } from './sidebar';
import { TopNavbar } from './top-navbar';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'trainee';
  userName: string;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function DashboardLayout({
  children,
  userRole,
  userName,
  onLogout,
  onNavigate,
}: DashboardLayoutProps) {
  return (
    <div className="flex">
      <Sidebar userRole={userRole} onLogout={onLogout} onNavigate={onNavigate} />
      <div className="flex-1 ml-64 bg-card">
        <TopNavbar userRole={userRole} userName={userName} />
        <main className="mt-16 p-8 bg-background min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
