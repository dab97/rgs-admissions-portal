import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Applicant } from '@/types/applicant';

interface StatusSectionProps {
  applicant: Applicant;
  onApplicantChange: (applicant: Applicant) => void;
}

const StatusSection = ({ applicant, onApplicantChange }: StatusSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default StatusSection;
