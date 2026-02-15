import React from 'react'
import Table from '../../../../components/Table'
import { useFetchLeadsQuery } from '../../../../api/sales/lead.api'
import Loader from '../../../../components/Loader'
import { useNavigate } from 'react-router-dom'
import isLogin from '../../../../utils/useIsLogin'
import { useAuth } from '../../../../store/AuthContext'
import { SquarePen } from 'lucide-react'
import PageHeader from '../../../../components/PageHeader'
function RecceForApproval() {
  const { data, isLoading, error } = useFetchLeadsQuery()
const leads = data?.data?.result


const id = isLogin()
const navigate =  useNavigate()
const handleUpdate = (item) => {
  const id = item?._id 
  navigate(`/sales/leads/sheet/update/${id}`)
}

const handleDelete = (item) => {
  console.log("Delete clicked", item);
}
const {userData} = useAuth()

let acceptedLeads = []
if(userData?.role == 'SaleEmployee'){
  acceptedLeads = leads?.filter((lead) => {
  const acceptedByFirstEmployee = lead.saleEmployeeId === id;
  const relevantAcceptance = lead.employeeleadsAccept?.[acceptedByFirstEmployee ? 0 : 1];
  return relevantAcceptance?.status === true;
}) || [];
}
else{
  acceptedLeads = leads
}



const columnConfig = {
    actions: {
      label: "Actions",
      render: (val, row) => (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleUpdate(row)}
            className="text-orange-500  cursor-pointer"
            title="Assign"
          >
           <SquarePen size={20}/>
          </button>
        </div>
      ),
    },
     createdAt: {
      label: "Created Date",
      render: (val) => new Date(val).toLocaleString("en-IN"),
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
   
  }

  return (
    <div className=''>
      <PageHeader title='Lead Management Sheet'/>
      <div className=''>
      {isLoading ? (
        <Loader/>
      ) : error ? (
        <p className="text-red-500 w-full mt-10 text-center">Error loading leads.</p>
      ) : (
        <Table
          data={acceptedLeads}
          columnConfig={columnConfig}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
        />
      )}
      </div>
    </div>
  )
}

export default RecceForApproval
