
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  TrendingUp, 
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';
import { useAdminStatistics } from '@/hooks/useAdminStatistics';

const StatisticsCards = () => {
  const stats = useAdminStatistics();

  if (stats.loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="p-4 text-center text-red-600">
        {stats.error}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Общее количество поступающих */}
      <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Всего поступающих
          </CardTitle>
          <Users className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.totalApplicants}</div>
          <div className="flex items-center mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              +{stats.newToday} сегодня
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Одобренные заявки */}
      <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Одобрено
          </CardTitle>
          <UserCheck className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.approved}</div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.totalApplicants > 0 ? Math.round((stats.approved / stats.totalApplicants) * 100) : 0}% от общего числа
          </p>
        </CardContent>
      </Card>

      {/* Ожидающие рассмотрения */}
      <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            На рассмотрении
          </CardTitle>
          <FileText className="h-5 w-5 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
          <p className="text-xs text-gray-500 mt-2">
            Требуют обработки
          </p>
        </CardContent>
      </Card>

      {/* Бюджетные места */}
      <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Бюджет
          </CardTitle>
          <DollarSign className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.budget}</div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.paid} платных мест
          </p>
        </CardContent>
      </Card>

      {/* Бакалавриат */}
      <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Бакалавриат
          </CardTitle>
          <GraduationCap className="h-5 w-5 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.bachelor}</div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.master} магистратура
          </p>
        </CardContent>
      </Card>

      {/* Пол */}
      <Card className="border-l-4 border-l-pink-500 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            По полу
          </CardTitle>
          <UserCheck className="h-5 w-5 text-pink-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalApplicants > 0 ? Math.round((stats.female / stats.totalApplicants) * 100) : 0}% Ж
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.totalApplicants > 0 ? Math.round((stats.male / stats.totalApplicants) * 100) : 0}% мужчин
          </p>
        </CardContent>
      </Card>

      {/* Очная форма */}
      <Card className="border-l-4 border-l-teal-500 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Очная форма
          </CardTitle>
          <Calendar className="h-5 w-5 text-teal-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{stats.fullTime}</div>
          <p className="text-xs text-gray-500 mt-2">
            {stats.partTime} очно-заочная, {stats.distance} заочная
          </p>
        </CardContent>
      </Card>

      {/* Динамика */}
      <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Рост за месяц
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {stats.newToday > 0 ? '+' : ''}
            {stats.totalApplicants > 0 ? ((stats.newToday / stats.totalApplicants) * 100).toFixed(1) : '0'}%
          </div>
          <p className="text-xs text-gray-500 mt-2">
            За сегодня: {stats.newToday} заявок
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
