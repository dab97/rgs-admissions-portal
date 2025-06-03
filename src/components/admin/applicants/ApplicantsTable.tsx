
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Applicant } from '@/types/applicant';
import { APP_CONSTANTS } from '@/constants';

interface ApplicantsTableProps {
  applicants: Applicant[];
  onView: (applicant: Applicant) => void;
  onEdit: (applicant: Applicant) => void;
  onDelete: (id: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const ApplicantsTable = ({ 
  applicants, 
  onView, 
  onEdit, 
  onDelete, 
  sortField, 
  sortDirection, 
  onSort 
}: ApplicantsTableProps) => {
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

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => onSort(field)}
        className="h-auto p-0 font-medium hover:bg-transparent"
      >
        <div className="flex items-center gap-2">
          {children}
          {getSortIcon(field)}
        </div>
      </Button>
    </TableHead>
  );

  const getDirectionDisplayText = (applicant: Applicant) => {
    if (!applicant.preparation_directions || applicant.preparation_directions.length === 0) {
      // Fallback к старому формату
      const specs = applicant.specializations?.join(', ') || 'Не указано';
      const budgetText = applicant.budget ? 'Бюджет' : 'Платное';
      const studyFormText = APP_CONSTANTS.STUDY_FORMS.find(f => f.value === applicant.study_form)?.label || applicant.study_form;
      return `${specs} (${studyFormText}, ${budgetText})`;
    }

    return applicant.preparation_directions
      .sort((a, b) => a.priority - b.priority)
      .map((direction) => {
        const specs = applicant.specializations?.join(', ') || 'Не указано';
        const budgetText = direction.budget ? 'Бюджет' : 'Платное';
        const studyFormText = direction.studyForm ? 
          APP_CONSTANTS.STUDY_FORMS.find(f => f.value === direction.studyForm)?.label || direction.studyForm :
          'Форма не выбрана';
        
        return `#${direction.priority} ${specs} (${studyFormText}, ${budgetText})`;
      })
      .join('; ');
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader field="full_name">ФИО</SortableHeader>
            <SortableHeader field="phone">Телефон</SortableHeader>
            <TableHead>Направления подготовки</TableHead>
            <SortableHeader field="education_type">Вид образования</SortableHeader>
            <SortableHeader field="status">Статус</SortableHeader>
            <SortableHeader field="created_at">Дата подачи</SortableHeader>
            <TableHead>Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                Нет поданных заявок
              </TableCell>
            </TableRow>
          ) : (
            applicants.map((applicant) => (
              <TableRow key={applicant.id}>
                <TableCell className="font-medium">
                  {applicant.full_name}
                </TableCell>
                <TableCell>{applicant.phone}</TableCell>
                <TableCell>
                  <div className="max-w-xs text-sm">
                    {getDirectionDisplayText(applicant)}
                  </div>
                </TableCell>
                <TableCell>
                  {APP_CONSTANTS.EDUCATION_TYPES.find(t => t.value === applicant.education_type)?.label || applicant.education_type}
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicantsTable;
