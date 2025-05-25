
// Константы для приложения учета абитуриентов
export const APP_CONSTANTS = {
  // Формы обучения
  STUDY_FORMS: [
    { value: 'full-time', label: 'Очная' },
    { value: 'part-time', label: 'Очно-Заочная' },
    { value: 'distance', label: 'Заочная' }
  ],

  // Виды образования
  EDUCATION_TYPES: [
    { value: 'bachelor', label: 'Бакалавриат' },
    { value: 'master', label: 'Магистратура' }
  ],

  // Потоки
  STREAMS: [
    { value: 1, label: '1 поток' },
    { value: 2, label: '2 поток' }
  ],

  // Пол
  GENDERS: [
    { value: 'male', label: 'Мужской' },
    { value: 'female', label: 'Женский' }
  ],

  // Варианты Да/Нет
  YES_NO_OPTIONS: [
    { value: true, label: 'Да' },
    { value: false, label: 'Нет' }
  ],

  // Роли пользователей
  USER_ROLES: {
    ADMIN: 'admin',
    MODERATOR: 'moderator'
  },

  // Сообщения
  MESSAGES: {
    SUCCESS: {
      APPLICATION_SUBMITTED: 'Заявка принята!',
      APPLICATION_SUBMITTED_DESC: 'Данные поступающего успешно сохранены в системе.',
      LOGIN_SUCCESS: 'Успешный вход!',
      LOGIN_SUCCESS_ADMIN: 'Добро пожаловать в админ панель.',
      LOGIN_SUCCESS_MODERATOR: 'Добро пожаловать, модератор.'
    },
    ERROR: {
      LOGIN_FAILED: 'Ошибка входа',
      LOGIN_FAILED_DESC: 'Неверный логин или пароль.',
      FORM_VALIDATION: 'Пожалуйста, заполните все обязательные поля.',
      LOADING_ERROR: 'Ошибка загрузки данных.'
    }
  },

  // Настройки университета
  UNIVERSITY: {
    NAME: 'Российский Государственный Социальный Университет',
    LOCATION: 'г. Минск',
    FULL_NAME: 'Российский Государственный Социальный Университет в г. Минске'
  }
};

// Типы данных
export interface ResponsiblePerson {
  id: string;
  name: string;
}

export interface Specialization {
  id: string;
  name: string;
}

export interface ApplicantFormData {
  responsible_id: string;
  full_name: string;
  phone: string;
  email?: string;
  specialization_ids: string[];
  study_form: string;
  education_type: string;
  budget: boolean;
  stream?: number;
  gender?: string;
  citizenship?: string;
  is_adult?: boolean;
  disability?: boolean;
  education_document?: string;
  contact_person_name?: string;
  contact_person_phone?: string;
  how_did_you_know?: string;
}
