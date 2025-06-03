
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { APP_CONSTANTS, Specialization } from '@/constants';
import { Applicant, PreparationDirection } from '@/types/applicant';
import DirectionCard from './direction/DirectionCard';

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
            <DirectionCard
              key={direction.id}
              direction={direction}
              index={index}
              totalDirections={directions.length}
              specializations={specializations}
              onUpdate={updateDirection}
              onMovePriority={movePriority}
              onRemove={removeDirection}
            />
          ))}
      </div>
    </div>
  );
};

export default PreparationDirectionsSection;
