import mongoose from "mongoose";
import ApiError from "../../../../utils/master/ApiError.js";
import MonthlyTarget from "../../models/target/monthlyTarget.model.js";
import User from "../../../HR/models/masters/user.model.js";
import SlotTarget from "../../models/target/slotTarget.model.js";


export const assignMonthlyTarget = async (req, res, next) => {
  try {
    if (!req.body) {
      return next(new ApiError(400, "Request body missing"));
    }

    const {
      executiveId,
      managerId,
      financialYear,
      quarter,
      month,
      monthlyTarget,
      remark
    } = req.body;

    if (!mongoose.isValidObjectId(executiveId)) {
      return next(new ApiError(400, "Invalid executiveId"));
    }
    if (!mongoose.isValidObjectId(managerId)) {
      return next(new ApiError(400, "Invalid managerId"));
    }

    const executive = await User.findOne({
      _id: executiveId,
      status: "Active"
    });

    if (!executive) {
      return next(new ApiError(404, "Sales executive not found"));
    }

    const manager = await User.findOne({
      _id: managerId,
      status: "Active"
    });

    if (!manager) {
      return next(new ApiError(404, "Manager not found"));
    }

    if (!financialYear || !quarter || !month) {
      return next(new ApiError(400, "FY, quarter and month are required"));
    }

    if (!monthlyTarget || Number(monthlyTarget) <= 0) {
      return next(new ApiError(400, "Monthly target must be positive"));
    }

    const existing = await MonthlyTarget.findOne({
      executiveId,
      financialYear,
      quarter,
      month,
      status: { $in: ["assigned", "in_progress", "under_review"] }
    });

    if (existing) {
      return next(new ApiError(400, "Target already assigned for this period"));
    }

    const doc = await MonthlyTarget.create({
      executiveId,
      managerId,
      financialYear,
      quarter,
      month,
      monthlyTarget,
      remark: remark || "",
      status: "assigned",
      assignedAt: new Date()
    });

    return res.api(201, "Monthly target assigned", doc);
  } catch (err) {
    if (err.name === "ValidationError") {
      const msg = Object.values(err.errors).map(e => e.message).join(", ");
      return next(new ApiError(400, msg));
    }
    return next(new ApiError(500, err.message));
  }
};

export const getTargetDetails = async (req, res, next) => {
  try {
    const { executiveId, financialYear, quarter, month } = req.query;

    if (!executiveId || !financialYear || !quarter || !month) {
      return next(
        new ApiError(400, "executiveId, financialYear, quarter, and month are required")
      );
    }

    if (!mongoose.isValidObjectId(executiveId)) {
      return next(new ApiError(400, "Invalid executiveId"));
    }

    const executive = await User.findOne({
      _id: executiveId,
      status: "Active"
    });

    if (!executive) {
      return next(new ApiError(404, "Sales executive not found"));
    }

    const query = {
      executiveId,
      financialYear,
      quarter,
      month
    };

    const monthlyTargets = await MonthlyTarget.find(query)
      .populate("executiveId", "name email phone role")
      .populate("managerId", "name email phone role")
      .sort({ createdAt: -1 })
      .lean();

    if (monthlyTargets.length === 0) {
      return res.api(200, "No targets found", []);
    }

    // IDs to fetch only relevant slotTargets
    const monthlyTargetIds = monthlyTargets.map(t => t._id);

    const slotTargets = await SlotTarget.find({
      monthlyTargetId: { $in: monthlyTargetIds },
      month,
      quarter,
      financialYear,
      executiveId
    })
      .sort({ slot: 1 })
      .lean();

    // Attach slotTargets inside monthlyTargets
    const merged = monthlyTargets.map(t => {
      return {
        ...t,
        slotTargets: slotTargets.filter(s => s.monthlyTargetId.toString() === t._id.toString())
      };
    });

    return res.api(200, "Target details fetched", merged);

  } catch (err) {
    console.log(err);
    return next(new ApiError(500, err.message));
  }
};

export const getTargetsByDepartment = async (req, res, next) => {
  try {
    const { departmentId, financialYear, quarter, month } = req.query;

    // ---------- Basic validation ----------
    if (!departmentId || !financialYear || !quarter || !month) {
      return next(
        new ApiError(
          400,
          "departmentId, financialYear, quarter, month are required"
        )
      );
    }

    if (!mongoose.isValidObjectId(departmentId)) {
      return next(new ApiError(400, "Invalid departmentId"));
    }

    const validQuarters = ["Q1", "Q2", "Q3", "Q4"];
    if (!validQuarters.includes(quarter)) {
      return next(new ApiError(400, "Invalid quarter"));
    }

    if (typeof financialYear !== "string" || !financialYear.includes("-")) {
      return next(new ApiError(400, "Invalid financialYear format"));
    }

    // ---------- Fetch employees ----------
    const employees = await User.find({
      department: departmentId,
      status: "Active",
    }).select("_id name email phone role");

    if (!employees.length) {
      return res.api(200, "No employees found", []);
    }

    const employeeIds = employees.map(e => e._id);

    // ---------- Fetch monthly targets ----------
    const monthlyTargets = await MonthlyTarget.find({
      executiveId: { $in: employeeIds },
      financialYear,
      quarter,
      month
    })
      .populate("executiveId", "name email phone role")
      .populate("managerId", "name email phone role")
      .lean();

    // ---------- Map targets by executiveId ----------
    const targetMap = new Map();
    monthlyTargets.forEach(t => {
      targetMap.set(t.executiveId._id.toString(), t);
    });

    // ---------- Fetch slot targets (only if targets exist) ----------
    let slotTargets = [];
    if (monthlyTargets.length) {
      const monthlyTargetIds = monthlyTargets.map(t => t._id);

      slotTargets = await SlotTarget.find({
        monthlyTargetId: { $in: monthlyTargetIds },
        financialYear,
        quarter,
        month
      })
        .sort({ slot: 1 })
        .lean();
    }

    // ---------- Final LEFT JOIN response ----------
    const response = employees.map(emp => {
      const target = targetMap.get(emp._id.toString());

      return {
        executiveId: emp,
        financialYear,
        quarter,
        month,

        monthlyTarget: target ? target.monthlyTarget : 0,
        achieved: target?.achieved || 0,
        status: target ? target.status : "not_assigned",
        managerId: target ? target.managerId : null,
        assignedAt: target ? target.assignedAt : null,

        slotTargets: target
          ? slotTargets.filter(
              s => s.monthlyTargetId.toString() === target._id.toString()
            )
          : []
      };
    });

    return res.api(200, "Department targets fetched", response);

  } catch (err) {
    console.error(err);
    return next(new ApiError(500, err.message));
  }
};

