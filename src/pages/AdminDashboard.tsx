
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { usePageContent } from '@/hooks/usePageContent';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentPage = usePageContent();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1">
          <AdminHeader 
            title={currentPage.title}
            description={currentPage.description}
            onLogout={handleLogout}
          />
          
          <div className="p-6">
            {currentPage.content}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
