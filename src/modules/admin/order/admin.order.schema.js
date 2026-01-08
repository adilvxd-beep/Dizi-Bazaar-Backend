import { z } from "zod";

export const createOrderSchema = z.object({
  userId: z.number().int().positive(),
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});
