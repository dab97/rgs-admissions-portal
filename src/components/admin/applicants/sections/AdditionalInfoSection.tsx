
import React from 'react';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Applicant } from '@/hooks/useApplicants';
import { APP_CONSTANTS } from '@/constants';

interface AdditionalInfoSectionProps {
  applicant: Applicant;
  onApplicantChange: (applicant: Applicant) => void;
}

const AdditionalInfoSection = ({ applicant, onApplicantChange }: AdditionalInfoSectionProps) => {
  return (
    <>
      {/* Дополнительные поля для взрослости и инвалидности */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Совершеннолетний</Label>
          <Select
            value={applicant.is_adult !== null ? applicant.is_adult.toString() : ''}
            onValueChange={(value) => onApplicantChange({
              ...applicant,
              is_adult: value === '' ? null : value === 'true'
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Да</SelectItem>
              <SelectItem value="false">Нет</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Инвалидность</Label>
          <Select
            value={applicant.disability !== null ? applicant.disability.toString() : ''}
            onValueChange={(value) => onApplicantChange({
              ...applicant,
              disability: value === '' ? null : value === 'true'
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Да</SelectItem>
              <SelectItem value="false">Нет</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Контактные лица */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit_contact_name">Контактное лицо</Label>
          <Input
            id="edit_contact_name"
            value={applicant.contact_person_name || ''}
            onChange={(e) => onApplicantChange({
              ...applicant,
              contact_person_name: e.target.value
            })}
          />
        </div>
        <div>
          <Label htmlFor="edit_contact_phone">Телефон контактного лица</Label>
          <PhoneInput
            id="edit_contact_phone"
            value={applicant.contact_person_phone || ''}
            onChange={(value) => onApplicantChange({
              ...applicant,
              contact_person_phone: value
            })}
          />
        </div>
      </div>

      {/* Откуда узнали */}
      <div>
        <Label>Откуда узнали о нас</Label>
        <Select
          value={applicant.how_did_you_know || ''}
          onValueChange={(value) => onApplicantChange({
            ...applicant,
            how_did_you_know: value
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите источник" />
          </SelectTrigger>
          <SelectContent>
            {APP_CONSTANTS.HOW_DID_YOU_KNOW_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default AdditionalInfoSection;
