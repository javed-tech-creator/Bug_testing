import React from 'react'
import Table from '../../../../components/Table'
import { useFetchPendingLeadsQuery } from '../../../../api/sales/lead.api'
import Loader from '../../../../components/Loader'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import { MdAssignment } from 'react-icons/md'
import { FaUserPlus } from 'react-icons/fa'
function PendingLead() {
  const { data, isLoading, error } = useFetchPendingLeadsQuery()
const leads = data?.data?.result
const navigate = useNavigate()
  const handleAssign = (item) => {
    const id = item._id
navigate(`/sales/leads/assign/${id}`)
    console.log("Update clicked", item);
  }


const columnConfig = {
    actions: {
      label: "Actions",
      render: (val, row) => (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleAssign(row)}
            className="text-orange-500 cursor-pointer"
            title="Assign"
          >
            <UserPlus size={24} />
          </button>
        </div>
      ),
    },
     leadStatus: { label: "Status" },
    concernPersonName: { label: "Concern Person Name" },
    phone: { label: "Phone" },
    email: { label: "Email" },
    leadType: { label: "Lead Type" },
    leadSource: { label: "Lead Source" },
    requirement: { label: "Requirement" },
    address: { label: "Address" },
    pincode: { label: "Pin Code" },
    createdAt: {
      label: "Created Date",
      render: (val) => new Date(val).toLocaleDateString("en-IN"),
    },
   
    
  }

  return (
    <div className=''>
     <PageHeader title='Pending Leads'/>

      <div className=''>
      {isLoading ? (
        <Loader/>
      ) : error ? (
        <p className="text-red-500 w-full mt-10 text-center">Error Loading Pending Leads.</p>
      ) : (
        <Table
          data={leads}
          columnConfig={columnConfig}
          handleUpdate={handleAssign}
        //   handleDelete={handleDelete}
        />
      )}
      </div>
    </div>
  )
}

export default PendingLead
