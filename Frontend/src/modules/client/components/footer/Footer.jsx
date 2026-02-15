import React from "react";
import * as Icons from "lucide-react";
import cclogo from "../../../../assets/code.webp";
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6  w-screen">
      <div className="flex items-center ml-20 justify-center">
        {/* Left Section - Company Logo and Copyright */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            © 2025 DSS. All rights reserved.
          </div>
        </div>

        {/* Right Section - Designed & Developed by Code Crafter */}
        <div className="flex items-center ">
          <span className="text-sm text-gray-600">
            {" "}
            &nbsp;Designed & Developed by
          </span>
          <a
            href="https:codecrafter.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-1 py-0.5 rounded-lg transition-colors duration-200 group"
          >
            <img src={cclogo} alt="Code crafter Logo" className="h-10" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
