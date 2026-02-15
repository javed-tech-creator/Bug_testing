import React, { useEffect, useState } from "react";
import DesignSimpleHeader from "../../components/designs/DesignSimpleHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/assign-view-page/ProductRequirementsDetailed";
import DesignModificationDetailsCard from "../../components/design-workflow/DesignModificationDetailsCard";
import DesignModificationForm from "../../components/design-workflow/DesignModificationForm";
import { useSelector } from "react-redux";
import { useUploadDesignVersionMutation } from "@/api/design/common_workflow/view-design-option.api";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";





const designOptionsData = [
  {
    id: 1,
    optionNo: "01",
    selectionDate: "13/01/2025 - 12:00PM",
    submissionDate: "12/01/2025 - 11:00AM",
    selected: true,
    designTitle: "ABC Design",
    fontName: "Montserrat",
    colors: "Red, Blue, Green",
    litColors: "White",
    width: "12 Inch",
    height: "1 Feet",
    depth: "4 CM",
    description:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    clientFeedback:
      "Contrary to popular belief, Lorem Ipsum is not simply random text.",
    designImage: "https://images.unsplash.com/photo-1581092588429-7d8a3e9f1b60",
    assetImage: "https://files.example.com/assets/supporting-assets.cdr", // ✅ CDR
  },
];

const DesignModificationDetails = () => {
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  const res = useSelector((state) => state.auth.userData);
  const userData = res?.user;


  const [uploadDesignVersion, { isUpdating }] = useUploadDesignVersionMutation();


  useEffect(() => {
    if (userData === undefined) return; // redux loading
    if (userData === null) {
      navigate("/design/login", { replace: true });
    }
  }, [userData, navigate]);

  const userRole = userData?.designation?.title?.trim()?.toLowerCase();

  const [newDesign, setNewDesign] = useState({
    id: Date.now(),
    designTitle: "",
    fontName: "",
    colors: "",
    litColors: "",
    width: "",
    height: "",
    thickness: "",
    description: "",
    files: [],
    designFile: null,
    assetsFile: null,

  });

  const { id } = useParams();
  const location = useLocation();
  const title = location.state.title;

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

  const handleSendVersion = async (sendTo) => {
    try {

      console.log("newDesign:>", newDesign)

      const fd = new FormData();

      // required ids (adjust from route / state)
      fd.append("design_option_id", id);
      fd.append("design_option_selected_id", id);

      // version_payload
      fd.append(
        "version_payload",
        JSON.stringify({
          title: newDesign.designTitle,
          font_name: newDesign.fontName,
          colors_name: newDesign.colors,
          lit_colors_name: newDesign.litColors,
          size_specification: {
            width_in_inch: Number(newDesign.width),
            height_in_inch: Number(newDesign.height),
            thickness_in_mm: Number(newDesign.thickness),
          },
          remark: newDesign.description,
          send_to_manager: sendTo === "manager",
          send_to_client: sendTo === "client",
        })
      );

      // files
      if (newDesign.designFile) {
        fd.append("upload_design_option", newDesign.designFile);
      }

      if (newDesign.assetsFile) {
        fd.append("upload_supporting_asset", newDesign.assetsFile);
      }

      // multiple media
      newDesign.files?.forEach((file) => {
        fd.append("media", file);
      });

      await uploadDesignVersion({ data: fd }).unwrap();
      toast.success("Design version uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.message ?? err?.error?.message ?? err?.data?.message ?? "Failed to upload design version");
    }
  };



  return (
    <div className="px-5">
      <DesignSimpleHeader
        title={title}
        showDesignStarted={true}
        designStarted="12/01/2025 - 11:00AM"
      />

      <div className="bg-white  rounded-md border space-y-4 ">
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
          <DesignModificationDetailsCard key={item.id} data={item} />
        ))}
      </div>

      {!showForm && (
        <div className="flex justify-end gap-3 border p-2 rounded shadow ">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded cursor-pointer"
          >
            Upload New Design
          </button>
        </div>
      )}

      <div className="space-y-6 mt-6">
        {showForm && (
          <div className="mt-6">
            <DesignModificationForm
              index={0}
              data={newDesign}
              onChange={(index, field, value) =>
                setNewDesign((prev) => ({ ...prev, [field]: value }))
              }
              onRemove={() => setShowForm(false)}
              canRemove={true}
            />
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-3 border p-4 rounded shadow mt-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded cursor-pointer"
        >
          Cancel
        </button>
        {userRole !== "manager" && (
          <button className="flex gap-2 items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded cursor-pointer"
            onClick={() => handleSendVersion("manager")}
          >
            {
              isUpdating
                ?
                <>
                  <Loader2 side={18} className="animate-spin" />
                  Sending...
                </>
                : "Send To Manager"

            }

          </button>
        )}
        {/* <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded cursor-pointer">
          Send To Sales
        </button> */}
        <button className="flex gap-2 items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded cursor-pointer"
          onClick={() => handleSendVersion("client")}
        >
          {isUpdating ?
            <>
              <Loader2 size={18} className="animate-spin" />
              Sending...
            </>
            :
            "Send To Client"
          }

        </button>
      </div>
    </div>
  );
};

export default DesignModificationDetails;
