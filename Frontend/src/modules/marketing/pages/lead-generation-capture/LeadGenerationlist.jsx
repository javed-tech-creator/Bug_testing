import React, { useMemo, useState } from "react"; 
import PageHeader from "@/components/PageHeader";
import TechnologyTable from "@/modules/technology/components/TechnologyTable";
import LeadAssignModal from "../../components/lead-generation-capture/LeadAssign";
import { useGetLeadsQuery } from "@/api/marketing/leadGenerate.api";
import { Send } from "lucide-react";

const LeadGenerationlist = () => {
  const [itemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sourceFilter, setSourceFilter] = useState("");
  const [isForwarded,setIsForwarded] = useState(false);

  const { data: leads, isLoading:leadLoading, isFetching:leadFetching} = useGetLeadsQuery({
    page: currentPage,
    limit: itemsPerPage,
    source: sourceFilter,
    isForwarded:isForwarded,
  });


  const columnConfig = {
    fullName: { label: "Full Name", render: (row) => row.fullName || "—" },
    email: { label: "Email", render: (row) => row.email || "—" },
    phone: { label: "Phone", render: (row) => row.phone || "—" },
    source: { label: "Source", render: (row) => row.source || "—" },
    campaignId: { label: "Campaign ID", render: (row) => row.campaignId || "—" },
    campaignName: { label: "Campaign Name", render: (row) => row.campaignName || "—" },
    state: { label: "State", render: (row) => row.state || "—" },
    city: { label: "City", render: (row) => row.city || "—" },
    leadStatus: { label: "Lead Status", render: (row) => row.leadStatus || "—" },
    notes: { label: "Notes", render: (row) => row.notes || "—" },
    leadGeneratedTime: {
      label: "Generated At",
      render: (row) => {
        if (!row.leadGeneratedTime) return "—";
        const date = new Date(row.leadGeneratedTime);
        const formattedDate = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
        const formattedTime = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        return (
          <div className="text-sm text-gray-700">
            {formattedDate} <br />
            <span className="text-xs text-gray-500">{formattedTime}</span>
          </div>
        );
      },
    },
  };

  // Actions column definition
const actionsColumn = {
  key: "actions",
  label: "Actions",
  render: (row) => (
    <button
      type="button"
      onClick={() => handleAssign(row._id)}
      title="Forward to Sales Team"
      className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
    >
      <Send  className="w-4 h-4" />
      <span>Forward</span>
    </button>
  ),
};

const forwardedAtColumn = {
  key: "forwardedAt",
  label: "Forwarded At",
  render: (row) => {
    if (!row.forwardedAt) return "—";
    const date = new Date(row.forwardedAt);
    const formattedDate = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const formattedTime = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    return (
      <div className="text-sm text-gray-700">
        {formattedDate} <br />
        <span className="text-xs text-gray-500">{formattedTime}</span>
      </div>
    );
  },
};
  // columnArray calculate inside useMemo so it updates on isForwarded change
  const columnArray = useMemo(() => {
    const baseColumns = Object.entries(columnConfig).map(([key, value]) => ({ key, ...value }));
    if (!isForwarded) {
      baseColumns.unshift(actionsColumn);
      
    }else{
 baseColumns.push(forwardedAtColumn);
    }
    return baseColumns;
  }, [isForwarded]);

  const handleAssign = (id) => {
    setSelectedLead(id);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Lead Generation & Capture" />

      {/* Filters Card */}
      <div className="bg-white  border border-gray-200 border-b-0 shadow-md px-4 py-2 mt-4  flex flex-col md:flex-row md:items-center md:justify-between gap-3">
  {/* Source Filter */}
  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
    <label className="font-semibold text-gray-700 text-sm whitespace-nowrap">
      Filter by Source:
    </label>
    <select
      value={sourceFilter}
      onChange={(e) => {
        setSourceFilter(e.target.value);
        setCurrentPage(1);
      }}
      className="px-2 py-1.5 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium cursor-pointer transition"
    >
      <option value="">All</option>
      <option value="Referral">Referral</option>
      <option value="Instagram">Instagram</option>
      <option value="Google Ads">Google Ads</option>
      <option value="Facebook">Facebook</option>
      <option value="Whatsapp">Whatsapp</option>
      <option value="Other">Other</option>
    </select>
  </div>

  {/* Forwarded / Latest Leads Toggle */}
  <div className="flex gap-2">
    <button
      className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all duration-300 ${
        !isForwarded
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow hover:from-blue-600 hover:to-blue-700"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
      onClick={() => setIsForwarded(false)}
    >
      Latest Leads
    </button>

    <button
      className={`px-4 py-1.5 rounded-full font-semibold text-sm transition-all duration-300 ${
        isForwarded
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow hover:from-blue-600 hover:to-blue-700"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
      onClick={() => setIsForwarded(true)}
    >
      Forwarded Leads
    </button>
  </div>
</div>

      {/* Leads Table */}
      <div className="bg-white  overflow-hidden">
        <TechnologyTable
          columnArray={columnArray}
          tableData={leads?.data}
          total={leads?.total}
          isLoading={leadLoading || leadFetching}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Assign Lead Modal */}
      {selectedLead && (
        <LeadAssignModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          leadId={selectedLead}
        />
      )}
    </div>
  );
};

export default LeadGenerationlist;
