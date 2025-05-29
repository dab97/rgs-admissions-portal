
export interface AdmissionLimit {
  specialization: string;
  educationType: 'bachelor' | 'master';
  studyForm: string;
  budgetPlaces: number;
  paidPlaces: number;
}

export const ADMISSION_LIMITS: AdmissionLimit[] = [
  // Бакалавриат
  {
    specialization: 'Психология',
    educationType: 'bachelor',
    studyForm: 'full_time',
    budgetPlaces: 10,
    paidPlaces: 55
  },
  {
    specialization: 'Психология',
    educationType: 'bachelor',
    studyForm: 'part_time',
    budgetPlaces: 6,
    paidPlaces: 54
  },
  {
    specialization: 'Менеджмент',
    educationType: 'bachelor',
    studyForm: 'full_time',
    budgetPlaces: 37,
    paidPlaces: 28
  },
  {
    specialization: 'Социальная работа',
    educationType: 'bachelor',
    studyForm: 'full_time',
    budgetPlaces: 10,
    paidPlaces: 5
  },
  {
    specialization: 'Социальная работа',
    educationType: 'bachelor',
    studyForm: 'correspondence',
    budgetPlaces: 4,
    paidPlaces: 68
  },
  {
    specialization: 'Юриспруденция',
    educationType: 'bachelor',
    studyForm: 'full_time',
    budgetPlaces: 10,
    paidPlaces: 55
  },
  // Магистратура
  {
    specialization: 'Психология',
    educationType: 'master',
    studyForm: 'part_time',
    budgetPlaces: 0,
    paidPlaces: 15
  },
  {
    specialization: 'Менеджмент',
    educationType: 'master',
    studyForm: 'correspondence',
    budgetPlaces: 0,
    paidPlaces: 15
  }
];

export const getAdmissionLimit = (
  specialization: string,
  educationType: string,
  studyForm: string
): AdmissionLimit | undefined => {
  return ADMISSION_LIMITS.find(
    limit =>
      limit.specialization === specialization &&
      limit.educationType === educationType &&
      limit.studyForm === studyForm
  );
};

export const getTotalPlaces = (
  specialization: string,
  educationType: string,
  studyForm: string
): number => {
  const limit = getAdmissionLimit(specialization, educationType, studyForm);
  return limit ? limit.budgetPlaces + limit.paidPlaces : 0;
};
