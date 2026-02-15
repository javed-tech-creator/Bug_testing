import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const senderNumber = process.env.TWILIO_PHONE_NUMBER;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";
export const client = twilio(accountSid, authToken);
export const senderNumberConst = senderNumber;
export const whatsappFromConst = whatsappFrom;