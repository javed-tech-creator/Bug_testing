import React, { useEffect, useMemo, useState } from "react";
import ProductModalForm from "../components/DynamicModelForm";
import DynamicTable from "../components/DynamicTable";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // import icons
import ExcelUploadModal from "../components/ExcelUploadModal";
import { Eye } from "lucide-react";
import {
  useAddProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../../api/vendor/product.api";
import { useGetCategoriesQuery } from "@/api/vendor/productCategory.api";
import { GiCardboardBox } from "react-icons/gi";
import { useSearchParams } from "react-router-dom";
// import TransactionHistoryModal from "../components/TransactionHistoryModal";

const VendorProductPage = () => {
    const [searchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // excel preview form code
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);

    useEffect(() => {
    if (searchParams.get("openModal") === "true") {
      setOpenModal(true); // page load hote hi modal open
    }
  }, [searchParams]);

  // fetching category data 
    // fetching data 
      const { data, isLoading:getLoading, isError, error:categoryError } = useGetCategoriesQuery();
    // API returns { success: true, data: [...] }
    const categories = data?.data || [];
console.log("category is :-",categories)
  // close excel previre form code

  const {
    data: products,
    error,
    isLoading: productsLoading,
    isSuccess: productsLoadingSuccess,
  } = useGetProductsQuery();
  const [
    addProduct,
    {
      data:productAddData,
      error: productAddError,
      isLoading: productsAddLoading,
      isSuccess: productsAddSuccess,
    },
  ] = useAddProductMutation();

  const [
    updateProduct,
    {
      data:productUpdateData,
      error: productUpdateError,
      isLoading: productUpdateLoading,
      isSuccess: productUpdateSuccess,
    },
  ] = useUpdateProductMutation();
console.log("product data ",products)
  const filteredData = useMemo(() => {
    if (!products?.data) return [];
    return products.data.map((product) => ({
      productId: product._id,
      productCode: product.productCode,
      productName: product.productName,
      brand: product.brand,
      unitType: product.unitType,
      size: product.size,
      totalStock: product.totalStock,
      usedStock: product.usedStock,
      inStock: product.inStock,
      rateUnit: product.rateUnit,
      gstPercent: product.gstPercent,
          category: product.category || "NA",
      createdAt:product.createdAt,
      description: product.description,
  
    }));
  }, [products]);

  const handleSubmit = async (data) => {
    console.log("Submitted Data:", data,selectedProduct);
    const formData = data;
      if (editMode) {
      // Update product
      await updateProduct({ id: selectedProduct.productId, ...formData }).unwrap();

    } else {
      // Add product
    await addProduct({ formData }).unwrap(); // unwrap to get actual data or throw error
    }

  };

  const fields = [
    {
      name: "productCode",
      label: "Product Code",
      type: "text",
      required: true,
      placeholder: "Enter unique product code",
    },
    {
      name: "productName",
      label: "Product Name",
      type: "text",
      required: true,
      placeholder: "Enter product name",
    },

    {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    options: categories.map((cat) => ({
      value: cat.categoryName, 
      label: cat.categoryName  // backend ka category name field
    })),
    placeholder: "Select category",
  },
    {
      name: "brand",
      label: "Brand",
      type: "text",
      placeholder: "Enter brand name",
    },
    {
      name: "size",
      label: "Size",
      type: "text",
      placeholder: "Enter product size (e.g. 500ml, XL)",
    },
    {
      name: "unitType",
      label: "Unit Type",
      type: "text",
      required: true,
      placeholder: "Enter unit type",
    },
    {
      name: "inStock",
      label: "Stock",
      type: "number",
      required: true,
      min: 0,
      placeholder: "Enter quantity",
    },
    {
      name: "rateUnit",
      label: "Rate per Unit",
      type: "number",
      required: true,
      min: 0,
      placeholder: "Enter price per unit",
    },
     {
    name: "gstPercent",
    label: "GST (%)",
    type: "select",
    required: true,
    options: [0, 5, 12, 18, 28],
        placeholder: "Select GST rate",
        unit: "%",

  },
  
  {
  name: "description",
  label: "Description",
  type: "textarea", //  input ki jagah textarea render karega
  placeholder: "Enter short product description",
  rows: 1,
  required: false, // optional
},
  ];

  
  const handleUpdate = (item) => {
    console.log("Update clicked", item);
    setSelectedProduct(item); // Store product data
    setEditMode(true);
    setOpenModal(true);
  };

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (val, row) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleUpdate(row)}
            className="p-2 text-orange-600 hover:text-orange-400 hover:bg-blue-100 rounded-full transition cursor-pointer"
            title="Edit"
          >
            <FaEdit size={16} />
          </button>
          {/* <button
            onClick={() => handleView(row)}
            className="p-2 text-blue-600 hover:text-blue-400 hover:bg-blue-100 rounded-full transition cursor-pointer"
            title="View"
          >
            <Eye size={16} />
          </button> */}
        </div>
      ),
    },
    productCode: { 
    label: "Product Code",
    render: (value, row) => {
      const createdDate = new Date(row.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24)); // days difference

      return (
        <div className="flex items-center gap-2 relative">
           <span>{value}</span>
          {diffDays <= 3 && (
            <span className="bg-green-500 absolute top-0 right-0 text-white text-[8px] px-2 py-[2px] rounded-full font-light">
              NEW
            </span>
          )}
         
        </div>
      );
    }
  },
    productName: { label: "Product Name" },
    rateUnit: { label: "Rate / Unit" },
    unitType: { label: "Unit Type" },
    totalStock: { label: "Total Stock" },
    usedStock: { label: "Used Stock" },
    inStock: { label: "In Stock" },
    gstPercent: { label: "GST (%)" },
    category: { label: "Category" },
    createdAt: {
    label: "Created At",
    render: (value) => new Date(value).toLocaleString(), // ISO → readable date-time
  },
  };

  return (
    <>
      <div className="w-full rounded-xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-[1px] shadow mb-4">
        <div className="bg-white rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-wrap">
          {/* Title */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
            <GiCardboardBox className="text-orange-500" /> <span>Product Catalogue</span>
          </h2>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setPreviewModalOpen(true)}
              className="bg-orange-400 hover:bg-orange-500 text-white px-2 py-2 rounded-md text-sm font-medium shadow cursor-pointer"
            >
              📤Imports
            </button>

            {/* Add Product Button */}
            <button
              type="button"
              className="  text-white bg-orange-400 hover:bg-orange-500 px-4 py-2 rounded-md text-sm font-medium shadow cursor-pointer"
              onClick={() => {
                setSelectedProduct(null); // No product selected
                setEditMode(false);
                setOpenModal(true);
              }}
            >
              + Add
            </button>
          </div>
        </div>
      </div>

      {/* Model form  */}

      {openModal && (
        <ProductModalForm
          isOpen={openModal}
          title={editMode ? "✏️ Edit Product" : "🛍️ Add New Product"}
          fields={fields}
          defaultValues={
    editMode && selectedProduct
      ? { ...selectedProduct, inStock: "" } // 👈 sirf inStock ko clear karo
      : {}
  } // Existing values for edit, empty for add
          onClose={() => setOpenModal(false)}
            onSubmit={handleSubmit}
         isSuccess={editMode ? productUpdateSuccess : productsAddSuccess}
          error={editMode ? productUpdateError : productAddError}
         isLoading={editMode ? productUpdateLoading : productsAddLoading}
          data={editMode ? productUpdateData:productAddData}
          editMode={editMode}
        />
      )}

      {/* showing product list  */}
      <DynamicTable
        data={filteredData}
        columnConfig={columnConfig}
        handleUpdate={handleUpdate}
        isLoading={productsLoading}
        isSuccess={productsLoadingSuccess}
      />

      <ExcelUploadModal
        isOpen={isPreviewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
      />

      {/* excel preview modal form  */}

      {/* Transaction Modal */}
      {/* {showModal && selectedProduct && (
        <TransactionHistoryModal
          product={selectedProduct}
          onClose={handleClose}
        />
      )} */}
    </>
  );
};

export default VendorProductPage;
