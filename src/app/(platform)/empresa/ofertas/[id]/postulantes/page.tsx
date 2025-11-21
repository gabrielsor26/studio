
'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Inbox } from "lucide-react"
import { notFound } from "next/navigation"
import Image from "next/image"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PDFViewer } from "@/components/ui/pdf-viewer"
import { useEffect, useState } from "react"
import type { Opportunity, Applicant } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

async function getOfferAndApplicants(offerId: string): Promise<{ offer: Opportunity | null; applicants: Applicant[] }> {
    try {
        const [offerRes, applicantsRes] = await Promise.all([
            fetch(`/api/ofertas/${offerId}`),
            fetch(`/api/postulaciones/oferta/${offerId}`)
        ]);

        if (!offerRes.ok) return { offer: null, applicants: [] };
        const offer = await offerRes.json();

        if (!applicantsRes.ok) return { offer, applicants: [] };
        const applicants = await applicantsRes.json();
        
        return { offer, applicants };
    } catch (error) {
        console.error(error);
        return { offer: null, applicants: [] };
    }
}


export default function ApplicantsPage({ params }: { params: { id: string } }) {
    const [offer, setOffer] = useState<Opportunity | null>(null);
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getOfferAndApplicants(params.id)
            .then(data => {
                if (!data.offer) {
                    notFound();
                } else {
                    setOffer(data.offer);
                    setApplicants(data.applicants);
                }
            })
            .finally(() => setLoading(false));
    }, [params.id]);
    
    if (loading) {
        return (
             <div className="max-w-5xl mx-auto space-y-8">
                <Skeleton className="h-10 w-48" />
                <div className="flex items-start gap-6">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-[400px]" />
                        <Skeleton className="h-6 w-[300px]" />
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-4 p-0">
                         <div className="p-6 space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
             </div>
        )
    }

    if (!offer) {
        return notFound();
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                 <Link href="/empresa/ofertas" className="inline-flex items-center gap-2 text-base text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="h-5 w-5" />
                    Volver a mis ofertas
                </Link>
                <div className="flex items-start gap-6">
                     <Image src={offer.company.logo} alt={offer.company.name} width={64} height={64} className="rounded-lg border bg-background" data-ai-hint="logo" />
                     <div>
                        <h1 className="text-4xl font-bold font-headline">Postulantes para: {offer.title}</h1>
                        <p className="text-xl text-muted-foreground mt-2">Revisa y gestiona los candidatos que aplicaron a tu vacante.</p>
                     </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Candidatos ({applicants.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[400px] px-6">Nombre</TableHead>
                                <TableHead>Fecha de Postulación</TableHead>
                                <TableHead className="text-right px-6">Curriculum Vitae</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applicants.length > 0 ? (
                                applicants.map((applicant) => (
                                    <TableRow key={applicant.id}>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar>
                                                    <AvatarImage src={applicant.avatar} alt={applicant.name} data-ai-hint="person" />
                                                    <AvatarFallback>{applicant.name.substring(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-base">{applicant.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-base">{new Date(applicant.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right px-6">
                                            <PDFViewer cvUrl={applicant.cvUrl} applicantName={applicant.name} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-48 text-center">
                                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                            <Inbox className="h-16 w-16" />
                                            <h3 className="text-xl font-semibold">Aún no hay postulaciones</h3>
                                            <p className="text-base">Revisa más tarde para ver nuevos candidatos.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
