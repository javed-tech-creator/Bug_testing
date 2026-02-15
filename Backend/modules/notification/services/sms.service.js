// services/smsService.js
import { client, senderNumberConst } from "../config/twilio.config.js";

const sendSMS = async ({ to, message }) => {
  try {
    const info = await client.messages.create({
      body: message,
      from: senderNumberConst,
      to,
    });
    console.log("✅ SMS sent:", info.sid);
    return info;
  } catch (error) {
    console.error("❌ SMS send failed:", error);
    throw error;
  }
};

export default sendSMS;
