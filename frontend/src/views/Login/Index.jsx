import React, { useState } from "react";
import PhoneNumberInput from "../../components/PhoneNumberInput";
import MyButton from "../../components/MyButton";
import { sendOtp } from "../../userApi";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [userData, setUserData] = useState({
    countryCode: "+91", // default country code
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const onInputChange = (name, data) => {
    setUserData((prevData) => ({ ...prevData, [name]: data }));
  };

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);

    const payload = {
      phoneNumber: `${userData.countryCode}${userData.phoneNumber}`,
    };

    try {
      const response = await sendOtp(payload);
      console.log("Sending OTP Successful: ", response);
      localStorage.setItem("storedPhoneNumber", payload.phoneNumber);
      navigate("/otp-verification");
    } catch (error) {
      console.error("OTP Sending Error:", error);
      setErrorMessage("OTP Sending Failed! Try Again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-2 text-center">Login to Chatrbox</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Simple, secure, reliable messaging
        </p>

        {errorMessage && (
          <div className="text-red-600 text-sm mb-3 text-center">
            {errorMessage}
          </div>
        )}

        <div className="mb-4">
          <PhoneNumberInput
            label="Phone Number"
            name="phoneNumberInput"
            id="phoneNumberInput"
            numberPlaceholder="Enter your number"
            countryCodeValue={userData.countryCode}
            numberValue={userData.phoneNumber}
            onCountryCodeChange={(e) =>
              onInputChange("countryCode", e.target.value)
            }
            onNumberChange={(e) =>
              onInputChange("phoneNumber", e.target.value)
            }
          />
        </div>

        <MyButton name="Continue" onClick={handleLogin} loading={loading} />

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 underline">
            Register
          </a>
        </p>

        <div className="text-xs text-center text-gray-400 mt-6">
          © 2025 Chatrbox. All rights reserved.
        </div>
      </div>
    </div>
  );
}
