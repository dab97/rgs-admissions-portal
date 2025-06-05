
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_CONSTANTS, Specialization, ExamScores } from '@/constants';

interface ExamScoresSectionProps {
  citizenship?: string;
  examType?: string;
  examScores: ExamScores;
  budget: boolean;
  selectedSpecializationIds: string[];
  specializations: Specialization[];
  entranceSubjects?: string[];
  onExamTypeChange: (type: string) => void;
  onExamScoreChange: (subject: string, score: number) => void;
  onEntranceSubjectsChange: (subjects: string[]) => void;
}

const ExamScoresSection = ({
  citizenship,
  examType,
  examScores,
  budget,
  selectedSpecializationIds,
  specializations,
  entranceSubjects = [],
  onExamTypeChange,
  onExamScoreChange,
  onEntranceSubjectsChange
}: ExamScoresSectionProps) => {
  // Доступные типы экзаменов в зависимости от гражданства
  const getAvailableExamTypes = () => {
    const types = [...APP_CONSTANTS.EXAM_TYPES];
    
    // Для граждан Беларуси ЕГЭ недоступно
    if (citizenship === 'belarus') {
      return types.filter(type => type.value !== 'ege');
    }
    
    return types;
  };

  // Получаем доступные предметы для вступительных испытаний
  const getAvailableEntranceSubjects = () => {
    if (!budget) {
      return APP_CONSTANTS.ENTRANCE_SUBJECTS.filter(subject => subject.value === 'russian');
    }

    const specializationMap: { [key: string]: string } = {
      'psychology': 'Психология',
      'management': 'Менеджмент', 
      'social_work': 'Социальная работа',
      'law': 'Юриспруденция'
    };

    const selectedSpecCodes = selectedSpecializationIds
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

  const handleEntranceSubjectChange = (subjectValue: string, checked: boolean) => {
    const updatedSubjects = checked 
      ? [...entranceSubjects, subjectValue]
      : entranceSubjects.filter(s => s !== subjectValue);
    
    onEntranceSubjectsChange(updatedSubjects);
  };

  const availableExamTypes = getAvailableExamTypes();
  const availableEntranceSubjects = getAvailableEntranceSubjects();

  // Не показываем секцию если нет гражданства
  if (!citizenship) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ЕГЭ/ЦТ/Вступительные испытания</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Тип экзамена *</Label>
          <Select value={examType || ''} onValueChange={onExamTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип экзамена" />
            </SelectTrigger>
            <SelectContent>
              {availableExamTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {examType === 'ct' && (
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
                    value={examScores[subject.value as keyof ExamScores] || ''}
                    onChange={(e) => onExamScoreChange(subject.value, parseInt(e.target.value) || 0)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {examType === 'entrance' && (
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
                          value={examScores[subjectValue as keyof ExamScores] || ''}
                          onChange={(e) => onExamScoreChange(subjectValue, parseInt(e.target.value) || 0)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {examType === 'ege' && (
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

export default ExamScoresSection;
