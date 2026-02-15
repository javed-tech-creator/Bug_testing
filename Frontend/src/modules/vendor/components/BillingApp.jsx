import { MdDelete } from "react-icons/md";
import React, { useEffect, useState, useRef } from "react";
import emptyImage from "../../../assets/BillGenerator.webp";
import FixedTotalBar from "./FixedTotalBar";
import { debounce } from "lodash";
import { FaPlusCircle, FaUniversity } from "react-icons/fa";
import BankDetailsModal from "./generateInvoice/BankDetailsModal";
import { toast } from "react-toastify";
import { useGetCategoriesQuery } from "@/api/vendor/productCategory.api";
import { useGetProductsQuery } from "@/api/vendor/product.api";
import { useGetBanksQuery } from "@/api/vendor/bankDetails.api";
import { useCreateInvoiceMutation } from "@/api/vendor/invoice.api";
import {
  useCreateOrUpdateDraftMutation,
  useGetDraftByIdQuery,
} from "@/api/vendor/draft.api";
import { useNavigate, useParams } from "react-router-dom";
import DataLoading from "./DataLoading";
import Loader from "./LoadingDropdown";

const BillingApp = ({
  invoiceDate,
  setInvoiceDate,
  dueDate,
  setDueDate,
  selectedBranchId,
  setSelectedBranchId,
  refetch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [globalDiscountType, setGlobalDiscountType] = useState("%");
  // const [discount, setDiscount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  // const [gstPercent, setgstPercent] = useState(18);
  // const [paymentMode, setPaymentMode] = useState("Pending");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showBankModal, setShowBankModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  // console.log("selectedCategory ------", selectedCategory)
  // console.log("selectedBank", selectedBank);

  // recieving ID by Params
  const { draftId } = useParams();
  console.log("drafts id is , line no. 33 :-", draftId);
  // fetch draft data only if billNo exists
  const {
    data: draftData,
    isLoading: draftIdLoading,
    refetch: refetchDraft,
  } = useGetDraftByIdQuery(draftId, {
    skip: !draftId, // skip if no billNo
    refetchOnMountOrArgChange: true,
    // refetchOnFocus: true, // refetch whenever the tab regains focus 3rd option
  });

  //   useEffect(() => {
  //   return () => {
  //     dispatch(api.util.resetApiState()); // reset all query caches  2nd option
  //   };
  // }, []);

  // console.log("draftData is:- ",draftData.draft)
  useEffect(() => {
    if (draftId) {
      refetchDraft()
        .unwrap()
        .then((data) => {
          if (data?.draft?.length > 0) {
            console.log("data is data.....:---", data);
            const draft = data.draft[0];
            setAddedProducts(
              (draft.items || []).map((item) =>
                calculateAmounts(
                  item,
                  draft.globalDiscount || 0,
                  draft.globalDiscountType || "%"
                )
              )
            );
            console.log("123 drats data is ", data.draft[0].items);
            setSelectedBranchId(draft.customerId || null);
            setInvoiceDate(
              draft.invoiceDate || new Date().toISOString().split("T")[0]
            );
            setDueDate(draft.dueDate || null);
            setSelectedBank(draft.bankDetailId || null);
            setGlobalDiscount(draft.globalDiscount || 0);
            setGlobalDiscountType(draft.globalDiscountType || "");
          }
        });
    }
  }, [draftId]); // Only depend on draftData 1st option

  // sending drafts to backend setup
  const [createOrUpdateDraft, { isLoading: createDraftLoading }] =
    useCreateOrUpdateDraftMutation();

  // fetching product category data
  const { data, isLoading: getLoading } = useGetCategoriesQuery();
  // API returns { success: true, data: [...] }
  const categoryOptions = data?.data || [];

  // fetching product data
  const {
    data: fetchProductsData,
    isLoading: productsLoading,
    refetch: productRefetch,
  } = useGetProductsQuery();

  // fetching bank details data
  // RTK Query hooks
  const { data: bankDetails, isLoading } = useGetBanksQuery();
  const banks = bankDetails?.data || [];

  // sending invoice data
  const [createInvoice, { isLoading: invoiceloading }] =
    useCreateInvoiceMutation();

  const handleSelectProduct = (product) => {
    setSearchTerm(product.productName);
    setSelectedProduct(product); // optional if you're tracking it
    setShowDropdown(false);
  };

  const grandTotal = addedProducts.reduce(
    (acc, item) => acc + (item.priceWithTax || 0),
    0
  );
  // taxPrice
  // ✅ STEP 1: Calculate total netAmountAfterDiscount from all products ==== ( taxable amount )
  const totalNetAmountAfterDiscount = addedProducts.reduce((acc, item) => {
    return acc + (item.netAmountAfterDiscount || 0);
  }, 0);

  // ✅ STEP 2: Calculate total discount (netAmount - netAmountAfterDiscount) === ( total discount of array data of invoice )
  const totalDiscount = addedProducts
    .reduce((acc, item) => {
      const itemDiscount =
        (item.netAmount || 0) - (item.netAmountAfterDiscount || 0);
      return acc + itemDiscount;
    }, 0)
    .toFixed(2);

  // ✅ STEP 3: Calculate total netAmount (before discount)
  const totalNetAmount = addedProducts
    .reduce((acc, item) => {
      return acc + (Number(item.netAmount) || 0);
    }, 0)
    .toFixed(2);

  // ✅ STEP 4: Calculate total tax amount

  const totalTaxAmount = addedProducts
    .reduce((acc, item) => {
      return acc + (Number(item.taxPrice) || 0);
    }, 0)
    .toFixed(2);

  const total = Number(totalNetAmount + totalTaxAmount).toFixed(2);

  // Inside your component
  const roundOffAmount = +(Math.round(grandTotal) - grandTotal).toFixed(2);

  const handleBankChange = (e) => {
    const value = e.target.value;

    if (value === "add_new") {
      // Open modal for adding new bank
      setShowBankModal(true);
    } else if (value === "") {
      // If user selects -- Select Bank --
      setSelectedBank(null);
    } else {
      setSelectedBank(value);
    }
  };

  console.log("234 added products :-", addedProducts);

  const handleSaveAndPrint = async () => {
    // ✅ Validation: show warnings based on missing fields
    if (!selectedBranchId) {
      toast.warn("Please select a customer before saving.", {
        position: "top-right",
        autoClose: 3000,
      });
      return; // stop execution
    }

    // ✅ Validation: show warnings based on missing fields
    if (!selectedBank) {
      toast.warn("Please select a bank details before saving.", {
        position: "top-right",
        autoClose: 3000,
      });
      return; // stop execution
    }

    if (addedProducts.length === 0) {
      toast.warn("Please add at least one product before saving.", {
        position: "top-right",
        autoClose: 3000,
      });
      return; // stop execution
    }

    const payload = {
      items: addedProducts.map((item) => ({
        productId: draftId ? item.productId : item._id,
        productName: item.productName,
        quantity: item.quantity,
        rateUnit: item.rateUnit,
        netAmount: item.netAmount, // ✅ added
        netAmountAfterDiscount: item.netAmountAfterDiscount,
        taxPrice: item.taxPrice,
        gstPercent: item.gstPercent,
        discount: item.discount ?? globalDiscount,
        priceWithTax: item.priceWithTax,
      })),

      // ✅ STEP 5: Add calculated totals to payload for backend
      totalNetAmount: parseFloat(totalNetAmount).toFixed(2),
      totalNetAmountAfterDiscount: parseFloat(
        totalNetAmountAfterDiscount.toFixed(2)
      ),
      totalDiscount: Number(totalDiscount),
      totalTaxAmount: totalTaxAmount,
      // ✅ Add round-off logic
      roundOff: roundOff, // true/false
      roundOffAmount: roundOff ? parseFloat(roundOffAmount.toFixed(2)) : 0, // always send number
      grandTotal: roundOff
        ? parseFloat(Math.round(displayTotal).toFixed(2))
        : parseFloat(displayTotal.toFixed(2)),
      amountPaid,
      globalDiscount: globalDiscount,
      globalDiscountType: globalDiscountType,
      paymentStatus,
      paymentMode: "Pending",
      invoiceDate,
      dueDate,
      bankDetailId: selectedBank,
      customerId: selectedBranchId,
      ...(draftId ? { draftId } : {}),
    };

    console.log("Bill Payload:", payload);
    try {
      const res = await createInvoice(payload).unwrap();
      toast.success("Invoice created successfully!");

      // ✅ Reset form after success
      refetch();
      productRefetch();
      setAddedProducts([]);
      setGlobalDiscount(0);
      setSelectedBranchId(null);
      setSelectedBank(null);
      console.log("Invoice Created:", res);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error(error?.data?.message || "Failed to create invoice");
    }
  };
  const navigate = useNavigate();
  const handleDraft = async () => {
    const payload = {
      items: addedProducts.map((item) => ({
        productId: draftId ? item.productId : item._id,
        productName: item.productName,
        quantity: item.quantity,
        rateUnit: item.rateUnit,
        netAmount: item.netAmount, // ✅ added
        netAmountAfterDiscount: item.netAmountAfterDiscount,
        taxPrice: item.taxPrice,
        gstPercent: item.gstPercent,
        discount: item.discount ?? globalDiscount,
        priceWithTax: item.priceWithTax,
      })),
      grandTotal: roundOff
        ? parseFloat(Math.round(displayTotal).toFixed(2))
        : parseFloat(displayTotal.toFixed(2)),
      invoiceDate,
      dueDate,
      globalDiscount: globalDiscount,
      globalDiscountType: globalDiscountType,
      customerId: selectedBranchId,
      bankDetailId: selectedBank,
      ...(draftId ? { draftId } : {}),
    };
    console.log("Drafts Payload:", payload);
    try {
      const res = await createOrUpdateDraft(payload).unwrap();
      toast.success(res.message || "Saved in Drafts successfully");
      console.log("Draft Response:", res);
      setAddedProducts([]);
      setGlobalDiscount(0);
      setSelectedBranchId(null);
      navigate("/vendor/purchaseOrder");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error(
        error?.data?.message ||
          error?.error ||
          error?.message ||
          "Failed to save draft"
      );
    }
  };

  // ✅ Central Discount Calculation Function
  const calculateAmounts = (item, globalDiscount, globalDiscountType) => {
    const netAmount = item.quantity * item.rateUnit;

    // Choose discount source
    const discountRate =
      item.discount !== null &&
      item.discount !== undefined &&
      item.discount !== ""
        ? item.discount
        : globalDiscount;

    // Calculate discount based on type
    let discountAmount =
      globalDiscountType === "%"
        ? (netAmount * discountRate) / 100
        : discountRate;

    // Prevent discount exceeding netAmount
    discountAmount = Math.min(discountAmount, netAmount);

    const netAmountAfterDiscount = netAmount - discountAmount;
    const gstPercent = item.gstPercent || 0;
    const taxPrice = (netAmountAfterDiscount * gstPercent) / 100;
    const priceWithTax = netAmountAfterDiscount + taxPrice;

    return {
      ...item,
      netAmount: parseFloat(netAmount.toFixed(2)),
      netAmountAfterDiscount: parseFloat(netAmountAfterDiscount.toFixed(2)),
      taxPrice: parseFloat(taxPrice.toFixed(2)),
      priceWithTax: parseFloat(priceWithTax.toFixed(2)),
    };
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...addedProducts];
    updated[index][field] = value;

    updated[index] = calculateAmounts(
      updated[index],
      globalDiscount,
      globalDiscountType
    );

    setAddedProducts(updated);
  };

  const handleAddToBill = () => {
    if (!selectedProduct || quantity <= 0) {
      toast.warn("Please select a valid product and quantity.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    console.log(
      "added products and selected products",
      addedProducts,
      selectedProduct
    );
    const alreadyExists = addedProducts.some(
      (p) => p._id === selectedProduct._id
    );
    if (alreadyExists) {
      toast.warn("Product already added.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const discountRate = globalDiscount;
    const netAmount = quantity * selectedProduct.rateUnit;
    const netAmountAfterDiscount = netAmount * (1 - discountRate / 100);

    const gstPercent = selectedProduct.gstPercent || 0;
    const taxPrice = (netAmount * gstPercent) / 100;
    const priceWithTax = netAmount + taxPrice;
    // const productId = selectedProduct._id;
    const updatedProduct = {
      ...selectedProduct,
      quantity,
      // productId,
      discount: "",
      gstPercent,
      netAmount: parseFloat(netAmount.toFixed(2)),
      netAmountAfterDiscount: parseFloat(netAmountAfterDiscount.toFixed(2)),
      taxPrice: parseFloat(taxPrice.toFixed(2)),
      priceWithTax: parseFloat(priceWithTax.toFixed(2)),
    };

    console.log("updatedProduct", updatedProduct);
    setAddedProducts([...addedProducts, updatedProduct]);
    setSelectedProduct(null);
    setSearchTerm("");
    setQuantity("");

    toast.success("Product Added Successfully", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleSearch = debounce((text) => {
    setSearchTerm(text);
    setShowDropdown(true);
  }, 200);

  const handleProductPriceChange = (index, key, value) => {
    const updated = [...addedProducts];
    updated[index][key] =
      key === "quantity" || key === "rateUnit" || key === "discount"
        ? parseFloat(value)
        : value;
    setAddedProducts(updated);
  };

  useEffect(() => {
    if (!fetchProductsData || !fetchProductsData.data) {
      setFilteredProducts([]);
      return;
    }
    const filtered = fetchProductsData.data.filter((product) => {
      const matchesCategory =
        !selectedCategory ||
        product.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch =
        !searchTerm ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
    setFilteredProducts(filtered);
  }, [fetchProductsData, selectedCategory, searchTerm]);

  useEffect(() => {
    const updated = addedProducts.map((item) =>
      calculateAmounts(item, globalDiscount, globalDiscountType)
    );
    setAddedProducts(updated);
  }, [globalDiscount, globalDiscountType]);

  // Watch for discount type change and convert existing discounts
  // 1. Fix typo
  // const totalPrice = Number(item.rateUnit) * Number(item.quantity);

  // 2. Ensure discount conversion runs
  useEffect(() => {
    setAddedProducts((prev) =>
      prev.map((item) => {
        if (
          item.discount === null ||
          item.discount === "" ||
          isNaN(item.discount)
        )
          return item;

        const totalPrice = Number(item.rateUnit) * Number(item.quantity);
        if (!totalPrice || totalPrice <= 0) return item;

        let newDiscount;
        if (globalDiscountType === "₹") {
          newDiscount = (Number(item.discount) / 100) * totalPrice;
        } else {
          newDiscount = (Number(item.discount) / totalPrice) * 100;
        }

        return {
          ...item,
          discount: Number.isFinite(newDiscount)
            ? Number(newDiscount.toFixed(2))
            : 0,
        };
      })
    );
  }, [globalDiscountType]);

  console.log("selectedzsearch....", filteredProducts);

  const handleRemoveProduct = (index) => {
    const updated = [...addedProducts];
    updated.splice(index, 1);
    setAddedProducts(updated);
    toast.success("Remove Successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const [roundOff, setRoundOff] = useState(true);
  const [displayTotal, setDisplayTotal] = useState(grandTotal);
  useEffect(() => {
    if (roundOff) {
      setDisplayTotal(Math.round(grandTotal));
    } else {
      setDisplayTotal(grandTotal);
    }
  }, [roundOff, grandTotal]);

  useEffect(() => {
    if (amountPaid >= grandTotal) {
      setPaymentStatus("Paid");
    } else if (amountPaid > 0) {
      setPaymentStatus("Partial");
    } else {
      setPaymentStatus("Pending");
    }
  }, [amountPaid, grandTotal]);

  const dropdownRef = useRef(null); // For wrapping input + dropdown

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const totalQty = addedProducts.reduce(
    (sum, item) => sum + parseFloat(item.quantity || 0),
    0
  );

  return (
    <>
      <h2 className="text-lg font-semibold  mb-1 ">Products & Services</h2>
      <div className="p-4 bg-blue-50 min-h-fit rounded-md">
        <div className="sticky -top-2 z-7 p-2 w-full bg-blue-50">
          <div className="w-full flex flex-wrap md:flex-nowrap items-center gap-3 mb-2 ">
            {/* Category Select */}
            <select
              className="border border-gray-300 px-4 py-2 rounded-md text-sm min-w-[160px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {getLoading ? (
                <option disabled>Loading...</option>
              ) : (
                categoryOptions.map((cat) => (
                  <option key={cat._id} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))
              )}
            </select>

            {/* Search Input */}
            <div
              ref={dropdownRef}
              className="relative  min-w-[200px] w-[550px]"
            >
              <input
                type="text"
                placeholder="Search for existing products"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full px-4 py-2 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Suggestions List */}
              {showDropdown && (
                <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {productsLoading ? (
                    <li className="flex items-center justify-center py-4">
                      <Loader />
                    </li>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          handleSelectProduct(product);
                          setShowDropdown(false);
                        }}
                        className="flex items-center justify-between px-4 py-3 bg-white hover:bg-blue-50 transition duration-150 cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800 capitalize">
                            {product.productName}
                          </span>
                          <span className="text-xs text-green-700 font-medium">
                            Avl. qty: {product.inStock || 0}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-orange-600">
                          ₹ {product.rateUnit}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-sm text-gray-500">
                      No matching products
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Quantity */}
            <input
              type="number"
              min="1"
              max={selectedProduct?.inStock || undefined}
              className="px-4 py-2 border border-gray-300 bg-white rounded-md w-21 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Qty"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (isNaN(val)) return;
                const available = selectedProduct?.inStock;
                if (available === undefined) {
                  toast.warn("Please select a product first.", {
                    position: "top-right",
                    autoClose: 3000,
                  });
                  return;
                }
                if (val <= available) {
                  setQuantity(val);
                } else {
                  toast.warn(`Only ${available} quantity available`, {
                    position: "top-right",
                    autoClose: 3000,
                  });
                  setQuantity(available);
                }
              }}
              disabled={!selectedProduct}
            />
            {/* <span></span> */}

            {/* Add to Bill */}
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-md text-sm font-semibold shadow-sm whitespace-nowrap"
              onClick={handleAddToBill}
            >
              + Add to Bill
            </button>
          </div>
        </div>

        <div className="bg-white  rounded shadow min-h-[22rem] max-h-[60vh] overflow-x-auto hide-scrollbar">
          <table className="min-w-full text-sm text-left ">
            <thead className="bg-black text-white sticky top-0 z-5">
              <tr>
                <th className="p-3 text-center border">S No.</th>
                <th className="p-3 text-center border">Product Details</th>
                <th className="p-3 text-center border">Qty</th>
                <th className="p-3 text-center border">Unit Price</th>
                <th className="p-3 text-center border">Net Amount</th>
                <th className="p-3 text-center border">Tax</th>
                <th className="p-3 text-center border">
                  Discount{" "}
                  <select
                    value={globalDiscountType}
                    onChange={(e) => {
                      setGlobalDiscountType(e.target.value);
                      // Type change par discount reset
                    }}
                    className=" px-2 py-1 text-sm outline-none text-white border-gray-300"
                  >
                    <option className="text-black" value="%">
                      %
                    </option>
                    <option className="text-black" value="₹">
                      ₹
                    </option>
                  </select>
                </th>
                <th className="p-3 text-center border">Total Amount</th>
              </tr>
            </thead>

            <tbody className="max-h-[45vh] overflow-y-auto">
              {draftIdLoading ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center">
                    <DataLoading />
                    <p className="text-sm text-gray-500">
                      Please wait while we load your draft data
                    </p>
                  </td>
                </tr>
              ) : addedProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-8  text-gray-500 bg-white"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <img
                        src={emptyImage}
                        alt="Empty product list"
                        className="w-40 h-35 object-cover mb-2"
                      />
                      <p>Search existing products to add to this list</p>
                    </div>
                  </td>
                </tr>
              ) : (
                addedProducts.map((item, index) => {
                  const effectiveDiscount = item.discount ?? globalDiscount;
                  const total =
                    item.quantity *
                    item.rateUnit *
                    (1 - Number(effectiveDiscount) / 100);

                  return (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="p-3 text-center font-mono border border-gray-200">
                        {index + 1}
                      </td>

                      <td className="p-2 border border-gray-200 text-gray-800 text-center">
                        <span className="text-sm font-semibold text-gray-800  truncate max-w-[160px]">
                          {item.productName}
                        </span>
                      </td>

                      <td className="p-3 text-center border border-gray-200">
                        <input
                          type="number"
                          min="1"
                          max={item.inStock}
                          value={item.quantity}
                          onChange={(e) => {
                            let val = parseInt(e.target.value) || 1;
                            if (val > item.inStock) val = item.inStock; // enforce max
                            if (val < 1) val = 1; // enforce min
                            handleProductChange(index, "quantity", val);
                          }}
                          className="w-16 text-center border rounded px-2 py-1 shadow-sm focus:ring focus:ring-blue-200"
                        />
                      </td>

                      <td className="p-3 text-center border border-gray-200">
                        <span className="inline-block text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md text-sm font-medium">
                          ₹{item.rateUnit}
                        </span>
                      </td>

                      <td className="p-3 text-center border border-gray-200">
                        <span className="text-base font-semibold text-gray-800">
                          ₹{item.netAmount?.toFixed(2)}
                        </span>
                      </td>

                      <td className="p-3 text-center border border-gray-200 bg-gray-50">
                        <div className="flex flex-col items-center">
                          {/* Tax Price */}
                          <span className="text-sm font-medium text-gray-900">
                            ₹{item.taxPrice?.toFixed(2)}
                          </span>

                          {/* gstPercent Label */}
                          <span className="mt-0.5 text-[11px] text-gray-500 border border-gray-300 px-2 py-[1px] rounded">
                            GST {item.gstPercent}%
                          </span>
                        </div>
                      </td>

                      <td className="p-3 text-center border border-gray-200">
                        <div className="flex flex-col items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max={
                              globalDiscountType === "₹"
                                ? (Number(item.rateUnit) || 0) *
                                  (Number(item.quantity) || 0) // FIX: safe calc
                                : 100
                            }
                            placeholder={
                              item.discount !== null &&
                              item.discount !== "" &&
                              item.discount !== undefined
                                ? globalDiscountType === "₹"
                                  ? `₹${item.discount}`
                                  : `${item.discount}%`
                                : globalDiscount > 0
                                ? globalDiscountType === "₹"
                                  ? `₹${globalDiscount}`
                                  : `${globalDiscount}%`
                                : "0"
                            }
                            value={
                              item.discount === null ||
                              item.discount === undefined ||
                              item.discount === ""
                                ? ""
                                : item.discount
                            }
                            onChange={(e) => {
                              const value = e.target.value;

                              if (value === "") {
                                handleProductChange(index, "discount", null);
                                return;
                              }

                              const parsed = parseFloat(value);
                              let discount;

                              if (isNaN(parsed)) {
                                discount = null;
                              } else {
                                if (globalDiscountType === "₹") {
                                  const maxDiscount =
                                    (Number(item.rateUnit) || 0) *
                                    (Number(item.quantity) || 0);
                                  discount = Math.min(
                                    maxDiscount,
                                    Math.max(0, parsed)
                                  );
                                } else {
                                  discount = Math.min(100, Math.max(0, parsed));
                                }
                              }

                              handleProductChange(index, "discount", discount);
                            }}
                            className="w-20 text-center border rounded px-2 py-1 shadow-sm focus:ring focus:ring-blue-200"
                          />

                          {item.discount !== null && item.discount !== "" ? (
                            <span className="text-[10px] text-blue-600">
                              (Custom{" "}
                              {globalDiscountType === "₹"
                                ? `₹${item.discount}`
                                : `${item.discount}%`}
                              )
                            </span>
                          ) : globalDiscount > 0 ? (
                            <span className="text-[10px] text-green-600">
                              (Global{" "}
                              {globalDiscountType === "₹"
                                ? `₹${globalDiscount}`
                                : `${globalDiscount}%`}
                              )
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="p-3 text-center border border-gray-200 relative bg-green-50 rounded-md">
                        {/* Total Amount (Net + Tax) */}
                        <div className="text-green-700 font-bold text-sm leading-tight">
                          ₹{item.priceWithTax?.toFixed(2)}
                          {/* <span className="text-[10px] text-gray-600 ml-1">(Total)</span> */}
                        </div>

                        {/* Breakdown: Net + Tax */}
                        <div className="text-[11px] mt-0.5">
                          <span className="text-gray-700 bg-gray-100 px-1 py-0.5 rounded">
                            {item.netAmountAfterDiscount?.toFixed(2)}
                          </span>
                          <span className="mx-1 text-gray-400">+</span>
                          <span className="text-gray-700 bg-yellow-100 px-1 py-0.5 rounded">
                            {item.taxPrice?.toFixed(2)}
                          </span>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleRemoveProduct(index)}
                          className="absolute top-1 right-1 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 transition duration-200 shadow-sm"
                          title="Remove Product"
                        >
                          <MdDelete category={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="w-full flex flex-col md:flex-row items-center justify-between bg-gray-100 p-4  gap-4">
          {/* Left side: Discount input */}
          {/* Right side: Items summary and button */}
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm font-semibold text-gray-600">
              Items: {addedProducts.length}, Qty: {totalQty.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6 w-full max-w-7xl mx-auto ">
        {/* Left: Payment Details */}
        <div className="bg-white rounded-xl px-6 border border-gray-300 w-full py-6 relative">
          {/* Label + Add Button */}
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1 relative">
              Select Bank
              <span
                className="text-xs cursor-pointer relative bg-gray-400 text-white rounded-full h-4 w-4 text-center"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                ?
                {showTooltip && (
                  <div className="absolute left-full ml-2 top-0 z-10 w-64 bg-black text-white text-xs rounded-lg p-3 shadow-lg whitespace-normal">
                    <strong>Select Bank Details</strong> to show in document
                    PDFs. <br />
                    Please click on <strong>Add New Bank</strong> to add new
                    bank details.
                  </div>
                )}
              </span>
            </label>

            {/* Right side add button */}
            <button
              onClick={() => setShowBankModal(true)}
              className="text-gray-600 text-sm flex items-center gap-1 cursor-pointer hover:text-orange-600"
            >
              <FaPlusCircle className="text-orange-500" />
              Add New Bank
            </button>
          </div>

          {/* Dropdown */}
          <select
            value={selectedBank || ""}
            onChange={handleBankChange}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black bg-purple-50"
          >
            <option value="">-- Select Bank --</option>
            {isLoading ? (
              <option disabled>Loading banks...</option>
            ) : banks.length > 0 ? (
              banks.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.bankName} ({bank.accountNumber})
                </option>
              ))
            ) : (
              <option disabled>No banks available</option>
            )}

            {/* Fixed Add New Bank option */}
            <option
              value="add_new"
              className="text-orange-600 hover:text-orange-600 font-semibold"
            >
              ➕ Add New Bank
            </option>
          </select>
        </div>

        {/* Right: Summary */}
        <div className="bg-green-50 p-6 rounded-xl border border-gray-300 w-full h-fit flex flex-col justify-between">
          {/* Top Row: Extra Discount */}
          <div className="flex justify-end mb-1">
            <div className="flex items-center gap-1">
              <span className="text-gray-600 text-xs">
                Apply discount(%) to all items?
              </span>
              <span
                className="text-gray-400 cursor-pointer"
                title="All Items discount applicable"
              >
                ⓘ
              </span>
            </div>
          </div>

          {/* Discount Input */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center bg-green-100 rounded-lg overflow-hidden border border-gray-300">
              {/* --- update global discount input  */}
              <select
                value={globalDiscountType}
                onChange={(e) => {
                  setGlobalDiscountType(e.target.value);
                }}
                className="bg-green-100 text-gray-600 px-2 py-1 text-sm outline-none border-r border-gray-300"
              >
                <option value="%">%</option>
                <option value="₹">₹</option>
              </select>

              <input
                type="number"
                min="0"
                max={globalDiscountType === "%" ? 100 : totalNetAmount}
                className="w-20 rounded px-2 py-1 outline-none"
                placeholder={
                  globalDiscount > 0
                    ? globalDiscountType === "%"
                      ? `${globalDiscount}%`
                      : `₹${globalDiscount}`
                    : `Global ${globalDiscountType}`
                }
                value={globalDiscount === null ? "" : globalDiscount} // ✅ empty allow
                onChange={(e) => {
                  let val = e.target.value;

                  // Agar empty hai → null set karo (0 mat set karo)
                  if (val === "") {
                    setGlobalDiscount(null);
                    return;
                  }

                  let parsed = parseFloat(val);

                  if (isNaN(parsed)) return; // ignore invalid

                  // Clamp value
                  if (globalDiscountType === "%" && parsed > 100) parsed = 100;
                  if (globalDiscountType === "₹" && parsed > totalNetAmount)
                    parsed = totalNetAmount;

                  setGlobalDiscount(parsed);
                }}
              />
            </div>
          </div>

          {/* Bottom Right Calculation Section */}
          <div className="flex justify-end items-end mt-auto">
            <div className="flex flex-col gap-1 text-sm w-fit">
              <div className="flex justify-between">
                <span className="text-gray-600">Taxable Amount</span>
                <span className="text-gray-800 font-medium">
                  ₹ {totalNetAmount}
                </span>
              </div>

              <div className="flex justify-between ">
                <span className="text-gray-600">Total Tax</span>
                <span className="text-gray-800 font-medium">
                  ₹ {totalTaxAmount}
                </span>
              </div>

              <div className="flex justify-between items-center gap-20">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 mb-0.5">Round Off</span>
                  <button
                    type="button"
                    onClick={() => setRoundOff(!roundOff)}
                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-300 ${
                      roundOff ? "bg-orange-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform duration-300 ${
                        roundOff ? "translate-x-3.5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <span className="text-gray-800 font-medium">
                  ₹ {roundOff ? roundOffAmount?.toFixed(2) : "0.00"}
                </span>
              </div>

              <div className="flex justify-between font-bold text-lg ">
                <span>Total Amount</span>
                <span className="font-bold">₹ {displayTotal}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Total Discount</span>
                <span className="text-gray-800 font-medium">
                  ₹ {totalDiscount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FixedTotalBar
        total={displayTotal}
        handleSaveAndPrint={handleSaveAndPrint}
        handleDraft={handleDraft}
        invoiceloading={invoiceloading}
        createDraftLoading={createDraftLoading}
      />

      {/* Add bank Modal from  */}
      {showBankModal && (
        <BankDetailsModal onClose={() => setShowBankModal(false)} />
      )}
    </>
  );
};

export default BillingApp;
