import React, { useEffect, useState } from "react";
import DesignSimpleHeader from "../../components/designs/DesignSimpleHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/assign-view-page/ProductRequirementsDetailed";
import MockupStartedDetailsCard from "../../components/mockup-design/MockupStartedDetailsCard";
import MockupContainer from "../../components/mockup-design/MockupContainer";
import { useSelector } from "react-redux";
import { useAddMockUpDesignMutation } from "@/api/design/common_workflow/view-design-option.api";
import { toast } from "react-toastify";


const designOptionsData = [
  {
    id: 1,
    optionNo: "01",
    selectionDate: "13/01/2025 - 12:00PM",
    submissionDate: "14/01/2025 - 03:30PM",
    selected: true,
    designTitle: "ABC Design",
    fontName: "Montserrat",
    colors: "Red, Blue, Green",
    litColors: "White",
    width: "12 Inch",
    height: "1 Feet",
    depth: "4 CM",
    clientfeedbackDate: "15/01/2025 - 10:15AM",
    description:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    clientFeedback:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    designImage: "https://images.unsplash.com/photo-1581092588429-7d8a3e9f1b60",
    assetImage: "https://files.example.com/assets/supporting-assets.cdr", // ✅ CDR
  },
];

const designVersionOptionsData = [
  {
    id: 1,
    optionNo: "01",
    submissionDate: "14/01/2025 - 03:30PM",
    selected: false,
    designTitle: "Modern Glow",
    fontName: "Poppins",
    colors: "Black, Yellow",
    litColors: "Warm White",
    width: "18 Inch",
    height: "2 Feet",
    depth: "5 CM",
    description: "Modern illuminated signage with premium acrylic finish.",
    clientfeedbackDate: "15/01/2025 - 10:15AM",
    approved: true,
    clientFeedback:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    designImage: "https://files.example.com/designs/modern-glow.cdr", // ✅ CDR
    assetImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  },
];

const dummyMockups = [
  {
    id: 1,
    mockupVersion: "01",
    submissionDate: "12/01/2025 - 11:00AM",
    images: [
      {
        label: "Mockup Version - 01",
        url: "https://images.unsplash.com/photo-1590080877777-fc327d6e72c9?auto=format&fit=crop&w=400&q=80",
      },
      {
        label: "Supporting Assets",
        url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
      },
    ],
    shortDescription:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC,",
    clientFeedback: {
      date: "12/01/2025 - 11:00AM",
      instruction:
        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from",
    },
  },
  {
    id: 2,
    mockupVersion: "02",
    submissionDate: "15/01/2025 - 09:00AM",
    images: [
      {
        label: "Mockup Version - 02",
        url: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80",
      },
      {
        label: "Supporting Assets",
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
      },
    ],
    shortDescription:
      "Here is another design description for mockup version 02 to show multiple data entries.",
    clientFeedback: {
      date: "15/01/2025 - 09:00AM",
      instruction:
        "Please review the assets and provide feedback on the layout and color scheme.",
    },
  },
  // Add more mockups as needed
];

