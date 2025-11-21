
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import type { Application } from '@/lib/types';

const ApplicationTracker = React.memo(function ApplicationTracker({ application }: { application: Application }) {
  const getStatusClasses = (status: Application['status'], step: Application['status'], index: number) => {
    const statusTimeline: Application['status'][] = ['Postulado', 'En Revisión', 'Entrevista', 'Aceptado'];
    const currentStatusIndex = statusTimeline.indexOf(status);
    const isRejected = status === 'Rechazado';

    if (isRejected) {
      if (index === 0) return 'bg-primary text-primary-foreground';
      return 'bg-destructive text-destructive-foreground';
    }

    if (index <= currentStatusIndex) {
      return 'bg-primary text-primary-foreground';
    }
    
    return 'bg-muted text-muted-foreground';
  };
  
  const statusTimeline: Application['status'][] = ['Postulado', 'En Revisión', 'Entrevista', 'Aceptado'];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-xl">{application.opportunity.title}</p>
            <p className="text-base text-muted-foreground">{application.opportunity.company.name}</p>
          </div>
          <div className="text-base text-muted-foreground self-start sm:self-center shrink-0">
            {application.date}
          </div>
        </div>

        <div className="relative pt-16 pb-4">
          <div className="absolute top-[calc(4.5rem-0.5rem)] left-0 w-full h-1 bg-border" />
          <div className="relative flex justify-between items-start">
            {statusTimeline.map((statusStep, index) => (
              <div key={statusStep} className="flex flex-col items-center text-center w-32 z-10">
                <div className={`
                  h-12 w-12 rounded-full flex items-center justify-center font-bold border-4 border-background
                  ${getStatusClasses(application.status, statusStep, index)}
                `}>
                  {application.status === 'Rechazado' && index > 0 ? (
                     <X className="h-6 w-6" />
                  ) : (
                     <Check className="h-6 w-6" />
                  )}
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">{statusStep}</p>
              </div>
            ))}
          </div>
        </div>
        {application.status === 'Rechazado' && (
          <p className="text-center text-destructive font-semibold text-base mt-2 bg-destructive/10 p-4 rounded-lg">
            Postulación Rechazada
          </p>
        )}
      </CardContent>
    </Card>
  );
});

export default ApplicationTracker;
