import empIdModel from "../../models/unique/unique.empId.js";
import ProjectCounterModel from "../../models/unique/unique.project.id.model.js";
export const getNextEmployeeId = async () => {
  const counter = await empIdModel.findByIdAndUpdate(
    { _id: 'employeeId' }, // fixed ID
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const numberPart = String(counter.seq).padStart(4, '0');
  return `DSS${numberPart}`;
};



export const generateProjectId = async () => {
     const currentYear= new Date().getFullYear().toString();

     const counter=await ProjectCounterModel.findOneAndUpdate(
      {year:currentYear},
      {$inc:{seq:1}},
      { new: true, upsert: true }
     )

     const numberPart=String(counter.seq).padStart(4,'0');
     return `DSS/${currentYear}/${numberPart}`;
};