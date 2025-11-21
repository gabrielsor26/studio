
'use client';

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
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface PDFViewerProps {
  cvUrl: string;
  applicantName: string;
}

export function PDFViewer({ cvUrl, applicantName }: PDFViewerProps) {
  const downloadFileName = `CV_${applicantName.replace(/ /g, '_')}.pdf`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
            <Eye className="mr-2 h-5 w-5"/>
            Ver CV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl">CV de {applicantName}</DialogTitle>
          <DialogDescription>
            Revisa el CV del postulante a continuación.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 px-6 pb-6 min-h-0">
           <iframe
                src={cvUrl}
                className="w-full h-full rounded-md border"
                title={`CV de ${applicantName}`}
            />
        </div>
        <DialogFooter className="p-6 border-t bg-muted/50 sm:justify-between">
            <DialogClose asChild>
                <Button type="button" variant="secondary" size="lg">
                Cerrar
                </Button>
            </DialogClose>
            <Button asChild size="lg">
                <a href={cvUrl} download={downloadFileName}>
                    <Download className="mr-2 h-5 w-5"/>
                    Descargar
                </a>
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
