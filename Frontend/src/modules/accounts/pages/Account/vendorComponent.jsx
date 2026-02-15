import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Edit3, Trash2, X } from 'lucide-react';
import {
  useGetVendorsQuery,
  useAddVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} from '@/api/accounts/vendor.api';

const schema = yup.object().shape({
  name: yup.string().matches(/^[A-Za-z\s]+$/, 'Name should only contain letters').required('Name is required'),
  company: yup.string().matches(/^[A-Za-z\s]+$/, 'Company should only contain letters').required('Company is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().matches(/^\d{10}$/, 'Phone must be 10 digits').required('Phone is required'),
  address: yup.string().required('Address is required'),
});

const VendorManager = () => {
  const modalRef=useRef(null)
  const { data: vendorsdata = [], isLoading, isError } = useGetVendorsQuery();
  const [addVendor] = useAddVendorMutation();
  const [updateVendor] = useUpdateVendorMutation();
  const [deleteVendor] = useDeleteVendorMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null); // null -> Add, object -> Update

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
useEffect(() => {
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setModalOpen(false); // sirf modal close hoga
    }
  };

  if (modalOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [modalOpen]);
  
  const openAddModal = () => {
    setSelectedVendor(null);
    reset();
    setModalOpen(true);
  };

  const openEditModal = (vendor) => {
    setSelectedVendor(vendor);
    // populate form fields
    ['name','company','email','phone','address'].forEach(field => {
      setValue(field, vendor[field]);
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (selectedVendor) {
      // Update
      await updateVendor({ id: selectedVendor._id, ...data });
    } else {
      // Create
      await addVendor({ ...data, type: 'vendor' });
    }
    setModalOpen(false);
    reset();
    setSelectedVendor(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      await deleteVendor(id);
    }
  };

  const filteredVendors = vendorsdata.filter(vendor =>
    ['name', 'company', 'email', 'phone', 'address'].some(key =>
      vendor[key]?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const paginatedVendors = filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) return <p>Loading vendors...</p>;
  if (isError) return <p>Error fetching vendors!</p>;
  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Vendor Management</h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Plus className="w-4 h-4" /> Add Vendor
          </button>
        </div>

        {/* Search */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Vendors Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="bg-blue-100">
                {['Name','Company','Email','Phone','Address','Actions'].map((th) => (
                  <th key={th} className="p-3 border border-blue-200">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedVendors.length > 0 ? (
                paginatedVendors.map(vendor => (
                  <tr key={vendor._id} className="hover:bg-gray-50">
                    <td className="p-3  border ">{vendor.name}</td>
                    <td className="p-3  border ">{vendor.company}</td>
                    <td className="p-3  border ">{vendor.email}</td>
                    <td className="p-3  border ">{vendor.phone}</td>
                    <td className="p-3  border ">{vendor.address}</td>
                    <td className="p-3  border  flex gap-2">
                      <button onClick={() => openEditModal(vendor)} className="border-2 border-gray-900 text-red-900 px-3 py-1 rounded-lg flex items-center gap-1 
                   hover:border-gray-300 hover:text-white hover:bg-gray-400 transition-all">
                        <Edit3 className="w-4 h-4" /> 
                      </button>
                      <button onClick={() => handleDelete(vendor._id)} className="border-2 border-gray-900 text-red-900 px-3 py-1 rounded-lg flex items-center gap-1 
                   hover:border-gray-300 hover:text-white hover:bg-gray-400 transition-all">
                        <Trash2 className="w-4 h-4" /> 
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">No vendors found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredVendors.length > itemsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <button onClick={() => setCurrentPage(prev => Math.max(prev-1, 1))} disabled={currentPage===1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev+1, totalPages))} disabled={currentPage===totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        )}

        {/* Modal for Create/Update */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{selectedVendor ? 'Update Vendor' : 'Add Vendor'}</h3>
                <button onClick={() => setModalOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <form className="space-y-3" onSubmit={handleSubmit(handleFormSubmit)}>
                {['name','company','email','phone','address'].map(field => (
                  <div key={field} className="flex flex-col">
                    <input
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      {...register(field)}
                      className="p-2 border rounded-lg"
                    />
                    {errors[field] && <span className="text-red-500 text-sm">{errors[field].message}</span>}
                  </div>
                ))}
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{selectedVendor ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VendorManager;
