import {
  getAllProducts,
  getProductById,
  createNewProduct,
  updateExistingProduct,
  deleteProductById,
  getVariantById,
  getVariantsByProductId,
  getVariantBySKU,
  createNewVariant,
  updateExistingVariant,
  deleteVariantById,
  getVariantImages,
  addImagesToVariant,
  updateVariantImageOrder,
  deleteVariantImageById,
  getPricingByUser,
  getPricingByVariant,
  createOrUpdateVariantPricing,
  bulkCreateOrUpdateVariantPricing,
  deleteVariantPricingById,
  getCompleteProduct,
  searchAllProducts,
  getProductsWithPriceStats,
  getProductsByCategory,
} from "./admin.products.service.js";

import ApiError from "../../../shared/utils/ApiError.js";
import ApiResponse from "../../../shared/utils/ApiResponse.js";

/* ==================== PRODUCT CONTROLLERS ==================== */

export const getProducts = async (req, res, next) => {
  try {
    const products = await getAllProducts(req.query);
    res.json(new ApiResponse(200, products));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const getProductByIdController = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    res.json(new ApiResponse(200, product));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await createNewProduct(req.body);
    res.status(201).json(new ApiResponse(201, product));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await updateExistingProduct(req.params.id, req.body);
    res.json(new ApiResponse(200, product));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await deleteProductById(req.params.id);
    res.json(new ApiResponse(200, { message: "Product deleted successfully" }));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

/* ==================== VARIANT CONTROLLERS ==================== */

export const getVariantByIdController = async (req, res, next) => {
  try {
    const variant = await getVariantById(req.params.id);
    res.json(new ApiResponse(200, variant));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const getVariantsByProduct = async (req, res, next) => {
  try {
    const variants = await getVariantsByProductId(req.params.productId);
    res.json(new ApiResponse(200, variants));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const getVariantBySKUController = async (req, res, next) => {
  try {
    const variant = await getVariantBySKU(req.params.sku);
    res.json(new ApiResponse(200, variant));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const createVariant = async (req, res, next) => {
  try {
    const variant = await createNewVariant(req.body);
    res.status(201).json(new ApiResponse(201, variant));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const updateVariant = async (req, res, next) => {
  try {
    const variant = await updateExistingVariant(req.params.id, req.body);
    res.json(new ApiResponse(200, variant));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const deleteVariant = async (req, res, next) => {
  try {
    await deleteVariantById(req.params.id);
    res.json(new ApiResponse(200, { message: "Variant deleted successfully" }));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

/* ==================== VARIANT IMAGE CONTROLLERS ==================== */

export const getVariantImagesController = async (req, res, next) => {
  try {
    const images = await getVariantImages(req.params.variantId);
    res.json(new ApiResponse(200, images));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const addVariantImages = async (req, res, next) => {
  try {
    const images = await addImagesToVariant(
      req.params.variantId,
      req.body.images
    );
    res.status(201).json(new ApiResponse(201, images));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const updateImageOrder = async (req, res, next) => {
  try {
    const image = await updateVariantImageOrder(
      req.params.imageId,
      req.body.display_order
    );
    res.json(new ApiResponse(200, image));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const deleteVariantImage = async (req, res, next) => {
  try {
    await deleteVariantImageById(req.params.imageId);
    res.json(new ApiResponse(200, { message: "Image deleted successfully" }));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

/* ==================== PRICING CONTROLLERS ==================== */

export const getUserPricing = async (req, res, next) => {
  try {
    const pricing = await getPricingByUser(req.user.id, req.query.variantId);
    res.json(new ApiResponse(200, pricing));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const getVariantPricing = async (req, res, next) => {
  try {
    const pricing = await getPricingByVariant(req.params.variantId);
    res.json(new ApiResponse(200, pricing));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const setVariantPricing = async (req, res, next) => {
  try {
    const pricing = await createOrUpdateVariantPricing({
      ...req.body,
      user_id: req.user.id,
    });

    res.status(201).json(new ApiResponse(201, pricing));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const bulkSetVariantPricing = async (req, res, next) => {
  try {
    const pricingRecords = await bulkCreateOrUpdateVariantPricing(
      req.user.id,
      req.body.pricing
    );

    res.status(201).json(new ApiResponse(201, pricingRecords));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const deleteVariantPricing = async (req, res, next) => {
  try {
    await deleteVariantPricingById(req.params.variantId, req.user.id);

    res.json(new ApiResponse(200, { message: "Pricing deleted successfully" }));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

/* ==================== COMPLEX QUERY CONTROLLERS ==================== */

export const getCompleteProductController = async (req, res, next) => {
  try {
    const product = await getCompleteProduct(req.params.productId, req.user.id);

    res.json(new ApiResponse(200, product));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const products = await searchAllProducts(req.query);
    res.json(new ApiResponse(200, products));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const getProductsPriceStats = async (req, res, next) => {
  try {
    const products = await getProductsWithPriceStats(req.query);
    res.json(new ApiResponse(200, products));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const getProductsByCategoryController = async (req, res, next) => {
  try {
    const products = await getProductsByCategory(
      req.params.categoryId,
      req.query
    );

    res.json(new ApiResponse(200, products));
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};
