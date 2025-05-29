import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Loader2 } from 'lucide-react';
import { useApplicantData } from '@/hooks/useApplicantData';
import { useApplicantSubmit } from '@/hooks/useApplicantSubmit';
import { APP_CONSTANTS, ApplicantFormData } from '@/constants';
import ResponsiblePersonSection from './form/ResponsiblePersonSection';
import ContactInfoSection from './form/ContactInfoSection';
import StudyInfoSection from './form/StudyInfoSection';
import AdditionalDetailsSection from './form/AdditionalDetailsSection';
import ExamScoresSection from './form/ExamScoresSection';
import PreparationDirectionsSection, { PreparationDirection } from './form/PreparationDirectionsSection';

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
    exam_scores: {},
    entrance_subjects: []
  });

  const [preparationDirections, setPreparationDirections] = useState<PreparationDirection[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.responsible_id || !formData.full_name || !formData.phone || 
        !formData.education_type || preparationDirections.length === 0) {
      return;
    }

    // Преобразуем направления подготовки в формат для отправки
    // Берем первое направление как основное для совместимости
    const primaryDirection = preparationDirections[0];
    if (primaryDirection) {
      const updatedFormData = {
        ...formData,
        specialization_ids: primaryDirection.specializationIds,
        study_form: primaryDirection.studyForm,
        budget: primaryDirection.budget
      };

      const result = await submitApplicant(updatedFormData);
      
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
          exam_scores: {},
          entrance_subjects: []
        });
        setPreparationDirections([]);
      }
    }
  };

  const handleEntranceSubjectsChange = (subjects: string[]) => {
    setFormData(prev => ({
      ...prev,
      entrance_subjects: subjects
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

              {/* Вид образования */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Информация об обучении</h3>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Вид образования *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {APP_CONSTANTS.EDUCATION_TYPES.map((type) => (
                      <label key={type.value} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="education_type"
                          value={type.value}
                          checked={formData.education_type === type.value}
                          onChange={(e) => {
                            setFormData(prev => ({ 
                              ...prev, 
                              education_type: e.target.value,
                            }));
                            setPreparationDirections([]); // Сбрасываем направления при смене типа образования
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm font-medium">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Новый компонент направлений подготовки */}
              <PreparationDirectionsSection
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

              {/* ЕГЭ/ЦТ/Вступительные испытания */}
              <ExamScoresSection
                citizenship={formData.citizenship}
                examType={formData.exam_type}
                examScores={formData.exam_scores || {}}
                budget={preparationDirections.length > 0 ? preparationDirections[0].budget : false}
                selectedSpecializationIds={preparationDirections.length > 0 ? preparationDirections[0].specializationIds : []}
                specializations={specializations}
                entranceSubjects={formData.entrance_subjects}
                onExamTypeChange={(value) => setFormData(prev => ({ ...prev, exam_type: value }))}
                onExamScoreChange={handleExamScoreChange}
                onEntranceSubjectsChange={handleEntranceSubjectsChange}
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