export const getTargetAchievementSummary = async (req, res, next) => {
  try {
    const {
      executiveId,
      financialYear,
      quarter,
      month,
      filter
    } = req.query;

    if (!mongoose.isValidObjectId(executiveId)) {
      return next(new ApiError(400, "Invalid executiveId"));
    }

    const slotMatch = {
      executiveId: new mongoose.Types.ObjectId(executiveId),
      financialYear
    };

    // ---- Filter logic ----
    if (filter === "month" && quarter && month) {
      slotMatch.quarter = quarter;
      slotMatch.month = month;
    }

    if (filter === "quarter" && quarter) {
      slotMatch.quarter = quarter;
    }

    if (filter === "today") {
      const today = new Date();
      slotMatch.slotStartDate = { $lte: today };
      slotMatch.slotEndDate = { $gte: today };
    }

    // ---- Get all slot records for detailed breakdown ----
    const slotRecords = await SlotTarget.find(slotMatch).lean();

    // Calculate detailed breakdown
    const breakdown = {
      lead: { target: 0, ach: 0, count: 0, records: [] },
      sales: { target: 0, ach: 0, count: 0, records: [] },
      business: { target: 0, ach: 0, count: 0, records: [] },
      amount: { target: 0, ach: 0, count: 0, records: [] }
    };

    slotRecords.forEach(record => {
      // Lead
      if (record.leadIn > 0) {
        breakdown.lead.ach += record.leadIn;
        breakdown.lead.count++;
        breakdown.lead.records.push({
          date: record.slotStartDate,
          value: record.leadIn,
          target: record.leadTarget || 0
        });
      }
      
      // Sales
      if (record.salesIn > 0) {
        breakdown.sales.ach += record.salesIn;
        breakdown.sales.count++;
        breakdown.sales.records.push({
          date: record.slotStartDate,
          value: record.salesIn,
          target: record.salesTarget || 0
        });
      }
      
      // Business
      if (record.businessIn > 0) {
        breakdown.business.ach += record.businessIn;
        breakdown.business.count++;
        breakdown.business.records.push({
          date: record.slotStartDate,
          value: record.businessIn,
          target: record.businessTarget || 0
        });
      }
      
      // Amount
      if (record.amountIn > 0) {
        breakdown.amount.ach += record.amountIn;
        breakdown.amount.count++;
        breakdown.amount.records.push({
          date: record.slotStartDate,
          value: record.amountIn,
          target: 0 // Amount target is from MonthlyTarget
        });
      }
    });

    // ---- Get target from MonthlyTarget ----
    const monthlyTarget = await MonthlyTarget.findOne({
      executiveId,
      financialYear,
      ...(quarter && { quarter }),
      ...(month && { month })
    }).lean();

    // Calculate targets (assuming you have these fields in SlotTarget)
    const slotTargets = await SlotTarget.aggregate([
      { $match: slotMatch },
      {
        $group: {
          _id: null,
          leadTarget: { $sum: "$leadTarget" || 0 },
          salesTarget: { $sum: "$salesTarget" || 0 },
          businessTarget: { $sum: "$businessTarget" || 0 }
        }
      }
    ]);

    const result = {
      summary: {
        leadTarget: slotTargets[0]?.leadTarget || 0,
        salesTarget: slotTargets[0]?.salesTarget || 0,
        businessTarget: slotTargets[0]?.businessTarget || 0,
        amountTarget: monthlyTarget?.monthlyTarget || 0,

        leadAch: breakdown.lead.ach,
        salesAch: breakdown.sales.ach,
        businessAch: breakdown.business.ach,
        amountAch: breakdown.amount.ach
      },
      
      counts: {
        leadCount: breakdown.lead.count,
        salesCount: breakdown.sales.count,
        businessCount: breakdown.business.count,
        amountCount: breakdown.amount.count
      },
      
      percentages: {
        leadPercent: slotTargets[0]?.leadTarget 
          ? (breakdown.lead.ach / slotTargets[0].leadTarget * 100).toFixed(2)
          : 0,
        salesPercent: slotTargets[0]?.salesTarget 
          ? (breakdown.sales.ach / slotTargets[0].salesTarget * 100).toFixed(2)
          : 0,
        businessPercent: slotTargets[0]?.businessTarget 
          ? (breakdown.business.ach / slotTargets[0].businessTarget * 100).toFixed(2)
          : 0,
        amountPercent: monthlyTarget?.monthlyTarget 
          ? (breakdown.amount.ach / monthlyTarget.monthlyTarget * 100).toFixed(2)
          : 0
      },
      
      // Detailed breakdown (optional)
      breakdown: breakdown
    };

    return res.api(200, "Summary fetched", result);

  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};