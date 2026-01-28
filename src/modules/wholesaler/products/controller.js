import { getAllProducts } from "./service.js";

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
