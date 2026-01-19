import {
  findProductById,
  findAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  findVariantById,
  findVariantsByProductId,
  findVariantBySKU,
  createVariant,
  updateVariant,
  deleteVariant,
  findVariantImages,
  addVariantImages,
  updateImageOrder,
  deleteVariantImage,
  findPricingByUser,
  findPricingByVariant,
  setVariantPricing,
  bulkSetVariantPricing,
  deleteVariantPricing,
  findCompleteProduct,
  searchProducts,
  findProductsWithPriceStats,
  findProductsByCategory,
  createProductWithVariantsAndSinglePrice,
  updateProductWithVariantsAndSinglePrice,
  deleteProductFull,
} from "./admin.products.repository.js";

// ==================== HELPER FUNCTIONS ====================

function formatName(name) {
  if (!name) return name;
  const cleaned = name.trim().toLowerCase();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function formatSKU(sku) {
  if (!sku) return sku;
  return sku.trim().toUpperCase();
}

function validateProductData(productData) {
  const { product_name, business_category_id, category_id } = productData;

  if (!product_name || !product_name.trim()) {
    throw new Error("Product name is required");
  }

  if (!business_category_id) {
    throw new Error("Business category is required");
  }

  if (!category_id) {
    throw new Error("Category is required");
  }
}

function validateVariantData(variantData) {
  const { product_id, variant_name, sku } = variantData;

  if (!product_id) {
    throw new Error("Product ID is required");
  }

  if (!variant_name || !variant_name.trim()) {
    throw new Error("Variant name is required");
  }

  if (!sku || !sku.trim()) {
    throw new Error("SKU is required");
  }
}

function validatePricingData(pricingData) {
  const { variant_id, user_id, cost_price, selling_price } = pricingData;

  if (!variant_id) {
    throw new Error("Variant ID is required");
  }

  if (!user_id) {
    throw new Error("User ID is required");
  }

  if (cost_price === undefined || cost_price === null) {
    throw new Error("Cost price is required");
  }

  if (selling_price === undefined || selling_price === null) {
    throw new Error("Selling price is required");
  }

  if (parseFloat(cost_price) < 0) {
    throw new Error("Cost price cannot be negative");
  }

  if (parseFloat(selling_price) < 0) {
    throw new Error("Selling price cannot be negative");
  }
}

// ==================== PRODUCT SERVICES ====================

export const getProductById = async (id) => {
  if (!id) {
    throw new Error("Product ID is required");
  }

  const product = await findProductById(Number(id));

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const getAllProducts = async (query) => {
  return await findAllProducts(query);
};

export const createNewProduct = async (productData) => {
  validateProductData(productData);

  const { product_name, description, status } = productData;

  productData.product_name = formatName(product_name);

  if (description) {
    productData.description = description.trim();
  }

  if (status) {
    productData.status = status.trim().toLowerCase();
  }

  return await createProduct(productData);
};

export const updateExistingProduct = async (id, productData) => {
  if (!id) {
    throw new Error("Product ID is required");
  }

  // Check if product exists
  await getProductById(id);

  if (productData.product_name) {
    productData.product_name = formatName(productData.product_name);
  }

  if (productData.description) {
    productData.description = productData.description.trim();
  }

  if (productData.status) {
    productData.status = productData.status.trim().toLowerCase();
  }

  return await updateProduct(Number(id), productData);
};

export const deleteProductById = async (id) => {
  if (!id) {
    throw new Error("Product ID is required");
  }

  // Check if product exists
  await getProductById(id);

  return await deleteProduct(Number(id));
};

// ==================== VARIANT SERVICES ====================

export const getVariantById = async (id) => {
  if (!id) {
    throw new Error("Variant ID is required");
  }

  const variant = await findVariantById(Number(id));

  if (!variant) {
    throw new Error("Variant not found");
  }

  return variant;
};

export const getVariantsByProductId = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  return await findVariantsByProductId(Number(productId));
};

export const getVariantBySKU = async (sku) => {
  if (!sku) {
    throw new Error("SKU is required");
  }

  const variant = await findVariantBySKU(sku.trim());

  if (!variant) {
    throw new Error("Variant not found");
  }

  return variant;
};

export const createNewVariant = async (variantData) => {
  validateVariantData(variantData);

  const { variant_name, sku } = variantData;

  variantData.variant_name = formatName(variant_name);
  variantData.sku = formatSKU(sku);

  // Format attribute values if present
  if (variantData.attribute_value_1) {
    variantData.attribute_value_1 = variantData.attribute_value_1.trim();
  }
  if (variantData.attribute_value_2) {
    variantData.attribute_value_2 = variantData.attribute_value_2.trim();
  }
  if (variantData.attribute_value_3) {
    variantData.attribute_value_3 = variantData.attribute_value_3.trim();
  }

  return await createVariant(variantData);
};

export const updateExistingVariant = async (id, variantData) => {
  if (!id) {
    throw new Error("Variant ID is required");
  }

  // Check if variant exists
  await getVariantById(id);

  if (variantData.variant_name) {
    variantData.variant_name = formatName(variantData.variant_name);
  }

  if (variantData.sku) {
    variantData.sku = formatSKU(variantData.sku);
  }

  // Format attribute values if present
  if (variantData.attribute_value_1) {
    variantData.attribute_value_1 = variantData.attribute_value_1.trim();
  }
  if (variantData.attribute_value_2) {
    variantData.attribute_value_2 = variantData.attribute_value_2.trim();
  }
  if (variantData.attribute_value_3) {
    variantData.attribute_value_3 = variantData.attribute_value_3.trim();
  }

  return await updateVariant(Number(id), variantData);
};

export const deleteVariantById = async (id) => {
  if (!id) {
    throw new Error("Variant ID is required");
  }

  // Check if variant exists
  await getVariantById(id);

  return await deleteVariant(Number(id));
};

// ==================== VARIANT IMAGE SERVICES ====================

export const getVariantImages = async (variantId) => {
  if (!variantId) {
    throw new Error("Variant ID is required");
  }

  return await findVariantImages(Number(variantId));
};

export const addImagesToVariant = async (variantId, images) => {
  if (!variantId) {
    throw new Error("Variant ID is required");
  }

  if (!images || !Array.isArray(images) || images.length === 0) {
    throw new Error("Images array is required");
  }

  // Validate each image
  images.forEach((img, index) => {
    if (!img.image_url || !img.image_url.trim()) {
      throw new Error(`Image URL is required for image at index ${index}`);
    }
    img.image_url = img.image_url.trim();
  });

  return await addVariantImages(Number(variantId), images);
};

export const updateVariantImageOrder = async (imageId, displayOrder) => {
  if (!imageId) {
    throw new Error("Image ID is required");
  }

  if (displayOrder === undefined || displayOrder === null) {
    throw new Error("Display order is required");
  }

  return await updateImageOrder(Number(imageId), Number(displayOrder));
};

export const deleteVariantImageById = async (imageId) => {
  if (!imageId) {
    throw new Error("Image ID is required");
  }

  return await deleteVariantImage(Number(imageId));
};

// ==================== PRICING SERVICES ====================

export const getPricingByUser = async (userId, variantId = null) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return await findPricingByUser(
    Number(userId),
    variantId ? Number(variantId) : null
  );
};

