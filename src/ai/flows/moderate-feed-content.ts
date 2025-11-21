'use server';

/**
 * @fileOverview This file defines a Genkit flow for moderating feed content using AI to detect and block inappropriate language.
 *
 * - moderateFeedContent - A function that takes text as input and returns a moderation result.
 * - ModerateFeedContentInput - The input type for the moderateFeedContent function.
 * - ModerateFeedContentOutput - The return type for the moderateFeedContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateFeedContentInputSchema = z.object({
  text: z
    .string()
    .describe('The text content to be moderated for inappropriate language.'),
});
export type ModerateFeedContentInput = z.infer<typeof ModerateFeedContentInputSchema>;

const ModerateFeedContentOutputSchema = z.object({
  isSafe: z
    .boolean()
    .describe('Whether the content is safe and suitable for posting.'),
  reason: z
    .string()
    .optional()
    .describe('The reason why the content was flagged as unsafe, if applicable.'),
});
export type ModerateFeedContentOutput = z.infer<typeof ModerateFeedContentOutputSchema>;

export async function moderateFeedContent(
  input: ModerateFeedContentInput
): Promise<ModerateFeedContentOutput> {
  return moderateFeedContentFlow(input);
}

const moderateFeedContentPrompt = ai.definePrompt({
  name: 'moderateFeedContentPrompt',
  input: {schema: ModerateFeedContentInputSchema},
  output: {schema: ModerateFeedContentOutputSchema},
  prompt: `You are an AI content moderator responsible for ensuring that user-generated content is safe and appropriate for a public forum.
  Your task is to analyze the given text and determine if it contains any inappropriate language, including hate speech, harassment, sexually explicit content, dangerous content, or content that violates civic integrity.

  Based on your analysis, respond with a JSON object indicating whether the content is safe to post (isSafe: true/false) and, if not safe, provide a reason (reason: string). If the content is safe, the reason should be null.

  Text to analyze: {{{text}}}
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const moderateFeedContentFlow = ai.defineFlow(
  {
    name: 'moderateFeedContentFlow',
    inputSchema: ModerateFeedContentInputSchema,
    outputSchema: ModerateFeedContentOutputSchema,
  },
  async input => {
    const {output} = await moderateFeedContentPrompt(input);
    return output!;
  }
);
