
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminStatistics {
  totalApplicants: number;
  newToday: number;
  approved: number;
  pending: number;
  bachelor: number;
  master: number;
  budget: number;
  paid: number;
  male: number;
  female: number;
  fullTime: number;
  partTime: number;
  distance: number;
  loading: boolean;
  error: string | null;
}

export const useAdminStatistics = () => {
  const [stats, setStats] = useState<AdminStatistics>({
    totalApplicants: 0,
    newToday: 0,
    approved: 0,
    pending: 0,
    bachelor: 0,
    master: 0,
    budget: 0,
    paid: 0,
    male: 0,
    female: 0,
    fullTime: 0,
    partTime: 0,
    distance: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Получаем всех абитуриентов
        const { data: applicants, error } = await supabase
          .from('applicants')
          .select('*');

        if (error) throw error;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const totalApplicants = applicants?.length || 0;
        const newToday = applicants?.filter(app => 
          new Date(app.created_at) >= today
        ).length || 0;

        // Подсчет по типу образования
        const bachelor = applicants?.filter(app => app.education_type === 'bachelor').length || 0;
        const master = applicants?.filter(app => app.education_type === 'master').length || 0;

        // Подсчет по бюджету
        const budget = applicants?.filter(app => app.budget === true).length || 0;
        const paid = applicants?.filter(app => app.budget === false).length || 0;

        // Подсчет по полу
        const male = applicants?.filter(app => app.gender === 'male').length || 0;
        const female = applicants?.filter(app => app.gender === 'female').length || 0;

        // Подсчет по форме обучения
        const fullTime = applicants?.filter(app => app.study_form === 'full-time').length || 0;
        const partTime = applicants?.filter(app => app.study_form === 'part-time').length || 0;
        const distance = applicants?.filter(app => app.study_form === 'distance').length || 0;

        setStats({
          totalApplicants,
          newToday,
          approved: Math.floor(totalApplicants * 0.7), // Пример: 70% одобрено
          pending: Math.floor(totalApplicants * 0.3), // Пример: 30% на рассмотрении
          bachelor,
          master,
          budget,
          paid,
          male,
          female,
          fullTime,
          partTime,
          distance,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Ошибка загрузки статистики'
        }));
      }
    };

    fetchStatistics();
  }, []);

  return stats;
};
