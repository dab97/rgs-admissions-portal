
import React from 'react';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
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
    
    // Fix: Access study forms from the configuration
    const studyForms = [
      { value: 'full_time', label: 'Очная', budget: true, paid: true },
      { value: 'part_time', label: 'Заочная', budget: false, paid: true },
      { value: 'distance', label: 'Дистанционная', budget: false, paid: true }
    ];
    
    return studyForms.filter(form => 
      budget ? form.budget : form.paid
    );
  };

  const addDirection = () => {
    const newDirection: PreparationDirection = {
      id: `direction-${Date.now()}`,
      budget: false,
      study_form: '',
      specialization_id: '',
      priority: directions.length + 1
    };
    onDirectionsChange([...directions, newDirection]);
  };

  const removeDirection = (id: string) => {
    const updatedDirections = directions
      .filter(d => d.id !== id)
      .map((d, index) => ({ ...d, priority: index + 1 }));
    onDirectionsChange(updatedDirections);
  };

  const updateDirection = (id: string, updates: Partial<PreparationDirection>) => {
    const updatedDirections = directions.map(d => 
      d.id === id ? { ...d, ...updates } : d
    );
    onDirectionsChange(updatedDirections);
  };

  const availableSpecializations = getAvailableSpecializations();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Направления подготовки *</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDirection}
          disabled={!educationType}
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить направление
        </Button>
      </div>
      
      {!educationType && (
        <p className="text-sm text-gray-500">Сначала выберите вид образования</p>
      )}

      <Accordion type="multiple" className="w-full">
        {directions.map((direction, index) => (
          <AccordionItem key={direction.id} value={direction.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full mr-4">
                <span>
                  Направление {direction.priority}
                  {direction.specialization_id && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({availableSpecializations.find(s => s.id === direction.specialization_id)?.name})
                    </span>
                  )}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDirection(direction.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid gap-4 p-4">
                {/* Бюджет/Платно */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`budget-${direction.id}`}
                    checked={direction.budget}
                    onCheckedChange={(checked) => 
                      updateDirection(direction.id, { 
                        budget: checked as boolean,
                        study_form: '' // Сбрасываем форму обучения при смене бюджета
                      })
                    }
                  />
                  <Label htmlFor={`budget-${direction.id}`}>
                    Бюджетное место
                  </Label>
                </div>

                {/* Форма обучения */}
                <div>
                  <Label>Форма обучения *</Label>
                  <Select
                    value={direction.study_form}
                    onValueChange={(value) => updateDirection(direction.id, { study_form: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите форму обучения" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableStudyForms(direction.budget).map((form) => (
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
                    value={direction.specialization_id}
                    onValueChange={(value) => updateDirection(direction.id, { specialization_id: value })}
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
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {directions.length === 0 && educationType && (
        <p className="text-sm text-gray-500 text-center py-4">
          Нажмите "Добавить направление" для выбора специализаций
        </p>
      )}
    </div>
  );
};

export default PreparationDirectionsAccordion;
