import mongoose from "mongoose";
import ProductCategoryModel from "../../models/vendor.model/productCategories.js";
import ApiError from "../../utils/master/ApiError.js";

export const createCategory = async (req, res, next) => {
  try {
    const { categoryName } = req.body;
    console.log("category name", categoryName);
    console.log("req.user._id ", req.user._id);

    if (!categoryName) {
      return next(new ApiError(400, "Category name is required"));
    }

    // Case-insensitive check for same vendor
    const exists = await ProductCategoryModel.findOne({
      categoryName: { $regex: new RegExp(`^${categoryName}$`, "i") },
      createdBy: req.user._id,
    });

    if (exists) {
      return next(
        new ApiError(409, "Category already exists (case-insensitive)")
      );
    }

    const category = await ProductCategoryModel.create({
      categoryName,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error); // Pass to error handler
  }
};

//  Update Category
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params; // category id from URL
    const { categoryName } = req.body;

    if (!categoryName) {
      return next(new ApiError(400, "Category name is required"));
    }

    // Case-insensitive duplicate check excluding current id
    const exists = await ProductCategoryModel.findOne({
      categoryName: { $regex: new RegExp(`^${categoryName}$`, "i") },
      createdBy: req.user._id,
      _id: { $ne: id }, // exclude current category
    });

    if (exists) {
      return next(
        new ApiError(
          409,
          "Category with same name already exists (case-insensitive)"
        )
      );
    }

    const updated = await ProductCategoryModel.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { categoryName },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return next(new ApiError(404, "Category not found or unauthorized"));
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await ProductCategoryModel.aggregate([
      { 
        $match: { createdBy: req.user._id } 
      },

      {
        $lookup: {
          from: "products",
          let: { catName: "$categoryName", userId: req.user._id },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$category", "$$catName"] },
                    { $eq: ["$importedBy", "$$userId"] }  //  USER FILTER HERE
                  ]
                }
              }
            }
          ],
          as: "products"
        }
      },

      {
        $addFields: {
          productCount: { $size: "$products" }
        }
      },

      {
        $project: {
          categoryName: 1,
          createdAt: 1,
          productCount: 1
        }
      },

      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    //  Step 1: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid category ID"));
    }

    //  Step 2: Check if category exists & belongs to vendor
    const category = await ProductCategoryModel.findOne({
      _id: id,
      createdBy: req.user._id,
    });

    if (!category) {
      return next(new ApiError(404, "Category not found or unauthorized"));
    }

    //  Step 4: Delete
    await category.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    console.log("mongoose", error);
    next(error);
  }
};
