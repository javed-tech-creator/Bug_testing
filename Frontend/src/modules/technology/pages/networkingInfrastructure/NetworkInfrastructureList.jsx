import PageHeader from '@/components/PageHeader';
import React, { useState } from 'react'
import TechnologyTable from '../../components/TechnologyTable';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDeleteDeviceMutation, useGetDevicesQuery } from '@/api/technology/networkInfrastructure.api';
import ConfirmDialog from '@/components/ConfirmationToastPopUp';

const NetworkInfrastructureList = () => {
    const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const { data:devices, isLoading,  isFetching:getSoftwareFetching} = useGetDevicesQuery({ page: currentPage, limit: itemsPerPage });

const [deleteDevice, { isLoading: deleteLoading }] = useDeleteDeviceMutation();



// columnConfig.js
 const columnConfig = [
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
  { label: "Device ID", key: "deviceId" },
  { label: "Device Type", key: "deviceType" },
  { label: "IP Address", key: "ipAddress" },
  { label: "MAC Address", key: "macAddress" },
  { label: "Configuration", key: "configurationDetails" },
  { label: "Installed Location", key: "installedLocation" },
  { label: "Vendor / AMC", key: "vendor" },
  { label: "Maintenance History", key: "maintenanceHistory" },
  {
  label: "Next Service Due",
  key: "nextServiceDue",
  render: (row) => {
    if (!row.nextServiceDue) return "-";

    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = new Date(row.nextServiceDue)
      .toLocaleDateString("en-GB", options)
      .replace(/(\d{2} \w{3}) (\d{4})/, "$1, $2");

    return (
      <span className="text-sm font-medium text-blue-600">
        {formattedDate}
      </span>
    );
  },
},
 
];

const navigate = useNavigate();
  const handleEdit = (row) => {
  console.log("Edit:", row);
  // modal open ya navigate karo
  navigate('/tech/network-infrastructure/add',{
    state:{
      deviceData:row,
    }
  })

};

const handleDelete = (row) => {
  setDeleteTarget(row); // kis asset ko delete karna hai
  setOpenDialog(true);  // confirm dialog open karo
};

const confirmDelete = async () => {
  if (!deleteTarget?._id) return;

  try {
    const result = await deleteDevice(deleteTarget._id).unwrap();
    if (result?.success) {
      toast.success("Asset deleted successfully!");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error(error?.data?.message || "Failed to delete asset.");
  } finally {
    setOpenDialog(false);
    setDeleteTarget(null);
  }
};



  return (
   <div className="">
      <PageHeader
        title="Networking & Infrastructure"  btnTitle="Add"  path="/tech/network-infrastructure/add"
      />

      <div className="mt-4">
        <TechnologyTable
          columnArray={columnConfig}
          tableData={devices?.data}
          total={devices?.total}
          isLoading={isLoading || getSoftwareFetching}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={(num)=>setCurrentPage(num)}
        />
      </div>

      {/* delete  */}
      <ConfirmDialog
        open={openDialog}
        title="Confirm Delete"
        message={`Are you sure you want to delete this Newtwork-Infrastructure?`}
        onConfirm={confirmDelete}
        isLoading={deleteLoading}
        onCancel={() => setOpenDialog(false)}
      />
      
      </div>
  )
}

export default NetworkInfrastructureList