import TaxRecord from "../../../models/accounts/VenderTax/TaxRecord.js";
import { Parser } from "json2csv";

export const exportGSTReport = async (req, res) => {
  try {
    const records = await TaxRecord.find().populate("vendor payment");

    const fields = [
      "vendor.name",
      "vendor.gst",
      "tds",
      "gstType",
      "gstr1Filed",
      "gstr3BFiled",
      "filingDate",
      "filingDueDate",
      "tdsDeposited",
      "challanProof"
    ];

    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(records);

    res.header("Content-Type", "text/csv");
    res.attachment("gst_report.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};