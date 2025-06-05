
import React from 'react';
import { GraduationCap } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { APP_CONSTANTS } from '@/constants';

const FormHeader = () => {
  return (
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
  );
};

export default FormHeader;
