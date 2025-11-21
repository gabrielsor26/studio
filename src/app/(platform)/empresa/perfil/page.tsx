
'use client'

import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Building, Globe, Edit, Upload, Loader2, FileDigit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function EditProfileModal() {
    const { user, login } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    if (!user || !user.company) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const companyName = formData.get('companyName') as string;
        const description = formData.get('description') as string;
        const website = formData.get('website') as string;

        if (!companyName) {
            toast({
                title: "Campo Requerido",
                description: "El nombre de la empresa no puede estar vacío.",
                variant: "warning"
            });
            return;
        }

        setIsLoading(true);
        
        const updatedData = {
            nombreEmpre: companyName,
            descripEmpresa: description,
            websiteEmpre: website,
        };

        // If it's the first time, we do a POST, otherwise a PUT
        const isInitialSetup = !user.company.id;
        const endpoint = isInitialSetup 
            ? `/api/empresas?usuarioId=${user.id}` 
            : `/api/empresas/${user.company.id}`;
        const method = isInitialSetup ? 'POST' : 'PUT';

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) throw new Error('Failed to update profile');

            toast({
                title: "Perfil Actualizado",
                description: "La información de tu empresa ha sido guardada.",
                variant: "success"
            });

            // Re-login to get updated user object with all relations
            if (user.email) {
                login(user.email, 'password', 'company'); 
            }
            
            setOpen(false);
            router.refresh();

        } catch (error) {
             console.error(error);
             toast({
                title: "Error",
                description: (error as Error).message || "No se pudo actualizar el perfil.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                 <Button variant="outline" size="lg" className="shrink-0">
                    <Edit className="mr-2 h-5 w-5" />
                    Editar Perfil
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Editar Perfil de Empresa</DialogTitle>
                        <DialogDescription>
                            Actualiza la información de tu empresa. Haz clic en guardar cuando hayas terminado.
                        </DialogDescription>
                    </DialogHeader>
                     <div className="grid gap-8 py-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="companyName" className="text-base">Nombre de la Empresa</Label>
                                <Input id="companyName" name="companyName" defaultValue={user.company.name} required/>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="ruc" className="text-base">RUC</Label>
                                <Input id="ruc" name="ruc" defaultValue="20603682549" />
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-3">
                                <Label htmlFor="website" className="text-base">Sitio Web</Label>
                                <Input id="website" name="website" defaultValue={user.company.website} />
                            </div>
                             <div className="space-y-3">
                                <Label htmlFor="phone" className="text-base">Teléfono</Label>
                                <Input id="phone" name="phone" defaultValue="+51 1 2345678" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="description" className="text-base">Descripción de la Empresa</Label>
                            <Textarea id="description" name="description" rows={5} defaultValue={user.company.description} />
                        </div>
                     </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary" size="lg">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" size="lg" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function CompanyProfilePage() {
  const { user } = useAuth();

  if (!user || user.role !== 'company' || !user.company) return null;
  
  const { name, logo, description, website } = user.company;
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">Perfil de Empresa</h1>
        <p className="text-muted-foreground text-xl mt-2">Mantén la información de tu empresa actualizada para atraer al mejor talento.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start gap-8 p-8">
          <div className="relative shrink-0 self-center md:self-start">
            <Avatar className="h-40 w-40 border-4 border-background shadow-lg">
              <AvatarImage src={logo} alt={name} data-ai-hint="logo" />
              <AvatarFallback className="text-6xl">{name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button size="icon" className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full border-4 border-card">
                <Upload className="h-5 w-5"/>
                <span className="sr-only">Cambiar logo</span>
            </Button>
          </div>
          <div className="flex-grow pt-2 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <CardTitle className="text-4xl font-bold font-headline">{name}</CardTitle>
                <EditProfileModal />
            </div>
            <div className="flex flex-col md:flex-row gap-x-8 gap-y-3 mt-6 text-muted-foreground text-lg">
                <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5"/> {user.email}
                </div>
                 <div className="flex items-center gap-3 capitalize">
                    <Building className="h-5 w-5"/> {user.roleName}
                </div>
                 <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5"/> {website}
                </div>
                 <div className="flex items-center gap-3">
                    <FileDigit className="h-5 w-5"/> 20603682549
                </div>
            </div>
             <p className="mt-6 text-foreground/90 max-w-3xl text-lg leading-relaxed">
                {description}
            </p>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
