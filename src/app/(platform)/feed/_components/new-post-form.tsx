
'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createPostAction } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Star, Loader2, Send } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5"/>}
      Publicar
    </Button>
  );
}

export default function NewPostForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const initialState = { message: '', success: false };
  const [state, dispatch] = useActionState(createPostAction, initialState);
  
  useEffect(() => {
    if (state.message) {
        if(state.success) {
            toast({
                title: 'Éxito',
                description: state.message,
                variant: 'success'
            });
            formRef.current?.reset();
            setRating(0);
        } else {
            toast({
                title: 'Error en la Publicación',
                description: state.message,
                variant: 'destructive',
            });
        }
    }
  }, [state, toast]);

  if (!user) return null;

  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-2xl">Crea una nueva publicación</CardTitle>
        </CardHeader>
      <form ref={formRef} action={dispatch}>
        <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
                 <Avatar className="h-14 w-14 border">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Textarea
                    name="content"
                    placeholder={`¿Qué estás pensando, ${user.name.split(' ')[0]}?`}
                    rows={4}
                    required
                    className="text-base flex-grow bg-muted border-0 focus-visible:ring-1 focus-visible:ring-ring"
                />
            </div>
          <div className="space-y-3 pl-16">
            <Label className="text-base font-medium">Califica tu experiencia (opcional, te hará anónimo)</Label>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => {
                const value = i + 1;
                return (
                  <button
                    type="button"
                    key={value}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(value)}
                    className="cursor-pointer"
                    aria-label={`Calificar con ${value} estrellas`}
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        value <= (hoverRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="rating" value={rating} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pr-8 pb-6">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
