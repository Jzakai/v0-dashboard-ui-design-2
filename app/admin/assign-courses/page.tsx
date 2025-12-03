'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { AdminAssignCourses } from '@/components/admin-assign-courses';

export default function AssignCoursesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <DashboardLayout
      userRole="admin"
      userName="Demo User"
      onLogout={() => setIsLoggedIn(false)}
      onNavigate={() => {}}
    >
      <AdminAssignCourses />
    </DashboardLayout>
  );
}
