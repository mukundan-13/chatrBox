import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import MyButton from "../../components/MyButton";
import { sendOtp, verifyOtp } from "../../userApi";
import { loginSuccess } from "../../userSlice";

export default function OtpVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(30);
  const [isTimeOut, setIsTimeOut] = useState(false);
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("storedPhoneNumber");
    if (!storedPhoneNumber) {
      navigate("/login");
    } else {
      setPhoneNumber(storedPhoneNumber);
    }
  }, [navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsTimeOut(true);
    }
  }, [timer]);

  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setErrorMessage("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await verifyOtp({ phoneNumber, otp: enteredOtp });

      if (response?.token) {
        dispatch(
          loginSuccess({
            id: response.id,
            name: response.name,
            phoneNumber: response.phoneNumber,
            about: response.about || "",
            profileImageUrl: response.profileImageUrl || "",
            token: response.token,
          })
        );

        localStorage.setItem("authToken", response.token);
        localStorage.removeItem("storedPhoneNumber");
        navigate("/");
      }
    } catch (err) {
      setErrorMessage("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await sendOtp({ phoneNumber });
      setTimer(30);
      setIsTimeOut(false);
    } catch (err) {
      setErrorMessage("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-2">Verification Code</h2>
        <p className="text-sm text-gray-600 text-center mb-1">
          Enter the 6-digit code sent to your mail-id on 
        </p>
        <p className="text-center font-medium text-gray-800 mb-4">{phoneNumber}</p>

        {errorMessage && (
          <p className="text-center text-red-500 text-sm mb-4">{errorMessage}</p>
        )}

        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-10 h-12 border rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          ))}
        </div>

        <MyButton
          name="Verify"
          onClick={handleVerify}
          loading={loading}
        />

        <div className="mt-4 text-center text-sm text-gray-700">
          Didn’t receive code?{" "}
          {isTimeOut ? (
            <span
              onClick={handleResend}
              className="text-blue-600 cursor-pointer underline"
            >
              Resend
            </span>
          ) : (
            <span className="text-gray-500">Resend in 00:{timer < 10 ? `0${timer}` : timer}</span>
          )}
        </div>

        <div className="text-xs text-center text-gray-400 mt-6">
          © 2025 Chatoo. All rights reserved.
        </div>
      </div>
    </div>
  );
}
