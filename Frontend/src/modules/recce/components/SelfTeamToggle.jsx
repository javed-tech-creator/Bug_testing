import React from "react";
import { User, Users } from "lucide-react";

const SelfTeamToggle = ({ value = "self", onChange }) => {
  return (
    <div className="flex bg-green-50 rounded-lg p-1 w-fit">
      {/* Self */}
      <button
        type="button"
        onClick={() => onChange("self")}
        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all
          ${
            value === "self"
              ? "bg-green-600 text-white shadow"
              : "text-green-700 hover:bg-green-100"
          }`}
      >
        <User size={16} />
        Self
      </button>

      {/* Team */}
      <button
        type="button"
        onClick={() => onChange("team")}
        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all
          ${
            value === "team"
              ? "bg-green-600 text-white shadow"
              : "text-green-700 hover:bg-green-100"
          }`}
      >
        <Users size={16} />
        Team
      </button>
    </div>
  );
};

export default SelfTeamToggle;
