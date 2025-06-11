
export interface PhonePattern {
  mask: string;
  pattern: RegExp;
  placeholder: string;
  maxLength: number;
  code: string;
  flag: string;
  name: string;
  digitCount: number;
}

export const PHONE_PATTERNS: Record<string, PhonePattern> = {
  BY: {
    mask: '+375 (XX) XXX-XX-XX',
    pattern: /^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/,
    placeholder: '+375 (29) 123-45-67',
    maxLength: 19,
    code: '+375',
    flag: '🇧🇾',
    name: 'Беларусь',
    digitCount: 9
  },
  RU: {
    mask: '+7 (XXX) XXX-XX-XX',
    pattern: /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
    placeholder: '+7 (912) 345-67-89',
    maxLength: 18,
    code: '+7',
    flag: '🇷🇺',
    name: 'Россия',
    digitCount: 10
  },
  UA: {
    mask: '+380 (XX) XXX-XX-XX',
    pattern: /^\+380\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/,
    placeholder: '+380 (50) 123-45-67',
    maxLength: 19,
    code: '+380',
    flag: '🇺🇦',
    name: 'Украина',
    digitCount: 9
  },
  KZ: {
    mask: '+7 (7XX) XXX-XX-XX',
    pattern: /^\+7\s\(7\d{2}\)\s\d{3}-\d{2}-\d{2}$/,
    placeholder: '+7 (701) 123-45-67',
    maxLength: 18,
    code: '+7',
    flag: '🇰🇿',
    name: 'Казахстан',
    digitCount: 10
  }
};
