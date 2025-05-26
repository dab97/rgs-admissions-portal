
import React, { useState } from 'react';
import { useApplicants, Applicant } from '@/hooks/useApplicants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Eye } from 'lucide-react';
import { APP_CONSTANTS } from '@/constants';

const ApplicantsList = () => {
  const { applicants, loading, updateApplicant, deleteApplicant } = useApplicants();
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

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

  const handleEdit = (applicant: Applicant) => {
    setEditingApplicant(applicant);
    setIsEditDialogOpen(true);
  };

  const handleView = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsViewDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingApplicant) return;

    await updateApplicant(editingApplicant.id, {
      status: editingApplicant.status,
      admin_notes: editingApplicant.admin_notes,
      full_name: editingApplicant.full_name,
      phone: editingApplicant.phone,
      email: editingApplicant.email,
    });

    setIsEditDialogOpen(false);
    setEditingApplicant(null);
  };

  const handleDelete = async (id: string) => {
    await deleteApplicant(id);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Список поступающих</CardTitle>
          <CardDescription>Загрузка...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Список поступающих</CardTitle>
          <CardDescription>
            Управление заявками поступающих абитуриентов
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ФИО</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Специализации</TableHead>
                  <TableHead>Форма обучения</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата подачи</TableHead>
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
                        <div className="max-w-xs truncate">
                          {applicant.specializations.join(', ') || 'Не указано'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {APP_CONSTANTS.STUDY_FORMS.find(f => f.value === applicant.study_form)?.label || applicant.study_form}
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
                            onClick={() => handleView(applicant)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(applicant)}
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
                                  onClick={() => handleDelete(applicant.id)}
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
        </CardContent>
      </Card>

      {/* Диалог просмотра */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали заявки</DialogTitle>
          </DialogHeader>
          {selectedApplicant && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ФИО</Label>
                  <div className="mt-1 text-sm">{selectedApplicant.full_name}</div>
                </div>
                <div>
                  <Label>Телефон</Label>
                  <div className="mt-1 text-sm">{selectedApplicant.phone}</div>
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="mt-1 text-sm">{selectedApplicant.email || 'Не указан'}</div>
                </div>
                <div>
                  <Label>Пол</Label>
                  <div className="mt-1 text-sm">
                    {selectedApplicant.gender ? 
                      APP_CONSTANTS.GENDERS.find(g => g.value === selectedApplicant.gender)?.label || selectedApplicant.gender 
                      : 'Не указан'
                    }
                  </div>
                </div>
              </div>
              <div>
                <Label>Специализации</Label>
                <div className="mt-1 text-sm">{selectedApplicant.specializations.join(', ') || 'Не указано'}</div>
              </div>
              <div>
                <Label>Статус</Label>
                <div className="mt-1">{getStatusBadge(selectedApplicant.status)}</div>
              </div>
              {selectedApplicant.admin_notes && (
                <div>
                  <Label>Заметки администратора</Label>
                  <div className="mt-1 text-sm bg-gray-50 p-2 rounded">{selectedApplicant.admin_notes}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редактировать заявку</DialogTitle>
          </DialogHeader>
          {editingApplicant && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">ФИО</Label>
                  <Input
                    id="full_name"
                    value={editingApplicant.full_name}
                    onChange={(e) => setEditingApplicant({
                      ...editingApplicant,
                      full_name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={editingApplicant.phone}
                    onChange={(e) => setEditingApplicant({
                      ...editingApplicant,
                      phone: e.target.value
                    })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingApplicant.email || ''}
                  onChange={(e) => setEditingApplicant({
                    ...editingApplicant,
                    email: e.target.value
                  })}
                />
              </div>
              <div>
                <Label htmlFor="status">Статус</Label>
                <Select
                  value={editingApplicant.status || 'pending'}
                  onValueChange={(value) => setEditingApplicant({
                    ...editingApplicant,
                    status: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Ожидает</SelectItem>
                    <SelectItem value="under_review">На рассмотрении</SelectItem>
                    <SelectItem value="approved">Одобрено</SelectItem>
                    <SelectItem value="rejected">Отклонено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="admin_notes">Заметки администратора</Label>
                <Textarea
                  id="admin_notes"
                  value={editingApplicant.admin_notes || ''}
                  onChange={(e) => setEditingApplicant({
                    ...editingApplicant,
                    admin_notes: e.target.value
                  })}
                  placeholder="Добавьте заметки..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleSave}>
                  Сохранить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantsList;
