
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar } from 'lucide-react';
import StatisticsCards from './StatisticsCards';
import ChartsSection from './ChartsSection';
import RecentApplicationsList from './RecentApplicationsList';

const DashboardOverview = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Notification Card */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Новые заявки требуют внимания
              </h3>
              <p className="text-blue-700 dark:text-blue-200 text-sm mt-1">
                Новые заявки поступили и ожидают рассмотрения
              </p>
            </div>
            <Badge className="bg-blue-600 text-white">
              Новое
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <StatisticsCards />

      {/* Charts Section */}
      <ChartsSection />

      {/* Quick Actions */}
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

      {/* Recent Applications */}
      <RecentApplicationsList />
    </div>
  );
};

export default DashboardOverview;
