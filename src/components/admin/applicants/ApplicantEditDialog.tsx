
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Applicant } from '@/types/applicant';
import { ResponsiblePerson, Specialization } from '@/constants';
import ResponsiblePersonSection from '@/components/form/ResponsiblePersonSection';
import ContactInfoSection from '@/components/form/ContactInfoSection';
import AdditionalDetailsSection from '@/components/form/AdditionalDetailsSection';
import ExamScoresSection from '@/components/form/ExamScoresSection';
import PreparationDirectionsSection, { PreparationDirection } from '@/components/form/PreparationDirectionsSection';
import { APP_CONSTANTS } from '@/constants';

interface ApplicantEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: Applicant | null;
  onApplicantChange: (applicant: Applicant) => void;
  onSave: () => void;
  responsiblePersons: ResponsiblePerson[];
  specializations: Specialization[];
}

const ApplicantEditDialog = ({ 
  isOpen, 
  onOpenChange, 
  applicant, 
  onApplicantChange, 
  onSave,
  responsiblePersons,
  specializations 
}: ApplicantEditDialogProps) => {
  if (!applicant) return null;

  const handlePreparationDirectionsChange = (directions: PreparationDirection[]) => {
    onApplicantChange({
      ...applicant,
      preparation_directions: directions
    });
  };

  const handleEntranceSubjectsChange = (subjects: string[]) => {
    onApplicantChange({
      ...applicant,
      entrance_subjects: subjects
    });
  };

  const handleExamScoreChange = (subject: string, score: number) => {
    onApplicantChange({
      ...applicant,
      exam_scores: {
        ...applicant.exam_scores,
        [subject]: score
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать заявку</DialogTitle>
        </DialogHeader>
        <div className="space-y-8">
          {/* Ответственный */}
          <ResponsiblePersonSection
            selectedResponsibleId={applicant.responsible_id}
            responsiblePersons={responsiblePersons}
            onResponsibleChange={(id) => onApplicantChange({ ...applicant, responsible_id: id })}
          />

          {/* Контактная информация */}
          <ContactInfoSection
            fullName={applicant.full_name}
            phone={applicant.phone}
            email={applicant.email || ''}
            onFullNameChange={(value) => onApplicantChange({ ...applicant, full_name: value })}
            onPhoneChange={(value) => onApplicantChange({ ...applicant, phone: value })}
            onEmailChange={(value) => onApplicantChange({ ...applicant, email: value })}
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
                      checked={applicant.education_type === type.value}
                      onChange={(e) => onApplicantChange({ 
                        ...applicant, 
                        education_type: e.target.value,
                        preparation_directions: [] // Сбрасываем направления при смене типа образования
                      })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Направления подготовки */}
          <PreparationDirectionsSection
            directions={applicant.preparation_directions || []}
            specializations={specializations}
            educationType={applicant.education_type}
            onDirectionsChange={handlePreparationDirectionsChange}
          />

          {/* Дополнительная информация */}
          <AdditionalDetailsSection
            stream={applicant.stream}
            gender={applicant.gender || ''}
            citizenship={applicant.citizenship || ''}
            isAdult={applicant.is_adult}
            disability={applicant.disability}
            educationDocument={applicant.education_document || ''}
            contactPersonName={applicant.contact_person_name || ''}
            contactPersonPhone={applicant.contact_person_phone || ''}
            howDidYouKnow={applicant.how_did_you_know || ''}
            onStreamChange={(value) => onApplicantChange({ ...applicant, stream: value })}
            onGenderChange={(value) => onApplicantChange({ ...applicant, gender: value })}
            onCitizenshipChange={(value) => onApplicantChange({ ...applicant, citizenship: value })}
            onIsAdultChange={(value) => onApplicantChange({ ...applicant, is_adult: value })}
            onDisabilityChange={(value) => onApplicantChange({ ...applicant, disability: value })}
            onEducationDocumentChange={(value) => onApplicantChange({ ...applicant, education_document: value })}
            onContactPersonNameChange={(value) => onApplicantChange({ ...applicant, contact_person_name: value })}
            onContactPersonPhoneChange={(value) => onApplicantChange({ ...applicant, contact_person_phone: value })}
            onHowDidYouKnowChange={(value) => onApplicantChange({ ...applicant, how_did_you_know: value })}
          />

          {/* ЕГЭ/ЦТ/Вступительные испытания */}
          <ExamScoresSection
            citizenship={applicant.citizenship || ''}
            examType={applicant.exam_type || ''}
            examScores={applicant.exam_scores || {}}
            budget={applicant.preparation_directions?.[0]?.budget || false}
            selectedSpecializationIds={applicant.preparation_directions?.[0]?.specializationIds || []}
            specializations={specializations}
            entranceSubjects={applicant.entrance_subjects || []}
            onExamTypeChange={(value) => onApplicantChange({ ...applicant, exam_type: value })}
            onExamScoreChange={handleExamScoreChange}
            onEntranceSubjectsChange={handleEntranceSubjectsChange}
          />

          {/* Статус и заметки администратора */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900">Административная информация</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Статус</label>
                <select
                  value={applicant.status || 'pending'}
                  onChange={(e) => onApplicantChange({ ...applicant, status: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="pending">Ожидает</option>
                  <option value="under_review">На рассмотрении</option>
                  <option value="approved">Одобрено</option>
                  <option value="rejected">Отклонено</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Заметки администратора</label>
              <textarea
                value={applicant.admin_notes || ''}
                onChange={(e) => onApplicantChange({ ...applicant, admin_notes: e.target.value })}
                placeholder="Добавьте заметки..."
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 h-24"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={onSave}>
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantEditDialog;
