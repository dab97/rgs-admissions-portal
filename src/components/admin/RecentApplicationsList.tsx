
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentApplicants } from '@/hooks/useRecentApplicants';

const RecentApplicationsList = () => {
  const { applicants: recentApplicants, loading: applicantsLoading } = useRecentApplicants();

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

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Одобрено
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
            Отклонено
          </Badge>
        );
      case 'under_review':
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            На рассмотрении
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
            Ожидает
          </Badge>
        );
    }
  };

  return (
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
                      {applicant.specializations && applicant.specializations.length > 0 
                        ? applicant.specializations.join(', ')
                        : 'Специализация не указана'
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(applicant.status)}
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
  );
};

export default RecentApplicationsList;
