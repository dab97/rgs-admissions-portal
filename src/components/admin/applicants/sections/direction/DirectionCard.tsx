
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { APP_CONSTANTS, Specialization } from '@/constants';
import { PreparationDirection } from '@/types/applicant';
import DirectionControls from './DirectionControls';
import DirectionForm from './DirectionForm';

interface DirectionCardProps {
  direction: PreparationDirection;
  index: number;
  totalDirections: number;
  specializations: Specialization[];
  onUpdate: (directionId: string, updates: Partial<PreparationDirection>) => void;
  onMovePriority: (directionId: string, direction: 'up' | 'down') => void;
  onRemove: (directionId: string) => void;
}

const DirectionCard = ({
  direction,
  index,
  totalDirections,
  specializations,
  onUpdate,
  onMovePriority,
  onRemove
}: DirectionCardProps) => {
  const getSpecializationNames = (specializationIds: string[]) => {
    return specializationIds
      .map(id => specializations.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const getStudyFormLabel = (value: string) => {
    return APP_CONSTANTS.STUDY_FORMS.find(f => f.value === value)?.label || value;
  };

  const getDirectionDisplayText = () => {
    const specs = direction.specializationIds.length > 0 
      ? getSpecializationNames(direction.specializationIds)
      : 'Не выбрано';
    
    const budgetText = direction.budget ? 'Бюджет' : 'Платное';
    const studyFormText = direction.studyForm ? 
      getStudyFormLabel(direction.studyForm) :
      'Форма не выбрана';
    
    return `${specs} (${budgetText}, ${studyFormText})`;
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-medium">
              Приоритет {direction.priority}
            </Badge>
            <span className="text-sm font-medium text-gray-700">
              {getDirectionDisplayText()}
            </span>
          </div>
          <DirectionControls
            directionId={direction.id}
            index={index}
            totalDirections={totalDirections}
            onMovePriority={onMovePriority}
            onRemove={onRemove}
          />
        </div>

        <DirectionForm
          direction={direction}
          specializations={specializations}
          onUpdate={onUpdate}
        />
      </CardContent>
    </Card>
  );
};

export default DirectionCard;
