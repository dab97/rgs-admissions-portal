
import React from 'react';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Label } from '@/components/ui/label';
import { UserPlus, Phone, Mail } from 'lucide-react';

interface ContactInfoSectionProps {
  fullName: string;
  phone: string;
  email: string;
  onFullNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

const ContactInfoSection = ({
  fullName,
  phone,
  email,
  onFullNameChange,
  onPhoneChange,
  onEmailChange
}: ContactInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Фамилия Имя Отчество *</Label>
        <div className="relative">
          <UserPlus className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="fullName"
            placeholder="Введите ФИО"
            className="pl-10"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Номер телефона *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <PhoneInput
            id="phone"
            value={phone}
            onChange={onPhoneChange}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="example@mail.com"
            className="pl-10"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
