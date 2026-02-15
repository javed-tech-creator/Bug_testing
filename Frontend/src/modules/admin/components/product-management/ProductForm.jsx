import React, { useEffect, useState } from "react";
import { ClipboardCheck, FolderPlus, Loader2 } from "lucide-react";
import PhaseSection from "./PhaseSection";
import {
  useCreateProductWorkMutation,
  useGetProductWorkByIdQuery,
  useUpdateProductWorkMutation,
} from "@/api/admin/product-management/product.management.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProductForm({ productId, isEdit }) {
  const navigate = useNavigate();

  const defaultPhases = [
    {
      phaseName: "Phase 1",
      departments: [
        { departmentName: "Recce Department", works: [] },
        { departmentName: "Design Department", works: [] },
      ],
    },
    {
      phaseName: "Phase 2",
      departments: [
        { departmentName: "Production Department", works: [] },
        { departmentName: "Procurement Store Department", works: [] },
        { departmentName: "Quality Department", works: [] },
      ],
    },
    {
      phaseName: "Phase 3",
      departments: [{ departmentName: "Warehouse Department", works: [] }],
    },
  ];

  const [product, setProduct] = useState({ phases: defaultPhases });
  const [activeTab, setActiveTab] = useState(0);

  const { data: existingWork, isLoading: loadingWork } =
    useGetProductWorkByIdQuery(productId, { skip: !isEdit });

  useEffect(() => {
    if (isEdit && existingWork?.data) {
      setProduct({ phases: existingWork.data.phases || defaultPhases });
      setActiveTab(0);
    }
  }, [isEdit, existingWork]);

  const handlePhaseChange = (index, updatedPhase) => {
    const newPhases = [...product.phases];
    newPhases[index] = updatedPhase;
    setProduct({ ...product, phases: newPhases });
  };

  const [createProductWork, { isLoading }] = useCreateProductWorkMutation();
  const [updateProductWork, { isLoading: updating }] =
    useUpdateProductWorkMutation();

  const handleSubmit = async () => {
    try {
      if (!productId) return toast.error("Product ID missing in URL");
      if (!product?.phases?.length)
        return toast.error("Please add at least one phase");

      const payload = { productId, phases: product.phases };
      const response = isEdit
        ? await updateProductWork(payload).unwrap()
        : await createProductWork(payload).unwrap();

      toast.success(
        response?.message ??
          (isEdit ? "Updated successfully" : "Created successfully")
      );

      if (!isEdit) {
        setProduct({ phases: defaultPhases });
        setActiveTab(0);
      }
      setTimeout(() => navigate("/admin/product-management"), 300);
    } catch (err) {
      console.error("Error creating/updating ProductWork:", err);
      toast.error(err?.data?.message || "Failed to save product work");
    }
  };

  if (isEdit && loadingWork) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-orange-500" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto p-8 bg-white border border-gray-200 rounded-md shadow-md space-y-8">
 {/* Header */}
<div className="flex items-center justify-between pb-4 border-b border-gray-200">
  
  {/* Left Section */}
  <div className="flex items-center gap-3">
    <ClipboardCheck className="text-orange-600" size={28} />
    <h2 className="text-2xl font-semibold text-gray-800 tracking-wide">
      {isEdit ? "Edit Product Work" : "Add Product Work"}
    </h2>
  </div>

  {/* Right Back Button */}
  <button
    onClick={() => navigate(-1)}
    className="px-4 py-1 bg-black/80 text-white rounded-md hover:bg-black/100 cursor-pointer">
    Back
  </button>
</div>


      {/* Phase Selector */}
      <div className="flex justify-between items-center bg-gray-50 py-2 px-4 rounded-md border border-gray-200 shadow-sm">
        <label className="font-medium text-gray-700 text-sm sm:text-base">
          Select Phase:
        </label>
        <select
          className="w-60 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-orange-500 focus:outline-none transition"
          value={activeTab}
          onChange={(e) => setActiveTab(Number(e.target.value))}
        >
          {product.phases.map((phase, index) => (
            <option key={index} value={index}>
              {phase.phaseName}
            </option>
          ))}
        </select>
      </div>

      {/* Active Phase Section */}
    
        <PhaseSection
          phase={product.phases[activeTab]}
          index={activeTab}
          onChange={handlePhaseChange}
        />
     
      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSubmit}
          disabled={isLoading || updating}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-white transition-all duration-200 ${
            isLoading || updating
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isLoading || updating ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              {isEdit ? "Updating..." : "Saving..."}
            </>
          ) : (
            <>
              <FolderPlus size={18} />
              {isEdit ? "Update Product" : "Save Product"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
