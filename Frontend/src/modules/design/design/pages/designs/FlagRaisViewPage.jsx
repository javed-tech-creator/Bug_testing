import React, { useEffect, useState } from "react";
import DesignsHeader from "../../components/designs/DesignHeader";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { InfoField } from "../../components/assign-view-page/InfoField";
import { RenderLevel } from "../../components/assign-view-page/EnvironmentalConditions";
import {
  Dimension,
  Input,
  Select,
} from "../../components/assign-view-page/ProductRequirementsDetailed";
import {
  MediaCard,
  VideoCard,
} from "../../components/assign-view-page/UploadedMediaSection";
import {
  LabelBlock,
  YesNo,
} from "../../components/assign-view-page/InstallationDetailsForm";
import { Check, CheckSquare, Eye, Flag, Star, Upload, X } from "lucide-react";
import ReviewDynamicForm from "../../components/assign-view-page/ReviewDynamicForm";

const checklistData = [
  "Environmental Conditions",
  "Product Requirements",
  "Uploaded Images",
  "Uploaded Videos",
  "Installation Details",
  "Raw Recce",
  "Data From Client",
  "Accurate Measurements Taken",
  "Instructions / Remarks",
  "All Signage Name (Product Name) Confirmed",
  "Submitted Same Day",
];

