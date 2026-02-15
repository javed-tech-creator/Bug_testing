import React, { useEffect, useState } from "react";
import { useAuth } from "../../../store/AuthContext";
import { MdSpaceDashboard } from "react-icons/md";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import {
  Bell,
  ShoppingCart,
  FileText,
  DollarSign,
  Users,
  Box,
  Layers,
  Plus,
  Zap,
  FileStack,
} from "lucide-react";
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
} from "recharts";
import { Card, CardContent } from "../components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useGetCategoriesQuery } from "@/api/vendor/productCategory.api";
import DataLoading from "../components/DataLoading";
import {
  useGetLatestInvoicesQuery,
  useGetVendorChartsDataQuery,
  useGetVendorTopCardsQuery,
} from "@/api/vendor/dashboard.api";
import { useSelector } from "react-redux";
// import { useGetInvoicesQuery } from "@/api/vendor/invoice.api";

// Define list of cards

const VendorDashboard = () => {
  // const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const userData = useSelector((state) => state.auth.userData);
  console.log("user login data is", userData);

  //  Queries
  const { data: topCards, isLoading: loadingTop } = useGetVendorTopCardsQuery();
  const {
    data: latestInvoices,
    isLoading: loadingInvoices,
    isFetching,
  } = useGetLatestInvoicesQuery({ page: currentPage, limit: itemsPerPage });
  const { data: charts, isLoading: loadingCharts } =
    useGetVendorChartsDataQuery();

  //   useEffect(()=>{
  //   console.log("topCards is ------1200",topCards);
  // console.log("latestInvoices is ------1200",latestInvoices);
  // console.log("charts is ------1200",charts);
  //   },[topCards,latestInvoices,charts])

  const filteredList = latestInvoices?.data || [];

  const { data, isLoading: getLoading } = useGetCategoriesQuery();
  const categories = data?.data || [];

  console.log("category is ------1200", categories);

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

  const navigate = useNavigate();
  return (
    <>
      <div className="w-full rounded-xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-[1px] shadow mb-2">
        <div className="bg-white rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
            <MdSpaceDashboard className="text-orange-500" />{" "}
            <span>Dashboard</span>
          </h2>
          <div className="text-sm text-gray-500">
            Welcome,{" "}
            <span className="font-medium text-gray-700">
              {userData.user.name}
            </span>
          </div>
        </div>
      </div>

      {loadingTop || loadingInvoices || loadingCharts || getLoading ? (
        <div className="h-96 w-full flex justify-center items-center">
          <DataLoading />
        </div>
      ) : (
        <div className="mt-5 space-y-6 mb-2">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link to="/vendor/product">
              <Card className="rounded-2xl shadow-md">
                <CardContent className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
                  <div>
                    <p className="text-gray-500">Total Products</p>
                    <h2 className="text-2xl font-bold">
                      {topCards?.totalProducts}
                    </h2>
                  </div>
                  <ShoppingCart className="text-blue-500 w-8 h-8" />
                </CardContent>
              </Card>
            </Link>
            <Link to="/vendor/purchaseOrder">
              <Card className="rounded-xl shadow-md">
                <CardContent className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
                  <div>
                    <p className="text-gray-500">Total Invoices</p>
                    <h2 className="text-2xl font-bold">
                      {topCards?.totalInvoices}
                    </h2>
                  </div>
                  <FileText className="text-green-500 w-8 h-8" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/vendor/product">
              <Card className="rounded-xl shadow-md">
                <CardContent className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
                  <div>
                    <p className="text-gray-500">Total Sales</p>
                    <h2 className="text-2xl font-bold">
                      {topCards?.totalSales ? "₹" : ""}
                      {topCards?.totalSales}
                    </h2>
                  </div>
                  <DollarSign className="text-yellow-500 w-8 h-8" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/vendor/product">
              <Card className="rounded-xl shadow-md">
                <CardContent className="flex items-center justify-between rounded-xl p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div>
                    <p className="text-gray-500">Customers</p>
                    <h2 className="text-2xl font-bold">
                      {topCards?.totalCustomers}
                    </h2>
                  </div>
                  <Users className="text-purple-500 w-8 h-8" />
                </CardContent>
              </Card>
            </Link>
          </div>
          {/* Categories Section */}
          <div className="mt-6">
            {/* Heading */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Layers className="w-5 h-5" />
                </span>
                Categories
              </h3>
              {/* Total Count */}
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
                Total: {categories?.length || 0}
              </span>
            </div>

            {getLoading ? (
              //  Loader
              <div className="flex justify-center items-center h-32">
                <DataLoading />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.length > 0 ? (
                  categories.map((cat, idx) => (
                    <Card
                      key={idx}
                      className="rounded-2xl shadow-lg hover:shadow-md transition transform hover:-translate-y-1"
                    >
                      <CardContent className="p-5 flex items-center justify-between rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
                        {/* Left: Title and Product Count */}
                        <div className="flex flex-col space-y-1">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {cat.categoryName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {cat.productCount} Products
                          </p>
                        </div>

                        {/* Right: Smaller Colorful Icon */}
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full 
                      ${
                        idx === 3
                          ? "bg-purple-500"
                          : idx % 3 === 0
                          ? "bg-blue-400"
                          : idx % 3 === 1
                          ? "bg-green-400"
                          : "bg-yellow-400"
                      } 
                       text-white`}
                        >
                          <Box className="w-5 h-5" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No categories found.</p>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
              <span className="p-2 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 text-pink-600 rounded-lg">
                <Zap className="w-5 h-5" />
              </span>
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                onClick={() => {
                  navigate("/vendor/product?openModal=true");
                  console.log("hii this is testing");
                }}
                className="cursor-pointer hover:shadow-md transition transform hover:-translate-y-1 rounded-2xl border border-gray-100"
              >
                <Card>
                  <CardContent className="p-4 flex flex-col items-center space-y-2 text-center bg-gradient-to-r rounded-xl from-blue-50 to-purple-50">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 ">
                      <Plus className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium">Add Product</p>
                  </CardContent>
                </Card>
              </div>

              <div
                onClick={() => navigate("/vendor/generateinvoice")}
                className="cursor-pointer hover:shadow-md transition transform hover:-translate-y-1 rounded-2xl border border-gray-100 "
              >
                <Card>
                  <CardContent className="p-4 flex flex-col items-center space-y-2 text-center bg-gradient-to-r rounded-xl from-blue-50 to-purple-50">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium">Create Invoice</p>
                  </CardContent>
                </Card>
              </div>

              <div
                onClick={() => navigate("/vendor/purchaseOrder/Drafts")}
                className="cursor-pointer hover:shadow-md transition transform hover:-translate-y-1 rounded-2xl border border-gray-100"
              >
                <Card>
                  <CardContent className="p-4 flex flex-col items-center space-y-2 text-center bg-gradient-to-r rounded-xl from-blue-50 to-purple-50">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                      <FileStack className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium">View Drafts</p>
                  </CardContent>
                </Card>
              </div>

              <div
                onClick={() => navigate("/vendor/category?openModal=true")}
                className="cursor-pointer hover:shadow-md transition transform hover:-translate-y-1 rounded-2xl border border-gray-100 "
              >
                <Card>
                  <CardContent className="p-4 flex flex-col items-center space-y-2 text-center bg-gradient-to-r rounded-xl from-blue-50 to-purple-50">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <Plus className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium">Add Category</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-xl  space-y-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="p-2 bg-gradient-to-r from-green-100 via-teal-100 to-cyan-100 text-teal-600 rounded-lg shadow-md">
                  <FileText className="w-5 h-5" />
                </span>
                Recent Orders
              </h3>
              {/* Total Count */}
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
                Total: {latestInvoices?.total || 0}
              </span>
            </div>

            {/* // one week table  */}
            <div className="overflow-x-auto max-h-[52vh] overflow-y-scroll hide-scrollbar">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-black text-white sticky top-0 z-5">
                  <tr>
                    <th className="p-3 font-semibold text-center border">
                      Bill#
                    </th>
                    <th className="p-3 font-semibold text-center border">
                      Customer
                    </th>
                    <th className="p-3 font-semibold text-center border">
                      Date
                    </th>
                    <th className="p-3 font-semibold text-center border">
                      Amount
                    </th>
                    <th className="p-3 font-semibold text-center border">
                      Status
                    </th>
                    <th className="p-3 font-semibold text-center border">
                      Mode
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingInvoices || isFetching ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-6 text-gray-500 bg-white"
                      >
                        <DataLoading />
                      </td>
                    </tr>
                  ) : filteredList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-6 text-gray-500 bg-white"
                      >
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((order, i) => (
                      <tr
                        key={i}
                        className="transition-all duration-200 cursor-pointer"
                      >
                        {/* Invoice ID */}
                        <td className="p-3 text-center border border-gray-200">
                          <span className="px-2 py-1 rounded-lg text-indigo-800 font-semibold">
                            {order.invoiceId}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="p-3 text-center border border-gray-200">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-indigo-600">
                              {order.customerName}
                            </span>
                            <span className="mt-1 text-xs px-2 py-0.5 rounded-full text-pink-600 font-medium">
                              {order.customerPhone}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="p-3 text-center border border-gray-200 text-gray-700 font-medium">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>

                        {/* Grand Total */}
                        <td className="p-3 text-center border border-gray-200 font-semibold text-indigo-700">
                          ₹ {order.grandTotal.toLocaleString()}
                        </td>

                        {/* Payment Status */}
                        <td className="p-3 text-center border border-gray-200">
                          {(() => {
                            const statusClasses = {
                              Paid: "text-green-700",
                              Pending: "text-red-700",
                              Partial: "text-yellow-700",
                            };
                            const pendingAmount =
                              order.grandTotal - order.amountPaid;
                            return (
                              <div className="inline-flex flex-col items-center">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    statusClasses[order.paymentStatus] ||
                                    "text-gray-600"
                                  }`}
                                >
                                  {order.paymentStatus}
                                </span>
                                {order.paymentStatus === "Partial" && (
                                  <span className="text-[10px] font-semibold text-blue-500 mt-1">
                                    Pending: ₹{pendingAmount.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </td>

                        {/* Payment Mode */}
                        <td className="p-3 text-center border border-gray-200">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${
                              order.paymentMode.toLowerCase() === "pending"
                                ? "text-yellow-700"
                                : "text-blue-800"
                            }`}
                          >
                            {order.paymentMode}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-2">
              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                Prev
              </button>

              {/* Page Numbers */}
              {[
                ...Array(
                  Math.ceil((latestInvoices?.total || 0) / itemsPerPage)
                ).keys(),
              ].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page + 1)}
                  className={`px-3 py-1 border rounded-md ${
                    currentPage === page + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {page + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev <
                    Math.ceil((latestInvoices?.total || 0) / itemsPerPage)
                      ? prev + 1
                      : prev
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil((latestInvoices?.total || 0) / itemsPerPage)
                }
                className={`px-3 py-1 border rounded-md ${
                  currentPage ===
                  Math.ceil((latestInvoices?.total || 0) / itemsPerPage)
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="p-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                📈
              </span>{" "}
              Analytics Overview
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Sales performance and order status insights
            </p>
          </div>
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      contentStyle={{
                        borderRadius: "12px",
                        padding: "10px",
                        backgroundColor: "#f9fafb",
                      }}
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
                      <linearGradient
                        id="salesGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3b82f6"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="#6366f1"
                          stopOpacity={0.6}
                        />
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
                  <h3 className="font-semibold text-lg text-gray-800">
                    📊 Orders Status
                  </h3>

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
                          `${name} (${((value / totalOrders) * 100).toFixed(
                            1
                          )}%)`
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
                          `${value} Orders (${(
                            (value / totalOrders) *
                            100
                          ).toFixed(1)}%)`,
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
        </div>
      )}
    </>
  );
};

export default VendorDashboard;
