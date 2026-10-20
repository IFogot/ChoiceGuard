import { z } from 'zod';

const productIdSchema = z.string().trim().regex(/^prod_[a-z0-9_]{1,80}$/i);

export const createMealInputSchema = z.object({
  productId: productIdSchema,
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  portion: z.number().min(0.25).max(4).multipleOf(0.25),
  brothPercent: z.number().int().min(0).max(100).optional(),
}).strict();

export const createPantryItemInputSchema = z.object({
  productId: productIdSchema,
  lotCode: z.string().trim().min(1).max(128).regex(/^[A-Za-z0-9._/-]+$/),
  expiryDate: z.string().date(),
  quantity: z.number().int().min(1).max(99),
}).strict();

export const updateRecallActionInputSchema = z.object({
  action: z.enum(['viewed', 'handled']),
}).strict();
