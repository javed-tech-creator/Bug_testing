import React from 'react'
import { Card, CardContent } from '../components/ui/card'
import { Cell, Pie, ResponsiveContainer,BarChart, Tooltip,PieChart, XAxis, YAxis, Bar } from 'recharts'
import { useGetVendorChartsDataQuery } from '@/api/vendor/dashboard.api'
import {  ShoppingCart } from 'lucide-react'

const VendorAnalytics = () => {



    const { data: charts, isLoading: loadingCharts } = useGetVendorChartsDataQuery();
  
     const salesData = [
  { month: "Jan 2025", sales: 12000 },
  { month: "Feb 2025", sales: 18000 },
  { month: "Mar 2025", sales: 15000 },
  { month: "Apr 2025", sales: 25000 },  
  { month: "May 2025", sales: 11000 },
  { month: "June 2025", sales: 13000 },
];

// Data
const invoiceStatus = {
  paid: { count: 30, percentage: "20.69" },
  partial: { count: 65, percentage: "34.48" },
  pending: { count: 50, percentage: "44.83" },
};

const invoiceStatusData = [
  { name: "Paid", value: invoiceStatus.paid.count },
  { name: "Partial", value: invoiceStatus.partial.count },
  { name: "Pending", value: invoiceStatus.pending.count },
];

const totalOrders =
  invoiceStatus.paid.count +
  invoiceStatus.partial.count +
  invoiceStatus.pending.count;

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

  return (
    <>

      <div>
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mt-2">
           <span className="p-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
          📈
        </span> Analytics Overview
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        Sales performance and order status insights
      </p>
    </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
       <Card className="rounded-2xl shadow-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-gray-100">
  <CardContent className="p-5">
    {/* Header with icon */}
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
        <span className="p-2 bg-blue-100 text-blue-600 rounded-lg shadow">
          <ShoppingCart className="w-5 h-5" />
        </span>
        Monthly Sales
      </h3>
      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
        {salesData?.length || 0} Months
      </span>
    </div>

    {/* Bar Chart */}
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={salesData}>
        <XAxis 
          dataKey="month" 
          stroke="#4b5563" 
          tick={{ fontSize: 12, fontWeight: 500 }}
        />
        <YAxis 
          stroke="#4b5563" 
          tickFormatter={(sales) => `₹${sales.toLocaleString()}`} 
        />
        <Tooltip 
          formatter={(sales) => `₹${sales.toLocaleString()}`} 
          contentStyle={{ borderRadius: "12px", padding: "10px", backgroundColor: "#f9fafb" }}
        />
        <Bar 
          dataKey="sales" 
          radius={[10, 10, 0, 0]} 
          fill="url(#salesGradient)"
          barSize={40}
          className="hover:opacity-80 transition-opacity"
          activeBar={false}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6}/>
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>


 <Card className="rounded-2xl shadow-lg border border-gray-100">
  <CardContent className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
    {/* Header */}
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-semibold text-lg text-gray-800">📊 Orders Status</h3>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-green-500 shadow-sm"></span>
          <span className="text-gray-700 font-medium">Paid</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-yellow-500 shadow-sm"></span>
          <span className="text-gray-700 font-medium">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm"></span>
          <span className="text-gray-700 font-medium">Pending</span>
        </div>
      </div>
    </div>

    {/* Pie Chart */}
    <div className="flex items-center justify-center">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={invoiceStatusData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            dataKey="value"
            paddingAngle={5}
            cornerRadius={6}
            label={({ name, value }) =>
              `${name} (${((value / totalOrders) * 100).toFixed(1)}%)`
            }
          >
            {invoiceStatusData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `${value} Orders (${((value / totalOrders) * 100).toFixed(1)}%)`,
              name,
            ]}
            contentStyle={{
              borderRadius: "12px",
              padding: "8px 12px",
              border: "1px solid #ddd",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Summary */}
    <div className="mt-4 grid grid-cols-3 text-center gap-2">
      <div className="bg-green-50 rounded-xl p-3 shadow-sm">
        <p className="text-sm text-gray-600">Paid</p>
        <h4 className="font-bold text-green-600">
          {invoiceStatus.paid.count} 
        </h4>
      </div>
      <div className="bg-yellow-50 rounded-xl p-3 shadow-sm">
        <p className="text-sm text-gray-600">Partial</p>
        <h4 className="font-bold text-yellow-600">
          {invoiceStatus.partial.count} 
        </h4>
      </div>
      <div className="bg-red-50 rounded-xl p-3 shadow-sm">
        <p className="text-sm text-gray-600">Pending</p>
        <h4 className="font-bold text-red-600">
          {invoiceStatus.pending.count} 
        </h4>
      </div>
    </div>
  </CardContent>
</Card>


      </div>
    </>
  )
}

export default VendorAnalytics;