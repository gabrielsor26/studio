
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Briefcase, Building, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MainHeader from '@/components/layout/main-header';
import OpportunityCard from '../../oportunidades/_components/opportunity-card';
import type { Company, Opportunity } from '@/lib/types';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function getCompanyData(companyId: string): Promise<{ company: Company | null; opportunities: Opportunity[] }> {
    try {
        const [companyRes, opportunitiesRes] = await Promise.all([
            fetch(`/api/empresas/${companyId}`),
            fetch(`/api/ofertas/empresa/${companyId}`)
        ]);

        if (!companyRes.ok) return { company: null, opportunities: [] };
        const company = await companyRes.json();

        const opportunities = opportunitiesRes.ok ? await opportunitiesRes.json() : [];
        
        return { company, opportunities };
    } catch (error) {
        console.error(error);
        return { company: null, opportunities: [] };
    }
}


export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCompanyData(params.id)
        .then(data => {
            if (!data.company) {
                notFound();
            } else {
                setCompany(data.company);
                setOpportunities(data.opportunities);
            }
        })
        .finally(() => setLoading(false));
  }, [params.id]);


  if (loading) {
      return (
          <>
            <MainHeader />
            <main className="container mx-auto px-4 sm:px-6 py-28 space-y-10">
                <Skeleton className="h-8 w-48" />
                <Card>
                    <CardHeader className="p-8 md:p-12">
                         <div className="flex flex-col sm:flex-row items-start gap-8">
                            <Skeleton className="h-32 w-32 rounded-xl" />
                            <div className="flex-grow space-y-4">
                                <Skeleton className="h-10 w-1/2" />
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 md:p-12">
                        <Skeleton className="h-10 w-1/3 mb-8" />
                        <div className="space-y-6">
                           <Skeleton className="h-32 w-full" />
                           <Skeleton className="h-32 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </main>
          </>
      )
  }

  if (!company) {
    notFound();
  }


  return (
    <>
    <MainHeader />
     <main className="container mx-auto px-4 sm:px-6 py-28 space-y-10">
        <Link href="/empresas" className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-5 w-5" />
            Volver a Empresas
        </Link>
        <Card className="overflow-hidden">
            <CardHeader className="p-8 md:p-12 bg-muted/30">
                <div className="flex flex-col sm:flex-row items-start gap-8">
                    <Image 
                        src={company.logo} 
                        alt={`${company.name} logo`} 
                        width={128} 
                        height={128} 
                        className="rounded-xl border-4 bg-card shadow-md shrink-0"
                        data-ai-hint="logo"
                    />
                    <div className="flex-grow">
                        <CardTitle className="text-4xl font-bold font-headline">{company.name}</CardTitle>
                        <div className="flex flex-wrap gap-x-8 gap-y-3 pt-4 text-lg text-muted-foreground">
                            <div className="flex items-center gap-3">
                                <Building className="h-5 w-5" />
                                <span>Sector {company.sector}</span>
                            </div>
                             <div className="flex items-center gap-3">
                                <Globe className="h-5 w-5" />
                                <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="text-primary hover:underline">{company.website}</a>
                            </div>
                        </div>
                        <CardDescription className="pt-6 text-lg leading-relaxed">{company.description}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 md:p-12">
                <h3 className="text-3xl font-bold font-headline mb-8">Ofertas de Trabajo Activas ({opportunities.length})</h3>
                <div className="space-y-6">
                    {opportunities.length > 0 ? (
                        opportunities.map((opp) => (
                           <OpportunityCard key={opp.id} opportunity={opp} />
                        ))
                    ) : (
                        <div className="text-center py-12 text-muted-foreground space-y-4 bg-card rounded-lg border">
                            <Briefcase className="mx-auto h-16 w-16 text-primary/80" />
                            <p className="font-semibold text-xl mt-4">Sin ofertas activas</p>
                            <p className="text-base">Esta empresa no tiene vacantes publicadas en este momento.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
      </main>
    </>
  );
}
