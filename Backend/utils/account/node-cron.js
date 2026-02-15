import cron from "node-cron";
import Payment from "../../models/accounts/VenderTax/Payment.js";
import { sendEmail } from "../../util/account/mailer.js";

// Every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Checking for pending payments...");
  const today = new Date();
  const payments = await Payment.find({ approved: false, dueDate: { $lte: today } }).populate("vendor");

  for (let pay of payments) {
    if (pay.vendor.email) {
      sendEmail(
        pay.vendor.email,
        "Payment Reminder",
        `Dear ${pay.vendor.name}, your payment of ₹${pay.totalAmount} is pending approval.`
      );
    }
  }
});
