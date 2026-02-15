import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Package,
  AlertTriangle,
  MessageSquare,
  Send,
  Paperclip,
  CheckCircle2,
} from "lucide-react";

const FlagRaisedDetail = () => {
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  // Sample data for the flagged quotation
  const flagData = {
    id: 1,
    clientName: "GreenFields Co.",
    projectName: "Retails Store Signage",
    products: [
      {
        name: "LED Signage Board - 6x4 ft",
        quantity: 5,
        unitPrice: "₹45,000",
        total: "₹2,25,000",
      },
      {
        name: "Acrylic Letters - 12 inch",
        quantity: 50,
        unitPrice: "₹800",
        total: "₹40,000",
      },
      {
        name: "Installation & Setup",
        quantity: 1,
        unitPrice: "₹1,85,000",
        total: "₹1,85,000",
      },
    ],
    raisedOn: "11 Nov 25, 10:30AM",
    priority: "High",
    flagType: "Red",
    deadline: "11 Nov 25, 11:30AM",
    description:
      "Client has raised concerns about the pricing structure and delivery timeline. Urgent clarification needed on material specifications and installation process.",
    clientContact: {
      name: "John Anderson",
      email: "john.anderson@greenfields.com",
      phone: "+91 98765 43210",
    },
    quotationDetails: {
      quotationId: "QT-2025-001",
      totalAmount: "₹4,50,000",
      validUntil: "20 Nov 25",
      discount: "10%",
    },
    flagReason: [
      "Pricing concerns - competitor quoted lower",
      "Delivery timeline too long",
      "Material specifications unclear",
      "Installation process not detailed",
    ],
    timeline: [
      {
        date: "11 Nov 25, 10:30AM",
        action: "Flag Raised",
        by: "Client",
        status: "Red",
        note: "Urgent pricing and timeline clarification needed",
      },
      {
        date: "11 Nov 25, 09:15AM",
        action: "Quotation Sent",
        by: "Sales Team",
        status: "Completed",
        note: "Initial quotation shared with client",
      },
      {
        date: "10 Nov 25, 03:30PM",
        action: "Client Meeting",
        by: "Account Manager",
        status: "Completed",
        note: "Requirements discussed and documented",
      },
    ],
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      console.log("Submitting comment:", comment);
      setComment("");
    }
  };

  const handleResolveFlag = () => {
    console.log("Resolving flag with action:", selectedAction);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 border rounded-md bg-gray-50 hover:bg-gray-100 shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Flag Details - {flagData.quotationDetails.quotationId}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {flagData.clientName} • {flagData.projectName}
            </p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Flag Status</p>
                <span className="px-4 py-1.5 rounded border text-sm font-medium bg-red-50 text-red-500 border-red-100">
                  {flagData.flagType} Flag
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Priority</p>
                <span className="px-4 py-1.5 rounded border text-sm font-medium bg-red-50 text-red-500 border-red-100">
                  {flagData.priority}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Deadline</p>
                <p className="text-sm font-semibold text-gray-800">
                  {flagData.deadline}
                </p>
              </div>
            </div>
            <button className="bg-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-orange-600 transition-colors font-semibold">
              Escalate to Manager
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flag Description */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-gray-800">
                Flag Description
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {flagData.description}
            </p>
          </div>

          {/* Flag Reasons */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Issues Raised
            </h2>
            <ul className="space-y-3">
              {flagData.flagReason.map((reason, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-gray-700">{reason}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Table */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-800">
                Products ({flagData.products.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">
                      Product Name
                    </th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-gray-600">
                      Quantity
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">
                      Unit Price
                    </th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-600">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {flagData.products.map((product, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-2 text-sm text-gray-800">
                        {product.name}
                      </td>
                      <td className="py-3 px-2 text-sm text-center text-gray-700">
                        {product.quantity}
                      </td>
                      <td className="py-3 px-2 text-sm text-right text-gray-700">
                        {product.unitPrice}
                      </td>
                      <td className="py-3 px-2 text-sm text-right font-semibold text-gray-800">
                        {product.total}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td
                      colSpan="3"
                      className="py-3 px-2 text-sm font-bold text-gray-800 text-right"
                    >
                      Grand Total:
                    </td>
                    <td className="py-3 px-2 text-sm font-bold text-gray-800 text-right">
                      {flagData.quotationDetails.totalAmount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-800">Timeline</h2>
            </div>
            <div className="space-y-4">
              {flagData.timeline.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.status === "Red"
                          ? "bg-red-100"
                          : item.status === "Completed"
                          ? "bg-green-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {item.status === "Completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle
                          className={`w-5 h-5 ${
                            item.status === "Red"
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}
                        />
                      )}
                    </div>
                    {index !== flagData.timeline.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.action}
                      </h3>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">By: {item.by}</p>
                    <p className="text-sm text-gray-700">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-800">
                Internal Notes & Comments
              </h2>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment or note..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows="4"
                />
                <div className="flex items-center justify-between mt-3">
                  <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                    <Paperclip className="w-4 h-4" />
                    Attach File
                  </button>
                  <button
                    onClick={handleSubmitComment}
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-800">
                Client Information
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Company</p>
                <p className="text-sm font-semibold text-gray-800">
                  {flagData.clientName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Contact Person</p>
                <p className="text-sm font-semibold text-gray-800">
                  {flagData.clientContact.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm text-gray-700">
                  {flagData.clientContact.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="text-sm text-gray-700">
                  {flagData.clientContact.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Quotation Summary */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-800">
                Quotation Summary
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Quotation ID</p>
                <p className="text-sm font-semibold text-gray-800">
                  {flagData.quotationDetails.quotationId}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                <p className="text-lg font-bold text-orange-500">
                  {flagData.quotationDetails.totalAmount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Discount</p>
                <p className="text-sm text-gray-700">
                  {flagData.quotationDetails.discount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Valid Until</p>
                <p className="text-sm text-gray-700">
                  {flagData.quotationDetails.validUntil}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Action...</option>
                <option value="revise">Revise Quotation</option>
                <option value="schedule">Schedule Call</option>
                <option value="discount">Approve Discount</option>
                <option value="expedite">Expedite Delivery</option>
              </select>
              <button
                onClick={handleResolveFlag}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                Resolve Flag
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
                View Full Quotation
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
                Contact Client
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlagRaisedDetail;
