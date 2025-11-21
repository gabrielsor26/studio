
'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Building } from 'lucide-react';
import type { Company } from '@/lib/types';

const CompanyCard = React.memo(function CompanyCard({ company }: { company: Company }) {
  return (
    <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group">
      <CardContent className="p-8 flex flex-col items-center text-center">
        <Avatar className="h-32 w-32 border mb-6">
          <AvatarImage src={company.logo} alt={company.name} data-ai-hint="logo" />
          <AvatarFallback className="text-4xl">{company.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl font-headline">
          <Link href={`/empresas/${company.id}`} className="hover:text-primary transition-colors stretched-link">
            {company.name}
          </Link>
        </CardTitle>
        <CardDescription className="pt-2 text-base flex items-center gap-2">
            <Building className="h-4 w-4"/> {company.sector}
        </CardDescription>
        <p className="text-base text-muted-foreground mt-4 line-clamp-3 flex-grow">
            {company.description}
        </p>
      </CardContent>
    </Card>
  );
});

export default CompanyCard;
