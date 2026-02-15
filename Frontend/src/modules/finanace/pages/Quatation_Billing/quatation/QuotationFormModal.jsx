import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Plus, Trash2, X } from "lucide-react";
import {
  useCreateQuotationMutation,
} from "@/api/finance/Quatation_Billing/quatation.api";
import { useGetClientsQuery } from "@/api/finance/Quatation_Billing/client.api";
import { useGetProjectsQuery } from "@/api/finance/Quatation_Billing/project.api";
import { useGetProductsQuery } from "@/api/finance/Quatation_Billing/product.api";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Validation Schema


const QuotationFormModal = ({ showModal, onClose, onSuccess }) => {
  const today = new Date();
today.setHours(0, 0, 0, 0);
  const quotationSchema = yup.object().shape({
  client: yup.string()
    .required("Client is required")
    .max(30, "Name cannot exceed 30 characters"),
    
  project: yup.string().required("Project is required"),
  items: yup
    .array()
    .of(
      yup.object().shape({
        product: yup.string().required("Product is required"),
        qty: yup.number().typeError("Quantity is required").min(1, "Min 1 qty"),
        rate: yup.number().typeError("Rate is required").min(0, "Rate must be >= 0"),
        discount: yup.number().min(0, "Discount must be >= 0").default(0),
        taxRates: yup.object().shape({
          cgst: yup.number().min(0).max(100),
          sgst: yup.number().min(0).max(100),
          igst: yup.number().min(0).max(100),
        }),
      })
    )
    .min(1, "At least one item is required"),
  shippingCharges: yup.number().min(0).default(0),
  discount: yup.number().min(0).default(0),
  amountPaid: yup.number().min(0).default(0),
  paymentStatus: yup.string().oneOf(["Pending", "Partial", "Paid"]).required(),
  paymentMode: yup.string().oneOf(["UPI", "Cash", "Bank Transfer", "Cheque"]).required(), 
  dueDate: yup
    .string()
    .required("Due date is required")
    .test("is-valid-date", "Due date cannot be in the past", (value) => {
      if (!value) return false;
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }),
  notes: yup.string().nullable().max(50),
  sendSMS: yup.boolean(),
});


  const { data: clients } = useGetClientsQuery();
  const { data: allProjects } = useGetProjectsQuery();
  const { data: products } = useGetProductsQuery();
  const [createQuotation] = useCreateQuotationMutation();
const modalRef=useRef(null)
  // ✅ React Hook Form Setup
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

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(quotationSchema),
   mode: "onChange",
    defaultValues: {
      client: "",
      project: "",
      items: [],
      shippingCharges: 0,
      discount: 0,
      paymentStatus: "Pending",
      paymentMode: "UPI",
      amountPaid: 0,
      dueDate: "",
      notes: "",
      sendSMS: false,
    },
  });

  const { fields: itemFields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const selectedClient = watch("client");

  // ✅ Filter projects when client changes
  const [filteredProjects, setFilteredProjects] = useState([]);
  useEffect(() => {
    if (selectedClient && allProjects) {
      const projectsForClient = allProjects.filter((project) => {
        if (project.client && project.client._id) {
          return project.client._id === selectedClient;
        }
        if (project.clientId) {
          return project.clientId === selectedClient;
        }
        if (project.client) {
          return project.client === selectedClient;
        }
        return false;
      });
      setFilteredProjects(projectsForClient);
    } else {
      setFilteredProjects([]);
    }
  }, [selectedClient, allProjects]);

  // ✅ Reset Form
  const resetForm = () => {
    reset();
    setFilteredProjects([]);
    onClose();
  };

  // ✅ Submit Handler
  const onSubmit = async (data) => {
    try {
      const clientObj = clients.find((c) => c._id === data.client);
      const projectObj = allProjects.find((p) => p._id === data.project);

      const itemsWithProductObjects = data.items.map((item) => {
        const productObj = products.find((p) => p._id === item.product);
        return {
          ...item,
          product: productObj,
        };
      });

      const dataToSend = {
        ...data,
        client: clientObj,
        project: projectObj,
        items: itemsWithProductObjects,
      };

      await createQuotation(dataToSend).unwrap();
      toast.success("Quotation created successfully!");
      resetForm();
      onSuccess();
    } catch (err) {
      toast.error("Failed to create quotation!");
      console.error("Error creating quotation:", err);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0  bg-opacity-75 transition-opacity"
          onClick={resetForm}
        ></div>

        {/* Centering Trick */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal Container */}
      
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-auto pt-20 pb-10 p-4 z-50">
    <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-700 text-white p-2 relative">
        <h2 className="text-2xl text-left font-bold ">Create New Quotation</h2>
        <p className="text-white/80 text-left text-sm">Fill in the details below to create a new quotation</p>
        <button onClick={resetForm} className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200">
          <X size={20} />
        </button>
      </div>

      {/* Form */}
    <form onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-4">
  {/* Client */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Client</label>
    <select
      {...register("client")}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        errors.client ? "border-red-500" : "border-gray-300"
      }`}
    >
      <option value="" className="text-black bg-white">Select Client</option>
      {clients?.map(c => (
        <option key={c._id} value={c._id} className="text-black bg-white">{c.name}</option>
      ))}
    </select>
    {errors.client && <p className="text-red-500 text-left text-xs">{errors.client.message}</p>}
  </div>

  {/* Project */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Project</label>
    <select
      {...register("project")}
      disabled={!selectedClient}
      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        errors.project ? "border-red-500" : "border-gray-300"
      } ${!selectedClient ? "bg-gray-100" : "bg-white"}`}
    >
      <option value="" className="text-black bg-white">Select Project</option>
      {filteredProjects?.map(p => (
        <option key={p._id} value={p._id} className="text-black bg-white">{p.name}</option>
      ))}
    </select>
    {errors.project && <p className="text-red-500 text-left text-xs">{errors.project.message}</p>}
  </div>

  {/* Items */}
  <div>
    <div className="flex justify-between items-center mb-2">
      <h4 className="text-sm font-medium text-gray-900">Items</h4>
      <button
        type="button"
        onClick={() =>
          append({ product: "", qty: 1, rate: 0, discount: 0, taxRates: { cgst: 0, sgst: 0, igst: 0 } })
        }
        className="inline-flex items-center px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
      >
        <Plus className="h-3 w-3 mr-1" /> Add Item
      </button>
    </div>

    {itemFields.length === 0 ? (
      <div className="text-center py-2 border-2 border-dashed border-gray-300 rounded-md">
        <p className="text-xs text-gray-500">No items added yet</p>
      </div>
    ) : (
      <div className="space-y-3">
        {itemFields.map((item, index) => (
          <div key={item.id} className="border border-gray-200 rounded-md p-3 bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <h5 className="text-xs font-medium text-gray-900">Item #{index + 1}</h5>
              <button type="button" onClick={() => remove(index)} className="text-red-500 hover:text-red-700  text-xs">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Product */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 text-left">Product</label>
                <select
                  {...register(`items.${index}.product`)}
                  className="block border text-black w-full px-2 py-1 text-sm border-gray-300 rounded-md"
                >
                  <option value="" className="text-black">Select Product</option>
                  {products?.map(prod => (
                    <option key={prod._id} value={prod._id} className="text-black bg-white">{prod.name}</option>
                  ))}
                </select>
                <p className="text-red-500 text-xs">{errors.items?.[index]?.product?.message}</p>
              </div>

              {/* Qty, Rate, Discount */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-left text-xs font-medium text-gray-700 mb-1">Qty</label>
                  <input type="number" {...register(`items.${index}.qty`)} className="block w-full border px-2 py-2 text-black border-gray-300 rounded-md text-sm  " min="1" />
                </div>
                <div>
                  <label className="block text-left text-xs font-medium text-gray-700 mb-1">Rate</label>
                  <input type="number" {...register(`items.${index}.rate`)} className="block w-full border-gray-300 text-black rounded-md text-sm  border px-2 py-2" min="0" step="0.01" />
                </div>
                <div>
                  <label className="block text-left text-xs font-medium text-gray-700 mb-1">Discount</label>
                  <input type="number" {...register(`items.${index}.discount`)} className="block w-full border-gray-300 text-black rounded-md text-sm  border px-2 py-2" min="0" step="0.01" />
                </div>
              </div>

              {/* Taxes */}
              <div>
                <label className="block text-left text-xs font-medium text-gray-700 mb-1">Tax Rates (%)</label>
                <div className="grid grid-cols-3 text-left gap-2">
                  <div>
                    <label className="text-xs text-left text-gray-700">CGST</label>
                    <input type="number" {...register(`items.${index}.taxRates.cgst`)} className="block w-full text-black border-gray-300 rounded-md text-sm  border px-2 py-2" min="0" max="100" step="0.01" />
                  </div>
                  <div>
                    <label className="text-xs text-left text-gray-700">SGST</label>
                    <input type="number" {...register(`items.${index}.taxRates.sgst`)} className="block w-full text-black border-gray-300 rounded-md text-sm  border px-2 py-2" min="0" max="100" step="0.01" />
                  </div>
                  <div>
                    <label className="text-xs text-left text-gray-700">IGST</label>
                    <input type="number" {...register(`items.${index}.taxRates.igst`)} className="block w-full text-black border-gray-300 rounded-md text-sm  border px-2 py-2" min="0" max="100" step="0.01" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
    <p className="text-red-500 text-xs">{errors.items?.message}</p>
  </div>

  {/* Charges, Payments, Dates */}
  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="block text-sm font-medium text-left text-gray-700 mb-1">Shipping Charges</label>
      <input type="number" {...register("shippingCharges")} className="block w-full border border-gray-300 rounded-md text-sm px-2 py-1" />
    </div>
    <div>
      <label className="block text-sm font-medium text-left text-gray-700 mb-1">Discount</label>
      <input type="number" {...register("discount")} className="block w-full border border-gray-300 rounded-md text-sm px-2 py-1" />
    </div>
  </div>

  <div>
    <label className="block text-sm font-medium text-left text-gray-700 mb-1">Amount Paid</label>
    <input type="number" {...register("amountPaid")} className="block w-full border border-gray-300 rounded-md text-sm px-2 py-1" />
  </div>

  <div>
    <label className="block text-sm font-medium text-left text-gray-700 mb-1">Payment Status</label>
    <select {...register("paymentStatus")} className="block w-full border border-gray-300 rounded-md text-sm px-2 py-1">
      <option value="Pending" className="text-black">Pending</option>
      <option value="Partial" className="text-black">Partial</option>
      <option value="Paid" className="text-black">Paid</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium text-left text-gray-700 mb-1">Payment Mode</label>
    <select {...register("paymentMode")} className="block w-full border border-gray-300 rounded-md text-sm px-2 py-1">
      <option value="UPI" className="text-black">UPI</option>
      <option value="Cash" className="text-black">Cash</option>
      <option value="Bank Transfer" className="text-black">Bank Transfer</option>
      <option value="Cheque" className="text-black">Cheque</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium text-left text-gray-700 mb-1">Due Date</label>
    <input type="date" {...register("dueDate")} min={new Date().toISOString().split("T")[0]}  className="block w-full border border-gray-300 rounded-md text-sm px-2 py-1" />
  </div>

  <div>
    <label className="block text-sm font-medium text-left text-gray-700 mb-1">Notes</label>
    <textarea {...register("notes")} className="block w-full border border-gray-300 rounded-md text-sm px-2 py-1" rows={2} />
  </div>

  <div className="flex items-center">
    <input id="sendSMS" type="checkbox" {...register("sendSMS")} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
    <label htmlFor="sendSMS" className="ml-2 text-sm text-gray-700">Send SMS to client</label>
  </div>

  {/* Actions */}
  <div className="flex justify-end gap-2 pt-2">
    <button type="button" onClick={resetForm} className="px-3 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
    <button type="submit" className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">Create Quotation</button>
  </div>
</form>

    </div>
  </div>
 

      </div>
    </div>
  );
};

export default QuotationFormModal;
