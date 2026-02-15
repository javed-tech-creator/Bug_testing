import ApiError from "../../../../utils/master/ApiError.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";

export const getDesignStatusList = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const { status, type } = req.query;
    const isStatus = status.toLowerCase();
    // pagination
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    //  Validation
    if (!isStatus || !["lost", "waiting"].includes(isStatus)) {
      return next(new ApiError(400, "Invalid status. Allowed: lost | waiting"));
    }

    if (!["self", "team"].includes(type)) {
      return next(new ApiError(400, "Invalid type. Allowed: self | team"));
    }

    //  Work status mapping
    let workStatusArray = [];

    if (isStatus === "lost") {
      workStatusArray = ["rejected_by_client", "rejected_by_company"];
    }

    if (isStatus === "waiting") {
      workStatusArray = [
        "postponed_by_company",
        "postponed_by_client",
        "hold_by_company",
        "hold_by_client",
      ];
    }

    //  Base filter
    const filter = {
      work_status: { $in: workStatusArray },
    };

    //  Type based filter
    // type missing OR type=self  → self data
    if (!type || type.toLowerCase() === "self") {
      filter.assigned_to = userId;
    }

    if (type.toLowerCase() === "team") {
      filter.assigned_by = userId;
      filter.assigned_to = { $ne: userId };
    }

    //  Query
    const [data, total] = await Promise.all([
      DesignAssigned.find(filter)
        .populate("design_request_id")
        .populate("assigned_to")
        .populate("assigned_by")
        .populate("branch_id")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),

      DesignAssigned.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      isStatus,
      type,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};
