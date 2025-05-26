
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Applicant } from '@/hooks/useApplicants';
import { APP_CONSTANTS } from '@/constants';

interface ApplicantViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: Applicant | null;
}

const ApplicantViewDialog = ({ isOpen, onOpenChange, applicant }: ApplicantViewDialogProps) => {
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Одобрено</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Отклонено</Badge>;
      case 'under_review':
        return <Badge className="bg-blue-100 text-blue-700">На рассмотрении</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700">Ожидает</Badge>;
    }
  };

  const getEducationDocumentLabel = (value: string | null) => {
    const doc = APP_CONSTANTS.EDUCATION_DOCUMENTS.find(d => d.value === value);
    return doc ? doc.label : value || 'Не указан';
  };

  const getHowDidYouKnowLabel = (value: string | null) => {
    const option = APP_CONSTANTS.HOW_DID_YOU_KNOW_OPTIONS.find(o => o.value === value);
    return option ? option.label : value || 'Не указано';
  };

  if (!applicant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Детали заявки</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ФИО</Label>
              <div className="mt-1 text-sm">{applicant.full_name}</div>
            </div>
            <div>
              <Label>Телефон</Label>
              <div className="mt-1 text-sm">{applicant.phone}</div>
            </div>
            <div>
              <Label>Email</Label>
              <div className="mt-1 text-sm">{applicant.email || 'Не указан'}</div>
            </div>
            <div>
              <Label>Пол</Label>
              <div className="mt-1 text-sm">
                {applicant.gender ? 
                  APP_CONSTANTS.GENDERS.find(g => g.value === applicant.gender)?.label || applicant.gender 
                  : 'Не указан'
                }
              </div>
            </div>
            <div>
              <Label>Гражданство</Label>
              <div className="mt-1 text-sm">{applicant.citizenship || 'Не указано'}</div>
            </div>
            <div>
              <Label>Форма обучения</Label>
              <div className="mt-1 text-sm">
                {APP_CONSTANTS.STUDY_FORMS.find(f => f.value === applicant.study_form)?.label || applicant.study_form}
              </div>
            </div>
            <div>
              <Label>Вид образования</Label>
              <div className="mt-1 text-sm">
                {APP_CONSTANTS.EDUCATION_TYPES.find(t => t.value === applicant.education_type)?.label || applicant.education_type}
              </div>
            </div>
            <div>
              <Label>Бюджет</Label>
              <div className="mt-1 text-sm">{applicant.budget ? 'Да' : 'Нет'}</div>
            </div>
            <div>
              <Label>Поток</Label>
              <div className="mt-1 text-sm">{applicant.stream || 'Не указан'}</div>
            </div>
            <div>
              <Label>Совершеннолетний</Label>
              <div className="mt-1 text-sm">
                {applicant.is_adult !== null ? (applicant.is_adult ? 'Да' : 'Нет') : 'Не указано'}
              </div>
            </div>
            <div>
              <Label>Инвалидность</Label>
              <div className="mt-1 text-sm">
                {applicant.disability !== null ? (applicant.disability ? 'Да' : 'Нет') : 'Не указано'}
              </div>
            </div>
            <div>
              <Label>Документ об образовании</Label>
              <div className="mt-1 text-sm">{getEducationDocumentLabel(applicant.education_document)}</div>
            </div>
          </div>
          
          <div>
            <Label>Специализации</Label>
            <div className="mt-1 text-sm">{applicant.specializations?.join(', ') || 'Не указано'}</div>
          </div>

          {(applicant.contact_person_name || applicant.contact_person_phone) && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Контактное лицо</Label>
                <div className="mt-1 text-sm">{applicant.contact_person_name || 'Не указано'}</div>
              </div>
              <div>
                <Label>Телефон контактного лица</Label>
                <div className="mt-1 text-sm">{applicant.contact_person_phone || 'Не указан'}</div>
              </div>
            </div>
          )}

          <div>
            <Label>Откуда узнали о нас</Label>
            <div className="mt-1 text-sm">{getHowDidYouKnowLabel(applicant.how_did_you_know)}</div>
          </div>

          <div>
            <Label>Статус</Label>
            <div className="mt-1">{getStatusBadge(applicant.status)}</div>
          </div>
          
          {applicant.admin_notes && (
            <div>
              <Label>Заметки администратора</Label>
              <div className="mt-1 text-sm bg-gray-50 p-2 rounded">{applicant.admin_notes}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicantViewDialog;
