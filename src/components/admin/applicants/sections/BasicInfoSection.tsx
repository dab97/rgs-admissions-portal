
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Applicant } from '@/hooks/useApplicants';
import { ResponsiblePerson, Specialization } from '@/constants';

interface BasicInfoSectionProps {
  applicant: Applicant;
  onApplicantChange: (applicant: Applicant) => void;
  responsiblePersons: ResponsiblePerson[];
  specializations: Specialization[];
}

const BasicInfoSection = ({ 
  applicant, 
  onApplicantChange, 
  responsiblePersons, 
  specializations 
}: BasicInfoSectionProps) => {
  const handleSpecializationChange = (specializationId: string, checked: boolean) => {
    const currentIds = Array.isArray(applicant.specialization_ids) 
      ? applicant.specialization_ids 
      : [];
    
    onApplicantChange({
      ...applicant,
      specialization_ids: checked 
        ? [...currentIds, specializationId]
        : currentIds.filter(id => id !== specializationId)
    });
  };

  return (
    <>
      {/* Основная информация */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit_full_name">ФИО</Label>
          <Input
            id="edit_full_name"
            value={applicant.full_name}
            onChange={(e) => onApplicantChange({
              ...applicant,
              full_name: e.target.value
            })}
          />
        </div>
        <div>
          <Label htmlFor="edit_phone">Телефон</Label>
          <Input
            id="edit_phone"
            value={applicant.phone}
            onChange={(e) => onApplicantChange({
              ...applicant,
              phone: e.target.value
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit_email">Email</Label>
          <Input
            id="edit_email"
            type="email"
            value={applicant.email || ''}
            onChange={(e) => onApplicantChange({
              ...applicant,
              email: e.target.value
            })}
          />
        </div>
        <div>
          <Label htmlFor="edit_citizenship">Гражданство</Label>
          <Input
            id="edit_citizenship"
            value={applicant.citizenship || ''}
            onChange={(e) => onApplicantChange({
              ...applicant,
              citizenship: e.target.value
            })}
          />
        </div>
      </div>

      {/* Ответственный */}
      <div>
        <Label htmlFor="edit_responsible">Ответственный</Label>
        <Select
          value={applicant.responsible_id}
          onValueChange={(value) => onApplicantChange({
            ...applicant,
            responsible_id: value
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {responsiblePersons.map((person) => (
              <SelectItem key={person.id} value={person.id}>
                {person.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Специализации */}
      <div>
        <Label>Специализации</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {specializations.map((spec) => (
            <div key={spec.id} className="flex items-center space-x-2">
              <Checkbox
                id={`edit_spec_${spec.id}`}
                checked={Array.isArray(applicant.specialization_ids) && applicant.specialization_ids.includes(spec.id)}
                onCheckedChange={(checked) => handleSpecializationChange(spec.id, checked as boolean)}
              />
              <Label htmlFor={`edit_spec_${spec.id}`} className="text-sm">
                {spec.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BasicInfoSection;
