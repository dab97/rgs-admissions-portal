
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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

  const getAvailableStudyForms = (budget: boolean) => {
    if (!educationType) return [];
    
    const config = APP_CONSTANTS.SPECIALIZATIONS_CONFIG[educationType as 'bachelor' | 'master'];
    if (!config) return [];
    
    const studyForms = [
      { value: 'full_time', label: 'Очная', budget: true, paid: true },
      { value: 'part_time', label: 'Заочная', budget: false, paid: true },
      { value: 'distance', label: 'Дистанционная', budget: false, paid: true }
    ];
    
    return studyForms.filter(form => 
      budget ? form.budget : form.paid
    );
  };

  const updateDirection = (updates: Partial<PreparationDirection>) => {
    const updatedDirection = { ...currentDirection, ...updates };
    onDirectionsChange([updatedDirection]);
  };

  const availableSpecializations = getAvailableSpecializations();

  return (
    <div className="space-y-4">
      <Label>Направление подготовки *</Label>
      
      {!educationType && (
        <p className="text-sm text-gray-500">Сначала выберите вид образования</p>
      )}

      {educationType && (
        <div className="grid gap-4 p-4 border rounded-lg">
          {/* Бюджет/Платно */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="budget"
              checked={currentDirection.budget}
              onCheckedChange={(checked) => 
                updateDirection({ 
                  budget: checked as boolean,
                  study_form: '' // Сбрасываем форму обучения при смене бюджета
                })
              }
            />
            <Label htmlFor="budget">
              Бюджетное место
            </Label>
          </div>

          {/* Форма обучения */}
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
                {getAvailableStudyForms(currentDirection.budget).map((form) => (
                  <SelectItem key={form.value} value={form.value}>
                    {form.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Специализация */}
          <div>
            <Label>Специализация *</Label>
            <Select
              value={currentDirection.specialization_id}
              onValueChange={(value) => updateDirection({ specialization_id: value })}
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
        </div>
      )}
    </div>
  );
};

export default PreparationDirectionsAccordion;