export const getPricingByVariant = async (variantId) => {
  if (!variantId) {
    throw new Error("Variant ID is required");
  }

  return await findPricingByVariant(Number(variantId));
};

export const createOrUpdateVariantPricing = async (pricingData) => {
  validatePricingData(pricingData);

  // Ensure numeric values
  pricingData.variant_id = Number(pricingData.variant_id);
  pricingData.user_id = Number(pricingData.user_id);
  pricingData.cost_price = parseFloat(pricingData.cost_price);
  pricingData.selling_price = parseFloat(pricingData.selling_price);

  if (pricingData.tax_percentage !== undefined) {
    pricingData.tax_percentage = parseFloat(pricingData.tax_percentage);
  }

  if (pricingData.state) {
    pricingData.state = pricingData.state.trim();
  }

  if (pricingData.city) {
    pricingData.city = pricingData.city.trim();
  }

  return await setVariantPricing(pricingData);
};

export const bulkCreateOrUpdateVariantPricing = async (
  userId,
  pricingArray
) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (
    !pricingArray ||
    !Array.isArray(pricingArray) ||
    pricingArray.length === 0
  ) {
    throw new Error("Pricing array is required");
  }

  // Validate and format each pricing entry
  pricingArray.forEach((pricing, index) => {
    try {
      validatePricingData({ ...pricing, user_id: userId });
    } catch (error) {
      throw new Error(`Pricing at index ${index}: ${error.message}`);
    }

    pricing.variant_id = Number(pricing.variant_id);
    pricing.cost_price = parseFloat(pricing.cost_price);
    pricing.selling_price = parseFloat(pricing.selling_price);

    if (pricing.tax_percentage !== undefined) {
      pricing.tax_percentage = parseFloat(pricing.tax_percentage);
    }

    if (pricing.state) {
      pricing.state = pricing.state.trim();
    }

    if (pricing.city) {
      pricing.city = pricing.city.trim();
    }
  });

  return await bulkSetVariantPricing(Number(userId), pricingArray);
};

