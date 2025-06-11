
import React from 'react';
import { Input } from '@/components/ui/input';
import { CountrySelector } from '@/components/ui/country-selector';
import { usePhoneInput } from '@/hooks/usePhoneInput';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  id,
  required = false
}) => {
  const {
    country,
    handleCountryChange,
    handleInputChange,
    handleKeyDown,
    currentPattern
  } = usePhoneInput(value, onChange);

  return (
    <div className="flex gap-2">
      <CountrySelector 
        value={country}
        onChange={handleCountryChange}
      />
      
      <Input
        id={id}
        type="tel"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || currentPattern.placeholder}
        className={cn("font-mono flex-1", className)}
        maxLength={currentPattern.maxLength}
        required={required}
      />
    </div>
  );
};
