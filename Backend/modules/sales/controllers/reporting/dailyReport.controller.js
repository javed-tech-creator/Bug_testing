import mongoose from "mongoose";
import { ManagerReport } from "../../models/reporting/managerReport.model.js";
import User from "../../../HR/models/masters/user.model.js";
import { SalesDailyReporting } from "../../models/reporting/dailyReport.model.js";
import ApiError from "../../../../utils/master/ApiError.js";
import Lead from "../../models/lead.model.js";

export const submitMorningReport = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      plannedTasks = [],
      plannedMeetings = 0,
      targetForDay = 0,
      leads = [],
    } = req.body;

    // Validate time: Morning reporting allowed between 9 AM - 12 PM
    const now = new Date();
    const currentHour = now.getHours();
    // if (currentHour < 9 || currentHour >= 12) {
    //   return next(new ApiError(400, "Morning reporting time is 9:00 AM to 12:00 PM"));
    // }

    // Check if already submitted for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingReport = await SalesDailyReporting.findOne({
      userId,
      reportDate: today,
      reportType: "morning",
    });

    if (existingReport && existingReport.status === "submitted") {
      return next(
        new ApiError(400, "Morning report already submitted for today")
      );
    }

    // Calculate derived fields (2% of expected amount)
    const processedLeads = leads.map((lead) => {
      const expectedAmount = Number(lead.expectedAmount) || 0;
      const leadAmount = Number((expectedAmount * 0.02).toFixed(2));

      return {
        leadId: lead.leadId,
        leadName: lead.leadName?.trim(),
        leadCompany: lead.leadCompany?.trim(),
        leadPhone: lead.leadPhone?.trim(),
        leadEmail: lead.leadEmail?.trim(),
        leadLocation: lead.leadLocation?.trim(),
        expectedAmount: expectedAmount,
        targetCategory: lead.targetCategory || "sales_in",
        vertical: lead.vertical || "self",
        timeDuration: Number(lead.timeDuration) || 1,
        actionRequired: lead.actionRequired || "call",
        remark: lead.remark?.trim() || "",
        leadAmount: leadAmount,
        dealAmount: leadAmount,
        relationAmount: leadAmount,
        status: "planned",
      };
    });

    // Calculate totals
    const totalLeads = processedLeads.length;
    const totalExpectedAmount = processedLeads.reduce(
      (sum, lead) => sum + lead.expectedAmount,
      0
    );
    const totalLeadAmount = processedLeads.reduce(
      (sum, lead) => sum + lead.leadAmount,
      0
    );
    const totalTimeAllocated = processedLeads.reduce(
      (sum, lead) => sum + lead.timeDuration,
      0
    );

    let report;
    if (existingReport) {
      existingReport.morning = {
        plannedTasks,
        plannedMeetings,
        targetForDay,
        leads: processedLeads,
        totalLeads,
        totalExpectedAmount,
        totalLeadAmount,
        totalTimeAllocated,
      };
      existingReport.status = "submitted";
      existingReport.submittedAt = now;
      existingReport.ipAddress = req.ip;
      existingReport.deviceInfo = req.headers["user-agent"];

      await existingReport.save();
      report = existingReport;
    } else {
      // Create new report
      report = new SalesDailyReporting({
        userId,
        reportDate: today,
        reportType: "morning",
        submittedAt: now,
        status: "submitted",
        ipAddress: req.ip,
        deviceInfo: req.headers["user-agent"],
        morning: {
          plannedTasks,
          plannedMeetings,
          targetForDay,
          leads: processedLeads,
          totalLeads,
          totalExpectedAmount,
          totalLeadAmount,
          totalTimeAllocated,
        },
      });

      await report.save();
    }

    // try {
    //   const user = await User.findById(userId);
    //   if (user?.managerId) {
    //     await sendNotification({
    //       channels: ["mobile", "web"],
    //       data: {
    //         title: "Morning Report Submitted",
    //         body: `${user.name} submitted morning report with ${totalLeads} leads`,
    //         type: "report_submitted",
    //         reportId: report._id,
    //         userId: userId
    //       },
    //       userIds: [user.managerId.toString()]
    //     });
    //   }
    // } catch (notificationError) {
    //   console.error("Notification error:", notificationError);
    // }

    // Prepare response

    const response = {
      _id: report._id,
      reportDate: report.reportDate,
      reportType: report.reportType,
      status: report.status,
      submittedAt: report.submittedAt,
      morning: {
        totalLeads: report.morning.totalLeads,
        totalExpectedAmount: report.morning.totalExpectedAmount,
        totalLeadAmount: report.morning.totalLeadAmount,
        totalTimeAllocated: report.morning.totalTimeAllocated,
        leads: report.morning.leads.map((lead) => ({
          leadId: lead.leadId,
          leadName: lead.leadName,
          expectedAmount: lead.expectedAmount,
          targetCategory: lead.targetCategory,
          vertical: lead.vertical,
          timeDuration: lead.timeDuration,
          actionRequired: lead.actionRequired,
          leadAmount: lead.leadAmount,
        })),
      },
    };

    return res.api(200, "Morning report submitted successfully!", response);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => error.message);
      return next(new ApiError(400, errors.join(", ")));
    }
    return next(new ApiError(500, err.message));
  }
};

