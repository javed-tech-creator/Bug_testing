import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Users, TrendingUp, Clock, DollarSign, Award, UserCheck, Calendar, BarChart3, PieChart, Target, Bell, Filter, Download, RefreshCw } from "lucide-react";
import PageHeader from "@/modules/sales/components/PageHeader";
import { useGetAllSalarySlipsQuery, useGetPayrollChartQuery } from "@/api/hr/payroll.api";
import { useGetEmployeeGrowthQuery } from "@/api/hr/employee.api";
import { useGetWeeklyChartQuery } from "@/api/hr/attendance.api";
import { useGetLeaveChartQuery } from "@/api/hr/leave.api";

const HrDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
   
 const today = new Date();
  const [selectedYear] = useState(today.getFullYear());
  const [selectedMonth] = useState(today.getMonth() + 1);

  const { data: payrollData, isLoading, isError } = useGetAllSalarySlipsQuery({
    year: selectedYear,
    month: selectedMonth
  });

  const employees = payrollData?.data || [];
  const { data: growthData } = useGetEmployeeGrowthQuery();

  // --- FIX: Clean & Sort Growth Data ---
  const sortSafeGrowth = (list) => {
    return (list || [])
      .map((item) => {
        const [year, month] = (item.month || "2000-01").split("-");
        const safeYear = year < 2000 || year > 2100 ? "2000" : year;
        return { ...item, month: `${safeYear}-${month}` };
      })
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  const growthList = sortSafeGrowth(growthData?.data);

  const employeeId = employees[0]?.employeeId || "";
  const { data: weeklyData } = useGetWeeklyChartQuery(employeeId, { skip: !employeeId });
  console.log("WEEKLY DATA →", weeklyData);
  console.log("EMPLOYEE ID →", employeeId);
  console.log("EMPLOYEES LIST →", employees);
  const { data: leaveData } = useGetLeaveChartQuery();
  const { data: payrollChartData } = useGetPayrollChartQuery(selectedYear);

  const formatMonth = (monthStr) => {
    if (!monthStr) return "N/A";
    const [year, month] = monthStr.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  };

  const growthCategories = growthList.map(item => formatMonth(item.month));
  const growthCounts = growthList.map(item => item.count);

  // ======= KPI STATS =======
  const stats = {
    totalEmployees: employees.length,
    paid: employees.filter(emp => emp.status === "Paid").length,
    totalPayout: employees.reduce((acc, emp) => acc + Number(emp.actualSalary || 0), 0),
    highestSalary: employees.length > 0 ? Math.max(...employees.map(emp => Number(emp.actualSalary || 0))) : 0,
    maxPresentDays: employees.length > 0
      ? Math.max(...employees.map(emp => ((emp.presentDays / emp.totalWorkingDays) * 100 || 0)))
      : 0
  };

  // ======= KPI CARDS =======
  const kpiCards = [
    { title: "Total Employees", value: stats.totalEmployees, change: `+ ${stats.totalEmployees}`, icon: Users, color: "bg-blue-500", changeColor: "text-green-600", border: "border-blue-500" },
    { 
      title: "Departments", 
      value: [...new Set(employees.map(emp => emp.department))].length || 0, 
      change: "Active", 
      icon: BarChart3, 
      color: "bg-purple-500", 
      changeColor: "text-blue-600", 
      border: "border-purple-500" 
    },
    { title: "Pending Leaves", value: employees.filter(emp => emp.status === "Pending").length, change: "Approval Required", icon: Calendar, color: "bg-orange-500", changeColor: "text-orange-600", border: "border-orange-500" },
    { title: "Payroll Processed", value: stats.paid, change: `Month: ${selectedMonth}-${selectedYear}`, icon: DollarSign, color: "bg-green-500", changeColor: "text-purple-600", border: "border-green-500" }
  ];

  // ====== 1. EMPLOYEE STATS ======
  const employeeGrowth = {
    options: {
      chart: { 
        id: "employee-growth",
        type: "area",
        toolbar: { show: false },
        background: "transparent",
        dropShadow: {
          enabled: true,
          top: 2,
          left: 0,
          blur: 6,
          opacity: 0.12
        }
      },
      theme: { mode: darkMode ? "dark" : "light" },
      xaxis: { 
        categories: growthCategories.length > 0 ? growthCategories : ["No Data"],
        labels: { 
          style: { colors: "#94A3B8", fontSize: "12px", fontWeight: 500 },
          rotate: -10
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: { 
        labels: { style: { colors: "#94A3B8", fontSize: "12px" } }
      },
      stroke: {
        width: 2,
        curve: "smooth"
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.4,
          gradientToColors: ["#60A5FA"],
          opacityFrom: 0.65,
          opacityTo: 0.05,
          stops: [0, 90, 100]
        }
      },
      colors: ["#3B82F6"],
      markers: {
        size: 4,
        colors: ["#ffffff"],
        strokeColors: "#3B82F6",
        strokeWidth: 2,
        hover: { size: 6 }
      },
      grid: { 
        borderColor: "#E2E8F0",
        strokeDashArray: 4
      },
      tooltip: {
        theme: darkMode ? "dark" : "light",
        style: { fontSize: "13px" },
        y: { formatter: (val) => `${val} Employees` }
      }
    },
    series: [
      { 
        name: "Total Employees", 
        data: growthCounts.length > 0 ? growthCounts : [0] 
      },
    ],
  };

  // Fix: Backend returns weeklyData.data as an array, not an object
  const weeklyArray = Array.isArray(weeklyData?.data) ? weeklyData.data : [];

  const weeklyLabels = weeklyArray.map(item => item.name);
  const weeklyPresent = weeklyArray.map(item => item.present);
  const weeklyAbsent = weeklyArray.map(item => item.absent);

  // ====== 2. ATTENDANCE ======
  const attendanceChart = {
    options: {
      chart: { 
        id: "attendance-bar",
        toolbar: { show: false },
        background: 'transparent'
      },
      theme: { mode: darkMode ? 'dark' : 'light' },
      xaxis: { 
        categories: weeklyLabels,
        labels: { style: { colors: '#64748B' } }
      },
      yaxis: { labels: { style: { colors: '#64748B' } } },
      colors: ["#10B981", "#EF4444"],
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '60%'
        }
      },
      dataLabels: { enabled: false },
      grid: { strokeDashArray: 3, borderColor: '#E2E8F0' },
      legend: { 
        show: false
      },
      tooltip: {
        theme: darkMode ? 'dark' : 'light',
        y: { formatter: (val) => `${val} employees` }
      }
    },
    series: [
      { name: "Present", data: weeklyPresent },
      { name: "Absent", data: weeklyAbsent },
    ],
  };

  // ====== 3. LEAVE DISTRIBUTION ======
  const leaveChart = {
    options: {
      chart: { 
        id: "leave-pie",
        toolbar: { show: false },
        background: 'transparent'
      },
      theme: { mode: darkMode ? 'dark' : 'light' },
      labels: leaveData?.labels || [],
      colors: ["#F59E0B", "#EF4444", "#8B5CF6", "#10B981"],
      legend: { 
        position: 'bottom',
        labels: { colors: '#64748B' }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Leaves',
                color: '#64748B'
              }
            }
          }
        }
      },
      tooltip: {
        theme: darkMode ? 'dark' : 'light',
        y: { formatter: (val) => `${val} days` }
      }
    },
    series: leaveData?.values || [],
  };

  // ====== 4. PAYROLL EXPENSE ======
  const payrollChart = {
    options: {
      chart: { 
        id: "payroll-area",
        toolbar: { show: false },
        background: 'transparent'
      },
      theme: { mode: darkMode ? 'dark' : 'light' },
      xaxis: { 
        categories: payrollChartData?.months || [],
        labels: { style: { colors: '#64748B' } }
      },
      yaxis: { 
        labels: { 
          style: { colors: '#64748B' },
          formatter: (val) => `₹${(val/100000).toFixed(1)}L`
        }
      },
      colors: ["#8B5CF6"],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 90, 100]
        }
      },
      stroke: { width: 2, curve: 'smooth' },
      grid: { strokeDashArray: 3, borderColor: '#E2E8F0' },
      tooltip: {
        theme: darkMode ? 'dark' : 'light',
        y: { formatter: (val) => `₹${(val/100000).toFixed(1)}L` }
      }
    },
    series: [
      { name: "Payroll Expense", data: payrollChartData?.amounts || [] },
    ],
  };

  // ====== 5. KPI PERFORMANCE ======
  const kpiChart = {
    options: {
      chart: { 
        id: "kpi-radar",
        toolbar: { show: false },
        background: 'transparent'
      },
      theme: { mode: darkMode ? 'dark' : 'light' },
      labels: ["Quality", "Timeliness", "Productivity", "Teamwork", "Initiative"],
      colors: ["#06B6D4"],
      plotOptions: {
        radar: {
          polygons: {
            strokeColors: '#E2E8F0',
            fill: { colors: ['transparent'] }
          }
        }
      },
      markers: { size: 4 },
      tooltip: {
        theme: darkMode ? 'dark' : 'light',
        y: { formatter: (val) => `${val}%` }
      }
    },
    series: [
      { name: "KPI Score", data: [80, 90, 75, 85, 70] },
    ],
  };

  // ====== 6. TRAINING COMPLETION ======
  const trainingChart = {
    options: {
      chart: { 
        id: "training-donut",
        toolbar: { show: false },
        background: 'transparent'
      },
      theme: { mode: darkMode ? 'dark' : 'light' },
      labels: ["Completed", "Ongoing", "Pending"],
      colors: ["#10B981", "#F59E0B", "#EF4444"],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                fontSize: '16px',
                fontWeight: 600,
                color: '#64748B'
              }
            }
          }
        }
      },
      legend: { 
        position: 'bottom',
        labels: { colors: '#64748B' }
      },
      tooltip: {
        theme: darkMode ? 'dark' : 'light',
        y: { formatter: (val) => `${val} courses` }
      }
    },
    series: [40, 15, 10],
  };

  // ====== 7. ATTRITION RATE ======
  const attritionChart = {
    options: {
      chart: { 
        id: "attrition-line",
        toolbar: { show: false },
        background: 'transparent'
      },
      theme: { mode: darkMode ? 'dark' : 'light' },
      xaxis: { 
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        labels: { style: { colors: '#64748B' } }
      },
      yaxis: { 
        labels: { 
          style: { colors: '#64748B' },
          formatter: (val) => `${val}%`
        }
      },
      colors: ["#EF4444"],
      stroke: { width: 3, curve: 'smooth' },
      markers: { size: 6 },
      grid: { strokeDashArray: 3, borderColor: '#E2E8F0' },
      tooltip: {
        theme: darkMode ? 'dark' : 'light',
        y: { formatter: (val) => `${val}% attrition` }
      }
    },
    series: [
      { name: "Attrition Rate", data: [5, 4, 6, 5, 3, 4] },
    ],
  };

  // const kpiCards = [
  //   { title: "Total Employees", value:stats.totalEmployees, change: "+8", icon: Users, color: "bg-blue-500", changeColor: "text-green-600", border: "border-blue-500" },
  //   { title: "Departments", value: "12", change: "Active", icon: BarChart3, color: "bg-purple-500", changeColor: "text-blue-600", border: "border-purple-500" },
  //   { title: "Pending Leaves", value: "18", change: "Approval Required", icon: Calendar, color: "bg-orange-500", changeColor: "text-orange-600", border: "border-orange-500" },
  //   { title: "Payroll Processed", value: stats.paid, change: "June 2025", icon: DollarSign, color: "bg-green-500", changeColor: "text-purple-600", border: "border-green-500" }
  // ]
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      {/* Enhanced Header */}
      {/* <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm border-b`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                HR Analytics Dashboard
              </h1>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                Comprehensive workforce management insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                <Filter size={20} />
              </button>
              <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                <Download size={20} />
              </button>
              <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                <RefreshCw size={20} />
              </button>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} transition-colors`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <div className="relative">
                <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}>
                  <Bell size={20} />
                </button>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Last Updated</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sept 22, 2025 - 2:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <PageHeader title="Dashboard"/>

      <div className="">
        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((card, index) => (
            <div key={index} className={`${darkMode ? 'bg-gray-800 border-gray-700' : `bg-white border-t-4 ${card.border}`} rounded-xl shadow-lg   p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 `}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{card.title}</p>
                  <p className={`text-3xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{card.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${card.changeColor}`}>{card.change}</span>
                  </div>
                </div>
                <div className={`${card.color} p-4 rounded-xl shadow-lg`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Row 1 - Employee Growth & Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Employee Growth</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Trend</span>
              </div>
            </div>
            <Chart options={employeeGrowth.options} series={employeeGrowth.series} type="area" height={280} />
          </div>
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Weekly Attendance</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Present</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Absent</span>
                </div>
              </div>
            </div>
            <Chart options={attendanceChart.options} series={attendanceChart.series} type="bar" height={280} />
          </div>
        </div>

        {/* Chart Row 2 - Leave, Payroll, Training */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Leave Distribution</h2>
            <Chart options={leaveChart.options} series={leaveChart.series} type="donut" height={300} />
          </div>
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Payroll Expenses</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Monthly</span>
              </div>
            </div>
            <Chart options={payrollChart.options} series={payrollChart.series} type="area" height={280} />
          </div>
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Training Completion</h2>
            <Chart options={trainingChart.options} series={trainingChart.series} type="donut" height={300} />
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Completion Rate</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>61.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Row 3 - KPI Performance & Attrition */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>KPI Performance</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Average Score</span>
              </div>
            </div>
            <Chart options={kpiChart.options} series={kpiChart.series} type="radar" height={320} />
          </div>
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Attrition Rate</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Monthly %</span>
              </div>
            </div>
            <Chart options={attritionChart.options} series={attritionChart.series} type="line" height={280} />
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                <span className="font-semibold">Alert:</span> Attrition rate increased by 0.5% this month
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default HrDashboard;