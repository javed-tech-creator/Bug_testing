import { transporter } from "../config/mailer.config.js";

const sendEmail = async ({ to, subject, text = "text", html, body,attachments }) => {
  console.log("Hellloword")
  if (!to || !subject) throw new Error("Missing 'to' or 'subject'");
  try {
    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: body || html ||  `<p>${text}</p>`,
      attachments: attachments || [],
    });
    console.log("✅ Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw error;
  }
};

export default sendEmail;
