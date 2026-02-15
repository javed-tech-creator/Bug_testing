import React, { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import ProductBasicForm from "../../components/product-management/ProductBasicForm";
import {
  X,
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Info,
  Eye,
  Package,
  SearchIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useGetAllProductsQuery,
  useSoftDeleteProductMutation,
} from "@/api/admin/product-management/product.management.api";
import DataLoading from "@/modules/vendor/components/DataLoading";

export default function ProductManagement() {
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // const [showModal, setShowModal] = useState(false);
  // const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = useNavigate();

  const handleAdd = () => {
    setSelectedProduct(null); // reset form
    setOpenModal(true);
  };
  const handleClose = () => setOpenModal(false);

  const { data: productsData, isLoading, isError } = useGetAllProductsQuery();
  console.log("productsData iks ", productsData);
  const products = productsData?.data || [];

  const [softDeleteProduct] = useSoftDeleteProductMutation();
  // const [viewProductData, setViewProductData] = useState(null);
  // const {
  //   data: viewProductData,
  //   isFetching: loadingView,
  //   error: errorView,
  // } = useGetProductWorkByIdQuery(selectedProductId, {
  //   skip: !selectedProductId, // only fetch when id is set
  //   refetchOnMountOrArgChange: true,
  // });

  // console.log("errorView jo aa rhi hai", errorView);
  // console.log("error aa rhi hai", viewProductData);

  // useEffect(() => {
  //   setViewProductData(null); // ID change hote hi purana data hatao
  // }, [selectedProductId]);

  // useEffect(() => {
  //   if (data) setViewProductData(data);
  // }, [data]);

  //  Edit function
  const handleEdit = (product) => {
    setSelectedProduct(product); // set product for edit
    setOpenModal(true); // open modal
  };

  //  Delete function
  const handleDelete = (product) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${product.title}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDeletingId(product._id);
          //  API Call
          const res = await softDeleteProduct(product._id).unwrap();

          //  Success Alert
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: res?.message || `${product.title} has been deleted.`,
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          //  Error Handling
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: err?.data?.message || "Failed to delete product.",
          });
        } finally {
          setDeletingId(null); // reset after done
        }
      }
    });
  };

  // Filtered products based on search
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.alias.toLowerCase().includes(searchQuery.toLowerCase())
  );

const handleView = (product) => {
  navigate(`/admin/product-management/view/${product._id}`);
};


  return (
    <div className="p-6 max-w-9xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        title="Product Management"
        btnTitle="Add"
        onClick={handleAdd}
      />

      {/* Search + Product list Container */}
      <div className="bg-white border border-gray-300 rounded-xl shadow-md p-4 space-y-4">
        {/* 🔍 Search & Header Section */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-200 pb-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-black" />
            Product List
            <span className="text-sm text-gray-500 font-normal">
              ({filteredProducts.length} total)
            </span>
          </h2>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition"
            />
            <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* 📦 Table Section */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <DataLoading />
            </div>
          ) : isError ? (
            <p className="text-red-500 text-center py-6">
              Failed to load products.
            </p>
          ) : filteredProducts.length > 0 ? (
            <table className="w-full text-sm text-gray-800 border border-gray-300  overflow-hidden">
              {/* ===== Table Head ===== */}
              <thead className="bg-gray-100 text-gray-900 border-b border-gray-300">
                <tr>
                  <th className="p-3 font-semibold text-center uppercase text-[13px] tracking-wide border-r border-gray-200 w-[100px]">
                    Product ID
                  </th>
                  <th className="p-3 font-semibold text-center uppercase text-[13px] tracking-wide border-r border-gray-200 w-[100px]">
                    Image
                  </th>
                  <th className="p-3 font-semibold text-center uppercase text-[13px] tracking-wide border-r border-gray-200 w-[180px]">
                    Title
                  </th>
                  <th className="p-3 font-semibold text-center uppercase text-[13px] tracking-wide border-r border-gray-200 w-[160px]">
                    Alias
                  </th>
                  <th className="p-3 font-semibold text-center uppercase text-[13px] tracking-wide border-r border-gray-200 w-[350px]">
                    Description
                  </th>
                  <th className="p-3 font-semibold text-center uppercase text-[13px] tracking-wide border-r border-gray-200 w-[120px]">
                    Work Actions
                  </th>
                  <th className="p-3 font-semibold text-center uppercase text-[13px] tracking-wide w-[120px]">
                    Product Actions
                  </th>
                </tr>
              </thead>

              {/* ===== Table Body ===== */}
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-all duration-150"
                  >
                    {/* 🆔 Product ID */}
                    <td className="px-3 py-2 text-gray-700 text-center border-r border-gray-200 font-medium text-xs">
                      {product.productId}
                    </td>

                    {/* 🖼 Image */}
                    <td className="px-3 py-2 border-r border-gray-200 text-center">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mx-auto border border-gray-200">
                        <img
                          src={
                            product?.productImage?.public_url ||
                            "https://via.placeholder.com/80x80"
                          }
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* 🏷 Title */}
                    <td className="px-3 py-2 border-r border-gray-200 font-medium text-gray-900 truncate max-w-[180px] text-center">
                      {product.title}
                    </td>

                    {/* 🪶 Alias */}
                    <td className="px-3 py-2 border-r border-gray-200 text-gray-600 italic truncate max-w-[160px] text-center">
                      {product.alias || "-"}
                    </td>

                    {/* 📄 Description */}
                    <td className="px-3 py-2 text-gray-600 border-r border-gray-200 align-top w-[350px] max-w-[350px]">
                      <div className="line-clamp-3 text-left break-words whitespace-normal">
                        {product.description || "-"}
                      </div>
                    </td>

                    {/* 🧩 Work Actions */}
                    <td className="px-3 py-2 border-r border-gray-200 text-center">
                      <div className="flex items-center justify-center gap-3 flex-wrap">
                        {product.isWork ? (
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/product-management/edit/${product._id}`
                              )
                            }
                               title="Edit Work"
                            className="border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-600 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                          >
                            <Edit size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/product-management/add/${product._id}`
                              )
                            }
                               title="Add Work"
                            className="border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-600 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                          >
                            <Plus size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleView(product)}
                          title="View Details"
                          className=" border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                          <Eye size={16 } />
                          {/* View */}
                        </button>
                      </div>
                    </td>

                    {/* ⚙️ Manage Actions */}
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product._id}
                          className={`p-2 rounded-lg bg-red-50 hover:bg-red-100 border cursor-pointer border-red-200 text-red-600 transition-all ${
                            deletingId === product._id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title="Delete Product"
                        >
                          {deletingId === product._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-10">
              No products match your search.
            </p>
          )}
        </div>
      </div>

      {/* Modal for product add*/}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-900">
              <h2 className="text-lg font-semibold text-white">
                {selectedProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={handleClose}
                className="bg-gray-200 text-black rounded-full p-1  hover:scale-105   transition-all duration-300 ease-in-out hover:bg-gray-100 hover:text-red-600 cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
              <ProductBasicForm
                onClose={handleClose}
                initialData={selectedProduct} // ✅ pass data for edit
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal for show product works data
      <ProductWorkDetailsModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        loadingView={loadingView}
        errorView={errorView}
        viewProductData={viewProductData}
      /> */}
    </div>
  );
}
