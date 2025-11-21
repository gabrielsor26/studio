
'use client';
import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import MainHeader from '@/components/layout/main-header';
import OpportunityCard from './_components/opportunity-card';
import type { Opportunity } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

async function getOpportunities(): Promise<Opportunity[]> {
  try {
    const res = await fetch('/api/ofertas');
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sector, setSector] = useState('Todos');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getOpportunities()
      .then(setOpportunities)
      .finally(() => setLoading(false));
  }, []);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesSector = sector === 'Todos' || opp.sector === sector;
      const lowerSearchTerm = searchTerm.toLowerCase();
      const matchesSearch =
        opp.title.toLowerCase().includes(lowerSearchTerm) ||
        opp.company.name.toLowerCase().includes(lowerSearchTerm) ||
        opp.description.toLowerCase().includes(lowerSearchTerm);
      return matchesSector && matchesSearch;
    });
  }, [searchTerm, sector, opportunities]);

  return (
    <>
      <MainHeader />
      <main className="container mx-auto px-4 sm:px-6 py-28 space-y-10">
        <div>
            <h1 className="text-4xl font-bold font-headline">Oportunidades de Prácticas</h1>
            <p className="text-muted-foreground mt-2 text-xl">Explora las últimas ofertas para iniciar tu carrera profesional.</p>
        </div>

        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="md:col-span-3 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Buscar por puesto, empresa o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-16 h-14 text-lg"
                        />
                    </div>
                    <Select value={sector} onValueChange={setSector}>
                        <SelectTrigger className="w-full md:col-span-2 h-14 text-lg">
                            <SelectValue placeholder="Filtrar por sector" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Todos">Todos los Sectores</SelectItem>
                            <SelectItem value="Público">Sector Público</SelectItem>
                            <SelectItem value="Privado">Sector Privado</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
        
        <div className="text-lg font-semibold">
          {loading ? (
             <Skeleton className="h-7 w-48" />
          ) : (
            <p>{filteredOpportunities.length} {filteredOpportunities.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}</p>
          )}
        </div>

        <div className="space-y-8">
            {loading ? (
                <div className="space-y-8">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}
                </div>
            ) : filteredOpportunities.length > 0 ? (
                filteredOpportunities.map((opp) => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                ))
            ) : (
                <div className="col-span-full text-center py-24 text-muted-foreground space-y-6 bg-card rounded-lg">
                    <Search className="mx-auto h-20 w-20 text-primary/80" />
                    <p className="font-semibold text-2xl mt-4">No se encontraron oportunidades</p>
                    <p className="text-lg">Intenta ajustar tus filtros de búsqueda para encontrar la vacante ideal.</p>
                </div>
            )}
        </div>
      </main>
    </>
  );
}
