import { findAllProductVariantsForRetailer,  findProductWithVariantsForRetailerById, } from "./productVariant.repository.js";

export const findAllProductVariantsForRetailerService = async (query) => {
  try {
    return await findAllProductVariantsForRetailer(query);
  } catch (error) {
    // Generic fallback (no auth, no role-based errors here)
    error.statusCode = error.statusCode || 500;
    throw error;
  }
};

export const findProductWithVariantsForRetailerByIdService = async (
  productId
) => {
  const rows = await findProductWithVariantsForRetailerById(productId);

  /* ================= GROUP INTO SINGLE PRODUCT ================= */
  const firstRow = rows[0];

  const product = {
    productId: firstRow.product_id,
    productName: firstRow.product_name,
    description: firstRow.description,
    mainImage: firstRow.main_image,
    status: firstRow.status,
    createdAt: firstRow.product_created_at,
    variants: []
  };

  for (const row of rows) {
    product.variants.push({
      variantId: row.variant_id,
      variantName: row.variant_name,
      sku: row.sku,
      pricing: {
        sellingPrice: row.selling_price,
        mrp: row.mrp,
        taxPercentage: row.tax_percentage,
        state: row.state,
        city: row.city
      }
    });
  }

  return product;
};

