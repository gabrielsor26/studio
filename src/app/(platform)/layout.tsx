
'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import { Loader2 } from 'lucide-react';

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <AppSidebar user={user} />
        </Sidebar>
        <SidebarInset>
            <header className="sticky top-0 z-10 flex h-20 items-center gap-4 border-b bg-background px-6 sm:px-8 md:hidden">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold font-headline">Buscador Laboral</h1>
            </header>
            <main className="flex-1 overflow-y-auto bg-muted/10 p-6 sm:p-8 md:p-10">
                {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
