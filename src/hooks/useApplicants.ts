
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PreparationDirection {
  id: string;
  budget: boolean;
  studyForm: string;
  specializationIds: string[];
  priority: number;
}

export interface Applicant {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  study_form: string;
  education_type: string;
  budget: boolean;
  stream: number | null;
  gender: string | null;
  citizenship: string | null;
  is_adult: boolean | null;
  disability: boolean | null;
  education_document: string | null;
  contact_person_name: string | null;
  contact_person_phone: string | null;
  how_did_you_know: string | null;
  exam_type: string | null;
  exam_scores: any | null;
  entrance_subjects: string[] | null;
  status: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  responsible_id: string;
  responsible_persons: { name: string } | null;
  specializations: string[];
  specialization_ids?: string[];
  preparation_directions?: PreparationDirection[];
}

export const useApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    status: '',
    education_type: '',
    study_form: '',
    budget: '',
    specialization: '',
    search: ''
  });
  const { toast } = useToast();

  const fetchApplicants = async () => {
    try {
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

      setApplicants(formattedApplicants);
    } catch (err) {
      console.error('Error fetching applicants:', err);
      setError('Ошибка загрузки списка поступающих');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicant = async (id: string, updates: Partial<Applicant>) => {
    try {
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

      toast({
        title: 'Успешно обновлено',
        description: 'Данные поступающего обновлены',
      });

      fetchApplicants();
    } catch (err) {
      console.error('Error updating applicant:', err);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить данные',
        variant: 'destructive',
      });
    }
  };

  const deleteApplicant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('applicants')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Успешно удалено',
        description: 'Заявка поступающего удалена',
      });

      fetchApplicants();
    } catch (err) {
      console.error('Error deleting applicant:', err);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить заявку',
        variant: 'destructive',
      });
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      education_type: '',
      study_form: '',
      budget: '',
      specialization: '',
      search: ''
    });
  };

  useEffect(() => {
    fetchApplicants();
  }, [sortField, sortDirection, filters]);

  return {
    applicants,
    loading,
    error,
    updateApplicant,
    deleteApplicant,
    refetch: fetchApplicants,
    sortField,
    sortDirection,
    filters,
    handleSort,
    handleFilterChange,
    clearFilters
  };
};
