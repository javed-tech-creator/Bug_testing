import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetchLeadsQuery } from '../../../../../api/sales/lead.api'
import PageHeader from '../../../components/PageHeader'
import Loader from '../../../../../components/Loader'
import Table from '../../../../../components/Table'
import { useSelector } from 'react-redux'
import { SquarePen } from 'lucide-react'
function MyLead() {

  const {id} = useParams()
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate();
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};

  const isSalesExecutive =
    user?.designation?.title?.toLowerCase() === "sales executive";
  const params = isSalesExecutive
    ? `leadBy=${user._id}&assignTo=${user._id}&page=${page}&limit=${limit}&match=or`
    : `page=${page}&limit=${limit}`;
  const { data, isLoading, error } = useFetchLeadsQuery({ params });

  const leads = data?.data?.leads || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 1;

const handleUpdate = (item) => {
  const id = item?._id 
  navigate(`/sales/leads/sheet/update/${id}`)
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
      {/* <PageHeader title='Lead Management Sheet'/> */}
      <div className=''>
      {isLoading ? (
        <Loader/>
      ) : error ? (
        <p className="text-red-500 w-full mt-10 text-center">Error loading leads.</p>
      ) : (
        <Table
          data={leads}
          columnConfig={columnConfig}
          handleUpdate={handleUpdate}
        />
      )}
      </div>
    </div>
  )
}

export default MyLead
