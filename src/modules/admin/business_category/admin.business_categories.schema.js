import { z } from "zod";

export const createBusinessCategorySchema = z.object(
    {
    name: z.string().min(3, "category name is required")
    }
);

export const businessCategoryStatusSchema = z.object(
    {
    status: z.enum(["active", "inactive"], "Invalid status value")
    }
);
