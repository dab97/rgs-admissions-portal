
import React, { useState } from 'react';
import ApplicantForm from '@/components/ApplicantForm';
import LoginForm from '@/components/LoginForm';
import AdminDashboard from '@/pages/AdminDashboard';
import { Button } from '@/components/ui/button';
import { Shield, Users, GraduationCap } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'form' | 'login' | 'admin'>('form');
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleLogin = (role: string) => {
    setUserRole(role);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView('form');
  };

  if (currentView === 'admin' && userRole) {
    return <AdminDashboard />;
  }

  if (currentView === 'login') {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="relative">
      {/* Навигационная панель */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          className="bg-white/90 backdrop-blur-sm border-blue-200 hover:bg-blue-50"
          onClick={() => setCurrentView('form')}
        >
          <Users className="h-4 w-4 mr-2" />
          Подача заявки
        </Button>
        <Button
          variant="outline"
          className="bg-white/90 backdrop-blur-sm border-blue-200 hover:bg-blue-50"
          onClick={() => setCurrentView('login')}
        >
          <Shield className="h-4 w-4 mr-2" />
          Админ панель
        </Button>
      </div>

      {/* Основная форма */}
      <ApplicantForm />
    </div>
  );
};

export default Index;
