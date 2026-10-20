import { z } from 'zod';

const chatMessageSchema = z
  .object({
    sender: z.enum(['user', 'assistant']),
    text: z.string().trim().min(1).max(1000),
  })
  .strict();

const productContextSchema = z.object({
  name: z.string().max(200).optional(),
  categoryLabel: z.string().max(120).optional(),
  nutrition: z
    .object({
      sodiumMg: z.number().finite().nonnegative().optional(),
      sugarG: z.number().finite().nonnegative().optional(),
      saturatedFatG: z.number().finite().nonnegative().optional(),
    })
    .optional(),
  healthierChoiceCertified: z.boolean().optional(),
  traceabilityLotCode: z.string().max(128).optional(),
});

const groqChatRequestSchema = z
  .object({
    messages: z.array(chatMessageSchema).min(1).max(12),
    contextProduct: productContextSchema.optional(),
  })
  .strict();

export type GroqChatRequest = z.infer<typeof groqChatRequestSchema>;

/** Validates the narrow request contract accepted by the server-side AI proxy. */
export function parseGroqChatRequest(value: unknown): GroqChatRequest {
  return groqChatRequestSchema.parse(value);
}
