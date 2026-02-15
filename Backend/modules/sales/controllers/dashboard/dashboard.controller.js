import ApiError from "../../../../utils/master/ApiError.js";
import Lead from "../../models/lead.model.js";
import User from "../../../HR/models/masters/user.model.js";
import Client from "../../models/client.model.js";
import ClientPayment from "../../models/payment/clientPayment.model.js";
import Payment from "../../models/payment/payment.model.js";
import ClientQuotation from "../../models/clientQuotation.model.js";

const getDateRangeByType = (type) => {
  const now = new Date();
  let start, end;

  if (type === "week") {
    const day = now.getDay() || 7; // Sunday = 7
    start = new Date(now);
    start.setDate(now.getDate() - day + 1);
    start.setHours(0, 0, 0, 0);

    end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  }

  if (type === "month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  if (type === "year") {
    const year =
      now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    start = new Date(year, 3, 1); // April 1
    end = new Date(year + 1, 2, 31, 23, 59, 59, 999); // March 31
  }

  return start && end ? { $gte: start, $lte: end } : null;
};

const buildUserMatch = async (req) => {
  const user = await User.findById(req.user._id)
    .populate("designation", "title")
    .select("designation department");

  if (!user) throw new Error("User not found");

  if (user.designation?.title === "Sales Team Lead") {
    const deptUsers = await User.find({
      department: user.department,
    }).select("_id");

    return {
      userIds: deptUsers.map((u) => u._id),
      isManager: true,
    };
  }
  return {
    userIds: [req.user._id],
    isManager: false,
  };
};

const buildDateRange = (period) => {
  const now = new Date();
  let start, end;

  switch (period) {
    case "today":
      start = new Date(now.setHours(0,0,0,0));
      end = new Date(now.setHours(23,59,59,999));
      break;

    case "yesterday":
      start = new Date(now);
      start.setDate(start.getDate() - 1);
      start.setHours(0,0,0,0);

      end = new Date(start);
      end.setHours(23,59,59,999);
      break;

    case "week": {
      const day = now.getDay() || 7;
      start = new Date(now);
      start.setDate(now.getDate() - day + 1);
      start.setHours(0,0,0,0);

      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23,59,59,999);
      break;
    }

    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth()+1, 0, 23,59,59,999);
      break;

    case "year": {
      const fy = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
      start = new Date(fy, 3, 1);
      end = new Date(fy+1, 2, 31, 23,59,59,999);
      break;
    }
  }

  return { start, end };
};

// export const getDashboardStats = async (req, res, next) => {
//   try {
//     const userId = req?.user?._id || "68f23416457c69f93a1618c6";
//     const { startDate, endDate } = req.query;

//     // Date filters
//     const dateFilter = {};
//     if (startDate || endDate) {
//       dateFilter.createdAt = {};
//       if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
//       if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
//     }

//     // Common base match
//     const baseMatch = { isDeleted: false, ...dateFilter };

//     // Multiple parallel aggregations for performance
//     const [userLeadsAggregate, allLeadsAggregate, revenueData, wonLeadsData] =
//       await Promise.all([
//         Lead.aggregate([
//           {
//             $match: {
//               ...baseMatch,
//               $or: [
//                 { dealBy: userId },
//                 { "assignTo.userId": userId },
//                 { leadBy: userId },
//               ],
//             },
//           },
//           {
//             $facet: {
//               assigned: [{ $match: { isAssign: true } }, { $count: "count" }],
//               qualified: [
//                 { $match: { leadStatus: "INTERESTED" } },
//                 { $count: "count" },
//               ],
//               lost: [
//                 { $match: { leadStatus: "NOT INTERESTED" } },
//                 { $count: "count" },
//               ],
//               closedDeals: [
//                 {
//                   $match: {
//                     leadStatus: "INTERESTED",
//                     dealBy: { $exists: true, $ne: null },
//                   },
//                 },
//                 { $count: "count" },
//               ],
//               totalUserLeads: [{ $count: "count" }],
//             },
//           },
//         ]),

//         // All leads in system (for total assigned, won leads)
//         Lead.aggregate([
//           { $match: baseMatch },
//           {
//             $facet: {
//               totalAssigned: [
//                 { $match: { isAssign: true } },
//                 { $count: "count" },
//               ],
//               wonLeads: [
//                 {
//                   $match: {
//                     leadStatus: "INTERESTED",
//                     dealBy: { $exists: true, $ne: null },
//                   },
//                 },
//                 { $count: "count" },
//               ],
//               totalLeads: [{ $count: "count" }],
//             },
//           },
//         ]),

