import React, { useState } from "react";
import Table from "../../../../components/Table";
import {
  useFetchLeadsQuery,
  useUpdateLeadMutation,
} from "../../../../api/sales/lead.api";
import {
  useCreateClientMutation,
  useUpdateClientMutation,
} from "../../../../api/sales/client.api"; 
import Loader from "../../../../components/Loader";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { CircleQuestionMark, Eye, SquarePen } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function LeadSheet() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("");
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};

  const params =
    user?.designation?.title === "Sales Executive"
      ? `leadBy=${user._id}&assignTo=${user._id}&leadStatus=NOT INTERESTED&page=${page}&limit=${limit}&match=and`
      : `&page=${page}&limit=${limit}&leadStatus="NOT INTERESTED"`;

  const { data, isLoading, error } = useFetchLeadsQuery({ params });
  const [updateLead] = useUpdateLeadMutation();
  const [createClient] = useCreateClientMutation();
  const [updateClient] = useUpdateClientMutation();
  const navigate = useNavigate();

  const leads = data?.data?.leads || [];
console.log(leads)
  const handleUpdate = (item) => {
    navigate(`/sales/leads/sheet/update/${item?._id}`);
  };

  const handleInterested = (item) => {
    setSelectedLead(item);
    setStatus("");
    setShowModal(true);
  };

  const handleSubmitStatus = async () => {
    if (!status) return toast.warning("Select a status first");
    if (!selectedLead) return toast.error("No lead selected");
    // if (selectedLead.leadStatus === status) {
    //   toast.info(`Lead is already marked as ${status}`);
    //   return;
    // }
    try {
      // Update lead status
      await updateLead({
        id: selectedLead._id,
        formData: {
          leadStatus: "INTERESTED",
        },
      }).unwrap();

      toast.success(`Lead marked as ${status}`);
      console.log("Selected Lead:", status);
      if (status === "INTERESTED") {
        const makePassword = () =>
          `DSS@${Math.floor(1000 + Math.random() * 9000)}`;

        const clientData = {
          leadId: [selectedLead._id],
          name: selectedLead.clientName,
          email: selectedLead?.email || null,
          password: makePassword(),
          phone: selectedLead?.phone,
          companyName: selectedLead?.companyName || "",
          businessType: selectedLead?.businessType || "",
          designation: selectedLead?.designation || "",
          address: selectedLead?.address || "",
          city: selectedLead?.city || "",
          state: selectedLead?.state || "",
          pincode: selectedLead?.pincode || "",
          revenue: "LOW",
          satisfaction: "LOW",
          repeatPotential: "LOW",
          complexity: "LOW",
          engagement: "LOW",
          positiveAttitude: "LOW",
          clientRating: 0,
        };

        if (selectedLead?.leadType === "REPEAT" && selectedLead?.clientId) {
          const updateResult = await updateClient({
            id: selectedLead.clientId,
            formData: clientData,
          }).unwrap();

          if (updateResult.success) {
            toast.success("Client updated successfully!");
            navigate(`/sales/client-overview/${updateResult.data._id}`);
          }
        }
        else if (selectedLead?.leadType == "FRESH") {
          const clientResult = await createClient({
            formData: clientData,
          }).unwrap();

          if (clientResult.success) {
            toast.success("Client created successfully!");
            navigate(`/sales/client-overview/${clientResult.data._id}`);
          }
        }
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error(err?.data?.message || "Error updating lead status");
    }
    finally {
      setShowModal(false);
      setSelectedLead(null);
      setStatus("");
    }
  };

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (val, row) => (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleUpdate(row)}
            className="px-1 py-0.5 border border-orange-500 text-orange-500 rounded cursor-pointer"
            title="Detail View"
          >
            <Eye size={20} />
          </button>
          {/* <button
            onClick={() => handleInterested(row)}
            className="text-orange-500 hover:text-orange-600 cursor-pointer transition-colors"
            title="View / Interested"
          >
            <CircleQuestionMark size={20} />
          </button> */}
        </div>
      ),
    },
    createdAt: {
      label: "Created Date",
      render: (val) => new Date(val).toLocaleString("en-IN"),
    },
    leadStatus: { label: "Status" },
    clientName: { label: "Concern Person Name" },
    phone: { label: "Phone" },
    email: { label: "Email" },
    leadType: { label: "Lead Type" },
    leadSource: { label: "Lead Source" },
    requirement: { label: "Requirement" },
    expectedBusiness: { label: "Expected Business" },
    address: { label: "Address" },
    pincode: { label: "Pin Code" },
  };

  return (
    <div>
      <PageHeader title="Lost Lead Management" />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 w-full mt-10 text-center">
          Error loading leads.
        </p>
      ) : (
        <Table data={leads} columnConfig={columnConfig} />
      )}

      {/* MODAL */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 transform transition-all">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-bold text-black">
                !! Lead Details !!
              </h2>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex border-b border-gray-100 pb-1">
                <span className="font-semibold text-black w-40">Name:</span>
                <span className="text-gray-700">{selectedLead.clientName}</span>
              </div>
              <div className="flex border-b border-gray-100 pb-1">
                <span className="font-semibold text-black w-40">Phone:</span>
                <span className="text-gray-700">{selectedLead.phone}</span>
              </div>
              <div className="flex border-b border-gray-100 pb-1">
                <span className="font-semibold text-black w-40">Email:</span>
                <span className="text-gray-700">{selectedLead.email}</span>
              </div>
              <div className="flex border-b border-gray-100 pb-1">
                <span className="font-semibold text-black w-40">
                  Requirement:
                </span>
                <span className="text-gray-700">
                  {selectedLead.requirement}
                </span>
              </div>
              <div className="flex border-b border-gray-100 pb-1">
                <span className="font-semibold text-black w-40">
                  Expected Business:
                </span>
                <span className="text-gray-700">
                  {selectedLead.expectedBusiness}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-black mb-2">
                Client Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-2 text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all bg-white text-black cursor-pointer"
              >
                <option value="" disabled>
                  -- Select Status --
                </option>
                <option value="INTERESTED">INTERESTED</option>
                <option value="NOT INTERESTED">NOT INTERESTED</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 cursor-pointer bg-white border-2 border-gray-300 text-black font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitStatus}
                className="px-4 py-1.5 cursor-pointer bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadSheet;
