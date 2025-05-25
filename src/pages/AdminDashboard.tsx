
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import StatisticsCards from '@/components/admin/StatisticsCards';
import ChartsSection from '@/components/admin/ChartsSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Download, 
  Users, 
  TrendingUp,
  Calendar,
  Bell
} from 'lucide-react';

const AdminDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar />
        <main className="flex-1">
          {/* Header */}
          <div className="border-b bg-white px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  Панель управления
                </h1>
                <p className="text-gray-600">
                  Статистика и аналитика поступающих абитуриентов
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Экспорт
                </Button>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <BarChart3 className="h-4 w-4" />
                  Отчет
                </Button>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Уведомления */}
            <Card className="border-l-4 border-l-blue-500 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900">
                      Новые заявки требуют внимания
                    </h3>
                    <p className="text-blue-700 text-sm mt-1">
                      23 новые заявки поступили сегодня и ожидают рассмотрения
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
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-blue-600" />
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

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
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

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Calendar className="h-6 w-6 text-purple-600" />
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
                <div className="space-y-4">
                  {[
                    { name: 'Иванова Анна Сергеевна', specialization: 'Психология', time: '2 часа назад', status: 'pending' },
                    { name: 'Петров Максим Александрович', specialization: 'Юриспруденция', time: '3 часа назад', status: 'approved' },
                    { name: 'Сидорова Елена Викторовна', specialization: 'Экономика', time: '5 часов назад', status: 'pending' },
                    { name: 'Козлов Дмитрий Иванович', specialization: 'ИТ', time: '6 часов назад', status: 'approved' },
                  ].map((applicant, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{applicant.name}</h4>
                        <p className="text-sm text-gray-500">{applicant.specialization}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={applicant.status === 'approved' ? 'default' : 'secondary'}
                          className={applicant.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                        >
                          {applicant.status === 'approved' ? 'Одобрено' : 'На рассмотрении'}
                        </Badge>
                        <p className="text-xs text-gray-400 mt-1">{applicant.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
