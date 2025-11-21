
'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Award, Calendar, Video, Trash2, CheckCircle } from "lucide-react"
import { timeSlots, scheduledMentorships as initialMentorships } from "@/lib/data"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import type { TimeSlot, Mentor, ScheduledMentorship } from "@/lib/types"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

function ScheduleMentorshipModal({ 
    timeSlot, 
    onConfirm,
    children
}: { 
    timeSlot: TimeSlot;
    onConfirm: (mentor: Mentor, timeSlot: TimeSlot) => void;
    children: React.ReactNode;
}) {
    const { toast } = useToast();
    const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMentorId) {
            toast({
                title: "Error",
                description: "Por favor, selecciona un asesor.",
                variant: "destructive",
            });
            return;
        }

        const mentor = timeSlot.availableMentors.find(m => m.id === selectedMentorId);
        if (mentor) {
            onConfirm(mentor, timeSlot);
            setSelectedMentorId(null);
        }
    }

    return (
         <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Agendar Asesoría</DialogTitle>
                        <DialogDescription>
                           Selecciona un asesor para tu sesión del {timeSlot.date} a las {timeSlot.time}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <RadioGroup onValueChange={setSelectedMentorId} className="space-y-4">
                            {timeSlot.availableMentors.map(mentor => (
                                <Label key={mentor.id} htmlFor={mentor.id} className="flex items-start gap-4 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary">
                                    <Avatar className="h-16 w-16 border">
                                        <AvatarImage src={mentor.avatar} alt={mentor.name} data-ai-hint="person" />
                                        <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-lg">{mentor.name}</p>
                                        <p className="text-base text-muted-foreground">{mentor.role}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {mentor.specialties.slice(0,2).map(spec => <Badge key={spec} variant="secondary">{spec}</Badge>)}
                                        </div>
                                    </div>
                                    <RadioGroupItem value={mentor.id} id={mentor.id} className="h-6 w-6" />
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" size="lg">Cancelar</Button>
                        </DialogClose>
                         <DialogClose asChild>
                            <Button type="submit" size="lg">
                                <CheckCircle className="mr-2 h-5 w-5"/>
                                Confirmar Asesoría
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function CancelMentorshipDialog({ mentorshipId, onConfirm }: { mentorshipId: string, onConfirm: (id: string) => void }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Cancelar asesoría</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro de cancelar esta asesoría?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Perderás tu horario reservado.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>No, mantener</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onConfirm(mentorshipId)} className="bg-destructive hover:bg-destructive/90">
                        Sí, cancelar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}


export default function PremiumPage() {
    const { toast } = useToast();
    const [scheduledMentorships, setScheduledMentorships] = useState(initialMentorships);
    
    const hasScheduledMentorship = scheduledMentorships.length > 0;

    const handleScheduleMentorship = (mentor: Mentor, timeSlot: TimeSlot) => {
        if (hasScheduledMentorship) {
            toast({
                title: "Error al agendar",
                description: "Ya tienes una asesoría agendada. Solo puedes tener una a la vez.",
                variant: "warning",
            });
            return;
        }

        const newMentorship: ScheduledMentorship = {
            id: `sm_${Date.now()}`,
            mentor,
            date: timeSlot.date,
            time: timeSlot.time,
        };

        setScheduledMentorships(prev => [...prev, newMentorship]);

        toast({
            title: "¡Asesoría Confirmada!",
            description: `Tu sesión con ${mentor.name} para el ${timeSlot.date} a las ${timeSlot.time} ha sido agendada.`,
            variant: "success",
        });
    };

    const handleCancelMentorship = (id: string) => {
        setScheduledMentorships(prev => prev.filter(m => m.id !== id));
        toast({
            title: "Asesoría Cancelada",
            description: "La sesión ha sido eliminada de tu agenda. Ahora puedes agendar una nueva.",
            variant: "info",
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <div>
                <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
                    <Sparkles className="text-yellow-400 h-10 w-10" />
                    Misty X
                </h1>
                <p className="text-muted-foreground text-xl mt-2">Potencia tu carrera con asesorías 1:1 de expertos en la industria.</p>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 to-transparent">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Conviértete en Usuario Misty X</CardTitle>
                    <CardDescription className="text-lg">Accede a sesiones personalizadas de empleabilidad, revisión de CV y crecimiento profesional por solo S/30 al mes.</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button size="lg" asChild>
                        <Link href="/premium/subscribe">
                            <Award className="mr-2 h-5 w-5" />
                            Obtener Misty X Ahora
                        </Link>
                    </Button>
                </CardFooter>
            </Card>

            <Separator />

             <div className="space-y-8">
                <h2 className="text-3xl font-bold font-headline">Mis Asesorías Agendadas</h2>
                 <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[350px] px-6">Asesor</TableHead>
                                    <TableHead>Fecha y Hora</TableHead>
                                    <TableHead className="text-right px-6">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hasScheduledMentorship ? scheduledMentorships.map((mentorship) => (
                                    <TableRow key={mentorship.id}>
                                        <TableCell className="px-6 py-4">
                                             <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 border">
                                                    <AvatarImage src={mentorship.mentor.avatar} alt={mentorship.mentor.name} data-ai-hint="person" />
                                                    <AvatarFallback>{mentorship.mentor.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-base">{mentorship.mentor.name}</p>
                                                    <p className="text-sm text-muted-foreground">{mentorship.mentor.role}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-base">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                                <span>{mentorship.date}, {mentorship.time}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right px-6 space-x-2">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="icon" disabled={!mentorship.meetingLink} asChild={!!mentorship.meetingLink}>
                                                        {mentorship.meetingLink ? (
                                                            <a href={mentorship.meetingLink} target="_blank" rel="noopener noreferrer">
                                                                <Video className="h-5 w-5" />
                                                                <span className="sr-only">Unirse a la reunión</span>
                                                            </a>
                                                        ) : (
                                                            <div>
                                                                <Video className="h-5 w-5" />
                                                                <span className="sr-only">Unirse a la reunión (deshabilitado)</span>
                                                            </div>
                                                        )}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    {!mentorship.meetingLink && (
                                                        <TooltipContent>
                                                            <p>El enlace a la reunión estará disponible pronto.</p>
                                                        </TooltipContent>
                                                    )}
                                                </Tooltip>
                                            </TooltipProvider>
                                            <CancelMentorshipDialog mentorshipId={mentorship.id} onConfirm={handleCancelMentorship} />
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center text-lg text-muted-foreground">
                                            Aún no tienes asesorías agendadas.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
            {!hasScheduledMentorship && (
                <>
                    <Separator />

                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold font-headline">Agendar Nueva Asesoría</h2>
                        <p className="text-lg text-muted-foreground">Selecciona uno de los horarios disponibles para reservar tu próxima sesión de mentoría.</p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {timeSlots.map((slot) => (
                                <Card key={slot.id} className="flex flex-col">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-headline leading-tight flex items-center gap-3">
                                            <Calendar className="h-6 w-6 text-primary"/>
                                            {slot.date}
                                        </CardTitle>
                                        <CardDescription className="text-lg pt-2 flex items-center gap-3">
                                            {slot.time}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="font-semibold text-base mb-3">Asesores disponibles:</p>
                                        <TooltipProvider>
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {slot.availableMentors.map(mentor => (
                                                     <Tooltip key={mentor.id}>
                                                        <TooltipTrigger>
                                                            <Avatar className="inline-block h-10 w-10 rounded-full ring-2 ring-background">
                                                                <AvatarImage src={mentor.avatar} alt={mentor.name} data-ai-hint="person" />
                                                                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{mentor.name}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ))}
                                            </div>
                                        </TooltipProvider>
                                    </CardContent>
                                    <CardFooter>
                                        <ScheduleMentorshipModal 
                                            timeSlot={slot} 
                                            onConfirm={handleScheduleMentorship}
                                        >
                                            <Button>
                                                <Calendar className="mr-2 h-5 w-5" />
                                                Agendar en este horario
                                            </Button>
                                        </ScheduleMentorshipModal>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </>
            )}

        </div>
    )
}
