 
import React, { useState } from "react";
import { Plus } from "lucide-react";
import QuotationListComponent from "./quatation/QuotationListComponent";
import QuotationFormModal from "./quatation/QuotationFormModal";
import InvoiceModal from "./quatation/InvoiceModal";
import { toast } from "react-toastify";
const QuotationComponent = () => {
    const [showFormModal, setShowFormModal] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);

    // Open Quotation Form
    const handleAddNew = () => setShowFormModal(true);
    
    // Close Quotation Form
    const handleFormClose = () => setShowFormModal(false);
    
    // After form submission
    const handleFormSuccess = () => setShowFormModal(false);
    
    // Show Invoice Modal
    const handleViewInvoice = (invoice) => {
        setInvoiceData(invoice);
        setShowInvoiceModal(true);
    };

    // Close Invoice Modal
    const handleInvoiceClose = () => {
        setShowInvoiceModal(false);
        setInvoiceData(null);
    };

    // View PDF in new tab
    const handleViewPDF = (url) => {
        if (!url) {
            toast.error("PDF not available!");
            return;
        }
        window.open(url, "_blank");
    };

    // Download PDF
    const handleDownloadPDF = (url, filename) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
                        <p className="mt-1 text-sm text-gray-500">Manage and create new quotations</p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Quotation
                    </button>
                </div>
                
                <QuotationListComponent
                    onAddNew={handleAddNew}
                    onViewInvoice={handleViewInvoice}
                />
                
                <QuotationFormModal
                    showModal={showFormModal}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
                
                <InvoiceModal
                    showModal={showInvoiceModal}
                    invoiceData={invoiceData}
                    onClose={handleInvoiceClose}
                    onViewPDF={handleViewPDF}
                    onDownloadPDF={handleDownloadPDF}
                />
            </div>
        </div>
    );
};


export default QuotationComponent;
