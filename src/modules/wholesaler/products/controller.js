import { getAllProducts, getProductWithVariantsById } from "./service.js";

export const fetchAllProducts = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user
    const query = req.query;

    const products = await getAllProducts(userId, query);
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchSingleProductWithVariants = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const product = await getProductWithVariantsById(userId, productId);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
