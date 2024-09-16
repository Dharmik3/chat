import React, { useState } from "react";
import { IoMdLock } from "react-icons/io";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { checkUserExists } from "../../services/firebase";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "../../components/Loader";
import { User } from "../../types";

export const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();

  const navigate = useNavigate();

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // validation
    if (!phoneNumber.trim() || !password.trim()) {
      toast("Fields are required");
    }

    try {
      setIsLoading(true);
      // chaeck the phone number is exist or not
      const result = await checkUserExists(phoneNumber);
      if (result.exists) {
        const userData = result.user as User;

        // Compare entered password with hashed password
        const isPasswordValid = await bcrypt.compare(
          password, //entered password
          // @ts-ignore
          userData.password //hashed password
        );

        if (isPasswordValid) {
          setUser(userData);
          // store user in local storage to avoid re login on refresh
          localStorage.setItem("user", JSON.stringify(userData));
          toast.success("Logged in successfully!");
          navigate("/");
        } else {
          toast.error("Incorrect credentials. Please try again.");
          console.error("Incorrect credentials."); // invalid credentials
        }
      } else {
        console.error("User not found.");
        toast.error("User not found. Please sign up first.");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("Error during sign-in. Please try again later.");
    } finally {
      // set loader to false
      setIsLoading(false);
    }
  };

  return (
    <form className="max-w-md mx-auto flex flex-col justify-center h-screen p-4 md:p-6 lg:p-8 xl:p-10">
      <div className="flex justify-center mb-8 bg-blue-700 w-12 h-12 max-w-12 mx-auto rounded-full items-center">
        <IoMdLock size={32} color="white" />
      </div>

      {/* Phone number field */}
      <label
        htmlFor="phone-input"
        className="mb-2 text-sm font-medium text-gray-900"
      >
        Phone number
      </label>
      <div className="relative mt-2">
        <div className="absolute top-2 left-0 flex items-center pl-3">
          <div className="h-full text-sm flex justify-center items-center bg-transparent text-slate-700 focus:outline-none ">
            <span id="dropdownSpan">+91</span>
          </div>
          <div className="h-6 border-l border-slate-200 ml-2"></div>
        </div>
        <input
          type="tel"
          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-14 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 mb-10"
          placeholder="324-456-2323"
          pattern="[0-9]*"
          id="phoneNumberInput"
          inputMode="numeric"
          maxLength={10}
          onChange={(e) => setPhoneNumber(e.target.value)}
          autoComplete="mobile tel"
        />
      </div>

      {/* Password field */}
      <label
        htmlFor="phone-input"
        className="mb-2 text-sm font-medium text-gray-900"
      >
        Password
      </label>
      <div className="relative mt-2">
        <input
          type="password"
          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pr-3 pl-4 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 "
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      {/* Button with spinner */}
      <button
        type="submit"
        className="text-white w-full bg-blue-700 hover:bg-blue-800 font-medium rounded-md text-sm px-5 py-2.5 me-2 mb-2 mt-8"
        onClick={signIn}
      >
        {isLoading ? <Loader /> : "Log In"}
      </button>

      {/* signup link */}
      <p className="text-sm text-gray-600 mt-2">
        Don't have an account?{" "}
        <button
          className="text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => navigate("/signup")}
        >
          Sign up
        </button>
      </p>
    </form>
  );
};
