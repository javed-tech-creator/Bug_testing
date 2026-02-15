import {
  ArrowLeft,
  Calendar,
  User,
  Ruler,
  FileText,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../../components/dynamic/StatusBadge";
import PageHeader from "../../components/dynamic/PageHeader";

const ReccePage = () => {
  const navigate = useNavigate();

  /* ===============================
     DUMMY RECCE DATA
  ================================ */
  const recceData = {
    date: "12 Feb 2024",
    executive: "Amit Verma",
    status: "completed",
  images: [
  "https://picsum.photos/800/600?random=1",
  "https://picsum.photos/800/600?random=2",
  "https://picsum.photos/800/600?random=3",
  "https://picsum.photos/800/600?random=4",
],

    measurements: [
      "Front facade width: 32 ft",
      "Entrance height: 14 ft",
      "Reception wall width: 18 ft",
    ],
    notes:
      "Electrical point available near entrance. Night installation required. Scaffolding access confirmed.",
  };

  return (
    <div className="">
      {/* ================= HEADER ================= */}

      <PageHeader
        title="Recce Details"
        showStatusBadge={true}
        status={`${recceData.status}`}
      />

      {/* ================= BASIC INFO ================= */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5 shadow">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-blue-600" size={20} />
            <p className="text-sm font-semibold text-blue-800">Recce Date</p>
          </div>
          <p className="text-lg font-bold text-blue-900">{recceData.date}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-5 shadow">
          <div className="flex items-center gap-3 mb-2">
            <User className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-800">
              Recce Executive
            </p>
          </div>
          <p className="text-lg font-bold text-emerald-900">
            {recceData.executive}
          </p>
        </div>
      </div>

      {/* ================= MEASUREMENTS + NOTES ================= */}
      <div className="grid lg:grid-cols-2 gap-6  mb-6">
        {/* Measurements */}
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Ruler size={20} className="text-purple-500" />
            Key Measurements
          </h3>

          <ul className="space-y-3">
            {recceData.measurements.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <CheckCircle size={16} className="text-emerald-500 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Notes */}
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-orange-500" />
            Installation Notes
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 border rounded-md p-4">
            {recceData.notes}
          </p>
        </div>
      </div>

      {/* ================= SITE IMAGES ================= */}
      <div className="bg-white border rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ImageIcon size={20} className="text-indigo-500" />
          Site Images
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recceData.images.map((img, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border hover:shadow-md transition"
            >
              <img
                src={img}
                alt="Site"
                className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReccePage;
