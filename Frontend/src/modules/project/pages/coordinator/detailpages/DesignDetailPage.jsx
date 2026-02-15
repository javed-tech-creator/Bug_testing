import React, { useState } from "react";
import DesignsHeader from "../../../../design/components/designs/DesignHeader";
import { InfoField } from "../../../../design/components/assign-view-page/InfoField";
import { RenderLevel } from "../../../../design/components/assign-view-page/EnvironmentalConditions";
import { Download, Eye } from "lucide-react";
import {
  Dimension,
  Input,
  Select,
} from "../../../../design/components/assign-view-page/ProductRequirementsDetailed";
import {
  MediaCard,
  VideoCard,
} from "../../../../design/components/assign-view-page/UploadedMediaSection";
import {
  LabelBlock,
  YesNo,
} from "../../../../design/components/assign-view-page/InstallationDetailsForm";
import ClientDiscussionModal from "../../../../quotation/components/ClientDiscussionModal";
import { useLocation, useParams } from "react-router-dom";
const clientDiscussionMockData = [
  {
    dateTime: "11/12/25 10:00 AM",
    department: "Sales Dept.",
    repName: "Rahul",
    repDesignation: "Sales Executive",
    clientRepName: "Aman",
    clientDesignation: "Founder",
    discussion:
      "Client requested a revision on the main banner size. Agreed to updated dimensions of 12x4ft.",
    remarks: "Urgent priority.",
  },
  {
    dateTime: "12/12/25 02:30 PM",
    department: "Design Dept.",
    repName: "Ajay",
    repDesignation: "Sr. Designer",
    clientRepName: "Javed",
    clientDesignation: "Manager",
    discussion:
      "Showcased 3 variations of the logo. Client approved Variation B with minor color tweaks.",
    remarks: "Final files needed by Friday.",
  },
];

