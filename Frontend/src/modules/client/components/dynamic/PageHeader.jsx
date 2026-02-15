import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const PageHeader = ({
  title,
  subtitle,              // 🆕 subtitle below title
  showStatusBadge,       // 🆕 toggle status badge
  status,                // 🆕 status value
  showProjectStatusFilter,
  onProjectStatusChange,
  showSearch,
  searchValue,
  onSearchChange,
}) => {
  const navigate = useNavigate();

  return (
    <div className="sticky -top-2 z-30 bg-white shadow-md border rounded-sm px-4 py-3 my-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* LEFT */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 border cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 flex-wrap justify-end">
          
          {/* Status Badge */}
          {showStatusBadge && status && (
            <StatusBadge status={status} />
          )}

          {/* Search */}
          {showSearch && (
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border rounded-sm px-3 py-2 text-sm w-64
                focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}

          {/* Status Filter */}
          {showProjectStatusFilter && (
            <select
              className="border rounded-sm px-2 py-2 text-sm"
              onChange={(e) => onProjectStatusChange(e.target.value)}
            >
              <option value="">All Projects</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
