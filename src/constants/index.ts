
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

  // Специализации с ограничениями
  SPECIALIZATIONS_CONFIG: {
    bachelor: {
      available: ['psychology', 'management', 'social_work', 'law'],
      studyFormRestrictions: {
        psychology: ['full-time', 'part-time'], // нет заочной
        management: ['full-time'], // только очная
        social_work: ['full-time', 'distance'], // очная и заочная
        law: ['full-time'] // только очная
      }
    },
    master: {
      available: ['management', 'psychology'],
      studyFormRestrictions: {
        management: ['distance'], // только заочная
        psychology: ['part-time'] // только очно-заочная
      }
    }
  },

  // Потоки
  STREAMS: [
    { value: 1, label: 'Без испытаний' },
    { value: 2, label: '1 поток 17 июля (11.00)' },
    { value: 3, label: '1 поток 17 июля (14.00)' },
    { value: 4, label: '2 поток 15 августа (11.00)' },
    { value: 5, label: '2 поток 15 августа (14.00)' }
  ],

  // Пол
  GENDERS: [
    { value: 'male', label: 'Мужской' },
    { value: 'female', label: 'Женский' }
  ],

  // Гражданство
  CITIZENSHIPS: [
    { value: 'russia', label: 'Российская Федерация' },
    { value: 'belarus', label: 'Беларусь' },
    { value: 'other', label: 'Другое' }
  ],

  // Типы экзаменов
  EXAM_TYPES: [
    { value: 'ege', label: 'ЕГЭ' },
    { value: 'ct', label: 'ЦТ/ЦЭ' }
  ],

  // Предметы для ЦТ/ЦЭ
  CT_SUBJECTS: [
    { value: 'russian', label: 'Русский язык' },
    { value: 'social_studies', label: 'Обществознание' },
    { value: 'biology', label: 'Биология' },
    { value: 'mathematics', label: 'Математика' },
    { value: 'world_history', label: 'История Всемирная' },
    { value: 'foreign_language', label: 'Ин. язык' }
  ],

  // Варианты Да/Нет
  YES_NO_OPTIONS: [
    { value: true, label: 'Да' },
    { value: false, label: 'Нет' }
  ],

  // Документы об образовании
  EDUCATION_DOCUMENTS: [
    { value: 'secondary_certificate', label: 'Аттестат об общем среднем образовании' },
    { value: 'secondary_certificate_excellence', label: 'Аттестат об общем среднем образовании с отличием' },
    { value: 'vocational_diploma', label: 'Диплом о среднем специальном образовании (СПО)' },
    { value: 'vocational_diploma_excellence', label: 'Диплом о среднем специальном образовании (СПО) с отличием' },
    { value: 'technical_diploma', label: 'Диплом о профессионально-техническом образовании (НПО)' },
    { value: 'technical_diploma_excellence', label: 'Диплом о профессионально-техническом образовании (НПО) с отличием' },
    { value: 'higher_diploma', label: 'Диплом о высшем образовании (ВО)' },
    { value: 'higher_diploma_excellence', label: 'Диплом о высшем образовании (ВО) с отличием' }
  ],

  // Источники информации
  HOW_DID_YOU_KNOW_OPTIONS: [
    { value: 'internet', label: 'Интернет' },
    { value: 'social_media', label: 'Социальные сети' },
    { value: 'friends_recommendation', label: 'Рекомендация друзей' },
    { value: 'education_exhibition', label: 'Образовательная выставка' },
    { value: 'advertising', label: 'Реклама' },
    { value: 'media', label: 'СМИ' },
    { value: 'other', label: 'Другое' }
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
  code?: string; // добавляем код для идентификации
}

export interface ExamScores {
  russian?: number;
  social_studies?: number;
  biology?: number;
  mathematics?: number;
  world_history?: number;
  foreign_language?: number;
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
  exam_type?: string;
  exam_scores?: ExamScores;
}