const DesignDetailPage = () => {
  const { id, type } = useParams();
  const [formData, setFormData] = useState({
    status: "",
    remark: "",
    id, //  params se set
  });
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientModalData, setClientModalData] = useState([]);
  const handleOpenClientLog = () => {
    setClientModalData(clientDiscussionMockData);
    setIsClientModalOpen(true);
  };
  const location = useLocation();

  const title = location.state?.title;
  const page = location.state?.page;
  console.log("page,type", page, title, type);

  const clientInfo = {
    basicInfo: [
      { label: "Client Code", value: "CL-2981" },
      { label: "Client Name (as per Govt ID)", value: "Abc Singh" },
      { label: "Client Designation", value: "Manager" },
      { label: "Company Name (Optional)", value: "Abc Pvt Ltd" },
      { label: "Mobile Number", value: "+91 98241 11289" },
      { label: "WhatsApp Number", value: "+91 98241 11289" },
      { label: "Alternate Number", value: "+91 75688 44120" },
      { label: "Email ID (Official)", value: "shrmedical@gmail.com" },
      { label: "Sales Executive", value: "Amit Verma" },
      { label: "Lead", value: "Amit Verma" },
      { label: "Deal", value: "Abc" },
      { label: "Relationship", value: "Xyz" },
    ],

    contactPerson: [
      { label: "Contact Person", value: "Mr. Rohan Sharma" },
      { label: "Contact Person Designation", value: "HR" },
      { label: "Contact Number", value: "+91 9876543210" },
      { label: "Alternate Number", value: "+91 9876543210" },
      { label: "Email", value: "abc.98@gmail.com" },
    ],
  };
  const projectInfo = [
    { label: "Project Name", value: "Main Signage Branding" },
    { label: "Project Code", value: "PR-87432" },
    { label: "Assigned Date", value: "13 Feb 2025 / 10:00AM" },
    { label: "Final Recce Confirmation", value: "15 Feb 2025 / 10:00AM" },
    { label: "Accepted Date", value: "14 Feb 2025 / 10:00AM" },
  ];
  const recceRemark = "Visit store between 3 PM – 6 PM. Client is available";

  const environmentalData = {
    sunlight: "High",
    rain: "High",
    wind: "High",
    ambientLight: "High",
    signageDirection: "North-East",
    compassImage: "North-East.jpg",
    environmentalNode: "North-East",
  };

  const uploadedPhotos = [
    { id: 1, label: "Back Image", url: "https://picsum.photos/300/180?1" },
    { id: 2, label: "Inside Image", url: "https://picsum.photos/300/180?2" },
    { id: 3, label: "Front Image", url: "https://picsum.photos/300/180?3" },
    { id: 4, label: "Left Image", url: "https://picsum.photos/300/180?4" },
    { id: 5, label: "Right Image", url: "https://picsum.photos/300/180?5" },
    { id: 6, label: "Top Image", url: "https://picsum.photos/300/180?6" },
  ];

  const uploadedVideos = [
    {
      id: 1,
      label: "360° Walkaround Video",
      thumbnail: "https://picsum.photos/300/180?7",
    },
    {
      id: 2,
      label: "Front Video",
      thumbnail: "https://picsum.photos/300/180?8",
    },
    {
      id: 3,
      label: "Side Video",
      thumbnail: "https://picsum.photos/300/180?9",
    },
    {
      id: 4,
      label: "Right Video",
      thumbnail: "https://picsum.photos/300/180?10",
    },
    {
      id: 5,
      label: "Top Video",
      thumbnail: "https://picsum.photos/300/180?11",
    },
  ];

  const data = {
    surfaceType: "ACP Sheet",
    surfaceCondition: "Good",
    textureNotes: "Smooth surface suitable for acrylic fabrication",

    stability: "Mount",
    mountDescription: "Direct wall mount",

    civilWorkRequired: true,
    civilWorkDescription:
      "Electrical wire above signage area. Shop awning extends 1 ft outward",

    fabricationWorkNeeded: true,
    fabricationWorkDescription:
      "Electrical wire above signage area. Shop awning extends 1 ft outward",

    surroundingObstructions:
      "Electrical wire above signage area. Shop awning extends 1 ft outward",

    ladder: true,
    bamboo: true,
    ironMS: true,
    tableStool: true,
    otherNotes: "Use ladder for top height measurement",

    powerConnection: true,
    switchboardDistance: "5 ft",
    cableRouteNotes: "Route cable through right-side pillar area",
    safetyNotes: "Ensure cable insulation before installation",
    requirementFromClient: "Ensure cable insulation before installation",
    instructionToClient: "Ensure cable insulation before installation",
  };

  const designInstructions = [
    "Send “Recce In” message with GPS photo in DSS@Measurement Communication Group.",
    "Take wide-angle photo of placement area with surroundings.",
    "Measure height, width, depth, and spacing from surroundings.",
    "Note footfall direction, sunlight angle, and visibility obstructions.",
    "Ask about lighting preferences, mockup expectations, and size ideas.",
    "Mark the area where the design will appear and photograph it.",
  ];

  const recceData = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
    },
  ];

  const sections = [
    {
      title: "Client's Requirement",
      points: [
        "Design better Design",
        "Maintain similar color tone as billing software",
      ],
    },
    {
      title: "Client to Installation Instructions",
      points: [
        "Install board exactly above shutter",
        "Maintain similar color tone as billing software",
      ],
    },
    {
      title: "Client to Company Instructions",
      points: [
        "Install board exactly above shutter",
        "Maintain similar color tone as billing software",
      ],
    },
    {
      title: "Recce to Design",
      points: [
        "Design better Design",
        "Maintain similar color tone as billing software",
      ],
    },
    {
      title: "Recce to Installation",
      points: [
        "Design better Design",
        "Maintain similar color tone as billing software",
      ],
    },
    {
      title: "Recce to Company",
      points: [
        "Design better Design",
        "Maintain similar color tone as billing software",
      ],
    },
    {
      title: "Other Remark",
      points: [
        "Design better Design",
        "Maintain similar color tone as billing software",
      ],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="">
      <DesignsHeader
        title={title}
        showDateFilter={false}
        showPriorityFilter={false}
        showDesignId={true}
        showDeadline={true}
        showRecievingDate={true}
        showDiscussionBtn={true}
        onDiscussionClick={handleOpenClientLog}
      />
      <ClientDiscussionModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        data={clientModalData}
      />

      {/* LEFT SECTION */}
      <div className="space-y-4">
        {/* 1.... */}
        <div className=" border rounded-sm shadow-sm">
          {/* HEADER */}
          <div className="px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Basic Client Information</h2>
          </div>

          {/* CONTENT */}
          <div className="p-4 space-y-6">
            {/* BASIC INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {clientInfo.basicInfo.map((item, index) => (
                <InfoField key={index} label={item.label} value={item.value} />
              ))}
            </div>

            {/* CONTACT PERSON SECTION */}
            <div>
              <h3 className="text-lg font-semibold mb-3 pb-3 border-b-2">
                Contact Person Details (On Site)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {clientInfo.contactPerson.map((item, index) => (
                  <InfoField
                    key={index}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2.... */}
        <div className=" border rounded-sm shadow-sm">
          {/* HEADER */}
          <div className="px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Project Information</h2>
          </div>

          {/* CONTENT */}
          <div className="p-4 space-y-4">
            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projectInfo.map((item, index) => (
                <InfoField key={index} label={item.label} value={item.value} />
              ))}
            </div>

            {/* REMARK */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Recce Notes / Remark
              </p>
              <div className="bg-gray-50 border rounded-sm px-3 py-3 text-sm text-gray-700">
                {recceRemark}
              </div>
            </div>
          </div>
        </div>

        {/* 3.... */}
        <div className=" border rounded-sm shadow-sm">
          {/* HEADER */}

          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Environmental Conditions</h2>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <RenderLevel
                label="Sunlight Exposure"
                selected={environmentalData.sunlight}
              />
              <RenderLevel
                label="Rain Exposure"
                selected={environmentalData.rain}
              />
              <RenderLevel
                label="Wind Exposure"
                selected={environmentalData.wind}
              />
              <RenderLevel
                label="Ambient Light"
                selected={environmentalData.ambientLight}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoField
                label="Signage Directions"
                value={environmentalData.signageDirection}
              />
              <InfoField
                label="Upload Compass Screenshot"
                value={environmentalData.compassImage}
              />
            </div>

            <InfoField
              label="Environmental Node"
              value={environmentalData.environmentalNode}
            />
          </div>
        </div>

        {/* 4.... */}
        <div className=" border rounded-sm shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">
              Product Requirements (Detailed)
            </h2>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-2">
              {/* Client Requirements */}
              <div>
                <label className="font-medium block mb-1">
                  Client Requirements:
                </label>
                <textarea
                  rows={3}
                  readOnly
                  className="w-full border rounded-sm p-2 bg-gray-50"
                  value="Client wants a bright LED board that is clearly visible from the main road. Store name should be bigger font, and the board should have a clean medical-theme color combination."
                />
              </div>

              {/* Client Expectations */}
              <div>
                <label className="font-medium block mb-1">
                  Client Expectations
                </label>
                <ul className="border rounded-sm p-3 bg-gray-50 list-disc list-inside space-y-1">
                  <li>Premium look</li>
                  <li>Night visibility must be strong</li>
                  <li>Avoid covering CCTV camera</li>
                  <li>Blue & white theme preferred</li>
                </ul>
              </div>
            </div>

            {/* Grid Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input label="Product Category" value="Indoor" />
              <Input label="Product Name" value="LED Frontlit Board" />
              <Input label="Product Code" value="P-0976" />
              <Select label="Visibility" value="One side" />
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Dimension label="Height / Vertical" value="4.5" unit="Feet" />
              <Dimension
                label="Width / length / Horizontal"
                value="12"
                unit="cm"
              />

              <Dimension label="Thickness / Depth" value="2" unit="Inch" />
              <Input label="Quantity" value="1" />

              <Select label="Light Option" value="Lit" />
              <Select label="Layer Count (In Letters)" value="Double" />
            </div>

            {/* Connection */}
            <div>
              <label className="font-medium block mb-1">
                Connection Point Details
              </label>
              <input
                readOnly
                value="Route cable through right-side pillar area."
                className="w-full border rounded-sm p-2 bg-gray-50"
              />
            </div>

            {/* Visibility Distance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dimension
                label="Visibility Distance"
                value="60–80"
                unit="Feet"
              />
              <Dimension
                label="Height from Road Level"
                value="Approx. 10"
                unit="Feet"
              />
            </div>
          </div>
        </div>

        {/* 5..... */}
        <div className=" border rounded-sm shadow-sm">
          {/* -------- Uploaded Photos -------- */}
          <div className="flex items-center justify-between px-4 py-3 border-t first:border-t-0 bg-gray-50 ">
            <h2 className="text-lg font-semibold">Uploaded Photos</h2>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
            {uploadedPhotos.map((photo) => (
              <MediaCard key={photo.id} image={photo.url} label={photo.label} />
            ))}
          </div>

          {/* -------- Uploaded Videos -------- */}
          <div className="flex items-center justify-between px-4 py-3 border-t first:border-t-0 bg-gray-50 ">
            <h2 className="text-lg font-semibold">Uploaded Videos</h2>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {uploadedVideos.map((video) => (
              <VideoCard
                key={video.id}
                image={video.thumbnail}
                label={video.label}
              />
            ))}
          </div>
        </div>

        {/* 6.... */}
        <div className=" border rounded text-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-t first:border-t-0 bg-gray-50 ">
            <h2 className="text-lg font-bold">Installation Details</h2>
          </div>

          {/* Surface Details */}
          <div className="p-4 grid grid-cols-5 gap-4">
            <LabelBlock label="Surface Type / Base" value={data.surfaceType} />
            <LabelBlock
              label="Surface Condition"
              value={data.surfaceCondition}
            />
          </div>

          <div className="px-4 pb-4">
            <LabelBlock label="Texture Notes" value={data.textureNotes} />
          </div>

          {/* Stability */}
          <h2 className="p-4 font-bold border-y-2">Signage Stability</h2>
          <div className="px-4 py-2 grid grid-cols-5 gap-4">
            <LabelBlock label="Stability" value={data.stability} />
            <LabelBlock
              label="Mount Description"
              value={data.mountDescription}
            />
          </div>

          {/* Civil Work */}
          <div className="grid grid-cols-5 mt-4 gap-4 px-4 pb-4">
            {/* 1 column */}
            <div className="col-span-1">
              <YesNo
                label="Civil Work Required"
                value={data.civilWorkRequired}
              />
            </div>

            {/* 3 columns */}
            <div className="col-span-4">
              <LabelBlock
                label="Civil Work Description"
                value={data.civilWorkDescription}
              />
            </div>
          </div>

          {/* Fabrication Work */}
          <div className="grid grid-cols-5 gap-4 px-4 pb-4">
            {/* 1 column */}
            <div className="col-span-1">
              <YesNo
                label="Fabrication Work Needed"
                value={data.fabricationWorkNeeded}
              />
            </div>

            {/* 3 columns */}
            <div className="col-span-4">
              <LabelBlock
                label="Fabrication Work Description"
                value={data.fabricationWorkDescription}
              />
            </div>
          </div>

          {/* Obstructions */}
          <h3 className="px-4 py-1.5 font-semibold border-b">
            Surrounding Obstructions
          </h3>
          <div className="px-4 pb-4">
            <LabelBlock
              label="Obstruction Details"
              value={data.surroundingObstructions}
            />
          </div>

          {/* Equipment */}
          <h2 className="p-4 font-bold border-y-2">Installation Equipment</h2>
          <div className="px-4 py-4 grid grid-cols-4 gap-4">
            <div>
              <YesNo label="Ladder" value={data.ladder} />
            </div>
            <div>
              <YesNo label="Bamboo (Paad)" value={data.bamboo} />
            </div>
            <div>
              <YesNo label="Iron MS / Paad" value={data.ironMS} />
            </div>
            <div>
              <YesNo label="Table-Stool" value={data.tableStool} />
            </div>
          </div>

          <div className="px-4 pb-4">
            <LabelBlock label="Other Notes" value={data.otherNotes} />
          </div>

          {/* Electrical */}
          <h3 className="px-4 py-1.5 font-semibold border-b">
            Electrical Requirements
          </h3>
          <div className="px-4 pb-4 grid grid-cols-5 gap-4 mt-2">
            <YesNo
              label="Power Connection Available"
              value={data.powerConnection}
            />

            <LabelBlock
              label="Switchboard Distance"
              value={data.switchboardDistance}
            />
          </div>

          <div className="px-4 pb-4 grid grid-cols-2 gap-2">
            <LabelBlock
              label="Cable Route Notes"
              value={data.cableRouteNotes}
            />

            <LabelBlock label="Safety Notes" value={data.safetyNotes} />

            <LabelBlock
              label="Requirement From Client"
              value={data.requirementFromClient}
            />

            <LabelBlock
              label="Instruction to Client"
              value={data.instructionToClient}
            />
          </div>
        </div>

        {/* 1.... */}
        <div className="bg-white border rounded-sm shadow-sm ">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Design Instructions
            </h2>
          </div>

          {/* Content */}
          <div className="p-4 ">
            <ul className="space-y-2 bg-blue-50 p-4 list-disc list-inside text-sm text-gray-700 border rounded-md">
              {designInstructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2.... */}
        <div className=" rounded-sm shadow-sm border">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Raw Recce</h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
            {recceData.map((item, index) => (
              <div
                key={index}
                className="border rounded-sm overflow-hidden bg-white "
              >
                <img
                  src={item.image}
                  alt="recce"
                  className="w-full h-48 object-cover p-2"
                />
                <div className="p-3 text-sm">
                  <p className="font-semibold text-gray-600">
                    Product Name: Image {item.key}
                  </p>
                  <p className="text-gray-600 mt-1">
                    <span className="font-semibold">Description:</span> Client
                    wants a bright LED board that is clearly visible from the
                    main road.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3.... */}
        <div className="rounded-sm shadow-sm border">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">Data From Client</h2>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 text-sm">
            {/* Content */}
            <div>
              <label className="font-medium">Content</label>
              <input
                value="ACP Solutions"
                readOnly
                className="mt-1 w-full border rounded-sm px-3 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="font-medium">Content File (Optional)</label>
              <button className="mt-1 w-full flex items-center justify-between border rounded-sm px-3 py-2 bg-gray-50 text-blue-600">
                {/* Left: File Name */}
                <span className="text-sm">contentfile.png </span>

                {/* Right: Icons */}
                <div className="flex items-center gap-3">
                  <Eye size={14} className="cursor-pointer" />
                  <Download size={14} className="cursor-pointer" />
                </div>
              </button>
            </div>

            {/* Logo */}
            <div>
              <label className="font-medium">Logo (CDR) (If Need)</label>
              <input
                value="Yes"
                readOnly
                className="mt-1 w-full border rounded-sm px-3 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="font-medium">Upload Logo (If Any)</label>
              <button className="mt-1 w-full flex items-center justify-between border rounded-sm px-3 py-2 bg-gray-50 text-blue-600">
                {/* Left: File Name */}
                <span className="text-sm">uploadlogo.png</span>

                {/* Right: Icons */}
                <div className="flex items-center gap-3">
                  <Eye size={14} className="cursor-pointer" />
                  <Download size={14} className="cursor-pointer" />
                </div>
              </button>
            </div>

            {/* Font */}
            <div>
              <label className="font-medium ">
                Font Type (If want specific)
              </label>
              <input
                value="Poppins"
                readOnly
                className="mt-1 w-full border rounded-sm px-3 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="font-medium">Upload Font (If Any)</label>
              <button className="mt-1 w-full flex items-center justify-between border rounded-sm px-3 py-2 bg-gray-50 text-blue-600">
                {/* Left: File Name */}
                <span className="text-sm">poppins.ttf</span>

                {/* Right: Icons */}
                <div className="flex items-center gap-3">
                  <Eye size={14} className="cursor-pointer" />
                  <Download size={14} className="cursor-pointer" />
                </div>
              </button>
            </div>

            {/* Color Combination */}
            <div>
              <label className="font-medium">
                Color Combination (If want some specific)
              </label>
              <input
                value="White background, Blue letters"
                readOnly
                className="mt-1 w-full border rounded-sm px-3 py-2 bg-gray-50"
              />
            </div>
            <div />

            {/* Color Code */}
            <div>
              <label className="font-medium">Color Code (If Available)</label>
              <input
                value="#000000"
                readOnly
                className="mt-1 w-full border rounded-sm px-3 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="font-medium">
                Color Reference (If Available)
              </label>
              <button className="mt-1 w-full flex items-center justify-between border rounded-sm px-3 py-2 bg-gray-50 text-blue-600">
                {/* Left: File Name */}
                <span className="text-sm">colorReference.png </span>

                {/* Right: Icons */}
                <div className="flex items-center gap-3">
                  <Eye size={14} className="cursor-pointer" />
                  <Download size={14} className="cursor-pointer" />
                </div>
              </button>
            </div>

            {/* Detail Summary */}
            <div className="md:col-span-2">
              <label className="font-medium">Detail Summary</label>
              <textarea
                rows={2}
                readOnly
                value="White background, Blue letters"
                className="mt-1 w-full border rounded-sm px-3 py-2 bg-gray-50"
              />
            </div>

            {/* Light Option */}
            <div>
              <label className="font-medium">Light Option</label>
              <input
                value="Lit"
                readOnly
                className="mt-1 w-full border rounded-sm px-3 py-2 bg-gray-50"
              />
            </div>
            <div />

            {/* Light Color */}
            <div>
              <label className="font-medium">Light Color</label>
              <input
                value="#FF0000"
                readOnly
                className="mt-1 w-full border rounded-sm px-3 py-2 bg-gray-50"
              />
            </div>
            <div>
              <label className="font-medium">
                Light Color (If anything have)
              </label>
              <button className="mt-1 w-full flex items-center justify-between border rounded-sm px-3 py-2 bg-gray-50 text-blue-600">
                {/* Left: File Name */}
                <span className="text-sm">LightcolorReference.png </span>

                {/* Right: Icons */}
                <div className="flex items-center gap-3">
                  <Eye size={14} className="cursor-pointer" />
                  <Download size={14} className="cursor-pointer" />
                </div>
              </button>
            </div>

            {/* Light Description */}
            <div className="md:col-span-2">
              <label className="font-medium">Light Color Description</label>
              <textarea
                rows={2}
                readOnly
                value="Maintain similar color tone."
                className="mt-1 w-full border rounded-sm px-3 py-2 bg-gray-50"
              />
            </div>

            {/* Signage Sample */}
            <div className="md:col-span-2">
              <label className="font-medium">
                Any Signage Sample (If want to give reference idea)
              </label>
              <button className="mt-1 w-full flex items-center justify-between border rounded-sm px-3 py-2 bg-gray-50 text-blue-600">
                {/* Left: File Name */}
                <span className="text-sm">SignageReference.png </span>

                {/* Right: Icons */}
                <div className="flex items-center gap-3">
                  <Eye size={14} className="cursor-pointer" />
                  <Download size={14} className="cursor-pointer" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 4.... */}
        <div className="rounded-sm shadow-sm border">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-lg font-semibold">
              Additional Instructions / Remarks
            </h2>
          </div>

          {/* Sections */}
          <div className="space-y-2 grid grid-cols-2 gap-4 text-sm px-4 my-5">
            {sections.map((section, index) => (
              <div key={index}>
                <p className="font-medium mb-1">{section.title}</p>
                <ul className="list-disc pl-5 bg-blue-50 border rounded-sm p-3 space-y-1">
                  {section.points.map((point, i) => (
                    <li key={i} className="text-gray-700">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 5.... */}
        <div className="space-y-6">
          {/* ================= Final Notes ================= */}
          <div className="bg-white rounded-sm shadow-sm border">
            <div className="px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Final Notes</h2>
            </div>

            <div className="p-4 space-y-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Additional Comments
                </label>
                <div className="bg-gray-50 border rounded-sm p-3 text-sm text-gray-700">
                  All specs verified on-site. Proceed to design with
                  client-approved colors.
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Additional Safety Notes
                </label>
                <div className="bg-gray-50 border rounded-sm p-3 text-sm text-gray-700">
                  Caution required near staircase; secure ladder footing.
                </div>
              </div>
            </div>
          </div>

          {/* ================= Assigned By ================= */}
          <div className="bg-white rounded-sm shadow-sm border">
            <div className="px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Assigned By</h2>
            </div>

            <div className="p-4 space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Design Manager
                  </label>
                  <div className="bg-gray-50 border rounded-sm p-3 text-sm">
                    Rahul Singh
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Branch
                  </label>
                  <div className="bg-gray-50 border rounded-sm p-3 text-sm">
                    Chinhhat
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Assigned Date
                  </label>
                  <div className="bg-gray-50 border rounded-sm p-3 text-sm">
                    11/07/25 - 11:00 AM
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Deadline Date
                  </label>
                  <div className="bg-gray-50 border rounded-sm p-3 text-sm">
                    11/07/25 - 11:00 AM
                  </div>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Design Manager’s Comment
                </label>
                <div className="bg-gray-50 border rounded-sm p-3 text-sm text-gray-700">
                  All specs verified on-site. Proceed to design with
                  client-approved colors.
                </div>
              </div>
            </div>
          </div>
        </div>

    
      </div>
    </div>
  );
};

export default DesignDetailPage;
