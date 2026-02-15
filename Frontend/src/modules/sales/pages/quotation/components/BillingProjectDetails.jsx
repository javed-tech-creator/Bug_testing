const BillingProjectDetails = () => {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden mx-6 mb-10">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <h3 className="text-white text-sm font-semibold tracking-wide uppercase">
          Billing & Project Details
        </h3>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
        {/* LEFT - Client Details */}
        <div className="space-y-4">
          <div>
            <p className="text-[11px] text-gray-500 uppercase">Client Name</p>
            <p className="text-base font-semibold text-gray-800">
              Abusoac Singh
            </p>
            <p className="text-sm text-gray-600">Abcxyz Pvt Ltd</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[11px] text-gray-500 uppercase">Client Code</p>
              <p className="font-medium text-gray-800">CL-2981</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase">
                Project Code
              </p>
              <p className="font-medium text-gray-800">PR-87432</p>
            </div>
          </div>

          <div>
            <p className="text-[11px] text-gray-500 uppercase">
              Billing Address
            </p>
            <p className="text-sm text-gray-700">
              Abc Nagar, Lucknow, Uttar Pradesh
            </p>
          </div>
        </div>

        {/* RIGHT - Invoice Details */}
        <div className="bg-gray-50 rounded-xl p-5 space-y-3 border">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Invoice No</span>
            <span className="font-semibold text-gray-800">INV-175</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Invoice Date</span>
            <span className="font-semibold text-gray-800">24 Oct 2025</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Due Date</span>
            <span className="font-semibold text-gray-800">25 Oct 2025</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-800">client@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingProjectDetails;