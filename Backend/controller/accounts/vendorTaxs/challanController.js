

import vendortaxChallan from "../../../models/accounts/VenderTax/Challan.js";
import TaxRecord from "../../../models/accounts/VenderTax/TaxRecord.js";
import { uploadPDFToCloudinary } from "../../../Helpers/finance/cloudinaryFinancePdf.js";


export const uploadChallan = async (req, res) => {
  try {

    const { vendorLedger, type } = req.body; // ledger id from frontend
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // upload PDF to Cloudinary
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const fileUrl = await uploadPDFToCloudinary(req.file.path);
    console.log("Cloudinary URL:", fileUrl);

    const challan = new vendortaxChallan({
      vendorLedger,
      type,
      file: fileUrl
    });
    await challan.save();

    // update TaxRecord
    const updateData = {
      challanProof: fileUrl,
      autoEmailSent: false
    };
    if (type === "TDS") updateData.tdsDeposited = true;

    await TaxRecord.findByIdAndUpdate(vendorLedger,  { 
    $set: { 
      challanProof: fileUrl, 
      tdsDeposited: type === 'TDS' ? true : false, 
      autoEmailSent: false 
    } 
  },
  { new: true });

    res.status(201).json({ message: "Challan uploaded to Cloudinary", challan });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
