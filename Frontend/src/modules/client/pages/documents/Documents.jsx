import { useState } from "react";
import DocumentCard from "../../components/documents/DocumentCard";
import InvoiceModal from "../../components/documents/InvoiceModal";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom";

const documents = [
  { title: "Designs", count: 1, icon: "📁" },
  { title: "Mockups", count: 1, icon: "🖼️" },
  { title: "Quotations", count: 1, icon: "📄" },
  { title: "Invoices", count: 1, icon: "🧾" },
  { title: "Warranty", count: 1, icon: "🛡️" },
  { title: "Completion Cert", count: 1, icon: "📜" },
  { title: "AMC", count: 0, icon: "🔄" },
];

export default function Documents() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const handleCardClick = (title) => {
    setActiveModal(title);
  };

  return (
    <div className="">
      {/* Header */}
      <div className="bg-white border rounded-lg p-4 mb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <Icons.ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Document Vault</h1>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.title}
            {...doc}
            onClick={() => handleCardClick(doc.title)}
          />
        ))}
      </div>

      {/* Modals */}
      {activeModal && (
        <InvoiceModal title={activeModal} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
