import {
  ArrowLeft,
  Phone,
  User,
  Calendar,
  ClipboardList,
  Package,
  FileText,
  Clock,
  Mail,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/dynamic/PageHeader";

const SalesPage = () => {
  // 🔹 Dummy Sales Data
  const salesData = {
    executiveName: "Rahul Sharma",
    contact: "+91 98765 43210",
    email: "rahul.sharma@company.com",
    orderDate: "15 Jan 2024",
    commitmentTimeline: "45 Days",
    expectedDelivery: "01 Mar 2024",
    scopeOfWork:
      "Complete branding solution including signage design, fabrication, installation, and post-installation support.",
    products: [
      { name: "LED Sign Board", qty: 2, status: "In Progress" },
      { name: "Acrylic Letter Signage", qty: 5, status: "Completed" },
      { name: "Wayfinding Sign Boards", qty: 8, status: "In Progress" },
      { name: "Reception Branding", qty: 1, status: "Pending" },
    ],
    orderValue: "₹3,45,000",
    advancePaid: "₹1,50,000",
    balanceAmount: "₹1,95,000",
    timeline: [
      { title: "Order Placed", date: "15 Jan 2024, 10:30 AM", completed: true },
      {
        title: "Production In Progress",
        date: "Expected by 20 Feb 2024",
        completed: false,
      },
      {
        title: "Delivery & Installation",
        date: "Expected by 01 Mar 2024",
        completed: false,
      },
    ],
  };

  const salesSummaryCards = [
    {
      label: "Order Date",
      value: salesData.orderDate,
      icon: Calendar,
      gradient: "from-blue-50 to-blue-100",
      border: "border-blue-200",
      iconColor: "text-blue-600",
      textColor: "text-blue-900",
      labelColor: "text-blue-700",
    },
    {
      label: "Timeline",
      value: salesData.commitmentTimeline,
      icon: ClipboardList,
      gradient: "from-emerald-50 to-emerald-100",
      border: "border-emerald-200",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-900",
      labelColor: "text-emerald-700",
    },
    {
      label: "Expected Delivery",
      value: salesData.expectedDelivery,
      icon: Clock,
      gradient: "from-purple-50 to-purple-100",
      border: "border-purple-200",
      iconColor: "text-purple-600",
      textColor: "text-purple-900",
      labelColor: "text-purple-700",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="">
      <div className="">
        {/* ================= HEADER ================= */}
     
        <PageHeader
          title=" Sales Order Details"
          subtitle=" Order ID: #SO-2024-001"
          showStatusBadge={true}
          status="completed"
        />

        {/* ================= EXECUTIVE CARD ================= */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200  mb-6">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
              <User size={28} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Sales Executive
              </p>
              <p className="text-xl font-bold text-slate-900 mb-3">
                {salesData.executiveName}
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                  <Phone size={16} className="text-indigo-500" />
                  {salesData.contact}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                  <Mail size={16} className="text-indigo-500" />
                  {salesData.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ORDER INFO GRID ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {salesSummaryCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <div
                key={index}
                className={`bg-gradient-to-br ${card.gradient} rounded-md shadow-lg border ${card.border} p-6 transition hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-md bg-white ${card.iconColor} shadow-md`}
                  >
                    <Icon size={22} />
                  </div>

                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${card.labelColor}`}
                  >
                    {card.label}
                  </p>
                </div>

                <p className={`text-2xl font-bold ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* ================= PRODUCTS + TIMELINE WRAPPER ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ================= PRODUCTS LIST ================= */}
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Package size={20} className="text-indigo-500" />
              Finalized Products
            </h3>
            <div className="space-y-4">
              {salesData.products.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-md hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-md bg-white border-2 border-indigo-200 text-indigo-600 font-bold shadow">
                      {item.qty}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Quantity: {item.qty} units
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= TIMELINE ================= */}
          <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock size={20} className="text-indigo-500" />
              Order Timeline
            </h3>
            <div className="space-y-6">
              {salesData.timeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                        item.completed ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      {item.completed ? "✓" : index + 1}
                    </div>
                    {index < salesData.timeline.length - 1 && (
                      <div
                        className={`w-0.5 h-16 ${
                          item.completed ? "bg-emerald-300" : "bg-slate-300"
                        }`}
                      ></div>
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <p
                      className={`font-semibold ${
                        item.completed ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`text-sm ${
                        item.completed ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= SCOPE OF WORK ================= */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-indigo-500" />
            Scope of Work
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-md p-5 border border-slate-200">
            {salesData.scopeOfWork}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
