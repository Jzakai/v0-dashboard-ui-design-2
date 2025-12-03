'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { AdminCoursesList } from '@/components/admin-courses-list';

export default function AdminCoursesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <DashboardLayout
      userRole="admin"
      userName="Demo User"
      onLogout={() => setIsLoggedIn(false)}
      onNavigate={() => {}}
    >
      <AdminCoursesList />
    </DashboardLayout>
  );
}
