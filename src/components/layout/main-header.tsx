
'use client';

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const Logo = () => (
    <Link href="/" className="flex items-center gap-3">
        <Image src="https://placehold.co/40x40.png" alt="Misty Box Logo" width={40} height={40} className="rounded-lg" />
        <span className="text-2xl font-semibold font-headline whitespace-nowrap">Misty Box</span>
    </Link>
);


export default function MainHeader() {
    const { user, loading } = useAuth();
    const pathname = usePathname();

    const isLoginPage = pathname === '/login';

    return (
        <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-sm border-b">
            <div className="container mx-auto flex items-center justify-between h-20 px-4 sm:px-6">
                <Logo />
                <nav className="flex items-center gap-2 sm:gap-4">
                    {loading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : user ? (
                        <Button asChild>
                            <Link href={user.role === 'company' ? '/empresa/dashboard' : '/perfil'}>
                                Ir a mi Perfil
                            </Link>
                        </Button>
                    ) : (
                        <>
                           {!isLoginPage && (
                             <Button asChild>
                                <Link href="/login">Iniciar Sesión / Registro</Link>
                             </Button>
                           )}
                           <Button variant="outline" asChild className="hidden sm:inline-flex">
                                <Link href="/login?role=company">¿Eres una empresa?</Link>
                           </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
