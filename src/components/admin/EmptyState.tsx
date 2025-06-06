
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EmptyStateProps {
  title: string;
  description: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, message }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          {message}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
