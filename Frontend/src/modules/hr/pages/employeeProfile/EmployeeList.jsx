import React from 'react'
import Table from '../../../../components/Table'
import { useGetAllEmployeeQuery } from '../../../../api/hr/employee.api'
import Loader from '../../../../components/Loader'
import { useNavigate } from 'react-router-dom'
import { Eye, SquarePen } from 'lucide-react'
import { MdAssignment } from "react-icons/md";
import PageHeader from '@/components/PageHeader'

function EmployeeList() {
  const { data, isLoading, error } = useGetAllEmployeeQuery()
  const employees = data?.data
  const navigate = useNavigate()

  const handleView = (item) => {
    navigate(`/hr/employee/profile/${item._id}`)
  }

  const handleEdit = (item) => {
    navigate(`/hr/employee/onboarding/${item._id}?step=1`)
  }

  // const handleAssign = (item) => {
  //   navigate(`/hr/employees/assign/${item._id}`)
  // }

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (val, row) => (
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleView(row)}
            className="text-blue-500 cursor-pointer"
            title="View"
          >
            <Eye size={20}/>
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="text-orange-500 cursor-pointer"
            title="Edit"
          >
            <SquarePen size={20}/>
          </button>
          {/* <button
            onClick={() => handleAssign(row)}
            className="text-green-500 cursor-pointer"
            title="Assign"
          >
            <MdAssignment size={22}/>
          </button> */}
        </div>
      ),
    },
    employeeId: { label: "Employee ID" },
    name: { label: "Name" },
    email: { label: "Email" },
    phone: { label: "Phone" },
    gender: { label: "Gender" },
    employeeType: { label: "Type" },
    status: { label: "Status" },
    joiningDate: {
      label: "Joining Date",
      render: (val) =>
        val ? new Date(val).toLocaleDateString("en-IN") : "-",
    },
  }

  return (
    <div className=''>
      <PageHeader title='Employee List'/>
      <div className=''>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500 w-full mt-10 text-center">Error loading employees.</p>
        ) : (
          <Table
            data={employees}
            columnConfig={columnConfig}
          />
        )}
      </div>
    </div>
  )
}

export default EmployeeList
