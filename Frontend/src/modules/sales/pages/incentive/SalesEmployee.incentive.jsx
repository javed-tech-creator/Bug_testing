import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Target, 
  DollarSign, 
  Users, 
  Award,
  Calendar,
  Eye,
  Filter,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import WorkingOnIt from '@/components/WorkingOnIt';

// Mock data for monthly targets and achievements
const mockIncentiveData = [
  {
    id: 1,
    financialYear: '2024-25',
    quarter: 'Q1',
    month: 'April',
    monthlyTarget: 75.0,
    achievedAmount: 78.5,
    baseIncentive: 15000,
    totalLeads: 45,
    convertedLeads: 32,
    submittedDate: '2024-04-30'
  },
  {
    id: 2,
    financialYear: '2024-25',
    quarter: 'Q1',
    month: 'May',
    monthlyTarget: 80.0,
    achievedAmount: 72.3,
    baseIncentive: 16000,
    totalLeads: 38,
    convertedLeads: 25,
    submittedDate: '2024-05-30'
  },
  {
    id: 3,
    financialYear: '2024-25',
    quarter: 'Q1',
    month: 'June',
    monthlyTarget: 85.0,
    achievedAmount: 0,
    baseIncentive: 17000,
    totalLeads: 42,
    convertedLeads: 0,
    submittedDate: null
  }
];

