
'use client'
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, MoreHorizontal, Eye, Users, Edit, Trash2, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import type { Opportunity } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

async function getCompanyOffers(companyId: string): Promise<Opportunity[]> {
    try {
        const res = await fetch(`/api/ofertas/empresa/${companyId}`);
        if (!res.ok) return [];
        return res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default function CompanyOffersPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (user?.currentProfileId) {
      setLoading(true);
      getCompanyOffers(user.currentProfileId)
        .then(data => setOpportunities(data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleDeleteClick = (offerId: string) => {
    setSelectedOfferId(offerId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedOfferId) return;

    try {
        const res = await fetch(`/api/ofertas/${selectedOfferId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete offer');
        
        setOpportunities(prev => prev.filter(opp => opp.id !== selectedOfferId));
        toast({
            title: "Oferta Eliminada",
            description: "La oferta de trabajo ha sido eliminada permanentemente.",
            variant: "info",
        });
        router.refresh();
    } catch (error) {
        console.error(error);
        toast({
            title: "Error al eliminar",
            description: (error as Error).message || "No se pudo eliminar la oferta.",
            variant: "destructive",
        });
    } finally {
        setIsDeleteDialogOpen(false)
        setSelectedOfferId(null);
    }
  }
  
    if (loading) {
        return (
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-16 w-1/3" />
                    <Skeleton className="h-14 w-48" />
                </div>
                <Card>
                    <CardHeader className="p-6">
                        <Skeleton className="h-12 w-full" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="p-6 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-headline">Mis Ofertas</h1>
          <p className="text-muted-foreground text-xl mt-2">Gestiona todas tus vacantes en un solo lugar.</p>
        </div>
        <Button asChild size="lg">
          <Link href="/empresa/ofertas/nueva">
            <PlusCircle className="mr-2 h-5 w-5" />
            Crear nueva oferta
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="p-6">
           <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             <Input placeholder="Buscar por puesto..." className="pl-12" />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[450px] px-6">Puesto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Postulantes</TableHead>
                <TableHead className="text-right px-6">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opp, index) => (
                <TableRow key={opp.id}>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-6">
                      <Image src={opp.company.logo} alt={opp.company.name} width={56} height={56} className="rounded-lg border bg-background" data-ai-hint="logo" />
                      <div>
                        <Link href={`/oportunidades/${opp.id}`} className="font-semibold hover:underline text-lg">
                          {opp.title}
                        </Link>
                        <div className="text-base text-muted-foreground">{opp.modality}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Activa</Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 font-medium text-base">
                      <Users className="h-5 w-5 text-muted-foreground" />
                       {/* Placeholder for applicants count */}
                      <span>{Math.floor(Math.random() * 50) + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-6 w-6" />
                          <span className="sr-only">Más acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/empresa/ofertas/${opp.id}/postulantes`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Postulantes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/empresa/ofertas/editar/${opp.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar Oferta
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteClick(opp.id)}
                          >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la oferta de trabajo y todos los datos de postulación asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
