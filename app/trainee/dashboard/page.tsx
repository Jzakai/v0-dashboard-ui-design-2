'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import TraineeDashboard from '@/components/trainee-dashboard';

export default function TraineeDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <DashboardLayout
      userRole="trainee"
      userName="Demo User"
      onLogout={() => setIsLoggedIn(false)}
      onNavigate={() => {}}
    >
      <TraineeDashboard />
    </DashboardLayout>
  );
}
