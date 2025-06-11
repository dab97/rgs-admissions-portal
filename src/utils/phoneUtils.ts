
import { PHONE_PATTERNS, PhonePattern } from '@/constants/phonePatterns';

export const detectCountry = (value: string): keyof typeof PHONE_PATTERNS => {
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.startsWith('375')) return 'BY';
  if (cleanValue.startsWith('380')) return 'UA';
  if (cleanValue.startsWith('7') && cleanValue.length > 1) {
    const secondDigit = cleanValue[1];
    if (secondDigit === '7') return 'KZ';
    return 'RU';
  }
  
  return 'BY';
};

export const formatPhone = (value: string, country: keyof typeof PHONE_PATTERNS): string => {
  const pattern = PHONE_PATTERNS[country];
  const cleanValue = value.replace(/\D/g, '');
  const codeDigits = pattern.code.replace(/\D/g, '');
  
  let fullNumber = cleanValue;
  if (!cleanValue.startsWith(codeDigits)) {
    fullNumber = codeDigits + cleanValue;
  }
  
  const maxDigits = codeDigits.length + pattern.digitCount;
  if (fullNumber.length > maxDigits) {
    fullNumber = fullNumber.substring(0, maxDigits);
  }
  
  let formatted = pattern.code;
  const digits = fullNumber.substring(codeDigits.length);
  
  switch (country) {
    case 'BY':
    case 'UA':
      if (digits.length > 0) formatted += ` (${digits.substring(0, 2)}`;
      if (digits.length >= 2) formatted += ')';
      if (digits.length > 2) formatted += ` ${digits.substring(2, 5)}`;
      if (digits.length > 5) formatted += `-${digits.substring(5, 7)}`;
      if (digits.length > 7) formatted += `-${digits.substring(7, 9)}`;
      break;
    case 'RU':
      if (digits.length > 0) formatted += ` (${digits.substring(0, 3)}`;
      if (digits.length >= 3) formatted += ')';
      if (digits.length > 3) formatted += ` ${digits.substring(3, 6)}`;
      if (digits.length > 6) formatted += `-${digits.substring(6, 8)}`;
      if (digits.length > 8) formatted += `-${digits.substring(8, 10)}`;
      break;
    case 'KZ':
      if (digits.length > 0) formatted += ` (7${digits.substring(0, 2)}`;
      if (digits.length >= 2) formatted += ')';
      if (digits.length > 2) formatted += ` ${digits.substring(2, 5)}`;
      if (digits.length > 5) formatted += `-${digits.substring(5, 7)}`;
      if (digits.length > 7) formatted += `-${digits.substring(7, 9)}`;
      break;
  }
  
  return formatted;
};

export const validateDigitsOnly = (key: string, ctrlKey: boolean): boolean => {
  const navigationKeys = [
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End'
  ];
  
  if (navigationKeys.includes(key)) return true;
  if (ctrlKey && ['a', 'c', 'v', 'x'].includes(key.toLowerCase())) return true;
  
  return /\d/.test(key);
};
