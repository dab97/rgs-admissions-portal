import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ChartData {
  specializationData: Array<{ 
    name: string; 
    total: number;
    budget: number;
    paid: number;
    fullTime: number;
    partTime: number;
    distance: number;
    color: string;
  }>;
  monthlyData: Array<{ month: string; applications: number; approved: number }>;
  budgetData: Array<{ name: string; value: number; color: string }>;
  studyFormData: Array<{ name: string; value: number; color: string }>;
  educationTypeData: Array<{ name: string; value: number; color: string }>;
  detailedStats: {
    bySpecialization: Record<string, {
      total: number;
      budget: number;
      paid: number;
      fullTime: number;
      partTime: number;
      distance: number;
      bachelor: number;
      master: number;
    }>;
  };
  loading: boolean;
  error: string | null;
}

export const useChartsData = () => {
  const [data, setData] = useState<ChartData>({
    specializationData: [],
    monthlyData: [],
    budgetData: [],
    studyFormData: [],
    educationTypeData: [],
    detailedStats: {
      bySpecialization: {}
    },
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

        // Детальная статистика по специализациям
        const detailedStats: Record<string, any> = {};
        const specializationCounts: Record<string, any> = {};

        specializations?.forEach(spec => {
          detailedStats[spec.name] = {
            total: 0,
            budget: 0,
            paid: 0,
            fullTime: 0,
            partTime: 0,
            distance: 0,
            bachelor: 0,
            master: 0
          };
          specializationCounts[spec.name] = {
            total: 0,
            budget: 0,
            paid: 0,
            fullTime: 0,
            partTime: 0,
            distance: 0
          };
        });

        applicants?.forEach(applicant => {
          applicant.applicant_specializations?.forEach((as: any) => {
            const specName = as.specializations?.name;
            if (specName && detailedStats[specName]) {
              detailedStats[specName].total++;
              specializationCounts[specName].total++;

              if (applicant.budget) {
                detailedStats[specName].budget++;
                specializationCounts[specName].budget++;
              } else {
                detailedStats[specName].paid++;
                specializationCounts[specName].paid++;
              }

              if (applicant.study_form === 'full-time') {
                detailedStats[specName].fullTime++;
                specializationCounts[specName].fullTime++;
              } else if (applicant.study_form === 'part-time') {
                detailedStats[specName].partTime++;
                specializationCounts[specName].partTime++;
              } else if (applicant.study_form === 'distance') {
                detailedStats[specName].distance++;
                specializationCounts[specName].distance++;
              }

              if (applicant.education_type === 'bachelor') {
                detailedStats[specName].bachelor++;
              } else if (applicant.education_type === 'master') {
                detailedStats[specName].master++;
              }
            }
          });
        });

        const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#84cc16', '#ec4899', '#f97316', '#6366f1'];
        const specializationData = Object.entries(specializationCounts).map(([name, counts], index) => ({
          name,
          total: counts.total,
          budget: counts.budget,
          paid: counts.paid,
          fullTime: counts.fullTime,
          partTime: counts.partTime,
          distance: counts.distance,
          color: colors[index % colors.length]
        }));

        // Данные по виду образования
        const bachelorCount = applicants?.filter(app => app.education_type === 'bachelor').length || 0;
        const masterCount = applicants?.filter(app => app.education_type === 'master').length || 0;
        const educationTypeData = [
          { name: 'Бакалавриат', value: bachelorCount, color: '#3b82f6' },
          { name: 'Магистратура', value: masterCount, color: '#8b5cf6' },
        ];

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
          educationTypeData,
          detailedStats: {
            bySpecialization: detailedStats
          },
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
