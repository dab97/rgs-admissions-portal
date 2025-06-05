
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

interface EducationTypeTabsSectionProps {
  educationType: string;
  onEducationTypeChange: (value: string) => void;
  children: React.ReactNode;
}

const EducationTypeTabsSection = ({
  educationType,
  onEducationTypeChange,
  children
}: EducationTypeTabsSectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold">Вид образования *</Label>
        <Tabs value={educationType} onValueChange={onEducationTypeChange} className="mt-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bachelor">Бакалавриат</TabsTrigger>
            <TabsTrigger value="master">Магистратура</TabsTrigger>
          </TabsList>
          <TabsContent value="bachelor" className="mt-6">
            <div className="p-4 border rounded-lg bg-blue-50">
              <h3 className="font-medium mb-2">Бакалавриат</h3>
              <p className="text-sm text-gray-600">Первая ступень высшего образования</p>
            </div>
          </TabsContent>
          <TabsContent value="master" className="mt-6">
            <div className="p-4 border rounded-lg bg-green-50">
              <h3 className="font-medium mb-2">Магистратура</h3>
              <p className="text-sm text-gray-600">Вторая ступень высшего образования</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {educationType && (
        <div className="space-y-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default EducationTypeTabsSection;
