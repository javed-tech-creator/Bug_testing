import mongoose from "mongoose";
import ClientPayment from "../../models/payment/clientPayment.model.js";
import Client from "../../models/client.model.js";
import Payment from "../../models/payment/payment.model.js";
import Project from "../../models/project.model.js";
import ApiError from "../../../../utils/master/ApiError.js";

export const createPayment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log(req.body)
    const { projectId, clientId, amount, mode, type, remark, transactionId, date, } = req.body;

    if (!projectId || !clientId || !amount || !mode || !type) {
      return next(new ApiError(400, "Missing required fields"));
    }

    if (amount <= 0) {
      return next(new ApiError(400, "Amount must be greater than zero"));
    }

    const payment = await Payment.create([{
      projectId,
      clientId,
      amount: Number(amount),
      mode,
      type,
      status: 'COMPLETED', 
      transactionId: transactionId || null,
      remark: remark || null,
      date: date ? new Date(date) : new Date(),
      createdBy: req.user?._id,
    }], { session });

    const paymentDoc = payment[0];

    let clientPayment = await ClientPayment.findOne({ projectId, clientId }).session(session);
    
    if (clientPayment) {
      clientPayment.totalPaid += Number(amount);
      clientPayment.payments.push(paymentDoc._id);
      clientPayment.lastPaymentDate = new Date();
      await clientPayment.save({ session });
    } else {
      const project = await Project.findById(projectId).session(session);
      const quotation = await ClientQuotation.findOne({ projectId, clientId }).session(session);
      
      clientPayment = await ClientPayment.create([{
        clientId,
        projectId,
        quotationId: quotation?._id || null,
        finalAmount: amount, 
        totalPaid: Number(amount),
        remainingAmount: 0,
        initialPaymentDone: type === 'INITIAL',
        paymentStatus: 'PARTIAL',
        payments: [paymentDoc._id],
        lastPaymentDate: new Date(),
        createdBy: req.user?._id,
      }], { session });
    }

    await session.commitTransaction();

    const populatedPayment = await Payment.findById(paymentDoc._id)
      .populate('projectId', 'name projectId')
      .populate('clientId', 'name email phone')
      .populate('createdBy', 'name email');

    return res.api(201, "Payment created successfully", populatedPayment);

  } catch (err) {
    console.log(err)
    await session.abortTransaction();
    return next(new ApiError(500, err?.message));
  } finally {
    session.endSession();
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid payment ID"));
    }

    const payment = await Payment.findById(id)
      .populate('projectId', 'name projectId status')
      .populate('clientId', 'name email phone company')
      .populate('createdBy', 'name email');

    if (!payment) {
      return next(new ApiError(404, "Payment not found"));
    }

    return res.api(200, "Payment retrieved successfully", payment);

  } catch (err) {
    return next(new ApiError(500, err?.message));
  }
};

export const updatePayment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { amount, mode, type, status, remark, transactionId, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid payment ID"));
    }

    // Find existing payment
    const existingPayment = await Payment.findById(id).session(session);
    if (!existingPayment) {
      return next(new ApiError(404, "Payment not found"));
    }

    // Store old amount for ClientPayment adjustment
    const oldAmount = existingPayment.amount;

    // Update payment
    const updatedPayment = await Payment.findByIdAndUpdate(
      id,
      {
        ...(amount && { amount: Number(amount) }),
        ...(mode && { mode }),
        ...(type && { type }),
        ...(status && { status }),
        ...(remark !== undefined && { remark }),
        ...(transactionId !== undefined && { transactionId }),
        ...(date && { date: new Date(date) }),
      },
      { new: true, session }
    );

    // If amount changed, update ClientPayment master record
    if (amount && amount !== oldAmount) {
      const clientPayment = await ClientPayment.findOne({ 
        projectId: existingPayment.projectId 
      }).session(session);

      if (clientPayment) {
        const amountDiff = Number(amount) - oldAmount;
        clientPayment.totalPaid += amountDiff;
        clientPayment.lastPaymentDate = new Date();
        
        await clientPayment.save({ session });
      }
    }

    await session.commitTransaction();

    const populatedPayment = await Payment.findById(updatedPayment._id)
      .populate('projectId', 'name projectId status')
      .populate('clientId', 'name email phone company')
      .populate('createdBy', 'name email');

    return res.api(200, "Payment updated successfully", populatedPayment);

  } catch (err) {
    await session.abortTransaction();
    return next(new ApiError(500, err?.message));
  } finally {
    session.endSession();
  }
};

export const getPaymentsByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 10, type, status, mode } = req.query;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new ApiError(400, "Invalid project ID"));
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ApiError(404, "Project not found"));
    }

    // Build filter
    const filter = { projectId };
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (mode) filter.mode = mode;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get payments with pagination
    const payments = await Payment.find(filter)
      .populate('projectId', 'name projectId status')
      .populate('clientId', 'name email phone company')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await Payment.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    return res.api(200, "Payments retrieved successfully", {
      payments,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPayments: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      }
    });

  } catch (err) {
    return next(new ApiError(500, err?.message));
  }
};

export const getPaymentsByClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const { page = 1, limit = 10, type, status, mode } = req.query;

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return next(new ApiError(400, "Invalid client ID"));
    }

    // Verify client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return next(new ApiError(404, "Client not found"));
    }

    // Build filter
    const filter = { clientId };
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (mode) filter.mode = mode;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get payments with pagination
    const payments = await Payment.find(filter)
      .populate('projectId', 'name projectId status')
      .populate('clientId', 'name email phone company')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Payment.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    return res.api(200, "Payments retrieved successfully", {
      payments,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPayments: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      }
    });

  } catch (err) {
    return next(new ApiError(500, err?.message));
  }
};

export const getAllPayments = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      status, 
      mode, 
      projectId, 
      clientId,
      startDate,
      endDate
    } = req.query;

    // Build filter
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (mode) filter.mode = mode;
    if (projectId) filter.projectId = projectId;
    if (clientId) filter.clientId = clientId;

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get payments with pagination
    const payments = await Payment.find(filter)
      .populate('projectId', 'name projectId status')
      .populate('clientId', 'name email phone company')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Payment.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    // Get summary stats
    const stats = await Payment.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          completedAmount: { 
            $sum: { 
              $cond: [{ $eq: ["$status", "COMPLETED"] }, "$amount", 0] 
            } 
          },
          pendingAmount: { 
            $sum: { 
              $cond: [{ $eq: ["$status", "PENDING"] }, "$amount", 0] 
            } 
          },
          totalPayments: { $sum: 1 }
        }
      }
    ]);

    return res.api(200, "Payments retrieved successfully", {
      payments,
      summary: stats[0] || {
        totalAmount: 0,
        completedAmount: 0,
        pendingAmount: 0,
        totalPayments: 0
      },
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalPayments: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      }
    });

  } catch (err) {
    return next(new ApiError(500, err?.message));
  }
};