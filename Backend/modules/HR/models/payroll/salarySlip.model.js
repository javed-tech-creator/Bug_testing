import mongoose, {model,Schema} from "mongoose"
 

const salarySlipSchema=new Schema (
    {
         employeeId:{
           type: mongoose.Schema.Types.ObjectId,
               ref: "EmployeeProfile",
               required: true,
         }, 
         actualSalary:{
            type:String
         },
         totalDay:{
            type:String
         },
         presentDay:{
            type:String
         },
         absentDay:{
            type:String
         },
         estimateSalary:{
            type:String
         }
    },
    {
        timestamps:true
    }
)

const salarySlipModel=model("SalarySlip",salarySlipSchema);

export default salarySlipModel;