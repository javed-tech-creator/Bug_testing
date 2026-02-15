import mongoose from "mongoose";
import ApiError from "../../../../utils/master/ApiError.js";
import DesignRequested from "../../models/manager/designRequested.model.js";
import DesignEventLog from "../../models/common_schema/EventsLogs.model.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";
// import ProjectEventLog from "../../../../sales/models/projectEventLogs.js";

/**
 * CREATE Design Requested
 * Manager receives recce and creates design request
 */
export const createDesignRequested = async (req, res, next) => {
  try {
    const {
      recce_id,
      product_id,
      project_id,
      client_id,
      send_by,
      branch_id,
      role,
    } = req.body;

    /* -------------------- BASIC VALIDATION -------------------- */

    if (!recce_id || !product_id || !project_id || !client_id) {
      return next(
        new ApiError(
          400,
          "recce_id, product_id, project_id and client_id are required",
        ),
      );
    }

    if (!send_by) {
      return next(new ApiError(401, "Unauthorized request"));
    }

    const objectIdsToValidate = [
      recce_id,
      product_id,
      project_id,
      client_id,
      branch_id,
    ];

    for (let id of objectIdsToValidate) {
      if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return next(new ApiError(400, "Invalid reference id provided"));
      }
    }

    /* -------------------- PREVENT DUPLICATE REQUEST -------------------- */

    const alreadyExists = await DesignRequested.findOne({
      recce_id,
      product_id,
      is_active: true,
    });

    if (alreadyExists) {
      return next(
        new ApiError(400, "Design request already exists for this product"),
      );
    }

    /* -------------------- CREATE DESIGN REQUEST -------------------- */

    const designDoc = await DesignRequested.create({
      recce_id,
      send_by,
      product_id,
      project_id,
      client_id,
      branch_id,
    });

    /* -------------------- CREATE EVENT LOG -------------------- */

    // await DesignEventLog.create({
    //   design_id: designDoc._id,
    //   product_id,
    //   events: [
    //     {
    //       performed_by: send_by,
    //       performed_role: role,
    //       action_type: "design_requested",
    //       message: "Design request created",
    //     },
    //   ],
    // });

    /* -------------------- RESPONSE -------------------- */

    return res.status(201).json({
      success: true,
      message: "Design request created successfully",
      data: {
        design_id: designDoc.design_id, // e.g. DGN-25001
        recce_id: designDoc.recce_id,
        product_id: designDoc.product_id,
        request_date: designDoc.createdAt,
      },
    });
  } catch (error) {
    console.error("Create DesignRequested Error:", error);
    return next(new ApiError(500, error.message));
  }
};

// manager side pending, accepted, decline, flag fetch list data
export const getFilteredDesignRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, decision = "pending" } = req.query; // pending, accepted, decline, flag

    const branch_id = req.user?.branch?._id.toString();
    /* -------------------- VALIDATION -------------------- */
    if (!branch_id) {
      return next(new ApiError(400, "branch_id is required"));
    }

    if (!mongoose.Types.ObjectId.isValid(branch_id)) {
      return next(new ApiError(400, "Invalid branch_id"));
    }

    const allowedDecisions = ["pending", "accepted", "decline", "flag"];

    if (!allowedDecisions.includes(decision)) {
      return next(
        new ApiError(
          400,
          "Invalid decision. Allowed: pending, accepted, decline, flag",
        ),
      );
    }

    const pageNumber = Math.max(parseInt(page), 1);
    const pageSize = Math.min(parseInt(limit), 25); // safety cap
    const skip = (pageNumber - 1) * pageSize;

    /* -------------------- FILTER -------------------- */
    const filter = {
      branch_id,
      mark_as_started: false,
      "feedback_panel.final_decision": decision,

      //  ASSIGNED DESIGN EXCLUDE
      current_assigned_executive: null,
    };

    /* -------------------- QUERY -------------------- */
    const [data, total] = await Promise.all([
      DesignRequested.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate("recce_id")
        .populate("product_id")
        .populate("project_id")
        .populate("client_id"),

      DesignRequested.countDocuments(filter),
    ]);

    /* -------------------- RESPONSE -------------------- */
    return res.api(200, `${decision} design requests fetched successfully`, {
      meta: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      data,
    });
  } catch (error) {
    console.error(`Get ${decision} DesignRequests Error:`, error);
    return next(new ApiError(500, "Internal server error"));
  }
};

// manager fetch all self and team assigned design list data
export const getAllAssignedDesigns = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, assignment_type } = req.query;

    const branch_id = req.user?.branch?._id?.toString();
    const managerId = req.user?._id?.toString();

    /* ---------------- VALIDATION ---------------- */
    if (!branch_id || !managerId) {
      return next(new ApiError(400, "branch_id or managerId missing"));
    }

    if (!mongoose.Types.ObjectId.isValid(branch_id)) {
      return next(new ApiError(400, "Invalid branch_id"));
    }

    const allowedTypes = ["self", "team"];
    if (assignment_type && !allowedTypes.includes(assignment_type)) {
      return next(
        new ApiError(400, "Invalid assignment_type. Allowed: self, team"),
      );
    }

    const pageNumber = Math.max(parseInt(page), 1);
    const pageSize = Math.min(parseInt(limit), 25);
    const skip = (pageNumber - 1) * pageSize;

    /* ---------------- FILTER ---------------- */
    const filter = {
      branch_id,
      is_active: true,
    };

    if (assignment_type === "self") {
      filter.assignment_type = "self";
      filter.assigned_to = managerId;
    }

    if (assignment_type === "team") {
      filter.assignment_type = "executive";
      // manager filter intentionally skipped
    }

    /* ---------------- QUERY ---------------- */
    const [data, total] = await Promise.all([
      DesignAssigned.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate({
          path: "design_request_id",
          populate: [
            { path: "product_id" },
            { path: "project_id" },
            { path: "client_id" },
          ],
        })
        .populate("assigned_to", "name"),
      DesignAssigned.countDocuments(filter),
    ]);

    /* ---------------- RESPONSE ---------------- */
    return res.api(200, "Assigned designs fetched successfully", {
      meta: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      data,
    });
  } catch (error) {
    console.error("Get Assigned Designs Error:", error);
    return next(new ApiError(500, "Internal server error"));
  }
};
