
import React, { useState, useMemo } from 'react';
import { useApplicants, Applicant } from '@/hooks/useApplicants';
import { useApplicantData } from '@/hooks/useApplicantData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ApplicantsTable from './applicants/ApplicantsTable';
import ApplicantsFilters from './applicants/ApplicantsFilters';
import ApplicantViewDialog from './applicants/ApplicantViewDialog';
import ApplicantEditDialog from './applicants/ApplicantEditDialog';

const ApplicantsList = () => {
  const { applicants, loading, updateApplicant, deleteApplicant } = useApplicants();
  const { responsiblePersons, specializations } = useApplicantData();
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Состояние фильтров
  const [filters, setFilters] = useState({
    educationType: '',
    studyForm: '',
    specialization: '',
    budget: '',
    status: '',
    search: ''
  });

  // Функция для изменения фильтров
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Функция для очистки фильтров
  const handleClearFilters = () => {
    setFilters({
      educationType: '',
      studyForm: '',
      specialization: '',
      budget: '',
      status: '',
      search: ''
    });
  };

  // Фильтрация поступающих
  const filteredApplicants = useMemo(() => {
    return applicants.filter(applicant => {
      // Поиск по ФИО
      if (filters.search && !applicant.full_name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Фильтр по виду образования
      if (filters.educationType && applicant.education_type !== filters.educationType) {
        return false;
      }

      // Фильтр по форме обучения
      if (filters.studyForm && applicant.study_form !== filters.studyForm) {
        return false;
      }

      // Фильтр по специализации
      if (filters.specialization && !applicant.specialization_ids?.includes(filters.specialization)) {
        return false;
      }

      // Фильтр по бюджету
      if (filters.budget && applicant.budget.toString() !== filters.budget) {
        return false;
      }

      // Фильтр по статусу
      if (filters.status && applicant.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [applicants, filters]);

  const handleEdit = (applicant: Applicant) => {
    setEditingApplicant({
      ...applicant,
      specialization_ids: applicant.specialization_ids || []
    });
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
      exam_type: editingApplicant.exam_type,
      exam_scores: editingApplicant.exam_scores,
      entrance_subjects: editingApplicant.entrance_subjects,
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
          <CardTitle>Список поступающих ({filteredApplicants.length})</CardTitle>
          <CardDescription>
            Управление заявками поступающих абитуриентов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ApplicantsFilters
            specializations={specializations}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          
          <ApplicantsTable
            applicants={filteredApplicants}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <ApplicantViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        applicant={selectedApplicant}
      />

      <ApplicantEditDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        applicant={editingApplicant}
        onApplicantChange={setEditingApplicant}
        onSave={handleSave}
        responsiblePersons={responsiblePersons}
        specializations={specializations}
      />
    </div>
  );
};

export default ApplicantsList;
