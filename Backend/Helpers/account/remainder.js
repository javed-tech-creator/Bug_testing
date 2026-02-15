import InvoiceA from "../../models/accounts/invoice.js"; 
import cron from "node-cron";
import nodemailer from "nodemailer";
import Twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

// Email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Twilio client
const twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send Email
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error(`Error sending email to ${to}:`, err.message);
    }
}

// Send SMS
const sendSMS = async (to, body) => {
    try {
        // Ensure number includes country code, e.g., +91XXXXXXXXXX
        const formattedNumber = to.toString().startsWith('+') ? to.toString() : `+91${to}`;
        await twilioClient.messages.create({ body, from: process.env.TWILIO_PHONE_NUMBER, to: formattedNumber });
        console.log(`SMS sent to ${to}`);
    } catch (err) {
        console.error(`Error sending SMS to ${to}:`, err.message);
    }
}

// Payment reminder function
export const sendPaymentReminders = async () => {
    try {
        const today = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3);

        const pendingInvoices = await InvoiceA.find({
            remainingAmount: { $gt: 0 },
            dueDate: { $lte: threeDaysLater }
        });

        for (const inv of pendingInvoices) {
            const message = `Reminder: Invoice #${inv.invoiceNumber} for project "${inv.project}" has a remaining amount of ₹${inv.remainingAmount}. Due date: ${inv.dueDate.toDateString()}`;

            // Send Email to client
            if (inv.clientEmail) await sendEmail(inv.clientEmail, "Payment Reminder", message);

            // Send SMS if client phone available
            if (inv.clientPhone) await sendSMS(inv.clientPhone, message);

            console.log(`Reminder sent for Invoice ${inv.invoiceNumber}`);
        }
    } catch (err) {
        console.error("Error sending payment reminders:", err.message);
    }
}

// Schedule cron: everyday at 9 AM
cron.schedule('0 9 * * *', () => {
    console.log("Running daily payment reminder cron job...");
    sendPaymentReminders();
});
