import React, { useState } from "react";
import { registerUser, sendOtp } from "../../userApi";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    countryCode: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    setLoading(true);
    setErrorMessage(null);
    const payload = {
      name: userData.name,
      email: userData.email,
      phoneNumber: `${userData.countryCode}${userData.phoneNumber}`,
    };

    try {
      const responseData = await registerUser(payload);
      if (responseData.code === "0") {
        await sendOtp(payload);
        localStorage.setItem("storedPhoneNumber", payload.phoneNumber);
        navigate("/otp-verification");
      } else {
        setErrorMessage("Registration failed. Try again.");
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {errorMessage && (
          <div className="text-red-600 text-sm mb-3 text-center">{errorMessage}</div>
        )}

        <div className="mb-3">
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Country Code</label>
          <input
            type="text"
            name="countryCode"
            value={userData.countryCode}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="+91"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Enter phone number"
          />
        </div>

        <button
          onClick={handleNext}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
        >
          {loading ? "Loading..." : "Next"}
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          By registering, you agree to our{" "}
          <a href="#" className="text-blue-600 underline">Terms</a> and{" "}
          <a href="#" className="text-blue-600 underline">Privacy Policy</a>.
        </p>

        <p className="text-xs text-center text-gray-500 mt-2">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">Login</a>
        </p>
      </div>
    </div>
  );
}
