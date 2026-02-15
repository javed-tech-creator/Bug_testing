
export const validateSalesUser = (req, res, next) => {
  const { name, email, phoneNo, whatsappNo, altNo, password, role } = req.body;

  // Basic required fields
  if (!name || !email || !phoneNo || !password || !role) {
    return res.status(400).json({ success: false, message: "Name, Email, Phone No, Password and Role are required" });
  }

  // Regex patterns
  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Email validation
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  // Phone number validations
  if (!phoneRegex.test(phoneNo)) {
    return res.status(400).json({ success: false, message: "Invalid phone number" });
  }

  if (whatsappNo && !phoneRegex.test(whatsappNo)) {
    return res.status(400).json({ success: false, message: "Invalid WhatsApp number" });
  }

  if (altNo && !phoneRegex.test(altNo)) {
    return res.status(400).json({ success: false, message: "Invalid Alternate number" });
  }

  // Password length check
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
  }

  next();
};
