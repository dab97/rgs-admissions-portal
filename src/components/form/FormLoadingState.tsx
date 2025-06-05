
import React from 'react';
import { Loader2 } from 'lucide-react';

interface FormLoadingStateProps {
  message?: string;
}

const FormLoadingState = ({ message = "Загрузка данных..." }: FormLoadingStateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default FormLoadingState;
