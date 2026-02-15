import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import {
  Upload,
  FileText,
  X,
  PlusCircle,
  Loader2,
  MapPin,
  File,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useGetProjectsByClientQuery,
} from "@/api/sales/client.api";
import { useGetAllProductsQuery } from "@/api/admin/product-management/product.management.api";

// ======= Validation Schema =======
const schema = yup.object().shape({
  projectName: yup.string().required("Project name is required"),
  description: yup.string().required("Project description is required"),
  products: yup
    .array()
    .of(
      yup.object().shape({
        product: yup.string().required("Product is required"),
        quantity: yup
          .number()
          .typeError("Quantity must be a number")
          .positive()
          .required("Quantity is required"),
        productId: yup.string(),
      })
    )
    .min(1, "At least one product is required"),
  discussionDone: yup.string().required("Discussion summary is required"),
  instructionRecce: yup.string(),
  instructionDesign: yup.string(),
  instructionInstallation: yup.string(),
  instructionOther: yup.string(),
  requirement: yup.string(),
  address: yup.string(),
  siteLocation: yup.string().required("Site location is required"),
  expectedRevenue: yup.number().typeError("Expected Revenue must be a number"),
  remarks: yup.string(),
});

const ProjectTab = ({ leadData }) => {
  // Get clientId from URL params
  const { id: clientId } = useParams();

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const {
    data,
    isLoading: isLoadingProjects,
    refetch: refetchProjects,
  } = useGetProjectsByClientQuery(
    { clientId },
    {
      skip: !clientId,
    }
  );

  const projectsData = data?.data?.projects || [];
  console.log("Fetched Projects:", projectsData);

  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [documentUpload, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const { data: pData, isLoading } = useGetAllProductsQuery(undefined, {
    skip: !showForm,
  });
  const products = pData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setValue,
    watch,
    getValues,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      projectName: "",
      description: "",
      products: [{ product: "", quantity: "", productId: "" }],
      discussionDone: "",
      instructionRecce: "",
      instructionDesign: "",
      instructionInstallation: "",
      instructionOther: "",
      address: "",
      siteLocation: "",
      expectedRevenue: "",
      remarks: "",
      requirement: "",
    },
  });

  const productsField = watch("products");

  // Update projects when data is fetched
  useEffect(() => {
    if (projectsData.length > 0) {
      setProjects(projectsData || []);
    }
  }, [projectsData]);

  // ======= File Upload Logic =======
  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_TYPES = {
    document: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    image: ["image/jpeg", "image/png", "image/jpg"],
    audio: ["audio/mpeg", "audio/mp3", "audio/wav"],
    video: ["video/mp4", "video/quicktime", "video/x-m4v"],
  };

  const getFileCategory = (type) => {
    if (ALLOWED_TYPES.document.includes(type)) return "document";
    if (ALLOWED_TYPES.image.includes(type)) return "image";
    if (ALLOWED_TYPES.audio.includes(type)) return "audio";
    if (ALLOWED_TYPES.video.includes(type)) return "video";
    return "others";
  };

  const handleFileUpload = (files) => {
    const validFiles = [];
    const maxFiles = 10;

    if (documentUpload.length + files.length > maxFiles) {
      toast.error(`You can only upload maximum ${maxFiles} files`);
      return;
    }

    Array.from(files).forEach((file) => {
      const category = getFileCategory(file.type);
      if (!category) return;

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        return;
      }

      const enhancedFile = Object.assign(file, {
        id: Date.now() + Math.random(),
        category,
      });
      validFiles.push(enhancedFile);
    });

    if (validFiles.length > 0) {
      setDocuments((prev) => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) uploaded successfully`);
    }
  };

  const removeFile = (fileId) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== fileId));
  };

  const groupedFiles = useMemo(() => {
    return documentUpload.reduce((acc, file) => {
      const cat = file.category || "others";
      acc[cat] = acc[cat] || [];
      acc[cat].push(file);
      return acc;
    }, {});
  }, [documentUpload]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // ======= Edit Project Handler =======
  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);

    // Reset form with project data
    reset({
      projectName: project.projectName,
      description: project.projectDescription,
      products: project.products?.map((p) => ({
        product: p.productName || p.name,
        quantity: p.quantity || 1,
        productId: p.productId || "",
      })) || [{ product: "", quantity: "" }],
      discussionDone: project.discussionDone,
      instructionRecce: project.instructionRecce,
      instructionDesign: project.instructionDesign,
      instructionInstallation: project.instructionInstallation,
      instructionOther: project.instructionOther,
      requirement: project.requirement,
      address: project.address,
      siteLocation: project.siteLocation,
      expectedRevenue: project.expectedRevenue,
      remarks: project.remarks,
    });

    // Set existing documents if any
    if (project.documents && project.documents.length > 0) {
      setDocuments(project.documents);
    }
  };

  // ======= Delete Project Handler =======
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const result = await updateProject({
        id: projectId,
        formData: { isDeleted: true },
      }).unwrap();

      if (result.success) {
        toast.success("Project deleted successfully");
        refetchProjects();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  // ======= Submit Handler =======
  const onSubmit = async (data) => {
    if (!clientId) {
      toast.error("Client ID not found");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Prepare project data
      const projectData = {
        clientId,
        projectName: data.projectName,
        projectDescription: data.description,
        products: data.products.map((product) => {
          const selectedProduct = products.find(
            (p) => p.title === product.product
          );
          return {
            productName: product.product,
            quantity: product.quantity,
            productId: selectedProduct?._id || "",
          };
        }),

        discussionDone: data.discussionDone,
        instructionRecce: data.instructionRecce,
        instructionDesign: data.instructionDesign,
        instructionInstallation: data.instructionInstallation,
        instructionOther: data.instructionOther,
        requirement: data.requirement,
        address: data.address,
        siteLocation: data.siteLocation,
        expectedRevenue: data.expectedRevenue,
        remarks: data.remarks,
      };

      // Append project data as JSON
      formData.append("projectData", JSON.stringify(projectData));

      // Append files
      documentUpload.forEach((fileObj) => {
        if (fileObj instanceof Blob && fileObj.name && fileObj.lastModified) {
          formData.append("documents", fileObj);
        }
      });

      let result;
      if (editingProject) {
        // Update project
        result = await updateProject({
          id: editingProject._id,
          formData,
        }).unwrap();
      } else {
        // Create new project
        result = await createProject({ formData }).unwrap();
      }

      if (result?.success) {
        toast.success(
          `Project ${editingProject ? "updated" : "added"} successfully!`
        );
        resetForm();
        refetchProjects();
      } else {
        toast.error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ======= Reset Form =======
  const resetForm = () => {
    reset();
    setDocuments([]);
    setEditingProject(null);
    setShowForm(false);
  };

  const handleFileView = (file) => {
    const isRealFile = file?.name && file?.size && file?.type;

    if (isRealFile) {
      const fileURL = URL.createObjectURL(file);
      return window.open(fileURL, "_blank");
    }

    if (file?.public_url) {
      return window.open(file.public_url, "_blank");
    }

    if (file?.url) {
      const fullURL = `${import.meta.env.VITE_BACKEND_URL}/${file.url}`;
      return window.open(fullURL, "_blank");
    }

    toast.error("File preview not available");
  };

  // Show loading if no clientId
  if (!clientId) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading client information...</p>
        </div>
      </div>
    );
  }

  // ======= UI =======
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-black text-white text-sm rounded-md hover:bg-gray-900 transition"
          >
            <PlusCircle size={16} />
            {showForm ? "Close" : "Add Project"}
          </button>
        </div>

        {/* Loading State */}
        {isLoadingProjects && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading projects...</span>
          </div>
        )}

        {/* Add/Edit Project Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 border-t pt-3"
          >
            {/* Project Name & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
              <div className="grid gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("projectName")}
                    placeholder="Enter project name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                  />
                  {errors.projectName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.projectName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={1}
                    {...register("description")}
                    placeholder="Enter project description"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black resize-vertical"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Selection */}
              <div className="space-y-2 md:col-span-1">
                <label className="block text-sm font-medium mb-1">
                  Product List <span className="text-red-500">*</span>
                </label>
                {productsField.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select
                      {...register(`products.${index}.product`)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                    >
                      <option value="">Select product</option>
                      {products?.map((p) => (
                        <option key={p._id} value={p.title || p.productName}>
                          {p.title || p.productName}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      {...register(`products.${index}.quantity`)}
                      placeholder="Qty"
                      className="w-24 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                    />
                    {productsField.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setValue(
                            "products",
                            productsField.filter((_, i) => i !== index)
                          )
                        }
                        className="text-red-500 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setValue("products", [
                      ...productsField,
                      { product: "", quantity: "" },
                    ])
                  }
                  className="text-sm bg-black text-white rounded-md px-4 py-2 hover:underline"
                >
                  + Add Product
                </button>
                {errors.products && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.products.message}
                  </p>
                )}
              </div>
            </div>

            {/* Discussion & Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3">
              {[
                "discussionDone",
                "requirement",
                "instructionRecce",
                "instructionDesign",
                "instructionInstallation",
                "instructionOther",
              ].map((field) => (
                <div key={field}>
                  <label className="block text-sm capitalize font-medium mb-1">
                    {field === "discussionDone"
                      ? "Discussion Done with Client *"
                      : field.replace("instruction", "Instruction to ")}
                  </label>
                  <textarea
                    rows={2}
                    {...register(field)}
                    placeholder={`Enter ${field}`}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black resize-vertical"
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field].message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Location Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <textarea
                  {...register("address")}
                  rows={1}
                  placeholder="Enter address"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Site Location *
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <textarea
                    {...register("siteLocation")}
                    rows={1}
                    placeholder="Enter site location manually"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const addr = getValues("address");
                      setValue("siteLocation", addr || "", {
                        shouldValidate: true,
                      });
                    }}
                    className="px-3 py-2 text-xs sm:text-sm bg-gray-100 rounded-md border hover:bg-gray-200 whitespace-nowrap"
                  >
                    Same as Address
                  </button>

                  <button
                    type="button"
                    disabled={geoLoading}
                    onClick={() => {
                      setGeoLoading(true);
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          const { latitude, longitude } = pos.coords;
                          setValue(
                            "siteLocation",
                            `${latitude}, ${longitude}`,
                            { shouldValidate: true }
                          );
                          toast.success("Location captured successfully");
                          setGeoLoading(false);
                        },
                        () => {
                          toast.error("Failed to fetch location");
                          setGeoLoading(false);
                        }
                      );
                    }}
                    className="px-3 py-2 text-xs bg-gray-100 rounded-md border hover:bg-gray-200 disabled:opacity-50 whitespace-nowrap"
                  >
                    {geoLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <MapPin size={20} />
                    )}
                  </button>
               
                </div>
                {errors.siteLocation && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.siteLocation.message}
                  </p>
                )}
              </div>
            </div>

            {/* Sales Specific Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3">
              {["expectedRevenue", "remarks"].map((field) => (
                <div key={field} className="">
                  <label className="block capitalize text-sm font-medium mb-1">
                    {field.replace(/([A-Z])/g, " $1")}
                  </label>
                  <input
                    type={field === "remarks" ? "text" : "number"}
                    min={0}
                    {...register(field)}
                    placeholder={`Enter ${field}`}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors[field].message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                Document Upload
                {documentUpload.length > 0 && (
                  <span className="ml-2 text-black">
                    ({documentUpload.length} files)
                  </span>
                )}
              </h3>
              <div className="relative border-2 border-dashed rounded-md p-6 text-center border-gray-300 hover:border-gray-400 transition">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">
                  Drop files here or click to upload
                </p>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, JPG, PNG, MP3, WAV, MP4 up to 10MB each
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.wav,.mp4,.m4v,.mov"
                />
              </div>

              {Object.entries(groupedFiles).map(([category, files]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-semibold capitalize flex items-center">
                    {category} files
                    <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {files.length}
                    </span>
                  </h4>
                  <div className="space-y-1">
                    {files.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex cursor-pointer items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100"
                        onClick={() => handleFileView(doc)}
                      >
                        <div className="flex items-center gap-3">
                          <FileText size={18} />
                          <div>
                            <p className="text-sm font-medium truncate max-w-xs">
                              {doc.name || "Uploaded Document"}
                            </p>
                            {/* <p className="text-xs text-gray-500">
                              {formatFileSize(doc.size)}
                            </p> */}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(doc.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-between pb-2 border-b mt-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 text-sm bg-gray-100 border rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`px-6 py-2 text-sm rounded-md text-white font-medium ${
                  isValid
                    ? "bg-black hover:bg-gray-900"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting
                  ? "Submitting..."
                  : editingProject
                  ? "Update Project"
                  : "Create Project"}
              </button>
            </div>
          </form>
        )}

        {/* Projects List */}
        {!showForm && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Header with Project Code */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.projectName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-gray-100 px-2 py-1.5 rounded-md border border-gray-200">
                      Code:{" "}
                      {project.projectId ||
                        `P-${project._id.toString().slice(-4)}`}
                    </span>
                    <button
                      onClick={() => handleEditProject(project)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-black text-white rounded-md hover:bg-gray-900 transition"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {project.projectDescription}
                </p>

                {/* Product List */}
                <div className="bg-gray-50 p-2 rounded-md border border-gray-100">
                  <p className="text-base font-semibold mb-1">
                    Included Products
                  </p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {project.products?.map((p, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-800 flex items-center justify-between"
                      >
                        <span>
                          {" >"} {p.productName || p.name}
                        </span>
                        {p.quantity && (
                          <span className="text-xs text-gray-600">
                            Qty: {p.quantity}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!showForm && projects.length === 0 && !isLoadingProjects && (
          <div className="text-center py-8">
            <File className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No projects
            </h3>
            <p className="text-gray-500 mb-4">
              Get started by creating a new project.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Create Project
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectTab;
