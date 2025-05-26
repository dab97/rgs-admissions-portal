
import React, { useState } from 'react';
import { useApplicants, Applicant } from '@/hooks/useApplicants';
import { useApplicantData } from '@/hooks/useApplicantData';
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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Eye } from 'lucide-react';
import { APP_CONSTANTS } from '@/constants';

const ApplicantsList = () => {
  const { applicants, loading, updateApplicant, deleteApplicant } = useApplicants();
  const { responsiblePersons, specializations } = useApplicantData();
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

  const getEducationDocumentLabel = (value: string | null) => {
    const doc = APP_CONSTANTS.EDUCATION_DOCUMENTS.find(d => d.value === value);
    return doc ? doc.label : value || 'Не указан';
  };

  const getHowDidYouKnowLabel = (value: string | null) => {
    const option = APP_CONSTANTS.HOW_DID_YOU_KNOW_OPTIONS.find(o => o.value === value);
    return option ? option.label : value || 'Не указано';
  };

  const handleEdit = (applicant: Applicant) => {
    setEditingApplicant({
      ...applicant,
      specialization_ids: applicant.specializations || []
    });
    setIsEditDialogOpen(true);
  };

  const handleView = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsViewDialogOpen(true);
  };

  const handleSpecializationChange = (specializationId: string, checked: boolean) => {
    if (!editingApplicant) return;
    
    const currentIds = Array.isArray(editingApplicant.specialization_ids) 
      ? editingApplicant.specialization_ids 
      : [];
    
    setEditingApplicant({
      ...editingApplicant,
      specialization_ids: checked 
        ? [...currentIds, specializationId]
        : currentIds.filter(id => id !== specializationId)
    });
  };

  const handleSave = async () => {
    if (!editingApplicant) return;

    await updateApplicant(editingApplicant.id, {
      status: editingApplicant.status,
      admin_notes: editingApplicant.admin_notes,
      full_name: editingApplicant.full_name,
      phone: editingApplicant.phone,
      email: editingApplicant.email,
      responsible_id: editingApplicant.responsible_id,
      study_form: editingApplicant.study_form,
      education_type: editingApplicant.education_type,
      budget: editingApplicant.budget,
      stream: editingApplicant.stream,
      gender: editingApplicant.gender,
      citizenship: editingApplicant.citizenship,
      is_adult: editingApplicant.is_adult,
      disability: editingApplicant.disability,
      education_document: editingApplicant.education_document,
      contact_person_name: editingApplicant.contact_person_name,
      contact_person_phone: editingApplicant.contact_person_phone,
      how_did_you_know: editingApplicant.how_did_you_know,
      specialization_ids: editingApplicant.specialization_ids
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
                          {applicant.specializations?.join(', ') || 'Не указано'}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Детали заявки</DialogTitle>
          </DialogHeader>
          {selectedApplicant && (
            <div className="grid gap-6">
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
                <div>
                  <Label>Гражданство</Label>
                  <div className="mt-1 text-sm">{selectedApplicant.citizenship || 'Не указано'}</div>
                </div>
                <div>
                  <Label>Форма обучения</Label>
                  <div className="mt-1 text-sm">
                    {APP_CONSTANTS.STUDY_FORMS.find(f => f.value === selectedApplicant.study_form)?.label || selectedApplicant.study_form}
                  </div>
                </div>
                <div>
                  <Label>Вид образования</Label>
                  <div className="mt-1 text-sm">
                    {APP_CONSTANTS.EDUCATION_TYPES.find(t => t.value === selectedApplicant.education_type)?.label || selectedApplicant.education_type}
                  </div>
                </div>
                <div>
                  <Label>Бюджет</Label>
                  <div className="mt-1 text-sm">{selectedApplicant.budget ? 'Да' : 'Нет'}</div>
                </div>
                <div>
                  <Label>Поток</Label>
                  <div className="mt-1 text-sm">{selectedApplicant.stream || 'Не указан'}</div>
                </div>
                <div>
                  <Label>Совершеннолетний</Label>
                  <div className="mt-1 text-sm">
                    {selectedApplicant.is_adult !== null ? (selectedApplicant.is_adult ? 'Да' : 'Нет') : 'Не указано'}
                  </div>
                </div>
                <div>
                  <Label>Инвалидность</Label>
                  <div className="mt-1 text-sm">
                    {selectedApplicant.disability !== null ? (selectedApplicant.disability ? 'Да' : 'Нет') : 'Не указано'}
                  </div>
                </div>
                <div>
                  <Label>Документ об образовании</Label>
                  <div className="mt-1 text-sm">{getEducationDocumentLabel(selectedApplicant.education_document)}</div>
                </div>
              </div>
              
              <div>
                <Label>Специализации</Label>
                <div className="mt-1 text-sm">{selectedApplicant.specializations?.join(', ') || 'Не указано'}</div>
              </div>

              {(selectedApplicant.contact_person_name || selectedApplicant.contact_person_phone) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Контактное лицо</Label>
                    <div className="mt-1 text-sm">{selectedApplicant.contact_person_name || 'Не указано'}</div>
                  </div>
                  <div>
                    <Label>Телефон контактного лица</Label>
                    <div className="mt-1 text-sm">{selectedApplicant.contact_person_phone || 'Не указан'}</div>
                  </div>
                </div>
              )}

              <div>
                <Label>Откуда узнали о нас</Label>
                <div className="mt-1 text-sm">{getHowDidYouKnowLabel(selectedApplicant.how_did_you_know)}</div>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать заявку</DialogTitle>
          </DialogHeader>
          {editingApplicant && (
            <div className="grid gap-6">
              {/* Основная информация */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_full_name">ФИО</Label>
                  <Input
                    id="edit_full_name"
                    value={editingApplicant.full_name}
                    onChange={(e) => setEditingApplicant({
                      ...editingApplicant,
                      full_name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_phone">Телефон</Label>
                  <Input
                    id="edit_phone"
                    value={editingApplicant.phone}
                    onChange={(e) => setEditingApplicant({
                      ...editingApplicant,
                      phone: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_email">Email</Label>
                  <Input
                    id="edit_email"
                    type="email"
                    value={editingApplicant.email || ''}
                    onChange={(e) => setEditingApplicant({
                      ...editingApplicant,
                      email: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_citizenship">Гражданство</Label>
                  <Input
                    id="edit_citizenship"
                    value={editingApplicant.citizenship || ''}
                    onChange={(e) => setEditingApplicant({
                      ...editingApplicant,
                      citizenship: e.target.value
                    })}
                  />
                </div>
              </div>

              {/* Ответственный */}
              <div>
                <Label htmlFor="edit_responsible">Ответственный</Label>
                <Select
                  value={editingApplicant.responsible_id}
                  onValueChange={(value) => setEditingApplicant({
                    ...editingApplicant,
                    responsible_id: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {responsiblePersons.map((person) => (
                      <SelectItem key={person.id} value={person.id}>
                        {person.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Специализации */}
              <div>
                <Label>Специализации</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {specializations.map((spec) => (
                    <div key={spec.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit_spec_${spec.id}`}
                        checked={Array.isArray(editingApplicant.specialization_ids) && editingApplicant.specialization_ids.includes(spec.id)}
                        onCheckedChange={(checked) => handleSpecializationChange(spec.id, checked as boolean)}
                      />
                      <Label htmlFor={`edit_spec_${spec.id}`} className="text-sm">
                        {spec.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Форма обучения и образование */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Форма обучения</Label>
                  <Select
                    value={editingApplicant.study_form}
                    onValueChange={(value) => setEditingApplicant({
                      ...editingApplicant,
                      study_form: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {APP_CONSTANTS.STUDY_FORMS.map((form) => (
                        <SelectItem key={form.value} value={form.value}>
                          {form.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Вид образования</Label>
                  <Select
                    value={editingApplicant.education_type}
                    onValueChange={(value) => setEditingApplicant({
                      ...editingApplicant,
                      education_type: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {APP_CONSTANTS.EDUCATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Дополнительные поля */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Бюджет</Label>
                  <RadioGroup 
                    value={editingApplicant.budget.toString()}
                    onValueChange={(value) => setEditingApplicant({
                      ...editingApplicant,
                      budget: value === 'true'
                    })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="edit_budget_yes" />
                      <Label htmlFor="edit_budget_yes">Да</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="edit_budget_no" />
                      <Label htmlFor="edit_budget_no">Нет</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label>Пол</Label>
                  <Select
                    value={editingApplicant.gender || ''}
                    onValueChange={(value) => setEditingApplicant({
                      ...editingApplicant,
                      gender: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите пол" />
                    </SelectTrigger>
                    <SelectContent>
                      {APP_CONSTANTS.GENDERS.map((gender) => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Поток</Label>
                  <Select
                    value={editingApplicant.stream?.toString() || ''}
                    onValueChange={(value) => setEditingApplicant({
                      ...editingApplicant,
                      stream: value ? parseInt(value) : null
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите поток" />
                    </SelectTrigger>
                    <SelectContent>
                      {APP_CONSTANTS.STREAMS.map((stream) => (
                        <SelectItem key={stream.value} value={stream.value.toString()}>
                          {stream.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Документ об образовании */}
              <div>
                <Label>Документ об образовании</Label>
                <Select
                  value={editingApplicant.education_document || ''}
                  onValueChange={(value) => setEditingApplicant({
                    ...editingApplicant,
                    education_document: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите документ" />
                  </SelectTrigger>
                  <SelectContent>
                    {APP_CONSTANTS.EDUCATION_DOCUMENTS.map((doc) => (
                      <SelectItem key={doc.value} value={doc.value}>
                        {doc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Контактные лица */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_contact_name">Контактное лицо</Label>
                  <Input
                    id="edit_contact_name"
                    value={editingApplicant.contact_person_name || ''}
                    onChange={(e) => setEditingApplicant({
                      ...editingApplicant,
                      contact_person_name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit_contact_phone">Телефон контактного лица</Label>
                  <Input
                    id="edit_contact_phone"
                    value={editingApplicant.contact_person_phone || ''}
                    onChange={(e) => setEditingApplicant({
                      ...editingApplicant,
                      contact_person_phone: e.target.value
                    })}
                  />
                </div>
              </div>

              {/* Откуда узнали */}
              <div>
                <Label>Откуда узнали о нас</Label>
                <Select
                  value={editingApplicant.how_did_you_know || ''}
                  onValueChange={(value) => setEditingApplicant({
                    ...editingApplicant,
                    how_did_you_know: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите источник" />
                  </SelectTrigger>
                  <SelectContent>
                    {APP_CONSTANTS.HOW_DID_YOU_KNOW_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Статус */}
              <div>
                <Label htmlFor="edit_status">Статус</Label>
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

              {/* Заметки администратора */}
              <div>
                <Label htmlFor="edit_admin_notes">Заметки администратора</Label>
                <Textarea
                  id="edit_admin_notes"
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
