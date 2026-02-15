import React from "react";
import ProductForm from "../../components/product-management/ProductForm";
import { useParams } from "react-router-dom";

const ProductFormPage = ({mode}) => {

    const { productId } = useParams();

      //  Detect if edit mode
  const isEdit = mode === "edit";

  return (
<div className="p-6">   
   <ProductForm productId={productId} isEdit ={isEdit} />
  </div>
  );
};

export default ProductFormPage;
