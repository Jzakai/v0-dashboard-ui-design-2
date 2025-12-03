'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { AdminCreateCourse } from '@/components/admin-create-course';

export default function CreateCoursePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <DashboardLayout
      userRole="admin"
      userName="Demo User"
      onLogout={() => setIsLoggedIn(false)}
      onNavigate={() => {}}
    >
      <AdminCreateCourse />
    </DashboardLayout>
  );
}
