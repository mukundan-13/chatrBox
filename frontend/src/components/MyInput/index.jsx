import React from "react";

export default function MyInput({
  placeholder = "Type here",
  onChange = () => {},
  value = "",
  type = "text",
  label,
  error = false,
  errorMessage = "",
  id,
  name,
  required = false,
  disabled = false,
  maxLength,
  className = "",
  onBlur,
  onFocus,
}) {
  const inputId =
    id ||
    `input-${
      label?.toLowerCase().replace(/\s+/g, "-") ||
      Math.random().toString(36).substring(2, 9)
    }`;

  return (
    <div className={`w-full mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <input
        id={inputId}
        name={name || inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`
          w-full px-3 py-2 rounded-md border 
          text-gray-900 dark:text-white 
          bg-white dark:bg-gray-800 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          transition
          ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
        `}
      />

      {error && errorMessage && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-sm text-red-500"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
