
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { APP_CONSTANTS } from '@/constants';

interface StudyInfoSectionProps {
  studyForm: string;
  educationType: string;
  budget: boolean;
  onStudyFormChange: (value: string) => void;
  onEducationTypeChange: (value: string) => void;
  onBudgetChange: (value: boolean) => void;
}

const StudyInfoSection = ({
  studyForm,
  educationType,
  budget,
  onStudyFormChange,
  onEducationTypeChange,
  onBudgetChange
}: StudyInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-3">
        <Label>Форма обучения *</Label>
        <RadioGroup 
          value={studyForm}
          onValueChange={onStudyFormChange}
        >
          {APP_CONSTANTS.STUDY_FORMS.map((form) => (
            <div key={form.value} className="flex items-center space-x-2">
              <RadioGroupItem value={form.value} id={form.value} />
              <Label htmlFor={form.value}>{form.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label>Вид образования *</Label>
        <RadioGroup 
          value={educationType}
          onValueChange={onEducationTypeChange}
        >
          {APP_CONSTANTS.EDUCATION_TYPES.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <RadioGroupItem value={type.value} id={type.value} />
              <Label htmlFor={type.value}>{type.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label>Бюджет *</Label>
        <RadioGroup 
          value={budget.toString()}
          onValueChange={(value) => onBudgetChange(value === 'true')}
        >
          {APP_CONSTANTS.YES_NO_OPTIONS.map((option) => (
            <div key={option.value.toString()} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value.toString()} id={`budget-${option.value}`} />
              <Label htmlFor={`budget-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default StudyInfoSection;
