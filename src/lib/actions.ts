'use server';

import { moderateFeedContent } from "@/ai/flows/moderate-feed-content";
import { revalidatePath } from "next/cache";

export async function createPostAction(prevState: any, formData: FormData) {
  const content = formData.get('content') as string;
  if (!content || content.trim().length === 0) {
    return { message: 'El contenido no puede estar vacío.', success: false };
  }

  try {
    const moderationResult = await moderateFeedContent({ text: content });

    if (!moderationResult.isSafe) {
      return { message: `Contenido inapropiado detectado: ${moderationResult.reason || 'No se pudo publicar.'}`, success: false };
    }

    // Here you would typically save the post to a database.
    // For this demo, we'll just simulate success.
    console.log("Post created:", {
      content,
      rating: formData.get('rating'),
      isAnonymous: formData.get('rating') ? Number(formData.get('rating')) > 0 : false,
    });

    revalidatePath('/feed');
    return { message: 'Publicación creada con éxito.', success: true };
  } catch (error) {
    console.error(error);
    return { message: 'Error al procesar la publicación. Inténtalo de nuevo más tarde.', success: false };
  }
}
