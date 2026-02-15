import React from "react";
import ClientProfileDropdown from "./ClientProfileDropdown";
import { useSelector } from "react-redux";

export default function ClientNavbar() {
  const userData = useSelector((state) => state.auth.userData);
  return (
    <header className="bg-white z-50 shadow-sm border-b w-full border-gray-200 px-6 py-[0.80rem] flex items-center justify-between">
      <p className="font-semibold text-gray-900">{userData?.user?.name}</p>
      {/* Right Section */}
      <div className="flex items-center gap-1 ml-auto relative">
        <ClientProfileDropdown />
      </div>
    </header>
  );
}
