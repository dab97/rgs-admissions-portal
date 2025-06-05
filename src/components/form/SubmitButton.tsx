
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
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
  );
};

export default SubmitButton;
