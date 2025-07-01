import React from "react";

export default function PhoneNumberInput({
  label = "Phone Number",
  countryCodePlaceholder = "+91",
  numberPlaceholder = "Enter your number",
  onCountryCodeChange = () => {},
  onNumberChange = () => {},
  countryCodeValue = "",
  numberValue = "",
  error = false,
  errorMessage = "",
  id,
  name,
  required = false,
  disabled = false,
  maxLengthCountryCode = 5,
  maxLengthNumber = 10,
}) {
  const inputId = id || `phone-number-${Math.random().toString(36).slice(2, 9)}`;
  const countryCodeId = `${inputId}-country-code`;
  const numberId = `${inputId}-number`;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="flex gap-2">
        <input
          id={countryCodeId}
          name={name ? `${name}-country-code` : countryCodeId}
          type="text"
          placeholder={countryCodePlaceholder}
          value={countryCodeValue}
          onChange={onCountryCodeChange}
          maxLength={maxLengthCountryCode}
          disabled={disabled}
          className={`w-1/4 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
            error ? "border-red-500 ring-red-100" : "border-gray-300 focus:ring-blue-100"
          }`}
        />
        <input
          id={numberId}
          name={name ? `${name}-number` : numberId}
          type="tel"
          placeholder={numberPlaceholder}
          value={numberValue}
          onChange={onNumberChange}
          maxLength={maxLengthNumber}
          disabled={disabled}
          className={`w-3/4 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 ${
            error ? "border-red-500 ring-red-100" : "border-gray-300 focus:ring-blue-100"
          }`}
        />
      </div>
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-500" id={`${inputId}-error`}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
