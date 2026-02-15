import React, { useRef, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import {
  useAddAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetAllAnnouncementsQuery,
  useUpdateAnnouncementMutation,
} from "../../rtk/announcementApi";

const Announcement1 = () => {
  const topRef = useRef(null);

  const { data: announcements, isLoading } = useGetAllAnnouncementsQuery();
  const [addAnnouncement, { isLoading: isAdding }] =
    useAddAnnouncementMutation();
  const [updateAnnouncement, { isLoading: isUpdating }] =
    useUpdateAnnouncementMutation();
  const [deleteAnnouncement, { isLoading: isDeleting }] =
    useDeleteAnnouncementMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    priority: "medium",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAnnouncement({ id: editingId, data: formData }).unwrap();
        setEditingId(null);
      } else {
        await addAnnouncement(formData).unwrap();
      }
      setFormData({ title: "", message: "", priority: "medium" });
      setShowForm(false);
    } catch (error) {
      alert(error?.message || "Something went wrong");
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title || "",
      message: announcement.message || "",
      priority: announcement.priority || "medium",
    });
    setEditingId(announcement._id);
    setShowForm(true);

    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteAnnouncement({ id }).unwrap();
      } catch (error) {
        alert(error?.message || "Failed to delete announcement");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ title: "", message: "", priority: "medium" });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={32} color="#06425F" />
      </div>
    );
  }

  return (
    <div ref={topRef} className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-600">
          Stay updated with the latest announcements and notices
        </p>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {editingId ? "Edit Announcement" : "Add New Announcement"}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06425F] focus:border-[#06425F] transition-colors resize-none"
                placeholder="Enter your announcement message"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isAdding || isUpdating}
                className="flex items-center bg-[#06425F] text-white px-6 py-3 rounded-lg hover:bg-[#04364b] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isAdding || isUpdating ? (
                  <ClipLoader size={16} color="white" className="mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-6">
        {announcements && announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {announcement.message?.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {announcement.createdAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(announcement.createdAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* Edit and Delete buttons are commented out as in original */}
                </div>
              </div>

              <div
                className={`text-gray-700 leading-relaxed ${
                  viewingId === announcement.id ? "" : "line-clamp-2"
                }`}
              >
                {announcement.content}
              </div>

              {viewingId === announcement.id && announcement.content && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-[#06425F]">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Full Content:
                    </span>
                  </div>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No announcements found
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first announcement to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcement1;
