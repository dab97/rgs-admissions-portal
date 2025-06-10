
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const detectCountry = (value: string): keyof typeof PHONE_PATTERNS => {
  const cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.startsWith('375')) return 'BY';
  if (cleanValue.startsWith('380')) return 'UA';
  if (cleanValue.startsWith('7') && cleanValue.length > 1) {
    const secondDigit = cleanValue[1];
    if (secondDigit === '7') return 'KZ';
    return 'RU';
  }
  
  return 'BY'; // по умолчанию
};

const formatPhone = (value: string, country: keyof typeof PHONE_PATTERNS) => {
  const pattern = PHONE_PATTERNS[country];
  const cleanValue = value.replace(/\D/g, '');
  const codeDigits = pattern.code.replace(/\D/g, '');
  
  // Если номер не начинается с кода страны, добавляем его
  let fullNumber = cleanValue;
  if (!cleanValue.startsWith(codeDigits)) {
    fullNumber = codeDigits + cleanValue;
  }
  
  // Ограничиваем общее количество цифр
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

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  id,
  required = false
}) => {
  const [country, setCountry] = useState<keyof typeof PHONE_PATTERNS>('BY');

  useEffect(() => {
    if (value) {
      const detectedCountry = detectCountry(value);
      setCountry(detectedCountry);
    }
  }, []);

  const handleCountryChange = (newCountry: keyof typeof PHONE_PATTERNS) => {
    setCountry(newCountry);
    const pattern = PHONE_PATTERNS[newCountry];
    onChange(pattern.code);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanValue = inputValue.replace(/\D/g, '');
    
    // Определяем максимальное количество цифр для выбранной страны
    const pattern = PHONE_PATTERNS[country];
    const codeDigits = pattern.code.replace(/\D/g, '');
    const maxDigits = codeDigits.length + pattern.digitCount;
    
    if (cleanValue.length <= maxDigits) {
      const formatted = formatPhone(cleanValue, country);
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
    
    // Разрешаем только цифры
    if (!/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  const currentPattern = PHONE_PATTERNS[country];
  
  return (
    <div className="flex gap-2">
      <Select value={country} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue>
            <span className="flex items-center gap-2">
              {currentPattern.flag} {currentPattern.code}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(PHONE_PATTERNS).map(([key, pattern]) => (
            <SelectItem key={key} value={key}>
              <span className="flex items-center gap-2">
                {pattern.flag} {pattern.code} {pattern.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input
        id={id}
        type="tel"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || currentPattern.placeholder}
        className={cn("font-mono flex-1", className)}
        maxLength={currentPattern.maxLength}
        required={required}
      />
    </div>
  );
};
