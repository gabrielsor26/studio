
import { posts } from '@/lib/data';
import NewPostForm from './_components/new-post-form';
import PostCard from './_components/post-card';
import { Separator } from '@/components/ui/separator';

export default function FeedPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
        <div>
            <h1 className="text-4xl font-bold font-headline">Feed de la Comunidad</h1>
            <p className="text-muted-foreground text-xl mt-2">Comparte tus experiencias y conecta con otros postulantes.</p>
        </div>
        
        <NewPostForm />

        <div className="space-y-8">
            <Separator />
            <h2 className="text-3xl font-bold font-headline">Últimas publicaciones</h2>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
        </div>
    </div>
  );
}
