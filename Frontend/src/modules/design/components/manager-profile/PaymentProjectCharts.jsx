import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PaymentProjectCharts() {
  // Payment Status Data
  const paymentData = [
    { name: 'Branding', value: 30.6, color: '#8b5cf6' },
    { name: 'UI/UX', value: 20.5, color: '#3b82f6' },
    { name: '3D Design', value: 30.8, color: '#f59e0b' },
    { name: 'Graphics', value: 19.8, color: '#9ca3af' }
  ];

  // Monthly Project Output Data
  const monthlyData = [
    { month: 'Jan', targeted: 50000, delivered: 25000 },
    { month: 'Feb', targeted: 49000, delivered: 32000 },
    { month: 'Mar', targeted: 52000, delivered: 40000 },
    { month: 'Apr', targeted: 55000, delivered: 45000 },
    { month: 'May', targeted: 60000, delivered: 48000 },
    { month: 'Jun', targeted: 52000, delivered: 51000 }
  ];

  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
        {/* Payment Status Overview */}
        <div className="bg-white rounded-sm shadow-sm p-8 border-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment Status Overview</h2>
          
          <div className="flex items-center gap-12">
            {/* Donut Chart */}
            <div className="flex-shrink-0">
              <ResponsiveContainer width={280} height={280}>
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={130}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-4">
              {paymentData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-800 font-medium text-lg min-w-[100px]">{item.name}</span>
                  <span className="text-gray-900 font-semibold text-lg">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Project Output */}
        <div className="bg-white rounded-sm shadow-sm p-8 border-2 border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Monthly Project Output</h2>
          
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#374151', fontSize: 14 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#374151', fontSize: 14 }}
                axisLine={{ stroke: '#e5e7eb' }}
                domain={[0, 70000]}
                ticks={[10000, 20000, 30000, 40000, 50000, 60000]}
                tickFormatter={(value) => `${value / 1000}K`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                formatter={(value) => `${value / 1000}K`}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
              />
              <Line 
                type="monotone" 
                dataKey="targeted" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                name="Targeted"
              />
              <Line 
                type="monotone" 
                dataKey="delivered" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5 }}
                name="Delivered"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
  
  );
}