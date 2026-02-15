import { useAssignLeadMutation } from "@/api/marketing/leadGenerate.api";
import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdOutlineGroups } from "react-icons/md";
import { toast } from "react-toastify";

const dummyData = {
  north: {
    states: ["Punjab", "Haryana"],
    cities: {
      Punjab: ["Amritsar", "Ludhiana"],
      Haryana: ["Gurgaon", "Panipat"],
    },
    branches: {
      Amritsar: ["Branch A1", "Branch A2"],
      Ludhiana: ["Branch B1", "Branch B2"],
      Gurgaon: ["Branch C1", "Branch C2"],
      Panipat: ["Branch D1", "Branch D2"],
    },
  },
  east: {
    states: ["West Bengal", "Bihar"],
    cities: {
      "West Bengal": ["Kolkata", "Siliguri"],
      Bihar: ["Patna", "Gaya"],
    },
    branches: {
      Kolkata: ["Branch E1", "Branch E2"],
      Siliguri: ["Branch F1", "Branch F2"],
      Patna: ["Branch G1", "Branch G2"],
      Gaya: ["Branch H1", "Branch H2"],
    },
  },
  west: {
    states: ["Rajasthan", "Gujarat"],
    cities: {
      Rajasthan: ["Jaipur", "Udaipur"],
      Gujarat: ["Ahmedabad", "Surat"],
    },
    branches: {
      Jaipur: ["Branch I1", "Branch I2"],
      Udaipur: ["Branch J1", "Branch J2"],
      Ahmedabad: ["Branch K1", "Branch K2"],
      Surat: ["Branch L1", "Branch L2"],
    },
  },
  south: {
    states: ["Karnataka", "Tamil Nadu"],
    cities: {
      Karnataka: ["Bangalore", "Mysore"],
      "Tamil Nadu": ["Chennai", "Coimbatore"],
    },
    branches: {
      Bangalore: ["Branch M1", "Branch M2"],
      Mysore: ["Branch N1", "Branch N2"],
      Chennai: ["Branch O1", "Branch O2"],
      Coimbatore: ["Branch P1", "Branch P2"],
    },
  },
};

export default function LeadAssignModal({ isOpen, onClose, leadId }) {
  const [zone, setZone] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [branch, setBranch] = useState("");

  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);

const [assignLead, { isLoading, isSuccess, error }] = useAssignLeadMutation();

  useEffect(() => {
    if (zone) {
      setAvailableStates(dummyData[zone].states);
      setStateName("");
      setCity("");
      setBranch("");
      setAvailableCities([]);
      setAvailableBranches([]);
    }
  }, [zone]);

  useEffect(() => {
    if (zone && stateName) {
      setAvailableCities(dummyData[zone].cities[stateName]);
      setCity("");
      setBranch("");
      setAvailableBranches([]);
    }
  }, [stateName, zone]);

  useEffect(() => {
    if (zone && stateName && city) {
      setAvailableBranches(dummyData[zone].branches[city]);
      setBranch("");
    }
  }, [city, stateName, zone]);

  const resetFields = () => {
    setZone("");
    setStateName("");
    setCity("");
    setBranch("");
    setAvailableStates([]);
    setAvailableCities([]);
    setAvailableBranches([]);
  };

  const handleClose = () => {
    resetFields(); // reset all states
    onClose();     // close modal
  };
  
    const handleSubmit = async () => {
  if (!zone || !stateName || !city || !branch) {
    toast.error("Please select all fields");
    return;
  }

  try {
     const payload = {
      leadId,
      zone,
      state: stateName,
      city,
      branch
    };

    const res = await assignLead(payload).unwrap();

    if (res.success) {
      toast.success(res?.message || "Lead assigned successfully!");
      handleClose();
    }
  } catch (err) {
    toast.error(err?.data?.message || "Something went wrong");
  }
};

  if (!isOpen) return null;

  return (
   <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
  <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-in">
    {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-3">
      <div className="flex items-center gap-2">
        <MdOutlineGroups className="w-6 h-6 text-orange-500" /> {/* Icon */}
        <h2 className="text-xl font-bold text-gray-800">Forward to Sales Team</h2>
      </div>
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
      >
        ✕
      </button>
    </div>

    {/* Zone */}
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">Zone</label>
      <select
        value={zone}
        onChange={(e) => setZone(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors"
      >
        <option value="">Select Zone</option>
        <option value="north">North</option>
        <option value="east">East</option>
        <option value="west">West</option>
        <option value="south">South</option>
      </select>
    </div>

    {/* State */}
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
      <select
        value={stateName}
        onChange={(e) => setStateName(e.target.value)}
        disabled={!zone}
        className={`w-full border border-gray-300 rounded-lg p-2 transition-colors focus:ring-2 focus:ring-orange-400 focus:border-orange-400 ${!zone && "bg-gray-100 cursor-not-allowed"}`}
      >
        <option value="">Select State</option>
        {availableStates.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>

    {/* City */}
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={!stateName}
        className={`w-full border border-gray-300 rounded-lg p-2 transition-colors focus:ring-2 focus:ring-orange-400 focus:border-orange-400 ${!stateName && "bg-gray-100 cursor-not-allowed"}`}
      >
        <option value="">Select City</option>
        {availableCities.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>

    {/* Branch */}
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-1">Branch</label>
      <select
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        disabled={!city}
        className={`w-full border border-gray-300 rounded-lg p-2 transition-colors focus:ring-2 focus:ring-orange-400 focus:border-orange-400 ${!city && "bg-gray-100 cursor-not-allowed"}`}
      >
        <option value="">Select Branch</option>
        {availableBranches.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>
    </div>

    {/* Buttons */}
    <div className="flex justify-end gap-3">
      <button
        onClick={handleClose}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Cancel
      </button>

      <button
  onClick={handleSubmit}
  disabled={isLoading} // button disable during loading
  className={`px-5 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg shadow-md hover:from-orange-500 hover:to-orange-600 transition-all flex items-center justify-center gap-2
    ${isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
  `}
>
  {isLoading ? (
    <>
      <FaSpinner className="animate-spin" />
    </>
  ) : (
    "Forward"
  )}
</button>

    </div>
  </div>
</div>

  );
}