export const submitEveningReport = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      completedTasks = [],
      tasksPending = [],
      meetingsAttended = 0,
      achievements = "",
      challengesFaced = "",
      salesDone = 0,
      leads = [],
    } = req.body;

    // Validate time: Evening reporting allowed between 5 PM - 8 PM
    const now = new Date();
    const currentHour = now.getHours();
    // if (currentHour < 17 || currentHour >= 20) {
    //   return next(new ApiError(400, "Evening reporting time is 5:00 PM to 8:00 PM"));
    // }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check for morning report
    const morningReport = await SalesDailyReporting.findOne({
      userId,
      reportDate: today,
      reportType: "morning",
      status: "submitted",
    });

    if (!morningReport) {
      return next(new ApiError(400, "Please submit morning report first"));
    }

    // Check if evening report already submitted
    const existingEveningReport = await SalesDailyReporting.findOne({
      userId,
      reportDate: today,
      reportType: "evening",
    });

    if (existingEveningReport && existingEveningReport.status === "submitted") {
      return next(
        new ApiError(400, "Evening report already submitted for today")
      );
    }

    // Process leads - match with morning leads
    const morningLeadsMap = new Map();
    morningReport.morning.leads.forEach((lead) => {
      morningLeadsMap.set(lead.leadId.toString(), lead);
    });

    const processedLeads = leads.map((eveningLead) => {
      const morningLead = morningLeadsMap.get(eveningLead.leadId);
      const actualAmount = Number(eveningLead.actualAmount) || 0;
      const leadAmount =
        eveningLead.status === "win"
          ? Number((actualAmount * 0.02).toFixed(2))
          : 0;

      return {
        leadId: eveningLead.leadId,
        leadName: eveningLead.leadName?.trim() || morningLead?.leadName,
        leadCompany:
          eveningLead.leadCompany?.trim() || morningLead?.leadCompany,
        actualAmount: actualAmount,
        timeSpent: Number(eveningLead.timeSpent) || 0,
        status: eveningLead.status || "progress",
        winReason: eveningLead.winReason?.trim() || "",
        lossReason: eveningLead.lossReason?.trim() || "",
        progressNotes: eveningLead.progressNotes?.trim() || "",
        nextAction: eveningLead.nextAction?.trim() || "",
        followUpDate: eveningLead.followUpDate || null,
        leadAmount: leadAmount,
        dealAmount: leadAmount,
        relationAmount: leadAmount,
        totalIncentive: eveningLead.status === "win" ? leadAmount * 3 : 0,
        expectedAmount: morningLead?.expectedAmount || 0,
        timeAllocated: morningLead?.timeDuration || 0,
        actionPlanned: morningLead?.actionRequired || "",
      };
    });

    // Calculate totals
    const totalActualAmount = processedLeads
      .filter((lead) => lead.status === "win")
      .reduce((sum, lead) => sum + lead.actualAmount, 0);

    const totalTimeSpent = processedLeads.reduce(
      (sum, lead) => sum + lead.timeSpent,
      0
    );

    const wonLeads = processedLeads.filter(
      (lead) => lead.status === "win"
    ).length;
    const totalLeads = processedLeads.length;
    const conversionRate =
      totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

    const totalIncentive = processedLeads.reduce(
      (sum, lead) => sum + lead.totalIncentive,
      0
    );

    const lostLeads = processedLeads.filter(
      (lead) => lead.status === "loss"
    ).length;
    const progressLeads = processedLeads.filter(
      (lead) => lead.status === "progress"
    ).length;

    let report;
    if (existingEveningReport) {
      // Update existing draft
      existingEveningReport.evening = {
        completedTasks,
        tasksPending,
        meetingsAttended,
        achievements: achievements?.trim(),
        challengesFaced: challengesFaced?.trim(),
        salesDone,
        leads: processedLeads,
        totalActualAmount,
        totalTimeSpent,
        conversionRate,
        totalIncentive,
        wonLeads,
        lostLeads,
        progressLeads,
      };
      existingEveningReport.status = "submitted";
      existingEveningReport.submittedAt = now;
      existingEveningReport.ipAddress = req.ip;
      existingEveningReport.deviceInfo = req.headers["user-agent"];

      await existingEveningReport.save();
      report = existingEveningReport;
    } else {
      // Create new report
      report = new SalesDailyReporting({
        userId,
        reportDate: today,
        reportType: "evening",
        submittedAt: now,
        status: "submitted",
        ipAddress: req.ip,
        deviceInfo: req.headers["user-agent"],
        evening: {
          completedTasks,
          tasksPending,
          meetingsAttended,
          achievements: achievements?.trim(),
          challengesFaced: challengesFaced?.trim(),
          salesDone,
          leads: processedLeads,
          totalActualAmount,
          totalTimeSpent,
          conversionRate,
          totalIncentive,
          wonLeads,
          lostLeads,
          progressLeads,
        },
      });

      await report.save();
    }

    // Send notification to manager
    // try {
    //   const user = await User.findById(userId);
    //   if (user?.managerId) {
    //     await sendNotification({
    //       channels: ["mobile", "web"],
    //       data: {
    //         title: "Evening Report Submitted",
    //         body: `${user.name} submitted evening report - ${wonLeads} won, ${lostLeads} lost`,
    //         type: "report_submitted",
    //         reportId: report._id,
    //         userId: userId
    //       },
    //       userIds: [user.managerId.toString()]
    //     });
    //   }
    // } catch (notificationError) {
    //   console.error("Notification error:", notificationError);
    // }

    // Prepare response
    const response = {
      _id: report._id,
      reportDate: report.reportDate,
      reportType: report.reportType,
      status: report.status,
      submittedAt: report.submittedAt,
      evening: {
        totalActualAmount: report.evening.totalActualAmount,
        totalTimeSpent: report.evening.totalTimeSpent,
        conversionRate: report.evening.conversionRate,
        totalIncentive: report.evening.totalIncentive,
        wonLeads: report.evening.wonLeads,
        lostLeads: report.evening.lostLeads,
        progressLeads: report.evening.progressLeads,
        leads: report.evening.leads.map((lead) => ({
          leadId: lead.leadId,
          leadName: lead.leadName,
          actualAmount: lead.actualAmount,
          status: lead.status,
          totalIncentive: lead.totalIncentive,
        })),
      },
    };

    return res.api(200, "Evening report submitted successfully!", response);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => error.message);
      return next(new ApiError(400, errors.join(", ")));
    }
    return next(new ApiError(500, err.message));
  }
};

