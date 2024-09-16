import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdLock } from "react-icons/io";
import bcrypt from "bcryptjs";
import { toast, ToastContainer } from "react-toastify";
import { doc, setDoc } from "firebase/firestore";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { auth, firestore } from "../../services/firebaseConfig";
import { checkUserExists } from "../../services/firebase";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export const Signup = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // send otp function
  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setIsLoading(true);
    const formattedPhoneNumber = `+91${phoneNumber}`;

    try {
      const result = await checkUserExists(phoneNumber);

      if (result.exists) {
        toast.error("User already exists. Please login.");
        navigate("/login");
      } else {
        const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {
          size: "invisible",
        });
        const confirmation = await signInWithPhoneNumber(
          auth,
          formattedPhoneNumber,
          recaptcha
        );
        setConfirmationResult(confirmation);
        setIsOtpSent(true);
        toast.success("OTP sent successfully.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // verifying otp
  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (confirmationResult && otp) {
      setIsLoading(true);
      try {
        await confirmationResult.confirm(otp);
        setIsOtpVerified(true);
        toast.success("OTP verified successfully.");
      } catch (error) {
        console.error("Error verifying OTP:", error);
        toast.error("Error verifying OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isOtpVerified) {
      try {
        // Hash the password using bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10);
        // Get current authenticated user UID after OTP verification
        const uid = auth.currentUser?.uid;
        if (uid) {
          // Store user details in Firestore with name, phone number and hashed password
          const user = await setDoc(doc(firestore, "users", uid), {
            name: name,
            phoneNumber,
            password: hashedPassword, // Store hashed password
            createdAt: new Date().toISOString(),
          });
          console.log({ user });
          toast.success("User signed up successfully.");
          navigate("/login");
        } else {
          console.error("No authenticated user found after OTP verification");
          toast.error("No authenticated user found after OTP verification.");
        }
      } catch (error) {
        console.error("Error during sign-up:", error);
        toast.error("Error during sign-up. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      console.error("OTP not verified.");
      toast.error("OTP not verified. Please verify OTP first.");
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col justify-center h-screen p-4 md:p-6 lg:p-8 xl:p-10">
      <form className="flex-1 flex flex-col justify-center">
        <div className="flex justify-center mb-8 bg-blue-700 w-12 h-12 max-w-12 mx-auto rounded-full items-center">
          <IoMdLock size={32} color="white" />
        </div>

        {/* Name Field */}
        <label
          htmlFor="name-input"
          className="mb-2 text-sm font-medium text-gray-900"
        >
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-4 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 mb-4"
          placeholder="Your Name"
          required
          autoComplete="name"
          readOnly={isOtpSent}
        />

        {/* Phone Number Field */}
        <label
          htmlFor="phone-input"
          className="mb-2 text-sm font-medium text-gray-900"
        >
          Phone number
        </label>
        <div className="relative mt-2">
          <div className="absolute top-2 left-0 flex items-center pl-3">
            <div className="h-full text-sm flex justify-center items-center bg-transparent text-slate-700 focus:outline-none">
              <span id="dropdownSpan">+91</span>
            </div>
            <div className="h-6 border-l border-slate-200 ml-2"></div>
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-14 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 mb-4"
            placeholder="324-456-2323"
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength={10}
            required
            autoComplete="mobile tel"
            readOnly={isOtpSent}
          />
        </div>

        {/* OTP Field  */}
        {isOtpSent && !isOtpVerified && (
          <>
            <label
              htmlFor="otp-input"
              className="mb-2 text-sm font-medium text-gray-900"
            >
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-4 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 mb-4"
              placeholder="123456"
              required
            />
            <button
              onClick={verifyOtp}
              type="submit"
              className="text-white w-full bg-blue-700 hover:bg-blue-800 font-medium rounded-md text-sm px-5 py-2.5 mb-2 mt-8"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </>
        )}

        {/* Password Field - shown after OTP is verified */}
        {isOtpVerified && (
          <>
            <label
              htmlFor="phone-input"
              className="mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-4 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 "
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="text-white w-full bg-blue-700 hover:bg-blue-800 font-medium rounded-md text-sm px-5 py-2.5 mb-2 mt-8"
              onClick={signUp}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </>
        )}

        {!isOtpVerified && !isOtpSent && (
          <button
            onClick={sendOtp}
            type="submit"
            className="text-white w-full bg-blue-700 hover:bg-blue-800 font-medium rounded-md text-sm px-5 py-2.5 mb-2 mt-8"
          >
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {/* ReCaptcha */}
        <div id="recaptcha"></div>

        <p className="text-sm text-gray-600 mt-2">
          Already have an account?{" "}
          <button
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};
