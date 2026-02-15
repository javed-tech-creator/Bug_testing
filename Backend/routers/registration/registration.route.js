import { Router } from "express";
import { validateSalesUser } from "../../middlewares/sales.middleware/registration.middleware/registration.js";

const registrationRoute = Router();
import {
  registerSalesUser,
  getAllSalesUsers,
  getSalesUserById,
  updateSalesUser,
  deleteSalesUser,
  salesEmployeeList,
  allemployee,
  getAllSalesUsers11
} from "../../controller/registration/registration.controller.js";


registrationRoute.post("/register", validateSalesUser, registerSalesUser);
registrationRoute.get("/all", getAllSalesUsers);

registrationRoute.get("/all/employee-zone-wise", salesEmployeeList)
registrationRoute.get("/all/employee", allemployee)
registrationRoute.get("/get-all/user", getAllSalesUsers11)


registrationRoute.get("/:id", getSalesUserById);
registrationRoute.put("/:id", updateSalesUser);
registrationRoute.delete("/:id", deleteSalesUser);






export default registrationRoute;




