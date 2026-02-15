import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { Users, IndianRupee, ClipboardList, Truck } from "lucide-react";
 
import { useGetQuotationsQuery } from "@/api/finance/Quatation_Billing/quatation.api";
import { useGetLedgersQuery ,  useGetOutstandingQuery,} from '@/api/finance/Quatation_Billing/ledger.api'

export default function Dashboard() {
 
  const { data: outstandingData ,isLoading, isError} = useGetOutstandingQuery();
  
  const statData = outstandingData;
  console.log(statData,"dashboard");
  const { data: report } = useGetLedgersQuery()
  // 🔹 Fetch recent invoices/quotations
  const { data: quotations } = useGetQuotationsQuery();
  const ledgers = quotations || [];

  console.log("Dashboard stats:", report);
  console.log("Recent invoices:", ledgers);

  // 🔹 Revenue Line Chart (static for now, replace with API if needed)
  const [revenueChart] = useState({
    series: [
      {
        name: "Revenue",
        data: [40000, 50000, 45000, 60000, 55000, 70000],
      },
    ],
    options: {
      chart: { id: "revenue-chart", toolbar: { show: false }, zoom: { enabled: false } },
      xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
      stroke: { curve: "smooth" },
      dataLabels: { enabled: false },
      tooltip: { enabled: true },
      colors: ["#4f46e5"],
    },
  });
console.log(statData,"pai");

  // 🔹 Expense Pie Chart (static, dynamic example can be added later)
  const [expenseChart, setExpenseChart] = useState({
    series: [],
    options: {
      labels: ["Total Credit", "Total Debit", "Balance" ],
      chart: { type: "donut" },
      colors: ["blue", "red","green"],
      legend: { position: "bottom" },
      tooltip: { enabled: true },
    },
  });

  useEffect(() => {
    if (statData) {
      const series = [
        statData.totalCredit || 0,
        statData.totalDebit || 0, 
        statData.balance || 0,
      ];

      setExpenseChart((prev) => ({
        ...prev,
        series,
      }));
    }
  }, [statData]);


  if (isLoading) return <p>Loading dashboard...</p>;
  if (isError) return <p>Error loading dashboard!</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* 🔹 Stats Cards */}
    <div className="w-full px-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 w-full">
    
    {/* Total Collection */}
    <div className="flex items-center justify-between p-6 rounded-2xl shadow-lg bg-blue-600 hover:scale-105 transition-transform duration-200 w-full">
      <div className="text-white text-4xl"><Users /></div>
      <div className="text-right">
        <p className="text-gray-200 text-sm">Total Collection</p>
        <p className="text-white font-bold text-2xl">{statData?.totalCredit || 0}</p>
      </div>
    </div>
   <div className="flex items-center justify-between p-6 rounded-2xl shadow-lg bg-red-500 hover:scale-105 transition-transform duration-200 w-full">
      <div className="text-white text-4xl"><Truck /></div>
      <div className="text-right">
        <p className="text-gray-200 text-sm">Expense Summary</p>
        <p className="text-white font-bold text-2xl">{statData?.totalExpense || 0}</p>
      </div>
    </div>
    {/* Payouts */}
    <div className="flex items-center justify-between p-6 rounded-2xl shadow-lg bg-green-600 hover:scale-105 transition-transform duration-200 w-full">
      <div className="text-white text-4xl"><IndianRupee /></div>
      <div className="text-right">
        <p className="text-gray-200 text-sm">Balance</p>
        <p className="text-white font-bold text-2xl">{statData?.balance || 0}</p>
      </div>
    </div>

    {/* Expense Summary */}
 

  </div>
</div>


      {/* 🔹 Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Revenue Line Chart */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-gray-800 font-semibold mb-2">Revenue Trend (Last 6 Months)</h3>
          <ApexCharts options={revenueChart.options} series={revenueChart.series} type="line" height={250} />
        </div>

        {/* Expense Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-gray-800 font-semibold mb-2">Expense Distribution</h3>
          <ApexCharts options={expenseChart.options} series={expenseChart.series} type="donut" height={250} />
        </div>
      </div>

      {/* 🔹 Recent Invoices Table (last 5 entries) */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-gray-800 font-semibold mb-2">Recent Invoices</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">#</th>
              <th className="p-2">Client</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {ledgers
              .slice(-5) // last 5 entries
              .reverse() // latest first
              .map((item, idx) => (
                <tr key={item._id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{item.client?.name || "N/A"}</td>
                  <td className="p-2">{item.amountPaid}</td>
                  <td
                    className={`p-2 font-semibold ${item.status === "Approved"
                        ? "text-green-600"
                        : item.status === "Rejected"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                  >
                    {item.status}
                  </td>
                  <td className="p-2">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "N/A"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
