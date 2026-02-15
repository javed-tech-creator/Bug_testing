// import { Plus } from "lucide-react";
// import React from "react";
// import { Link } from "react-router-dom";

// function PageHeader({ title = "Title", path = "", btnTitle = "Add" }) {
//   return (
//     <div className="mb-6">
//       <div className="w-full rounded-lg shadow-md bg-white border-l-4 border-black transition duration-300 hover:shadow-lg">
//         <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
//           {/* Title */}
//           <h2 className="text-xl font-semibold animate-bounce px-2 text-gray-800">
//             !! {title} !!
//           </h2>

//           {/* Button */}
//           {path && (
//             <Link
//               to={path}
//               className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md font-medium transition duration-200 shadow-sm hover:shadow-md"
//             >
//               <Plus size={18} />
//               {btnTitle}
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PageHeader;

import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react"; // 👈 icon import karna bhul gaye the

function PageHeader({
  title = "Title",
  path = null,
  btnTitle = "Add New",
  onClick = null,
}) {
  return (
    <div className="w-full mb-6">
      <div className="border-l-4 border-black rounded-lg shadow-md bg-white p-2 hover:shadow-lg transition duration-300">
        <div className="flex items-center justify-between bg-gray-50 p-1 border border-gray-200 rounded-md">
          {/* Title */}
          <h2 className="text-xl animate-bounce px-4 font-semibold">
            !! {title} !!
          </h2>

          {/* Optional Button */}
          {path ? (
            <Link
              to={path}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-md font-medium transition duration-200 shadow-sm hover:shadow-md"
            >
              <Plus size={18} />
              {btnTitle}
            </Link>
          ) : onClick ? (
            <button
              onClick={onClick}
              className={`flex cursor-pointer items-center gap-1 px-3 py-1 rounded-md font-medium transition duration-200 shadow-sm hover:shadow-md
        ${
          btnTitle === "Back"
            ? "bg-black hover:bg-gray-800 text-white"
            : "bg-orange-500 hover:bg-orange-600 text-white"
        }`}
            >
              {btnTitle === "Back" ? (
                <ArrowLeft size={18} />
              ) : (
                <Plus size={18} />
              )}
              {btnTitle}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default PageHeader;
