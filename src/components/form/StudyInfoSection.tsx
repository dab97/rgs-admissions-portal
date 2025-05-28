
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { APP_CONSTANTS, Specialization } from '@/constants';

interface StudyInfoSectionProps {
  studyForm: string;
  educationType: string;
  budget: boolean;
  specializations: Specialization[];
  selectedSpecializationIds: string[];
  onStudyFormChange: (value: string) => void;
  onEducationTypeChange: (value: string) => void;
  onBudgetChange: (value: boolean) => void;
}

const StudyInfoSection = ({
  studyForm,
  educationType,
  budget,
  specializations,
  selectedSpecializationIds,
  onStudyFormChange,
  onEducationTypeChange,
  onBudgetChange
}: StudyInfoSectionProps) => {
  
  // Получаем доступные формы обучения на основе выбранных специализаций
  const getAvailableStudyForms = () => {
    if (!educationType || selectedSpecializationIds.length === 0) {
      return APP_CONSTANTS.STUDY_FORMS;
    }

    const config = APP_CONSTANTS.SPECIALIZATIONS_CONFIG[educationType as 'bachelor' | 'master'];
    if (!config) return APP_CONSTANTS.STUDY_FORMS;

    // Создаем маппинг названий к кодам
    const specializationMap: { [key: string]: string } = {
      'psychology': 'Психология',
      'management': 'Менеджмент', 
      'social_work': 'Социальная работа',
      'law': 'Юриспруденция'
    };

    // Получаем коды выбранных специализаций
    const selectedSpecCodes = selectedSpecializationIds
      .map(id => {
        const spec = specializations.find(s => s.id === id);
        return spec ? Object.keys(specializationMap).find(
          key => specializationMap[key] === spec.name
        ) : null;
      })
      .filter(Boolean) as string[];

    if (selectedSpecCodes.length === 0) return APP_CONSTANTS.STUDY_FORMS;

    // Находим пересечение доступных форм обучения для всех выбранных специализаций
    const allowedForms = selectedSpecCodes.reduce((commonForms, specCode) => {
      const restrictions = config.studyFormRestrictions[specCode];
      if (!restrictions) return commonForms;
      
      if (commonForms.length === 0) {
        return restrictions;
      }
      
      return commonForms.filter(form => restrictions.includes(form));
    }, [] as string[]);

    return APP_CONSTANTS.STUDY_FORMS.filter(form => 
      allowedForms.length === 0 || allowedForms.includes(form.value)
    );
  };

  const availableStudyForms = getAvailableStudyForms();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-3">
        <Label>Форма обучения *</Label>
        {selectedSpecializationIds.length === 0 && (
          <p className="text-sm text-gray-500">Сначала выберите специализацию</p>
        )}
        <RadioGroup 
          value={studyForm}
          onValueChange={onStudyFormChange}
        >
          {availableStudyForms.map((form) => (
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
