
import { useState, useEffect } from 'react';
import { detectCountry, formatPhone, validateDigitsOnly } from '@/utils/phoneUtils';
import { PHONE_PATTERNS } from '@/constants/phonePatterns';

export const usePhoneInput = (initialValue: string = '', onChange: (value: string) => void) => {
  const [country, setCountry] = useState<keyof typeof PHONE_PATTERNS>('BY');

  useEffect(() => {
    if (initialValue) {
      const detectedCountry = detectCountry(initialValue);
      setCountry(detectedCountry);
    }
  }, [initialValue]);

  const handleCountryChange = (newCountry: keyof typeof PHONE_PATTERNS) => {
    setCountry(newCountry);
    const pattern = PHONE_PATTERNS[newCountry];
    onChange(pattern.code);
  };

  const handleInputChange = (inputValue: string) => {
    const cleanValue = inputValue.replace(/\D/g, '');
    const pattern = PHONE_PATTERNS[country];
    const codeDigits = pattern.code.replace(/\D/g, '');
    const maxDigits = codeDigits.length + pattern.digitCount;
    
    if (cleanValue.length <= maxDigits) {
      const formatted = formatPhone(cleanValue, country);
      onChange(formatted);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!validateDigitsOnly(e.key, e.ctrlKey)) {
      e.preventDefault();
    }
  };

  return {
    country,
    handleCountryChange,
    handleInputChange,
    handleKeyDown,
    currentPattern: PHONE_PATTERNS[country]
  };
};
