
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Phone, Mail, GraduationCap } from 'lucide-react';

const ApplicantForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    responsible: '',
    fullName: '',
    phone: '',
    email: '',
    specializations: [],
    studyForm: '',
    educationType: '',
    budget: '',
    stream: '',
    gender: '',
    citizenship: '',
    isAdult: '',
    disability: '',
    educationDocument: '',
    contactPersonName: '',
    contactPersonPhone: '',
    howDidYouKnow: ''
  });

  const responsibleOptions = [
    'Иванов И.И.',
    'Петрова А.С.',
    'Сидоров М.К.',
    'Козлова Е.В.',
    'Морозов Д.А.'
  ];

  const specializationOptions = [
    'Психология',
    'Социальная работа',
    'Юриспруденция',
    'Экономика',
    'Менеджмент',
    'Информационные технологии',
    'Педагогическое образование',
    'Лингвистика',
    'Журналистика',
    'Реклама и связи с общественностью'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет интеграция с Supabase
    console.log('Form submitted:', formData);
    toast({
      title: "Заявка принята!",
      description: "Данные поступающего успешно сохранены в системе.",
    });
  };

  const handleSpecializationChange = (specialization: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specializations: checked 
        ? [...prev.specializations, specialization]
        : prev.specializations.filter(s => s !== specialization)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  Регистрация поступающего
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Российский Государственный Социальный Университет в г. Минске
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Ответственный */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="responsible">Ответственный *</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, responsible: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите ответственного" />
                    </SelectTrigger>
                    <SelectContent>
                      {responsibleOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ФИО Поступающего */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Фамилия Имя Отчество *</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      placeholder="Введите ФИО"
                      className="pl-10"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Контактная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Номер телефона *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="+375 (29) 123-45-67"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
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
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Направления подготовки */}
              <div className="space-y-3">
                <Label>Направления подготовки *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {specializationOptions.map((specialization) => (
                    <div key={specialization} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialization}
                        onCheckedChange={(checked) => 
                          handleSpecializationChange(specialization, checked as boolean)
                        }
                      />
                      <Label htmlFor={specialization} className="text-sm">
                        {specialization}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Форма обучения и тип образования */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label>Форма обучения *</Label>
                  <RadioGroup 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, studyForm: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full-time" id="full-time" />
                      <Label htmlFor="full-time">Очная</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="part-time" id="part-time" />
                      <Label htmlFor="part-time">Очно-Заочная</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="distance" id="distance" />
                      <Label htmlFor="distance">Заочная</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Вид образования *</Label>
                  <RadioGroup 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, educationType: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bachelor" id="bachelor" />
                      <Label htmlFor="bachelor">Бакалавриат</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="master" id="master" />
                      <Label htmlFor="master">Магистратура</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Бюджет *</Label>
                  <RadioGroup 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="budget-yes" />
                      <Label htmlFor="budget-yes">Да</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="budget-no" />
                      <Label htmlFor="budget-no">Нет</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label>Поток</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, stream: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите поток" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 поток</SelectItem>
                      <SelectItem value="2">2 поток</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Пол</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите пол" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Мужской</SelectItem>
                      <SelectItem value="female">Женский</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Гражданство</Label>
                  <Input
                    placeholder="Беларусь"
                    value={formData.citizenship}
                    onChange={(e) => setFormData(prev => ({ ...prev, citizenship: e.target.value }))}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Совершеннолетний</Label>
                  <RadioGroup 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, isAdult: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="adult-yes" />
                      <Label htmlFor="adult-yes">Да</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="adult-no" />
                      <Label htmlFor="adult-no">Нет</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Инвалидность и документ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Инвалидность</Label>
                  <RadioGroup 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, disability: value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="disability-yes" />
                      <Label htmlFor="disability-yes">Да</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="disability-no" />
                      <Label htmlFor="disability-no">Нет</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Документ об образовании</Label>
                  <Input
                    placeholder="Аттестат, диплом и т.д."
                    value={formData.educationDocument}
                    onChange={(e) => setFormData(prev => ({ ...prev, educationDocument: e.target.value }))}
                  />
                </div>
              </div>

              {/* Контактное лицо */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Ф.И.О. Контактного лица</Label>
                  <Input
                    placeholder="Введите ФИО"
                    value={formData.contactPersonName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPersonName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Телефон Контактного лица</Label>
                  <Input
                    placeholder="+375 (29) 123-45-67"
                    value={formData.contactPersonPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPersonPhone: e.target.value }))}
                  />
                </div>
              </div>

              {/* Откуда узнали */}
              <div className="space-y-2">
                <Label>Откуда узнали о нас?</Label>
                <Textarea
                  placeholder="Социальные сети, друзья, реклама и т.д."
                  value={formData.howDidYouKnow}
                  onChange={(e) => setFormData(prev => ({ ...prev, howDidYouKnow: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg"
              >
                Подать заявку
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantForm;
