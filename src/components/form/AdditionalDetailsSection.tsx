
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { APP_CONSTANTS } from '@/constants';
import { User, Phone, Mail, FileText, HelpCircle } from 'lucide-react';

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
  onStreamChange: (value: number | undefined) => void;
  onGenderChange: (value: string) => void;
  onCitizenshipChange: (value: string) => void;
  onIsAdultChange: (value: boolean | undefined) => void;
  onDisabilityChange: (value: boolean | undefined) => void;
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
      <h3 className="text-lg font-semibold text-gray-900">Дополнительная информация</h3>
      
      {/* Первая строка: Поток, Пол, Гражданство */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="stream">Поток</Label>
          <Select
            value={stream?.toString() || ''}
            onValueChange={(value) => onStreamChange(value ? parseInt(value) : undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите поток" />
            </SelectTrigger>
            <SelectContent>
              {APP_CONSTANTS.STREAMS.map((streamOption) => (
                <SelectItem key={streamOption.value} value={streamOption.value.toString()}>
                  {streamOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Пол</Label>
          <Select value={gender} onValueChange={onGenderChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите пол" />
            </SelectTrigger>
            <SelectContent>
              {APP_CONSTANTS.GENDERS.map((genderOption) => (
                <SelectItem key={genderOption.value} value={genderOption.value}>
                  {genderOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Гражданство *</Label>
          <Select value={citizenship} onValueChange={onCitizenshipChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите гражданство" />
            </SelectTrigger>
            <SelectContent>
              {APP_CONSTANTS.CITIZENSHIPS.map((citizenshipOption) => (
                <SelectItem key={citizenshipOption.value} value={citizenshipOption.value}>
                  {citizenshipOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Вторая строка: Совершеннолетие, Инвалидность */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label>Совершеннолетний</Label>
          <RadioGroup 
            value={isAdult?.toString() || ''}
            onValueChange={(value) => onIsAdultChange(value ? value === 'true' : undefined)}
          >
            {APP_CONSTANTS.YES_NO_OPTIONS.map((option) => (
              <div key={option.value.toString()} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`adult-${option.value}`} />
                <Label htmlFor={`adult-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Инвалидность</Label>
          <RadioGroup 
            value={disability?.toString() || ''}
            onValueChange={(value) => onDisabilityChange(value ? value === 'true' : undefined)}
          >
            {APP_CONSTANTS.YES_NO_OPTIONS.map((option) => (
              <div key={option.value.toString()} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`disability-${option.value}`} />
                <Label htmlFor={`disability-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Третья строка: Документ об образовании */}
      <div className="space-y-2">
        <Label htmlFor="educationDocument" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Документ об образовании
        </Label>
        <Select value={educationDocument} onValueChange={onEducationDocumentChange}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите документ об образовании" />
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

      {/* Четвертая строка: Контактное лицо */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contactPersonName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Контактное лицо (ФИО)
          </Label>
          <Input
            id="contactPersonName"
            placeholder="ФИО контактного лица"
            value={contactPersonName}
            onChange={(e) => onContactPersonNameChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPersonPhone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Телефон контактного лица
          </Label>
          <Input
            id="contactPersonPhone"
            placeholder="+375 (29) 123-45-67"
            value={contactPersonPhone}
            onChange={(e) => onContactPersonPhoneChange(e.target.value)}
          />
        </div>
      </div>

      {/* Пятая строка: Как узнали */}
      <div className="space-y-2">
        <Label htmlFor="howDidYouKnow" className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          Как вы о нас узнали?
        </Label>
        <Select value={howDidYouKnow} onValueChange={onHowDidYouKnowChange}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите источник информации" />
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
