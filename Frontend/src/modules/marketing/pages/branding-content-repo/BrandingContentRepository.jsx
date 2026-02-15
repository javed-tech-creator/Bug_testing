import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  Download,
  Edit,
  Plus,
  Grid,
  List,
  Crown,
  FileText,
  Video,
  Camera,
  Palette,
  CheckCircle,
  XCircle,
  Sparkles,
  FileImage,
  File,
  Trash,
} from "lucide-react";
import { FiUpload } from "react-icons/fi";
import Pagination from "../../components/branding-content-repo/GetPageNumber";
import { useGetCampaignlListsQuery } from "@/api/marketing/campaignManagement.api";
import {
  useCreateBrandMutation,
  useGetBrandsQuery,
  useGetCategoryCountsQuery,
  useSoftDeleteBrandMutation,
  useUpdateBrandMutation,
} from "@/api/marketing/brandRepo.api";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import { formatFileSize } from "@/utils/dataSize";
import ConfirmDialog from "@/components/ConfirmationToastPopUp";
import FilePreviewModal from "../../components/branding-content-repo/FilePreviewModal";

export default function BrandingContentRepository() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [notification, setNotification] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTargetId, setEditTargetId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [previewAsset, setPreviewAsset] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // fetching campaign Lists
  const { data: CampaignLists, isLoading: loadingCampaignLists } =
    useGetCampaignlListsQuery();

  // sending form data into backend
  const [createBrand, { isLoading: loadingCreateBrand }] =
    useCreateBrandMutation();

  // fetching all assets based on filter
  const { data: brandAssets, isLoading: loadingBrandAssets, isFetching} =
    useGetBrandsQuery({
      campaignId: selectedCampaign || undefined,
      category: selectedCategory,
      page: currentPage,
      limit: itemsPerPage,
    });

const totalPages = brandAssets?.total
  ? Math.ceil(brandAssets.total / itemsPerPage)
  : 1;


  // delete api
  const [softDeleteBrand, { isLoading: deleteBrandLoading }] =
    useSoftDeleteBrandMutation();

  // update api
  const [updateBrand, { isLoading: updateBrandLoading }] =
    useUpdateBrandMutation();

  // Get all category count
  const { data: categoryCount, isLoading } = useGetCategoryCountsQuery();

  const categorydata = categoryCount?.data;
  const campaigns = CampaignLists?.campaigns;

  // data filter karna
