
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Applicant } from '@/types/applicant';
import { fetchApplicants, updateApplicant as updateApplicantService, deleteApplicant as deleteApplicantService } from '@/services/applicantService';
import { useApplicantFilters } from './useApplicantFilters';

export const useApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const {
    sortField,
    sortDirection,
    filters,
    handleSort,
    handleFilterChange,
    clearFilters
  } = useApplicantFilters();

  const loadApplicants = async () => {
    try {
      const data = await fetchApplicants(sortField, sortDirection, filters);
      setApplicants(data);
    } catch (err) {
      console.error('Error fetching applicants:', err);
      setError('Ошибка загрузки списка поступающих');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicant = async (id: string, updates: Partial<Applicant>) => {
    try {
      await updateApplicantService(id, updates);

      toast({
        title: 'Успешно обновлено',
        description: 'Данные поступающего обновлены',
      });

      loadApplicants();
    } catch (err) {
      console.error('Error updating applicant:', err);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить данные',
        variant: 'destructive',
      });
    }
  };

  const deleteApplicant = async (id: string) => {
    try {
      await deleteApplicantService(id);

      toast({
        title: 'Успешно удалено',
        description: 'Заявка поступающего удалена',
      });

      loadApplicants();
    } catch (err) {
      console.error('Error deleting applicant:', err);
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить заявку',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [sortField, sortDirection, filters]);

  return {
    applicants,
    loading,
    error,
    updateApplicant,
    deleteApplicant,
    refetch: loadApplicants,
    sortField,
    sortDirection,
    filters,
    handleSort,
    handleFilterChange,
    clearFilters
  };
};

// Export types for backward compatibility
export type { Applicant, PreparationDirection } from '@/types/applicant';
