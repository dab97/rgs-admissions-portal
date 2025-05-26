
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  status: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  responsible_id: string;
  responsible_persons: { name: string } | null;
  specializations: string[];
  specialization_ids?: string[];
}

export const useApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchApplicants = async () => {
    try {
      const { data, error } = await supabase
        .from('applicants')
        .select(`
          *,
          responsible_persons (name),
          applicant_specializations (
            specializations (id, name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedApplicants = data?.map(applicant => ({
        ...applicant,
        specializations: applicant.applicant_specializations?.map((as: any) => 
          as.specializations?.name
        ).filter(Boolean) || [],
        specialization_ids: applicant.applicant_specializations?.map((as: any) => 
          as.specializations?.id
        ).filter(Boolean) || []
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
      const { specialization_ids, ...applicantUpdates } = updates;
      
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

  useEffect(() => {
    fetchApplicants();
  }, []);

  return {
    applicants,
    loading,
    error,
    updateApplicant,
    deleteApplicant,
    refetch: fetchApplicants
  };
};
