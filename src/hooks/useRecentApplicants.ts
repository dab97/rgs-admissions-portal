
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RecentApplicant {
  id: string;
  full_name: string;
  specializations: string[];
  status: string | null;
  created_at: string;
}

export const useRecentApplicants = () => {
  const [applicants, setApplicants] = useState<RecentApplicant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentApplicants = async () => {
    try {
      const { data, error } = await supabase
        .from('applicants')
        .select(`
          id,
          full_name,
          status,
          created_at,
          applicant_specializations (
            specializations (name)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const formattedApplicants = data?.map(applicant => ({
        id: applicant.id,
        full_name: applicant.full_name,
        status: applicant.status,
        created_at: applicant.created_at,
        specializations: applicant.applicant_specializations?.map((as: any) => 
          as.specializations?.name
        ).filter(Boolean) || []
      })) || [];

      setApplicants(formattedApplicants);
    } catch (err) {
      console.error('Error fetching recent applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentApplicants();
  }, []);

  return {
    applicants,
    loading,
    refetch: fetchRecentApplicants
  };
};
