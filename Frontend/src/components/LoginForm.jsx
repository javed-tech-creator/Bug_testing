import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ForgotPassword from "./ForgotPassword";
import logo from "../assets/dss_logo.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthLoginMutation, useLoginMutation } from "../api/auth.api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/slices/authSlice";
export default function SignIn({client=false}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [openForgot, setOpenForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const basePath = location.pathname.split("/")[1];
  const validateInputs = () => {
    let isValid = true;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      isValid = false;
    } else {
      setEmailError(false);
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }

    return isValid;
  };

  const [login, { isLoading, error }] = useAuthLoginMutation();
  const routeKey = location.pathname.split("/").slice(-2).join("/");
  // On mount, load saved credentials if route matches
  useEffect(() => {
    const savedData = localStorage.getItem("rememberMeData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData.routeKey === routeKey) {
        setEmail(parsedData.email || "");
        setPassword(parsedData.password || "");
        setRememberMe(true);
      }
    }
  }, [routeKey]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;
    const formData = { email, password };
    try {
      const res = await login({ formData }).unwrap();
      console.log(res);
      dispatch(setUserData(res?.data));
      // toast.success("Login successfull!");
      if (rememberMe) {
        localStorage.setItem(
          "rememberMeData",
          JSON.stringify({ routeKey, email, password })
        );
      } else {
        localStorage.removeItem("rememberMeData");
      }
      if (res?.success) {
        navigate(`/${basePath}/dashboard`);
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(
        err?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };
  const handleForgotPassword = () => {
    console.log("Reset email:", resetEmail);
    setOpenForgot(false);
    setResetEmail("");
  };

  return (
    <div className=" flex items-center justify-center max-w-[26rem] ">
      <div className=" w-full bg-white rounded-lg shadow-sm border border-gray-200 py-6 px-6">
        <Link to="/" className="flex justify-center items-center mb-4">
          <img src={logo} alt="Logo" className="h-20" />
          {/* <h2 className="text-2xl font-semibold text-gray-900">Login</h2>
          <p className="text-gray-600 mt-0.5">Sign in to your account</p> */}
        </Link>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* {error && (
            <div className="text-red-500 font-semibold">{error?.data?.message} !!</div>
          )} */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              UserId / Email / Phone
            </label>
            <input
              id="email"
              name="email"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                emailError
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-600">Invalid email address</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  passwordError
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          <div className="flex px-0.5 items-center justify-between mt-3">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-[0.84rem]">
              <button
                type="button"
                onClick={() => setOpenForgot(true)}
                className="font-medium underline cursor-pointer text-blue-500 hover:text-blue-600 focus:outline-none focus:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={` ${
              isLoading ? "cursor-not-allowed" : "cursor-pointer"
            } w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button className="font-medium underline cursor-pointer text-blue-500 hover:text-blue-600 focus:outline-none focus:underline">
              Contact HR Department
            </button>
          </p>
        </div>

        {client && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              🔒 Your data is 100% secure with DSS
            </p>
          </div>
        )}
      </div>

      {/* Forgot Password Dialog */}
      <ForgotPassword
        open={openForgot}
        handleClose={() => setOpenForgot(false)}
      />
    </div>
  );
}
