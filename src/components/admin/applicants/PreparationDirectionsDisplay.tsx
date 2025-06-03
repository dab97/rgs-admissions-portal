
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PreparationDirection } from '@/types/applicant';
import { APP_CONSTANTS, Specialization } from '@/constants';

interface PreparationDirectionsDisplayProps {
  directions: PreparationDirection[];
  specializations: Specialization[];
  isEditable?: boolean;
}

const PreparationDirectionsDisplay = ({ 
  directions, 
  specializations, 
  isEditable = false 
}: PreparationDirectionsDisplayProps) => {
  const getSpecializationNames = (specializationIds: string[]) => {
    return specializationIds
      .map(id => specializations.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getStudyFormLabel = (value: string) => {
    return APP_CONSTANTS.STUDY_FORMS.find(f => f.value === value)?.label || value;
  };

  const getDirectionDisplayText = (direction: PreparationDirection) => {
    const specs = direction.specializationIds.length > 0 
      ? getSpecializationNames(direction.specializationIds)
      : 'Не выбрано';
    
    const budgetText = direction.budget ? 'Бюджет' : 'Платное';
    const studyFormText = direction.studyForm ? 
      getStudyFormLabel(direction.studyForm) :
      'Форма не выбрана';
    
    return `${specs} (${budgetText}, ${studyFormText})`;
  };

  if (!directions || directions.length === 0) {
    return (
      <div>
        <Label>Направления подготовки</Label>
        <div className="mt-1 text-sm text-gray-500">Не указано</div>
      </div>
    );
  }

  return (
    <div>
      <Label>Направления подготовки</Label>
      <div className="mt-2 space-y-3">
        {directions
          .sort((a, b) => a.priority - b.priority)
          .map((direction) => (
            <Card key={direction.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="font-medium">
                    Приоритет {direction.priority}
                  </Badge>
                </div>
                
                <div className="text-sm font-medium text-gray-700">
                  {getDirectionDisplayText(direction)}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default PreparationDirectionsDisplay;
