
'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function SubscribePage() {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call to Izipay
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "¡Suscripción Exitosa!",
                description: "Bienvenido a Misty X. Ahora puedes agendar tus asesorías.",
                variant: "success",
                duration: 5000,
            });
            router.push("/premium");
        }, 2000);
    }

    return (
        <div className="max-w-md mx-auto space-y-8">
            <div>
                <Link href="/premium" className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="h-5 w-5" />
                    Volver
                </Link>
                <h1 className="text-4xl font-bold font-headline">Suscríbete a Misty X</h1>
                <p className="text-xl text-muted-foreground mt-2">Completa el pago para desbloquear tus beneficios.</p>
            </div>
            
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Información de Pago</CardTitle>
                        <CardDescription>Tu pago será procesado de forma segura.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="name" className="text-base">Nombre en la Tarjeta</Label>
                            <Input id="name" placeholder="Ej: Juan Perez" required />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="card-number" className="text-base">Número de Tarjeta</Label>
                            <Input id="card-number" placeholder="0000 0000 0000 0000" required />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-3">
                                <Label htmlFor="expiry" className="text-base">Vencimiento (MM/AA)</Label>
                                <Input id="expiry" placeholder="MM/AA" required />
                            </div>
                             <div className="space-y-3">
                                <Label htmlFor="cvc" className="text-base">CVC</Label>
                                <Input id="cvc" placeholder="123" required />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Lock className="mr-2 h-5 w-5" />
                            )}
                            Pagar S/30.00
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            Pagos seguros procesados por Izipay.
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
