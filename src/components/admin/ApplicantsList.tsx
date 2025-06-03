
import React, { useState } from 'react';
import { useApplicants } from '@/hooks/useApplicants';
import { useApplicantData } from '@/hooks/useApplicantData';
import { Applicant } from '@/types/applicant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ApplicantsTable from './applicants/ApplicantsTable';
import ApplicantsFilters from './applicants/ApplicantsFilters';
import ApplicantViewDialog from './applicants/ApplicantViewDialog';
import ApplicantEditDialog from './applicants/ApplicantEditDialog';

const ApplicantsList = () => {
  const { 
    applicants, 
    loading, 
    updateApplicant, 
    deleteApplicant,
    sortField,
    sortDirection,
    filters,
    handleSort,
    handleFilterChange,
    clearFilters
  } = useApplicants();
  const { responsiblePersons, specializations } = useApplicantData();
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [editingApplicant, setEditingApplicant] = useState<Applicant | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleEdit = (applicant: Applicant) => {
    setEditingApplicant({
      ...applicant,
      specialization_ids: applicant.specialization_ids || [],
      preparation_directions: applicant.preparation_directions || [{
        id: 'legacy-direction',
        budget: applicant.budget,
        studyForm: applicant.study_form,
        specializationIds: applicant.specialization_ids || [],
        priority: 1
      }]
    });
    setIsEditDialogOpen(true);
  };

  const handleView = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setIsViewDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingApplicant) return;

    // Извлекаем данные из первого направления для совместимости с текущей структурой БД
    const primaryDirection = editingApplicant.preparation_directions?.[0];
    
    await updateApplicant(editingApplicant.id, {
      status: editingApplicant.status,
      admin_notes: editingApplicant.admin_notes,
      full_name: editingApplicant.full_name,
      phone: editingApplicant.phone,
      email: editingApplicant.email,
      responsible_id: editingApplicant.responsible_id,
      study_form: primaryDirection?.studyForm || editingApplicant.study_form,
      education_type: editingApplicant.education_type,
      budget: primaryDirection?.budget ?? editingApplicant.budget,
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
      specialization_ids: primaryDirection?.specializationIds || editingApplicant.specialization_ids
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
        <CardContent className="space-y-6">
          <ApplicantsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
          
          <ApplicantsTable
            applicants={applicants}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </CardContent>
      </Card>

      <ApplicantViewDialog
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        applicant={selectedApplicant}
        specializations={specializations}
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
