import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Loader2, Package, Calendar, FileText, ListChecks, ClipboardList, Layers } from "lucide-react";
import { useGetProductWorkByIdQuery } from "@/api/admin/product-management/product.management.api";
import PageHeader from "@/components/PageHeader";
import ProductHierarchyTree from "../../components/product-management/product-details/PhaseTreeView";

const ProductWorkDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: viewProductData,
    isFetching: loadingView,
    error: errorView,
  } = useGetProductWorkByIdQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  console.log("viewProductData data aa rha hai", viewProductData);

  return (
    <div className="p-6 max-w-8xl mx-auto bg-gradient-to-br from-black-50 to-gray-100 min-h-screen">
      <PageHeader
        title="Product Work Details"
        btnTitle="Back"
        onClick={() => navigate(-1)}
      />

      {/* Content Section */}
      {loadingView ? (
        <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
          <Loader2 className="animate-spin text-orange-500" size={48} />
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      ) : errorView?.data?.statusCode === 404 || errorView?.status === 404 ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-8 rounded-full shadow-lg">
            <span className="text-6xl">🚧</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            No Work Added Yet
          </h2>
          <p className="text-gray-600 max-w-md leading-relaxed text-lg">
            {errorView?.data?.message ||
              "This product doesn't have any work details yet. Please add product work to view details here."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-xl shadow-lg transition-all transform hover:scale-105"
          >
            ← Back to Product List
          </button>
        </div>
      ) : errorView ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
          <div className="bg-red-100 p-8 rounded-full">
            <span className="text-6xl">❌</span>
          </div>
          <p className="text-red-600 text-xl font-semibold">
            Failed to load product work
          </p>
        </div>
      ) : !viewProductData?.data ? (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
          <div className="bg-gray-100 p-8 rounded-full">
            <span className="text-6xl">📭</span>
          </div>
          <p className="text-gray-600 text-xl">
            No product work data available
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Top Overview Section */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Product Image Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 p-8 flex flex-col items-center gap-5 flex-[3] lg:basis-[30%] ">
              <div className="relative">
                <img
                  src={
                    viewProductData?.data?.productId?.productImage?.public_url ||
                    "https://cdn-icons-png.flaticon.com/512/3593/3593088.png"
                  }
                  alt="Product"
                  className="w-48 h-48 rounded-lg border-4 border-orange-200 object-cover shadow-lg"
                />
                <div className="absolute -bottom-3 -right-3 bg-orange-500 text-white p-3 rounded-xl shadow-lg">
                  <Package size={24} />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {viewProductData?.data?.productId?.title}
                </h2>
                <p className="text-sm text-white bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1.5 rounded-full font-medium inline-block">
                  {viewProductData?.data?.productId?.alias}
                </p>
              </div>
            </div>

            {/* Product Info Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 p-8 flex-[7] lg:basis-[70%] ">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-md">
                  <FileText className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Product Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-lg border-2 border-gray-100 transition-colors">
                  <p className="text-gray-500 text-sm mb-2 font-medium flex items-center gap-2">
                    <Package size={16} />
                    Product ID
                  </p>
                  <p className="text-gray-900 font-semibold text-lg">
                    {viewProductData?.data?.productId?.productId}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-lg border-2 border-gray-100  transition-colors">
                  <p className="text-gray-500 text-sm mb-2 font-medium flex items-center gap-2">
                    <Calendar size={16} />
                    Created At
                  </p>
                  <p className="text-gray-900 font-semibold text-lg">
                    {viewProductData?.data?.productId?.createdAt
                      ? `${new Date(
                          viewProductData.data.productId.createdAt
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}, ${new Date(
                          viewProductData.data.productId.createdAt
                        )
                          .toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .toLowerCase()}`
                      : "-"}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border-2 border-blue-100">
                <p className="text-gray-700 text-sm mb-3 font-semibold flex items-center gap-2">
                  <ClipboardList size={18} />
                  Description
                </p>
                <p className="text-gray-800 text-base leading-relaxed">
                  {viewProductData?.data?.productId?.description ||
                    "No description added."}
                </p>
              </div>
            </div>
          </div>

          {/* Product Hierarchy Section */}
          <div className="bg-white rounded-lg  border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-lg shadow-md">
                <Layers className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Work Hierarchy
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Phases → Departments → Works → Tasks → Sub-Tasks → Activities → Sub-Activities → Instructions / Checklist
                </p>
              </div>
            </div>

            <ProductHierarchyTree data={viewProductData?.data?.phases} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductWorkDetailsPage;