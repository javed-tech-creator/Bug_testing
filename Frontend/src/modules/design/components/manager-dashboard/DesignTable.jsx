import { Eye, X, Check } from "lucide-react";

const DesignTable = ({ data }) => {
  return (
    <div className="border-2 border-t-0 rounded-b-sm p-4 overflow-hidden">
      <table className="w-full border border-collapse">

        {/* Table Head */}
        <thead className="bg-gray-900 text-white">
          <tr>
            {["Design ID", "Product", "Date", "Status", "Deadline", "Actions"].map(
              (head) => (
                <th
                  key={head}
                  className="text-left px-4 py-3 text-sm font-semibold border-r last:border-r-0"
                >
                  {head}
                </th>
              )
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-t">

              <td className="px-4 py-3">{row.id}</td>
              <td className="px-4 py-3 font-medium">{row.product}</td>
              <td className="px-4 py-3">{row.date}</td>

              <td className="px-4 py-3">
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-md text-sm">
                  {row.status}
                </span>
              </td>

              <td className="px-4 py-3">{row.deadline}</td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex gap-2 justify-center">
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-500 p-2 rounded-md border-blue-200 border-2">
                    <Eye size={16} />
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DesignTable;
