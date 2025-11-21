
'use client';
import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Building2 } from 'lucide-react';
import MainHeader from '@/components/layout/main-header';
import CompanyCard from './_components/company-card';
import type { Company } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

async function getCompanies(): Promise<Company[]> {
  try {
    const res = await fetch('/api/empresas');
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCompanies()
      .then(setCompanies)
      .finally(() => setLoading(false));
  }, []);

  const filteredCompanies = useMemo(() => {
    if (!searchTerm) {
      return companies;
    }
    return companies.filter((company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, companies]);

  return (
    <>
      <MainHeader />
      <main className="container mx-auto px-4 sm:px-6 py-28 space-y-10">
        <div>
          <h1 className="text-4xl font-bold font-headline">Explorar Empresas</h1>
          <p className="text-muted-foreground mt-2 text-xl">Descubre las empresas que están buscando talento como tú.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nombre de empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-16 h-16 text-lg"
          />
        </div>

        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-80" />)}
            </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))
            ) : (
              <div className="col-span-full text-center py-24 text-muted-foreground space-y-6 bg-card rounded-lg">
                <Building2 className="mx-auto h-20 w-20 text-primary/80" />
                <p className="font-semibold text-2xl mt-4">No se encontraron empresas</p>
                <p className="text-lg">Intenta con otro término de búsqueda.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
