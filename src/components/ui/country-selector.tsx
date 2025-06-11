
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PHONE_PATTERNS } from '@/constants/phonePatterns';

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ value, onChange }) => {
  const currentPattern = PHONE_PATTERNS[value];
  
  return (
    <Select value={value} onValueChange={onChange}>
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
  );
};
