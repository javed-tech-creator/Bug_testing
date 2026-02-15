import { Eye } from 'lucide-react';
import React from 'react'

function MyReport() {
      const reportsData = [
    { id: 1, title: 'Monthly Sales Report', date: '2025-01-30', type: 'Sales' },
    { id: 2, title: 'Lead Analysis', date: '2025-01-25', type: 'Leads' },
    { id: 3, title: 'Client Follow-up', date: '2025-01-20', type: 'Client' },
    { id: 4, title: 'Performance Review', date: '2025-01-15', type: 'Performance' }
  ];
 return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Reports Details</h3>
            {reportsData.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                      {item.type}
                    </span>
                    <button className="ml-2 text-gray-600 hover:text-gray-900">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
}

export default MyReport