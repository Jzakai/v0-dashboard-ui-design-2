'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import AdminDashboard from '@/components/admin-dashboard';

export default function AdminDashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <DashboardLayout
      userRole="admin"
      userName="Demo User"
      onLogout={() => setIsLoggedIn(false)}
    >
      <AdminDashboard />
    </DashboardLayout>
  );
}