//         // Revenue related calculations
//         Lead.aggregate([
//           {
//             $match: {
//               ...baseMatch,
//               leadStatus: "INTERESTED",
//               dealBy: { $exists: true, $ne: null },
//             },
//           },
//           {
//             $group: {
//               _id: null,
//               totalRevenue: {
//                 $sum: {
//                   $cond: [
//                     { $ifNull: ["$expectedBusiness", false] },
//                     { $toDouble: "$expectedBusiness" },
//                     4950, // Default value if expectedBusiness not set
//                   ],
//                 },
//               },
//               avgDealValue: { $avg: { $toDouble: "$expectedBusiness" } },
//               count: { $sum: 1 },
//             },
//           },
//         ]),

//         // Expected revenue from qualified leads
//         Lead.aggregate([
//           {
//             $match: {
//               ...baseMatch,
//               leadStatus: "INTERESTED",
//             },
//           },
//           {
//             $group: {
//               _id: null,
//               expectedRevenue: {
//                 $sum: {
//                   $cond: [
//                     { $ifNull: ["$expectedBusiness", false] },
//                     { $toDouble: "$expectedBusiness" },
//                     4950, // Default value
//                   ],
//                 },
//               },
//               count: { $sum: 1 },
//             },
//           },
//         ]),
//       ]);

//     const userData = userLeadsAggregate[0] || {};
//     const allLeadsData = allLeadsAggregate[0] || {};
//     const revenueStats = revenueData[0] || {};
//     const expectedRevenueStats = wonLeadsData[0] || {};

//     // Extract counts with defaults
//     const assignedLeads = allLeadsData.totalAssigned?.[0]?.count || 0;
//     const qualifiedLeads = userData.qualified?.[0]?.count || 0;
//     const lostLeads = userData.lost?.[0]?.count || 0;
//     const closedDeals = userData.closedDeals?.[0]?.count || 0;
//     const totalUserLeads = userData.totalUserLeads?.[0]?.count || 0;
//     const totalLeads = allLeadsData.totalLeads?.[0]?.count || 0;
//     const wonLeads = allLeadsData.wonLeads?.[0]?.count || 0;

//     // Calculations
//     const conversionRate =
//       totalUserLeads === 0
//         ? 0
//         : Number(((qualifiedLeads / totalUserLeads) * 100).toFixed(1));

//     const totalRevenue = revenueStats.totalRevenue || closedDeals * 4950;
//     const expectedRevenue =
//       expectedRevenueStats.expectedRevenue || qualifiedLeads * 4950;

//     // Incentive calculations (10% of revenue)
//     const incentiveRate = 0.1;
//     const totalIncentives = totalRevenue * incentiveRate;
//     const expectedIncentive = expectedRevenue * incentiveRate;

//     // Format currency values in lakhs
//     const formatInLakhs = (value) => {
//       const inLakhs = value / 100000;
//       return `₹${inLakhs.toFixed(1)}L`;
//     };

//     return res.api(200, "Dashboard stats fetched successfully", {
//       // Main metrics
//       assignedLeads: assignedLeads.toLocaleString(),
//       qualifiedLeads: qualifiedLeads.toLocaleString(),
//       conversionRate: `${conversionRate}%`,
//       lostLeads: lostLeads.toLocaleString(),
//       closedDeals: closedDeals.toLocaleString(),
//       wonLeads: wonLeads.toLocaleString(),

//       // Financial metrics
//       totalIncentives: formatInLakhs(totalIncentives),
//       totalRevenue: formatInLakhs(totalRevenue),
//       expectedRevenue: formatInLakhs(expectedRevenue),
//       expectedIncentive: formatInLakhs(expectedIncentive),

//       // Additional insights
//       totalUserLeads,
//       avgDealValue: revenueStats.avgDealValue
//         ? `₹${Math.round(revenueStats.avgDealValue).toLocaleString()}`
//         : "₹4,950",
//       successRate:
//         totalLeads > 0
//           ? `${((wonLeads / totalLeads) * 100).toFixed(1)}%`
//           : "0%",
//     });
//   } catch (err) {
//     return next(new ApiError(500, err.message));
//   }
// };

