
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useChartsData } from '@/hooks/useChartsData';

const ChartsSection = () => {
  const { 
    specializationData, 
    monthlyData, 
    budgetData, 
    studyFormData, 
    educationTypeData,
    detailedStats,
    loading, 
    error 
  } = useChartsData();

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
    <div className="space-y-6">
      {/* Детальная аналитика по специализациям */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Детальная аналитика по специализациям</CardTitle>
          <CardDescription>
            Подробная статистика по каждой специализации
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="budget" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="budget">По бюджету</TabsTrigger>
              <TabsTrigger value="studyForm">По форме обучения</TabsTrigger>
              <TabsTrigger value="educationType">По виду образования</TabsTrigger>
              <TabsTrigger value="total">Общее количество</TabsTrigger>
            </TabsList>
            
            <TabsContent value="budget">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={specializationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="budget" fill="#10b981" name="Бюджет" />
                  <Bar dataKey="paid" fill="#f59e0b" name="Платно" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="studyForm">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={specializationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="fullTime" fill="#3b82f6" name="Очная" />
                  <Bar dataKey="partTime" fill="#8b5cf6" name="Очно-заочная" />
                  <Bar dataKey="distance" fill="#06b6d4" name="Заочная" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="educationType">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Бакалавриат vs Магистратура</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={educationTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {educationTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Детализация по специализациям</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {Object.entries(detailedStats.bySpecialization).map(([spec, stats]) => (
                        <div key={spec} className="border-b pb-2">
                          <div className="font-medium">{spec}</div>
                          <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                            <span>Бакалавриат: {stats.bachelor}</span>
                            <span>Магистратура: {stats.master}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="total">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={specializationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#3b82f6" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
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

        {/* Детальная таблица статистики */}
        <Card>
          <CardHeader>
            <CardTitle>Детальная статистика</CardTitle>
            <CardDescription>
              Подробная информация по специализациям
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {Object.entries(detailedStats.bySpecialization).map(([spec, stats]) => (
                <div key={spec} className="border rounded p-3 space-y-2">
                  <div className="font-medium text-sm">{spec}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Всего: <span className="font-medium">{stats.total}</span></div>
                    <div>Бюджет: <span className="font-medium text-green-600">{stats.budget}</span></div>
                    <div>Платно: <span className="font-medium text-orange-600">{stats.paid}</span></div>
                    <div>Очная: <span className="font-medium text-blue-600">{stats.fullTime}</span></div>
                    <div>Очно-заочная: <span className="font-medium text-purple-600">{stats.partTime}</span></div>
                    <div>Заочная: <span className="font-medium text-cyan-600">{stats.distance}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChartsSection;