const filteredAssets = useMemo(() => {
  return (brandAssets?.data || []).filter((asset) =>
    asset?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [brandAssets, searchQuery]);


  // ---------- STATE ----------
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    campaignId: "",
    file: null,
    previewUrl: null,
  });

  // ---------- HANDLERS ----------
  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    if (formData.previewUrl) URL.revokeObjectURL(formData.previewUrl);
    setFormData({
      title: "",
      category: "",
      campaignId: "",
      file: null,
      previewUrl: null,
    });
    setIsEditMode(false);
    setEditTargetId(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (formData.previewUrl) URL.revokeObjectURL(formData.previewUrl);
    const url = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      file,
      previewUrl: url,
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.campaignId || !formData.category) {
      toast.error("All fields (title, campaign, category) are required");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("campaignId", formData.campaignId);
      if (formData.file) {
        payload.append("file", formData.file);
      }

      if (isEditMode && editTargetId) {
        //  Update Mode
        const result = await updateBrand({
          id: editTargetId,
          data: payload,
        }).unwrap();

        toast.success(result.message || "Asset updated successfully!");
      } else {
        //  Create Mode
        await createBrand(payload).unwrap();
        toast.success("Asset uploaded successfully!");
      }

      resetForm();
      setShowUploadModal(false);
      setIsEditMode(false);
      setEditTargetId(null);
    } catch (err) {
      console.error("Upload/Update failed:", err);
      toast.error(err?.data?.message || "Failed to save asset");
    }
  };

  // categoryCounts = backend se aaya data
  const getCount = (categoryCounts, cat) => {
    return categoryCounts?.find((item) => item.category === cat)?.count || 0;
  };

  const categories = [
    {
      id: "Logo",
      name: "Logo",
      icon: Crown,
      count: getCount(categorydata, "Logo"),
    },
    {
      id: "Brochure",
      name: "Brochure",
      icon: FileText,
      count: getCount(categorydata, "Brochure"),
    },
    {
      id: "Video",
      name: "Videos",
      icon: Video,
      count: getCount(categorydata, "Video"),
    },
    {
      id: "Photo",
      name: "Product Photos",
      icon: Camera,
      count: getCount(categorydata, "Photo"),
    },
    {
      id: "Creative",
      name: "Creatives",
      icon: Sparkles,
      count: getCount(categorydata, "Creative"),
    },
  ];

  const getFileIcon = (type) => {
    const ext = type.toLowerCase();

    switch (ext) {
      case "pdf":
        return <FileText className="w-12 h-12 text-red-500" />;
      case "video/mp4":
      case "video/mov":
        return <Video className="w-12 h-12 text-green-500" />;
      case "image/jpg":
      case "image/jpeg":
      case "image/png":
      case "image/svg":
        return <FileImage className="w-12 h-12 text-blue-500" />;
      default:
        return <File className="w-12 h-12 text-gray-500" />;
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const handleEdit = (asset) => {
    setIsEditMode(true);
    setEditTargetId(asset._id);
    setShowUploadModal(true);

    setFormData({
      title: asset.title || "",
      category: asset.category || "",
      campaignId: asset.campaignId?._id || asset.campaignId || "",
      file: null, //
      previewUrl: asset.file?.url || null,
    });
  };

  // file view
  const handleView = (asset) => {
    setPreviewAsset(asset);
    setIsPreviewOpen(true);
  };

  //  File Download Handler
  const handleDownload = async (asset) => {
    if (!asset?.file?.url) {
      toast.warn("File not available for download");
      return;
    }

    setDownloadingId(asset._id); // start loading

    try {
      const response = await fetch(asset.file.url);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = asset.file.name || `${asset.title || "file"}`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      // cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`${asset.title} downloaded successfully!`);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(error?.message || "Download failed. Please try again.");
    } finally {
      setDownloadingId(null); // stop loading
    }
  };

  const handleDelete = (asset) => {
    setDeleteTarget(asset); // kis asset ko delete karna hai
    setOpenDialog(true); // confirm dialog open karo
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      const result = await softDeleteBrand(deleteTarget._id).unwrap();
      console.log("delete method problem", result);

      if (result?.success) {
        toast.success(result.message || "Asset deleted successfully!");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete Asset.");
    } finally {
      setOpenDialog(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 mb-6 shadow-md flex justify-between">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Brand Repository
            </h1>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg text-sm"
        >
          <Plus className="w-4 h-4" />
          Upload Asset
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          const gradients = [
            "from-blue-500 to-cyan-500",
            "from-pink-500 to-rose-500",
            "from-green-500 to-teal-500",
            "from-purple-500 to-indigo-500",
            "from-orange-500 to-yellow-500",
          ];
          return (
            <div
              key={category.id}
              className="bg-white/95 backdrop-blur-lg rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                {/* Left Side (Title + Value) */}
                <div>
                  <div className="text-sm text-gray-500 font-medium">
                    {category.name}
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mt-1">
                    {category.count}
                  </div>
                </div>

                {/* Right Side (Icon) */}
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${gradients[index]} rounded-lg flex items-center justify-center`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl space-y-8">
            {/* Campaign Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Campaigns
              </h3>
              <div className="relative">
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 
                       focus:border-purple-500 focus:ring-2 focus:ring-purple-200 
                       outline-none transition-all cursor-pointer shadow-sm"
                >
                  {loadingCampaignLists ? (
                    <option>Loading campaigns...</option>
                  ) : (
                    <>
                      <option key="123" value="">
                        All Campaign
                      </option>
                      {campaigns?.map((camp) => (
                        <option key={camp._id} value={camp._id}>
                          {camp.campaignName}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  key="213"
                  onClick={() => setSelectedCategory("")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium 
                           transition-all duration-200 shadow-sm ${
                             !selectedCategory
                               ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
                               : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                           }`}
                >
                  <Grid className="w-5 h-5" />
                  <span className="flex-1 text-left">All Assets</span>
                  {selectedCategory === "" && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full bg-white/20 text-white`}
                    >
                      {brandAssets?.total || 0}
                    </span>
                  )}
                </button>

                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium 
                           transition-all duration-200 shadow-sm ${
                             selectedCategory === category.id
                               ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md"
                               : "text-gray-600 bg-gray-50 hover:bg-gray-100"
                           }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="flex-1 text-left">{category.name}</span>
                      {selectedCategory === category.id && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            selectedCategory === category.id
                              ? "bg-white/20 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {brandAssets?.total || 0}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Assets Grid + Pagination */}
        <div className="lg:col-span-3">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
            {/* Header (Total + Search + View Toggle) */}
            <div className="flex justify-between items-center mb-6">
              <div className="bg-gray-100 text-gray-700 px-4 py-1 rounded text-sm font-semibold shadow-sm flex items-center gap-1">
                <span>Total:</span>
                <span>{brandAssets?.total}</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg 
                         focus:border-purple-500 focus:outline-none transition-colors w-56 text-sm"
                  />
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Assets */}
            {loadingBrandAssets || isFetching ? (
              // Loader while fetching
              <div className="flex flex-col justify-center items-center py-24">
                <FaSpinner className="animate-spin text-purple-500 w-12 h-12 mb-4" />
                <p className="text-gray-600 font-medium">Loading assets...</p>
              </div>
            ) : (
              <>
                {/* Assets */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset._id}
                      className={`bg-white border-2 border-gray-100 hover:border-purple-300 
                rounded-2xl overflow-hidden shadow-lg hover:shadow-xl 
                transition-all duration-300 transform hover:-translate-y-1 
                ${viewMode === "list" ? "flex items-center p-4" : ""}`}
                    >
                      {/* Preview */}
                      <div
                        className={`bg-gray-50 flex items-center justify-center overflow-hidden ${
                          viewMode === "grid"
                            ? "h-48 rounded-xl"
                            : "w-20 h-20 rounded-xl mr-4"
                        }`}
                      >
                        {asset?.file?.url ? (
                          asset?.file?.type?.startsWith("image/") ? (
                            //  Image Preview
                            <img
                              src={asset.file.url}
                              alt={asset.title}
                              className="w-full h-full object-cover"
                            />
                          ) : asset?.file?.type?.startsWith("video/") ? (
                            //  Video Preview
                            <video
                              src={asset.file.url}
                              controls
                              className="w-full h-full object-cover"
                            />
                          ) : asset?.file?.type === "application/pdf" ? (
                            //  PDF Preview
                            <iframe
                              src={asset.file.url}
                              title={asset.title}
                              className="w-full h-full rounded-lg"
                            ></iframe>
                          ) : (
                            // 📁 Other file types → show icon
                            getFileIcon(asset?.file?.type)
                          )
                        ) : (
                          getFileIcon(asset?.file?.type)
                        )}
                      </div>

                      {/* Info */}
                      <div className={viewMode === "grid" ? "p-6" : "flex-1"}>
                        <div
                          className={`flex justify-between items-start mb-3 ${
                            viewMode === "list" ? "items-center" : ""
                          }`}
                        >
                          <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">
                            {asset.title}
                          </h3>
                        </div>

                        <div
                          className={`flex justify-between text-sm text-gray-500 mb-4 ${
                            viewMode === "list" ? "items-center" : ""
                          }`}
                        >
                          <span className="px-2 py-1 bg-gray-100 rounded-lg">
                            {asset.category.charAt(0).toUpperCase() +
                              asset.category.slice(1)}
                          </span>
                          <span>{formatFileSize(asset.file.size)}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleView(asset)}
                              className="p-2 bg-blue-100 cursor-pointer hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownload(asset)}
                              disabled={downloadingId === asset._id}
                              className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                                downloadingId === asset._id
                                  ? "bg-green-200 text-green-400 cursor-not-allowed"
                                  : "bg-green-100 hover:bg-green-200 text-green-600"
                              }`}
                              title="Download"
                            >
                              {downloadingId === asset._id ? (
                                <FaSpinner className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              onClick={() => handleDelete(asset)}
                              className="p-2 bg-orange-100 cursor-pointer hover:bg-orange-200 text-orange-600 rounded-lg transition-colors"
                              title="Share Link"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(asset)}
                              className="p-2 bg-purple-100 cursor-pointer hover:bg-purple-200 text-purple-600 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>

                          {viewMode === "list" && (
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>
                                {new Date(asset.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Results */}
                {filteredAssets.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No assets found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                )}

                {/* ---------- PAGINATION (Now inside Assets Grid) ---------- */}
                {filteredAssets.length > 0 && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
              {/* ---------- HEADER (Fixed) ---------- */}
              <div className="flex justify-between items-center px-8 py-4 border-b sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-800 flex gap-2 items-center">
                  <FiUpload className="text-orange-500" />
                  {isEditMode ? "Update Asset" : "Upload New Asset"}
                </h2>

                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-7 h-7 text-gray-500 hover:text-red-500" />
                </button>
              </div>

              {/* ---------- BODY (Scrollable) ---------- */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
                <form className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Enter asset title..."
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 
           focus:border-orange-400 focus:ring-2 focus:ring-orange-200 
           focus:outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 
       focus:border-orange-400 focus:ring-2 focus:ring-orange-200 
       focus:outline-none transition-all"
                      required
                    >
                      {/* Placeholder */}
                      <option value="" disabled hidden>
                        -- Select Category --
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Campaign */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Campaign
                    </label>
                    <select
                      value={formData.campaignId}
                      onChange={(e) =>
                        handleChange("campaignId", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 
       focus:border-orange-400 focus:ring-2 focus:ring-orange-200 
       focus:outline-none transition-all"
                      required
                    >
                      {/* Placeholder */}
                      <option value="" disabled hidden>
                        -- Select Campaign --
                      </option>
                      {campaigns.map((camp) => (
                        <option key={camp._id} value={camp._id}>
                          {camp.campaignName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* File Upload + Preview */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      File
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 
              text-center cursor-pointer hover:border-orange-400 
              hover:bg-orange-50 transition-all"
                    >
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                        required
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <FiUpload className="w-10 h-10 text-orange-500 mb-2" />
                        <span className="text-gray-600">
                          Drag & Drop your file here
                        </span>
                        <span className="text-sm text-gray-400">
                          or click to browse
                        </span>
                      </label>
                    </div>

                    {/* Preview Section */}
                    {formData.previewUrl && (
                      <div className="mt-4 p-4 border rounded-xl bg-gray-50 flex flex-col items-center w-full">
                        <p className="text-gray-700 font-medium mb-3">
                          Preview:
                        </p>

                        {/* Video Preview */}
                        {formData.previewUrl.endsWith(".mp4") ||
                        formData.file?.type?.startsWith("video/") ? (
                          <video
                            src={formData.previewUrl}
                            controls
                            className="max-h-60 rounded-lg shadow-md"
                          />
                        ) : /* PDF Preview */
                        formData.previewUrl.endsWith(".pdf") ||
                          formData.file?.type === "application/pdf" ? (
                          <iframe
                            src={formData.previewUrl}
                            title="PDF Preview"
                            className="w-full h-96 rounded-lg shadow-md"
                          ></iframe>
                        ) : formData.file?.type?.startsWith("image/") ||
                          formData.previewUrl.match(
                            /\.(jpg|jpeg|png|gif|webp)$/i
                          ) ? (
                          //  Image Preview
                          <img
                            src={formData.previewUrl}
                            alt="Preview"
                            className="max-h-60 rounded-lg shadow-md object-contain"
                          />
                        ) : (
                          //  Unknown File
                          <div className="p-3 text-gray-600 text-sm">
                            <span className="font-semibold">File:</span>{" "}
                            {formData.file?.name || "Unsupported file type"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* ---------- FOOTER (Fixed) ---------- */}
              <div className="flex justify-end gap-4 px-8 py-4 border-t sticky bottom-0 bg-white z-10">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={loadingCreateBrand}
                  className={`px-6 py-2.5 rounded-xl text-white font-medium transition-colors shadow-md flex items-center justify-center gap-2 
    ${
      loadingCreateBrand
        ? "bg-orange-400 cursor-not-allowed"
        : "bg-orange-500 hover:bg-orange-600"
    }`}
                >
                  {loadingCreateBrand || updateBrandLoading ? (
                    <FaSpinner className="w-5 h-5 animate-spin" />
                  ) : isEditMode ? (
                    "Update"
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 animate-slide-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              {notification}
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>

        {/* delete  */}
        <ConfirmDialog
          open={openDialog}
          title="Confirm Delete"
          message={`Are you sure you want to delete this ${deleteTarget?.category}?`}
          onConfirm={confirmDelete}
          isLoading={deleteBrandLoading}
          onCancel={() => setOpenDialog(false)}
        />

        {/* preview modal */}
        <FilePreviewModal
          open={isPreviewOpen}
          asset={previewAsset}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewAsset(null);
          }}
        />
      </div>
    </div>
  );
}
