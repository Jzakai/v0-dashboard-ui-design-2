'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import TraineeDashboard from '@/components/trainee-dashboard';
import { clearStoredTraineeId } from '@/lib/trainee-session';

export default function TraineeDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <DashboardLayout
      userRole="trainee"
      userName="Demo User"
      onLogout={() => {
        clearStoredTraineeId();
        setIsLoggedIn(false);
      }}
      onNavigate={() => {}}
    >
      <TraineeDashboard />
    </DashboardLayout>
  );
}
