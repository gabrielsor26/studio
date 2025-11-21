
'use client';

import type { User } from '@/lib/types';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: 'user' | 'company') => void;
  register: (name: string, email: string, password: string, role: 'user' | 'company') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Mock Data for additional demo users ---
const mockUsers: { [email: string]: any } = {
    'postulante@example.com': {
        id: 'user-demo-2',
        name: 'Ana García',
        email: 'postulante@example.com',
        role: 'user',
        roleName: 'user',
        avatar: 'https://placehold.co/128x128.png',
        applicant: { id: 'appl-demo-2', cvUrl: '' }
    },
    'empresa@example.com': {
        id: 'user-demo-3',
        name: 'Tech Solutions',
        email: 'empresa@example.com',
        role: 'company',
        roleName: 'company',
        avatar: 'https://placehold.co/128x128.png',
        company: { 
            id: 'comp-demo-2', 
            name: 'Tech Solutions',
            description: 'Líderes en innovación y desarrollo de software.',
            website: 'techsolutions.com',
            logo: 'https://placehold.co/128x128.png',
        }
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string, role: 'user' | 'company') => {
    
    // --- Mock logic for additional demo users ---
    if (mockUsers[email]) {
        const mockUser = mockUsers[email];
        if (mockUser.role !== role) {
            toast({ title: "Rol Incorrecto", description: `Este email de demostración es para el rol de ${mockUser.role}.`, variant: "warning" });
            return;
        }
        
        const finalUser = {
            ...mockUser,
            currentProfileId: mockUser.role === 'company' ? mockUser.company?.id : mockUser.applicant?.id,
        };
        setUser(finalUser);
        localStorage.setItem('user', JSON.stringify(finalUser));
        toast({ title: `¡Bienvenido, ${finalUser.name.split(' ')[0]}!`, description: "Has iniciado sesión con un usuario de demostración.", variant: "success" });
        const redirectUrl = searchParams.get('redirect');
        const intendedDestination = redirectUrl || (finalUser.role === 'company' ? '/empresa/dashboard' : '/perfil');
        router.push(intendedDestination);
        return;
    }
    // --- End mock logic ---
    
    try {
        const res = await fetch(`/api/usuarios/login?mail=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);

        if (res.status === 404) {
            toast({ title: "Usuario no encontrado", description: "El email que ingresaste no está registrado.", variant: "destructive" });
            return;
        }
        if (res.status === 401) {
            toast({ title: "Contraseña Incorrecta", description: "La contraseña que ingresaste no es correcta.", variant: "destructive" });
            return;
        }
        if (!res.ok) {
            throw new Error("Error en el inicio de sesión");
        }

        const userData: User = await res.json();
        
        if (userData.roleName.toLowerCase() !== role) {
             toast({ title: "Rol Incorrecto", description: `Este email está registrado como ${userData.roleName}. Por favor, intenta en la pestaña correcta.`, variant: "destructive" });
             return;
        }

        const finalUser = {
            ...userData,
            currentProfileId: userData.roleName.toLowerCase() === 'company' ? userData.company?.id : userData.applicant?.id,
        };

        setUser(finalUser);
        localStorage.setItem('user', JSON.stringify(finalUser));
        toast({ title: `¡Bienvenido, ${finalUser.name.split(' ')[0]}!`, description: "Has iniciado sesión correctamente.", variant: "success" });

        const redirectUrl = searchParams.get('redirect');
        const intendedDestination = redirectUrl || (finalUser.role === 'company' ? '/empresa/dashboard' : '/perfil');
        router.push(intendedDestination);

    } catch (error) {
        console.error(error);
        toast({ title: "Error de Conexión", description: (error as Error).message, variant: "destructive" });
    }
  };

  const register = async (name: string, email: string, password: string, role: 'user' | 'company') => {
     try {
        // Step 1: Create user account
        const roleId = role === 'company' ? 2 : 1; // Assuming 1: postulante, 2: empresa
        const res = await fetch(`/api/usuarios/registrar?rolId=${roleId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userMail: email, userPass: password, userName: name }), // Pass name here too
        });

        if (res.status === 409) { // Conflict
             toast({ title: "Email ya registrado", description: "Este email ya está en uso. Por favor, inicia sesión.", variant: "warning" });
             return;
        }
        if (!res.ok) {
            throw new Error('No se pudo crear la cuenta.');
        }
        
        const { usuarioId } = await res.json();
        
        // Login immediately after registration to get the full user object
        // The backend should create a basic profile in step 1 or login should handle it
        const tempUser: User = { id: usuarioId, name, email, role, roleName: role, avatar: '' };
        setUser(tempUser);
        localStorage.setItem('user', JSON.stringify(tempUser));

        toast({ title: `¡Bienvenido, ${name.split(' ')[0]}!`, description: "Tu cuenta ha sido creada. Completa tu perfil.", variant: "success" });
        
        const destination = role === 'company' ? '/empresa/perfil' : '/perfil';
        router.push(destination);

     } catch (error) {
        console.error(error);
        toast({ title: "Error de Registro", description: (error as Error).message, variant: "destructive" });
     }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/');
  };

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
