import { useCreateCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from '@/api/vendor/productCategory.api'; 
import { Pencil, SquarePen, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md'
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const VendorProductCategory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState(null); // 🔹 track edit mode
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

    const [searchParams] = useSearchParams();
      useEffect(() => {
      if (searchParams.get("openModal") === "true") {
        setIsOpen(true); // page load hote hi modal open
      }
    }, [searchParams]);

  const { data, isLoading:getLoading } = useGetCategoriesQuery();
  const categories = data?.data || [];

  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setCategory("");
        setEditingCategory(null); // 🔹 reset edit state
  };

  const filteredCategories = categories.filter((cat) =>
    cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

    // 🔹 Handle Add + Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim()) return toast.error("Category name is required");
    // try {
    //   const res = await createCategory({ categoryName: category }).unwrap();
    //   if (res.success) {
    //     toast.success("Category added successfully!");
    //     closeModal();
    //   } else {
    //     toast.error(res.data.message || "Failed to add category");
    //   }
    // } catch (err) {
    //   toast.error(err?.data?.message || "Something went wrong");
    // }

      try {
      if (editingCategory) {
        // 🔹 Update
        const res = await updateCategory({ id: editingCategory._id, categoryName:category }).unwrap();
        if (res.success) {
          toast.success("Category updated successfully!");
          closeModal();
        } else {
          toast.error(res.data.message || "Failed to update category");
        }
      } else {
        // 🔹 Create
        const res = await createCategory({ categoryName: category }).unwrap();
        if (res.success) {
          toast.success("Category added successfully!");
          closeModal();
        } else {
toast.error(res.data.message || "Failed to add category");        }
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

   const [updateCategory, { isLoading:updateLoading }] = useUpdateCategoryMutation();
  // 🔹 Open modal in edit mode
  const onEdit = (cat) => {
    setEditingCategory(cat);
    setCategory(cat.categoryName);
    openModal();
  };

  return (
    <>
      {/* Header */}
   <div className="w-full rounded-xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-[1px] shadow mb-4">
  <div className="bg-white rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
      <MdCategory className="text-orange-500 text-xl" />
      <span>Product Categories</span>
    </h2>

    {/* Only Add Category button */}
    <button
      type="button"
      className="text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-medium shadow cursor-pointer"
     onClick={() => { setEditingCategory(null); openModal(); }}
    >
      + Add
    </button>
  </div>
</div>


      {/* Search */}
{/* Search + View Toggle */}
<div className="mb-4 flex items-center justify-between flex-wrap gap-2">
  {/* Left: Search Bar */}
  <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-300 rounded-lg shadow-sm w-full sm:w-64">
    <Search size={16} className="text-gray-400" />
    <input
      type="text"
      placeholder="Search categories..."
      className="w-full text-sm bg-transparent outline-none"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  {/* Right: View Toggle + Add Button */}
  <div className="flex items-center gap-2">
    <button
      className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium shadow-sm transition ${
        viewMode === "grid"
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
      onClick={() => setViewMode("grid")}
    >
      🔳 Grid
    </button>
    <button
      className={`px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm font-medium shadow-sm transition ${
        viewMode === "list"
          ? "bg-blue-500 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
      onClick={() => setViewMode("list")}
    >
      📋 List
    </button>
  </div>
</div>

      {/* Categories */}
      {viewMode === "list" ? (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 font-semibold w-12">#</th>
                <th className="px-4 py-2 font-semibold">Category Name</th>
                <th className="px-4 py-2 font-semibold text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-100 animate-pulse">
                    <td className="px-4 py-2"><div className="h-3 w-5 bg-gray-200 rounded"></div></td>
                    <td className="px-4 py-2"><div className="h-3 w-24 bg-gray-200 rounded"></div></td>
                    <td className="px-4 py-2 flex justify-center gap-2"><div className="h-4 w-4 bg-gray-200 rounded-full"></div></td>
                  </tr>
                ))
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((cat, index) => (
                  <tr key={cat._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-medium">{cat.categoryName}</td>
                    <td className="px-4 py-2 flex justify-center gap-1">
                     <button
                    onClick={() => onEdit(cat)}
                    className="p-1 px-2 cursor-pointer rounded bg-blue-100 text-blue-1200 hover:bg-blue-200 transition border border-blue-800"
                  >
                    <SquarePen size={16} />
                  </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-center text-gray-500 text-sm">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {getLoading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
              ))
            : filteredCategories.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3 shadow hover:shadow-md transition">
                  <div className="flex items-center gap-2">
                    <MdCategory className="text-orange-500 text-xl" />
                    
                    <span className="font-medium">{cat.categoryName}</span>
                  </div>
                  <button
                    onClick={() => onEdit(cat)}
                    className="p-1 px-2 cursor-pointer rounded bg-blue-100 text-blue-1200 hover:bg-blue-200 transition border border-blue-800"
                  >
                    <SquarePen size={16} />
                  </button>
                </div>
              ))}
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md shadow-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MdCategory className="text-orange-500" /> 
              {editingCategory ? "Edit Product Category" : "Add Product Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Category Name</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter category name"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || updateLoading}
                  className={`px-4 py-2 rounded-lg text-white ${ (isLoading || updateLoading) ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600"}`}
                >
                  {isLoading || updateLoading ? <FaSpinner className="animate-spin" /> : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default VendorProductCategory;
