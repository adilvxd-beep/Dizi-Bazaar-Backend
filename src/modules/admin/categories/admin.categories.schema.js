import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(3, " category name is required"),
    status: z.enum(["active", "inactive"], "Invalid status value"),
    business_category_id: z.coerce.number(),
    image_url: z.string().url()
});