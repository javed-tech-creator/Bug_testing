
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { setUserData } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
export default function LoginForm() {
    const [method, setMethod] = useState("mobile")
    const [step, setStep] = useState("input")
    const [value, setValue] = useState("")
    const [error, setError] = useState("")
    const [otp, setOtp] = useState(["", "", "", ""])
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // 🔹 Validate mobile/email
    const validateInput = () => {
        if (method === "mobile") {
            if (!/^[6-9]\d{9}$/.test(value)) {
                setError("Enter valid 10-digit mobile number")
                return false
            }
        } else {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                setError("Enter valid email address")
                return false
            }
        }
        setError("")
        return true
    }

    const handleGetOtp = () => {
        if (validateInput()) {
            setStep("otp")
        }
    }

    const handleOtpChange = (val, i) => {
        if (!/^\d?$/.test(val)) return
        const newOtp = [...otp]
        newOtp[i] = val
        setOtp(newOtp)

        if (val && i < 3) {
            document.getElementById(`otp-${i + 1}`).focus()
        }
    }

    const handleVerify = () => {
        const enteredOtp = otp.join("")

        if (enteredOtp === "1234") {
            dispatch(setUserData({ userid: value }));
            navigate("/client/dashboard")
        } else {
            alert("Invalid OTP")
        }
    }

    return (
        <div className="w-full max-w-md">
            <h2 className="text-3xl font-semibold text-center mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
                Choose your preferred login method
            </p>

            {step === "input" && (
                <>
                    <div className="flex bg-blue-50 rounded-md p-2 mb-6">
                        <button
                            onClick={() => setMethod("mobile")}
                            className={`flex-1 py-2 text-sm rounded-md ${method === "mobile" ? "bg-white shadow" : "text-gray-600"}`}
                        >
                            Mobile Number
                        </button>
                        <button
                            onClick={() => setMethod("email")}
                            className={`flex-1 py-2 text-sm rounded-md ${method === "email" ? "bg-white shadow" : "text-gray-600"}`}
                        >
                            Email Address
                        </button>
                    </div>

                    <div className="mb-2">
                        <label className="text-sm font-medium block mb-1">
                            {method === "mobile" ? "Mobile Number" : "Email Address"}
                        </label>
                        <input
                            type={method === "mobile" ? "tel" : "email"}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>

                    <button
                        onClick={handleGetOtp}
                        className="w-full bg-blue-600 text-white py-2 rounded-md font-medium"
                    >
                        Get OTP
                    </button>
                </>
            )}

            {step === "otp" && (
                <>
                    <p className="text-sm text-gray-600 text-center mb-4">
                        OTP sent to <span className="font-semibold">{value}</span>
                    </p>

                    <div className="flex justify-center gap-3 mb-4">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                id={`otp-${i}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(e.target.value, i)}
                                className="w-12 h-12 text-center text-lg border rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={otp.join("").length !== 4}
                        className={`w-full py-2 rounded-md font-medium ${otp.join("").length === 4
                            ? "bg-blue-600 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        Verify OTP
                    </button>

                    <button
                        onClick={() => setStep("input")}
                        className="w-full mt-3 text-sm text-blue-600"
                    >
                        Change {method === "mobile" ? "Number" : "Email"}
                    </button>
                </>
            )}

            <p className="text-xs text-gray-500 text-center mt-4">
                Secured by Enterprise ERP
            </p>
        </div>
    )
}
