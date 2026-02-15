
import Joi from "joi";

export const validateLead = (req, res, next) => {
  const { contactPerson, phone, email } = req.body;
  
  if (!contactPerson || !phone) {
    return res.status(400).json({ success: false, message: "Contact Person and Phone are required" });
  }
  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format" });
  }

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ success: false, message: "Invalid phone number" });
  }

  next();
};



export const validateLeadInput = (req, res, next) => {
  const schema = Joi.object({
    leadSource: Joi.string().valid("Website", "Referral", "IndiaMart", "Other"),
    leadType: Joi.string().valid("Fresh", "Repeated"),
    queryDate: Joi.date(),

    senderName: Joi.string().allow(null, ''),
    contactPerson: Joi.string(),
    concernedPerson: Joi.string().allow(null, ''),
    company: Joi.string().allow(null, ''),
    concernedPersonNumber: Joi.string().allow(null, ''),
    remark: Joi.string().allow(null, ''),
    clientRatingInBusiness: Joi.string().allow(null, ''),
    price: Joi.number(),
    payamout: Joi.number(),

    email: Joi.string().email().allow("", null),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/),

    address: Joi.string().allow(null, ''),
    pinCode: Joi.string().pattern(/^\d{6}$/).allow(null, ''),
    sender: Joi.string().allow(null, ''),
    requirement: Joi.string().allow(null, ''),

    recceStatus: Joi.string().valid("Hot", "Warm", "Cold", "Loss", "Win"),
    status: Joi.string().valid("pending", "inprogress", "success", "close"),

    assignedId: Joi.string().allow(null, ''),
    saleEmployeeId: Joi.string().allow(null, ''),
    notes: Joi.string().allow('', null),
  });

  try {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true, // 🔥 FIX: This must be an object
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors: error.details.map((err) => err.message),
      });
    }

    req.body = value;
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export const validateEmailPasswordPhone = (req, res, next) => {
  const { email, password, phone } = req.body;

  const phoneRegex = /^[6-9]\d{9}$/;
  if (phone&&!phoneRegex.test(phone)) {
    return res.status(400).json({ success: false, message: "Invalid phone number" });
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
  }
  if (password && password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
  }

  next();
};

