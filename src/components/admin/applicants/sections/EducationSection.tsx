
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Applicant } from '@/hooks/useApplicants';
import { APP_CONSTANTS } from '@/constants';

interface EducationSectionProps {
  applicant: Applicant;
  onApplicantChange: (applicant: Applicant) => void;
}

const EducationSection = ({ applicant, onApplicantChange }: EducationSectionProps) => {
  return (
    <>
      {/* Документ об образовании */}
      <div>
        <Label>Документ об образовании</Label>
        <Select
          value={applicant.education_document || ''}
          onValueChange={(value) => onApplicantChange({
            ...applicant,
            education_document: value
          })}
        >
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

      {/* Дополнительные поля */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Пол</Label>
          <Select
            value={applicant.gender || ''}
            onValueChange={(value) => onApplicantChange({
              ...applicant,
              gender: value
            })}
          >
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
        <div>
          <Label>Поток</Label>
          <Select
            value={applicant.stream?.toString() || ''}
            onValueChange={(value) => onApplicantChange({
              ...applicant,
              stream: value ? parseInt(value) : null
            })}
          >
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
      </div>
    </>
  );
};

export default EducationSection;
