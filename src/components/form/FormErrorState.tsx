
import React from 'react';

interface FormErrorStateProps {
  error: string;
}

const FormErrorState = ({ error }: FormErrorStateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-red-600">{error}</div>
    </div>
  );
};

export default FormErrorState;
