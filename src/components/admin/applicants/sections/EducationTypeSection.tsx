
import React from 'react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Applicant } from '@/hooks/useApplicants';

interface EducationTypeSectionProps {
  applicant: Applicant;
  onApplicantChange: (applicant: Applicant) => void;
}

const EducationTypeSection = ({ applicant, onApplicantChange }: EducationTypeSectionProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Вид образования *</Label>
      <Tabs 
        value={applicant.education_type} 
        onValueChange={(value) => onApplicantChange({
          ...applicant,
          education_type: value,
          // Сбрасываем связанные поля при смене типа образования
          specialization_ids: [],
          study_form: '',
          budget: false
        })}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bachelor">Бакалавриат</TabsTrigger>
          <TabsTrigger value="master">Магистратура</TabsTrigger>
        </TabsList>
        <TabsContent value="bachelor" className="mt-4">
          <div className="p-4 border rounded-lg bg-blue-50">
            <h3 className="font-medium mb-2">Бакалавриат</h3>
            <p className="text-sm text-gray-600">Первая ступень высшего образования</p>
          </div>
        </TabsContent>
        <TabsContent value="master" className="mt-4">
          <div className="p-4 border rounded-lg bg-green-50">
            <h3 className="font-medium mb-2">Магистратура</h3>
            <p className="text-sm text-gray-600">Вторая ступень высшего образования</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationTypeSection;
