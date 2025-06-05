
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useApplicantData } from '@/hooks/useApplicantData';
import { useApplicantSubmit } from '@/hooks/useApplicantSubmit';
import { useApplicantFormData } from '@/hooks/useApplicantFormData';
import FormHeader from './form/FormHeader';
import FormLoadingState from './form/FormLoadingState';
import FormErrorState from './form/FormErrorState';
import ResponsiblePersonSection from './form/ResponsiblePersonSection';
import ContactInfoSection from './form/ContactInfoSection';
import EducationTypeTabsSection from './form/EducationTypeTabsSection';
import PreparationDirectionsAccordion from './form/PreparationDirectionsAccordion';
import AdditionalDetailsSection from './form/AdditionalDetailsSection';
import ExamScoresSection from './form/ExamScoresSection';
import SubmitButton from './form/SubmitButton';

const ApplicantForm = () => {
  const { responsiblePersons, specializations, loading, error } = useApplicantData();
  const { submitApplicant, isSubmitting } = useApplicantSubmit();
  const {
    formData,
    preparationDirections,
    setPreparationDirections,
    resetForm,
    updateFormField,
    handleExamScoreChange,
    handleEntranceSubjectsChange,
    handleEducationTypeChange
  } = useApplicantFormData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.responsible_id || !formData.full_name || !formData.phone || 
        !formData.education_type || preparationDirections.length === 0) {
      return;
    }

    // Преобразуем направления подготовки в формат для отправки
    const specializationIds = preparationDirections.map(d => d.specialization_id);
    const hasAnyBudget = preparationDirections.some(d => d.budget);

    const submitData = {
      ...formData,
      specialization_ids: specializationIds,
      budget: hasAnyBudget,
      study_form: preparationDirections[0]?.study_form || '',
      preparation_directions: preparationDirections
    };

    const result = await submitApplicant(submitData);
    
    if (result.success) {
      resetForm();
    }
  };

  if (loading) {
    return <FormLoadingState />;
  }

  if (error) {
    return <FormErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <FormHeader />
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Ответственный */}
              <ResponsiblePersonSection
                selectedResponsibleId={formData.responsible_id}
                responsiblePersons={responsiblePersons}
                onResponsibleChange={(id) => updateFormField('responsible_id', id)}
              />

              {/* Контактная информация */}
              <ContactInfoSection
                fullName={formData.full_name}
                phone={formData.phone}
                email={formData.email}
                onFullNameChange={(value) => updateFormField('full_name', value)}
                onPhoneChange={(value) => updateFormField('phone', value)}
                onEmailChange={(value) => updateFormField('email', value)}
              />              

              {/* Вид образования с табами */}
              <EducationTypeTabsSection
                educationType={formData.education_type}
                onEducationTypeChange={handleEducationTypeChange}
              >
                {/* Направления подготовки */}
                <PreparationDirectionsAccordion
                  directions={preparationDirections}
                  specializations={specializations}
                  educationType={formData.education_type}
                  onDirectionsChange={setPreparationDirections}
                />

                {/* Дополнительная информация */}
                <AdditionalDetailsSection
                  stream={formData.stream}
                  gender={formData.gender}
                  citizenship={formData.citizenship}
                  isAdult={formData.is_adult}
                  disability={formData.disability}
                  educationDocument={formData.education_document}
                  contactPersonName={formData.contact_person_name}
                  contactPersonPhone={formData.contact_person_phone}
                  howDidYouKnow={formData.how_did_you_know}
                  onStreamChange={(value) => updateFormField('stream', value)}
                  onGenderChange={(value) => updateFormField('gender', value)}
                  onCitizenshipChange={(value) => updateFormField('citizenship', value)}
                  onIsAdultChange={(value) => updateFormField('is_adult', value)}
                  onDisabilityChange={(value) => updateFormField('disability', value)}
                  onEducationDocumentChange={(value) => updateFormField('education_document', value)}
                  onContactPersonNameChange={(value) => updateFormField('contact_person_name', value)}
                  onContactPersonPhoneChange={(value) => updateFormField('contact_person_phone', value)}
                  onHowDidYouKnowChange={(value) => updateFormField('how_did_you_know', value)}
                />

                {/* ЕГЭ/ЦТ/Вступительные испытания */}
                <ExamScoresSection
                  citizenship={formData.citizenship}
                  examType={formData.exam_type}
                  examScores={formData.exam_scores || {}}
                  budget={formData.budget}
                  selectedSpecializationIds={preparationDirections.map(d => d.specialization_id)}
                  specializations={specializations}
                  entranceSubjects={formData.entrance_subjects}
                  onExamTypeChange={(value) => updateFormField('exam_type', value)}
                  onExamScoreChange={handleExamScoreChange}
                  onEntranceSubjectsChange={handleEntranceSubjectsChange}
                />
              </EducationTypeTabsSection>

              <SubmitButton isSubmitting={isSubmitting} />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantForm;
