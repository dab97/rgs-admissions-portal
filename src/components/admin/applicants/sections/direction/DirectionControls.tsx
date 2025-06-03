
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, X } from 'lucide-react';

interface DirectionControlsProps {
  directionId: string;
  index: number;
  totalDirections: number;
  onMovePriority: (directionId: string, direction: 'up' | 'down') => void;
  onRemove: (directionId: string) => void;
}

const DirectionControls = ({
  directionId,
  index,
  totalDirections,
  onMovePriority,
  onRemove
}: DirectionControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onMovePriority(directionId, 'up')}
        disabled={index === 0}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onMovePriority(directionId, 'down')}
        disabled={index === totalDirections - 1}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(directionId)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default DirectionControls;
