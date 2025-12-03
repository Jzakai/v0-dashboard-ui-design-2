'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { LoginModal } from '@/components/login-modal';
import AdminDashboard from '@/components/admin-dashboard';
import TraineeDashboard from '@/components/trainee-dashboard';
import { AdminCoursesList } from '@/components/admin-courses-list';
import { AdminCreateCourse } from '@/components/admin-create-course';
import { AdminAssignCourses } from '@/components/admin-assign-courses';
import { AdminAARAnalytics } from '@/components/admin-aar-analytics';
import { ScenarioVisualization } from '@/components/scenario-visualization';
import { TraineeMyTrainings } from '@/components/trainee-my-trainings';
import { TraineeMyResults } from '@/components/trainee-my-results';

type PageType =
  | 'courses'
  | 'create-course'
  | 'scenario-visualization'
  | 'assign-courses'
  | 'analytics'
  | 'my-trainings'
  | 'my-results';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'trainee'>('admin');
  const [userName, setUserName] = useState('Demo User');
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const handleLogin = (role: 'admin' | 'trainee', name: string) => {
    setUserRole(role);
    setUserName(name);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: PageType) => {
    console.log('[v0] Navigating to:', page);
    setCurrentPage(page);
  };

  if (!isLoggedIn) {
    return <LoginModal onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return userRole === 'admin' ? <AdminDashboard /> : <TraineeDashboard />;
      case 'courses':
        return <AdminCoursesList />;
      case 'create-course':
        return <AdminCreateCourse onPublish={() => handleNavigate('scenario-visualization')} />;
      case 'scenario-visualization':
        return (
          <ScenarioVisualization
            onAssignCourse={() => handleNavigate('assign-courses')}
            onBackToCourse={() => handleNavigate('create-course')}
          />
        );
      case 'assign-courses':
        return <AdminAssignCourses />;
      case 'analytics':
        return <AdminAARAnalytics />;
      case 'my-trainings':
        return <TraineeMyTrainings />;
      case 'my-results':
        return <TraineeMyResults />;
      default:
        return userRole === 'admin' ? <AdminDashboard /> : <TraineeDashboard />;
    }
  };

  return (
    <DashboardLayout
      userRole={userRole}
      userName={userName}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
