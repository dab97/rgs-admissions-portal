
import { useState } from 'react';
import { ApplicantFilters } from '@/types/applicant';

export const useApplicantFilters = () => {
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<ApplicantFilters>({
    status: '',
    education_type: '',
    study_form: '',
    budget: '',
    specialization: '',
    search: ''
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      education_type: '',
      study_form: '',
      budget: '',
      specialization: '',
      search: ''
    });
  };

  return {
    sortField,
    sortDirection,
    filters,
    handleSort,
    handleFilterChange,
    clearFilters
  };
};
