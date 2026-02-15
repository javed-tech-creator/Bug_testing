import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Plus, Edit2, Trash2, Search, Users, Mail, Phone, FileText, X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from "@/api/finance/Quatation_Billing/client.api";

// ✅ Yup validation schema
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Client name is required")
    .max(30, "Name cannot exceed 30 characters")
    .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d+$/, "Phone number must be numeric")
    .length(10, "Phone number must be exactly 10 digits"),
  gstin: yup
    .string()
    .required("GSTIN is required")
    .max(30, "GSTIN cannot exceed 30 characters"),
});

const ClientComponent = () => {
  const { data, isLoading, isError } = useGetClientsQuery();
  const [createClient] = useCreateClientMutation();
  const [updateClient] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", phone: "", gstin: "" },
    mode: "onChange", // realtime validation
  });

  const filteredClients =
    data?.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
    ) || [];

  // ✅ modalRef banaya
  const modalRef = useRef(null);

  // ✅ modal bahar click hone par close hoga
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose(); 
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  // ✅ Submit handler
  const onSubmit = async (formData) => {
    try {
      if (editingClient) {
        await updateClient({ id: editingClient._id, ...formData }).unwrap();
        toast.success("Client updated successfully!");
      } else {
        await createClient(formData).unwrap();
        toast.success("Client added successfully!");
      }
      handleClose();
    } catch (error) {
      toast.error("Something went wrong, please try again!");
      console.log(error);
    }
  };

  // ✅ Edit handler
  const handleEdit = (client) => {
    setEditingClient(client);
    reset({
      name: client.name,
      email: client.email,
      phone: client.phone,
      gstin: client.gstin,
    });
    setShowModal(true);
  };

  // ✅ Delete handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteClient(id).unwrap();
        toast.success("Client deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete client!");
        console.log(error);
      }
    }
  };

  const handleClose = () => {
    setEditingClient(null);
    setShowModal(false);
    reset({ name: "", email: "", phone: "", gstin: "" });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  if (isError)
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div className="flex items-center text-red-800">
          <X className="h-5 w-5 mr-2" />
          Failed to load clients. Please try again.
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-1 sm:mb-0">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Client Management
              </h1>
              <p className="text-gray-600 mt-1">
                {data?.length || 0} clients total
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Client
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-1 max-w-full relative">
          <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No clients found
              </h3>
              <p className="text-gray-600">
                Get started by adding your first client.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-2 px-6 font-medium text-white">
                      Client
                    </th>
                    <th className="text-left py-2 px-6 font-medium text-white">
                      Contact
                    </th>
                    <th className="text-left py-2 px-6 font-medium text-white">
                      GSTIN
                    </th>
                    <th className="text-left py-2 px-6 font-medium text-white">
                      Created
                    </th>
                    <th className="text-center py-2 px-6 font-medium text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClients.map((client) => (
                    <tr
                      key={client._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-1 px-2 flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-medium">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">{client.name}</div>
                      </td>
                      <td className="px-6 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {client.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {client.phone}
                        </div>
                      </td>
                      <td className="  text-sm font-mono bg-gray-100 px-2 py-1 rounded flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        {client.gstin}
                      </td>
                      <td className="px-6 text-sm text-gray-600">
                        {new Date(client.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-6 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-auto pt-20 pb-10 p-4 z-50">
            <div
              ref={modalRef}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-gray-700 to-gray-700 text-white p-2 relative">
                <h2 className="text-2xl font-bold ">
                  {editingClient ? "Edit Client" : "Add New Client"}
                </h2>
                <p className="text-white/80 text-sm">
                  Fill in the details below to{" "}
                  {editingClient ? "update this client" : "add a new client"}
                </p>
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-2 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    maxLength={30}
                    placeholder="Enter client name"
                    onInput={(e) =>
                      setValue("name", e.target.value.replace(/[^A-Za-z\s]/g, ""))
                    }
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Enter your Email"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    maxLength={10}
                    placeholder="Enter 10-digit phone number"
                    onInput={(e) =>
                      setValue("phone", e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                {/* GSTIN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GSTIN *
                  </label>
                  <input
                    type="text"
                    {...register("gstin")}
                    maxLength={30}
                    placeholder="Enter your GSTIN Number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono"
                  />
                  {errors.gstin && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.gstin.message}
                    </p>
                  )}
                </div>
                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-600 text-white rounded-xl hover:from-gray-700 hover:to-gray-700 transition-all duration-200"
                  >
                    {editingClient ? "Update Client" : "Add Client"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientComponent;
