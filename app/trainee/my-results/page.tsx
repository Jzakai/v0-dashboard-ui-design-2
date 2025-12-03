'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { TraineeMyResults } from '@/components/trainee-my-results';

export default function MyResultsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <DashboardLayout
      userRole="trainee"
      userName="Demo User"
      onLogout={() => setIsLoggedIn(false)}
      onNavigate={() => {}}
    >
      <TraineeMyResults />
    </DashboardLayout>
  );
}
