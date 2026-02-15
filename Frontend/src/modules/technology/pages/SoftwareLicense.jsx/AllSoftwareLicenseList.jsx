import PageHeader from '@/components/PageHeader'
import Table from '@/components/Table'
import React, { useState } from 'react'
import { FaEdit, FaTrash, FaUserEdit, FaUserPlus } from 'react-icons/fa';
import TechnologyTable from '../../components/TechnologyTable';
import { useNavigate } from 'react-router-dom';
import AssignModal from '../../components/DynamicModalForm';
import { useAssignLicenseMutation, useDeleteLicenseMutation, useGetLicensesQuery } from '@/api/technology/licenseSoftware.api';
import ConfirmDialog from '@/components/ConfirmationToastPopUp';
import { toast } from 'react-toastify';
import { ReassignmentsModal } from '../../components/asset/AssignedModal';

const AllSoftwareLicenseList = () => {
    const [openReassignModal, setOpenReassignModal] = useState(false);
    const [selectedReassignments, setSelectedReassignments] = useState({});
  const [isAssignOpen, setAssignOpen] = useState(false);
  const [isReassignOpen, setReassignOpen] = useState(false);
  const [selectedSoftware, setSelectedSoftware] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;


    //  call query with pagination
  const { data:licenseSoftware, isLoading:licenseLoading } = useGetLicensesQuery({
    page: currentPage,
    limit: itemsPerPage,
  });
const [deleteLicense, { isLoading: deleteLoading }] = useDeleteLicenseMutation();
  const [assignLicense, { isLoading:assignLoading }] = useAssignLicenseMutation();


  const handleDelete = (row) => {
    setDeleteTarget(row); // kis asset ko delete karna hai
    setOpenDialog(true);  // confirm dialog open karo
  };
  
  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
  
    try {
      const result = await deleteLicense(deleteTarget._id).unwrap();
      if (result?.success) {
        toast.success("License or Software deleted successfully!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error?.data?.message || "Failed to delete License or Software.");
    } finally {
      setOpenDialog(false);
      setDeleteTarget(null);
    }
  };

    const handleOpenReassignments = (row) => {
    setSelectedReassignments(row || {});
    setOpenReassignModal(true);
  };
  const handleCloseReassignments = () => {
    setOpenReassignModal(false);
    setSelectedReassignments({});
  };
      // Dummy dropdowns
  const departments = [
    { _id: "d1", name: "IT" },
    { _id: "d2", name: "Finance" },
  ];

  const roles = [
    { _id: "r1", name: "Manager", departmentId: "d1" },
    { _id: "r2", name: "Technician", departmentId: "d1" },
    { _id: "r3", name: "Admin", departmentId: "d2" },
  ];

  const employees = [
    { _id: "e1", name: "John Doe", roleId: "r1" },
    { _id: "e2", name: "Jane Smith", roleId: "r2" },
    { _id: "e3", name: "Suresh Kumar", roleId: "r3" },
  ];
  const [loading, setLoading] = useState(false);
const navigate =useNavigate();
//  const licenseData = [
//   {
//     "licenseId": "CRD-2025-AX98",
//     "softwareName": "CorelDRAW",
//     "versionType": "Single License",
//     "validityStart": "2024-01-15",
//     "validityEnd": "2026-01-14",
//     "seats": 1,
//       "department": "Infra",
//         "assigned_to": "suresh kumar",  
//           "renewalAlert": "30 days before expiry",
//     "vendorDetails": "ABC Software Solutions"
//   },
//   {
//     "licenseId": "ADB-CC-5698",
//     "softwareName": "Adobe Creative Cloud",
//     "versionType": "Volume License",
//     "validityStart": "2023-05-10",
//     "validityEnd": "2025-05-09",
//     "seats": 10,
//   "department": "IT",
//       "assigned_to": "John Doe",    "renewalAlert": "45 days before expiry",
//     "vendorDetails": "Adobe Reseller Pvt Ltd"
//   },
// ]


const columnConfig = {
actions: {
  label: "Actions",
  render: (row) => {
    const isAssigned = row.assignedTo && row.assignedTo.employeeId;

    return (
      <div className="flex items-center gap-2">
        {/* Edit */}
        <button
          onClick={() => Edit(row)}
          className="p-2 rounded-full cursor-pointer bg-orange-100 text-orange-600 hover:bg-orange-200 shadow-sm transition-all duration-200"
          title="Edit software"
        >
          <FaEdit className="w-3.5 h-3.5" />
        </button>

        {/* Conditional Assign/Reassign */}
        {!isAssigned ? (
          <button
            onClick={() => handleAssign(row)}
            className="p-2 rounded-full cursor-pointer bg-green-100 text-green-600 hover:bg-green-200 shadow-sm transition-all duration-200"
            title="Assign software"
          >
            <FaUserPlus className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => handleReassign(row)}
            className="p-2 rounded-full cursor-pointer bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-sm transition-all duration-200"
            title="Reassign software"
          >
            <FaUserEdit className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Delete */}
        <button
          onClick={() => handleDelete(row)}
          className="p-2 rounded-full cursor-pointer bg-red-100 text-red-600 hover:bg-red-200 shadow-sm transition-all duration-200"
          title="Delete software"
        >
          <FaTrash className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  },
},

  licenseId: { label: "License ID / Key" },
  softwareName: { label: "Software Name" },
  versionType: { label: "Version / Type" },
   reassignments: {
      label: "Assigned",
      render: (row) => (
        <button
          onClick={() => handleOpenReassignments(row)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group cursor-pointer"
          title="Re-Assigned List"
        >
          <span>View</span>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-black/10 text-blue-600 group-hover:bg-black group-hover:text-white transition-colors">
            ?
          </span>
        </button>
      ),
    },
Validity:{
  label: "Validity",
  render: (row) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const start = new Date(row.validityStart).toLocaleDateString("en-GB", options);
    const end = new Date(row.validityEnd).toLocaleDateString("en-GB", options);
    return `${start} - ${end}`;
  },
},

  expireIn: {
      label: "Expire In",

     render: (row) => {
  if (!row.expireIn) return null; // safeguard

  // Check if it's expired or has days left
  const isExpired = row.expireIn.toLowerCase() === "expired";

  return (
    <span
      style={{
        color: isExpired ? "red" : "green",
        fontWeight: 600,
      }}
    >
      {row.expireIn}
    </span>
  );
},

    },


  seats: { label: "No. of Users" },

  renewalAlert: {
    label: "Renewal Alerts",
    // render: (row) => (row.renewalAlert ? row.renewalAlert : "—"), //  fix 
  },

  vendorDetails: { label: "Vendor Details" },
};

// Build columnArray correctly
const columnArray = Object.entries(columnConfig).map(([key, value]) => ({
  key,   // <-- ye zaroori hai
  ...value,
}));

  const handleAssign = (row) => {
    setSelectedSoftware(row);
    setAssignOpen(true);
  };

  const handleReassign = (row) => {
    setSelectedSoftware(row);
    setReassignOpen(true);
  };

  const handleAssignSubmit = async (formData,type) => {
    console.log("formdata is",formData);
    
    try {
      if (!selectedSoftware?._id) return;
  
      const result = await assignLicense({
        id: selectedSoftware._id,
        ...formData,   // department, role, employee
      }).unwrap();
  
       if (result?.success) {
        if (type === "assign") {
          toast.success("Software assigned successfully!");
        } else if (type === "reassign") {
          toast.success("Software reassigned successfully!");
        }
  
        setAssignOpen(false);
        setReassignOpen(false);
      }
    } catch (error) {
      console.error("Software error:", error);
      toast.error(error?.data?.message || "Failed to process Software.");
    }
  };

  const Edit = (row) => {
  console.log("Edit:", row);
  // modal open ya navigate karo
  navigate('/tech/software-license/add',{
    state:{
      licenseData:row,
    }
  })

};


  return (
   
<>
 <div className="">
      <PageHeader title="All Software & License" btnTitle="Add" path="/tech/software-license/add"/>

      <div className="mt-4">
        {/* <Table onEdit={handleEdit} onDelete={handleDelete} data={licenseData} columnConfig={columnConfig} /> */}
        <TechnologyTable
          columnArray = {columnArray}
          tableData = {licenseSoftware?.data}
          total={licenseSoftware?.total}
          isLoading={licenseLoading}
          itemsPerPage={itemsPerPage}
         currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        />
      </div>
    </div>

      <AssignModal
  isOpen={isAssignOpen}
  closeModal={() => setAssignOpen(false)}
  type="assign"
  departments={departments}
  roles={roles}
  isLoading={assignLoading}
  employees={employees}
  onSubmit={handleAssignSubmit}
/>

<AssignModal
  isOpen={isReassignOpen}
  closeModal={() => setReassignOpen(false)}
  type="reassign"
  departments={departments}
  roles={roles}
    isLoading={assignLoading}
  employees={employees}
  onSubmit={handleAssignSubmit}
/>

{/* delete  */}
<ConfirmDialog
  open={openDialog}
  title="Confirm Delete"
  message={`Are you sure you want to delete this License or Software?`}
  onConfirm={confirmDelete}
  isLoading={deleteLoading}
  onCancel={() => setOpenDialog(false)}
/>

 {openReassignModal && (
        <ReassignmentsModal
          open={openReassignModal}
          onClose={handleCloseReassignments}
          data={selectedReassignments}
        />
      )}

    </>
      )
}

export default AllSoftwareLicenseList