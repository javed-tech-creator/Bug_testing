import React, { useState } from 'react'
import Table from '../../../../../components/Table'
import Loader from '../../../../../components/Loader'
import PageHeader from '../../../../../components/PageHeader'

function RaisedComplainList() {
  const [isLoading] = useState(false)
  const [error] = useState(false)

  const complainData = [
    {
      project: "64fe9123abc1234def567890",
      status: "pending",
      projectName: "Sunrise Towers",
      projectId: "PRJ-001",
      complaintType: "Electrical",
      subject: "Power outage in main hall",
      description: "There is no electricity in the main hall since morning.",
      priority: "High",
      file: "https://source.unsplash.com/random/800x600?electric",
      createdAt: "2025-08-06T09:23:00.000Z",
    },
    {
      project: "64fe9123abc1234def567891",
      status: "pending",
      projectName: "Blue Lagoon Apartments",
      projectId: "PRJ-002",
      complaintType: "Plumbing",
      subject: "Leaking faucet in washroom",
      description: "The faucet in the washroom is constantly leaking and wasting water.",
      priority: "Medium",
      file: "https://source.unsplash.com/random/800x600?plumbing",
      createdAt: "2025-08-06T10:00:00.000Z",
    },
    {
      project: "64fe9123abc1234def567892",
      status: "pending",
      projectName: "Tech Valley Tower",
      projectId: "PRJ-003",
      complaintType: "Internet",
      subject: "WiFi not working on 3rd floor",
      description: "The WiFi connection has been down for the entire 3rd floor.",
      priority: "High",
      file: "https://source.unsplash.com/random/800x600?wifi",
      createdAt: "2025-08-05T15:45:00.000Z",
    },
    {
      project: "64fe9123abc1234def567893",
      status: "resolved",
      projectName: "Elite Residency",
      projectId: "PRJ-004",
      complaintType: "Cleaning",
      subject: "Unclean lobby area",
      description: "The lobby has not been cleaned for 2 days. It needs urgent attention.",
      priority: "Low",
      file: "https://source.unsplash.com/random/800x600?cleaning",
      createdAt: "2025-08-04T08:30:00.000Z",
    },
 
  ]

  const handleResolved = (project) => {
    alert(`Marking project "${project.projectName}" as resolved...`)
  }

  const columnConfig = {
     actions: {
      label: "Actions",
      render: (val, project) => (
        <div className="flex justify-center gap-3">
          {project?.status === "pending" ? (
            <button
              onClick={() => handleResolved(project)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Mark Resolved
            </button>
          ) : (
            <span className="text-green-600 font-semibold capitalize">{project.status}</span>
          )}
        </div>
      ),
    },
    createdAt: {
      label: "Created At",
      render: (val) => new Date(val).toLocaleString("en-IN"),
    },
    priority: { label: "Priority" },
    projectName: { label: "Project Name" },
    projectId: { label: "Project ID" },
    complaintType: { label: "Complaint Type" },
    subject: { label: "Subject" },
    description: { label: "Description" },
    status: { label: "Status" },
    
    file: {
      label: "Image",
      render: (val) => (
        <a href={val} target="_blank" rel="noreferrer" className='text-blue-500 underline'>
          View File
        </a>
      ),
    },
   
  }

  return (
    <div className="">
      <PageHeader title="Pending Project to Assign" />
      <div className="">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500 w-full mt-10 text-center">Error Loading Pending Leads.</p>
        ) : (
          <Table data={complainData} columnConfig={columnConfig} />
        )}
      </div>
    </div>
  )
}

export default RaisedComplainList
