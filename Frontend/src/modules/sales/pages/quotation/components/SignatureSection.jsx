const SignatureSection = () => {
  return (
    <div className="flex justify-between mt-20 pt-8 items-end px-2">
      {/* LEFT SIDE - DSS */}
      <div className="flex flex-col w-64">
        <div className="mb-2 pl-2">
          <img
            src="/dss_logo.webp"
            alt="DSS Signature"
            className="h-14 object-contain -ml-2 filter grayscale brightness-50 contrast-125"
          />
        </div>

        <div className="border-t border-gray-800 w-full"></div>

        <div className="flex justify-between items-baseline mt-1.5">
          <span className="text-[11px] font-bold text-gray-900">
            DSS Signage Solutions
          </span>
          <span className="text-[10px] text-gray-500">Date: 24 Dec 25</span>
        </div>

        <div className="text-[10px] text-gray-500 mt-0.5">
          Authorized Signatory
        </div>
      </div>

      {/* RIGHT SIDE - CLIENT */}
      <div className="flex flex-col w-64 items-end">
        <div className="mb-2 flex justify-center h-16 w-full items-end pr-4">
          {/* Client Signature SVG */}
          <svg
            viewBox="0 0 200 100"
            className="h-full w-40"
            fill="none"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M60,90 C70,50 50,20 80,10 C90,40 85,70 100,80 C120,30 140,20 150,50 C160,80 170,85 190,80" />
            <path d="M40,70 L180,70" strokeOpacity="0.1" strokeWidth="1" />
          </svg>
        </div>

        <div className="border-t border-gray-800 w-full"></div>

        <div className="flex justify-between items-baseline mt-1.5 w-full">
          <span className="text-[11px] font-bold text-gray-900">
            Client Acceptance
          </span>
          <span className="text-[10px] text-gray-500">Date: 24 Dec 25</span>
        </div>

        <div className="text-[10px] text-gray-500 mt-0.5 w-full text-left">
          Authorized Signatory
        </div>
      </div>
    </div>
  );
};

export default SignatureSection;