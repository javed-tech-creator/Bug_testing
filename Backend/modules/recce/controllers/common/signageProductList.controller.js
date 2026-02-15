import ApiError from "../../../../utils/master/ApiError.js";
import AdminProduct from "../../../admin/models/product.model.js";
export const getAllSignageProducts = async (req, res, next) => {
  try {
    const products = await AdminProduct.find({
      isDeleted: false,
      isActive: true,
    })
      .select("_id title productId") // only required fields
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};
