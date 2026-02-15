import React from 'react'
import Table from '../../../../components/Table'
import Loader from '../../../../components/Loader'
import { SquarePen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../store/AuthContext'
import PageHeader from '../../../../components/PageHeader'
import { MdAssignment } from 'react-icons/md'

function TotalProject() {
  const {userData} = useAuth()
  const id = userData?.id
const isLoading = false;
  const leads = data?.data?.result || [];
 const navigate = useNavigate()
const handleAssign = (item) => {
navigate(`/recce/project/assign/${item._id}`)
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
               <MdAssignment size={24} />
             </button>
           </div>
         ),
       },
  timestamp: {
    label: "Client Briefing time",
    render: (val) => new Date(val).toLocaleString("en-IN"),
  },
   impanelledBy: { label: "Impanelled By" },
   salesAssistant: { label: "Sales Person" },
    projectCode: { label: "Project Code" },
     salesType: { label: "Sales Type" },
projectName: { label: "Project Name" },
 projectDetail: { label: "Project Detail" },
  clientName: { label: "Concern Person Name" },
  concernPersonDesignation: { label: "Concern Person Designation" },
  companyName: { label: "Company / Individual Name" },
  phone: { label: "Contact Number" },
  altPhone: { label: "Alternate Number" },
  fullAddress: { label: "Full Address" },
 
  locationLink: {
    label: "Location Link",
    render: (val) =>
      val ? (
        <a href={val} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          View Location
        </a>
      ) : (
        "-"
      ),
  },
 
 
  
  
 
 
};


return (
  <div className=''>
    <PageHeader title='Projects Sheet'/>

    <div className=''>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 w-full mt-10 text-center">Error loading Sales.</p>
      ) : (
        <Table
          data={leads}
          columnConfig={columnConfig}
        />
      )}
    </div>
  </div>
)
}

export default TotalProject
