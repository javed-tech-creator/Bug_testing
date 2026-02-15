import React from "react";

export default function DesignProfile() {

  const feedback = [
    { label: "Communication", value: 9.5 },
    { label: "Response Time", value: 9.5 },
    { label: "Target Achieve", value: 4.5 },
    { label: "Punctuality", value: 8.5 },
    { label: "Leadership", value: 9.5 },
  ];

  const attendanceData = [
  {
    date: "10-11-25",
    checkIn: "9:15 AM",
    checkOut: "6:05 PM",
    hours: "9 Hrs",
    remark: "Good",
    remarkColor: "text-blue-600",
  },
  {
    date: "09-11-25",
    checkIn: "9:30 AM",
    checkOut: "6:10 PM",
    hours: "9 Hrs",
    remark: "Excellent",
    remarkColor: "text-green-600",
  },
  {
    date: "08-11-25",
    checkIn: "9:05 AM",
    checkOut: "5:50 PM",
    hours: "8.5 Hrs",
    remark: "Good",
    remarkColor: "text-blue-600",
  },
];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 mt-5  bg-gray-100 ">

 <div className="bg-white md:col-span-3 p-5 rounded-sm shadow border-2 border-gray-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Attendance Insights</h2>
        <button className="text-blue-600 font-medium hover:underline">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full  border-gray-400  overflow-hidden">
          <thead>
            <tr className="bg-gray-900 text-white text-left">
              <th className="p-3 border border-gray-600">Date</th>
              <th className="p-3 border border-gray-600">Check In</th>
              <th className="p-3 border border-gray-600">Check Out</th>
              <th className="p-3 border border-gray-600">Hrs.</th>
              <th className="p-3 border border-gray-600">Remark</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((item, index) => (
              <tr key={index} className="text-gray-800">
                <td className="p-3 border border-gray-400">{item.date}</td>
                <td className="p-3 border border-gray-400">{item.checkIn}</td>
                <td className="p-3 border border-gray-400">{item.checkOut}</td>
                <td className="p-3 border border-gray-400">{item.hours}</td>
                <td
                  className={`p-3 border border-gray-400 font-medium ${item.remarkColor}`}
                >
                  {item.remark}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
      {/* Feedback */}
      <div className="bg-white md:col-span-2 p-5 rounded-sm shadow border-2 border-gray-300">
        <h2 className="text-xl font-semibold mb-4">Feedback & Review</h2>

        <div className="space-y-4">
          {feedback.map((item, i) => {
            // Dynamic color logic
            let barColor = "bg-red-500";
            let badgeColor = "bg-red-100 text-red-700";

            if (item.value >= 7) {
              barColor = "bg-green-500";
              badgeColor = "bg-green-100 text-green-700";
            } else if (item.value >= 4) {
              barColor = "bg-yellow-500";
              badgeColor = "bg-yellow-100 text-yellow-700";
            }

            return (
              <div key={i} className="flex items-center gap-4">
                {/* Label */}
                <span className="w-40 font-medium text-gray-700">
                  {item.label}
                </span>

                {/* Progress Bar */}
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${(item.value / 10) * 100}%` }}
                  ></div>
                </div>

                {/* Rating Badge */}
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded ${badgeColor}`}
                >
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
