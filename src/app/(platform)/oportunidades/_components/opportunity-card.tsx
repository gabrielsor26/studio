
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Building, MapPin, ArrowRight } from 'lucide-react';
import type { Opportunity } from '@/lib/types';

const OpportunityCard = React.memo(function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const isPublic = opportunity.sector === 'Público';
  
  return (
     <Link href={`/oportunidades/${opportunity.id}`} className="block group">
        <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 w-full overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 p-8 flex items-center justify-center md:w-56 bg-muted/30 self-stretch border-b md:border-b-0 md:border-r">
                    <Image 
                        src={opportunity.company.logo} 
                        alt={`${opportunity.company.name} logo`} 
                        width={96} 
                        height={96} 
                        className="rounded-xl border bg-card group-hover:scale-105 transition-transform"
                        data-ai-hint="logo"
                    />
                </div>
                <div className="flex-grow p-8">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                             <Badge variant={isPublic ? 'default' : 'secondary'} className="text-sm font-semibold cursor-default">
                                Sector {opportunity.sector}
                             </Badge>
                            <CardTitle className="text-2xl font-headline leading-tight mt-3">
                                {opportunity.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 pt-2 text-lg">
                                <Building className="h-5 w-5" />
                                {opportunity.company.name}
                            </CardDescription>
                        </div>
                    </div>
                     <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-base text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-foreground" />
                          <span>{opportunity.modality}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-foreground" />
                          <span>{isPublic ? 'Entidad Gubernamental' : 'Empresa Privada'}</span>
                        </div>
                    </div>
                </div>
                 <div className="p-8 hidden md:block">
                    <ArrowRight className="h-8 w-8 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        </Card>
    </Link>
  );
});

export default OpportunityCard;
