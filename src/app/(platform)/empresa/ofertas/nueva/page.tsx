
'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"

export default function NewOfferPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.currentProfileId) {
            toast({
                title: "Error de Autenticación",
                description: "No se pudo verificar la empresa. Intenta iniciar sesión de nuevo.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const modality = formData.get('modality') as string;
        const description = formData.get('description') as string;
        const requirements = formData.get('requirements') as string;
        
        if (!title || !modality || !description || !requirements) {
            toast({
                title: "Campos Incompletos",
                description: "Por favor, completa todos los campos requeridos.",
                variant: "warning",
            });
            setIsLoading(false);
            return;
        }

        const newOfferData = {
            nombreOferta: title,
            modalidad,
            descripcion: description,
            rubro: 'Tecnología', // Fixed value as per recommendations
            requisitos: requirements.split(',').map(req => req.trim()),
            condiciones: (formData.get('conditions') as string).split(',').map(cond => cond.trim()),
            // Add other fields as per your API spec for creating an offer
        };

        try {
            const res = await fetch(`/api/ofertas?empresaId=${user.currentProfileId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOfferData),
            });

            if (!res.ok) {
                throw new Error('No se pudo crear la oferta. Inténtalo de nuevo.');
            }

            toast({
                title: "¡Oferta Publicada!",
                description: "Tu nueva oferta de trabajo ya está visible para los postulantes.",
                variant: "success",
            });
            router.push("/empresa/ofertas");
            router.refresh(); // Re-fetch server-side data on the target page
        } catch (error) {
            console.error(error);
            toast({
                title: "Error al Publicar",
                description: (error as Error).message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                 <Link href="/empresa/ofertas" className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="h-5 w-5" />
                    Volver a mis ofertas
                </Link>
                <h1 className="text-4xl font-bold font-headline">Crear Nueva Oferta</h1>
                <p className="text-xl text-muted-foreground mt-2">Publica una nueva vacante para encontrar al candidato ideal.</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Detalles de la Vacante</CardTitle>
                        <CardDescription>Completa la información a continuación.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-3">
                            <Label htmlFor="title" className="text-base">Título del Puesto</Label>
                            <Input id="title" name="title" placeholder="Ej: Desarrollador Frontend Jr." required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="modality" className="text-base">Modalidad</Label>
                                <Select name="modality" required>
                                    <SelectTrigger id="modality">
                                        <SelectValue placeholder="Selecciona una modalidad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Remoto">Remoto</SelectItem>
                                        <SelectItem value="Híbrido">Híbrido</SelectItem>
                                        <SelectItem value="Presencial">Presencial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                               <Label htmlFor="sector" className="text-base">Sector</Label>
                               <Input id="sector" value="Privado" disabled />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="description" className="text-base">Descripción del Puesto</Label>
                            <Textarea id="description" name="description" rows={6} placeholder="Describe las responsabilidades, el equipo, y la cultura de la empresa..." required />
                        </div>
                         <div className="space-y-3">
                            <Label htmlFor="requirements" className="text-base">Requisitos (separados por coma)</Label>
                            <Textarea id="requirements" name="requirements" rows={4} placeholder="Ej: Conocimientos en React, Experiencia con Git, etc." required />
                        </div>
                         <div className="space-y-3">
                            <Label htmlFor="conditions" className="text-base">Condiciones (separadas por coma)</Label>
                            <Textarea id="conditions" name="conditions" rows={4} placeholder="Ej: Horario flexible, Seguro médico, etc." />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end gap-2">
                        <Button variant="ghost" asChild size="lg"><Link href="/empresa/ofertas">Cancelar</Link></Button>
                        <Button type="submit" size="lg" disabled={isLoading}>
                             {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                            Publicar Oferta
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
