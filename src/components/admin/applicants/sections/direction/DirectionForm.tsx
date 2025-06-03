
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { APP_CONSTANTS, Specialization } from '@/constants';
import { PreparationDirection } from '@/types/applicant';

interface DirectionFormProps {
  direction: PreparationDirection;
  specializations: Specialization[];
  onUpdate: (directionId: string, updates: Partial<PreparationDirection>) => void;
}

const DirectionForm = ({ direction, specializations, onUpdate }: DirectionFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label className="text-sm">Бюджет</Label>
        <RadioGroup 
          value={direction.budget.toString()}
          onValueChange={(value) => onUpdate(direction.id, { budget: value === 'true' })}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id={`budget-${direction.id}-true`} />
            <Label htmlFor={`budget-${direction.id}-true`} className="text-sm">Да</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id={`budget-${direction.id}-false`} />
            <Label htmlFor={`budget-${direction.id}-false`} className="text-sm">Нет</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-sm">Форма обучения</Label>
        <Select 
          value={direction.studyForm} 
          onValueChange={(value) => onUpdate(direction.id, { studyForm: value })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Выберите форму" />
          </SelectTrigger>
          <SelectContent>
            {APP_CONSTANTS.STUDY_FORMS.map((form) => (
              <SelectItem key={form.value} value={form.value}>
                {form.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm">Специализации</Label>
        <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
          {specializations.map((specialization) => (
            <div key={specialization.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${direction.id}-${specialization.id}`}
                checked={direction.specializationIds.includes(specialization.id)}
                onCheckedChange={(checked) => {
                  const newSpecIds = checked
                    ? [...direction.specializationIds, specialization.id]
                    : direction.specializationIds.filter(id => id !== specialization.id);
                  onUpdate(direction.id, { specializationIds: newSpecIds });
                }}
              />
              <Label htmlFor={`${direction.id}-${specialization.id}`} className="text-sm">
                {specialization.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DirectionForm;
