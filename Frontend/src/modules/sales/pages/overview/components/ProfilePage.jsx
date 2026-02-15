import { User, DollarSign, Users, FileText, ArrowLeft, Eye } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '../../../components/PageHeader';
import MyLead from './MyLead';
import MyRevenue from './MyRevenue';
import MyReport from './MyReport';
import { useSelector } from 'react-redux';

export default function EmployeeProfile() {
  const [activeSection, setActiveSection] = useState('revenue');
 const res = useSelector((state) => state.auth.userData);
 const user = res?.user || {}
 console.log(user)
  // Sample employee data
  const employee = {
    id: 'EMP001',
    name: 'Rajesh Kumar',
    avatar: null,
    totalRevenue: 125000,
    totalLeads: 45,
    reports: 12
  };



  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };


  const renderRightContent = () => {
    switch(activeSection) {
      case 'revenue':
        return <MyRevenue/>
      
      case 'leads':
        return <MyLead/>
      
      case 'reports':
        return <MyReport/>
      
      default:
        return null;
    }
  };

  return (
    <div className="">
      {/* Header */}
      <PageHeader title='Employee Profile' />

      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column - 4/12 */}
          <div className="lg:col-span-4 space-y-6">
            {/* Employee Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  {/* <User className="w-12 h-12 text-gray-500" /> */}
                     {user?.photo?(<div className=""><img src={user?.photo} className="rounded-full h-24 w-24"/></div>):(<div className=""><User className="text-black/80" size={50} /></div>)}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user.designation?.title}</p>
              </div>
            </div>

            {/* Action Buttons Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
              <button
                onClick={() => setActiveSection('revenue')}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                  activeSection === 'revenue' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-medium">Total Revenue</span>
                </div>
                {/* <span className="font-bold">{formatCurrency(employee.totalRevenue)}</span> */}
              </button>

              <button
                onClick={() => setActiveSection('leads')}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                  activeSection === 'leads' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Total Leads</span>
                </div>
                {/* <span className="font-bold">{employee.totalLeads}</span> */}
              </button>

              <button
                onClick={() => setActiveSection('reports')}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                  activeSection === 'reports' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Reports</span>
                </div>
                {/* <span className="font-bold">{employee.reports}</span> */}
              </button>
            </div>
          </div>

          {/* Right Column - 8/12 */}
          <div className="lg:col-span-8">
            <div className="bg-gray-50 rounded-lg p-6 min-h-96">
              {renderRightContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}