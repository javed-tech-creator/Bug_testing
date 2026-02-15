
import React, { useEffect, useState, useRef } from "react"; 
import { toast } from "react-toastify";
import { Plus, Edit2, Trash2, X, Search } from "lucide-react";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/api/finance/Quatation_Billing/product.api";

// React Hook Form + Yup
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Yup validation schema
const productSchema = yup.object().shape({
  name: yup
    .string()
    .required("Product name is required")
    .max(30, "Name cannot exceed 30 characters")
    .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),

  description: yup
    .string()
    .required("Description is required")
    .max(100, "Description cannot exceed 100 characters"),

  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required")
    .min(0, "Price must be greater than or equal to 0"),

  hsn_sac: yup
    .string()
    .required("HSN/SAC is required")
    .max(15, "HSN/SAC cannot exceed 10 characters"),

  taxable: yup
    .boolean()
    .required("Taxable field is required"),
});

const ProductComponent = () => {

  const modalRef = useRef(null);
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
     mode: "onChange",
  });

  // Reset form and modal
  const resetForm = () => {
    reset({
      name: "",
      description: "",
      price: "",
      hsn_sac: "",
      taxable: false,
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  // Open modal with product data for edit
  const openModalForEdit = (product) => {
    setEditingProduct(product);
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("hsn_sac", product.hsn_sac);
    setValue("taxable", product.taxable);
    setShowModal(true);
  };

  // Handle create/update
  const onSubmit = async (data) => {
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...data }).unwrap();
        toast.success("Product updated successfully!");
      } else {
        await createProduct(data).unwrap();
        toast.success("Product added successfully!");
      }
      resetForm();
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    }
  };
useEffect(() => {
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      resetForm(); // modal close karne ke liye
    }
  };

  if (showModal) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showModal]);
  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete product!");
        console.error(err);
      }
    }
  };

  // Filter products based on search term
  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.hsn_sac.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
    return (
      <div className="flex justify-center mt-30 items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading.....</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">Error loading products!</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="mt-1 text-sm text-gray-500">Manage and create new products</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
          <div className="relative flex-1 max-w-full ">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {filteredProducts?.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Product
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-2   text-left text-sm text-white uppercase tracking-wider">Name</th>
                    <th className="px-6 py-2  text-left text-sm text-white uppercase tracking-wider">Description</th>
                    <th className="px-6 py-2  text-left text-sm text-white uppercase tracking-wider">Price</th>
                    <th className="px-6 py-2  text-left text-sm text-white uppercase tracking-wider">HSN/SAC</th>
                    <th className="px-6 py-2  text-right text-sm text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6  whitespace-nowrap">{product.name}</td>
                      <td className="px-6 ">{product.description}</td>
                      <td className="px-6 ">₹{product.price}</td>
                      <td className="px-6 ">{product.hsn_sac}</td>
                       
                      <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button onClick={() => openModalForEdit(product)} className="text-blue-600 hover:text-blue-900"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-auto pt-20 pb-10 p-4 z-50">
    <div  ref={modalRef} className= "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      <div className="bg-gradient-to-r from-gray-700 to-gray-700 text-white p-2 relative">
        <h2 className="text-2xl font-bold ">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
        <p className="text-white/80 text-sm">
          Fill in the details below to {editingProduct ? "update this product" : "add a new product"}
        </p>
        <button onClick={resetForm} className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200">
          <X size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Product Name <span className="text-red-500">*</span></label>
          <input 
            {...register("name")} 
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"}`} 
            placeholder="Enter product name" 
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Description</label>
          <textarea 
            {...register("description")} 
            rows={3} 
            className={`w-full px-2 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? "border-red-500" : "border-gray-300"}`} 
            placeholder="Enter product description" 
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 ">Price (₹) <span className="text-red-500">*</span></label>
          <input 
            type="number" 
            {...register("price")} 
            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.price ? "border-red-500" : "border-gray-300"}`} 
            placeholder="0.00" min="0" step="0.01" 
          />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>

        {/* HSN/SAC Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 ">HSN/SAC Code</label>
          <input 
            {...register("hsn_sac")} 
            className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.hsn_sac ? "border-red-500" : "border-gray-300"}`} 
            placeholder="Enter HSN/SAC code" 
          />
          {errors.hsn_sac && <p className="text-red-500 text-xs mt-1">{errors.hsn_sac.message}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={resetForm} className="flex-1 px-2 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" className="flex-1 px-2 py-2  bg-gradient-to-r from-gray-600 to-gray-600 text-white rounded-xl hover:from-gray-700 hover:to-gray-700 transition-all duration-200">
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default ProductComponent;
