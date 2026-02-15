import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import {
  useAddLeadMutation,
  useLazyGetUserByQueryQuery,
  useUpdateLeadMutation,
} from "../../../../api/sales/lead.api.js";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader.jsx";
import { useSelector } from "react-redux";
import { useLazyGetClientQuery } from "@/api/sales/client.api.js";
import { Eye, File, Headphones, Image, Mic, Plus } from "lucide-react";
import RequirementFilesModal from "../../components/RequirementFilesModal.jsx";

const schema = yup.object().shape({
  leadSource: yup.string().required("Lead source is required"),
  leadLabel: yup.string().required("Lead label is required"),
  leadType: yup.string().required("Lead type is required"),
  clientName: yup.string().required("Customer name is required"),
  phone: yup
    .string()
    .matches(
      /^[6-9]\d{9}$/,
      "Phone number must start with 6-9 and be 10 digits"
    )
    .required("Phone number is required"),
  altPhone: yup
    .string()
    .nullable()
    .notRequired()
    .test(
      "altPhone",
      "Phone number must start with 6-9 and be 10 digits",
      (value) => {
        if (!value) return true;
        return /^[6-9]\d{9}$/.test(value);
      }
    ),
  email: yup.string().email("Invalid email"),
  city: yup.string(),
  address: yup.string(),
  pincode: yup
    .string()
    .test("pincode", "Enter a valid 6-digit pincode", (value) => {
      if (!value) return true;
      return /^\d{6}$/.test(value);
    })
    .nullable(),
  requirement: yup.string().nullable(),
  requirementFiles: yup
    .mixed()
    .test(
      "requirement-check",
      "Requirement text or file is required",
      function () {
        const { requirement } = this.parent;
        const files = this.options.context?.requirementFiles || [];
        return !!requirement || files.length > 0;
      }
    ),
  clientId: yup.string(),
  expectedBusiness: yup.number().min(1000).nullable(),
  leadSourceUser: yup.string().when("leadSource", {
    is: (val) => ["VENDOR", "FREELANCER", "PARTNER", "FRANCHISE"].includes(val),
    then: (schema) => schema.required("Source user is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  googleLocation: yup.string()
});

const LeadCaptureForm = () => {
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [requirementFiles, setRequirementFiles] = useState([]);

  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);


  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      leadType: "FRESH"
    }
  });

  const location = useLocation();
  const navigate = useNavigate();
  const leadData = location?.state?.leadData;

  const [leadAdd, { isLoading }] = useAddLeadMutation();
  const [updateData, { isLoading: leadUpdateLoading }] = useUpdateLeadMutation();
  const [getClients, { isLoading: fetchClient }] = useLazyGetClientQuery();
  const watchLeadType = watch("leadType");
  const expectedBusiness = watch("expectedBusiness");
  const watchLeadSource = watch("leadSource");
  const [sourceUsers, setSourceUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [getUsersBySource, { isLoading: fetchUsers }] = useLazyGetUserByQueryQuery();
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [fileLead, setFileLead] = useState(null);


  const startRecording = async () => {
    try {
      setShowAttachMenu(false)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "voice-note.webm", {
          type: "audio/webm",
        });

        setRequirementFiles((prev) => [...prev, audioFile]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.log(err)
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };




  useEffect(() => {
    if (watchLeadType === "REPEAT") {
      fetchClients();
    } else {
      setClients([]);
      setSelectedClient(null);
    }
  }, [watchLeadType]);


  const fetchClients = async () => {
    try {
      setIsLoadingClients(true);
      const response = await getClients({}).unwrap();
      const data = response?.data?.clients;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch clients");
    } finally {
      setIsLoadingClients(false);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setValue("clientName", client.name || "");
    setValue("phone", client.phone || "");
    setValue("altPhone", client.altPhone || "");
    setValue("email", client.email || "");
    setValue("city", client.city || "");
    setValue("pincode", client.pincode || "");
    setValue("address", client.address || "");
    setValue("clientId", client._id || "");
  };

  useEffect(() => {
    if (watchLeadType === "FRESH") {
      setSelectedClient(null);
      reset({
        leadSource: watch("leadSource"),
        leadLabel: watch("leadLabel"),
        leadType: "FRESH",
        clientName: "",
        phone: "",
        altPhone: "",
        email: "",
        city: "",
        pincode: "",
        address: "",
        requirement: watch("requirement"),
        expectedBusiness: watch("expectedBusiness"),
        leadSourceUser: watch("leadSourceUser"),
        googleLocation: "",
      });
    }
  }, [watchLeadType, reset]);

  useEffect(() => {
    if (leadData) {
      reset({
        leadSource: leadData.leadSource || "",
        leadLabel: leadData.leadLabel || "",
        leadType: leadData.leadType || "FRESH",
        clientName: leadData.clientName || selectedClient?.name || "",
        clientId: leadData.clientId || "",
        phone: leadData.phone || "",
        altPhone: leadData.altPhone || "",
        email: leadData.email || "",
        city: leadData.city || "",
        pincode: leadData.pincode || "",
        address: leadData.address || "",
        requirement: leadData.requirement || "",
        requirementFiles: leadData.requirementFiles || "",
        expectedBusiness: leadData.expectedBusiness || "",
        leadSourceUser: leadData.leadSourceUser || "",
        googleLocation: leadData.googleLocation || "",
      });


      if (leadData.leadType === "REPEAT" && leadData.clientId) {
        setSelectedClient({
          _id: leadData.clientId,
          clientName: leadData.clientName,
          phone: leadData.phone,
          altPhone: leadData.altPhone,
          email: leadData.email,
          city: leadData.city,
          pincode: leadData.pincode,
          address: leadData.address,
        });
      }
    }
  }, [leadData, reset]);

  // Calculate incentives
  useEffect(() => {
    if (expectedBusiness) {
      const amount = parseFloat(expectedBusiness);
      if (!isNaN(amount)) {
        const dealPercent = parseFloat(import.meta.env.VITE_DEAL_INCENTIVE) || 0;
        const leadPercent = parseFloat(import.meta.env.VITE_LEAD_INCENTIVE) || 0;

        setValue("dealIncentive", ((amount * dealPercent) / 100).toFixed(2));
        setValue("leadIncentive", ((amount * leadPercent) / 100).toFixed(2));
      }
    }
  }, [expectedBusiness, setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("leadSource", data.leadSource);
      formData.append("leadLabel", data.leadLabel);
      formData.append("leadType", data.leadType);
      formData.append("clientName", data.clientName);
      formData.append("phone", data.phone);

      if (data.altPhone) formData.append("altPhone", data.altPhone);
      if (data.email) formData.append("email", data.email);
      if (data.city) formData.append("city", data.city);
      if (data.pincode) formData.append("pincode", data.pincode);
      if (data.address) formData.append("address", data.address);
      if (data.requirement) formData.append("requirement", data.requirement);
      if (data.expectedBusiness)
        formData.append("expectedBusiness", data.expectedBusiness);
      if (data.leadSourceUser)
        formData.append("leadSourceUser", data.leadSourceUser);
      if (requirementFiles?.length) {
        requirementFiles.forEach((file) => {
          formData.append("documents", file);
        });
      }

      if (leadData) {
        // -------- UPDATE --------
        const id = leadData._id;
        const result = await updateData({ id, formData }).unwrap();

        if (result?.success) {
          toast.success("Lead updated successfully!");
          reset();
          setRequirementFiles([]);

          if (
            user?.designation === "Sales Executive" ||
            user?.designation === "sales-executive"
          ) {
            navigate("/sales/leads/assign-lead");
          } else {
            navigate("/sales/leads/view");
          }
        }
      } else {
        // -------- CREATE --------
        formData.append("leadBy", user?._id);

        if (data.leadType === "REPEAT" && selectedClient?._id) {
          formData.append("clientId", selectedClient._id);
        }

        await leadAdd({ formData }).unwrap();

        toast.success("Lead submitted successfully!");
        reset();
        setSelectedClient(null);
        setRequirementFiles([]);

        navigate("/sales/leads/sheet");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error?.data?.message ||
        error?.message ||
        "Failed to submit lead. Please try again."
      );
    }
  };



  const handleSourceChange = async (selectedSource) => {
    setIsLoadingUsers(true);



    try {
      const query = `branchId=${user?.branch?._id}&departmentId=${user?.department?._id}&type=${selectedSource}`;

      const res = await getUsersBySource({ query }).unwrap();
      const users = res?.data?.users || [];
      setSourceUsers(users || []);
    } catch (error) {
      console.error("Error fetching source users:", error);
      toast.error(`Failed to fetch ${selectedSource} users`);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const openImagesInNewTabs = () => {
    leadData?.requirementFiles?.forEach((file) => {
      if (file?.public_url) {
        window.open(file.public_url, "_blank");
      }
    });
  };



  const getFileType = (url = "") => {
    const ext = url.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["mp4", "webm", "ogg"].includes(ext)) return "video";
    if (["mp3", "wav", "aac", "m4a"].includes(ext)) return "audio";
    return "document";
  };

  return (
    <div className="bg-gray-50 justify-center items-center">
      <RequirementFilesModal
        open={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
        lead={fileLead}
      />
      <PageHeader
        title={`${leadData ? "Update Lead Detail" : "Capture New Lead"}`}
      />

      {fileModalOpen && fileLead && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-4">

            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold">
                Requirement Uploads – {fileLead.clientName}
              </h2>
              <button
                onClick={() => setFileModalOpen(false)}
                className="text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Files */}
            {fileLead.requirementFiles?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-auto">

                {fileLead.requirementFiles.map((file, idx) => {
                  const type = getFileType(file.public_url || file.url);

                  return (
                    <div
                      key={idx}
                      className="border rounded-md p-2 flex flex-col items-center bg-gray-50"
                    >
                      {/* IMAGE */}
                      {type === "image" && (
                        <img
                          src={file.public_url}
                          alt="requirement"
                          className="w-full h-48 object-cover rounded cursor-pointer"
                          onClick={() =>
                            window.open(file.public_url, "_blank")
                          }
                        />
                      )}

                      {/* VIDEO */}
                      {type === "video" && (
                        <video
                          controls
                          className="w-full h-48 rounded"
                          src={file.public_url}
                        />
                      )}

                      {/* AUDIO */}
                      {type === "audio" && (
                        <audio controls className="w-full">
                          <source src={file.public_url} />
                        </audio>
                      )}

                      {/* DOCUMENT */}
                      {type === "document" && (
                        <a
                          href={file.public_url}
                          target="_blank"
                          className="text-blue-600 underline text-sm mt-2"
                        >
                          📄 Open Document
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No requirement files uploaded.
              </p>
            )}
          </div>
        </div>
      )}


      <div className="w-full mx-auto border border-gray-200 rounded-2xl bg-white p-4">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Lead Source */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Lead Source <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("leadSource")}
                  onChange={(e) => {
                    setValue("leadSource", e.target.value);
                    handleSourceChange(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 bg-white"
                >
                  <option value="">Select Lead Source</option>
                  <option value="WEBSITE">WEBSITE</option>
                  <option value="PHONE">PHONE</option>
                  <option value="EMAIL">EMAIL</option>
                  <option value="JUSTDIAL">JUSTDIAL</option>
                  <option value="INDIAMART">INDIAMART</option>
                  <option value="INSTAGRAM">INSTAGRAM</option>
                  <option value="FACEBOOK">FACEBOOK</option>
                  <option value="PARTNER">PARTNER</option>
                  <option value="VENDOR">VENDOR</option>
                  <option value="FREELANCER">FREELANCER</option>
                  <option value="FRANCHISE">FRANCHISE</option>
                  <option value="OTHER">OTHER</option>
                </select>
                {errors.leadSource && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.leadSource.message}
                  </p>
                )}
              </div>

              {/* Lead Refer By - Conditional Field */}
              {["VENDOR", "FREELANCER", "PARTNER", "FRANCHISE"].includes(watchLeadSource) && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-black/80 mb-1">
                    Lead Refer By <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("leadSourceUser")}
                    disabled={!watchLeadSource || isLoadingUsers}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 bg-white"
                  >
                    <option value="">
                      {isLoadingUsers ? "Loading..." : "Select Source User"}
                    </option>
                    {sourceUsers.map((user) => (
                      <option key={user.id} value={user.name}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                  {errors.leadSourceUser && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.leadSourceUser.message}
                    </p>
                  )}
                </div>
              )}

              {/* Lead Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Lead Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("leadType")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 bg-white text-gray-900"
                >
                  <option value="FRESH">FRESH</option>
                  <option value="REPEAT">REPEAT</option>
                </select>
                {errors.leadType && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.leadType.message}
                  </p>
                )}
              </div>

              {/* Concern Person Name - Changes based on Lead Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>

                {watchLeadType === "REPEAT" ? (
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const clientId = e.target.value;
                        if (clientId) {
                          const client = clients.find((c) => c._id === clientId);
                          if (client) {
                            handleClientSelect(client);
                          }
                        } else {
                          setSelectedClient(null);
                          setValue("clientName", "");
                          setValue("phone", "");
                          setValue("altPhone", "");
                          setValue("email", "");
                          setValue("city", "");
                          setValue("pincode", "");
                          setValue("address", "");
                        }
                      }}
                      value={selectedClient?._id || selectedClient?.name || ""}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 bg-white text-gray-900"
                      disabled={isLoadingClients}
                    >
                      <option value="">Select Previous Client</option>
                      {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.name} - {client.clientId}
                        </option>
                      ))}
                    </select>
                    {isLoadingClients && (
                      <div className="absolute right-3 top-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    {...register("clientName")}
                    placeholder="Enter Concern Person Name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200"
                  />
                )}

                {errors.clientName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.clientName.message}
                  </p>
                )}
              </div>

              {/* Lead Label */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Lead Label <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("leadLabel")}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 bg-white text-gray-900"
                >
                  <option value="">Select Lead Label</option>
                  <option value="UNTOUCHED">UNTOUCHED</option>
                  <option value="HOT">HOT</option>
                  <option value="WARM">WARM</option>
                  <option value="COLD">COLD</option>
                </select>
                {errors.leadLabel && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.leadLabel.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("phone")}
                  placeholder="Enter 10-digit Phone Number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200"
                // readOnly={watchLeadType === "REPEAT" && selectedClient}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Alternate Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Alternate / Whatsapp Number
                </label>
                <input
                  type="number"
                  {...register("altPhone")}
                  placeholder="Enter Alternate / Whatsapp Number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200"
                // readOnly={watchLeadType === "REPEAT" && selectedClient}
                />
                {errors.altPhone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.altPhone.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter Email Address"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200"
                // readOnly={watchLeadType === "REPEAT" && selectedClient}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  City
                </label>
                <input
                  type="text"
                  {...register("city")}
                  placeholder="Enter Your City"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200"
                // readOnly={watchLeadType === "REPEAT" && selectedClient}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  {...register("pincode")}
                  placeholder="Enter 6-digit Pincode"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200"
                // readOnly={watchLeadType === "REPEAT" && selectedClient}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.pincode.message}
                  </p>
                )}
              </div>

              {/* Expected Business Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Expected Business Amount
                </label>
                <input
                  type="number"
                  {...register("expectedBusiness")}
                  placeholder="Enter Expected Business Amount"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200"
                />
                {errors.expectedBusiness && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.expectedBusiness.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 col-span-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Google Location
                </label>
                <input
                  type="url"
                  {...register("googleLocation")}
                  placeholder="Enter Google Location"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200"
                />
                {errors.googleLocation && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.googleLocation.message}
                  </p>
                )}
              </div>

              {/* Deal Incentive
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Deal Incentive ({import.meta.env.VITE_DEAL_INCENTIVE || 2}%)
                </label>
                <input
                  type="text"
                  {...register("dealIncentive")}
                  readOnly
                  defaultValue={0}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 bg-gray-100 cursor-not-allowed"
                />
              </div>

              Lead Incentive
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Lead Incentive ({import.meta.env.VITE_LEAD_INCENTIVE || 2}%)
                </label>
                <input
                  type="text"
                  {...register("leadIncentive")}
                  readOnly
                  defaultValue={0}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 bg-gray-100 cursor-not-allowed"
                />
              </div> */}
            </div>

            {/* Address and Requirement */}
            <div className="w-full grid grid-cols-2 gap-3 mt-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Address
                </label>
                <textarea
                  rows={2}
                  {...register("address")}
                  placeholder="Enter Complete Address"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200"
                // readOnly={watchLeadType === "REPEAT" && selectedClient}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Requirement <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("requirement")}
                  rows={2}
                  placeholder="Describe The Customer's Requirements In Detail..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 resize-vertical"
                />
                {errors.requirement && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.requirement.message}
                  </p>
                )}
              </div> */}

              {/* <div className="space-y-2 flex justify-between">
                <div className="basis-10/12">
                  <label className="block text-sm font-medium text-black/80 mb-1">
                    Requirement <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    {...register("requirement")}
                    rows={2}
                    placeholder="Describe the customer's requirements..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm"
                  />
                </div>
                <div className="flex items-center justify-end basis-2/12 gap-3 mt-2">
                  <label className="px-3 py-1.5 text-sm bg-gray-200 rounded cursor-pointer">
                    Upload
                    <input
                      type="file"
                      multiple
                      hidden
                      onChange={(e) => {
                        setRequirementFiles(Array.from(e.target.files));
                      }}
                    />
                  </label>
                  {leadData?.requirementFiles?.length > 0 && (
                    <button
                      type="button"
                      className="text-xs underline text-blue-500 cursor-pointer"
                      onClick={openImagesInNewTabs}
                    >
                      Open Images
                    </button>
                  )}



                  {requirementFiles.length > 0 && (
                    <span className="text-xs text-gray-600">
                      {requirementFiles.length} file(s) selected
                    </span>
                  )}
                </div>

                {errors.requirement && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.requirement.message}
                  </p>
                )}
              </div> */}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80 mb-1">
                  Requirement <span className="text-red-500">*</span>
                </label>

                <div className="relative flex items-center border border-gray-300 rounded-sm px-1 bg-white">

                  <button
                    type="button"
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className="text-xl px-2"
                  >
                    <Plus size={35} className="cursor-pointer hover:bg-gray-200 bg-gray-100 rounded-full p-1 text-black/80" />
                  </button>

                  {/* Text Input */}
                  <textarea
                    {...register("requirement")}
                    rows={1}
                    placeholder="Describe the customer's requirements..."
                    className="flex-1 px-2 py-2 text-sm resize-none outline-none leading-[32px]"
                  />
                  {leadData?.requirementFiles?.length > 0 && (
                    <button
                      onClick={() => {
                        setFileLead(leadData);
                        setFileModalOpen(true);
                      }}
                      title="View Requirement Files"
                      type="button"
                      className="text-orange-500 hover:text-orange-600 border-orange-500 cursor-pointer border p-1 rounded-xl"
                    >
                      <Eye size={20} />
                    </button>
                  )}


                  <button
                    type="button"
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    className={`text-xl px-2 ${isRecording ? "text-red-500" : ""}`}
                    title="Hold to record"
                  >
                    <Mic size={35} className="cursor-pointer rounded-full hover:bg-gray-200 bg-gray-100 p-1.5  text-black/80" />
                  </button>


                  {/* Attach Menu */}
                  {showAttachMenu && (
                    <div onMouseLeave={() => setShowAttachMenu(!showAttachMenu)} className="absolute bottom-14 left-0 bg-white shadow-sm border rounded-md w-40 z-10">
                      <label className="block px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-800">
                        <File size={20} className=" inline-block" /> Document
                        <input
                          type="file"
                          hidden
                          onChange={(e) =>
                            setRequirementFiles((prev) => [
                              ...prev,
                              ...Array.from(e.target.files),
                            ])
                          }
                        />
                      </label>

                      <label className="block px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-800">
                        <Image size={20} className=" inline-block" /> Photo / Video
                        <input
                          type="file"
                          accept="image/*,video/*"
                          hidden
                          multiple
                          onChange={(e) =>
                            setRequirementFiles((prev) => [
                              ...prev,
                              ...Array.from(e.target.files),
                            ])
                          }
                        />
                      </label>
                      {/* {leadData?.requirementFiles?.length > 0 && (
                        <button
                          onClick={() => {
                            setFileLead(leadData);
                            setFileModalOpen(true);
                          }}
                          title="View Requirement Files"
                          type="button"
                          className="text-orange-500 absolute hover:text-orange-600 cursor-pointer"
                        >
                          <Eye size={16} />
                        </button>
                      )} */}

                      <label className="block px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-800">
                        <Headphones size={20} className=" inline-block" /> Audio
                        <input
                          type="file"
                          accept="audio/*"
                          hidden
                          onChange={(e) =>
                            setRequirementFiles((prev) => [
                              ...prev,
                              ...Array.from(e.target.files),
                            ])
                          }
                        />
                      </label>
                    </div>
                  )}
                </div>



                {/* File count */}
                {requirementFiles.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {requirementFiles.length} attachment(s) added
                  </p>
                )}

                {errors.requirement && (
                  <p className="text-red-500 text-sm">{errors.requirement.message}</p>
                )}
              </div>


            </div>

            {/* Selected Client Info (for REPEAT leads) */}
            {watchLeadType === "REPEAT" && selectedClient && (
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-sm">
                <p className="text-sm text-gray-800">
                  <strong>Selected Client:</strong> {selectedClient.name} | Phone: {selectedClient.phone} | Email: {selectedClient.email} | City: {selectedClient.city}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-4 flex justify-end text-[14px]">
              <button
                disabled={isLoading || leadUpdateLoading}
                type="submit"
                className={`${isLoading || leadUpdateLoading
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:scale-105"
                  } px-6 py-2 bg-black rounded-sm text-white focus:ring-offset-2 transition-all duration-200 shadow-lg`}
              >
                {isLoading || leadUpdateLoading
                  ? "Submitting..."
                  : leadData
                    ? "Update Lead"
                    : "Submit Lead"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureForm;