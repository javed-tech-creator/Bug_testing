import { useGetUserByBranchQuery } from '@/api/sales/lead.api';
import { User, TrendingUp, Users, Eye, Phone, Mail } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function EmployeeListPage() {
  const navigate = useNavigate();

  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};

  const { data, isLoading } = useGetUserByBranchQuery({
    branchId: user?.branch?._id,
    deptId: user?.department?._id,
  });

  const employees = data?.data.users || [];

  const handleViewProfile = (id) => {
    navigate(`/sales/salesEmployee/profile/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 font-medium">Loading employees...</p>
      </div>
    );
  }

const filteredEmployees = employees.filter(
  (emp) => emp._id !== user?._id
);


  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl border p-3 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-orange-600" />
          <div>
            <h1 className="text-xl font-bold">Sales Team</h1>
            <p className="text-sm text-gray-500">
              Branch: {user?.branch?.title || 'N/A'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <span className="font-semibold text-orange-700">
            Total: {employees.length}
          </span>
        </div>
      </div>

      {/* Employee Cards */}
      {filteredEmployees.length === 0 ? (
        <p className="text-center text-gray-500">No employees found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => (
            <div
              key={emp._id}
              // onClick={() => handleViewProfile(emp._id)}
              className="bg-white border rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all group"
            >
              {/* Top */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-orange-600" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{emp.name}</h3>
                  <p className="text-sm text-gray-500">{emp.designation}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      emp.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>ID:</strong> {emp.userId}
                </p>
                <p>
                  <strong>Branch:</strong> {emp.branch}
                </p>
                <p>
                  <strong>Zone:</strong> {emp.zone}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {emp.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {emp.email}
                </p>
              </div>

              {/* Footer */}
              {/* <div className="mt-4 flex justify-end">
                <span className="text-orange-600 text-sm font-medium flex items-center gap-1 group-hover:underline">
                  View Profile <Eye className="w-4 h-4" />
                </span>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