export const getDashboardStats = async (req, res, next) => {
  try {
    // Build userIds & role info
    const { userIds, isManager } = await buildUserMatch(req);

    // Base match without date filter (all-time)
    const baseMatch = { isDeleted: false };

    // User-specific match
    const userMatch = {
      $or: [
        { dealBy: { $in: userIds } },
        { "assignTo.userId": { $in: userIds } },
        { leadBy: { $in: userIds } },
      ],
    };

    // Assigned leads filter (TL → dept total, user → own)
    const assignedLeadMatch = isManager
      ? { isAssign: true }
      : { isAssign: true, "assignTo.userId": req.user._id };

    // Parallel aggregations
    const [userLeadsAggregate, assignedLeadsAgg, revenueData, expectedRevenueData] =
      await Promise.all([
        // User-specific leads
        Lead.aggregate([
          { $match: { ...baseMatch, ...userMatch } },
          {
            $facet: {
              qualified: [{ $match: { leadStatus: "INTERESTED" } }, { $count: "count" }],
              lost: [{ $match: { leadStatus: "NOT INTERESTED" } }, { $count: "count" }],
              closedDeals: [
                { $match: { leadStatus: "INTERESTED", dealBy: { $in: userIds } } },
                { $count: "count" },
              ],
              totalUserLeads: [{ $count: "count" }],
            },
          },
        ]),

        // Assigned leads (user/manager)
        Lead.aggregate([{ $match: { ...baseMatch, ...assignedLeadMatch } }, { $count: "count" }]),

        // Revenue (closed deals)
        Lead.aggregate([
          {
            $match: {
              ...baseMatch,
              leadStatus: "INTERESTED",
              dealBy: { $in: userIds },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: {
                $sum: {
                  $cond: [
                    { $ifNull: ["$expectedBusiness", false] },
                    { $toDouble: "$expectedBusiness" },
                    4950,
                  ],
                },
              },
              avgDealValue: { $avg: { $toDouble: "$expectedBusiness" } },
              count: { $sum: 1 },
            },
          },
        ]),

        // Expected revenue (qualified leads)
        Lead.aggregate([
          { $match: { ...baseMatch, leadStatus: "INTERESTED", dealBy: { $in: userIds } } },
          {
            $group: {
              _id: null,
              expectedRevenue: {
                $sum: {
                  $cond: [
                    { $ifNull: ["$expectedBusiness", false] },
                    { $toDouble: "$expectedBusiness" },
                    4950,
                  ],
                },
              },
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

    const userData = userLeadsAggregate[0] || {};
    const assignedLeads = assignedLeadsAgg[0]?.count || 0;
    const revenueStats = revenueData[0] || {};
    const expectedRevenueStats = expectedRevenueData[0] || {};

    // Metrics
    const qualifiedLeads = userData.qualified?.[0]?.count || 0;
    const lostLeads = userData.lost?.[0]?.count || 0;
    const closedDeals = userData.closedDeals?.[0]?.count || 0;
    const totalUserLeads = userData.totalUserLeads?.[0]?.count || 0;

    const conversionRate =
      totalUserLeads === 0 ? 0 : Number(((qualifiedLeads / totalUserLeads) * 100).toFixed(1));

    const totalRevenue = revenueStats.totalRevenue || closedDeals * 4950;
    const expectedRevenue = expectedRevenueStats.expectedRevenue || qualifiedLeads * 4950;

    const incentiveRate = 0.1;
    const totalIncentives = totalRevenue * incentiveRate;
    const expectedIncentive = expectedRevenue * incentiveRate;

    const formatInLakhs = (value) => `₹${(value / 100000).toFixed(1)}L`;

    return res.api(200, "Dashboard stats fetched successfully", {
      assignedLeads: assignedLeads.toLocaleString(),
      qualifiedLeads: qualifiedLeads.toLocaleString(),
      conversionRate: `${conversionRate}%`,
      lostLeads: lostLeads.toLocaleString(),
      closedDeals: closedDeals.toLocaleString(),
      wonLeads: closedDeals.toLocaleString(),
      totalUserLeads,
      totalRevenue: formatInLakhs(totalRevenue),
      expectedRevenue: formatInLakhs(expectedRevenue),
      totalIncentives: formatInLakhs(totalIncentives),
      expectedIncentive: formatInLakhs(expectedIncentive),
      avgDealValue: revenueStats.avgDealValue
        ? `₹${Math.round(revenueStats.avgDealValue).toLocaleString()}`
        : "₹4,950",
      successRate:
        totalUserLeads > 0
          ? `${((closedDeals / totalUserLeads) * 100).toFixed(1)}%`
          : "0%",
    });
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getExecutivePerformance = async (req, res, next) => {
  try {
    const { type = "week" } = req.query;

    const allowedTypes = ["week", "month", "year"];

    if (!allowedTypes.includes(type)) {
      return next(new ApiError(400, "Invalid type"));
    }

    const dateRange = getDateRangeByType(type);

    const userId = req.user._id;

    const user = await User.findById(userId).select("_id department");
    if (!user?.department) {
      return next(new ApiError(400, "Manager department not found"));
    }

    const deptUsers = await User.find({
      department: user.department,
    }).select("_id name email");

    const userIds = deptUsers.map((u) => u._id);

    const match = {
      isDeleted: false,
      leadStatus: "INTERESTED",
      $or: [
        { leadBy: { $in: userIds } },
        { "assignTo.userId": { $in: userIds } },
      ],
    };

    if (dateRange) {
      match.createdAt = dateRange;
    }

    const data = await Lead.aggregate([
      { $match: match },
      {
        $addFields: {
          expectedAmount: {
            $cond: [
              { $ifNull: ["$expectedBusiness", false] },
              { $toDouble: "$expectedBusiness" },
              0,
            ],
          },
        },
      },
      {
        $project: {
          contributors: {
            $setUnion: [["$leadBy"], "$assignTo.userId"],
          },
          expectedAmount: 1,
        },
      },
      { $unwind: "$contributors" },
      {
        $group: {
          _id: "$contributors",
          revenue: { $sum: "$expectedAmount" },
        },
      },
      { $sort: { revenue: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          name: "$user.name",
          email: "$user.email",
          revenue: 1,
        },
      },
    ]);

    const formatLakhs = (v) => `₹${(v / 100000).toFixed(1)}L`;

    const result = data.map((d) => ({
      name: d.name,
      email: d.email,
      revenue: formatLakhs(d.revenue),
      status:
        d.revenue >= 400000
          ? "Excellent"
          : d.revenue >= 200000
          ? "Good"
          : "Average",
    }));

    return res.api(200, "Executive performance fetched", result, {
      dateRange: type,
    });
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getMonthlyLeadPerformanceFY = async (req, res, next) => {
  try {
    const now = new Date();
    const fyStartYear =
      now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;

    const fyStart = new Date(fyStartYear, 3, 1);
    const fyEnd = new Date(fyStartYear + 1, 2, 31, 23, 59, 59, 999);

    const rawData = await Lead.aggregate([
      {
        $match: {
          isDeleted: false,
          leadStatus: { $in: ["INTERESTED", "NOT INTERESTED"] },
          createdAt: { $gte: fyStart, $lte: fyEnd },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            status: "$leadStatus",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const months = [
      { key: 4, label: "Apr" },
      { key: 5, label: "May" },
      { key: 6, label: "Jun" },
      { key: 7, label: "Jul" },
      { key: 8, label: "Aug" },
      { key: 9, label: "Sep" },
      { key: 10, label: "Oct" },
      { key: 11, label: "Nov" },
      { key: 12, label: "Dec" },
      { key: 1, label: "Jan" },
      { key: 2, label: "Feb" },
      { key: 3, label: "Mar" },
    ];

    const result = months.map((m) => {
      const won =
        rawData.find(
          (d) => d._id.month === m.key && d._id.status === "INTERESTED"
        )?.count || 0;

      const lost =
        rawData.find(
          (d) => d._id.month === m.key && d._id.status === "NOT INTERESTED"
        )?.count || 0;

      return {
        month: m.label,
        won,
        lost,
      };
    });

    return res.api(200, "Monthly performance fetched", result);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getLeadAnalytics = async (req, res, next) => {
  try {
    const { type = "month" } = req.query;
    const dateRange = getDateRangeByType(type);

    const { userIds } = await buildUserMatch(req);

    const match = {
      isDeleted: false,
      $or: [
        { leadBy: { $in: userIds } },
        { "assignTo.userId": { $in: userIds } },
      ],
    };

    if (dateRange) match.createdAt = dateRange;

    const data = await Lead.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$leadLabel",
          count: { $sum: 1 },
        },
      },
    ]);

    const labels = ["HOT", "WARM", "COLD", "UNTOUCHED"];

    const result = labels.map((label) => ({
      label,
      count: data.find((d) => d._id === label)?.count || 0,
    }));

    return res.api(200, "Lead analytics fetched", result);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getLeadSourceMonthlyFY = async (req, res, next) => {
  const LEAD_SOURCES = [
    "WEBSITE",
    "PHONE",
    "EMAIL",
    "JUSTDIAL",
    "INDIAMART",
    "INSTAGRAM",
    "FACEBOOK",
    "PARTNER",
    "VENDOR",
    "FREELANCER",
    "FRANCHISE",
    "OTHER",
  ];

  try {
    const { userIds, isManager } = await buildUserMatch(req);
    const { type = "all" } = req.query; // all | self | assigned

    const now = new Date();
    const fyStartYear =
      now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;

    const fyStart = new Date(fyStartYear, 3, 1);
    const fyEnd = new Date(fyStartYear + 1, 2, 31, 23, 59, 59, 999);

    // 🔑 user filter (manager = ALL leads)
    let userFilter = {};

    if (!isManager) {
      if (type === "self") {
        userFilter = { leadBy: { $in: userIds } };
      } else if (type === "assigned") {
        userFilter = { "assignTo.userId": { $in: userIds } };
      } else {
        userFilter = {
          $or: [
            { leadBy: { $in: userIds } },
            { "assignTo.userId": { $in: userIds } },
          ],
        };
      }
    }

    const rawData = await Lead.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: { $gte: fyStart, $lte: fyEnd },
          ...userFilter, // empty for manager
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            source: "$leadSource",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const months = [
      { key: 4, label: "Apr" },
      { key: 5, label: "May" },
      { key: 6, label: "Jun" },
      { key: 7, label: "Jul" },
      { key: 8, label: "Aug" },
      { key: 9, label: "Sep" },
      { key: 10, label: "Oct" },
      { key: 11, label: "Nov" },
      { key: 12, label: "Dec" },
      { key: 1, label: "Jan" },
      { key: 2, label: "Feb" },
      { key: 3, label: "Mar" },
    ];

    const result = months.map((m) => {
      const row = { month: m.label };
      LEAD_SOURCES.forEach((source) => {
        row[source] =
          rawData.find((d) => d._id.month === m.key && d._id.source === source)
            ?.count || 0;
      });
      return row;
    });

    return res.api(200, "Lead source analytics fetched", {
      type: isManager ? "all" : type,
      isManager,
      sources: LEAD_SOURCES,
      data: result,
    });
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getLostLeadExpectedAmount = async (req, res, next) => {
  try {
    const {
      period = "week",
      label = "all",
      source = "ALL",
      startDate,
      endDate,
    } = req.query;

    const allowedPeriods = ["today", "week", "month", "year", "custom"];
    const allowedLabels = ["all", "HOT", "WARM", "COLD"];

    if (!allowedPeriods.includes(period)) {
      return next(new ApiError(400, "Invalid period"));
    }

    if (!allowedLabels.includes(label)) {
      return next(new ApiError(400, "Invalid lead label"));
    }

    const { userIds } = await buildUserMatch(req);

    const now = new Date();
    let start;
    let end;

    switch (period) {
      case "today":
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
        break;

      case "week": {
        const day = now.getDay() || 7;
        start = new Date();
        start.setDate(now.getDate() - day + 1);
        start.setHours(0, 0, 0, 0);

        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      }

      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        break;

      case "year":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;

      case "custom":
        if (!startDate || !endDate) {
          return next(new ApiError(400, "Custom date range required"));
        }

        start = new Date(startDate);
        end = new Date(endDate);

        const diffDays = (end - start) / (1000 * 60 * 60 * 24);

        if (diffDays < 0 || diffDays > 365) {
          return next(new ApiError(400, "Custom range must be within 1 year"));
        }

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
    }

    const match = {
      isDeleted: false,
      leadStatus: "NOT INTERESTED",
      createdAt: { $gte: start, $lte: end },
      $or: [
        { leadBy: { $in: userIds } },
        { "assignTo.userId": { $in: userIds } },
      ],
    };

    if (label !== "all") {
      match.leadLabel = label;
    }

    if (source !== "ALL") {
      match.leadSource = source;
    }

    let groupBy;

    if (period === "today") {
      groupBy = { hour: { $hour: "$createdAt" } };
    } else if (period === "week") {
      groupBy = { day: { $dayOfWeek: "$createdAt" } };
    } else if (period === "month") {
      groupBy = { date: { $dayOfMonth: "$createdAt" } };
    } else {
      groupBy = { month: { $month: "$createdAt" } };
    }

    /* ---------------- AGGREGATION ---------------- */
    const rawData = await Lead.aggregate([
      { $match: match },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.hour": 1,
          "_id.day": 1,
          "_id.date": 1,
          "_id.month": 1,
        },
      },
    ]);

    const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const MONTHS = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const result = rawData.map((d) => ({
      label:
        d._id.hour !== undefined
          ? `${d._id.hour}:00`
          : d._id.day !== undefined
          ? DAYS[d._id.day - 1]
          : d._id.date !== undefined
          ? `${d._id.date}`
          : MONTHS[d._id.month - 1],
      count: d.count,
    }));

    return res.api(200, "Lost leads fetched", {
      period,
      label,
      source,
      startDate: start,
      endDate: end,
      data: result,
    });
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getPendingClientPayments = async (req, res, next) => {
  try {
    const { status = "ALL" } = req.query;
    const data = await Client.aggregate([
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "clientId",
          as: "project",
        },
      },
      { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "clientpayments",
          let: {
            clientId: "$_id",
            projectId: "$project._id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$clientId", "$$clientId"] },
                    { $eq: ["$projectId", "$$projectId"] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                paidAmount: { $sum: "$amount" },
              },
            },
          ],
          as: "payment",
        },
      },

      {
        $addFields: {
          finalAmount: { $ifNull: ["$project.finalAmount", 0] },
          paidAmount: {
            $ifNull: [{ $arrayElemAt: ["$payment.paidAmount", 0] }, 0],
          },
        },
      },

      {
        $addFields: {
          remainingAmount: {
            $max: [{ $subtract: ["$finalAmount", "$paidAmount"] }, 0],
          },
          paymentStatus: {
            $cond: [
              { $eq: ["$paidAmount", 0] },
              "PENDING",
              {
                $cond: [
                  { $gte: ["$paidAmount", "$finalAmount"] },
                  "COMPLETED",
                  "INITIAL_DONE",
                ],
              },
            ],
          },
        },
      },
      ...(status !== "ALL" ? [{ $match: { paymentStatus: status } }] : []),
      {
        $addFields: {
          remainingPercentage: {
            $cond: [
              { $gt: ["$finalAmount", 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$remainingAmount", "$finalAmount"] },
                      100,
                    ],
                  },
                  0,
                ],
              },
              0,
            ],
          },
          displayAmount: {
            $cond: [
              { $eq: ["$paymentStatus", "COMPLETED"] },
              "$finalAmount",
              "$remainingAmount",
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          clientId: "$_id",
          projectId: "$project._id",
          clientName: "$name",
          projectName: "$project.projectName",
          displayAmount: 1,
          remainingPercentage: 1,
        },
      },

      { $sort: { remainingPercentage: -1 } },
      { $limit: 10 },
    ]);
    return res.api(200, "Client payment list fetched", data);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getTotalRevenue = async (req, res, next) => {
  try {
    const { view = "self", period = "week" } = req.query;
    const allowedView = ["self", "team"];
    const allowedPeriod = ["week", "month", "year"];

    if (!allowedView.includes(view) || !allowedPeriod.includes(period)) {
      return next(new ApiError(400, "Invalid query params"));
    }

    const user = await User.findById(req.user._id).select("department");
    if (!user) return next(new ApiError(404, "User not found"));

    let userIds = [req.user._id];

    if (view === "team") {
      const teamUsers = await User.find({
        department: user.department,
        _id: { $ne: req.user._id },
      }).select("_id");

      userIds = teamUsers.map((u) => u._id);
    }

    // Date range
    const now = new Date();
    let start, end;

    if (period === "week") {
      const day = now.getDay() || 7;
      start = new Date(now);
      start.setDate(now.getDate() - day + 1);
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    }

    if (period === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    if (period === "year") {
      const fy =
        now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
      start = new Date(fy, 3, 1);
      end = new Date(fy + 1, 2, 31, 23, 59, 59, 999);
    }

    // EXPECTED AMOUNT (Lead)
    const expected = await Lead.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: { $gte: start, $lte: end },
          $or: [
            { leadBy: { $in: userIds } },
            { "assignTo.userId": { $in: userIds } },
          ],
        },
      },
      {
        $addFields: {
          amount: {
            $cond: [
              { $ifNull: ["$expectedBusiness", false] },
              { $toDouble: "$expectedBusiness" },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id:
            period === "week"
              ? { day: { $dayOfWeek: "$createdAt" } }
              : period === "month"
              ? { day: { $dayOfMonth: "$createdAt" } }
              : { month: { $month: "$createdAt" } },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // BUSINESS AMOUNT (Payments)
    const business = await ClientPayment.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          createdBy: { $in: userIds },
        },
      },
      {
        $group: {
          _id:
            period === "week"
              ? { day: { $dayOfWeek: "$createdAt" } }
              : period === "month"
              ? { day: { $dayOfMonth: "$createdAt" } }
              : { month: { $month: "$createdAt" } },
          total: { $sum: "$totalPaid" },
        },
      },
    ]);

    return res.api(200, "Total revenue fetched", {
      expected,
      business,
      view,
      period,
    });
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getRevenueChart = async (req, res, next) => {
  try {
    const { scope = "self", period = "month" } = req.query;
    const { userIds } = await buildUserMatch(req);
    const { start, end } = buildDateRange(period);

    const bucket =
      period === "year"
        ? { $month: "$createdAt" }
        : period === "month"
        ? { $dayOfMonth: "$createdAt" }
        : { $dayOfWeek: "$createdAt" };

    /* TARGETED (Leads) */
    const targeted = await Lead.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: { $gte: start, $lte: end },
          ...(scope !== "all" && {
            $or: [
              { leadBy: { $in: userIds } },
              { "assignTo.userId": { $in: userIds } },
            ],
          }),
        },
      },
      {
        $addFields: {
          amount: { $toDouble: { $ifNull: ["$expectedBusiness", 0] } },
          bucket,
        },
      },
      {
        $group: {
          _id: "$bucket",
          total: { $sum: "$amount" },
        },
      },
    ]);

    /* COLLECTION (Payments) */
    const collection = await Payment.aggregate([
      {
        $match: {
          status: "COMPLETED",
          date: { $gte: start, $lte: end },
          ...(scope !== "all" && { createdBy: { $in: userIds } }),
        },
      },
      {
        $addFields: { bucket },
      },
      {
        $group: {
          _id: "$bucket",
          total: { $sum: "$amount" },
        },
      },
    ]);

    /* BUSINESS (Quotations) */
    const business = await ClientQuotation.aggregate([
      {
        $match: {
          status: "accepted",
          quotationDate: { $gte: start, $lte: end },
          ...(scope !== "all" && { createdBy: { $in: userIds } }),
        },
      },
      {
        $addFields: { bucket },
      },
      {
        $group: {
          _id: "$bucket",
          total: { $sum: "$pricing.finalAmount" },
        },
      },
    ]);

    return res.api(200, "Revenue chart data", {
      targeted,
      collection,
      business,
      period,
      scope,
    });
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getClientsChart = async (req, res, next) => {
  try {
    const { view = "self", period = "week" } = req.query;

    const { userIds, isManager } = await buildUserMatch(req);

    const now = new Date();
    let start, end, bucketExpr, bucketCount, labels;

    /* ---------- DATE RANGE + BUCKET ---------- */

    if (period === "week") {
      const day = now.getDay() || 7;
      start = new Date(now);
      start.setDate(now.getDate() - day + 1);
      start.setHours(0, 0, 0, 0);

      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      bucketExpr = { $dayOfWeek: "$createdAt" };
      bucketCount = 7;
      labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    }

    if (period === "lastWeek") {
      const day = now.getDay() || 7;
      end = new Date(now);
      end.setDate(now.getDate() - day);
      end.setHours(23, 59, 59, 999);

      start = new Date(end);
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);

      bucketExpr = { $dayOfWeek: "$createdAt" };
      bucketCount = 7;
      labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    }

    if (period === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      bucketExpr = {
        $ceil: { $divide: [{ $dayOfMonth: "$createdAt" }, 7] }
      };
      bucketCount = 4;
      labels = ["Week 1","Week 2","Week 3","Week 4"];
    }

    if (period === "year") {
      const fy = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
      start = new Date(fy, 3, 1);
      end = new Date(fy + 1, 2, 31, 23, 59, 59, 999);

      bucketExpr = {
        $ceil: { $divide: [{ $month: "$createdAt" }, 3] }
      };
      bucketCount = 4;
      labels = ["Q1","Q2","Q3","Q4"];
    }

    /* ---------- BASE MATCH ---------- */

    const baseMatch = {
      isDeleted: false,
      createdAt: { $gte: start, $lte: end },
      ...(view === "self"
        ? { leadBy: req.user._id }
        : { leadBy: { $in: userIds } }),
    };

    /* ---------- AGGREGATION ---------- */

    const raw = await Lead.aggregate([
      { $match: baseMatch },

      {
        $addFields: {
          bucket: bucketExpr,
        },
      },

      {
        $group: {
          _id: {
            user: "$leadBy",
            bucket: "$bucket",
          },
          count: { $sum: 1 },
        },
      },

      {
        $group: {
          _id: "$_id.user",
          data: {
            $push: {
              bucket: "$_id.bucket",
              count: "$count",
            },
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $project: {
          _id: 0,
          name: "$user.name",
          data: 1,
        },
      },
    ]);

    /* ---------- NORMALIZE SERIES ---------- */

    const series = raw.map((u) => {
      const map = {};
      u.data.forEach((d) => (map[d.bucket] = d.count));

      return {
        name: u.name,
        data: Array.from(
          { length: bucketCount },
          (_, i) => map[i + 1] || 0
        ),
      };
    });

    return res.api(200, "Clients chart fetched", {
      labels,
      series,
    });
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getPaymentStatusChart = async (req, res, next) => {
  try {
    const {
      period = "month",     
      scope = "self",        
      startDate,
      endDate,
    } = req.query;


    const allowedPeriods = [
      "today",
      "yesterday",
      "week",
      "month",
      "year",
      "custom",
    ];
    const allowedScopes = ["self", "team", "all"];

    if (!allowedPeriods.includes(period)) {
      return next(new ApiError(400, "Invalid period"));
    }
    if (!allowedScopes.includes(scope)) {
      return next(new ApiError(400, "Invalid scope"));
    }

    const now = new Date();
    let start, end;

    switch (period) {
      case "today":
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
        break;

      case "yesterday":
        start = new Date();
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;

      case "week": {
        const day = now.getDay() || 7;
        start = new Date(now);
        start.setDate(now.getDate() - day + 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      }

      case "month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        break;

      case "year": {
        const fy =
          now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
        start = new Date(fy, 3, 1);
        end = new Date(fy + 1, 2, 31, 23, 59, 59, 999);
        break;
      }

      case "custom":
        if (!startDate || !endDate) {
          return next(new ApiError(400, "Custom date range required"));
        }
        start = new Date(startDate);
        end = new Date(endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
    }

    let scopeFilter = {};

    if (scope === "self") {
      scopeFilter = { createdBy: req.user._id };
    }

    if (scope === "team") {
      const user = await User.findById(req.user._id).select("department");
      if (!user?.department) {
        return next(new ApiError(400, "User department not found"));
      }

      const teamUsers = await User.find({
        department: user.department,
      }).select("_id");

      scopeFilter = {
        createdBy: { $in: teamUsers.map((u) => u._id) },
      };
    }

    const raw = await ClientPayment.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          ...scopeFilter,
        },
      },
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
        },
      },
    ]);
    const map = {
      NOT_STARTED: 0,
      INITIAL_DONE: 0,
      PARTIAL: 0,
      COMPLETED: 0,
    };

    raw.forEach((r) => {
      map[r._id] = r.count;
    });

    const result = {
      pending: map.NOT_STARTED + map.INITIAL_DONE,
      partial: map.PARTIAL,
      completed: map.COMPLETED,
    };

    return res.api(200, "Payment status chart fetched", {
      period,
      scope,
      startDate: start,
      endDate: end,
      data: result,
    });
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};


