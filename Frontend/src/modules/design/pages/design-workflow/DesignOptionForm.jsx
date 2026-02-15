import React, { useEffect, useState } from "react";
import DesignSimpleHeader from "../../components/designs/DesignSimpleHeader";
import { Input } from "../../components/assign-view-page/ProductRequirementsDetailed";
import DesignAdditionalForm from "../../components/design-workflow/DesignAdditionalForm";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useUploadDesignOptionsMutation } from "@/api/design/common_workflow/work-flow.api";

const createEmptyDesign = () => ({
  id: crypto.randomUUID(), // unique & stable id
  designTitle: "",
  colors: "",
  litColors: "",
  fontName: "",
  width: "",
  height: "",
  thickness: "",
  description: "",
  files: [],
  designFile: null,
  assetsFile: null,
});

const DesignOptionForm = () => {
  const [designOptions, setDesignOptions] = useState([createEmptyDesign()]);
  const [sendTo, setSendTo] = useState("");

  const navigate = useNavigate();

  const res = useSelector((state) => state.auth.userData);
  const userData = res?.user;

  const [uploadDesignOptios, { isUpdating }] = useUploadDesignOptionsMutation();

  useEffect(() => {
    if (userData === undefined) return; // redux loading
    if (userData === null) {
      navigate("/design/login", { replace: true });
    }
  }, [userData, navigate]);

  const userRole = userData?.designation?.title?.trim()?.toLowerCase();

  useEffect(() => {
    if (userRole === "manager") {
      setSendTo("client")
    }

  }, [userRole])

  const initialFormData = {
    designId: "",
    productCode: "",
    productName: "",
    projectCode: "",
    projectName: "",
    clientCode: "",
    clientName: "",
    companyName: "",
  };

  const designRequestedId = "861a7e9b-3692-4bcc-b327-0cdce1fc519b";
  const designAssignedId = "861a7e9b-3692-4bcc-b327-0cdce1fc519b";

  const [formData, setFormData] = useState(initialFormData);

  const handleDesignSelect = (e) => {
    const selectedId = e.target.value;

    //  Agar empty select hua → form clear
    if (!selectedId) {
      setFormData(initialFormData);
      return;
    }

    const selectedDesign = designOption.find(
      (item) => item.designId === selectedId,
    );

    if (selectedDesign) {
      setFormData(selectedDesign);
    }
  };

  const addMoreDesign = () => {
    setDesignOptions((prev) => [...prev, createEmptyDesign()]);
  };

  const removeDesign = (id) => {
    if (designOptions.length === 1) return; //  at least one required

    setDesignOptions((prev) => prev.filter((item) => item.id !== id));
  };
  const updateDesign = (id, field, value) => {
    setDesignOptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const { id } = useParams();
  console.log("id", id);

  useEffect(() => {
    if (!id) return;

    // id string hota hai, isliye number me convert
    const selectedDesign = designOption.find((item) => item.id === Number(id));

    if (selectedDesign) {
      setFormData({
        designId: selectedDesign.designId || "",
        productCode: selectedDesign.productCode || "",
        productName: selectedDesign.productName || "",
        projectCode: selectedDesign.projectCode || "",
        projectName: selectedDesign.projectName || "",
        clientCode: selectedDesign.clientCode || "",
        clientName: selectedDesign.clientName || "",
        companyName: selectedDesign.companyName || "",
      });
    }
  }, [id]);

  const designOption = [
    {
      id: 1,
      designId: "D-1001",
      productCode: "P-0976",
      productName: "LED Frontlit Board",
      projectCode: "PR-87432",
      projectName: "Main Signage Branding",
      clientCode: "CL-2981",
      clientName: "Abc Singh",
      companyName: "Abc Pvt Ltd",
    },
    {
      id: 2,
      designId: "D-1002",
      productCode: "P-1120",
      productName: "Glow Sign Board",
      projectCode: "PR-99210",
      projectName: "Mall Branding",
      clientCode: "CL-4412",
      clientName: "Rahul Sharma",
      companyName: "RS Enterprises",
    },
    {
      id: 3,
      designId: "D-1003",
      productCode: "P-2055",
      productName: "Acrylic Letter Board",
      projectCode: "PR-66321",
      projectName: "Office Reception",
      clientCode: "CL-7789",
      clientName: "Neha Verma",
      companyName: "",
    },
  ];

  // const handleSend = async () => {

  //   console.log('designOptions:>', designOptions)

  //   if (!sendTo) {
  //     toast.error("Please select whom to send");
  //     return;
  //   }

  //   //  role based handling
  //   if (sendTo === "manager") {
  //     console.log("Send to Manager");
  //   }

  //   if (sendTo === "client") {
  //     console.log("Send to Client");
  //   }

  //   const payLoad = {};


  //   try {
  //     const res = await uploadDesignOptios({ data: payLoad }).unwrap();
  //     console.log('res:>', res)
  //     toast.success(res?.message || "Sent successfully.")
  //   } catch (err) {
  //     console.log('err:>', err);
  //     toast.error(err?.message ?? err?.data?.message ?? err?.error?.message ?? "Failed to send.")
  //   }


  // };


  const handleSend = async () => {
    if (!sendTo) {
      toast.error("Please select whom to send");
      return;
    }


    console.log('designOptions:>', designOptions)

    const formData = new FormData();

    // Append text keys
    formData.append("design_request_id", designRequestedId || "");  // adjust accordingly
    formData.append("design_assigned_id", designAssignedId || "");
    formData.append("send_to_manager", sendTo === "manager" ? "true" : "false");
    formData.append("send_to_client", sendTo === "client" ? "true" : "false");

    // Append files (example with designOptions array)
    designOptions.forEach((option, index) => {
      if (option.designFile) {
        formData.append(`upload_design_option_${index}`, option.designFile);
      }
      if (option.assetsFile) {
        formData.append(`upload_supporting_asset_${index}`, option.assetsFile);
      }

      // For media files, if you have multiple, you can append like:
      option.files?.forEach((file, mediaIndex) => {
        formData.append(`media_${index}`, file);  // or use mediaIndex if you want unique keys
      });
    });

    // Append the designoptions JSON string
    formData.append("designoptions", JSON.stringify(
      designOptions.map((opt) => ({
        title: opt.designTitle,
        font_name: opt.fontName,
        colors_name: opt.colors,
        lit_colors_name: opt.litColors,
        size_specification: {
          width_in_inch: Number(opt.width),
          height_in_inch: Number(opt.height),
          thickness_in_mm: Number(opt.thickness),
        },
        remark: opt.description,
      }))
    ));

    try {
      // If your API accepts formData directly, use uploadDesignOptios(formData) (without wrapping in object)
      const res = await uploadDesignOptios({ data: formData }).unwrap();
      toast.success(res?.message || "Sent successfully.");
    } catch (err) {
      console.error(err);
      toast.error(err?.message ?? err?.data?.message ?? "Failed to send.");
    }
  };


  return (
    <div className="px-5">
      <DesignSimpleHeader title="Submit Design Option" />

      <div className="bg-white  rounded-md border space-y-4 ">
        <h2 className="text-lg font-semibold border-b px-4 py-2">
          Product Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4 pb-4">
          <Input label="Design ID" value={formData.designId} />
          <Input label="Product Code" value={formData.productCode} />
          <Input label="Product Name" value={formData.productName} />
          <Input label="Project Code" value={formData.projectCode} />
          <Input label="Project Name" value={formData.projectName} />
          <Input label="Client  Code" value={formData.clientCode} />
          <Input
            label="Client Name (as per Govt ID)"
            value={formData.clientName}
          />
          <Input label="Company Name (Optional)" value={formData.companyName} />
        </div>
      </div>

      <div className="space-y-6 mt-6">
        {designOptions.map((design, index) => (
          <DesignAdditionalForm
            key={design.id}
            index={index}
            data={design}
            onChange={updateDesign}
            onRemove={removeDesign}
            canRemove={designOptions.length > 1}
          />
        ))}

        {/* Add More */}
        <div className="p-4 -mt-6 rounded border border-t-0">
          <button
            onClick={addMoreDesign}
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-1.5 rounded"
          >
            + Add More Design Options
          </button>
        </div>
        {/* Bottom Actions */}

        {/* <div className="flex justify-end gap-3 border p-4 rounded shadow">
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
    </div>
  );
};

export default DesignOptionForm;
