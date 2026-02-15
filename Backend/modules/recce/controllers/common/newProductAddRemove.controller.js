import mongoose from "mongoose";
import Project from "../../../sales/models/project.model.js";
import ClientProduct from "../../../sales/models/clientProduct.model.js";
import ApiError from "../../../../utils/master/ApiError.js";

export const addProductToProject = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { projectId, productId, productName, quantity } = req.body;

    if (!projectId || !productId || !productName) {
      return res.status(400).json({
        success: false,
        message: "projectId, productId and productName are required",
      });
    }

    // 1️⃣ Check Project
    const project = await Project.findById(projectId).session(session);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 2️⃣ Create ClientProduct
    const newProduct = await ClientProduct.create(
      [
        {
          projectId: project._id,
          clientId: project.clientId,
          productId: productId, //  store signage product id
          productName,
          quantity: quantity || 1,
        },
      ],
      { session },
    );

    // 3️⃣ Push product reference inside Project
    project.products.push(newProduct[0]._id);
    await project.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ApiError(500, error.message));
  }
};

export const deleteProductFromProject = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { projectId, clientProductId } = req.body;

    if (!projectId || !clientProductId) {
      return res.status(400).json({
        success: false,
        message: "projectId and clientProductId are required",
      });
    }

    // 1️⃣ Check Project
    const project = await Project.findById(projectId).session(session);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 2️⃣ Check ClientProduct
    const product =
      await ClientProduct.findById(clientProductId).session(session);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 3️⃣ Remove reference from Project
    project.products = project.products.filter(
      (id) => id.toString() !== clientProductId,
    );
    await project.save({ session });

    // 4️⃣ Hard Delete Product
    await ClientProduct.findByIdAndDelete(clientProductId).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Product permanently deleted",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ApiError(500, error.message));
  }
};
