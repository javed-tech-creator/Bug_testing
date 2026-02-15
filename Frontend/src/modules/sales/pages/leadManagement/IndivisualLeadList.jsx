import React, { useState } from 'react'
import Table from '../../../../components/Table'
import { useFetchLeadsQuery, useFetchMyLeadsQuery } from '../../../../api/sales/lead.api'
import Loader from '../../../../components/Loader'
import { useNavigate } from 'react-router-dom'
import { Edit, Eye, SquarePen } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import { useSelector } from 'react-redux'
import RequirementFilesModal from '../../components/RequirementFilesModal'
function IndivisualLeadList() {
 const [page, setPage] = useState(1);
 const [limit, setLimit] = useState(10);
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {}
 const params =
   user?.designation?.title == ("Sales Executive" || "sales executive")
     ? `leadBy=${user._id}&assignTo=${user._id}&page=${page}&limit=${limit}&match=or`
     : `leadBy=${user._id}&page=${page}&limit=${limit}`;
     
 const { data, isLoading, error } = useFetchLeadsQuery({params})
 const leads = data?.data?.leads || [];
  const navigate = useNavigate()
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [fileLead, setFileLead] = useState(null);

 const handleUpdate=(item)=>{
        navigate(`/sales/leads/add`,{state:{leadData:item}});
  } 


  const columnConfig = {
      actions: {
      label: "Actions",
      render: (val, row) => (
        <div className="flex justify-center gap-3">
        <button
          onClick={() => handleUpdate(row)}
          className=" tracking-wide cursor-pointer rounded flex items-center justify-center text-orange-500 hover:text-orange-600 transition-all"
          title="Accept"
        >
          <Edit className="" size={20}/>
        </button>
    </div>
    
      ),
    },
       createdAt: {
        label: "Created Date",
        render: (val) => new Date(val).toLocaleString("en-IN"),
      },
      leadStatus: { label: "Status" },
      clientName: { label: "Concern Person Name" },
      phone: { label: "Phone" },
      email: { label: "Email" },
      leadType: { label: "Lead Type" },
      leadSource: { label: "Lead Source" },
      requirement: {
      label: "Requirement",
      render: (val, row) => (
        <div className="flex items-center justify-center gap-2">
          {/* Requirement text (optional truncate) */}
          <span className="truncate max-w-[180px] text-sm text-gray-700">
            {val || "—"}
          </span>
          {row.requirementFiles?.length > 0 && (
            <button
              onClick={() => {
                setFileLead(row);
                setFileModalOpen(true);
              }}
              title="View Requirement Files"
              className="text-orange-500 hover:text-orange-600 cursor-pointer"
            >
              <Eye size={16} />
            </button>
          )}
        </div>
      ),
    },
      expectedBusiness: { label: "Expected Business" },
      address: { label: "Address" },
      pincode: { label: "Pin Code" },
     "assignTo[0].userId.name": { label: "Assigned Excutive 1" },
  "assignTo[1].userId.name": { label: "Assigned Excutive 2" },
    }

return (
  <div className=''>
    <PageHeader title='My Leads'/>
      <RequirementFilesModal
  open={fileModalOpen}
  onClose={() => setFileModalOpen(false)}
  lead={fileLead}
/>
    <div className=''>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 w-full mt-10 text-center">Error loading leads.</p>
      ) : (
        <Table
          data={leads}
          columnConfig={columnConfig}
          handleUpdate={handleUpdate}
        // handleDelete={handleDelete}
        />
      )}
    </div>
  </div>
)
}

export default IndivisualLeadList
