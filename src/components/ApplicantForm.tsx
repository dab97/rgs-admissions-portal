
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Phone, Mail, GraduationCap, Loader2 } from 'lucide-react';
import { useApplicantData } from '@/hooks/useApplicantData';
import { useApplicantSubmit } from '@/hooks/useApplicantSubmit';
import { APP_CONSTANTS, ApplicantFormData } from '@/constants';

const ApplicantForm = () => {
  const { responsiblePersons, specializations, loading, error } = useApplicantData();
  const { submitApplicant, isSubmitting } = useApplicantSubmit();

  const [formData, setFormData] = useState<ApplicantFormData>({
    responsible_id: '',
    full_name: '',
    phone: '',
    email: '',
    specialization_ids: [],
    study_form: '',
    education_type: '',
    budget: false,
    stream: undefined,
    gender: '',
    citizenship: '',
    is_adult: undefined,
    disability: undefined,
    education_document: '',
    contact_person_name: '',
    contact_person_phone: '',
    how_did_you_know: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.responsible_id || !formData.full_name || !formData.phone || 
        !formData.study_form || !formData.education_type || 
        formData.specialization_ids.length === 0) {
      return;
    }

    const result = await submitApplicant(formData);
    
    if (result.success) {
      // Сброс формы
      setFormData({
        responsible_id: '',
        full_name: '',
        phone: '',
        email: '',
        specialization_ids: [],
        study_form: '',
        education_type: '',
        budget: false,
        stream: undefined,
        gender: '',
        citizenship: '',
        is_adult: undefined,
        disability: undefined,
        education_document: '',
        contact_person_name: '',
        contact_person_phone: '',
        how_did_you_know: ''
      });
    }
  };

  const handleSpecializationChange = (specializationId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialization_ids: checked 
        ? [...prev.specialization_ids, specializationId]
        : prev.specialization_ids.filter(id => id !== specializationId)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка данных...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

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
                  {APP_CONSTANTS.UNIVERSITY.FULL_NAME}
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
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, responsible_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите ответственного" />
                    </SelectTrigger>
                    <SelectContent>
                      {responsiblePersons.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name}
                        </SelectItem>
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
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      required
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
                  {specializations.map((specialization) => (
                    <div key={specialization.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={specialization.id}
                        checked={formData.specialization_ids.includes(specialization.id)}
                        onCheckedChange={(checked) => 
                          handleSpecializationChange(specialization.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={specialization.id} className="text-sm">
                        {specialization.name}
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
                    value={formData.study_form}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, study_form: value }))}
                  >
                    {APP_CONSTANTS.STUDY_FORMS.map((form) => (
                      <div key={form.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={form.value} id={form.value} />
                        <Label htmlFor={form.value}>{form.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Вид образования *</Label>
                  <RadioGroup 
                    value={formData.education_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, education_type: value }))}
                  >
                    {APP_CONSTANTS.EDUCATION_TYPES.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={type.value} id={type.value} />
                        <Label htmlFor={type.value}>{type.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Бюджет *</Label>
                  <RadioGroup 
                    value={formData.budget.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value === 'true' }))}
                  >
                    {APP_CONSTANTS.YES_NO_OPTIONS.map((option) => (
                      <div key={option.value.toString()} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value.toString()} id={`budget-${option.value}`} />
                        <Label htmlFor={`budget-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label>Поток</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, stream: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите поток" />
                    </SelectTrigger>
                    <SelectContent>
                      {APP_CONSTANTS.STREAMS.map((stream) => (
                        <SelectItem key={stream.value} value={stream.value.toString()}>
                          {stream.label}
                        </SelectItem>
                      ))}
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
                      {APP_CONSTANTS.GENDERS.map((gender) => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
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
                    value={formData.is_adult?.toString() || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, is_adult: value === 'true' }))}
                  >
                    {APP_CONSTANTS.YES_NO_OPTIONS.map((option) => (
                      <div key={option.value.toString()} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value.toString()} id={`adult-${option.value}`} />
                        <Label htmlFor={`adult-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              {/* Инвалидность и документ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Инвалидность</Label>
                  <RadioGroup 
                    value={formData.disability?.toString() || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, disability: value === 'true' }))}
                  >
                    {APP_CONSTANTS.YES_NO_OPTIONS.map((option) => (
                      <div key={option.value.toString()} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value.toString()} id={`disability-${option.value}`} />
                        <Label htmlFor={`disability-${option.value}`}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Документ об образовании</Label>
                  <Input
                    placeholder="Аттестат, диплом и т.д."
                    value={formData.education_document}
                    onChange={(e) => setFormData(prev => ({ ...prev, education_document: e.target.value }))}
                  />
                </div>
              </div>

              {/* Контактное лицо */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Ф.И.О. Контактного лица</Label>
                  <Input
                    placeholder="Введите ФИО"
                    value={formData.contact_person_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_person_name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Телефон Контактного лица</Label>
                  <Input
                    placeholder="+375 (29) 123-45-67"
                    value={formData.contact_person_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_person_phone: e.target.value }))}
                  />
                </div>
              </div>

              {/* Откуда узнали */}
              <div className="space-y-2">
                <Label>Откуда узнали о нас?</Label>
                <Textarea
                  placeholder="Социальные сети, друзья, реклама и т.д."
                  value={formData.how_did_you_know}
                  onChange={(e) => setFormData(prev => ({ ...prev, how_did_you_know: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  'Подать заявку'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicantForm;
