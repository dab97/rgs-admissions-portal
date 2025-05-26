
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Applicant } from '@/hooks/useApplicants';
import { APP_CONSTANTS } from '@/constants';

interface EducationSectionProps {
  applicant: Applicant;
  onApplicantChange: (applicant: Applicant) => void;
}

const EducationSection = ({ applicant, onApplicantChange }: EducationSectionProps) => {
  return (
    <>
      {/* Форма обучения и образование */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Форма обучения</Label>
          <Select
            value={applicant.study_form}
            onValueChange={(value) => onApplicantChange({
              ...applicant,
              study_form: value
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {APP_CONSTANTS.STUDY_FORMS.map((form) => (
                <SelectItem key={form.value} value={form.value}>
                  {form.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Вид образования</Label>
          <Select
            value={applicant.education_type}
            onValueChange={(value) => onApplicantChange({
              ...applicant,
              education_type: value
            })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {APP_CONSTANTS.EDUCATION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Бюджет</Label>
          <RadioGroup 
            value={applicant.budget.toString()}
            onValueChange={(value) => onApplicantChange({
              ...applicant,
              budget: value === 'true'
            })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="edit_budget_yes" />
              <Label htmlFor="edit_budget_yes">Да</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="edit_budget_no" />
              <Label htmlFor="edit_budget_no">Нет</Label>
            </div>
          </RadioGroup>
        </div>
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
