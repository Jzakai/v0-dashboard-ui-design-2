'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { TraineeMyTrainings } from '@/components/trainee-my-trainings';
import { clearStoredTraineeId } from '@/lib/trainee-session';

export default function MyTrainingsPage() {
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
      <TraineeMyTrainings />
    </DashboardLayout>
  );
}