export const getTodayReportDetail = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type } = req.query;

    if (!type || !["morning", "evening"].includes(type)) {
      return next(
        new ApiError(400, "Query param type must be 'morning' or 'evening'")
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const report = await SalesDailyReporting.findOne({
      userId,
      reportDate: today,
      reportType: type,
    }).lean();

    if (!report) {
      return res.api(200, "No report found for today", { report: null });
    }

    // FULL READ-ONLY RESPONSE
    const response = {
      _id: report._id,
      userId: report.userId,
      reportDate: report.reportDate,
      reportType: report.reportType,
      status: report.status,
      submittedAt: report.submittedAt,
      ipAddress: report.ipAddress,
      deviceInfo: report.deviceInfo,
      data: type === "morning" ? report.morning : report.evening,
    };

    return res.api(200, "Report fetched successfully", response);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getTodayReportStatus = async (req, res, next) => {
  console.log("getTodayReportStatus called");
  try {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [morningReport, eveningReport] = await Promise.all([
      SalesDailyReporting.findOne({
        userId,
        reportDate: today,
        reportType: "morning",
      }),
      SalesDailyReporting.findOne({
        userId,
        reportDate: today,
        reportType: "evening",
      }),
    ]);

    const now = new Date();
    const currentHour = now.getHours();

    const response = {
      morning: {
        submitted: morningReport?.status === "submitted",
        canSubmit: currentHour >= 9 && currentHour < 12,
        submittedAt: morningReport?.submittedAt,
        reportId: morningReport?._id,
      },
      evening: {
        submitted: eveningReport?.status === "submitted",
        canSubmit: currentHour >= 17 && currentHour < 20,
        submittedAt: eveningReport?.submittedAt,
        reportId: eveningReport?._id,
        requiresMorning: !morningReport || morningReport.status !== "submitted",
      },
      currentTime: now.toISOString(),
    };

    return res.api(200, "Report status fetched successfully", response);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getMorningReport = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { date } = req.query;

    let queryDate;
    if (date) {
      queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
    } else {
      queryDate = new Date();
      queryDate.setHours(0, 0, 0, 0);
    }

    const report = await SalesDailyReporting.findOne({
      userId,
      reportDate: queryDate,
      reportType: "morning",
    });

    if (!report) {
      return res.api(200, "No morning report found for this date", {
        report: null,
      });
    }

    const response = {
      _id: report._id,
      reportDate: report.reportDate,
      reportType: report.reportType,
      status: report.status,
      submittedAt: report.submittedAt,
      morning: {
        plannedTasks: report.morning.plannedTasks,
        plannedMeetings: report.morning.plannedMeetings,
        targetForDay: report.morning.targetForDay,
        totalLeads: report.morning.totalLeads,
        totalExpectedAmount: report.morning.totalExpectedAmount,
        totalLeadAmount: report.morning.totalLeadAmount,
        totalTimeAllocated: report.morning.totalTimeAllocated,
        leads: report.morning.leads.map((lead) => ({
          leadId: lead.leadId,
          leadName: lead.leadName,
          leadCompany: lead.leadCompany,
          leadPhone: lead.leadPhone,
          leadEmail: lead.leadEmail,
          leadLocation: lead.leadLocation,
          expectedAmount: lead.expectedAmount,
          targetCategory: lead.targetCategory,
          vertical: lead.vertical,
          timeDuration: lead.timeDuration,
          actionRequired: lead.actionRequired,
          remark: lead.remark,
          leadAmount: lead.leadAmount,
          dealAmount: lead.dealAmount,
          relationAmount: lead.relationAmount,
          status: lead.status,
        })),
      },
    };

    return res.api(200, "Morning report fetched successfully", response);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getTeamStatus = async (req, res, next) => {
  try {
    const managerId = req.user._id;
    const { date } = req.query;

    let queryDate;
    if (date) {
      queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
    } else {
      queryDate = new Date();
      queryDate.setHours(0, 0, 0, 0);
    }
    const startOfDay = new Date(queryDate);
    const endOfDay = new Date(queryDate);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const manager = await User.findById(managerId).select(
      "department designation"
    );
    if (!manager?.department) {
      return next(new ApiError(400, "Manager department not found"));
    }

    const teamMembers = await User.find({
      department: manager.department,
      _id: { $ne: managerId },
      designation: { $ne: manager.designation },
    }).select("_id name email phone");

    console.log("Team Members Found:", teamMembers);
    const memberIds = teamMembers.map((member) => member._id);

    const morningReports = await SalesDailyReporting.find({
      userId: { $in: memberIds },
      reportType: "morning",
      reportDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const eveningReports = await SalesDailyReporting.find({
      userId: { $in: memberIds },
      reportType: "evening",
      reportDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    console.log("Morning Reports Found:", morningReports);

    // NEW: Fetch lead details for each user
    const leadDetails = await Lead.find({
      assignedTo: { $in: memberIds },
      assignedDate: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    }).select("assignTo status amount expectedRevenue");

    // Create lead data map for each user
    const userLeadData = {};
    leadDetails.forEach((lead) => {
      const userId = lead.assignedTo.toString();
      if (!userLeadData[userId]) {
        userLeadData[userId] = {
          totalLead: 0,
          totalLeadIn: 0,
          salesIn: 0,
          businessIn: 0,
          amountIn: 0,
          totalExpected: 0,
        };
      }

      userLeadData[userId].totalLead++;

      // Categorize leads based on status (adjust these conditions as per your business logic)
      if (lead.status === "assigned" || lead.status === "contacted") {
        userLeadData[userId].totalLeadIn++;
      } else if (
        lead.status === "qualified" ||
        lead.status === "proposal_sent"
      ) {
        userLeadData[userId].salesIn++;
      } else if (lead.status === "won" || lead.status === "closed") {
        userLeadData[userId].businessIn++;
        userLeadData[userId].amountIn += lead.amount || 0;
      }

      userLeadData[userId].totalExpected += lead.expectedRevenue || 0;
    });

    // Create member status map
    const memberStatus = teamMembers.map((member) => {
      const morningReport = morningReports.find(
        (r) => r.userId.toString() === member._id.toString()
      );
      const eveningReport = eveningReports.find(
        (r) => r.userId.toString() === member._id.toString()
      );

      // Get lead data for this user
      const leadsData = userLeadData[member._id.toString()] || {
        totalLead: 0,
        totalLeadIn: 0,
        salesIn: 0,
        businessIn: 0,
        amountIn: 0,
        totalExpected: 0,
      };

      let morningMetrics = {};
      if (morningReport) {
        morningMetrics = {
          totalLeads: morningReport.morning.totalLeads,
          totalExpected: morningReport.morning.totalExpectedAmount,
          totalTimeAllocated: morningReport.morning.totalTimeAllocated,
        };
      }

      let eveningMetrics = {};
      if (eveningReport) {
        eveningMetrics = {
          totalActual: eveningReport.evening.totalActualAmount,
          conversionRate: eveningReport.evening.conversionRate,
          totalIncentive: eveningReport.evening.totalIncentive,
          totalTimeSpent: eveningReport.evening.totalTimeSpent,
        };
      }
      const won = eveningReport?.evening?.wonLeads || 0;
      const lost = eveningReport?.evening?.lostLeads || 0;
      const progress = eveningReport?.evening?.progressLeads || 0;
      return {
        id: member._id,
        name: member.name,
        morningSubmitted: !!morningReport,
        eveningSubmitted: !!eveningReport,
        morningSubmittedAt: morningReport?.submittedAt,
        eveningSubmittedAt: eveningReport?.submittedAt,

        // NEW: Add lead data for frontend display
        totalLead: leadsData.totalLead,
        totalLeadIn: leadsData.totalLeadIn,
        salesIn: leadsData.salesIn,
        businessIn: leadsData.businessIn,
        amountIn: leadsData.amountIn,
        totalExpected: leadsData.totalExpected,
        timeSpent: eveningReport?.evening?.totalTimeSpent || 0,

        ...morningMetrics,
        ...eveningMetrics,

        won,
        lost,
        inProgress: progress,
      };
    });

    // Calculate team summary for the new fields
    const teamSummary = {
      totalTeamMembers: teamMembers.length,
      totalMorningSubmitted: morningReports.length,
      totalEveningSubmitted: eveningReports.length,
      totalPendingMorning: teamMembers.length - morningReports.length,
      totalPendingEvening: teamMembers.length - eveningReports.length,

      // Calculate team totals for morning
      totalTeamLeads: morningReports.reduce(
        (sum, r) => sum + r.morning.totalLeads,
        0
      ),
      totalTeamExpectedAmount: morningReports.reduce(
        (sum, r) => sum + r.morning.totalExpectedAmount,
        0
      ),
      totalTeamTimeAllocated: morningReports.reduce(
        (sum, r) => sum + r.morning.totalTimeAllocated,
        0
      ),

      // Calculate team totals for evening
      totalTeamActualAmount: eveningReports.reduce(
        (sum, r) => sum + r.evening.totalActualAmount,
        0
      ),
      totalTeamTimeSpent: eveningReports.reduce(
        (sum, r) => sum + r.evening.totalTimeSpent,
        0
      ),
      totalTeamIncentive: eveningReports.reduce(
        (sum, r) => sum + r.evening.totalIncentive,
        0
      ),

      // NEW: Calculate totals from lead data
      totalLead: memberStatus.reduce(
        (sum, member) => sum + member.totalLead,
        0
      ),
      totalLeadIn: memberStatus.reduce(
        (sum, member) => sum + member.totalLeadIn,
        0
      ),
      totalSalesIn: memberStatus.reduce(
        (sum, member) => sum + member.salesIn,
        0
      ),
      totalBusinessIn: memberStatus.reduce(
        (sum, member) => sum + member.businessIn,
        0
      ),
      totalAmountIn: memberStatus.reduce(
        (sum, member) => sum + member.amountIn,
        0
      ),
      totalExpected: memberStatus.reduce(
        (sum, member) => sum + member.totalExpected,
        0
      ),
      totalTimeSpent: memberStatus.reduce(
        (sum, member) => sum + member.timeSpent,
        0
      ),
      totalWon: memberStatus.reduce((s, m) => s + m.won, 0),
      totalLost: memberStatus.reduce((s, m) => s + m.lost, 0),
      totalInProgress: memberStatus.reduce((s, m) => s + m.inProgress, 0),

      totalTeamIncentive: eveningReports.reduce(
        (s, r) => s + (r.evening?.totalIncentive || 0),
        0
      ),
    };

    // Calculate conversion rate
    const totalWonLeads = eveningReports.reduce(
      (sum, r) => sum + r.evening.wonLeads,
      0
    );
    const totalLeadsWorked = eveningReports.reduce(
      (sum, r) => sum + r.evening.leads.length,
      0
    );
    teamSummary.teamConversionRate =
      totalLeadsWorked > 0
        ? Math.round((totalWonLeads / totalLeadsWorked) * 100)
        : 0;

    const response = {
      reportDate: queryDate,
      teamSummary,
      teamMembers: memberStatus,
    };

    return res.api(200, "Team status fetched successfully", response);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

const getISTDayRange = (date = new Date()) => {
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffset);

  const startOfDay = new Date(
    Date.UTC(
      istDate.getUTCFullYear(),
      istDate.getUTCMonth(),
      istDate.getUTCDate(),
      0, 0, 0, 0
    )
  );

  const endOfDay = new Date(
    Date.UTC(
      istDate.getUTCFullYear(),
      istDate.getUTCMonth(),
      istDate.getUTCDate(),
      23, 59, 59, 999
    )
  );

  return { startOfDay, endOfDay };
};

export const submitManagerReport = async (req, res, next) => {
  try {
    const managerId = req.user._id;
    const { reportType } = req.query;
    const { remarks = "", highlights = "", challenges = "" } = req.body || {};

    if (!reportType || !["morning", "evening"].includes(reportType)) {
      return next(
        new ApiError(400, "Query param reportType must be 'morning' or 'evening'")
      );
    }

    if (remarks.trim().length < 10) {
      return next(new ApiError(400, "Remarks must be at least 10 characters"));
    }

    if (highlights.trim().length < 10) {
      return next(
        new ApiError(400, "Highlights must be at least 10 characters")
      );
    }

    const { startOfDay, endOfDay } = getISTDayRange();

    const dailyReport = await SalesDailyReporting.findOne({
      userId: managerId,
      reportType,
      reportDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).select("_id");
    console.log("Daily Report Found:", dailyReport);

    if (!dailyReport) {
      return next(
        new ApiError(
          400,
          `Please submit your ${reportType} daily report first`
        )
      );
    }

    const existingReport = await ManagerReport.findOne({
      managerId,
      reportType,
      reportDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existingReport && existingReport.status === "submitted") {
      return next(
        new ApiError(400, `${reportType} manager report already submitted`)
      );
    }

    let report;

    /* -------------------- CREATE / UPDATE -------------------- */
    if (existingReport) {
      existingReport.remarks = remarks.trim();
      existingReport.highlights = highlights.trim();
      existingReport.challenges = challenges.trim();
      existingReport.dailyReportId = dailyReport._id;
      existingReport.status = "submitted";
      existingReport.submittedAt = new Date();

      await existingReport.save();
      report = existingReport;
    } else {
      report = await ManagerReport.create({
        managerId,
        reportDate: startOfDay, // normalized IST date
        reportType,
        remarks: remarks.trim(),
        highlights: highlights.trim(),
        challenges: challenges.trim(),
        dailyReportId: dailyReport._id,
        status: "submitted",
        submittedAt: new Date(),
      });
    }

    /* -------------------- RESPONSE -------------------- */
    return res.api(200, "Manager report submitted successfully", {
      _id: report._id,
      reportType: report.reportType,
      reportDate: report.reportDate,
      dailyReportId: report.dailyReportId,
      status: report.status,
      submittedAt: report.submittedAt,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ApiError(400, "Manager report already exists for today"));
    }
    return next(new ApiError(500, err.message));
  }
};

