
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { APP_CONSTANTS, Specialization } from '@/constants';

export interface PreparationDirection {
  id: string;
  budget: boolean;
  studyForm: string;
  specializationIds: string[];
  priority: number;
}

interface PreparationDirectionsSectionProps {
  directions: PreparationDirection[];
  specializations: Specialization[];
  educationType: string;
  onDirectionsChange: (directions: PreparationDirection[]) => void;
}

const PreparationDirectionsSection = ({
  directions,
  specializations,
  educationType,
  onDirectionsChange
}: PreparationDirectionsSectionProps) => {
  const [openAccordion, setOpenAccordion] = useState<string>('');

  const addDirection = () => {
    if (directions.length >= 5) return;
    
    const newDirection: PreparationDirection = {
      id: `direction-${Date.now()}`,
      budget: false,
      studyForm: '',
      specializationIds: [],
      priority: directions.length + 1
    };
    
    onDirectionsChange([...directions, newDirection]);
    setOpenAccordion(newDirection.id);
  };

  const removeDirection = (directionId: string) => {
    const filteredDirections = directions.filter(d => d.id !== directionId);
    // Пересчитываем приоритеты
    const updatedDirections = filteredDirections.map((direction, index) => ({
      ...direction,
      priority: index + 1
    }));
    onDirectionsChange(updatedDirections);
  };

  const updateDirection = (directionId: string, updates: Partial<PreparationDirection>) => {
    const updatedDirections = directions.map(direction =>
      direction.id === directionId ? { ...direction, ...updates } : direction
    );
    onDirectionsChange(updatedDirections);
  };

  const movePriority = (directionId: string, direction: 'up' | 'down') => {
    const currentIndex = directions.findIndex(d => d.id === directionId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= directions.length) return;
    
    const newDirections = [...directions];
    [newDirections[currentIndex], newDirections[newIndex]] = [newDirections[newIndex], newDirections[currentIndex]];
    
    // Обновляем приоритеты
    const updatedDirections = newDirections.map((dir, index) => ({
      ...dir,
      priority: index + 1
    }));
    
    onDirectionsChange(updatedDirections);
  };

  const getAvailableStudyForms = (selectedSpecIds: string[]) => {
    if (!educationType || selectedSpecIds.length === 0) {
      return APP_CONSTANTS.STUDY_FORMS;
    }

    const config = APP_CONSTANTS.SPECIALIZATIONS_CONFIG[educationType as 'bachelor' | 'master'];
    if (!config) return APP_CONSTANTS.STUDY_FORMS;

    const specializationMap: { [key: string]: string } = {
      'psychology': 'Психология',
      'management': 'Менеджмент', 
      'social_work': 'Социальная работа',
      'law': 'Юриспруденция'
    };

    const selectedSpecCodes = selectedSpecIds
      .map(id => {
        const spec = specializations.find(s => s.id === id);
        return spec ? Object.keys(specializationMap).find(
          key => specializationMap[key] === spec.name
        ) : null;
      })
      .filter(Boolean) as string[];

    if (selectedSpecCodes.length === 0) return APP_CONSTANTS.STUDY_FORMS;

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

  const getDirectionDisplayText = (direction: PreparationDirection) => {
    const availableSpecializations = getAvailableSpecializations();
    const specs = direction.specializationIds.length > 0 
      ? availableSpecializations
          .filter(s => direction.specializationIds.includes(s.id))
          .map(s => s.name)
          .join(', ')
      : 'Не выбрано';
    
    const budgetText = direction.budget ? 'Бюджет' : 'Платное';
    const studyFormText = direction.studyForm ? 
      APP_CONSTANTS.STUDY_FORMS.find(f => f.value === direction.studyForm)?.label || direction.studyForm :
      'Форма не выбрана';
    
    return `${specs} (${budgetText}, ${studyFormText})`;
  };

  const availableSpecializations = getAvailableSpecializations();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Направления подготовки *</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDirection}
          disabled={directions.length >= 5}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Добавить направление ({directions.length}/5)
        </Button>
      </div>

      {!educationType && (
        <p className="text-sm text-gray-500">Сначала выберите вид образования</p>
      )}

      {directions.length === 0 && educationType && (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Добавьте первое направление подготовки</p>
              <Button onClick={addDirection} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Добавить направление
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Accordion type="single" value={openAccordion} onValueChange={setOpenAccordion}>
        {directions.map((direction, index) => (
          <AccordionItem key={direction.id} value={direction.id}>
            <Card className="mb-2">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center justify-between w-full mr-4">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">
                      Приоритет {direction.priority}: {getDirectionDisplayText(direction)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        movePriority(direction.id, 'up');
                      }}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        movePriority(direction.id, 'down');
                      }}
                      disabled={index === directions.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDirection(direction.id);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  {/* Бюджет */}
                  <div className="space-y-2">
                    <Label>Бюджет *</Label>
                    <RadioGroup 
                      value={direction.budget.toString()}
                      onValueChange={(value) => updateDirection(direction.id, { budget: value === 'true' })}
                    >
                      {APP_CONSTANTS.YES_NO_OPTIONS.map((option) => (
                        <div key={option.value.toString()} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value.toString()} id={`budget-${direction.id}-${option.value}`} />
                          <Label htmlFor={`budget-${direction.id}-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Специализации */}
                  <div className="space-y-2">
                    <Label>Специализации *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {availableSpecializations.map((specialization) => (
                        <div key={specialization.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${direction.id}-${specialization.id}`}
                            checked={direction.specializationIds.includes(specialization.id)}
                            onCheckedChange={(checked) => {
                              const newSpecIds = checked
                                ? [...direction.specializationIds, specialization.id]
                                : direction.specializationIds.filter(id => id !== specialization.id);
                              updateDirection(direction.id, { 
                                specializationIds: newSpecIds,
                                studyForm: '' // Сбрасываем форму обучения при изменении специализаций
                              });
                            }}
                          />
                          <Label htmlFor={`${direction.id}-${specialization.id}`} className="text-sm">
                            {specialization.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Форма обучения */}
                  <div className="space-y-2">
                    <Label>Форма обучения *</Label>
                    {direction.specializationIds.length === 0 && (
                      <p className="text-sm text-gray-500">Сначала выберите специализацию</p>
                    )}
                    <RadioGroup 
                      value={direction.studyForm}
                      onValueChange={(value) => updateDirection(direction.id, { studyForm: value })}
                    >
                      {getAvailableStudyForms(direction.specializationIds).map((form) => (
                        <div key={form.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={form.value} id={`${direction.id}-${form.value}`} />
                          <Label htmlFor={`${direction.id}-${form.value}`}>{form.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default PreparationDirectionsSection;
