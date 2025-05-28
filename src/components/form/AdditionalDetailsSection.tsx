
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { APP_CONSTANTS } from '@/constants';

interface AdditionalDetailsSectionProps {
  stream?: number;
  gender: string;
  citizenship: string;
  isAdult?: boolean;
  disability?: boolean;
  educationDocument: string;
  contactPersonName: string;
  contactPersonPhone: string;
  howDidYouKnow: string;
  onStreamChange: (value: number) => void;
  onGenderChange: (value: string) => void;
  onCitizenshipChange: (value: string) => void;
  onIsAdultChange: (value: boolean) => void;
  onDisabilityChange: (value: boolean) => void;
  onEducationDocumentChange: (value: string) => void;
  onContactPersonNameChange: (value: string) => void;
  onContactPersonPhoneChange: (value: string) => void;
  onHowDidYouKnowChange: (value: string) => void;
}

const AdditionalDetailsSection = ({
  stream,
  gender,
  citizenship,
  isAdult,
  disability,
  educationDocument,
  contactPersonName,
  contactPersonPhone,
  howDidYouKnow,
  onStreamChange,
  onGenderChange,
  onCitizenshipChange,
  onIsAdultChange,
  onDisabilityChange,
  onEducationDocumentChange,
  onContactPersonNameChange,
  onContactPersonPhoneChange,
  onHowDidYouKnowChange
}: AdditionalDetailsSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Дополнительная информация */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Label>Поток</Label>
          <Select onValueChange={(value) => onStreamChange(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите поток" />
            </SelectTrigger>
            <SelectContent>
              {APP_CONSTANTS.STREAMS.map((stream) => (
                <SelectItem key={stream.value} value={stream.value.toString()}>
                  {stream.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Пол</Label>
          <Select onValueChange={onGenderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите пол" />
            </SelectTrigger>
            <SelectContent>
              {APP_CONSTANTS.GENDERS.map((gender) => (
                <SelectItem key={gender.value} value={gender.value}>
                  {gender.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Гражданство</Label>
          <Input
            placeholder="Беларусь"
            value={citizenship}
            onChange={(e) => onCitizenshipChange(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label>Совершеннолетний</Label>
          <RadioGroup 
            value={isAdult?.toString() || ''}
            onValueChange={(value) => onIsAdultChange(value === 'true')}
          >
            {APP_CONSTANTS.YES_NO_OPTIONS.map((option) => (
              <div key={option.value.toString()} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`adult-${option.value}`} />
                <Label htmlFor={`adult-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Инвалидность и документ об образовании */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label>Инвалидность</Label>
          <RadioGroup 
            value={disability?.toString() || ''}
            onValueChange={(value) => onDisabilityChange(value === 'true')}
          >
            {APP_CONSTANTS.YES_NO_OPTIONS.map((option) => (
              <div key={option.value.toString()} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`disability-${option.value}`} />
                <Label htmlFor={`disability-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Документ об образовании</Label>
          <Select onValueChange={onEducationDocumentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите документ" />
            </SelectTrigger>
            <SelectContent>
              {APP_CONSTANTS.EDUCATION_DOCUMENTS.map((doc) => (
                <SelectItem key={doc.value} value={doc.value}>
                  {doc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Контактное лицо */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Ф.И.О. Контактного лица</Label>
          <Input
            placeholder="Введите ФИО"
            value={contactPersonName}
            onChange={(e) => onContactPersonNameChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Телефон Контактного лица</Label>
          <Input
            placeholder="+375 (29) 123-45-67"
            value={contactPersonPhone}
            onChange={(e) => onContactPersonPhoneChange(e.target.value)}
          />
        </div>
      </div>

      {/* Откуда узнали */}
      <div className="space-y-2">
        <Label>Откуда узнали о нас?</Label>
        <Select onValueChange={onHowDidYouKnowChange}>
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
    </div>
  );
};

export default AdditionalDetailsSection;
