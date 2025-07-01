import React from "react";
import { logout, userData } from "../../userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SideNavBar({ activeTab, onTabChange }) {
  const user = useSelector(userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  const img =
    user.profileImageUrl ||
    "https://res.cloudinary.com/dapki3g81/image/upload/v1747918087/icon-5359553_1280_lml1l5.png";

  return (
    <div className="w-[72px] h-screen bg-[#202c33] flex flex-col items-center justify-between py-4 border-r border-[#2f3a40]">
      <div className="flex flex-col items-center space-y-4">
        {/* Chats icon */}
        <div
          onClick={() => onTabChange("chats")}
          className={`p-3 rounded-full cursor-pointer transition-all duration-200 ${
            activeTab === "chats" ? "bg-[#2a3942]" : "hover:bg-[#2a3942]"
          }`}
        >
          <svg
            className={`w-6 h-6 ${
              activeTab === "chats"
                ? "text-white"
                : "text-white/70 group-hover:text-white"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M20,16H6l-2,2V4h16V16z" />
          </svg>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center space-y-4">
        <div
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-transparent hover:border-[#00a884]"
          onClick={() => onTabChange("profile")}
        >
          <img
            src={img}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Logout */}
        <div
          onClick={handleLogOut}
          title="Logout"
          className="p-3 rounded-full hover:bg-red-600 transition-all cursor-pointer"
        >
          <svg
            className="w-6 h-6 text-white/70 hover:text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17,7l-1.41,1.41L18.17,11H8v2h10.17l-2.58,2.59L17,17l5-5L17,7z M4,5h8V3H4C2.9,3,2,3.9,2,5v14c0,1.1,0.9,2,2,2h8v-2H4V5z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
