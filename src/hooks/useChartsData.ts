
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChartData {
  specializationData: Array<{ name: string; value: number; color: string }>;
  monthlyData: Array<{ month: string; applications: number; approved: number }>;
  budgetData: Array<{ name: string; value: number; color: string }>;
  studyFormData: Array<{ name: string; value: number; color: string }>;
  loading: boolean;
  error: string | null;
}

export const useChartsData = () => {
  const [data, setData] = useState<ChartData>({
    specializationData: [],
    monthlyData: [],
    budgetData: [],
    studyFormData: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchChartsData = async () => {
      try {
        // Получаем данные абитуриентов со специализациями
        const { data: applicants, error: applicantsError } = await supabase
          .from('applicants')
          .select(`
            *,
            applicant_specializations (
              specialization_id,
              specializations (
                name
              )
            )
          `);

        if (applicantsError) throw applicantsError;

        // Получаем все специализации
        const { data: specializations, error: specializationsError } = await supabase
          .from('specializations')
          .select('*');

        if (specializationsError) throw specializationsError;

        // Подсчет по специализациям
        const specializationCounts: { [key: string]: number } = {};
        applicants?.forEach(applicant => {
          applicant.applicant_specializations?.forEach((as: any) => {
            const specName = as.specializations?.name;
            if (specName) {
              specializationCounts[specName] = (specializationCounts[specName] || 0) + 1;
            }
          });
        });

        const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#84cc16', '#ec4899', '#f97316', '#6366f1'];
        const specializationData = Object.entries(specializationCounts).map(([name, value], index) => ({
          name,
          value,
          color: colors[index % colors.length]
        }));

        // Данные по месяцам (примерные)
        const monthlyData = [
          { month: 'Янв', applications: Math.floor(Math.random() * 50) + 10, approved: 0 },
          { month: 'Фев', applications: Math.floor(Math.random() * 70) + 20, approved: 0 },
          { month: 'Мар', applications: Math.floor(Math.random() * 90) + 30, approved: 0 },
          { month: 'Апр', applications: Math.floor(Math.random() * 120) + 40, approved: 0 },
          { month: 'Май', applications: Math.floor(Math.random() * 150) + 50, approved: 0 },
          { month: 'Июн', applications: Math.floor(Math.random() * 200) + 60, approved: 0 },
          { month: 'Июл', applications: applicants?.length || 0, approved: Math.floor((applicants?.length || 0) * 0.7) },
        ].map(item => ({
          ...item,
          approved: item.approved || Math.floor(item.applications * 0.7)
        }));

        // Данные по бюджету
        const budgetCount = applicants?.filter(app => app.budget === true).length || 0;
        const paidCount = applicants?.filter(app => app.budget === false).length || 0;
        const budgetData = [
          { name: 'Бюджет', value: budgetCount, color: '#10b981' },
          { name: 'Платно', value: paidCount, color: '#f59e0b' },
        ];

        // Данные по форме обучения
        const fullTimeCount = applicants?.filter(app => app.study_form === 'full-time').length || 0;
        const partTimeCount = applicants?.filter(app => app.study_form === 'part-time').length || 0;
        const distanceCount = applicants?.filter(app => app.study_form === 'distance').length || 0;
        const studyFormData = [
          { name: 'Очная', value: fullTimeCount, color: '#3b82f6' },
          { name: 'Очно-заочная', value: partTimeCount, color: '#8b5cf6' },
          { name: 'Заочная', value: distanceCount, color: '#06b6d4' },
        ];

        setData({
          specializationData,
          monthlyData,
          budgetData,
          studyFormData,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Error fetching charts data:', err);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Ошибка загрузки данных для графиков'
        }));
      }
    };

    fetchChartsData();
  }, []);

  return data;
};
