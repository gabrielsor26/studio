
'use client';

import React from 'react';
import type { Post } from '@/lib/types';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const PostCard = React.memo(function PostCard({ post }: { post: Post }) {
  const isAnonymous = !('author' in post) || post.author.name === 'Anónimo';
  const authorName = isAnonymous ? 'Anónimo' : post.author.name;
  const authorAvatar = 'author' in post ? post.author.avatar : undefined;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start gap-4 p-6">
        <Avatar className="h-14 w-14 border">
          <AvatarImage src={authorAvatar} data-ai-hint="person" />
          <AvatarFallback className="text-xl">{authorName.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">{authorName}</p>
              <p className="text-base text-muted-foreground">{post.createdAt}</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-6 w-6"/>
              <span className="sr-only">Más opciones</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-4 pt-0">
        <p className="whitespace-pre-wrap text-lg leading-relaxed">{post.content}</p>
        {post.rating && (
          <div className="mt-4 flex items-center gap-1.5">
             <p className="text-base font-semibold text-muted-foreground mr-2">Calificación:</p>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${i < post.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
              />
            ))}
          </div>
        )}
      </CardContent>
       {post.mentions && post.mentions.length > 0 && (
        <CardContent className="px-8 pb-6 pt-2">
            <div className="flex flex-wrap gap-3">
              {post.mentions.map((mention) => (
                <Badge key={mention.id} variant="secondary" className="text-base py-1 px-3 cursor-pointer hover:bg-primary/20">
                  @{mention.name}
                </Badge>
              ))}
            </div>
        </CardContent>
      )}
      <Separator />
      <CardFooter className="p-2">
        <div className="flex justify-around w-full">
            <Button variant="ghost" size="lg" className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                <Heart className="mr-2 h-5 w-5"/> Me gusta
            </Button>
            <Button variant="ghost" size="lg" className="w-full text-muted-foreground hover:text-primary hover:bg-primary/10">
                <MessageCircle className="mr-2 h-5 w-5"/> Comentar
            </Button>
            <Button variant="ghost" size="lg" className="w-full text-muted-foreground hover:text-green-500 hover:bg-green-500/10">
                <Share2 className="mr-2 h-5 w-5"/> Compartir
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
});

export default PostCard;