const FlagRaisViewPage = () => {
  const [formData, setFormData] = useState({
    comment: "",
    rating: 4,
    status: "Accepted",
    flag: false, // ✅ boolean
    flagReason: "",
  });

  const { type, id } = useParams();
  const location = useLocation();

  const title = location.state?.title;
  const page = location.state?.page;
  console.log("page", page);

  const handleAction = (action) => {
    navigate(`/design/executive/designs/assigned-${action}/${type}/${id}`, {
      state: {
        title,
        page: action,
      },
    });
  };

  useEffect(() => {
    if (page === "flag-raised") {
      setFormData((prev) => ({
        ...prev,
        status: "Pending",
        flag: true,
      }));
    }
  }, [page]);

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

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [selectedChecklist, setSelectedChecklist] = useState(
    checklistData.reduce((acc, item) => {
      acc[item] = false;
      return acc;
    }, {})
  );

  const handleToggle = (item) => {
    setSelectedChecklist((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const [reviewData, setReviewData] = useState({
    remark: "",
    rating: 0,
  });

  const handleOpenReview = () => setIsReviewOpen(true);
  const handleCloseReview = () => setIsReviewOpen(false);

  const handleSaveReview = (data) => {
    console.log("Final Review Data:", data);
    setReviewData(data);
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

  const navigate = useNavigate();

  return (
    <div className="px-5">
      <DesignsHeader
        title={title}
        showDateFilter={false}
        showPriorityFilter={false}
        showDesignId={true}
        designId="D-2025-00124"
        showDeadline={true}
        deadline="11/07/25 - 12:00PM"
        showDiscussionBtn={true}
        onDiscussionClick={() => console.log("Open Discussion Logs")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT SECTION */}
        <div className="space-y-4">
          <div className=" border rounded-sm shadow-sm">
            {/* HEADER */}
            <div className="px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">
                Basic Client Information
              </h2>
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-6">
              {/* BASIC INFO GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientInfo.basicInfo.map((item, index) => (
                  <InfoField
                    key={index}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </div>

              {/* CONTACT PERSON SECTION */}
              <div>
                <h3 className="text-lg font-semibold mb-3 pb-3 border-b-2">
                  Contact Person Details (On Site)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className=" border rounded-sm shadow-sm">
            {/* HEADER */}
            <div className="px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Project Information</h2>
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-4">
              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectInfo.map((item, index) => (
                  <InfoField
                    key={index}
                    label={item.label}
                    value={item.value}
                  />
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

          <div className=" border rounded-sm shadow-sm">
            {/* HEADER */}

            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">
                Environmental Conditions
              </h2>
              {page !== "view" && page !== "reject" && (
                <button
                  onClick={handleOpenReview}
                  className="flex items-center gap-2 text-blue-600  font-medium cursor-pointer"
                >
                  <CheckSquare size={16} /> Remark
                </button>
              )}
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {/* Grand Child Modal */}
            <ReviewDynamicForm
              isOpen={isReviewOpen}
              onClose={handleCloseReview}
              title="Installation Details Review"
              remark={reviewData.remark}
              onSave={handleSaveReview}
            />
          </div>

          <div className=" border rounded-sm shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">
                Product Requirements (Detailed)
              </h2>
              {page !== "view" && page !== "reject" && (
                <button
                  onClick={handleOpenReview}
                  className="flex items-center gap-2 text-blue-600  font-medium cursor-pointer"
                >
                  <CheckSquare size={16} /> Remark
                </button>
              )}
            </div>

            {/* Body */}
            <div className="p-4 space-y-4 text-sm">
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

              {/* Grid Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Product Category" value="Indoor" />
                <Input label="Product Name" value="LED Frontlit Board" />
                <Input label="Product Code" value="P-0976" />
                <Select label="Visibility" value="One side" />
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dimension label="Height / Vertical" value="4.5" unit="Feet" />
                <Dimension
                  label="Width / length / Horizontal"
                  value="12"
                  unit="cm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dimension label="Thickness / Depth" value="2" unit="Inch" />
                <Input label="Quantity" value="1" />
              </div>

              {/* Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {/* Grand Child Modal */}
            <ReviewDynamicForm
              isOpen={isReviewOpen}
              onClose={handleCloseReview}
              title="Product Requirements (Detailed)"
              remark={reviewData.remark}
              onSave={handleSaveReview}
            />
          </div>

          <div className=" border rounded-sm shadow-sm">
            {/* -------- Uploaded Photos -------- */}
            <div className="flex items-center justify-between px-4 py-3 border-t first:border-t-0 bg-gray-50 ">
              <h2 className="text-lg font-semibold">Uploaded Photos</h2>
              {page !== "view" && page !== "reject" && (
                <button
                  onClick={handleOpenReview}
                  className="flex items-center gap-2 text-blue-600 font-medium cursor-pointer"
                >
                  <CheckSquare size={16} /> Remark
                </button>
              )}
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
              {uploadedPhotos.map((photo) => (
                <MediaCard
                  key={photo.id}
                  image={photo.url}
                  label={photo.label}
                />
              ))}
            </div>

            {/* -------- Uploaded Videos -------- */}
            <div className="flex items-center justify-between px-4 py-3 border-t first:border-t-0 bg-gray-50 ">
              <h2 className="text-lg font-semibold">Uploaded Videos</h2>
              {page !== "view" && page !== "reject" && (
                <button
                  onClick={handleOpenReview}
                  className="flex items-center gap-2 text-blue-600 font-medium cursor-pointer"
                >
                  <CheckSquare size={16} /> Remark
                </button>
              )}
            </div>

            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  image={video.thumbnail}
                  label={video.label}
                />
              ))}
            </div>

            <ReviewDynamicForm
              isOpen={isReviewOpen}
              onClose={handleCloseReview}
              title="Raw Recce"
              remark={reviewData.remark}
              onSave={handleSaveReview}
            />
          </div>

          <div className=" border rounded text-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-t first:border-t-0 bg-gray-50 ">
              <h2 className="text-lg font-bold">Installation Details</h2>
              {page !== "view" && page !== "reject" && (
                <button
                  onClick={handleOpenReview}
                  className="flex items-center gap-2 text-blue-600 font-medium cursor-pointer"
                >
                  <CheckSquare size={16} /> Remark
                </button>
              )}
            </div>

            {/* Surface Details */}
            <div className="p-4 grid grid-cols-2 gap-4">
              <LabelBlock
                label="Surface Type / Base"
                value={data.surfaceType}
              />
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
            <div className="px-4 py-2 grid grid-cols-2 gap-4">
              <LabelBlock label="Stability" value={data.stability} />
              <LabelBlock
                label="Mount Description"
                value={data.mountDescription}
              />
            </div>

            {/* Civil Work */}
            <h3 className="px-4 py-2 font-semibold">Civil Work Required</h3>
            <div className="px-4 pb-4">
              <YesNo value={data.civilWorkRequired} />
              <LabelBlock
                label="Civil Work Description"
                value={data.civilWorkDescription}
              />
            </div>

            {/* Fabrication Work */}
            <h3 className="px-4 py-2 font-semibold">Fabrication Work Needed</h3>
            <div className="px-4 pb-4">
              <YesNo value={data.fabricationWorkNeeded} />
              <LabelBlock
                label="Fabrication Work Description"
                value={data.fabricationWorkDescription}
              />
            </div>

            {/* Obstructions */}
            <h3 className="px-4 py-2 font-semibold">
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
            <div className="px-4 py-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Ladder</p>
                <YesNo value={data.ladder} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Bamboo (Paad)</p>
                <YesNo value={data.bamboo} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Iron MS / Paad</p>
                <YesNo value={data.ironMS} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Table-Stool</p>
                <YesNo value={data.tableStool} />
              </div>
            </div>

            <div className="px-4 pb-4">
              <LabelBlock label="Other Notes" value={data.otherNotes} />
            </div>

            {/* Electrical */}
            <h3 className="px-4 py-2 font-semibold">Electrical Requirements</h3>
            <div className="px-4 pb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">
                  Power Connection Available
                </p>
                <YesNo value={data.powerConnection} />
              </div>
              <LabelBlock
                label="Switchboard Distance"
                value={data.switchboardDistance}
              />
            </div>

            <div className="px-4 pb-4">
              <LabelBlock
                label="Cable Route Notes"
                value={data.cableRouteNotes}
              />
            </div>

            <div className="px-4 pb-4">
              <LabelBlock label="Safety Notes" value={data.safetyNotes} />
            </div>

            <div className="px-4 pb-4">
              <LabelBlock
                label="Requirement From Client"
                value={data.requirementFromClient}
              />
            </div>

            <div className="px-4 pb-6">
              <LabelBlock
                label="Instruction to Client"
                value={data.instructionToClient}
              />
            </div>
            <ReviewDynamicForm
              isOpen={isReviewOpen}
              onClose={handleCloseReview}
              title="Raw Recce"
              remark={reviewData.remark}
              onSave={handleSaveReview}
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-4">
          <div className=" rounded-sm shadow-sm border">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Raw Recce</h2>
              {page !== "view" && page !== "reject" && (
                <button
                  onClick={handleOpenReview}
                  className="flex items-center gap-2 text-blue-600 font-medium cursor-pointer"
                >
                  <CheckSquare size={18} /> Remark
                </button>
              )}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
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

            {/* Grand Child Modal */}
            <ReviewDynamicForm
              isOpen={isReviewOpen}
              onClose={handleCloseReview}
              title="Raw Recce"
              remark={reviewData.remark}
              onSave={handleSaveReview}
            />
          </div>

          <div className="rounded-sm shadow-sm border ">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">Data From Client</h2>
              {page !== "view" && page !== "reject" && (
                <button
                  onClick={handleOpenReview}
                  className="flex items-center gap-2 text-blue-600 font-medium cursor-pointer"
                >
                  <CheckSquare size={18} /> Remark
                </button>
              )}
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
                <button className="mt-1 w-full flex items-center gap-2 border rounded-sm px-3 py-2 bg-gray-50 text-gray-600">
                  <Upload size={14} /> Upload Content File
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
                <button className="mt-1 w-full flex items-center gap-2 border rounded-sm px-3 py-2 bg-gray-50 text-gray-600">
                  <Upload size={14} /> Upload Logo
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
                  poppins.ttf <Eye size={14} />
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
                  reference.png <Eye size={14} />
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
                  reference.png <Eye size={14} />
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
                  reference.png <Eye size={14} />
                </button>
              </div>
            </div>

            {/* Grand Child Modal */}
            <ReviewDynamicForm
              isOpen={isReviewOpen}
              onClose={handleCloseReview}
              title="Data From Client"
              remark={reviewData.remark}
              onSave={handleSaveReview}
            />
          </div>

          <div className="rounded-sm shadow-sm border">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">
                Additional Instructions / Remarks
              </h2>
              {page !== "view" && page !== "reject" && (
                <button
                  onClick={handleOpenReview}
                  className="flex items-center gap-2 text-blue-600 font-medium cursor-pointer"
                >
                  <CheckSquare size={18} /> Remark
                </button>
              )}
            </div>

            {/* Sections */}
            <div className="space-y-4 text-sm p-4">
              {sections.map((section, index) => (
                <div key={index}>
                  <p className="font-medium mb-1">{section.title}</p>
                  <ul className="list-disc pl-5 bg-gray-50 border rounded-sm p-3 space-y-1">
                    {section.points.map((point, i) => (
                      <li key={i} className="text-gray-700">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {/* Grand Child Modal */}
            <ReviewDynamicForm
              isOpen={isReviewOpen}
              onClose={handleCloseReview}
              title="Additional Instructions / Remarks"
              remark={reviewData.remark}
              onSave={handleSaveReview}
            />
          </div>

          <div className="space-y-6">
            {/* ================= Final Notes ================= */}
            <div className="bg-white rounded-sm shadow-sm border">
              <div className="px-4 py-3 border-b">
                <h2 className="text-lg font-semibold">Final Notes</h2>
              </div>

              <div className="p-4 space-y-4">
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

          {/* {page !== "view" && page !== "reject" && ( */}
          <div className="rounded-sm shadow-sm border">
            {/* Header */}
            <div className="px-4 py-3 border-b">
              <h2 className="text-lg font-semibold">
                Design Executive Receiving Checklist
              </h2>
            </div>

            {/* Checklist */}
            <div className="p-4 space-y-3">
              {checklistData.map((item, index) => {
                const isChecked = selectedChecklist[item];

                return (
                  <div
                    key={index}
                    onClick={() => handleToggle(item)}
                    className={`flex items-center gap-3 border rounded-sm px-3 py-2 cursor-pointer transition
                ${isChecked ? "bg-blue-50 border-blue-400" : "bg-gray-50"}
              `}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 flex items-center justify-center border-2 rounded-sm
                  ${
                    isChecked
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white border-gray-400"
                  }
                `}
                    >
                      {isChecked && <Check size={14} className="text-white" />}
                    </div>

                    {/* Label */}
                    <span className="text-sm font-medium text-gray-800">
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* )} */}

          {page !== "view" && (
            <div className="rounded-sm shadow-sm border max-w-4xl">
              {/* Header */}
              <div className="px-4 py-3 border-b">
                <h2 className="text-lg font-semibold">
                  Design Executive Feedback Panel
                </h2>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Design Executive Comment
                  </label>
                  <textarea
                    value={formData.comment}
                    readOnly
                    onChange={(e) => handleChange("comment", e.target.value)}
                    className="w-full bg-gray-50 border rounded-sm px-3 py-2 text-sm"
                    placeholder="Enter feedback comment"
                  />
                </div>

                {/* Rating + Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Rating Score
                    </label>
                    <div className="flex items-center justify-between bg-gray-50 border rounded-sm px-3 py-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={18}
                            onClick={() => handleChange("rating", star)}
                            className={`cursor-pointer ${
                              star <= formData.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {formData.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Receiving Status
                    </label>
                    <select
                      value={formData.status}
                      disabled={
                        page === "reject" ||
                        page === "flag" ||
                        page === "accept"
                      }
                      onChange={(e) => handleChange("status", e.target.value)}
                      className={`w-full rounded-sm px-3 py-2 text-sm 
    ${
      page === "reject"
        ? "bg-red-100 text-red-700 cursor-not-allowed border border-red-400"
        : formData.flag
        ? "bg-yellow-100 text-yellow-700 border cursor-not-allowed border-yellow-400"
        : page === "accept"
        ? "border border-green-400 bg-green-100 text-green-700 cursor-not-allowed"
        : ""
    }
  `}
                    >
                      <option>Accepted</option>
                      <option>Pending</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Raise Flag */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Raise a Flag
                  </label>

                  <select
                    value={formData.flag ? "Yes" : "No"}
                    disabled={page === "flag-raised"}
                    readOnly
                    onChange={(e) =>
                      handleChange("flag", e.target.value === "Yes")
                    }
                    className={`w-full border border-green-500 text-green-600 rounded-sm px-3 py-2 text-sm
                        ${
                          page === "flag"
                            ? "bg-red-100 text-red-700 cursor-not-allowed border border-red-400"
                            : ""
                        }`}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {/* Flag Reason */}
                {formData.flag && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Flag Raising Reason
                    </label>
                    <textarea
                      value={formData.flagReason}
                      readOnly
                      onChange={(e) =>
                        handleChange("flagReason", e.target.value)
                      }
                      className="w-full bg-gray-50 border rounded-sm px-3 py-2 text-sm"
                      placeholder="Enter reason"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlagRaisViewPage;
