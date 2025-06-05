
import { useState } from 'react';
import { ApplicantFormData } from '@/constants';
import { PreparationDirection } from '@/components/form/PreparationDirectionsAccordion';

const initialFormData: ApplicantFormData = {
  responsible_id: '',
  full_name: '',
  phone: '',
  email: '',
  specialization_ids: [],
  study_form: '',
  education_type: '',
  budget: false,
  stream: undefined,
  gender: '',
  citizenship: '',
  is_adult: undefined,
  disability: undefined,
  education_document: '',
  contact_person_name: '',
  contact_person_phone: '',
  how_did_you_know: '',
  exam_type: '',
  exam_scores: {},
  entrance_subjects: []
};

export const useApplicantFormData = () => {
  const [formData, setFormData] = useState<ApplicantFormData>(initialFormData);
  const [preparationDirections, setPreparationDirections] = useState<PreparationDirection[]>([]);

  const resetForm = () => {
    setFormData(initialFormData);
    setPreparationDirections([]);
  };

  const updateFormField = <K extends keyof ApplicantFormData>(
    field: K, 
    value: ApplicantFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleExamScoreChange = (subject: string, score: number) => {
    setFormData(prev => ({
      ...prev,
      exam_scores: {
        ...prev.exam_scores,
        [subject]: score
      }
    }));
  };

  const handleEntranceSubjectsChange = (subjects: string[]) => {
    setFormData(prev => ({
      ...prev,
      entrance_subjects: subjects
    }));
  };

  const handleEducationTypeChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      education_type: value,
      specialization_ids: [],
      study_form: ''
    }));
    setPreparationDirections([]);
  };

  return {
    formData,
    preparationDirections,
    setPreparationDirections,
    resetForm,
    updateFormField,
    handleExamScoreChange,
    handleEntranceSubjectsChange,
    handleEducationTypeChange
  };
};
