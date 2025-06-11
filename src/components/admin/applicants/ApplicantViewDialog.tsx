
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

const getStatusBadge = (status: string | null) => {
  const statusConfig = {
    approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Одобрено' },
    rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Отклонено' },
    under_review: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'На рассмотрении' },
    default: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Ожидает' }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default;
  return <Badge className={`${config.bg} ${config.text}`}>{config.label}</Badge>;
};

const getConstantLabel = (value: string | null, constants: any[]) => {
  if (!value) return 'Не указано';
  const item = constants.find(c => c.value === value);
  return item ? item.label : value;
};

const ApplicantViewDialog = ({ isOpen, onOpenChange, applicant }: ApplicantViewDialogProps) => {
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
                {getConstantLabel(applicant.gender, APP_CONSTANTS.GENDERS)}
              </div>
            </div>
            <div>
              <Label>Гражданство</Label>
              <div className="mt-1 text-sm">{getConstantLabel(applicant.citizenship, APP_CONSTANTS.CITIZENSHIPS)}</div>
            </div>
            <div>
              <Label>Форма обучения</Label>
              <div className="mt-1 text-sm">
                {getConstantLabel(applicant.study_form, APP_CONSTANTS.STUDY_FORMS)}
              </div>
            </div>
            <div>
              <Label>Вид образования</Label>
              <div className="mt-1 text-sm">
                {getConstantLabel(applicant.education_type, APP_CONSTANTS.EDUCATION_TYPES)}
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
              <div className="mt-1 text-sm">{getConstantLabel(applicant.education_document, APP_CONSTANTS.EDUCATION_DOCUMENTS)}</div>
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
            <div className="mt-1 text-sm">{getConstantLabel(applicant.how_did_you_know, APP_CONSTANTS.HOW_DID_YOU_KNOW_OPTIONS)}</div>
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
