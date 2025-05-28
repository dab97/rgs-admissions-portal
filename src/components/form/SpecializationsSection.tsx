
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Specialization } from '@/constants';
import { APP_CONSTANTS } from '@/constants';

interface SpecializationsSectionProps {
  specializations: Specialization[];
  selectedSpecializationIds: string[];
  educationType: string;
  onSpecializationChange: (specializationId: string, checked: boolean) => void;
}

const SpecializationsSection = ({
  specializations,
  selectedSpecializationIds,
  educationType,
  onSpecializationChange
}: SpecializationsSectionProps) => {
  // Фильтруем специализации в зависимости от типа образования
  const getAvailableSpecializations = () => {
    if (!educationType) return specializations;
    
    const config = APP_CONSTANTS.SPECIALIZATIONS_CONFIG[educationType as 'bachelor' | 'master'];
    if (!config) return specializations;
    
    // Создаем маппинг названий к кодам
    const specializationMap: { [key: string]: string } = {
      'psychology': 'Психология',
      'management': 'Менеджмент', 
      'social_work': 'Социальная работа',
      'law': 'Юриспруденция'
    };
    
    return specializations.filter(spec => {
      // Проверяем по названию специализации
      const specCode = Object.keys(specializationMap).find(
        key => specializationMap[key] === spec.name
      );
      return specCode && config.available.includes(specCode);
    });
  };

  const availableSpecializations = getAvailableSpecializations();

  return (
    <div className="space-y-3">
      <Label>Направления подготовки *</Label>
      {!educationType && (
        <p className="text-sm text-gray-500">Сначала выберите вид образования</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {availableSpecializations.map((specialization) => (
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
