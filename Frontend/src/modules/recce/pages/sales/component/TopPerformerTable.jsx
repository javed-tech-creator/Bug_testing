import React, { useState } from "react";
import TopPerformerRow from "./TopPerformerRow";

const dataSets = {
  "This Week": [
    { date: "09-08-2024", img: "https://i.pravatar.cc/150?img=15", name: "Hemanth Raghava", email: "heamn@gmail.com", status: "Excellent", revenue: "₹4.2L" },
    { date: "02-08-2024", img: "https://i.pravatar.cc/150?img=32", name: "Angel arna", email: "arna@gmail.com", status: "Good", revenue: "₹2.2L" },
    { date: "01-08-2024", img: "https://i.pravatar.cc/150?img=21", name: "Karan Shah", email: "karan@gmail.com", status: "Good", revenue: "₹1.5L" },
    { date: "28-07-2024", img: "https://i.pravatar.cc/150?img=25", name: "Neha Verma", email: "neha@gmail.com", status: "Excellent", revenue: "₹2.8L" },
  ],
  "Last Week": [
    { date: "01-08-2024", img: "https://i.pravatar.cc/150?img=12", name: "Priya Singh", email: "priya@gmail.com", status: "Excellent", revenue: "₹3.8L" },
    { date: "30-07-2024", img: "https://i.pravatar.cc/150?img=20", name: "Rohit Singh", email: "rohit@gmail.com", status: "Bad", revenue: "₹22K" },
    { date: "27-07-2024", img: "https://i.pravatar.cc/150?img=30", name: "Vikas Patil", email: "vikas@gmail.com", status: "Good", revenue: "₹1.7L" },
    { date: "25-07-2024", img: "https://i.pravatar.cc/150?img=40", name: "Anjali Rao", email: "anjali@gmail.com", status: "Excellent", revenue: "₹3.0L" },
  ],
  "This Month": [
    { date: "10-07-2024", img: "https://i.pravatar.cc/150?img=45", name: "Nikhil Agarwal", email: "nik@gmail.com", status: "Good", revenue: "₹3.2L" },
    { date: "05-07-2024", img: "https://i.pravatar.cc/150?img=19", name: "Aman Gupta", email: "aman@gmail.com", status: "Good", revenue: "₹1.9L" },
    { date: "02-07-2024", img: "https://i.pravatar.cc/150?img=60", name: "Deepak Kumar", email: "deepak@gmail.com", status: "Bad", revenue: "₹90K" },
    { date: "29-06-2024", img: "https://i.pravatar.cc/150?img=65", name: "Sneha Jain", email: "sneha@gmail.com", status: "Good", revenue: "₹2.5L" },
  ],
  "This Year": [
    { date: "01-01-2024", img: "https://i.pravatar.cc/150?img=50", name: "Arjun", email: "arjun@gmail.com", status: "Excellent", revenue: "₹12.5L" },
    { date: "19-03-2024", img: "https://i.pravatar.cc/150?img=52", name: "Sameer", email: "sameer@gmail.com", status: "Good", revenue: "₹8.7L" },
    { date: "15-05-2024", img: "https://i.pravatar.cc/150?img=70", name: "Rahul Desai", email: "rahul@gmail.com", status: "Excellent", revenue: "₹10.1L" },
    { date: "08-04-2024", img: "https://i.pravatar.cc/150?img=75", name: "Simran Kaur", email: "simran@gmail.com", status: "Good", revenue: "₹7.9L" },
  ],
};

const TopPerformerTable = () => {
  const [filter, setFilter] = useState("This Week");
  const [animate, setAnimate] = useState(false);
  const [direction, setDirection] = useState("right");

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setDirection(newFilter === "This Week" ? "right" : "left");
    setFilter(newFilter);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 min-h-[480px] w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Top Performers</h2>

        <div className="flex items-center">
          <select
            value={filter}
            onChange={handleFilterChange}
            className="border rounded-md px-2 py-1 text-base text-gray-700"
          >
            <option>This Week</option>
            <option>Last Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="w-full">
      <table className="w-full text-left text-base text-gray-700 table-auto">
        <thead>
          <tr className="text-gray-600 text-sm border-b">
            <th className="pb-3 w-1/6">Date</th>
            <th className="pb-3 w-1/4">Member Name</th>
            <th className="pb-3 w-1/4">Email</th>
            <th className="pb-3 w-1/6">Status</th>
            <th className="pb-3 w-1/6">Revenue</th>
          </tr>
        </thead>

        <tbody
          className={`transform transition-all duration-300 ${
            animate
              ? direction === "right"
                ? "-translate-x-10 opacity-0"
                : "translate-x-10 opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          {dataSets[filter].map((row, idx) => (
            <TopPerformerRow
              key={idx}
              {...row}
              style={{
                transitionDelay: `${idx * 100}ms`
              }}
            />
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default TopPerformerTable;
