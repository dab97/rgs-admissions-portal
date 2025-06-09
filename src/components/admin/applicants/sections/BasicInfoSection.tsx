
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Applicant } from '@/hooks/useApplicants';
import { ResponsiblePerson } from '@/constants';

interface BasicInfoSectionProps {
  applicant: Applicant;
  onApplicantChange: (applicant: Applicant) => void;
  responsiblePersons: ResponsiblePerson[];
}

const BasicInfoSection = ({ 
  applicant, 
  onApplicantChange, 
  responsiblePersons
}: BasicInfoSectionProps) => {
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
              citizenship: e.target.label
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
    </>
  );
};

export default BasicInfoSection;
