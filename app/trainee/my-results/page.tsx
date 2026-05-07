'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { TraineeMyResults } from '@/components/trainee-my-results';
import { clearStoredTraineeId } from '@/lib/trainee-session';

export default function MyResultsPage() {
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
      <TraineeMyResults />
    </DashboardLayout>
  );
}