const MockupStartedView = () => {
  const [formData, setFormData] = useState({
    designId: "D-1001",
    productCode: "P-0976",
    productName: "LED Frontlit Board",
    projectCode: "PR-87432",
    projectName: "Main Signage Branding",
    clientCode: "CL-2981",
    clientName: "Abc Singh",
    companyName: "Abc Pvt Ltd",
  });

  const [sendTo, setSendTo] = useState("");

  // const handleSend = () => {
  //   if (!sendTo) {
  //     alert("Please select whom to send");
  //     return;
  //   }

  //   //  role based handling
  //   if (sendTo === "manager") {
  //     console.log("Send to Manager");
  //   }

  //   if (sendTo === "client") {
  //     console.log("Send to Client");
  //   }

  //   if (sendTo === "sales") {
  //     console.log("Send to Sales");
  //   }
  // };


  const handleSend = async () => {
    if (!sendTo) {
      toast.error("Please select whom to send");
      return;
    }

    try {
      const formData = new FormData();

      // REQUIRED IDS (replace with real IDs)
      formData.append("design_request_id", id); // from route param
      formData.append("design_assigned_id", "65d1a3c9f1a2b4c8e9123456");
      formData.append("design_option_id", "65d1a3c9f1a2b4c8e9123456");

      // remark
      formData.append("remark", mockupForm.description);

      // files
      if (mockupForm.assetsFile) {
        formData.append("upload_supporting_asset", mockupForm.assetsFile);
      }

      if (mockupForm.designFile) {
        formData.append("upload_mockup_version", mockupForm.designFile);
      }

      // multiple media files
      if (mockupForm.files?.length) {
        mockupForm.files.forEach((file) => {
          formData.append("media", file); // SAME KEY multiple times
        });
      }

      // send flags
      formData.append("send_to_manager", sendTo === "manager");
      formData.append("send_to_client", sendTo === "client");

      const res = await addMockUpDesign({ data: formData }).unwrap();

      toast.success(res?.data?.message ?? res?.message ?? "Sent Successfully.")
      navigate(-1);
    } catch (error) {
      console.error("Mockup upload failed", error);
      toast.error(error?.message ?? error?.data?.message ?? "Failed to send.")
    }
  };


  const [mockupForm, setMockupForm] = useState({
    description: "",
    files: [],
    designFile: null,
    assetsFile: null,
  });
  const updateMockupForm = (key, value) => {
    setMockupForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const { id } = useParams();
  const location = useLocation();
  const title = location.state.title;
  const navigate = useNavigate();

  const res = useSelector((state) => state.auth.userData);
  const userData = res?.user;

  useEffect(() => {
    if (userData === undefined) return; // redux loading
    if (userData === null) {
      navigate("/design/login", { replace: true });
    }
  }, [userData, navigate]);

  const userRole = userData?.designation?.title?.trim()?.toLowerCase();

  useEffect(() => {
    if (userRole == "manager") {
      setSendTo("client")
    }
  },[userRole]);

  const [addMockUpDesign, { isLoading }] = useAddMockUpDesignMutation();



  return (
    <div className="px-5">
      <DesignSimpleHeader
        title={title}
        showMockupStarted={true}
        MockupStarted="12/01/2025 - 11:00AM"
      />

      <div className="bg-white rounded-sm border space-y-4 ">
        <h2 className="text-lg font-semibold border-b px-4 py-2">
          Product Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 pb-4">
          {/* Select Design ID */}
          <Input label="Design ID" value={formData.designId} />
          <Input label="Product Code" value={formData.productCode} />
          <Input label="Product Name" value={formData.productName} />
          <Input label="Project Code" value={formData.projectCode} />

          <Input label="Project Name" value={formData.projectName} />
          <Input label="Client Code" value={formData.clientCode} />
          <Input
            label="Client Name (as per Govt ID)"
            value={formData.clientName}
          />
          <Input label="Company Name (Optional)" value={formData.companyName} />
        </div>
      </div>

      <div className="space-y-4 mt-4">
        {designOptionsData.map((item) => (
          <MockupStartedDetailsCard
            title="Design Option"
            heading="Selected Design Option Details"
            key={item.id}
            data={item}
          />
        ))}
      </div>

      <div className="space-y-4 mt-4">
        {designVersionOptionsData.map((item) => (
          <MockupStartedDetailsCard
            title="Design Version"
            heading="Approved Design Detail"
            key={item.id}
            data={item}
          />
        ))}
      </div>

      <MockupContainer data={mockupForm} onChange={updateMockupForm} />

      {/* Bottom Actions */}
      {/* <div className="flex justify-end gap-3 border p-4 rounded shadow mt-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded cursor-pointer"
        >
          Cancel
        </button>
        {userRole !== "manager" && (
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded cursor-pointer">
            Send To Manager
          </button>
        )}
        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded cursor-pointer">
          Send To Sales
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded cursor-pointer">
          Send To Client
        </button>
      </div> */}

      <div className="flex justify-end gap-3 border p-4 rounded shadow items-center">
        {/* Cancel */}
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded"
        >
          Cancel
        </button>

        {/*  Executive ke liye dropdown */}
        {userRole === "executive" && (
          <select
            value={sendTo}
            onChange={(e) => setSendTo(e.target.value)}
            className="border px-3 py-1.5 rounded"
          >
            <option value="">Select</option>
            <option value="manager">Manager</option>
            <option value="client">Client</option>
            {/* <option value="sales">Sales</option> */}
          </select>
        )}

        {/*  Manager ke liye direct button */}
        {userRole === "manager" && (
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded"
            onClick={handleSend}
          >
            Send To Client
          </button>
        )}

        {/*  Executive Send Button */}
        {userRole === "executive" && (
          <button
            onClick={handleSend}
            disabled={!sendTo}
            className={`px-4 py-1.5 rounded text-white ${sendTo
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
};




export default MockupStartedView;
