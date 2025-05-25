
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ApplicantFormData } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { APP_CONSTANTS } from '@/constants';

export const useApplicantSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitApplicant = async (formData: ApplicantFormData) => {
    setIsSubmitting(true);
    
    try {
      // Создаем запись абитуриента
      const { data: applicantData, error: applicantError } = await supabase
        .from('applicants')
        .insert({
          responsible_id: formData.responsible_id,
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email || null,
          study_form: formData.study_form,
          education_type: formData.education_type,
          budget: formData.budget,
          stream: formData.stream || null,
          gender: formData.gender || null,
          citizenship: formData.citizenship || null,
          is_adult: formData.is_adult || null,
          disability: formData.disability || null,
          education_document: formData.education_document || null,
          contact_person_name: formData.contact_person_name || null,
          contact_person_phone: formData.contact_person_phone || null,
          how_did_you_know: formData.how_did_you_know || null
        })
        .select()
        .single();

      if (applicantError) throw applicantError;

      // Создаем связи с специализациями
      if (formData.specialization_ids.length > 0) {
        const specializationInserts = formData.specialization_ids.map(specId => ({
          applicant_id: applicantData.id,
          specialization_id: specId
        }));

        const { error: specializationError } = await supabase
          .from('applicant_specializations')
          .insert(specializationInserts);

        if (specializationError) throw specializationError;
      }

      toast({
        title: APP_CONSTANTS.MESSAGES.SUCCESS.APPLICATION_SUBMITTED,
        description: APP_CONSTANTS.MESSAGES.SUCCESS.APPLICATION_SUBMITTED_DESC,
      });

      return { success: true, data: applicantData };
    } catch (error) {
      console.error('Error submitting applicant:', error);
      toast({
        title: APP_CONSTANTS.MESSAGES.ERROR.FORM_VALIDATION,
        description: 'Произошла ошибка при сохранении данных.',
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitApplicant,
    isSubmitting
  };
};
