'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Briefcase, Users, Calendar, UserCheck, Eye, Edit } from "lucide-react"
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { Opportunity } from "@/lib/types";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

async function getCompanyDashboardData(companyId: string): Promise<{ opportunities: Opportunity[], applicantsCount: number, interviewsCount: number }> {
    try {
        const res = await fetch(`/api/ofertas/empresa/${companyId}`);
        if (!res.ok) throw new Error('Failed to fetch opportunities');
        const opportunities: Opportunity[] = await res.json();
        
        // Mocking applicant and interview counts as backend endpoints are not specified for aggregate counts
        const applicantsCount = opportunities.reduce((acc, opp) => acc + (Math.floor(Math.random() * 20)), 0);
        const interviewsCount = Math.floor(applicantsCount / 5);

        return { opportunities, applicantsCount, interviewsCount };
    } catch (error) {
        console.error(error);
        return { opportunities: [], applicantsCount: 0, interviewsCount: 0 };
    }
}


export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [newApplicants, setNewApplicants] = useState(0);
  const [scheduledInterviews, setScheduledInterviews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.currentProfileId) {
      setLoading(true);
      getCompanyDashboardData(user.currentProfileId)
        .then(data => {
          setOpportunities(data.opportunities);
          setNewApplicants(data.applicantsCount);
          setScheduledInterviews(data.interviewsCount);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading) {
      return (
          <div className="space-y-8">
              <Skeleton className="h-20 w-1/2" />
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
              </div>
              <Skeleton className="h-96" />
          </div>
      )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">Dashboard de Empresa</h1>
        <p className="text-muted-foreground text-xl mt-2">Gestiona tus ofertas y encuentra el mejor talento.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Ofertas Activas
            </CardTitle>
            <Briefcase className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{opportunities.length}</div>
            <p className="text-sm text-muted-foreground">
              Total de vacantes publicadas
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">
              Nuevos Postulantes
            </CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">+{newApplicants}</div>
            <p className="text-sm text-muted-foreground">
              En la última semana
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Entrevistas Agendadas</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{scheduledInterviews}</div>
            <p className="text-sm text-muted-foreground">
              Para esta semana
            </p>
          </CardContent>
        </Card>
         <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Tasa de Contratación</CardTitle>
            <UserCheck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">12%</div>
            <p className="text-sm text-muted-foreground">
              +2% vs. el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-6">
            <div>
                <CardTitle>Mis Ofertas Recientes</CardTitle>
                <CardDescription>Visualiza y gestiona tus vacantes publicadas.</CardDescription>
            </div>
            <Button asChild size="lg">
                <Link href="/empresa/ofertas/nueva">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Crear nueva oferta
                </Link>
            </Button>
        </CardHeader>
        <CardContent className="p-6 pt-0">
            <div className="space-y-6">
                {opportunities.slice(0, 3).map((opp, index) => (
                    <Card key={opp.id} className="flex items-center p-6 gap-6 hover:bg-muted/50 transition-colors">
                        <Image src={opp.company.logo} alt={opp.company.name} width={64} height={64} className="rounded-lg border bg-background" data-ai-hint="logo" />
                        <div className="flex-grow">
                            <Link href={`/oportunidades/${opp.id}`} className="font-semibold text-lg hover:underline stretched-link">{opp.title}</Link>
                            <p className="text-base text-muted-foreground">{opp.modality}</p>
                        </div>
                        <div className="flex items-center gap-8 text-base text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Eye className="h-5 w-5" /> 
                                <span>1,2k vistas</span>
                            </div>
                             <Link href={`/empresa/ofertas/${opp.id}/postulantes`} className="flex items-center gap-2 hover:text-primary">
                                <Users className="h-5 w-5" /> 
                                {/* Placeholder for applicants count */}
                                <span>{Math.floor(Math.random() * 50) + 1} postulantes</span>
                            </Link>
                        </div>
                        <Button variant="outline" size="lg" asChild>
                            <Link href={`/empresa/ofertas/editar/${opp.id}`}>
                                <Edit className="mr-2 h-5 w-5"/>
                                Editar
                            </Link>
                        </Button>
                    </Card>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
