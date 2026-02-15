import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Eye, 
  Inbox,
  Send,
  ChevronLeft,
  ChevronRight,
  Filter,
  UserPlus
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

const RecommendationTable = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("received");
  const [givenData, setGivenData] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock Received Data
  const receivedData = [
    {
      id: 1,
      senderName: "Rahul Verma",
      senderDesignation: "Graphic Designer",
      department: "Design",
      message: "Excellent creativity and timely delivery of signage designs. Rahul consistently goes above and beyond in high-pressure situations.",
      date: "12 Jan 2026",
      status: "Active",
    },
    {
      id: 2,
      senderName: "Amit Singh",
      senderDesignation: "Production Manager",
      department: "Production",
      message: "Strong leadership and smooth production coordination. The workflow improvements implemented have saved us significant time.",
      date: "18 Jan 2026",
      status: "Active",
    },
  ];

  // Mock Given Data
  const mockGivenData = [
    {
      id: 101,
      receiverName: "Neha Sharma",
      receiverDesignation: "UI/UX Designer",
      department: "Product",
      message: "Very proactive and detail-oriented in all design tasks. Her ability to translate complex requirements into clean UI is unmatched.",
      date: "20 Jan 2026",
      status: "Sent",
    },
    {
      id: 102,
      receiverName: "Rohit Mehta",
      receiverDesignation: "Backend Developer",
      department: "Development",
      message: "Handled complex APIs efficiently and met all deadlines. A reliable developer with great technical depth.",
      date: "22 Jan 2026",
      status: "Sent",
    },
  ];

  // Load Data
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("givenRecommendations")) || [];
    setGivenData(storedData.length > 0 ? storedData : mockGivenData);
  }, []);

  const handleEdit = (id) => {
    navigate(`/recce/recommendation/form/${id}`);
  };

  const displayData = activeTab === "received" ? receivedData : givenData;

  // Filter and Sort Logic (Simulated)
  const filteredData = displayData.filter(item => {
    const name = activeTab === "received" ? item.senderName : item.receiverName;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Header - Using your existing PageHeader but adding container styling */}
     
        <PageHeader
          title="Recommendations"
            btnTitle="Create Recommendation"
            path="/recce/recommendation/form/new"
            onClick={() => navigate("/recce/recommendation/form/new")}
        />
     

      <main className="">
        
        {/* Statistics Dashboard Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Engagements</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-slate-900">{receivedData.length + givenData.length}</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Received</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{receivedData.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Given</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{givenData.length}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between p-4 border-b border-slate-100 gap-4">
            
            {/* Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-xl w-full lg:w-auto">
              <button
                onClick={() => setActiveTab("received")}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "received" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Inbox size={16} /> Received
              </button>
              <button
                onClick={() => setActiveTab("given")}
                className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "given" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Send size={16} /> Given
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-grow lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by name..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            {filteredData.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left bg-slate-50/50">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Professional</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Message Content</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                            {(activeTab === "received" ? item.senderName : item.receiverName).split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {activeTab === "received" ? item.senderName : item.receiverName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {activeTab === "received" ? item.senderDesignation : item.receiverDesignation}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-600 uppercase tracking-tight">
                          {item.department}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="max-w-md">
                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed italic">
                            "{item.message}"
                          </p>
                          <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">{item.date}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-1">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Details">
                            <Eye size={18} />
                          </button>
                          {activeTab === "given" && (
                            <button 
                              onClick={() => handleEdit(item.id)}
                              className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" 
                              title="Edit"
                            >
                              <Edit3 size={18} />
                            </button>
                          )}
                          <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Professional Empty State */
              <div className="py-24 flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6">
                  <UserPlus size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No recommendations found</h3>
                <p className="text-slate-500 text-sm max-w-sm text-center leading-relaxed">
                  {activeTab === "received" 
                    ? "Your professional wall is quiet. Once colleagues endorse your work, they will appear here." 
                    : "You haven't authored any recommendations yet. Start by praising a colleague's hard work."}
                </p>
                {activeTab === "given" && (
                  <button
                    onClick={() => navigate("/recce/recommendation/form/new")}
                    className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    Write First Recommendation
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          {filteredData.length > 0 && (
            <div className="bg-slate-50/50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500">
                Showing <span className="text-slate-900 font-bold">{filteredData.length}</span> of {displayData.length} records
              </p>
              <div className="flex gap-2">
                <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-900 transition-all">
                  <ChevronLeft size={16} />
                </button>
                <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-100">
                  1
                </button>
                <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-900 transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecommendationTable; 