
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Specialization } from '@/constants';

interface SpecializationsSectionProps {
  specializations: Specialization[];
  selectedSpecializationIds: string[];
  onSpecializationChange: (specializationId: string, checked: boolean) => void;
}

const SpecializationsSection = ({
  specializations,
  selectedSpecializationIds,
  onSpecializationChange
}: SpecializationsSectionProps) => {
  return (
    <div className="space-y-3">
      <Label>Направления подготовки *</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {specializations.map((specialization) => (
          <div key={specialization.id} className="flex items-center space-x-2">
            <Checkbox
              id={specialization.id}
              checked={selectedSpecializationIds.includes(specialization.id)}
              onCheckedChange={(checked) => 
                onSpecializationChange(specialization.id, checked as boolean)
              }
            />
            <Label htmlFor={specialization.id} className="text-sm">
              {specialization.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecializationsSection;
