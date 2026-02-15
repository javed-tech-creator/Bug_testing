import Challan from "../../models/accounts/VenderTax/Challan.js";
import { uploadPDFToCloudinary } from "../../../Helpers/finance/cloudinaryFinancePdf.js";

export const uploadChallan = async (req, res) => {
  try {
    const { vendor, type } = req.body;

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileUrl = await uploadPDFToCloudinary(req.file.buffer);

    const challan = new Challan({
      vendor,
      type,
      file: fileUrl,
    });

    await challan.save();

    res.status(201).json({ message: "Challan uploaded to Cloudinary", challan });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
