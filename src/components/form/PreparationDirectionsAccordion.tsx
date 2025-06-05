
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Specialization } from '@/constants';
import { APP_CONSTANTS } from '@/constants';

export interface PreparationDirection {
  id: string;
  budget: boolean;
  study_form: string;
  specialization_id: string;
  priority: number;
}

interface PreparationDirectionsAccordionProps {
  directions: PreparationDirection[];
  specializations: Specialization[];
  educationType: string;
  onDirectionsChange: (directions: PreparationDirection[]) => void;
}

const PreparationDirectionsAccordion = ({
  directions,
  specializations,
  educationType,
  onDirectionsChange
}: PreparationDirectionsAccordionProps) => {
  const currentDirection = directions.length > 0 ? directions[0] : {
    id: 'direction-1',
    budget: false,
    study_form: '',
    specialization_id: '',
    priority: 1
  };

  const getAvailableSpecializations = () => {
    if (!educationType) return specializations;
    
    const config = APP_CONSTANTS.SPECIALIZATIONS_CONFIG[educationType as 'bachelor' | 'master'];
    if (!config) return specializations;
    
    const specializationMap: { [key: string]: string } = {
      'psychology': 'Психология',
      'management': 'Менеджмент', 
      'social_work': 'Социальная работа',
      'law': 'Юриспруденция'
    };
    
    return specializations.filter(spec => {
      const specCode = Object.keys(specializationMap).find(
        key => specializationMap[key] === spec.name
      );
      return specCode && config.available.includes(specCode);
    });
  };

  const getAvailableStudyForms = () => {
    if (!educationType || !currentDirection.specialization_id) return [];
    
    const config = APP_CONSTANTS.SPECIALIZATIONS_CONFIG[educationType as 'bachelor' | 'master'];
    if (!config) return [];
    
    // Найдем выбранную специализацию
    const selectedSpec = specializations.find(spec => spec.id === currentDirection.specialization_id);
    if (!selectedSpec) return [];
    
    const specializationMap: { [key: string]: string } = {
      'psychology': 'Психология',
      'management': 'Менеджмент', 
      'social_work': 'Социальная работа',
      'law': 'Юриспруденция'
    };
    
    const specCode = Object.keys(specializationMap).find(
      key => specializationMap[key] === selectedSpec.name
    );
    
    if (!specCode) return [];
    
    const allowedForms = config.studyFormRestrictions[specCode] || [];
    
    const studyForms = [
      { value: 'full_time', label: 'Очная' },
      { value: 'part_time', label: 'Очно-заочная' },
      { value: 'distance', label: 'Заочная' }
    ];
    
    return studyForms.filter(form => allowedForms.includes(form.value));
  };

  const updateDirection = (updates: Partial<PreparationDirection>) => {
    const updatedDirection = { ...currentDirection, ...updates };
    onDirectionsChange([updatedDirection]);
  };

  const availableSpecializations = getAvailableSpecializations();
  const availableStudyForms = getAvailableStudyForms();

  return (
    <div className="space-y-4">
      <Label>Направление подготовки *</Label>
      
      {!educationType && (
        <p className="text-sm text-gray-500">Сначала выберите вид образования</p>
      )}

      {educationType && (
        <div className="grid gap-4 p-4 border rounded-lg">
          {/* Специализация */}
          <div>
            <Label>Специализация *</Label>
            <Select
              value={currentDirection.specialization_id}
              onValueChange={(value) => updateDirection({ 
                specialization_id: value,
                study_form: '' // Сбрасываем форму обучения при смене специализации
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите специализацию" />
              </SelectTrigger>
              <SelectContent>
                {availableSpecializations.map((spec) => (
                  <SelectItem key={spec.id} value={spec.id}>
                    {spec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Форма обучения */}
          {currentDirection.specialization_id && (
            <div>
              <Label>Форма обучения *</Label>
              <Select
                value={currentDirection.study_form}
                onValueChange={(value) => updateDirection({ study_form: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите форму обучения" />
                </SelectTrigger>
                <SelectContent>
                  {availableStudyForms.map((form) => (
                    <SelectItem key={form.value} value={form.value}>
                      {form.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Бюджет/Платно */}
          {currentDirection.study_form && (
            <div>
              <Label>Вид обучения *</Label>
              <RadioGroup
                value={currentDirection.budget ? 'budget' : 'paid'}
                onValueChange={(value) => updateDirection({ budget: value === 'budget' })}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="budget" id="budget" />
                  <Label htmlFor="budget">Бюджетное место</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paid" id="paid" />
                  <Label htmlFor="paid">Платное обучение</Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PreparationDirectionsAccordion;
