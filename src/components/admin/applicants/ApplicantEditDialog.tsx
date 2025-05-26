
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Applicant } from '@/hooks/useApplicants';
import { ResponsiblePerson, Specialization } from '@/constants';
import { APP_CONSTANTS } from '@/constants';

interface ApplicantEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: Applicant | null;
  onApplicantChange: (applicant: Applicant) => void;
  onSave: () => void;
  responsiblePersons: ResponsiblePerson[];
  specializations: Specialization[];
}

const ApplicantEditDialog = ({ 
  isOpen, 
  onOpenChange, 
  applicant, 
  onApplicantChange, 
  onSave,
  responsiblePersons,
  specializations 
}: ApplicantEditDialogProps) => {
  if (!applicant) return null;

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактировать заявку</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
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
              <Input
                id="edit_contact_phone"
                value={applicant.contact_person_phone || ''}
                onChange={(e) => onApplicantChange({
                  ...applicant,
                  contact_person_phone: e.target.value
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

          {/* Статус */}
          <div>
            <Label htmlFor="edit_status">Статус</Label>
            <Select
              value={applicant.status || 'pending'}
              onValueChange={(value) => onApplicantChange({
                ...applicant,
                status: value
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Ожидает</SelectItem>
                <SelectItem value="under_review">На рассмотрении</SelectItem>
                <SelectItem value="approved">Одобрено</SelectItem>
                <SelectItem value="rejected">Отклонено</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Заметки администратора */}
          <div>
            <Label htmlFor="edit_admin_notes">Заметки администратора</Label>
            <Textarea
              id="edit_admin_notes"
              value={applicant.admin_notes || ''}
              onChange={(e) => onApplicantChange({
                ...applicant,
                admin_notes: e.target.value
              })}
              placeholder="Добавьте заметки..."
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={onSave}>
              Сохранить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantEditDialog;
