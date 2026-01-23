import ApiResponse from "../../../shared/utils/ApiResponse.js";

import {
  getAllStock,
  getStockByVariant,
  saveStockWithPricing,
  updateStock,
  updateVariantPricing,
  deleteStock,
  getLowStock,
  getOutOfStock,
  getStockSummaryService,
  getStockByProduct,
} from "./wholesaler.inventory.service.js";

export const getStock = async (req, res, next) => {
  try {
    const stock = await getAllStock(req.user.id);
    res.json(new ApiResponse(200, stock));
  } catch (error) {
    next(error);
  }
};

export const getStockVariant = async (req, res, next) => {
  try {
    const stock = await getStockByVariant(req.params.variantId, req.user.id);
    res.json(new ApiResponse(200, stock));
  } catch (error) {
    next(error);
  }
};

export const saveStock = async (req, res, next) => {
  try {
    const result = await saveStockWithPricing(req.body, req.user.id);
    res.json(new ApiResponse(200, result));
  } catch (error) {
    next(error);
  }
};

export const updateStockQuantity = async (req, res, next) => {
  try {
    const result = await updateStock(
      req.params.variantId,
      req.body.stockQuantity,
      req.user.id,
    );
    res.json(new ApiResponse(200, result));
  } catch (error) {
    next(error);
  }
};

export const updatePricing = async (req, res, next) => {
  try {
    const result = await updateVariantPricing(req.body, req.user.id);
    res.json(new ApiResponse(200, result));
  } catch (error) {
    next(error);
  }
};

export const removeStock = async (req, res, next) => {
  try {
    const success = await deleteStock(req.params.variantId, req.user.id);
    res.json(new ApiResponse(200, { success }));
  } catch (error) {
    next(error);
  }
};

export const lowStock = async (req, res, next) => {
  try {
    const threshold = req.query.threshold || 10;
    const data = await getLowStock(req.user.id, threshold);
    res.json(new ApiResponse(200, data));
  } catch (error) {
    next(error);
  }
};

export const outOfStock = async (req, res, next) => {
  try {
    const data = await getOutOfStock(req.user.id);
    res.json(new ApiResponse(200, data));
  } catch (error) {
    next(error);
  }
};

export const stockSummary = async (req, res, next) => {
  try {
    const summary = await getStockSummaryService(req.user.id);
    res.json(new ApiResponse(200, summary));
  } catch (error) {
    next(error);
  }
};

export const stockByProduct = async (req, res, next) => {
  try {
    const data = await getStockByProduct(req.params.productId, req.user.id);
    res.json(new ApiResponse(200, data));
  } catch (error) {
    next(error);
  }
};