const SalesEmployeeIncentive = () => {
  const [incentiveData, setIncentiveData] = useState(mockIncentiveData);
  const [selectedPeriod, setSelectedPeriod] = useState({
    financialYear: '2024-25',
    quarter: 'Q1',
    month: 'June'
  });
  const [currentForm, setCurrentForm] = useState({
    achievedAmount: '',
    totalLeads: '',
    convertedLeads: ''
  });
  const [filterMonth, setFilterMonth] = useState('All');
  const [activeTab, setActiveTab] = useState('current');

  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const months = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
  const financialYears = ['2024-25', '2025-26'];

  const getCurrentMonthData = () => {
    return incentiveData.find(data => 
      data.financialYear === selectedPeriod.financialYear &&
      data.quarter === selectedPeriod.quarter &&
      data.month === selectedPeriod.month
    );
  };

  const calculateTargetIncentive = (target, achieved, baseIncentive) => {
    if (achieved === 0) return 0;
    
    const achievementPercent = (achieved / target) * 100;
    
    if (achievementPercent > 100) {
      // 2% bonus for every 1% above target
      const bonusPercent = (achievementPercent - 100) * 2;
      return baseIncentive + (baseIncentive * bonusPercent / 100);
    } else {
      // 2% deduction for every 1% below target
      const penaltyPercent = (100 - achievementPercent) * 2;
      return baseIncentive - (baseIncentive * penaltyPercent / 100);
    }
  };

  const calculateLeadIncentive = (totalLeads, convertedLeads, baseIncentive) => {
    if (totalLeads === 0 || convertedLeads === 0) return 0;
    
    const conversionPercent = (convertedLeads / totalLeads) * 100;
    
    if (conversionPercent >= 80) {
      return baseIncentive * 0.15; // 15% bonus for >80% conversion
    } else if (conversionPercent >= 60) {
      return baseIncentive * 0.10; // 10% bonus for 60-80% conversion
    } else if (conversionPercent >= 40) {
      return baseIncentive * 0.05; // 5% bonus for 40-60% conversion
    } else {
      // 2% deduction for every 10% below 40%
      const penaltyPercent = Math.max(0, (40 - conversionPercent) / 10) * 2;
      return baseIncentive - (baseIncentive * penaltyPercent / 100);
    }
  };

  const getTotalIncentive = (data) => {
    const targetIncentive = calculateTargetIncentive(data.monthlyTarget, data.achievedAmount, data.baseIncentive);
    const leadIncentive = calculateLeadIncentive(data.totalLeads, data.convertedLeads, data.baseIncentive);
    return targetIncentive + leadIncentive;
  };

  const handleFormChange = (field, value) => {
    setCurrentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitIncentive = () => {
    const currentData = getCurrentMonthData();
    if (!currentData) {
      alert('No data found for selected period');
      return;
    }

    if (!currentForm.achievedAmount || !currentForm.totalLeads || !currentForm.convertedLeads) {
      alert('Please fill all required fields');
      return;
    }

    const convertedLeads = parseInt(currentForm.convertedLeads);
    const totalLeads = parseInt(currentForm.totalLeads);

    if (convertedLeads > totalLeads) {
      alert('Converted leads cannot be more than total leads');
      return;
    }

    const updatedData = {
      ...currentData,
      achievedAmount: parseFloat(currentForm.achievedAmount),
      totalLeads: totalLeads,
      convertedLeads: convertedLeads,
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setIncentiveData(prev => [
      ...prev.filter(d => !(d.month === selectedPeriod.month && d.quarter === selectedPeriod.quarter)),
      updatedData
    ]);

    setCurrentForm({
      achievedAmount: '',
      totalLeads: '',
      convertedLeads: ''
    });

    alert('Incentive data submitted successfully!');
  };

  const getFilteredData = () => {
    return incentiveData.filter(data => {
      const monthMatch = filterMonth === 'All' || data.month === filterMonth;
      return monthMatch && data.submittedDate; // Only show submitted data
    });
  };

  const CurrentIncentiveTab = () => {
    const currentData = getCurrentMonthData();
    
    if (!currentData) {
      return (
        <div className="bg-white border border-gray-200 p-6 text-center">
          <p className="text-gray-600">No data found for selected period</p>
        </div>
      );
    }

    const targetIncentive = calculateTargetIncentive(currentData.monthlyTarget, currentForm.achievedAmount || currentData.achievedAmount, currentData.baseIncentive);
    const leadIncentive = calculateLeadIncentive(parseInt(currentForm.totalLeads) || currentData.totalLeads, parseInt(currentForm.convertedLeads) || currentData.convertedLeads, currentData.baseIncentive);
    const totalIncentive = targetIncentive + leadIncentive;
    const achievementPercent = currentData.achievedAmount > 0 ? (currentData.achievedAmount / currentData.monthlyTarget) * 100 : 0;
    const conversionPercent = currentData.totalLeads > 0 ? (currentData.convertedLeads / currentData.totalLeads) * 100 : 0;

    return (
      <>
      
      <div className="space-y-4">
        {/* Period Selection */}
        <div className="bg-white p-4 border border-gray-200">
          <h3 className="text-md font-medium text-gray-900 mb-3">Select Period</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select 
              className="p-2 border border-gray-300 text-sm"
              value={selectedPeriod.financialYear}
              onChange={(e) => setSelectedPeriod(prev => ({...prev, financialYear: e.target.value}))}
            >
              {financialYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select 
              className="p-2 border border-gray-300 text-sm"
              value={selectedPeriod.quarter}
              onChange={(e) => setSelectedPeriod(prev => ({...prev, quarter: e.target.value}))}
            >
              {quarters.map(quarter => (
                <option key={quarter} value={quarter}>{quarter}</option>
              ))}
            </select>
            <select 
              className="p-2 border border-gray-300 text-sm"
              value={selectedPeriod.month}
              onChange={(e) => setSelectedPeriod(prev => ({...prev, month: e.target.value}))}
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Month Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Target</p>
                <p className="text-lg font-bold text-gray-900">₹{currentData.monthlyTarget}L</p>
              </div>
              <div className="p-2 bg-gray-100">
                <Target className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Base Incentive</p>
                <p className="text-lg font-bold text-gray-900">₹{currentData.baseIncentive.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-gray-100">
                <DollarSign className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Achievement %</p>
                <p className="text-lg font-bold text-gray-900">{achievementPercent.toFixed(1)}%</p>
              </div>
              <div className={`p-2 ${achievementPercent >= 100 ? 'bg-gray-800' : 'bg-gray-400'}`}>
                {achievementPercent >= 100 ? 
                  <TrendingUp className="h-5 w-5 text-white" /> : 
                  <TrendingDown className="h-5 w-5 text-white" />
                }
              </div>
            </div>
          </div>

          <div className="bg-white p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion %</p>
                <p className="text-lg font-bold text-gray-900">{conversionPercent.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-gray-100">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Incentive Entry Form */}
        <div className="bg-white border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-md font-medium text-gray-900">Enter Achievement Data</h3>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Achieved Amount (₹ Lacs)</label>
                <input 
                  type="number"
                  step="0.1"
                  className="w-full p-2 border border-gray-300 text-sm"
                  placeholder="Enter achieved amount"
                  value={currentForm.achievedAmount}
                  onChange={(e) => handleFormChange('achievedAmount', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Leads</label>
                <input 
                  type="number"
                  className="w-full p-2 border border-gray-300 text-sm"
                  placeholder="Enter total leads"
                  value={currentForm.totalLeads}
                  onChange={(e) => handleFormChange('totalLeads', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Converted Leads</label>
                <input 
                  type="number"
                  className="w-full p-2 border border-gray-300 text-sm"
                  placeholder="Enter converted leads"
                  value={currentForm.convertedLeads}
                  onChange={(e) => handleFormChange('convertedLeads', e.target.value)}
                />
              </div>
            </div>

            <button 
              onClick={handleSubmitIncentive}
              className="bg-gray-800 text-white px-4 py-2 text-sm hover:bg-gray-900 transition-colors"
            >
              Submit Achievement Data
            </button>
          </div>
        </div>

        {/* Incentive Calculation Preview */}
        {(currentForm.achievedAmount || currentForm.totalLeads || currentForm.convertedLeads) && (
          <div className="bg-white border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-md font-medium text-gray-900">Incentive Calculation Preview</h3>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="border border-gray-200 p-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Target Achievement</div>
                  <div className="text-lg font-bold text-gray-900">₹{targetIncentive.toLocaleString()}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {achievementPercent > 100 ? 
                      `+${((achievementPercent - 100) * 2).toFixed(1)}% bonus` : 
                      `-${((100 - achievementPercent) * 2).toFixed(1)}% penalty`
                    }
                  </div>
                </div>

                <div className="border border-gray-200 p-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">Lead Conversion</div>
                  <div className="text-lg font-bold text-gray-900">₹{leadIncentive.toLocaleString()}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {conversionPercent >= 80 ? '15% bonus' :
                     conversionPercent >= 60 ? '10% bonus' :
                     conversionPercent >= 40 ? '5% bonus' : 
                     `${(Math.max(0, (40 - conversionPercent) / 10) * 2).toFixed(1)}% penalty`
                    }
                  </div>
                </div>

                <div className="border border-gray-800 p-3 bg-gray-50">
                  <div className="text-sm font-medium text-gray-700 mb-2">Total Incentive</div>
                  <div className="text-xl font-bold text-gray-900">₹{totalIncentive.toLocaleString()}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {totalIncentive > currentData.baseIncentive ? 
                      `+₹${(totalIncentive - currentData.baseIncentive).toLocaleString()} bonus` :
                      `-₹${(currentData.baseIncentive - totalIncentive).toLocaleString()} reduction`
                    }
                  </div>
                </div>
              </div>

              {/* Incentive Rules */}
              <div className="border-l-4 border-gray-400 bg-gray-50 p-3 text-sm">
                <div className="font-medium text-gray-800 mb-2">Incentive Rules:</div>
                <div className="space-y-1 text-gray-600">
                  <div>• Target Achievement: +2% for every 1% above target, -2% for every 1% below</div>
                  <div>• Lead Conversion: 15% bonus (≥80%), 10% bonus (60-80%), 5% bonus (40-60%), penalty below 40%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
    );
  };

  const HistoryTab = () => (
    <div className="bg-white border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-md font-medium text-gray-900 flex items-center">
            <Eye className="h-4 w-4 mr-2 text-gray-600" />
            Incentive History
          </h3>
          <select 
            className="p-2 border border-gray-300 text-sm"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="All">All Months</option>
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Achieved</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Achievement %</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion %</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Incentive</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getFilteredData().map((data) => {
              const achievementPercent = (data.achievedAmount / data.monthlyTarget) * 100;
              const conversionPercent = (data.convertedLeads / data.totalLeads) * 100;
              const totalIncentive = getTotalIncentive(data);
              
              return (
                <tr key={data.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{data.month} {data.quarter}</td>
                  <td className="px-4 py-3 text-gray-900">₹{data.monthlyTarget}L</td>
                  <td className="px-4 py-3 text-gray-900">₹{data.achievedAmount}L</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${
                      achievementPercent >= 100 ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {achievementPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{data.convertedLeads}/{data.totalLeads}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${
                      conversionPercent >= 60 ? 'text-gray-800' : 'text-gray-600'
                    }`}>
                      {conversionPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${
                      totalIncentive > data.baseIncentive ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      ₹{totalIncentive.toLocaleString()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
    <WorkingOnIt/>
  
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sales Incentive Dashboard</h1>
              <p className="text-sm text-gray-600">Track achievements and calculate incentives</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                FY: 2024-25
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                Sales Employee
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('current')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'current'
                  ? 'border-gray-800 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Current Month
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-gray-800 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Incentive History
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        {activeTab === 'current' && <CurrentIncentiveTab />}
        {activeTab === 'history' && <HistoryTab />}
      </div>
    </div>
      </>
  );
};

export default SalesEmployeeIncentive;