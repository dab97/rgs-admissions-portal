
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useApplicantData } from '@/hooks/useApplicantData';
import { useApplicantSubmit } from '@/hooks/useApplicantSubmit';
import { APP_CONSTANTS, ApplicantFormData } from '@/constants';
import ResponsiblePersonSection from './form/ResponsiblePersonSection';
import ContactInfoSection from './form/ContactInfoSection';
import SpecializationsSection from './form/SpecializationsSection';
import StudyInfoSection from './form/StudyInfoSection';
import AdditionalDetailsSection from './form/AdditionalDetailsSection';
import ExamScoresSection from './form/ExamScoresSection';

const ApplicantForm = () => {
  const { responsiblePersons, specializations, loading, error } = useApplicantData();
  const { submitApplicant, isSubmitting } = useApplicantSubmit();

  const [formData, setFormData] = useState<ApplicantFormData>({
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
    exam_scores: {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.responsible_id || !formData.full_name || !formData.phone || 
        !formData.study_form || !formData.education_type || 
        formData.specialization_ids.length === 0) {
      return;
    }

    const result = await submitApplicant(formData);
    
    if (result.success) {
      // Сброс формы
      setFormData({
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
        exam_scores: {}
      });
    }
  };

  const handleSpecializationChange = (specializationId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialization_ids: checked 
        ? [...prev.specialization_ids, specializationId]
        : prev.specialization_ids.filter(id => id !== specializationId),
      // Сбрасываем форму обучения при изменении специализаций
      study_form: ''
    }));
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка данных...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  Регистрация поступающего
                </CardTitle>
                <CardDescription className="text-blue-100">
                  {APP_CONSTANTS.UNIVERSITY.FULL_NAME}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Ответственный */}
              <ResponsiblePersonSection
                selectedResponsibleId={formData.responsible_id}
                responsiblePersons={responsiblePersons}
                onResponsibleChange={(id) => setFormData(prev => ({ ...prev, responsible_id: id }))}
              />

              {/* Контактная информация */}
              <ContactInfoSection
                fullName={formData.full_name}
                phone={formData.phone}
                email={formData.email}
                onFullNameChange={(value) => setFormData(prev => ({ ...prev, full_name: value }))}
                onPhoneChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                onEmailChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
              />

              {/* Информация об обучении */}
              <StudyInfoSection
                studyForm={formData.study_form}
                educationType={formData.education_type}
                budget={formData.budget}
                specializations={specializations}
                selectedSpecializationIds={formData.specialization_ids}
                onStudyFormChange={(value) => setFormData(prev => ({ ...prev, study_form: value }))}
                onEducationTypeChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  education_type: value,
                  specialization_ids: [], // Сбрасываем специализации при смене типа образования
                  study_form: '' // Сбрасываем форму обучения
                }))}
                onBudgetChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
              />

              {/* Направления подготовки */}
              <SpecializationsSection
                specializations={specializations}
                selectedSpecializationIds={formData.specialization_ids}
                educationType={formData.education_type}
                onSpecializationChange={handleSpecializationChange}
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
                onStreamChange={(value) => setFormData(prev => ({ ...prev, stream: value }))}
                onGenderChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                onCitizenshipChange={(value) => setFormData(prev => ({ ...prev, citizenship: value }))}
                onIsAdultChange={(value) => setFormData(prev => ({ ...prev, is_adult: value }))}
                onDisabilityChange={(value) => setFormData(prev => ({ ...prev, disability: value }))}
                onEducationDocumentChange={(value) => setFormData(prev => ({ ...prev, education_document: value }))}
                onContactPersonNameChange={(value) => setFormData(prev => ({ ...prev, contact_person_name: value }))}
                onContactPersonPhoneChange={(value) => setFormData(prev => ({ ...prev, contact_person_phone: value }))}
                onHowDidYouKnowChange={(value) => setFormData(prev => ({ ...prev, how_did_you_know: value }))}
              />

              {/* ЕГЭ/ЦТ */}
              <ExamScoresSection
                citizenship={formData.citizenship}
                examType={formData.exam_type}
                examScores={formData.exam_scores || {}}
                onExamTypeChange={(value) => setFormData(prev => ({ ...prev, exam_type: value }))}
                onExamScoreChange={handleExamScoreChange}
              />

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  'Подать заявку'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantForm;
