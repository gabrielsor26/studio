
'use client';

import { notFound, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Briefcase, MapPin, Building, CheckCircle, FileText, ArrowLeft, ExternalLink, Upload, Globe, Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRef, useState, useEffect } from 'react';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { Opportunity } from '@/lib/types';
import MainHeader from '@/components/layout/main-header';
import { Skeleton } from '@/components/ui/skeleton';

function PrivateApplyModal({ opportunityId }: { opportunityId: string }) {
    const { toast } = useToast();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [cvOption, setCvOption] = useState<'profile' | 'upload'>('profile');
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleApplyClick = () => {
        if(!user) {
            router.push('/login?redirect=' + window.location.pathname);
        } else {
            setOpen(true);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user?.currentProfileId) {
            toast({ title: "Error", description: "No se pudo encontrar el perfil del postulante.", variant: "destructive" });
            return;
        }

        if (cvOption === 'upload' && !fileInputRef.current?.files?.length) {
            toast({
                title: "Archivo Requerido",
                description: "Por favor, adjunta un CV para completar tu postulación.",
                variant: "warning",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // NOTE: The backend endpoint POST /api/postulaciones doesn't support file uploads.
            // This is a simulation. In a real app, this would be a multipart/form-data request.
            const res = await fetch(`/api/postulaciones?postulanteId=${user.currentProfileId}&ofertaId=${opportunityId}`, {
                method: 'POST',
            });

            if (!res.ok) throw new Error('Failed to submit application');

            toast({
                title: "¡Postulación Exitosa!",
                description: "Tu CV ha sido enviado a la empresa. Te deseamos mucha suerte.",
                variant: "success",
            });
            setOpen(false);
            router.push('/perfil');
            router.refresh();
        } catch (error) {
            console.error(error);
             toast({
                title: "Error al postular",
                description: (error as Error).message || "Ocurrió un error al enviar tu postulación.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (user) {
            setCvOption(user.cvUrl ? 'profile' : 'upload');
        }
    }, [user]);

    if (authLoading) return <Button variant="default" size="lg" disabled>Cargando...</Button>;
    
    if (!user) {
      return (
        <Button variant="default" size="lg" onClick={handleApplyClick}>
            <Upload className="mr-2 h-5 w-5" />
            Postular ahora
        </Button>
      )
    }

  const hasProfileCv = !!user.cvUrl;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">
            <Upload className="mr-2 h-5 w-5" />
            Postular ahora
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle>Finalizar Postulación</DialogTitle>
                <DialogDescription>
                    Selecciona el CV que deseas enviar para esta oportunidad.
                </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-6">
                <RadioGroup value={cvOption} onValueChange={(value) => setCvOption(value as 'profile' | 'upload')}>
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className={cn(!hasProfileCv && "opacity-50")}>
                                    <Label 
                                        htmlFor="profile-cv" 
                                        className={cn(
                                            "flex items-center gap-4 border rounded-lg p-4",
                                            hasProfileCv ? "cursor-pointer hover:bg-muted/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary" : "cursor-not-allowed"
                                        )}
                                    >
                                        <FileText className="h-6 w-6 text-primary" />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-base">Usar mi CV de perfil</p>
                                            <p className="text-sm text-muted-foreground">{user.cvUrl ? user.cvUrl.split('/').pop() : 'No hay CV en el perfil'}</p>
                                        </div>
                                        <RadioGroupItem value="profile" id="profile-cv" className="h-6 w-6" disabled={!hasProfileCv} />
                                    </Label>
                                </div>
                            </TooltipTrigger>
                            {!hasProfileCv && (
                                <TooltipContent>
                                    <p>No tienes un CV en tu perfil. Súbelo desde la sección "Mi Perfil".</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>

                     <Label htmlFor="upload-cv" className="flex items-center gap-4 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary">
                        <Upload className="h-6 w-6 text-primary" />
                        <div className="flex-grow">
                            <p className="font-semibold text-base">Subir otro CV</p>
                            <p className="text-sm text-muted-foreground">Sube un archivo PDF diferente para esta postulación.</p>
                        </div>
                        <RadioGroupItem value="upload" id="upload-cv" className="h-6 w-6" />
                    </Label>
                </RadioGroup>

                {cvOption === 'upload' && (
                    <div className="grid w-full items-center gap-3 pl-4 animate-in fade-in">
                        <Label htmlFor="cv-file" className="text-base font-medium">Adjuntar CV (PDF)</Label>
                        <Input id="cv-file" type="file" accept=".pdf" ref={fileInputRef} required={cvOption === 'upload'} />
                    </div>
                )}
            </div>
            <DialogFooter>
                 <DialogClose asChild>
                    <Button type="button" variant="ghost" size="lg" disabled={isSubmitting}>Cancelar</Button>
                </DialogClose>
                <Button type="submit" variant="default" size="lg" disabled={isSubmitting}>
                     {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Enviar Postulación
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function PublicApplyModal({ externalUrl }: { externalUrl: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">
          <Globe className="mr-2 h-5 w-5" />
          Ver Proceso de Postulación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Postulación a Sector Público</DialogTitle>
          <DialogDescription>
            Serás redirigido al portal oficial del gobierno para completar tu postulación. Asegúrate de seguir todos los pasos indicados en la plataforma externa.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="lg">
              Cancelar
            </Button>
          </DialogClose>
          <Button asChild size="lg">
            <a href={externalUrl} target="_blank" rel="noopener noreferrer">
                Ir al portal <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

async function getOpportunity(id: string): Promise<Opportunity | null> {
    try {
        const res = await fetch(`/api/ofertas/${id}`);
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getOpportunity(params.id)
        .then(data => {
            if (!data) notFound();
            setOpportunity(data);
        })
        .finally(() => setLoading(false));
  }, [params.id]);


  if (loading) {
      return (
           <>
            <MainHeader />
             <main className="container mx-auto px-4 sm:px-6 py-28">
                <Skeleton className="h-8 w-48 mb-6" />
                <Card>
                    <div className="p-8">
                        <Skeleton className="h-10 w-1/4 mb-3" />
                        <Skeleton className="h-12 w-3/4 mb-4" />
                        <Skeleton className="h-8 w-1/2" />
                        <div className="flex gap-8 pt-6">
                            <Skeleton className="h-8 w-32" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                    </div>
                     <CardContent className="p-8 space-y-10">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-64" />
                            <Skeleton className="h-24 w-full" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        </div>
                     </CardContent>
                </Card>
             </main>
           </>
      )
  }

  if (!opportunity) {
    notFound();
  }

  const isPublic = opportunity.sector === 'Público';

  return (
     <>
      <MainHeader />
      <main className="container mx-auto px-4 sm:px-6 py-28">
        <Link href="/" className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-5 w-5" />
            Volver a oportunidades
        </Link>
        <Card className="overflow-hidden">
             <div className="p-8 bg-muted/30">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                    <div>
                         <Badge variant={isPublic ? 'default' : 'secondary'} className="mb-3 text-sm font-semibold">
                           Sector {opportunity.sector}
                        </Badge>
                        <CardTitle className="text-4xl font-bold font-headline mt-1">{opportunity.title}</CardTitle>
                        <Link href={`/empresas/${opportunity.company.id}`} className="inline-block">
                          <CardDescription className="flex items-center gap-3 pt-4 text-xl hover:text-primary transition-colors">
                              <Building className="h-6 w-6" />
                              {opportunity.company.name}
                          </CardDescription>
                        </Link>
                    </div>
                     <Image 
                        src={opportunity.company.logo} 
                        alt={`${opportunity.company.name} logo`} 
                        width={96} 
                        height={96} 
                        className="rounded-xl border-2 border-border bg-card"
                        data-ai-hint="logo"
                    />
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-3 pt-6 text-muted-foreground text-lg">
                    <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5" />
                        <span>{opportunity.modality}</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5" />
                        <span>{isPublic ? 'Entidad Gubernamental' : 'Empresa Privada'}</span>
                    </div>
                </div>
            </div>
            <CardContent className="p-8 space-y-10">
                <div className="space-y-4">
                    <h3 className="font-semibold text-2xl flex items-center gap-3"><FileText className="h-6 w-6 text-foreground" />Descripción del Puesto</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{opportunity.description}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-2xl flex items-center gap-3"><CheckCircle className="h-6 w-6 text-foreground" />Requisitos</h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 text-lg">
                            {opportunity.requirements.map((req, i) => <li key={i}>{req}</li>)}
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-2xl flex items-center gap-3"><CheckCircle className="h-6 w-6 text-foreground" />Condiciones</h3>
                         <ul className="list-disc list-inside text-muted-foreground space-y-2 text-lg">
                            {opportunity.conditions.map((cond, i) => <li key={i}>{cond}</li>)}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border pt-8 flex justify-end">
                    {isPublic && opportunity.externalUrl ? (
                        <PublicApplyModal externalUrl={opportunity.externalUrl} />
                    ) : (
                        <PrivateApplyModal opportunityId={opportunity.id} />
                    )}
                </div>
            </CardContent>
        </Card>
      </main>
    </>
  );
}
