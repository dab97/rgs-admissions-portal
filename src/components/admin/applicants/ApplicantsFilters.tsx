
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { APP_CONSTANTS, Specialization } from '@/constants';

interface ApplicantsFiltersProps {
  specializations: Specialization[];
  filters: {
    educationType: string;
    studyForm: string;
    specialization: string;
    budget: string;
    status: string;
    search: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const ApplicantsFilters = ({ 
  specializations, 
  filters, 
  onFilterChange, 
  onClearFilters 
}: ApplicantsFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Фильтры</span>
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Очистить
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Поиск */}
        <Input
          placeholder="Поиск по ФИО..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />

        {/* Вид образования */}
        <Select value={filters.educationType} onValueChange={(value) => onFilterChange('educationType', value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Вид образования" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            {APP_CONSTANTS.EDUCATION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Форма обучения */}
        <Select value={filters.studyForm} onValueChange={(value) => onFilterChange('studyForm', value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Форма обучения" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            {APP_CONSTANTS.STUDY_FORMS.map((form) => (
              <SelectItem key={form.value} value={form.value}>
                {form.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Специализация */}
        <Select value={filters.specialization} onValueChange={(value) => onFilterChange('specialization', value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Специализация" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            {specializations.map((spec) => (
              <SelectItem key={spec.id} value={spec.id}>
                {spec.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Бюджет */}
        <Select value={filters.budget} onValueChange={(value) => onFilterChange('budget', value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Бюджет" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="true">Бюджет</SelectItem>
            <SelectItem value="false">Платно</SelectItem>
          </SelectContent>
        </Select>

        {/* Статус */}
        <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value === 'all' ? '' : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="pending">Ожидает</SelectItem>
            <SelectItem value="under_review">На рассмотрении</SelectItem>
            <SelectItem value="approved">Одобрено</SelectItem>
            <SelectItem value="rejected">Отклонено</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Активные фильтры */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Поиск: {filters.search}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFilterChange('search', '')}
              />
            </Badge>
          )}
          {filters.educationType && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {APP_CONSTANTS.EDUCATION_TYPES.find(t => t.value === filters.educationType)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFilterChange('educationType', '')}
              />
            </Badge>
          )}
          {filters.studyForm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {APP_CONSTANTS.STUDY_FORMS.find(f => f.value === filters.studyForm)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFilterChange('studyForm', '')}
              />
            </Badge>
          )}
          {filters.specialization && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {specializations.find(s => s.id === filters.specialization)?.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFilterChange('specialization', '')}
              />
            </Badge>
          )}
          {filters.budget && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.budget === 'true' ? 'Бюджет' : 'Платно'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFilterChange('budget', '')}
              />
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.status === 'pending' ? 'Ожидает' : 
               filters.status === 'under_review' ? 'На рассмотрении' :
               filters.status === 'approved' ? 'Одобрено' : 'Отклонено'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onFilterChange('status', '')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicantsFilters;
