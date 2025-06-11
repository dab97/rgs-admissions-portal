
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

interface FormFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const FormField = ({ id, label, icon, children }: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      {icon}
      {children}
    </div>
  </div>
);

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
      <FormField
        id="fullName"
        label="Фамилия Имя Отчество *"
        icon={<UserPlus className="absolute left-3 top-3 h-4 w-4 text-gray-400" />}
      >
        <Input
          id="fullName"
          placeholder="Введите ФИО"
          className="pl-10"
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          required
        />
      </FormField>

      <FormField
        id="phone"
        label="Номер телефона *"
        icon={<Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />}
      >
        <PhoneInput
          id="phone"
          value={phone}
          onChange={onPhoneChange}
          className="pl-10"
          required
        />
      </FormField>

      <FormField
        id="email"
        label="Email"
        icon={<Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />}
      >
        <Input
          id="email"
          type="email"
          placeholder="example@mail.com"
          className="pl-10"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </FormField>
    </div>
  );
};

export default ContactInfoSection;
