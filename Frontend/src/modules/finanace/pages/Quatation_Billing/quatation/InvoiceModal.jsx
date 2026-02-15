import React from "react";
import { X, Eye, Download } from "lucide-react";

const InvoiceModal = ({ showModal, invoiceData, onClose, onViewPDF, onDownloadPDF }) => {
    if (!showModal || !invoiceData) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
                
                {/* This element is to trick the browser into centering the modal contents */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                {/* Modal container */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full z-50 relative">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Invoice Details</h3>
                                    <button
                                        type="button"
                                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                        onClick={onClose}
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Invoice ID</h4>
                                        <p className="text-lg font-semibold text-gray-900">{invoiceData.invoiceId}</p>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Grand Total</h4>
                                        <p className="text-lg font-semibold text-gray-900">₹{invoiceData.grandTotal?.toLocaleString('en-IN')}</p>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Status</h4>
                                        <p className={`text-lg font-semibold ${
                                            invoiceData.paymentStatus === 'Paid' ? 'text-green-600' : 
                                            invoiceData.paymentStatus === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                            {invoiceData.paymentStatus}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Action Buttons */}
                                {invoiceData.pdfUrl && (
                                    <div className="flex gap-3 mb-5">
                                        <button
                                            onClick={() => onViewPDF(invoiceData.pdfUrl)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            View PDF
                                        </button>
                                        <button
                                            onClick={() => onDownloadPDF(invoiceData.pdfUrl, `Invoice-${invoiceData.invoiceId}.pdf`)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download PDF
                                        </button>
                                    </div>
                                )}
                                
                                {/* PDF Viewer */}
                                {invoiceData.pdfUrl && (
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                            <h4 className="text-sm font-medium text-gray-700">Document Preview</h4>
                                        </div>
                                        <div className="p-1 bg-gray-100">
                                            <iframe
                                                src={invoiceData.pdfUrl}
                                                title={`Invoice: ${invoiceData.invoiceId}`}
                                                width="100%"
                                                height="600px"
                                                className="border border-gray-300 rounded"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default InvoiceModal;