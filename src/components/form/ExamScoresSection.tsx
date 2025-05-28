
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { APP_CONSTANTS, ExamScores, Specialization } from '@/constants';
import { BookOpen } from 'lucide-react';

interface ExamScoresSectionProps {
  citizenship: string;
  examType: string;
  examScores: ExamScores;
  budget: boolean;
  selectedSpecializationIds: string[];
  specializations: Specialization[];
  entranceSubjects?: string[];
  onExamTypeChange: (value: string) => void;
  onExamScoreChange: (subject: string, score: number) => void;
  onEntranceSubjectsChange?: (subjects: string[]) => void;
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
  // Определяем тип экзамена на основе гражданства
  React.useEffect(() => {
    if (citizenship === 'russia') {
      onExamTypeChange('ege');
    } else if (citizenship === 'belarus') {
      onExamTypeChange('ct');
    }
  }, [citizenship, onExamTypeChange]);

  // Получаем доступные предметы для вступительных испытаний
  const getAvailableEntranceSubjects = () => {
    if (!budget) {
      // Для платного обучения только русский язык
      return APP_CONSTANTS.ENTRANCE_SUBJECTS.filter(subject => subject.value === 'russian');
    }

    // Для бюджетного обучения получаем предметы по специализациям
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

    // Собираем все предметы для выбранных специализаций
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

  const handleEntranceSubjectChange = (subjectValue: string, checked: boolean) => {
    if (!onEntranceSubjectsChange) return;
    
    const updatedSubjects = checked 
      ? [...entranceSubjects, subjectValue]
      : entranceSubjects.filter(s => s !== subjectValue);
    
    onEntranceSubjectsChange(updatedSubjects);
  };

  if (!citizenship) {
    return (
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Результаты экзаменов
        </Label>
        <p className="text-sm text-gray-500">Сначала выберите гражданство</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Тип экзамена *
        </Label>
        <RadioGroup 
          value={examType}
          onValueChange={onExamTypeChange}
          disabled={citizenship === 'russia' || citizenship === 'belarus'}
        >
          {APP_CONSTANTS.EXAM_TYPES.map((type) => {
            const isDisabled = (citizenship === 'russia' && type.value !== 'ege') ||
                             (citizenship === 'belarus' && type.value !== 'ct');
            
            return (
              <div key={type.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={type.value} 
                  id={type.value}
                  disabled={isDisabled}
                />
                <Label 
                  htmlFor={type.value}
                  className={isDisabled ? 'text-gray-400' : ''}
                >
                  {type.label}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      {examType === 'ct' && (
        <div className="space-y-4">
          <Label className="text-lg font-medium">Баллы по предметам ЦТ/ЦЭ</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {APP_CONSTANTS.CT_SUBJECTS.map((subject) => (
              <div key={subject.value} className="space-y-2">
                <Label htmlFor={`score-${subject.value}`} className="text-sm">
                  {subject.label}
                </Label>
                <Input
                  id={`score-${subject.value}`}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  value={examScores[subject.value as keyof ExamScores] || ''}
                  onChange={(e) => {
                    const score = parseInt(e.target.value);
                    if (!isNaN(score) && score >= 0 && score <= 100) {
                      onExamScoreChange(subject.value, score);
                    } else if (e.target.value === '') {
                      onExamScoreChange(subject.value, 0);
                    }
                  }}
                  className="text-center"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {examType === 'ege' && (
        <div className="space-y-2">
          <Label className="text-lg font-medium">ЕГЭ</Label>
          <p className="text-sm text-gray-600">
            Для участников ЕГЭ результаты будут загружены автоматически из базы данных.
          </p>
        </div>
      )}

      {examType === 'entrance' && (
        <div className="space-y-4">
          <Label className="text-lg font-medium">Вступительные испытания</Label>
          {selectedSpecializationIds.length === 0 ? (
            <p className="text-sm text-gray-500">Сначала выберите направления подготовки</p>
          ) : (
            <>
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
                          <Label htmlFor={`entrance-score-${subjectValue}`} className="text-sm">
                            {subject.label}
                          </Label>
                          <Input
                            id={`entrance-score-${subjectValue}`}
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            value={examScores[subjectValue as keyof ExamScores] || ''}
                            onChange={(e) => {
                              const score = parseInt(e.target.value);
                              if (!isNaN(score) && score >= 0 && score <= 100) {
                                onExamScoreChange(subjectValue, score);
                              } else if (e.target.value === '') {
                                onExamScoreChange(subjectValue, 0);
                              }
                            }}
                            className="text-center"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamScoresSection;
