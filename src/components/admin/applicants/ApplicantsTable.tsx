
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Applicant } from '@/hooks/useApplicants';
import { APP_CONSTANTS } from '@/constants';

interface ApplicantsTableProps {
  applicants: Applicant[];
  onView: (applicant: Applicant) => void;
  onEdit: (applicant: Applicant) => void;
  onDelete: (id: string) => void;
}

const ApplicantsTable = ({ applicants, onView, onEdit, onDelete }: ApplicantsTableProps) => {
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Одобрено</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Отклонено</Badge>;
      case 'under_review':
        return <Badge className="bg-blue-100 text-blue-700">На рассмотрении</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700">Ожидает</Badge>;
    }
  };

  const getBudgetBadge = (budget: boolean) => {
    return budget ? 
      <Badge className="bg-blue-100 text-blue-700">Бюджет</Badge> : 
      <Badge className="bg-gray-100 text-gray-700">Платно</Badge>;
  };

  if (applicants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Нет поданных заявок
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ФИО</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Специализации</TableHead>
            <TableHead>Форма обучения</TableHead>
            <TableHead>Вид обучения</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Дата подачи</TableHead>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map((applicant) => (
            <TableRow key={applicant.id}>
              <TableCell className="font-medium">
                {applicant.full_name}
              </TableCell>
              <TableCell>{applicant.phone}</TableCell>
              <TableCell>
                <div className="max-w-xs truncate">
                  {applicant.specializations?.join(', ') || 'Не указано'}
                </div>
              </TableCell>
              <TableCell>
                {APP_CONSTANTS.STUDY_FORMS.find(f => f.value === applicant.study_form)?.label || applicant.study_form}
              </TableCell>
              <TableCell>
                {getBudgetBadge(applicant.budget)}
              </TableCell>
              <TableCell>
                {getStatusBadge(applicant.status)}
              </TableCell>
              <TableCell>
                {new Date(applicant.created_at).toLocaleDateString('ru-RU')}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(applicant)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(applicant)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Удалить заявку?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Это действие нельзя отменить. Заявка будет удалена навсегда.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDelete(applicant.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
