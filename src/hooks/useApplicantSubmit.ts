
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ApplicantFormData } from '@/constants';

export const useApplicantSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitApplicant = async (formData: ApplicantFormData & { preparation_directions?: any[] }) => {
    setIsSubmitting(true);
    
    try {
      // Prepare exam_scores as JSON-compatible object
      const examScoresJson = formData.exam_scores ? 
        Object.fromEntries(Object.entries(formData.exam_scores)) : {};

      const { data, error } = await supabase
        .from('applicants')
        .insert({
          responsible_id: formData.responsible_id,
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          study_form: formData.study_form,
          education_type: formData.education_type,
          budget: formData.budget,
          stream: formData.stream,
          gender: formData.gender,
          citizenship: formData.citizenship,
          is_adult: formData.is_adult,
          disability: formData.disability,
          education_document: formData.education_document,
          contact_person_name: formData.contact_person_name,
          contact_person_phone: formData.contact_person_phone,
          how_did_you_know: formData.how_did_you_know,
          exam_type: formData.exam_type,
          exam_scores: examScoresJson,
          entrance_subjects: formData.entrance_subjects,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting applicant:', error);
        toast.error('Ошибка при отправке заявки: ' + error.message);
        return { success: false, error };
      }

      // Insert single specialization
      if (formData.specialization_ids.length > 0) {
        const { error: specializationError } = await supabase
          .from('applicant_specializations')
          .insert({
            applicant_id: data.id,
            specialization_id: formData.specialization_ids[0],
            priority: 1
          });

        if (specializationError) {
          console.error('Error inserting specialization:', specializationError);
          toast.error('Ошибка при добавлении специализации');
          return { success: false, error: specializationError };
        }
      }

      toast.success('Заявка успешно отправлена!');
      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Произошла неожиданная ошибка');
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitApplicant, isSubmitting };
};
