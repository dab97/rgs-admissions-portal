
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Applicant } from '@/hooks/useApplicants';
import { ResponsiblePerson, Specialization } from '@/constants';
import BasicInfoSection from './sections/BasicInfoSection';
import EducationSection from './sections/EducationSection';
import AdditionalInfoSection from './sections/AdditionalInfoSection';
import StatusSection from './sections/StatusSection';
import ExamInfoSection from './sections/ExamInfoSection';

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
