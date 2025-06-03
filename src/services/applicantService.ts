
import { supabase } from '@/integrations/supabase/client';
import { Applicant, ApplicantFilters } from '@/types/applicant';

export const fetchApplicants = async (
  sortField: string,
  sortDirection: 'asc' | 'desc',
  filters: ApplicantFilters
): Promise<Applicant[]> => {
  let query = supabase
    .from('applicants')
    .select(`
      *,
      responsible_persons (name),
      applicant_specializations (
        specializations (id, name)
      )
    `);

  // Apply filters
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.education_type) {
    query = query.eq('education_type', filters.education_type);
  }
  if (filters.study_form) {
    query = query.eq('study_form', filters.study_form);
  }
  if (filters.budget !== '') {
    query = query.eq('budget', filters.budget === 'true');
  }
  if (filters.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  // Apply sorting
  query = query.order(sortField, { ascending: sortDirection === 'asc' });

  const { data, error } = await query;

  if (error) throw error;

  const formattedApplicants = data?.map(applicant => ({
    ...applicant,
    specializations: applicant.applicant_specializations?.map((as: any) => 
      as.specializations?.name
    ).filter(Boolean) || [],
    specialization_ids: applicant.applicant_specializations?.map((as: any) => 
      as.specializations?.id
    ).filter(Boolean) || [],
    exam_type: applicant.exam_type || null,
    exam_scores: applicant.exam_scores || null,
    entrance_subjects: applicant.entrance_subjects || null,
    // Временно создаем направления из текущих данных для совместимости
    preparation_directions: [{
      id: 'legacy-direction',
      budget: applicant.budget,
      studyForm: applicant.study_form,
      specializationIds: applicant.applicant_specializations?.map((as: any) => 
        as.specializations?.id
      ).filter(Boolean) || [],
      priority: 1
    }]
  })) || [];

  return formattedApplicants;
};

export const updateApplicant = async (id: string, updates: Partial<Applicant>) => {
  const { specialization_ids, preparation_directions, ...applicantUpdates } = updates;
  
  // Обновляем основную информацию о поступающем
  const { error: updateError } = await supabase
    .from('applicants')
    .update(applicantUpdates)
    .eq('id', id);

  if (updateError) throw updateError;

  // Если есть изменения в специализациях, обновляем их
  if (specialization_ids !== undefined) {
    // Удаляем старые связи
    const { error: deleteError } = await supabase
      .from('applicant_specializations')
      .delete()
      .eq('applicant_id', id);

    if (deleteError) throw deleteError;

    // Добавляем новые связи
    if (specialization_ids.length > 0) {
      const specializationInserts = specialization_ids.map(specId => ({
        applicant_id: id,
        specialization_id: specId
      }));

      const { error: insertError } = await supabase
        .from('applicant_specializations')
        .insert(specializationInserts);

      if (insertError) throw insertError;
    }
  }
};

export const deleteApplicant = async (id: string) => {
  const { error } = await supabase
    .from('applicants')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
