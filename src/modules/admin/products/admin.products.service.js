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
  toggleProductStatus,
  importProducts,
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
  const { variant_id, user_id, cost_price, selling_price, mrp } = pricingData;

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

  if (mrp === undefined || mrp === null) {
    throw new Error("MRP is required");
  }

  if (parseFloat(cost_price) < 0) {
    throw new Error("Cost price cannot be negative");
  }

  if (parseFloat(selling_price) < 0) {
    throw new Error("Selling price cannot be negative");
  }

  if (parseFloat(mrp) < 0) {
    throw new Error("MRP cannot be negative");
  }

  if (parseFloat(mrp) < parseFloat(selling_price)) {
    throw new Error("MRP cannot be less than selling price");
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

export const toggleProductStatusById = async (id) => {
  if (!id) {
    throw new Error("Product ID is required");
  }

  // Check if product exists
  await getProductById(id);

  return await toggleProductStatus(Number(id));
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
    variantId ? Number(variantId) : null,
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

  pricingData.variant_id = Number(pricingData.variant_id);
  pricingData.user_id = Number(pricingData.user_id);
  pricingData.cost_price = parseFloat(pricingData.cost_price);
  pricingData.selling_price = parseFloat(pricingData.selling_price);
  pricingData.mrp = parseFloat(pricingData.mrp);

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
  pricingArray,
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
    pricing.mrp = parseFloat(pricing.mrp);

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
  userId,
  location,
) => {
  // Basic validations
  validateProductData(productData);

  if (!variants || !Array.isArray(variants) || variants.length === 0) {
    throw new Error("Variants array is required");
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

  // Format variants + validate per-variant pricing
  variants.forEach((variant, index) => {
    if (!variant.variant_name || !variant.sku) {
      throw new Error(
        `Variant at index ${index} must have variant_name and sku`,
      );
    }

    variant.variant_name = formatName(variant.variant_name);
    variant.sku = formatSKU(variant.sku);

    // Attributes
    if (variant.attribute_value_1)
      variant.attribute_value_1 = variant.attribute_value_1.trim();
    if (variant.attribute_value_2)
      variant.attribute_value_2 = variant.attribute_value_2.trim();
    if (variant.attribute_value_3)
      variant.attribute_value_3 = variant.attribute_value_3.trim();

    // Images
    if (variant.images) {
      variant.images.forEach((img, imgIndex) => {
        if (!img.image_url || !img.image_url.trim()) {
          throw new Error(
            `Image URL required for variant ${index}, image ${imgIndex}`,
          );
        }
        img.image_url = img.image_url.trim();
      });
    }

    // Per-variant pricing validation
    if (!variant.pricing) {
      throw new Error(`Pricing is required for variant at index ${index}`);
    }

    const { cost_price, selling_price, mrp, tax_percentage } = variant.pricing;

    if (
      cost_price === undefined ||
      selling_price === undefined ||
      mrp === undefined
    ) {
      throw new Error(
        `Cost price, selling price and MRP required for variant at index ${index}`,
      );
    }

    variant.pricing.cost_price = parseFloat(cost_price);
    variant.pricing.selling_price = parseFloat(selling_price);
    variant.pricing.mrp = parseFloat(mrp);

    if (variant.pricing.mrp < variant.pricing.selling_price) {
      throw new Error(
        `MRP cannot be less than selling price for variant at index ${index}`,
      );
    }

    if (
      isNaN(variant.pricing.cost_price) ||
      isNaN(variant.pricing.selling_price) ||
      isNaN(variant.pricing.mrp)
    ) {
      throw new Error(`Invalid pricing numbers for variant at index ${index}`);
    }

    if (tax_percentage !== undefined) {
      variant.pricing.tax_percentage = parseFloat(tax_percentage);
    }
  });

  // Call repository
  return await createProductWithVariantsAndSinglePrice(
    productData,
    variants,
    Number(userId),
    {
      state: location.state.trim(),
      city: location.city.trim(),
    },
  );
};

// ==================== FULL PRODUCT UPDATE SERVICE ====================

export const updateFullProductWithVariantsAndPricing = async (
  productId,
  productData,
  variants,
  userId,
  location,
) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  await getProductById(productId);
  validateProductData(productData);

  if (!variants || !Array.isArray(variants) || variants.length === 0) {
    throw new Error("Variants array is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!location || !location.state || !location.city) {
    throw new Error("Valid location (state, city) is required");
  }

  // Format product
  productData.product_name = formatName(productData.product_name);

  if (productData.description)
    productData.description = productData.description.trim();

  if (productData.status)
    productData.status = productData.status.trim().toLowerCase();

  // Format variants + per-variant pricing
  variants.forEach((variant, index) => {
    if (!variant.variant_name || !variant.sku) {
      throw new Error(
        `Variant at index ${index} must have variant_name and sku`,
      );
    }

    variant.variant_name = formatName(variant.variant_name);
    variant.sku = formatSKU(variant.sku);

    if (variant.attribute_value_1)
      variant.attribute_value_1 = variant.attribute_value_1.trim();
    if (variant.attribute_value_2)
      variant.attribute_value_2 = variant.attribute_value_2.trim();
    if (variant.attribute_value_3)
      variant.attribute_value_3 = variant.attribute_value_3.trim();

    if (variant.images) {
      variant.images.forEach((img, imgIndex) => {
        if (!img.image_url || !img.image_url.trim()) {
          throw new Error(
            `Image URL required for variant ${index}, image ${imgIndex}`,
          );
        }
        img.image_url = img.image_url.trim();
      });
    }

    // Pricing
    if (!variant.pricing) {
      throw new Error(`Pricing is required for variant at index ${index}`);
    }

    const { cost_price, selling_price, mrp, tax_percentage } = variant.pricing;

    if (
      cost_price === undefined ||
      selling_price === undefined ||
      mrp === undefined
    ) {
      throw new Error(
        `Cost price, selling price and MRP required for variant at index ${index}`,
      );
    }

    variant.pricing.cost_price = parseFloat(cost_price);
    variant.pricing.selling_price = parseFloat(selling_price);
    variant.pricing.mrp = parseFloat(mrp);

    if (
      isNaN(variant.pricing.cost_price) ||
      isNaN(variant.pricing.selling_price) ||
      isNaN(variant.pricing.mrp)
    ) {
      throw new Error(`Invalid pricing numbers for variant at index ${index}`);
    }

    if (tax_percentage !== undefined) {
      variant.pricing.tax_percentage = parseFloat(tax_percentage);
    }
  });

  return await updateProductWithVariantsAndSinglePrice(
    Number(productId),
    productData,
    variants,
    Number(userId),
    {
      state: location.state.trim(),
      city: location.city.trim(),
    },
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
    userId ? Number(userId) : null,
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

export const importProductsService = async (
  productsArray,
  userId,
  location,
) => {
  if (!Array.isArray(productsArray) || productsArray.length === 0) {
    throw new Error("Products array is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!location || !location.state || !location.city) {
    throw new Error("Valid location (state, city) is required");
  }

  let lastProductContext = null;

  const normalizedProducts = productsArray.map((rawProduct, index) => {
    const hasProductName =
      rawProduct["Product Name*"] && rawProduct["Product Name*"].trim();

    let product;

    if (hasProductName) {
      // New product row
      product = {
        product_name: formatName(rawProduct["Product Name*"]),
        description: rawProduct["Description"]
          ? rawProduct["Description"].trim()
          : null,
        status: rawProduct["Status*"]
          ? rawProduct["Status*"].trim().toLowerCase()
          : "active",
        business_category_id: Number(rawProduct.business_category_id),
        category_id: Number(rawProduct.category_id),
        main_image: rawProduct["Main Image URL*"]?.trim() || null,
      };

      try {
        validateProductData(product);
      } catch (error) {
        throw new Error(`Product at row ${index + 1}: ${error.message}`);
      }

      // Save context for next variant rows
      lastProductContext = product;
    } else {
      // Variant-only row → inherit product
      if (!lastProductContext) {
        throw new Error(
          `Row ${index + 1}: Product Name is required for the first product`,
        );
      }

      product = lastProductContext;
    }

    const variant = {
      variant_name: formatName(rawProduct["Variant Name*"]),
      sku: formatSKU(rawProduct["SKU*"]),

      attribute_name_1: rawProduct["Attribute 1 Name"] || null,
      attribute_value_1: rawProduct["Attribute 1 Value"] || null,

      attribute_name_2: rawProduct["Attribute 2 Name"] || null,
      attribute_value_2: rawProduct["Attribute 2 Value"] || null,

      attribute_name_3: rawProduct["Attribute 3 Name"] || null,
      attribute_value_3: rawProduct["Attribute 3 Value"] || null,
    };

    if (!variant.variant_name || !variant.sku) {
      throw new Error(`Variant Name and SKU are required at row ${index + 1}`);
    }

    const pricing = {
      cost_price: parseFloat(rawProduct["Cost Price*"]),
      selling_price: parseFloat(rawProduct["Selling Price*"]),
      mrp: parseFloat(rawProduct["MRP"]),
      tax_percentage: rawProduct["Tax Percentage"]
        ? parseFloat(rawProduct["Tax Percentage"])
        : null,
    };

    if (
      isNaN(pricing.cost_price) ||
      isNaN(pricing.selling_price) ||
      isNaN(pricing.mrp)
    ) {
      throw new Error(`Invalid pricing at row ${index + 1}`);
    }

    if (pricing.mrp < pricing.selling_price) {
      throw new Error(
        `MRP cannot be less than selling price at row ${index + 1}`,
      );
    }

    const variant_images = rawProduct["Variant Images (comma separated)"]
      ? rawProduct["Variant Images (comma separated)"]
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean)
      : [];

    return {
      product,
      variant,
      pricing,
      variant_images,
    };
  });

  const groupProductsWithVariants = (normalizedProducts) => {
    const productMap = new Map();

    for (const row of normalizedProducts) {
      const { product, variant, pricing, variant_images } = row;

      // Unique key per product
      const productKey = `${product.product_name}_${product.category_id}`;

      if (!productMap.has(productKey)) {
        productMap.set(productKey, {
          ...product,
          variants: [],
        });
      }

      productMap.get(productKey).variants.push({
        ...variant,
        pricing,
        images: variant_images,
      });
    }

    return Array.from(productMap.values());
  };

  return await importProducts(
    groupProductsWithVariants(normalizedProducts),
    Number(userId),
    {
      state: location.state.trim(),
      city: location.city.trim(),
    },
  );
};
