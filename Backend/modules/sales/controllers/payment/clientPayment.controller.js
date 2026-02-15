import mongoose from "mongoose";
import Project from "../../models/project.model.js";
import ClientQuotation from "../../models/clientQuotation.model.js";
import Payment from "../../models/payment/payment.model.js";
import ProjectEventLog from "../../models/projectEventLogs.js";
import ApiError from "../../../../utils/master/ApiError.js";
import Client from "../../models/client.model.js";
import ClientPayment from "../../models/payment/clientPayment.model.js";

const validateRef = async (Model, id, name, session = null) => {
  if (!id) throw new ApiError(400, `${name} is required`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `${name} is invalid`);
  }

  let q = Model.findById(id);
  if (session) q = q.session(session);
  const doc = await q;
  if (!doc) throw new ApiError(404, `${name} not found`);
  return doc;
};

export const addInitialPayment = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { projectId, clientId, amount, mode, remark, createdBy } = req.body;

    if (!projectId || !clientId || !amount || !createdBy) {
      return next(new ApiError(400, "Missing required fields"));
    }
    if (amount <= 0) {
      return next(new ApiError(400, "Amount must be greater than zero"));
    }

    await validateRef(Project, projectId, "Project", session);
    await validateRef(Client, clientId, "Client", session);

    const quotation = await ClientQuotation.findOne({
      projectId,
      clientId,
    }).session(session);
    if (!quotation) {
      return next(new ApiError(400, "Quotation not found for this project"));
    }
    const finalAmount = quotation.pricing?.finalAmount;
    if (!finalAmount)
      return next(new ApiError(400, "Quotation final amount missing"));

    if (amount > finalAmount) {
      return next(
        new ApiError(400, "Initial payment cannot exceed final amount")
      );
    }

    // 1. Create payment entry
    const payment = await Payment.create(
      [
        {
          projectId,
          clientId,
          amount: Number(amount),
          mode,
          type: "INITIAL",
          status: "COMPLETED",
          remark: remark || null,
          createdBy: createdBy,
        },
      ],
      { session }
    );
    const paymentDoc = payment[0];

    // 2. Master Payment Record
    let master = await ClientPayment.findOne({ projectId }).session(session);

    if (!master) {
      // create master record
      master = await ClientPayment.create(
        [
          {
            clientId,
            projectId,
            quotationId: quotation._id,
            finalAmount,
            totalPaid: Number(amount),
            remainingAmount: Number((finalAmount - amount).toFixed(2)),
            initialPaymentDone: true,
            paymentStatus: amount >= finalAmount ? "COMPLETED" : "INITIAL_DONE",
            payments: [paymentDoc._id],
            lastPaymentDate: new Date(),
            createdBy: createdBy,
          },
        ],
        { session }
      );
      master = master[0];
    } else {
      if (master.initialPaymentDone) {
        await session.abortTransaction();
        return next(
          new ApiError(400, "Initial payment already recorded for this project")
        );
      }

      if (master.totalPaid + Number(amount) > finalAmount) {
        await session.abortTransaction();
        return next(
          new ApiError(
            400,
            `Payment exceeds remaining amount. Remaining: ${master.remainingAmount}`
          )
        );
      }

      const newTotalPaid = master.totalPaid + Number(amount);

      master.totalPaid = newTotalPaid;
      master.remainingAmount = Math.max(
        0,
        Number((finalAmount - newTotalPaid).toFixed(2))
      );

      master.initialPaymentDone = true;
      master.paymentStatus =
        newTotalPaid >= finalAmount ? "COMPLETED" : "PARTIAL";
      master.payments.push(paymentDoc._id);
      master.lastPaymentDate = new Date();

      await master.save({ session });
    }

    // 3. Event Log
    await ProjectEventLog.logEvent({
      projectId,
      eventType: "PAYMENT_RECEIVED",
      title: "Initial Payment Received",
      description: `₹${amount} received.`,
      metaData: { paymentId: paymentDoc._id, mode, amount },
      createdBy: createdBy,
    });

    await session.commitTransaction();

    return res.api(201, "Initial payment recorded successfully", {
      payment: paymentDoc,
      clientPayment: master,
    });
  } catch (err) {
    await session.abortTransaction();
    return next(new ApiError(500, err?.message));
  } finally {
    session.endSession();
  }
};

export const getClientPayment = async (req, res, next) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return next(new ApiError(400, "clientId or projectId required"));
    }

    if (projectId && !mongoose.Types.ObjectId.isValid(projectId))
      return next(new ApiError(400, "Invalid projectId"));

    const filter = {};
    if (projectId) filter.projectId = projectId;

    const data = await ClientPayment.findOne(filter).populate({
      path: "payments",
      strictPopulate: false,
    });

    if (!data) {
      return next(new ApiError(404, "No payment records found"));
    }

    return res.api(200, "Data fetched", data);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};
