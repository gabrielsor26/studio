
'use client';

import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Briefcase, Mail, Upload, FileText, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useMemo } from 'react';
import ApplicationTracker from './_components/application-tracker';
import type { Application } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

function UploadCVButton() {
    const { toast } = useToast();
    const { user, login } = useAuth();
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);

    const cvFileName = useMemo(() => {
        if (user?.cvUrl) {
            try {
                // Attempt to decode URI component in case of encoded names
                return decodeURIComponent(user.cvUrl.split('/').pop() || "CV Guardado");
            } catch (e) {
                return user.cvUrl.split('/').pop() || "CV Guardado";
            }
        }
        return null;
    }, [user?.cvUrl]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!user?.currentProfileId) return;

        if (file.type !== 'application/pdf') {
            toast({ title: "Error de formato", description: "Solo se permiten archivos PDF.", variant: "warning" });
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5 MB
            toast({ title: "Archivo demasiado grande", description: "El CV no debe exceder los 5 MB.", variant: "warning" });
            return;
        }
        
        setIsUploading(true);

        // This is a mock upload. A real implementation would upload to a storage service
        // and then call the PUT /api/postulantes/{id} endpoint with the new URL.
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockCvUrl = `/uploads/CV_${file.name}`;
            
            const res = await fetch(`/api/postulantes/${user.currentProfileId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cvFile: mockCvUrl }),
            });

            if (!res.ok) throw new Error('Failed to update CV');

            toast({ title: "CV Actualizado", description: `"${file.name}" se ha cargado exitosamente.`, variant: "success" });
            
            // Re-login to get updated user object
            if (user.email) {
                await login(user.email, 'password', 'user'); 
            }
            router.refresh();

        } catch (error) {
            console.error(error);
            toast({ title: "Error al subir", description: "No se pudo actualizar el CV.", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
                <h3 className="font-semibold text-xl flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary"/>
                    Mi Curriculum Vitae
                </h3>
                 <p className="text-base text-muted-foreground mt-2">
                    {cvFileName ? `Archivo actual: ${cvFileName}` : "Sube tu CV en formato PDF (máx. 5MB)."}
                 </p>
            </div>
            <Button asChild size="lg" disabled={isUploading}>
                <label htmlFor="cv-upload">
                    {isUploading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Upload className="mr-2 h-5 w-5" />}
                    {cvFileName ? 'Reemplazar CV' : 'Subir CV'}
                    <input id="cv-upload" type="file" accept=".pdf" className="sr-only" onChange={handleFileChange} disabled={isUploading} />
                </label>
            </Button>
        </div>
    )
}

async function getMyApplications(postulanteId: string): Promise<Application[]> {
    try {
        const res = await fetch(`/api/postulaciones/postulante/${postulanteId}`);
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}


export default function ProfilePage() {
  const { user, login } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    if (user?.currentProfileId) {
        setLoading(true);
        getMyApplications(user.currentProfileId)
            .then(setApplications)
            .finally(() => setLoading(false));
    } else if(user && !user.currentProfileId) {
        // This is the "complete profile" step 2
        setLoading(false);
    }
  }, [user]);

  const handleCompleteProfile = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!user?.id) return;
      
      const formData = new FormData(e.currentTarget);
      const nombrePost = formData.get('name') as string;
      if (!nombrePost) {
          toast({ title: "Nombre requerido", description: "Por favor, ingresa tu nombre completo.", variant: "warning" });
          return;
      }
      setIsCompleting(true);
      try {
          const res = await fetch(`/api/postulantes?usuarioId=${user.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ nombrePost, cvFile: '' }), // CV is uploaded separately
          });
          if (!res.ok) throw new Error('Failed to create profile');

          toast({ title: "Perfil Creado", description: "¡Bienvenido! Ahora puedes completar tu perfil.", variant: "success"});
          
          // Re-login to get the full user object with relations
          if (user.email) {
              await login(user.email, 'password', 'user');
          }
          router.refresh();

      } catch (error) {
          console.error(error);
          toast({ title: "Error", description: "No se pudo crear el perfil.", variant: "destructive" });
      } finally {
          setIsCompleting(false);
      }
  }

  if (!user) return null;

  // Render a "Complete Profile" form if applicantId is missing
  if (!user.currentProfileId) {
      return (
           <div className="max-w-xl mx-auto space-y-8 mt-10">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Completa tu Perfil</CardTitle>
                        <p className="text-muted-foreground">Necesitamos algunos datos más para finalizar tu registro.</p>
                    </CardHeader>
                    <form onSubmit={handleCompleteProfile}>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="name">Nombre Completo</Label>
                                <Input id="name" name="name" defaultValue={user.name} required />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isCompleting}>
                                {isCompleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar y Continuar
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
           </div>
      )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
       <Card>
        <CardHeader className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left p-8">
          <Avatar className="h-32 w-32 border-4 border-background shadow-md">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person" />
            <AvatarFallback className="text-6xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <CardTitle className="text-4xl font-bold font-headline">{user.name}</CardTitle>
            <div className="flex flex-col md:flex-row gap-x-8 gap-y-3 mt-4 text-muted-foreground text-lg">
                <div className="flex items-center justify-center md:justify-start gap-3">
                    <Mail className="h-5 w-5"/> {user.email}
                </div>
                 <div className="flex items-center justify-center md:justify-start gap-3 capitalize">
                    <Briefcase className="h-5 w-5"/> {user.roleName}
                </div>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-8">
             <UploadCVButton />
        </CardContent>
      </Card>
      
      <div className="space-y-8">
        <h2 className="text-3xl font-bold font-headline">Estado de mis postulaciones</h2>
        {loading ? (
            <div className="space-y-8">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        ) : applications.length > 0 ? (
            <div className="space-y-8">
                {applications.map((app) => (
                    <ApplicationTracker key={app.id} application={app} />
                ))}
            </div>
        ) : (
            <Card className="text-center py-16">
                <CardContent>
                    <p className="text-xl text-muted-foreground">Aún no tienes postulaciones.</p>
                    <p className="mt-2">¡Explora las ofertas y comienza a postular!</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
