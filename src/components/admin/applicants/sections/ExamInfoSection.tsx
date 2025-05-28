
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Applicant } from '@/hooks/useApplicants';
import { APP_CONSTANTS, Specialization } from '@/constants';

interface ExamInfoSectionProps {
  applicant: Applicant;
  onApplicantChange: (applicant: Applicant) => void;
  specializations: Specialization[];
}

const ExamInfoSection = ({ applicant, onApplicantChange, specializations }: ExamInfoSectionProps) => {
  const handleExamScoreChange = (subject: string, score: string) => {
    const numScore = score === '' ? 0 : parseInt(score);
    onApplicantChange({
      ...applicant,
      exam_scores: {
        ...applicant.exam_scores,
        [subject]: numScore
      }
    });
  };

  const handleEntranceSubjectChange = (subjectValue: string, checked: boolean) => {
    const currentSubjects = applicant.entrance_subjects || [];
    const updatedSubjects = checked 
      ? [...currentSubjects, subjectValue]
      : currentSubjects.filter(s => s !== subjectValue);
    
    onApplicantChange({
      ...applicant,
      entrance_subjects: updatedSubjects
    });
  };

  // Получаем доступные предметы для вступительных испытаний
  const getAvailableEntranceSubjects = () => {
    if (!applicant.budget) {
      return APP_CONSTANTS.ENTRANCE_SUBJECTS.filter(subject => subject.value === 'russian');
    }

    const specializationMap: { [key: string]: string } = {
      'psychology': 'Психология',
      'management': 'Менеджмент', 
      'social_work': 'Социальная работа',
      'law': 'Юриспруденция'
    };

    const selectedSpecCodes = (applicant.specialization_ids || [])
      .map(id => {
        const spec = specializations.find(s => s.id === id);
        return spec ? Object.keys(specializationMap).find(
          key => specializationMap[key] === spec.name
        ) : null;
      })
      .filter(Boolean) as string[];

    if (selectedSpecCodes.length === 0) return [];

    const allSubjects = new Set<string>();
    selectedSpecCodes.forEach(specCode => {
      const subjects = APP_CONSTANTS.ENTRANCE_SUBJECTS_BY_SPECIALIZATION[specCode] || [];
      subjects.forEach(subject => allSubjects.add(subject));
    });

    return APP_CONSTANTS.ENTRANCE_SUBJECTS.filter(subject => 
      allSubjects.has(subject.value)
    );
  };

  const availableEntranceSubjects = getAvailableEntranceSubjects();
  const entranceSubjects = applicant.entrance_subjects || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Информация об экзаменах</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Тип экзамена</Label>
          <Select
            value={applicant.exam_type || ''}
            onValueChange={(value) => onApplicantChange({ ...applicant, exam_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип экзамена" />
            </SelectTrigger>
            <SelectContent>
              {APP_CONSTANTS.EXAM_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {applicant.exam_type === 'ct' && (
          <div className="space-y-4">
            <Label className="text-lg font-medium">Баллы по предметам ЦТ/ЦЭ</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {APP_CONSTANTS.CT_SUBJECTS.map((subject) => (
                <div key={subject.value} className="space-y-2">
                  <Label className="text-sm">{subject.label}</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={applicant.exam_scores?.[subject.value] || ''}
                    onChange={(e) => handleExamScoreChange(subject.value, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {applicant.exam_type === 'entrance' && (
          <div className="space-y-4">
            <Label className="text-lg font-medium">Вступительные испытания</Label>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Предметы для испытаний:</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableEntranceSubjects.map((subject) => (
                  <div key={subject.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`entrance-${subject.value}`}
                      checked={entranceSubjects.includes(subject.value)}
                      onCheckedChange={(checked) => 
                        handleEntranceSubjectChange(subject.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={`entrance-${subject.value}`} className="text-sm">
                      {subject.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {entranceSubjects.length > 0 && (
              <div className="space-y-4">
                <Label className="text-sm font-medium">Баллы по выбранным предметам:</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {entranceSubjects.map((subjectValue) => {
                    const subject = availableEntranceSubjects.find(s => s.value === subjectValue);
                    if (!subject) return null;
                    
                    return (
                      <div key={subjectValue} className="space-y-2">
                        <Label className="text-sm">{subject.label}</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0-100"
                          value={applicant.exam_scores?.[subjectValue] || ''}
                          onChange={(e) => handleExamScoreChange(subjectValue, e.target.value)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {applicant.exam_type === 'ege' && (
          <div className="space-y-2">
            <Label className="text-lg font-medium">ЕГЭ</Label>
            <p className="text-sm text-gray-600">
              Для участников ЕГЭ результаты загружаются автоматически из базы данных.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamInfoSection;
