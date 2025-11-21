
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
import type { User } from '@/lib/types';
import { Briefcase, Newspaper, User as UserIcon, LogOut, Building, LayoutDashboard, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const Logo = () => {
    const { state } = useSidebar();
    return (
         <Link href="/" className="flex items-center gap-3">
             <Image src="https://placehold.co/40x40.png" alt="Misty Box Logo" width={40} height={40} className="rounded-lg" />
            <span className={cn("text-2xl font-semibold font-headline whitespace-nowrap", state === 'collapsed' && "hidden")}>Misty Box</span>
        </Link>
    )
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ href, icon, label }: NavItemProps) => {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isActive = pathname.startsWith(href);

  return (
    <SidebarMenuItem>
      <Link href={href} passHref>
        <SidebarMenuButton size="lg" isActive={isActive} tooltip={label}>
          {icon}
          <span className={cn(state === 'collapsed' && "hidden")}>{label}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
};


export default function AppSidebar({ user }: { user: User }) {
  const { logout } = useAuth();
  const { state } = useSidebar();

  const userNavItems = [
    { href: '/oportunidades', icon: <Briefcase />, label: 'Oportunidades' },
    { href: '/empresas', icon: <Building />, label: 'Empresas' },
    { href: '/feed', icon: <Newspaper />, label: 'Feed' },
    { href: '/perfil', icon: <UserIcon />, label: 'Mi Perfil' },
    { href: '/premium', icon: <Sparkles />, label: 'Misty X' },
  ];

  const companyNavItems = [
    { href: '/empresa/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { href: '/empresa/ofertas', icon: <Briefcase />, label: 'Ofertas' },
    { href: '/empresa/perfil', icon: <Building />, label: 'Perfil Empresa' },
  ];

  const navItems = user.role === 'user' ? userNavItems : companyNavItems;

  return (
    <>
      <SidebarHeader>
        <div className={cn("p-4 flex items-center", state === 'collapsed' ? 'justify-center' : 'justify-between')}>
            <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-2">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
         <div className={cn("flex items-center gap-4 p-4")}>
           <Avatar className="h-12 w-12 shrink-0">
             <AvatarImage src={user.avatar} alt={user.name} />
             <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
           </Avatar>
           <div className={cn("flex flex-col truncate", state === 'collapsed' && "hidden")}>
             <span className="font-semibold text-base">{user.name}</span>
             <span className="text-sm text-muted-foreground">{user.email}</span>
           </div>
           <Button 
             variant="ghost" 
             size="icon" 
             className={cn("ml-auto h-11 w-11 shrink-0", state === 'collapsed' && "hidden")} 
             onClick={logout} 
             aria-label="Cerrar sesión"
            >
             <LogOut className="h-6 w-6" />
           </Button>
         </div>
         <div className={cn(state === 'collapsed' ? 'hidden' : 'p-2')}>
            <SidebarTrigger className="w-full" />
         </div>
      </SidebarFooter>
    </>
  );
}
