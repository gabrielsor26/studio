
'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import MainHeader from '@/components/layout/main-header';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

function LoginForm({ role, onLogin }: { role: 'user' | 'company'; onLogin: (email: string, password: string, role: 'user' | 'company') => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Campos Incompletos", description: "Por favor, complete todos los campos.", variant: "warning" });
      return;
    }
    setIsLoading(true);
    // The onLogin function now handles the API call and loading state.
    onLogin(email, password, role);
    // We expect the context to handle the loading state, but as a fallback:
    setTimeout(() => setIsLoading(false), 5000); // Failsafe to re-enable button
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor={`email-login-${role}`} className="text-base">Correo Electrónico</Label>
          <Input 
            id={`email-login-${role}`} 
            type="email" 
            placeholder="tu@email.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor={`password-login-${role}`} className="text-base">Contraseña</Label>
          <Input 
            id={`password-login-${role}`} 
            type="password" 
            placeholder="••••••••••"
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit" disabled={isLoading} size="lg">
          {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          Iniciar Sesión
        </Button>
      </CardFooter>
    </form>
  );
}

function RegisterForm({ role, onRegister }: { role: 'user' | 'company'; onRegister: (name: string, email: string, password: string, role: 'user' | 'company') => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
     if (!email || !password || !name) {
      toast({ title: "Campos Incompletos", description: "Por favor, complete todos los campos.", variant: "warning" });
      return;
    }
    setIsLoading(true);
    onRegister(name, email, password, role);
    setTimeout(() => setIsLoading(false), 5000);
  };

  return (
     <form onSubmit={handleSubmit}>
      <CardContent className="space-y-6">
         <div className="space-y-3">
          <Label htmlFor={`name-register-${role}`} className="text-base">{role === 'user' ? 'Nombre Completo' : 'Nombre de la Empresa'}</Label>
          <Input 
            id={`name-register-${role}`} 
            type="text" 
            placeholder={role === 'user' ? 'Tu nombre completo' : 'El nombre de tu empresa'}
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor={`email-register-${role}`} className="text-base">Correo Electrónico</Label>
          <Input 
            id={`email-register-${role}`} 
            type="email" 
            placeholder="tu@email.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor={`password-register-${role}`} className="text-base">Contraseña</Label>
          <Input 
            id={`password-register-${role}`} 
            type="password" 
            placeholder="••••••••••"
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit" disabled={isLoading} size="lg">
          {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          Crear Cuenta
        </Button>
      </CardFooter>
    </form>
  )
}

export default function LoginPage() {
  const { login, register } = useAuth();
  const searchParams = useSearchParams();
  
  const [view, setView] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'user' | 'company'>('user');

  useEffect(() => {
    const roleParam = searchParams.get('role');
    const viewParam = searchParams.get('view');
    if (roleParam === 'company') {
      setRole('company');
    } else {
      setRole('user');
    }
    if (viewParam === 'register') {
      setView('register');
    } else {
      setView('login');
    }
  }, [searchParams]);

  const toggleView = () => setView(v => v === 'login' ? 'register' : 'login');

  const getOtherRolePath = () => {
    const otherRole = role === 'user' ? 'company' : 'user';
    return `/login?role=${otherRole}&view=${view}`;
  }


  return (
    <>
      <MainHeader />
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 px-4 py-24">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">
              {view === 'login' ? `Accede como ${role === 'user' ? 'Postulante' : 'Empresa'}` : `Crea tu cuenta de ${role === 'user' ? 'Postulante' : 'Empresa'}`}
            </CardTitle>
            <CardDescription className="text-lg pt-2">
              {view === 'login' ? 'Bienvenido de vuelta a Misty Box.' : 'Únete para descubrir nuevas oportunidades.'}
            </CardDescription>
          </CardHeader>
          
          {view === 'login' ? <LoginForm role={role} onLogin={login} /> : <RegisterForm role={role} onRegister={register} />}

          <CardContent className="text-center">
            <button onClick={toggleView} className="text-base text-muted-foreground hover:text-primary transition-colors">
              {view === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'} <span className="font-semibold text-primary">{view === 'login' ? 'Regístrate' : 'Inicia Sesión'}</span>
            </button>
          </CardContent>
        </Card>
        <p className="text-center text-base text-muted-foreground mt-8">
            <Link href={getOtherRolePath()} className="font-semibold text-primary hover:underline">
                ¿Eres {role === 'user' ? 'una empresa' : 'un postulante'}?
            </Link>
        </p>
         <p className="text-center text-base text-muted-foreground mt-4">
            <span className="font-semibold">Demo:</span> usa `user@example.com` o `company@example.com`.
        </p>
      </div>
    </>
  );
}
