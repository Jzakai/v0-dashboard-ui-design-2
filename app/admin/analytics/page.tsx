'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { AdminAARAnalytics } from '@/components/admin-aar-analytics';

export default function AnalyticsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <DashboardLayout
      userRole="admin"
      userName="Demo User"
      onLogout={() => setIsLoggedIn(false)}
      onNavigate={() => {}}
    >
      <AdminAARAnalytics />
    </DashboardLayout>
  );
}
