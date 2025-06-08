
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Applicant } from '@/hooks/useApplicants';
import { ResponsiblePerson, Specialization } from '@/constants';
import BasicInfoSection from './sections/BasicInfoSection';
import EducationTypeSection from './sections/EducationTypeSection';
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
      console.log('Setting up preparation directions for applicant:', applicant);
      // Преобразуем данные поступающего в направление подготовки
      if (applicant.specialization_ids && applicant.specialization_ids.length > 0) {
        const direction = {
          id: `direction-${applicant.specialization_ids[0]}`,
          budget: applicant.budget || false,
          study_form: applicant.study_form || '',
          specialization_id: applicant.specialization_ids[0],
          priority: 1
        };
        console.log('Created direction:', direction);
        setPreparationDirections([direction]);
      } else {
        console.log('No specialization IDs found, clearing directions');
        setPreparationDirections([]);
      }
    }
  }, [applicant]);

  const handleDirectionsChange = (directions: PreparationDirection[]) => {
    console.log('Directions changed:', directions);
    setPreparationDirections(directions);
    if (applicant && directions.length > 0) {
      const direction = directions[0];
      console.log('Updating applicant with direction:', direction);
      onApplicantChange({
        ...applicant,
        specialization_ids: [direction.specialization_id],
        budget: direction.budget,
        study_form: direction.study_form
      });
    } else if (applicant) {
      console.log('Clearing applicant specialization data');
      onApplicantChange({
        ...applicant,
        specialization_ids: [],
        budget: false,
        study_form: ''
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
          />
          
          {/* Вид образования - теперь выше специализации */}
          <EducationTypeSection
            applicant={applicant}
            onApplicantChange={onApplicantChange}
          />
          
          {/* Направление подготовки - только если выбран тип образования */}
          {applicant.education_type && (
            <div>
              <PreparationDirectionsAccordion
                directions={preparationDirections}
                specializations={specializations}
                educationType={applicant.education_type}
                onDirectionsChange={handleDirectionsChange}
              />
            </div>
          )}
          
          <EducationSection
            applicant={applicant}
            onApplicantChange={onApplicantChange}
          />
          
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
