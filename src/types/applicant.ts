
export interface PreparationDirection {
  id: string;
  budget: boolean;
  studyForm: string;
  specializationIds: string[];
  priority: number;
}

export interface Applicant {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  study_form: string;
  education_type: string;
  budget: boolean;
  stream: number | null;
  gender: string | null;
  citizenship: string | null;
  is_adult: boolean | null;
  disability: boolean | null;
  education_document: string | null;
  contact_person_name: string | null;
  contact_person_phone: string | null;
  how_did_you_know: string | null;
  exam_type: string | null;
  exam_scores: any | null;
  entrance_subjects: string[] | null;
  status: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  responsible_id: string;
  responsible_persons: { name: string } | null;
  specializations: string[];
  specialization_ids?: string[];
  preparation_directions?: PreparationDirection[];
}

export interface ApplicantFilters {
  status: string;
  education_type: string;
  study_form: string;
  budget: string;
  specialization: string;
  search: string;
}
