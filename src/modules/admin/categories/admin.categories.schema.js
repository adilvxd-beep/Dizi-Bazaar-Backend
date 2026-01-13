import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(3, " category name is required"),
    status: z.enum(["active", "inactive"]).transform(v => v.toLowerCase()),
    business_category_id: z.coerce.number(),
    image_url: z.string().url().optional()
});

export const updateCategorySchema = z.object({
  name: z.string().min(3).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  business_category_id: z.coerce.number().optional(),
  image_url: z.string().url().optional()
}).refine(
  data => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);
