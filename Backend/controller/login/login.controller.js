import AppError from "../../utils/appError.js";
// import loginService from "../../services/login/loginService.js";
import { generate_Token } from "../../middlewares/auth.js";
import saleRegistrationModel from "../../models/registration/registration.model.js";
import bcrypt from "bcrypt";
const loginController = {
    async login(req, res, next) {
        try {
            // $or: [
            //     { email: identifier },
            //     { phone: identifier },
            //     { empId: identifier }
            // ]

            const { email, password, role } = req.body;
            const loginData = await saleRegistrationModel.findOne({ email });
            console.log(loginData);
            // if (role !== loginData.role) {
            //     return next(new AppError("Invalid Role", 402));
            // }
            if (!loginData) {
                return next(new AppError("Invalid email or password.", 402));
            }
            const isPasswordValid = await bcrypt.compare(password, loginData.password);
            if (!isPasswordValid) {
                return next(new AppError("Invalid email or password.", 402));
            }
            const token = await generate_Token(loginData);
            res.cookie("authToken", token, {
                httpOnly: true,       // ✅ Prevents JavaScript access to the cookie
                secure: true,         // ✅ Ensures cookie is only sent over HTTPS
                sameSite: "none",     // ✅ Required when using cross-site requests (e.g., frontend on different domain)
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            const data = {
                id: loginData._id,
                email: loginData.email,
                role: loginData.role,
                token: token,
                allData: loginData
            }

            res.status(200).json({
                success: true,
                message: "login",
                data,
            })

        } catch (err) {
            return next(new AppError(err.message, 500));
        }
    },

   
    async otpSendEmail(req, res, next) {
        try {
            const { email } = req.body;
            console.log("email", email);
            if (!email) {
                return res.status(400).json({ message: "Email is required" });
            }

            const result = await registrationModel.findOne({ email: email });
            if (!result) {
                return next(new AppError("User not found", 400));
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
            // Save OTP to DB
            await otpModel.create({ email, otp });
            // Send OTP to email
            await sendOtp(email, otp);
            return res.status(200).json({ success: true, message: "OTP sent successfully to your email" });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: err.message });
        }
    }

}

export default loginController;