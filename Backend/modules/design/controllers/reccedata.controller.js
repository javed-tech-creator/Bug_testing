import DummyRecce from "../models/reccedata.model.js";

/* ================= CREATE RECCE ================= */
export const createRecce = async (req, res) => {
  try {
    const recce = await DummyRecce.create({
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Recce created successfully",
      data: recce,
    });
  } catch (error) {
    console.error("Create Recce Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create recce",
      error: error.message,
    });
  }
};

/* ================= GET ALL RECCE ================= */
export const getAllRecce = async (req, res) => {
  try {
    const recceList = await DummyRecce.find()
      .populate("clientId")
      .populate("projectId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recceList.length,
      data: recceList,
    });
  } catch (error) {
    console.error("Get All Recce Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recce list",
      error: error.message,
    });
  }
};

/* ================= GET SINGLE RECCE ================= */
export const getRecceById = async (req, res) => {
  try {
    const { id } = req.params;

    const recce = await DummyRecce.findById(id)
      .populate("clientId" )
      .populate("projectId")
    if (!recce) {
      return res.status(404).json({
        success: false,
        message: "Recce not found",
      });
    }

    res.status(200).json({
      success: true,
      data: recce,
    });
  } catch (error) {
    console.error("Get Recce By Id Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recce",
      error: error.message,
    });
  }
};
