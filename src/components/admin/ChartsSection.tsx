
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useChartsData } from '@/hooks/useChartsData';

const ChartsSection = () => {
  const { specializationData, monthlyData, budgetData, studyFormData, loading, error } = useChartsData();

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className={index === 0 ? "col-span-2" : ""}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Распределение по направлениям */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Поступления по направлениям подготовки
          </CardTitle>
          <CardDescription>
            Количество поступающих по каждому направлению
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={specializationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Динамика подач заявлений */}
      <Card>
        <CardHeader>
          <CardTitle>Динамика подач заявлений</CardTitle>
          <CardDescription>
            Подачи и одобрения по месяцам
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="applications" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Подано заявлений"
              />
              <Line 
                type="monotone" 
                dataKey="approved" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Одобрено"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Распределение бюджет/платно */}
      <Card>
        <CardHeader>
          <CardTitle>Бюджет vs Платное обучение</CardTitle>
          <CardDescription>
            Соотношение бюджетных и платных мест
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Формы обучения */}
      <Card>
        <CardHeader>
          <CardTitle>Формы обучения</CardTitle>
          <CardDescription>
            Распределение по формам обучения
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={studyFormData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {studyFormData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Дополнительная статистика */}
      <Card>
        <CardHeader>
          <CardTitle>Дополнительная статистика</CardTitle>
          <CardDescription>
            Ключевые показатели
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Совершеннолетние</span>
            <span className="font-semibold">89.2%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Граждане Беларуси</span>
            <span className="font-semibold">94.7%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">С инвалидностью</span>
            <span className="font-semibold">3.1%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">1 поток</span>
            <span className="font-semibold">67.3%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">2 поток</span>
            <span className="font-semibold">32.7%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
