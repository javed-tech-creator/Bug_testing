import React, { useMemo, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import { 
  Download, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  Users, 
  Target,
  Calendar,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from "lucide-react";

// Enhanced dummy data with more realistic metrics
const dummyCampaigns = [
  {
    id: "c1",
    name: "Diwali Sale Blast",
    platform: "Facebook",
    spend: 50000,
    clicks: 20200,
    conversions: 10100,
    leads: 220,
    impressions: 120000,
    startDate: "2025-09-01",
    endDate: "2025-09-20",
    createdAt: "2025-09-10T10:15:00Z",
    status: "active",
    roas: 4.2,
    ctr: 4.2,
    conversionRate: 7.1
  },
  {
    id: "c2",
    name: "New Year Mega Offer",
    platform: "Google Ads",
    spend: 100000,
    clicks: 40000,
    conversions: 15000,
    leads: 360,
    impressions: 250000,
    startDate: "2025-12-15",
    endDate: "2026-01-05",
    createdAt: "2025-09-11T14:30:00Z",
    status: "active",
    roas: 3.8,
    ctr: 3.8,
    conversionRate: 6.5
  },
  {
    id: "c3",
    name: "Referral Bonus Drive",
    platform: "Referral",
    spend: 15000,
    clicks: 4000,
    conversions: 1000,
    leads: 85,
    impressions: 20000,
    startDate: "2025-09-05",
    endDate: "2025-09-30",
    createdAt: "2025-09-12T09:00:00Z",
    status: "paused",
    roas: 5.2,
    ctr: 3.2,
    conversionRate: 5.6
  },
  {
    id: "c4",
    name: "Brand Awareness",
    platform: "Instagram",
    spend: 35000,
    clicks: 20000,
    conversions: 14000,
    leads: 150,
    impressions: 180000,
    startDate: "2025-08-20",
    endDate: "2025-09-15",
    createdAt: "2025-09-08T16:45:00Z",
    status: "completed",
    roas: 3.5,
    ctr: 2.8,
    conversionRate: 9.0
  },
  {
    id: "c5",
    name: "LinkedIn B2B Campaign",
    platform: "LinkedIn",
    spend: 12000,
    clicks: 420,
    conversions: 38,
    leads: 65,
    impressions: 15000,
    startDate: "2025-09-01",
    endDate: "2025-09-30",
    createdAt: "2025-09-05T12:00:00Z",
    status: "active",
    roas: 4.5,
    ctr: 2.5,
    conversionRate: 6.3
  },
];

const COLORS = ["#6366f1", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#06b6d4"];

// Utility functions
function downloadCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(",")]
    .concat(
      rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printAsPDF(elementId, title = "Report") {
  const el = document.getElementById(elementId);
  if (!el) return;
  const w = window.open("", "_blank");
  w.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>
          body{font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding:20px; background:#f8fafc;}
          .no-print{display:none;}
          table{border-collapse:collapse;width:100%;}
          th,td{border:1px solid #e2e8f0;padding:8px;text-align:left;}
          th{background:#f1f5f9;}
        </style>
      </head>
      <body>
        ${el.innerHTML}
      </body>
    </html>
  `);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 500);
}

// Enhanced KPI Card with trend indicators
const KpiCard = ({ title, value, sub, trend, trendValue, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200", 
    red: "bg-red-50 text-red-600 border-red-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            {Icon && (
              <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
                <Icon className="w-4 h-4" />
              </div>
            )}
            <span className="text-sm font-medium text-gray-600">{title}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
          {sub && <div className="text-sm text-gray-500">{sub}</div>}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Funnel Component
const Funnel = ({ steps }) => {
  const total = steps[0]?.value || 1;
  
  return (
    <div className="space-y-4">
      {steps.map((step, idx) => {
        const percentage = Math.round((step.value / total) * 100);
        const conversionRate = idx > 0 ? Math.round((step.value / steps[idx-1].value) * 100) : 100;
        
        return (
          <div key={step.label} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{step.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{conversionRate}%</span>
                <span className="text-sm font-semibold text-gray-900">{step.value.toLocaleString()}</span>
              </div>
            </div>
            <div className="relative bg-gray-100 rounded-full h-8 overflow-hidden">
              <div
                className="h-full rounded-full flex items-center px-4 text-sm font-medium text-white transition-all duration-500"
                style={{ 
                  width: `${percentage}%`, 
                  background: `linear-gradient(135deg, ${COLORS[idx % COLORS.length]}, ${COLORS[(idx + 1) % COLORS.length]})`
                }}
              >
                <span className="truncate">{percentage}%</span>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex justify-center mt-2">
                <div className="w-px h-4 bg-gray-300"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Platform Performance Ring Chart
const PlatformPerformance = ({ data }) => (
  <div style={{ height: 300 }}>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="spend"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spend']}
          labelStyle={{ color: '#374151', fontWeight: 'bold' }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

// Enhanced Campaign Performance Component
const EnhancedCampaignPerformance = ({ selectedPlatforms, setSelectedPlatforms, comparisonData }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const allPlatforms = [...new Set(dummyCampaigns.map(d => d.platform))];

  const totalMetrics = useMemo(() => {
    return comparisonData.reduce((acc, curr) => ({
      spend: acc.spend + curr.spend,
      clicks: acc.clicks + curr.clicks,
      conversions: acc.conversions + curr.conversions
    }), { spend: 0, clicks: 0, conversions: 0 });
  }, [comparisonData]);

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 min-w-[200px]">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{entry.name}:</span>
                </div>
                <span className="font-medium text-gray-900">
                  {entry.name.includes('₹') ? `₹${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
                </span>
              </div>
            ))}
            <hr className="my-2" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">CTR:</span>
              <span className="font-medium">{data.ctr}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Conv. Rate:</span>
              <span className="font-medium">{data.conversionRate}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Campaign Performance</h3>
              <p className="text-sm text-gray-600">Compare spend, clicks, and conversions across platforms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">₹{totalMetrics.spend.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Spend</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{totalMetrics.clicks.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Clicks</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{totalMetrics.conversions.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Conversions</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-gray-50/50 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter Platforms:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allPlatforms.map(platform => (
              <button
                key={platform}
                onClick={() => handlePlatformToggle(platform)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedPlatforms.includes(platform)
                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={comparisonData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              barGap={10}
            >
              <XAxis 
                dataKey="platform" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                interval={0}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="roundRect"
              />
              <Bar 
                dataKey="spend" 
                name="Spend (₹)" 
                fill="#6366f1" 
                radius={[6, 6, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
              <Bar 
                dataKey="clicks" 
                name="Clicks" 
                fill="#10b981" 
                radius={[6, 6, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
              <Bar 
                dataKey="conversions" 
                name="Conversions" 
                fill="#f59e0b" 
                radius={[6, 6, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default function Analytics() {
  const [selectedPlatforms, setSelectedPlatforms] = useState(["Facebook", "Google Ads", "Referral", "Instagram", "LinkedIn"]);
  const [dateRange, setDateRange] = useState("30d");
  const printRefId = "analytics-report";

  // Enhanced computed metrics
  const metrics = useMemo(() => {
    const totalSpend = dummyCampaigns.reduce((s, c) => s + c.spend, 0);
    const totalClicks = dummyCampaigns.reduce((s, c) => s + c.clicks, 0);
    const totalConversions = dummyCampaigns.reduce((s, c) => s + c.conversions, 0);
    const totalImpressions = dummyCampaigns.reduce((s, c) => s + c.impressions, 0);
    const totalRevenue = dummyCampaigns.reduce((s, c) => s + (c.conversions * c.roas * (c.spend / c.conversions || 0)), 0);
    
    const cpl = totalConversions ? Math.round((totalSpend / totalConversions) * 100) / 100 : 0;
    const cpc = totalClicks ? Math.round((totalSpend / totalClicks) * 100) / 100 : 0;
    const cpm = totalImpressions ? Math.round((totalSpend / totalImpressions * 1000) * 100) / 100 : 0;
    const convRate = totalClicks ? Math.round((totalConversions / totalClicks) * 10000) / 100 : 0;
    const roas = totalSpend ? Math.round((totalRevenue / totalSpend) * 100) / 100 : 0;
    const ctr = totalImpressions ? Math.round((totalClicks / totalImpressions) * 10000) / 100 : 0;
    
    return { 
      totalSpend, 
      totalClicks, 
      totalConversions, 
      totalImpressions, 
      totalRevenue,
      cpl, 
      cpc, 
      cpm,
      convRate, 
      roas,
      ctr 
    };
  }, []);

  // Platform comparison data
  const comparisonData = useMemo(() => {
    const grouped = {};
    dummyCampaigns.forEach((c) => {
      const k = c.platform;
      if (!grouped[k]) grouped[k] = { 
        platform: k, 
        spend: 0, 
        clicks: 0, 
        conversions: 0, 
        impressions: 0,
        roas: 0,
        ctr: 0,
        conversionRate: 0
      };
      grouped[k].spend += c.spend;
      grouped[k].clicks += c.clicks;
      grouped[k].conversions += c.conversions;
      grouped[k].impressions += c.impressions;
      grouped[k].roas = Math.round((grouped[k].roas + c.roas) / 2 * 100) / 100;
      grouped[k].ctr = c.ctr;
      grouped[k].conversionRate = c.conversionRate;
    });
    return Object.values(grouped).filter((g) => selectedPlatforms.includes(g.platform));
  }, [selectedPlatforms]);

  // Funnel data
  const funnelSteps = useMemo(() => {
    const impressions = dummyCampaigns.reduce((s, c) => s + (c.impressions || 0), 0);
    const clicks = dummyCampaigns.reduce((s, c) => s + c.clicks, 0);
    const leads = dummyCampaigns.reduce((s, c) => s + c.leads, 0);
    const conversions = dummyCampaigns.reduce((s, c) => s + c.conversions, 0);
    return [
      { label: "Impressions", value: impressions },
      { label: "Clicks", value: clicks },
      { label: "Leads Generated", value: leads },
      { label: "Conversions", value: conversions },
    ];
  }, []);

  // Table data
  const tableRows = dummyCampaigns.map((c) => ({
    id: c.id,
    name: c.name,
    platform: c.platform,
    spend: c.spend,
    clicks: c.clicks,
    conversions: c.conversions,
    impressions: c.impressions,
    cpl: c.conversions ? Math.round((c.spend / c.conversions) * 100) / 100 : "-",
    roas: c.roas,
    startDate: c.startDate,
    endDate: c.endDate,
    status: c.status,
  }));

  const handleExportCSV = () => downloadCSV("campaigns_report.csv", tableRows);
  const handleExportPDF = () => printAsPDF(printRefId, "Marketing Analytics Report");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketing Analytics</h1>
            <p className="text-sm text-gray-600 mt-1">Track performance, measure ROI, and optimize campaigns</p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          <KpiCard 
            title="Total Spend" 
            value={`₹${(metrics.totalSpend / 1000).toFixed(0)}K`}
            sub="This month"
            trend="up" 
            trendValue="12.5%"
            icon={TrendingUp}
            color="blue"
          />
          <KpiCard 
            title="Impressions" 
            value={`${(metrics.totalImpressions / 1000).toFixed(0)}K`}
            sub={`CTR: ${metrics.ctr}%`}
            trend="up" 
            trendValue="8.3%"
            icon={Eye}
            color="purple"
          />
          <KpiCard 
            title="Clicks" 
            value={metrics.totalClicks.toLocaleString()}
            sub={`CPC: ₹${metrics.cpc}`}
            trend="up" 
            trendValue="15.2%"
            icon={MousePointer}
            color="green"
          />
          <KpiCard 
            title="Conversions" 
            value={metrics.totalConversions}
            sub={`Rate: ${metrics.convRate}%`}
            trend="down" 
            trendValue="2.1%"
            icon={Target}
            color="indigo"
          />
          <KpiCard 
            title="ROAS" 
            value={`${metrics.roas}x`}
            sub="Return on ad spend"
            trend="up" 
            trendValue="0.8x"
            icon={TrendingUp}
            color="green"
          />
          <KpiCard 
            title="CPM" 
            value={`₹${metrics.cpm}`}
            sub="Cost per 1K impressions"
            trend="down" 
            trendValue="5.5%"
            icon={Users}
            color="yellow"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Campaign Performance */}
          <EnhancedCampaignPerformance 
            selectedPlatforms={selectedPlatforms}
            setSelectedPlatforms={setSelectedPlatforms}
            comparisonData={comparisonData}
          />

          {/* Conversion Funnel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Conversion Funnel</h3>
              <p className="text-sm text-gray-600">User journey from impression to conversion</p>
            </div>
            <Funnel steps={funnelSteps} />
          </div>
        </div>

        {/* Platform Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Spend Distribution</h3>
              <p className="text-sm text-gray-600">Budget allocation across platforms</p>
            </div>
            <PlatformPerformance data={comparisonData} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
              <p className="text-sm text-gray-600">ROAS trends over time</p>
            </div>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData}>
                  <XAxis 
                    dataKey="platform" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="roas" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Campaign Table */}
        <div id={printRefId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Campaign Details</h3>
                <p className="text-sm text-gray-600">Detailed performance metrics for all campaigns</p>
              </div>
              <div className="flex items-center gap-3 no-print">
                <button 
                  onClick={handleExportCSV} 
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button 
                  onClick={handleExportPDF} 
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ROAS</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">CPL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableRows.map((row, index) => (
                  <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{row.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{row.platform}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        row.status === 'active' ? 'bg-green-100 text-green-800' :
                        row.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      ₹{row.spend.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {row.impressions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {row.clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {row.conversions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {row.roas}x
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                      {typeof row.cpl === 'number' ? `₹${row.cpl}` : row.cpl}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{row.startDate}</div>
                      <div className="text-xs text-gray-500">to {row.endDate}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}