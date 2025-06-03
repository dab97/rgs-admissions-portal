
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { APP_CONSTANTS } from '@/constants';

interface ApplicantsFiltersProps {
  filters: {
    status: string;
    education_type: string;
    study_form: string;
    budget: string;
    specialization: string;
    search: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

const ApplicantsFilters = ({ filters, onFilterChange, onClearFilters }: ApplicantsFiltersProps) => {
  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'all');

  const handleFilterChange = (key: string, value: string) => {
    // Convert "all" back to empty string for the actual filter logic
    const filterValue = value === 'all' ? '' : value;
    onFilterChange(key, filterValue);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Фильтры</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Очистить
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Поиск по ФИО, телефону, email..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="pending">Ожидает</SelectItem>
            <SelectItem value="under_review">На рассмотрении</SelectItem>
            <SelectItem value="approved">Одобрено</SelectItem>
            <SelectItem value="rejected">Отклонено</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.education_type || 'all'} onValueChange={(value) => handleFilterChange('education_type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Вид образования" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все виды</SelectItem>
            {APP_CONSTANTS.EDUCATION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.study_form || 'all'} onValueChange={(value) => handleFilterChange('study_form', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Форма обучения" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все формы</SelectItem>
            {APP_CONSTANTS.STUDY_FORMS.map((form) => (
              <SelectItem key={form.value} value={form.value}>
                {form.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.budget || 'all'} onValueChange={(value) => handleFilterChange('budget', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Финансирование" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="true">Бюджет</SelectItem>
            <SelectItem value="false">Платное</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ApplicantsFilters;
