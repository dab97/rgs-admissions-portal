
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
  const { preparation_directions, ...applicantUpdates } = updates;
  
  // Извлекаем данные из первого направления для совместимости с текущей структурой БД
  if (preparation_directions && preparation_directions.length > 0) {
    const primaryDirection = preparation_directions[0];
    applicantUpdates.study_form = primaryDirection.studyForm;
    applicantUpdates.budget = primaryDirection.budget;
    
    // Собираем все специализации из всех направлений
    const allSpecializationIds = preparation_directions.reduce((acc, direction) => {
      return [...acc, ...direction.specializationIds];
    }, [] as string[]);
    
    // Удаляем дубликаты
    const uniqueSpecializationIds = [...new Set(allSpecializationIds)];
    
    // Обновляем основную информацию о поступающем
    const { error: updateError } = await supabase
      .from('applicants')
      .update(applicantUpdates)
      .eq('id', id);

    if (updateError) throw updateError;

    // Удаляем старые связи со специализациями
    const { error: deleteError } = await supabase
      .from('applicant_specializations')
      .delete()
      .eq('applicant_id', id);

    if (deleteError) throw deleteError;

    // Добавляем новые связи со специализациями
    if (uniqueSpecializationIds.length > 0) {
      const specializationInserts = uniqueSpecializationIds.map(specId => ({
        applicant_id: id,
        specialization_id: specId
      }));

      const { error: insertError } = await supabase
        .from('applicant_specializations')
        .insert(specializationInserts);

      if (insertError) throw insertError;
    }
  } else {
    // Если нет направлений подготовки, просто обновляем основную информацию
    const { error: updateError } = await supabase
      .from('applicants')
      .update(applicantUpdates)
      .eq('id', id);

    if (updateError) throw updateError;
  }
};

export const deleteApplicant = async (id: string) => {
  const { error } = await supabase
    .from('applicants')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
