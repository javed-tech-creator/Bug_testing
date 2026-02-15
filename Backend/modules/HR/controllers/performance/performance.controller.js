import Performance from "../../models/performance/performance.model.js";

// ✅ Add performance
export const createPerformance = async (req, res) => {
  try {
    const performance = new Performance(req.body);
    await performance.save();
    res.status(201).json({ success: true, data: performance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 🔍 Get all
export const getAllPerformance = async (req, res, next) => {
  try {
    const performances = await Performance.find()
       .populate({
    path: "employeeId",
    select: "employeeId name email phone photo departmentId designationId",
    populate: [
      { path: "departmentId", select: "departmentName" },
      { path: "designationId", select: "designationName" }
    ]
  });
    res.status(200).json({
      success: true,
      data: performances,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching employee performance",
    });
  }
};

// 🔎 Get single
export const getPerformanceById = async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id);
    if (!performance)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: performance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ Update
export const updatePerformance = async (req, res) => {
  try {
    const updated = await Performance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ❌ Delete
export const deletePerformance = async (req, res) => {
  try {
    const deleted = await Performance.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
