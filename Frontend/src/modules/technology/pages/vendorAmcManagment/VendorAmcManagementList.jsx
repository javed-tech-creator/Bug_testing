import React, { useState } from 'react'
import TechnologyTable from '../../components/TechnologyTable';
import PageHeader from '@/components/PageHeader';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDeleteVendorMutation, useGetVendorsQuery } from '@/api/technology/vendorAMCManagement.api';
import ConfirmDialog from '@/components/ConfirmationToastPopUp';
import { toast } from 'react-toastify';

const VendorAmcManagementList = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;


      //  Fetch vendors with pagination
  const { data: vendors, isLoading, isFetching } = useGetVendorsQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [deleteVendor, { isLoading: deleteLoading }] = useDeleteVendorMutation();
  

  const handleDelete = (row) => {
  setDeleteTarget(row); // kis asset ko delete karna hai
  setOpenDialog(true);  // confirm dialog open karo
};

const confirmDelete = async () => {
  if (!deleteTarget?._id) return;

  try {
    const result = await deleteVendor(deleteTarget._id).unwrap();
    if (result?.success) {
      toast.success("Vendor deleted successfully!");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error(error?.data?.message || "Failed to delete Vendor.");
  } finally {
    setOpenDialog(false);
    setDeleteTarget(null);
  }
};


const vendorColumnConfig = [
  
    {
    label: "Actions",
    render: (row) => (
       <div className="flex gap-2">
                <button
                         onClick={() => handleEdit(row)}
                         className="p-2 rounded-full cursor-pointer bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-sm transition-all duration-200"
                         title="Edit Asset"
                       >
                         <FaEdit className="w-3.5 h-3.5" />
                       </button>
              {/* Delete */}
                    <button
                      onClick={() => handleDelete(row)}
                      className="p-2 rounded-full cursor-pointer bg-red-100 text-red-600 hover:bg-red-200 shadow-sm transition-all duration-200"
                      title="Delete Asset"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
           </div>
    ),
  },
    { label: "Vendor ID", key: "vendorId" },
  { label: "Company Name", key: "companyName" },
  { label: "Services Provided", key: "services" },
  {
    label: "Contact Person",
    key: "contactPerson",
    render: (row) => (
      <div>
        <div>{row.contactName}</div>
        <div className="text-xs text-gray-500">{row.contactPhone}</div>
        <div className="text-xs text-gray-500">{row.contactEmail}</div>
      </div>
    ),
  },
{
  label: "Contract Period",
  key: "contractStart",
  render: (row) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const start = new Date(row.contractStart).toLocaleDateString("en-GB", options);
    const end = new Date(row.contractEnd).toLocaleDateString("en-GB", options);
    return `${start} - ${end}`;
  },
},

  { label: "Renewal Terms & Cost", key: "renewalTerms" },
  { label: "SLA Commitments", key: "slaCommitments" },
  { label: "Service Logs / History", key: "serviceLogs" },

];

const navigate = useNavigate();
  const handleEdit = (row) => {
  console.log("Edit:", row);
  // modal open ya navigate karo
  navigate('/tech/vendor-amc-management/add',{
    state:{
      vendorData:row,
    }
  })

};

  return (
    <div className="">
      <PageHeader title="Vendor & AMC Management" btnTitle="Add" path="/tech/vendor-amc-management/add"/>

      <div className="mt-4">
        {/* <Table onEdit={handleEdit} onDelete={handleDelete} data={licenseData} columnConfig={columnConfig} /> */}
        <TechnologyTable
          columnArray = {vendorColumnConfig}
          tableData = {vendors?.data}
          total={vendors?.total}
          isLoading={isLoading || isFetching}
          itemsPerPage={itemsPerPage}
         currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        />
      </div>

        {/* delete  */}
            <ConfirmDialog
              open={openDialog}
              title="Confirm Delete"
              message={`Are you sure you want to delete this Vendor ?`}
              onConfirm={confirmDelete}
              isLoading={deleteLoading}
              onCancel={() => setOpenDialog(false)}
            />
    </div>
  )
}

export default VendorAmcManagementList