import { getAllCategories } from "./service.js";

export const fetchAllCategories = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user
    const query = req.query;

    const categories = await getAllCategories(userId, query);
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
