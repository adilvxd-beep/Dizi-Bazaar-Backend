import { z } from "zod";

// ==================== PRODUCT ====================

export const createProductSchema = z.object({
  product_name: z.string().min(2),
  business_category_id: z.number().int(),
  category_id: z.number().int(),

  description: z.string().min(5).optional(),
  main_image: z.string().url().optional(),

  status: z.enum(["active", "inactive"]).optional(),
});

export const updateProductSchema = z
  .object({
    product_name: z.string().min(2).optional(),
    business_category_id: z.number().int().optional(),
    category_id: z.number().int().optional(),

    description: z.string().min(5).optional(),
    main_image: z.string().url().optional(),

    status: z.enum(["active", "inactive"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// ==================== PRODUCT VARIANT ====================

export const createVariantSchema = z.object({
  product_id: z.number().int(),

  variant_name: z.string().min(2),
  sku: z.string().min(3),

  attribute_name_1: z.string().optional(),
  attribute_value_1: z.string().optional(),

  attribute_name_2: z.string().optional(),
  attribute_value_2: z.string().optional(),

  attribute_name_3: z.string().optional(),
  attribute_value_3: z.string().optional(),
});

export const updateVariantSchema = z
  .object({
    variant_name: z.string().min(2).optional(),
    sku: z.string().min(3).optional(),

    attribute_name_1: z.string().optional(),
    attribute_value_1: z.string().optional(),

    attribute_name_2: z.string().optional(),
    attribute_value_2: z.string().optional(),

    attribute_name_3: z.string().optional(),
    attribute_value_3: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// ==================== VARIANT IMAGES ====================

export const addVariantImagesSchema = z.object({
  images: z
    .array(
      z.object({
        image_url: z.string().url(),
        display_order: z.number().int().min(0).optional(),
      })
    )
    .min(1),
});

export const updateVariantImageOrderSchema = z.object({
  display_order: z.number().int().min(0),
});

// ==================== VARIANT PRICING ====================

export const setVariantPricingSchema = z.object({
  variant_id: z.number().int(),
  user_id: z.number().int(),

  cost_price: z.number().min(0),
  selling_price: z.number().min(0),

  tax_percentage: z.number().min(0).optional(),

  state: z.string().optional(),
  city: z.string().optional(),
});

export const bulkVariantPricingSchema = z.object({
  pricing: z
    .array(
      z.object({
        variant_id: z.number().int(),

        cost_price: z.number().min(0),
        selling_price: z.number().min(0),

        tax_percentage: z.number().min(0).optional(),
        state: z.string().optional(),
        city: z.string().optional(),
      })
    )
    .min(1),
});
