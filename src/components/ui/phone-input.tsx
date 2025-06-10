
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
}

const PHONE_PATTERNS = {
  BY: {
    mask: '+375 (XX) XXX-XX-XX',
    pattern: /^\+375\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/,
    placeholder: '+375 (29) 123-45-67',
    maxLength: 19,
    code: '+375'
  },
  RU: {
    mask: '+7 (XXX) XXX-XX-XX',
    pattern: /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
    placeholder: '+7 (912) 345-67-89',
    maxLength: 18,
    code: '+7'
  },
  UA: {
    mask: '+380 (XX) XXX-XX-XX',
    pattern: /^\+380\s\(\d{2}\)\s\d{3}-\d{2}-\d{2}$/,
    placeholder: '+380 (50) 123-45-67',
    maxLength: 19,
    code: '+380'
  },
  KZ: {
    mask: '+7 (7XX) XXX-XX-XX',
    pattern: /^\+7\s\(7\d{2}\)\s\d{3}-\d{2}-\d{2}$/,
    placeholder: '+7 (701) 123-45-67',
    maxLength: 18,
    code: '+7'
  }
};

const detectCountry = (value: string) => {
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.startsWith('375')) return 'BY';
  if (cleanValue.startsWith('380')) return 'UA';
  if (cleanValue.startsWith('7') && cleanValue.length > 1) {
    const thirdDigit = cleanValue[1];
    if (thirdDigit === '7') return 'KZ';
    return 'RU';
  }
  
  return 'BY'; // по умолчанию
};

const formatPhone = (value: string, country: string) => {
  const pattern = PHONE_PATTERNS[country as keyof typeof PHONE_PATTERNS];
  const cleanValue = value.replace(/\D/g, '');
  
  let formatted = pattern.code;
  const digits = cleanValue.substring(pattern.code.replace(/\D/g, '').length);
  
  switch (country) {
    case 'BY':
    case 'UA':
      if (digits.length > 0) formatted += ` (${digits.substring(0, 2)}`;
      if (digits.length > 2) formatted += `) ${digits.substring(2, 5)}`;
      if (digits.length > 5) formatted += `-${digits.substring(5, 7)}`;
      if (digits.length > 7) formatted += `-${digits.substring(7, 9)}`;
      break;
    case 'RU':
      if (digits.length > 0) formatted += ` (${digits.substring(0, 3)}`;
      if (digits.length > 3) formatted += `) ${digits.substring(3, 6)}`;
      if (digits.length > 6) formatted += `-${digits.substring(6, 8)}`;
      if (digits.length > 8) formatted += `-${digits.substring(8, 10)}`;
      break;
    case 'KZ':
      if (digits.length > 0) formatted += ` (7${digits.substring(0, 2)}`;
      if (digits.length > 2) formatted += `) ${digits.substring(2, 5)}`;
      if (digits.length > 5) formatted += `-${digits.substring(5, 7)}`;
      if (digits.length > 7) formatted += `-${digits.substring(7, 9)}`;
      break;
  }
  
  return formatted;
};

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  id,
  required = false
}) => {
  const [country, setCountry] = useState<string>('BY');

  useEffect(() => {
    if (value) {
      const detectedCountry = detectCountry(value);
      setCountry(detectedCountry);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanValue = inputValue.replace(/\D/g, '');
    
    // Определяем страну по введенным цифрам
    const detectedCountry = detectCountry(cleanValue);
    setCountry(detectedCountry);
    
    // Ограничиваем количество цифр
    const pattern = PHONE_PATTERNS[detectedCountry as keyof typeof PHONE_PATTERNS];
    const maxDigits = pattern.code.replace(/\D/g, '').length + 9; // код страны + 9 цифр номера
    
    if (cleanValue.length <= maxDigits) {
      const formatted = formatPhone(cleanValue, detectedCountry);
      onChange(formatted);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Разрешаем навигационные клавиши
    if ([
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ].includes(e.key)) {
      return;
    }
    
    // Разрешаем Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
      return;
    }
    
    // Разрешаем только цифры и знак +
    if (!/[\d+]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const currentPattern = PHONE_PATTERNS[country as keyof typeof PHONE_PATTERNS];
  
  return (
    <Input
      id={id}
      type="tel"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder || currentPattern.placeholder}
      className={cn("font-mono", className)}
      maxLength={currentPattern.maxLength}
      required={required}
    />
  );
};
