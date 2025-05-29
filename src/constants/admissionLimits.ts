
export interface AdmissionLimit {
  educationType: 'bachelor' | 'master';
  specialization: string;
  studyForm: string;
  budgetPlaces: number;
  paidPlaces: number;
}

export const ADMISSION_LIMITS: AdmissionLimit[] = [
  {
    educationType: 'bachelor',
    specialization: 'Психология',
    studyForm: 'full_time',
    budgetPlaces: 10,
    paidPlaces: 55
  },
  {
    educationType: 'bachelor',
    specialization: 'Психология',
    studyForm: 'part_time_evening',
    budgetPlaces: 6,
    paidPlaces: 54
  },
  {
    educationType: 'bachelor',
    specialization: 'Менеджмент',
    studyForm: 'full_time',
    budgetPlaces: 37,
    paidPlaces: 28
  }
];

export const getAdmissionLimit = (
  educationType: string, 
  specialization: string, 
  studyForm: string
): AdmissionLimit | null => {
  return ADMISSION_LIMITS.find(
    limit => 
      limit.educationType === educationType &&
      limit.specialization === specialization &&
      limit.studyForm === studyForm
  ) || null;
};
