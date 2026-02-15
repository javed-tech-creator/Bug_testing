import React, { useState } from 'react';
import { 
  User, 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  EyeOff, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Send,
  Zap,
  PieChart,
  BarChart3,
  Sparkles,
  ChevronRight
} from 'lucide-react';

import {useGetInvoicesQuery,useGetSummaryQuery} from "@/api/accounts/invoice.api";

const AccountDashboard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  
  // Import the API hooks and use their data
  const { data: invoices } = useGetInvoicesQuery();
  const { data: summery } = useGetSummaryQuery();
  console.log(summery,"API Summary Data");
  
  const stats = [
    {
      title: "Total Amount",
      value: summery?.totalAmount || 0,
      change: "+12.5%",
      changeType: "increase",
      color: "from-violet-500 via-purple-500 to-purple-600",
      lightColor: "from-violet-50 to-purple-50",
      icon: CreditCard,
      description: "Total invoices value"
    },
    {
      title: "Total Paid",
      value: summery?.totalPaid || 0,
      change: "+8.2%", 
      changeType: "increase",
      color: "from-emerald-500 via-green-500 to-teal-600",
      lightColor: "from-emerald-50 to-teal-50",
      icon: Wallet,
      description: "Received payments"
    },
    {
      title: "Remaining Amount",
      value: summery?.totalRemaining || 0,
      change: "-5.1%",
      changeType: "decrease", 
      color: "from-amber-500 via-orange-500 to-red-500",
      lightColor: "from-amber-50 to-orange-50",
      icon: TrendingUp,
      description: "Outstanding balance"
    }
  ];
   
  const accountData = {
    user: {
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      avatar: "/api/placeholder/60/60"
    },
    balance: 1245670
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'partial': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'pending': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 p-2 md:p-3">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Compact Header */}
        <div className="backdrop-blur-xl bg-white/80 rounded-xl shadow-xl border border-white/20 p-3 md:p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {accountData.user.name.charAt(0)}
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-indigo-600 bg-clip-text text-transparent">
                  Welcome back, {accountData.user.name}!
                </h1>
                <p className="text-gray-600 flex items-center gap-2 text-sm">
                  <span>{accountData.user.email}</span>
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-600 text-xs font-medium">Online</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white/60 backdrop-blur-sm rounded-lg hover:bg-white/80 transition-all shadow-sm hover:shadow-md">
                <Bell className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 bg-white/60 backdrop-blur-sm rounded-lg hover:bg-white/80 transition-all shadow-sm hover:shadow-md">
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Compact Stats Cards with API data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`group backdrop-blur-xl bg-gradient-to-br ${stat.lightColor} rounded-xl shadow-lg border border-white/30 p-3 hover:shadow-xl hover:scale-105 transform transition-all duration-300 cursor-pointer ${activeCard === index ? 'ring-2 ring-purple-300' : ''}`}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300`}>
                  <stat.icon className="w-4 h-4 text-white" />
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${stat.changeType === 'increase' ? 'text-emerald-600 bg-emerald-100' : 'text-red-600 bg-red-100'}`}>
                  {stat.change} 
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">{stat.title}</h3>
                <p className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                  {stat.value ? stat.value.toLocaleString() : '0'}
                </p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid - Compact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          
          {/* Compact Balance Card */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 rounded-xl shadow-xl p-4 text-white">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 opacity-80" />
                      <h2 className="text-sm font-medium opacity-90">Total Balance</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold tracking-tight">
                        {showBalance ? formatAmount(accountData.balance) : '••••••••'}
                      </h1>
                      <button 
                        onClick={() => setShowBalance(!showBalance)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
                      >
                        {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="text-right space-y-1 text-sm">
                    <p className="opacity-80">Account Number</p>
                    <p className="font-mono">**** **** 4567</p>
                    <div className="flex items-center gap-1 justify-end">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                      <span className="text-xs opacity-80">Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="group bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-all flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <Plus className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-sm">Add Money</span>
                  </button>
                  <button className="group bg-white/20 backdrop-blur-sm rounded-lg p-3 hover:bg-white/30 transition-all flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <Send className="w-3 h-3" />
                    </div>
                    <span className="font-medium text-sm">Transfer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Quick Actions */}
          <div className="backdrop-blur-xl bg-white/80 rounded-xl shadow-xl border border-white/20 p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              {[
                { icon: Plus, title: 'Add Income', color: 'text-emerald-600', bg: 'from-emerald-50 to-green-50', border: 'border-emerald-200' },
                { icon: TrendingDown, title: 'Record Expense', color: 'text-red-600', bg: 'from-red-50 to-pink-50', border: 'border-red-200' },
                { icon: Calendar, title: 'Set Budget', color: 'text-blue-600', bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200' },
                { icon: Download, title: 'Export Data', color: 'text-purple-600', bg: 'from-purple-50 to-violet-50', border: 'border-purple-200' },
              ].map((action, index) => (
                <button key={index} className={`group w-full p-3 bg-gradient-to-r ${action.bg} rounded-lg hover:shadow-md transition-all flex items-center gap-2 border ${action.border} hover:scale-102 transform`}>
                  <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <action.icon className={`w-3 h-3 ${action.color}`} />
                  </div>
                  <span className="font-medium text-gray-800 text-sm">{action.title}</span>
                  <ChevronRight className="w-3 h-3 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compact Recent Transactions */}
        <div className="backdrop-blur-xl bg-white/80 rounded-xl shadow-xl border border-white/20">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
                  <p className="text-gray-600 text-sm">Track your latest invoice activities</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Search className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="space-y-2">
              {invoices && invoices.length > 0 ? invoices.map((invoice, index) => (
                <div 
                  key={invoice.invoiceNumber || index}
                  className="group flex items-center justify-between p-3 hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50 rounded-lg transition-all border border-transparent hover:border-indigo-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all ${
                      invoice.status === 'paid' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 
                      invoice.status === 'partial' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                      'bg-gradient-to-br from-red-400 to-red-600'
                    }`}>
                      {invoice.status === 'paid' ? 
                        <ArrowDownRight className="w-4 h-4 text-white" /> : 
                        invoice.status === 'partial' ?
                        <PieChart className="w-4 h-4 text-white" /> :
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      }
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-800 group-hover:text-indigo-700 transition-colors text-sm">
                        {invoice.client || 'Unknown Client'}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-medium">#{invoice.invoiceNumber || 'N/A'}</span>
                        <span>•</span>
                        <span>{invoice.project || 'No project'}</span>
                      </div>
                      <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(invoice.status)}`}>
                        {invoice.status ? invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) : 'Unknown'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-0.5">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-bold text-gray-800">
                        {formatAmount(invoice.totalAmount || 0)}
                      </p>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-gray-600">
                      Paid: <span className="font-semibold text-emerald-600">{formatAmount(invoice.paidAmount || 0)}</span>
                    </p>
                    {invoice.date && (
                      <p className="text-xs text-gray-500">{invoice.date}</p>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">No invoices found</h3>
                  <p className="text-gray-500 text-xs">Your recent transactions will appear here</p>
                </div>
              )}
            </div>
            
            {invoices && invoices.length > 0 && (
              <button className="w-full mt-4 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2 text-sm">
                <BarChart3 className="w-4 h-4" />
                View All Invoices
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AccountDashboard;