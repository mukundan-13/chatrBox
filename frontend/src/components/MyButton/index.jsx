import React from "react";

export default function MyButton({
  name = "Submit",
  onClick,
  loading = false,
  disabled = false,
  size = "md",
  icon = null,
  danger = false,
  ghost = false,
  width = "w-full",
  mt = "mt-0",
}) {
  const baseColor = danger ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500";
  const ghostStyle = ghost ? "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50" : baseColor;

  const sizeClasses = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-5 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`rounded-md text-white font-medium ${width} ${mt} transition duration-200 ease-in-out
        ${ghostStyle} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${sizeClasses[size]}
      `}
    >
      {loading ? (
        <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {name}
        </>
      )}
    </button>
  );
}
