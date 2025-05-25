
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ResponsiblePerson, Specialization } from '@/constants';

export const useApplicantData = () => {
  const [responsiblePersons, setResponsiblePersons] = useState<ResponsiblePerson[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загружаем ответственных лиц
        const { data: responsibleData, error: responsibleError } = await supabase
          .from('responsible_persons')
          .select('id, name')
          .order('name');

        if (responsibleError) throw responsibleError;

        // Загружаем специализации
        const { data: specializationsData, error: specializationsError } = await supabase
          .from('specializations')
          .select('id, name')
          .order('name');

        if (specializationsError) throw specializationsError;

        setResponsiblePersons(responsibleData || []);
        setSpecializations(specializationsData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    responsiblePersons,
    specializations,
    loading,
    error
  };
};
