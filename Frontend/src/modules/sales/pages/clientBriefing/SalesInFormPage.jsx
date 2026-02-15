import React from 'react'
import Table from '../../../../components/Table'
import { useFetchLeadsByEmployeeIdQuery, useFetchLeadsQuery } from '../../../../api/sales/lead.api'
import Loader from '../../../../components/Loader'
import { useNavigate } from 'react-router-dom'
import { button } from '@material-tailwind/react'
import { SquarePen } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import { useAuth } from '../../../../store/AuthContext'
import isLogin from '../../../../utils/useIsLogin'
import { useSelector } from 'react-redux'

function SalesInFormPage() {
   const res = useSelector((state) => state.auth.userData);
 const user = res?.user || {}
  const { data, isLoading, error } = useFetchLeadsByEmployeeIdQuery({id:user._id})
  const leads = data?.data?.result
  const navigate = useNavigate()
  const handleUpdate = (item) => {
    console.log("Update clicked", item);
  }

  const handleDelete = (item) => {
    console.log("Delete clicked", item);
  }

  const handleAssign = (item) => {
    const id = item._id
    navigate(`/sales/leads/assign/${id}`)
    console.log("Update clicked", item);
  }

  const handleReAssign=(item)=>{
      const id=item._id
      navigate(`/sales/leads/assign/${id}`)
      console.log("Update re Assign",item)
  }

  const handleEdit=(item)=>{
    const id = item._id
        navigate(`/sales/leads/client-briefing/${id}`);
  }
const id = user?._id
  let acceptedLeads = []
  if(user?.designation == 'SaleEmployee' || user?.designation == 'sales excutive'){
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
        onClick={() => handleEdit(row)}
        className="p-1 text-orange-500 rounded cursor-pointer"
        title="Edit"
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
    <PageHeader title='Total Leads'/>

    <div className=''>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 w-full mt-10 text-center">Error loading leads.</p>
      ) : (
        <Table
          data={acceptedLeads}
          columnConfig={columnConfig}
          handleUpdate={handleUpdate}
        // handleDelete={handleDelete}
        />
      )}
    </div>
  </div>
)
}

export default SalesInFormPage
