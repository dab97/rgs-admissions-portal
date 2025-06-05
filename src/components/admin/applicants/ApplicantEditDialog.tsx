
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Applicant } from '@/hooks/useApplicants';
import { ResponsiblePerson, Specialization } from '@/constants';
import BasicInfoSection from './sections/BasicInfoSection';
import EducationSection from './sections/EducationSection';
import AdditionalInfoSection from './sections/AdditionalInfoSection';
import StatusSection from './sections/StatusSection';
import ExamInfoSection from './sections/ExamInfoSection';
import PreparationDirectionsAccordion, { PreparationDirection } from '@/components/form/PreparationDirectionsAccordion';

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
  const [preparationDirections, setPreparationDirections] = useState<PreparationDirection[]>([]);

  useEffect(() => {
    if (applicant) {
      // Преобразуем данные поступающего в направления подготовки
      if (applicant.specialization_ids && applicant.specialization_ids.length > 0) {
        const directions = applicant.specialization_ids.map((specId, index) => ({
          id: `direction-${specId}`,
          budget: applicant.budget || false,
          study_form: applicant.study_form || '',
          specialization_id: specId,
          priority: index + 1
        }));
        setPreparationDirections(directions);
      } else {
        setPreparationDirections([]);
      }
    }
  }, [applicant]);

  const handleDirectionsChange = (directions: PreparationDirection[]) => {
    setPreparationDirections(directions);
    if (applicant) {
      const specializationIds = directions.map(d => d.specialization_id);
      const hasAnyBudget = directions.some(d => d.budget);
      onApplicantChange({
        ...applicant,
        specialization_ids: specializationIds,
        budget: hasAnyBudget,
        study_form: directions[0]?.study_form || ''
      });
    }
  };

  if (!applicant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать заявку</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <BasicInfoSection
            applicant={applicant}
            onApplicantChange={onApplicantChange}
            responsiblePersons={responsiblePersons}
            specializations={specializations}
          />
          
          <EducationSection
            applicant={applicant}
            onApplicantChange={onApplicantChange}
          />
          
          {/* Направления подготовки */}
          <div>
            <PreparationDirectionsAccordion
              directions={preparationDirections}
              specializations={specializations}
              educationType={applicant.education_type}
              onDirectionsChange={handleDirectionsChange}
            />
          </div>
          
          <AdditionalInfoSection
            applicant={applicant}
            onApplicantChange={onApplicantChange}
          />

          <ExamInfoSection
            applicant={applicant}
            onApplicantChange={onApplicantChange}
            specializations={specializations}
          />
          
          <StatusSection
            applicant={applicant}
            onApplicantChange={onApplicantChange}
          />

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
