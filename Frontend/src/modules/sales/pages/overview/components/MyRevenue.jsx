import React from 'react'
  const revenueData = [
    { id: 1, client: 'ABC Corp', amount: 45000, date: '2025-01-15', status: 'Completed' },
    { id: 2, client: 'XYZ Ltd', amount: 32000, date: '2025-01-10', status: 'Completed' },
    { id: 3, client: 'Tech Solutions', amount: 28000, date: '2025-01-05', status: 'Pending' },
    { id: 4, client: 'Digital Works', amount: 20000, date: '2024-12-28', status: 'Completed' }
  ];
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Hot': return 'bg-red-100 text-red-800';
      case 'Warm': return 'bg-yellow-100 text-yellow-800';
      case 'Cold': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
function MyRevenue() {
    return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Details</h3>
            {revenueData.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.client}</h4>
                    <p className="text-sm text-gray-600">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
}

export default MyRevenue