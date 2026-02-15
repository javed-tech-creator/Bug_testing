
// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import registrationModel from "../../models/registration/registration.model.js";

// Hardcoded user role middleware (dummy testing ke liye)
export const mockUser = async(req, res, next) => {

    const { authToken } = req.cookies;  //  yaha se nikala

   const userId = req.headers['userid'];
  
    if (authToken) {
      // return res.status(401).json({success:false, message: "No token found" });
    // verify the token
    const decoded = jwt.verify(authToken, process.env.SECRET_KEY);

    const user = await registrationModel.findById(decoded.id)    
      req.user = { 
                   role:user.role,
                   _id: user._id 
                  };  
     next();
    }else if(userId){
  const user = await registrationModel.findById(userId)    
      req.user = { 
                   role:user.role,
                   _id: user._id 
                  };  
     next();

    }else{
  // yaha apna role set karo -> "Manager" ya "HOD" ya "Employee"
  req.user = { role: "Manager", _id:"68c52c7882e6b127de95a4a2"};   //for manager 
  // req.user = { role: "Employee", _id:"68c52cb182e6b127de95a4a6"};    //for Employee
  // req.user = { role: "Employee", _id:null};    //for Employee
  next();
}
};


export const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // req.user token ke baad attach hoga
    if (!roles.includes(userRole)) {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }
    next();
  };
};
