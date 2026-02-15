import TaxRecord from "../../../models/accounts/VenderTax/TaxRecord.js";
 

 

export const getTaxRecords = async (req, res) => {
  try {
    const records = await TaxRecord.find().populate("vendor payment");
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTaxRecordById = async (req, res) => {
  try {
    const record = await TaxRecord.findById(req.params.id).populate("vendor payment");
    if (!record) return res.status(404).json({ message: "Tax record not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTaxRecord = async (req, res) => {
  try {
    const record = await TaxRecord.findById(req.params.id).populate("payment vendor");
    if (!record) return res.status(404).json({ message: "Tax record not found" });

    // Update fields from body
    const { tds, gstr1Filed, gstr3BFiled, challanProof } = req.body;

    if (tds != null) record.tds = tds;
    if (gstr1Filed != null) record.gstr1Filed = gstr1Filed;
    if (gstr3BFiled != null) record.gstr3BFiled = gstr3BFiled;

    // TDS deposit logic: agar challanProof uploaded hai, mark as deposited
    if (challanProof) {
      record.challanProof = challanProof;
      record.tdsDeposited = true;
    }

    await record.save();

    res.json({ message: "Tax record updated", record });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTaxRecord = async (req, res) => {
  try {
    const record = await TaxRecord.findByIdAndDelete(req.params.id);
    if (!record) return res.status(404).json({ message: "Tax record not found" });
    res.json({ message: "Tax record deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
