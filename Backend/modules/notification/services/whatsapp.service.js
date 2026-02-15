import { client, whatsappFromConst } from "../config/twilio.config.js";

const sendWhatsAppMessage = async ({ to, contentSid, contentVariables }) => {
  try {
    const message = await client.messages.create({
      from: whatsappFromConst,
      to: `whatsapp:${to.replace(/^whatsapp:/, "")}`,
      contentSid,
      contentVariables: JSON.stringify(contentVariables || {}),
    });
    console.log("✅ WhatsApp message sent:", message.sid);
    return message;
  } catch (err) {
    console.error("❌ WhatsApp send failed:", err.message);
    throw err;
  }
};

export default sendWhatsAppMessage;
