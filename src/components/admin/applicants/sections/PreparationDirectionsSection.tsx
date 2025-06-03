import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { APP_CONSTANTS, Specialization } from '@/constants';
import { Applicant, PreparationDirection } from '@/types/applicant';

interface PreparationDirectionsSectionProps {
  applicant: Applicant;
  onApplicantChange: (applicant: Applicant) => void;
  specializations: Specialization[];
}

const PreparationDirectionsSection = ({
  applicant,
  onApplicantChange,
  specializations
}: PreparationDirectionsSectionProps) => {
  const directions = applicant.preparation_directions || [];

  const addDirection = () => {
    if (directions.length >= 5) return;
    
    const newDirection: PreparationDirection = {
      id: `direction-${Date.now()}`,
      budget: false,
      studyForm: '',
      specializationIds: [],
      priority: directions.length + 1
    };
    
    onApplicantChange({
      ...applicant,
      preparation_directions: [...directions, newDirection]
    });
  };

  const removeDirection = (directionId: string) => {
    const filteredDirections = directions.filter(d => d.id !== directionId);
    const updatedDirections = filteredDirections.map((direction, index) => ({
      ...direction,
      priority: index + 1
    }));
    
    onApplicantChange({
      ...applicant,
      preparation_directions: updatedDirections
    });
  };

  const updateDirection = (directionId: string, updates: Partial<PreparationDirection>) => {
    const updatedDirections = directions.map(direction =>
      direction.id === directionId ? { ...direction, ...updates } : direction
    );
    
    onApplicantChange({
      ...applicant,
      preparation_directions: updatedDirections
    });
  };

  const movePriority = (directionId: string, direction: 'up' | 'down') => {
    const currentIndex = directions.findIndex(d => d.id === directionId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= directions.length) return;
    
    const newDirections = [...directions];
    [newDirections[currentIndex], newDirections[newIndex]] = [newDirections[newIndex], newDirections[currentIndex]];
    
    const updatedDirections = newDirections.map((dir, index) => ({
      ...dir,
      priority: index + 1
    }));
    
    onApplicantChange({
      ...applicant,
      preparation_directions: updatedDirections
    });
  };

  const getSpecializationNames = (specializationIds: string[]) => {
    return specializationIds
      .map(id => specializations.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getStudyFormLabel = (value: string) => {
    return APP_CONSTANTS.STUDY_FORMS.find(f => f.value === value)?.label || value;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Направления подготовки</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDirection}
          disabled={directions.length >= 5}
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить ({directions.length}/5)
        </Button>
      </div>

      <div className="space-y-3">
        {directions
          .sort((a, b) => a.priority - b.priority)
          .map((direction, index) => (
            <Card key={direction.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-medium">
                      Приоритет {direction.priority}
                    </Badge>
                    <Badge 
                      variant={direction.budget ? "default" : "secondary"}
                      className={direction.budget ? "bg-green-100 text-green-700 border-green-200" : "bg-blue-100 text-blue-700 border-blue-200"}
                    >
                      {direction.budget ? 'Бюджет' : 'Платное'}
                    </Badge>
                    {direction.studyForm && (
                      <Badge variant="outline" className="text-xs">
                        {getStudyFormLabel(direction.studyForm)}
                      </Badge>
                    )}
                    {direction.specializationIds.length > 0 && (
                      <span className="text-sm text-gray-600">
                        {getSpecializationNames(direction.specializationIds)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => movePriority(direction.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => movePriority(direction.id, 'down')}
                      disabled={index === directions.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDirection(direction.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm">Бюджет</Label>
                    <RadioGroup 
                      value={direction.budget.toString()}
                      onValueChange={(value) => updateDirection(direction.id, { budget: value === 'true' })}
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
                      onValueChange={(value) => updateDirection(direction.id, { studyForm: value })}
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
                              updateDirection(direction.id, { specializationIds: newSpecIds });
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
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default PreparationDirectionsSection;
