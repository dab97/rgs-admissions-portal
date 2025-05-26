
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import StatisticsCards from '@/components/admin/StatisticsCards';
import ChartsSection from '@/components/admin/ChartsSection';
import ApplicantsList from '@/components/admin/ApplicantsList';
import UsersList from '@/components/admin/UsersList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar,
  Bell
} from 'lucide-react';
import { useRecentApplicants } from '@/hooks/useRecentApplicants';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { applicants: recentApplicants, loading: applicantsLoading } = useRecentApplicants();

  const handleLogout = () => {
    navigate('/');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Только что';
    if (diffInHours === 1) return '1 час назад';
    if (diffInHours < 24) return `${diffInHours} часов назад`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 день назад';
    return `${diffInDays} дней назад`;
  };

  const getCurrentPageContent = () => {
    const path = location.pathname;

    if (path === '/admin/applicants') {
      return {
        title: 'Поступающие',
        description: 'Управление заявками абитуриентов',
        content: <ApplicantsList />
      };
    }

    if (path === '/admin/users') {
      return {
        title: 'Пользователи',
        description: 'Управление администраторами и модераторами',
        content: <UsersList />
      };
    }

    if (path.startsWith('/admin/analytics')) {
      return {
        title: 'Аналитика',
        description: 'Детальный анализ данных поступающих',
        content: <ChartsSection />
      };
    }

    if (path === '/admin/statistics') {
      return {
        title: 'Статистика',
        description: 'Общая статистика системы',
        content: <StatisticsCards />
      };
    }

    if (path === '/admin/reports') {
      return {
        title: 'Отчеты',
        description: 'Создание и экспорт отчетов',
        content: (
          <Card>
            <CardHeader>
              <CardTitle>Генерация отчетов</CardTitle>
              <CardDescription>Создание детальных отчетов по различным критериям</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Функция генерации отчетов будет добавлена в следующих обновлениях
              </div>
            </CardContent>
          </Card>
        )
      };
    }

    if (path === '/admin/settings') {
      return {
        title: 'Настройки',
        description: 'Конфигурация системы',
        content: (
          <Card>
            <CardHeader>
              <CardTitle>Настройки системы</CardTitle>
              <CardDescription>Общие настройки и конфигурация</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Раздел настроек будет добавлен в следующих обновлениях
              </div>
            </CardContent>
          </Card>
        )
      };
    }

    // Главная страница админки
    return {
      title: 'Панель управления',
      description: 'Статистика и аналитика поступающих абитуриентов',
      content: (
        <div className="space-y-6">
          {/* Уведомления */}
          <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Новые заявки требуют внимания
                  </h3>
                  <p className="text-blue-700 dark:text-blue-200 text-sm mt-1">
                    {recentApplicants.length} новых заявок поступили и ожидают рассмотрения
                  </p>
                </div>
                <Badge className="bg-blue-600 text-white">
                  Новое
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Статистические карточки */}
          <StatisticsCards />

          {/* Графики и аналитика */}
          <ChartsSection />

          {/* Быстрые действия */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/applicants')}>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                  <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Просмотр заявок</CardTitle>
                <CardDescription>
                  Управление поступающими абитуриентами
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" variant="outline">
                  Перейти к заявкам
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/analytics/specializations')}>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Аналитика</CardTitle>
                <CardDescription>
                  Детальный анализ данных
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" variant="outline">
                  Открыть аналитику
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/reports')}>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Отчеты</CardTitle>
                <CardDescription>
                  Создание и экспорт отчетов
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" variant="outline">
                  Создать отчет
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Последние заявки */}
          <Card>
            <CardHeader>
              <CardTitle>Последние заявки</CardTitle>
              <CardDescription>
                Недавно поданные заявления на поступление
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applicantsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <Skeleton className="h-5 w-48 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-6 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplicants.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Пока нет поданных заявок
                    </p>
                  ) : (
                    recentApplicants.map((applicant) => (
                      <div key={applicant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                        <div className="flex-1">
                          <h4 className="font-semibold">{applicant.full_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {applicant.specializations.length > 0 
                              ? applicant.specializations.join(', ')
                              : 'Специализация не указана'
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          >
                            На рассмотрении
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimeAgo(applicant.created_at)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    };
  };

  const currentPage = getCurrentPageContent();

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
