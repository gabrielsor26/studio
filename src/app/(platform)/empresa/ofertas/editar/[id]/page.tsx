
'use client'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { notFound, useRouter } from 'next/navigation';
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import type { Opportunity } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

async function getOffer(offerId: string): Promise<Opportunity | null> {
    try {
        const res = await fetch(`/api/ofertas/${offerId}`);
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default function EditOfferPage({ params }: { params: { id: string } }) {
    const { toast } = useToast();
    const router = useRouter();
    const [offer, setOffer] = useState<Opportunity | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        setIsFetching(true);
        getOffer(params.id)
            .then(data => {
                if (!data) {
                    notFound();
                } else {
                    setOffer(data);
                }
            })
            .finally(() => setIsFetching(false));
    }, [params.id]);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title');
        const modality = formData.get('modality');
        const description = formData.get('description');
        const requirements = formData.get('requirements');
        
        if (!title || !modality || !description || !requirements) {
            toast({
                title: "Campos Incompletos",
                description: "Por favor, completa todos los campos requeridos.",
                variant: "warning",
            });
            setIsLoading(false);
            return;
        }

        const updatedData = {
            title,
            modality,
            description,
            requirements: (requirements as string).split(',').map(req => req.trim()),
            conditions: (formData.get('conditions') as string).split(',').map(cond => cond.trim()),
        };

        try {
            const res = await fetch(`/api/ofertas/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) throw new Error('Failed to update offer');
            
            toast({
                title: "Oferta Actualizada",
                description: "Los cambios en la oferta han sido guardados con éxito.",
                variant: "success",
            });
            router.push("/empresa/ofertas");
            router.refresh(); // Re-fetch server-side data
        } catch (error) {
            console.error(error);
            toast({
                title: "Error al actualizar",
                description: (error as Error).message || "No se pudo actualizar la oferta.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (isFetching) {
        return (
             <div className="max-w-4xl mx-auto space-y-8">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-72" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Skeleton className="h-14 w-36" />
                    </CardFooter>
                </Card>
            </div>
        )
    }
    
    if (!offer) return notFound();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                 <Link href="/empresa/ofertas" className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="h-5 w-5" />
                    Volver a mis ofertas
                </Link>
                <h1 className="text-4xl font-bold font-headline">Editar Oferta</h1>
                <p className="text-xl text-muted-foreground mt-2">Actualiza los detalles de la vacante.</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Información de la Oferta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="title" className="text-base">Título del Puesto</Label>
                            <Input id="title" name="title" defaultValue={offer.title} required />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="modality" className="text-base">Modalidad</Label>
                                <Select name="modality" defaultValue={offer.modality} required>
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
                               <Input id="sector" value={offer.sector} disabled />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="description" className="text-base">Descripción del Puesto</Label>
                            <Textarea id="description" name="description" rows={6} defaultValue={offer.description} required />
                        </div>
                         <div className="space-y-3">
                            <Label htmlFor="requirements" className="text-base">Requisitos (separados por coma)</Label>
                            <Textarea id="requirements" name="requirements" rows={4} defaultValue={offer.requirements.join(', ')} required />
                        </div>
                         <div className="space-y-3">
                            <Label htmlFor="conditions" className="text-base">Condiciones (separadas por coma)</Label>
                            <Textarea id="conditions" name="conditions" rows={4} defaultValue={offer.conditions.join(', ')} />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end">
                        <Button size="lg" type="submit" disabled={isLoading}>
                             {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                            Guardar Cambios
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
