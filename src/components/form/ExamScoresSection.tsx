
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { APP_CONSTANTS, ExamScores } from '@/constants';
import { BookOpen } from 'lucide-react';

interface ExamScoresSectionProps {
  citizenship: string;
  examType: string;
  examScores: ExamScores;
  onExamTypeChange: (value: string) => void;
  onExamScoreChange: (subject: string, score: number) => void;
}

const ExamScoresSection = ({
  citizenship,
  examType,
  examScores,
  onExamTypeChange,
  onExamScoreChange
}: ExamScoresSectionProps) => {
  // Определяем тип экзамена на основе гражданства
  React.useEffect(() => {
    if (citizenship === 'russia') {
      onExamTypeChange('ege');
    } else if (citizenship === 'belarus') {
      onExamTypeChange('ct');
    }
  }, [citizenship, onExamTypeChange]);

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
    </div>
  );
};

export default ExamScoresSection;