export const deleteVariantPricingById = async (variantId, userId) => {
  if (!variantId) {
    throw new Error("Variant ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  return await deleteVariantPricing(Number(variantId), Number(userId));
};

export const createFullProductWithVariantsAndPricing = async (
  productData,
  variants,
  pricingData,
  userId,
  location
) => {
  // Basic validations
  validateProductData(productData);

  if (!variants || !Array.isArray(variants) || variants.length === 0) {
    throw new Error("Variants array is required");
  }

  if (!pricingData) {
    throw new Error("Pricing data is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!location || !location.state || !location.city) {
    throw new Error("Valid location (state, city) is required");
  }

  // Format product fields
  productData.product_name = formatName(productData.product_name);

  if (productData.description) {
    productData.description = productData.description.trim();
  }

  if (productData.status) {
    productData.status = productData.status.trim().toLowerCase();
  }

  // Format variants
  variants.forEach((variant, index) => {
    if (!variant.variant_name || !variant.sku) {
      throw new Error(
        `Variant at index ${index} must have variant_name and sku`
      );
    }

    variant.variant_name = formatName(variant.variant_name);
    variant.sku = formatSKU(variant.sku);

    if (variant.attribute_value_1) {
      variant.attribute_value_1 = variant.attribute_value_1.trim();
    }
    if (variant.attribute_value_2) {
      variant.attribute_value_2 = variant.attribute_value_2.trim();
    }
    if (variant.attribute_value_3) {
      variant.attribute_value_3 = variant.attribute_value_3.trim();
    }

    if (variant.images) {
      variant.images.forEach((img, imgIndex) => {
        if (!img.image_url || !img.image_url.trim()) {
          throw new Error(
            `Image URL is required for variant ${index}, image ${imgIndex}`
          );
        }
        img.image_url = img.image_url.trim();
      });
    }
  });

  // Format pricing
  if (
    pricingData.cost_price === undefined ||
    pricingData.selling_price === undefined
  ) {
    throw new Error("Cost price and selling price are required");
  }

  pricingData.cost_price = parseFloat(pricingData.cost_price);
  pricingData.selling_price = parseFloat(pricingData.selling_price);

  if (pricingData.tax_percentage !== undefined) {
    pricingData.tax_percentage = parseFloat(pricingData.tax_percentage);
  }

  if (isNaN(pricingData.cost_price) || isNaN(pricingData.selling_price)) {
    throw new Error("Invalid pricing numbers");
  }

  // Call repository transactional function
  return await createProductWithVariantsAndSinglePrice(
    productData,
    variants,
    pricingData,
    Number(userId),
    {
      state: location.state.trim(),
      city: location.city.trim(),
    }
  );
};

// ==================== FULL PRODUCT UPDATE SERVICE ====================

export const updateFullProductWithVariantsAndPricing = async (
  productId,
  productData,
  variants,
  pricingData,
  userId,
  location
) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  // Ensure product exists
  await getProductById(productId);

  // Reuse same validations as create
  validateProductData(productData);

  if (!variants || !Array.isArray(variants) || variants.length === 0) {
    throw new Error("Variants array is required");
  }

  if (!pricingData) {
    throw new Error("Pricing data is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!location || !location.state || !location.city) {
    throw new Error("Valid location (state, city) is required");
  }

  // Format product fields
  productData.product_name = formatName(productData.product_name);

  if (productData.description) {
    productData.description = productData.description.trim();
  }

  if (productData.status) {
    productData.status = productData.status.trim().toLowerCase();
  }

  // Format variants
  variants.forEach((variant, index) => {
    if (!variant.variant_name || !variant.sku) {
      throw new Error(
        `Variant at index ${index} must have variant_name and sku`
      );
    }

    variant.variant_name = formatName(variant.variant_name);
    variant.sku = formatSKU(variant.sku);

    if (variant.attribute_value_1) {
      variant.attribute_value_1 = variant.attribute_value_1.trim();
    }
    if (variant.attribute_value_2) {
      variant.attribute_value_2 = variant.attribute_value_2.trim();
    }
    if (variant.attribute_value_3) {
      variant.attribute_value_3 = variant.attribute_value_3.trim();
    }

    if (variant.images) {
      variant.images.forEach((img, imgIndex) => {
        if (!img.image_url || !img.image_url.trim()) {
          throw new Error(
            `Image URL is required for variant ${index}, image ${imgIndex}`
          );
        }
        img.image_url = img.image_url.trim();
      });
    }
  });

  // Format pricing
  if (
    pricingData.cost_price === undefined ||
    pricingData.selling_price === undefined
  ) {
    throw new Error("Cost price and selling price are required");
  }

  pricingData.cost_price = parseFloat(pricingData.cost_price);
  pricingData.selling_price = parseFloat(pricingData.selling_price);

  if (pricingData.tax_percentage !== undefined) {
    pricingData.tax_percentage = parseFloat(pricingData.tax_percentage);
  }

  if (isNaN(pricingData.cost_price) || isNaN(pricingData.selling_price)) {
    throw new Error("Invalid pricing numbers");
  }

  return await updateProductWithVariantsAndSinglePrice(
    Number(productId),
    productData,
    variants,
    pricingData,
    Number(userId),
    {
      state: location.state.trim(),
      city: location.city.trim(),
    }
  );
};

// ==================== FULL PRODUCT DELETE SERVICE ====================

export const deleteFullProductById = async (productId) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  // Ensure product exists
  await getProductById(productId);

  return await deleteProductFull(Number(productId));
};

// ==================== COMPLEX QUERY SERVICES ====================

export const getCompleteProduct = async (productId, userId = null) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  const product = await findCompleteProduct(
    Number(productId),
    userId ? Number(userId) : null
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const searchAllProducts = async (query) => {
  if (!query.search || !query.search.trim()) {
    return {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: query.page || 1,
    };
  }

  query.search = query.search.trim();

  return await searchProducts(query);
};

export const getProductsWithPriceStats = async (query) => {
  return await findProductsWithPriceStats(query);
};

export const getProductsByCategory = async (categoryId, query) => {
  if (!categoryId) {
    throw new Error("Category ID is required");
  }

  return await findProductsByCategory(Number(categoryId), query);
};
