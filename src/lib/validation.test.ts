import { describe, expect, it } from 'vitest';
import { createMealInputSchema, createPantryItemInputSchema } from './validation';

describe('persistence request validation', () => {
  it('accepts a bounded meal log payload', () => {
    const result = createMealInputSchema.safeParse({
      productId: 'prod_noodle_healthy_1',
      mealType: 'lunch',
      portion: 1,
      brothPercent: 80,
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid meal portion before it reaches persistence', () => {
    const result = createMealInputSchema.safeParse({
      productId: 'prod_noodle_healthy_1',
      mealType: 'lunch',
      portion: 99,
    });

    expect(result.success).toBe(false);
  });

  it('requires a bounded lot code for a saved pantry item', () => {
    const result = createPantryItemInputSchema.safeParse({
      productId: 'prod_noodle_healthy_1',
      lotCode: 'LOT-2026-WTY-1082',
      expiryDate: '2027-03-01',
      quantity: 1,
    });

    expect(result.success).toBe(true);
  });
});
