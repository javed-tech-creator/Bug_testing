import { ArrowLeft, Calendar, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DesignSimpleHeader = ({
  title,
  funnel=false,
   assign=false,
  showDesignStarted,
  designStarted,
  showMockupStarted,
  showMockupApproved,
  DesignMeasurementForQuotation,
  MockupApproved,
  MockupStarted,
  designApproved,
  CompletedOn,
  showLog,
  clientDiscussionLog,
}) => {
  const navigate = useNavigate();

  return (
    <div className=" sticky -top-2 z-30 flex items-center justify-between bg-white shadow-md rounded-sm px-4 py-3 border my-5">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 border cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>

        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="flex items-center gap-3 ">
        {/* Design ID */}
        {showDesignStarted && designStarted && (
          <div className="bg-blue-700 text-white px-4 py-2 rounded-sm text-sm font-medium border border-blue-200">
            Design Started Date :{" "}
            <span className="font-normal">{designStarted}</span>
          </div>
        )}

         {DesignMeasurementForQuotation && (
          <div className="bg-blue-700 text-white px-4 py-2 rounded-sm text-sm font-medium border border-blue-200">
          Started Date :{" "}
            <span className="font-normal">{DesignMeasurementForQuotation}</span>
          </div>
        )}

        {/* Mockup user ID */}
        {showMockupStarted && MockupStarted && (
          <div className="bg-blue-700 text-white px-4 py-2 rounded-sm text-sm font-normal border border-blue-200">
            Mockup Started Date :{" "}
            <span className="font-normal">{MockupStarted}</span>
          </div>
        )}

        {/* Mockup approved ID */}   
        {showMockupApproved && MockupApproved && (
          <div className="bg-blue-700 text-white px-4 py-2 rounded-sm text-sm font-normal border border-blue-200">
            Mockup Approved Date :{" "}
            <span className="font-normal">{MockupStarted}</span>
          </div>
        )}

        {designApproved && (
          <div className="bg-green-700 text-white px-4 py-2 rounded-sm text-sm font-normal border border-green-200">
            Approved Date :{" "}
            <span className="font-normal">{designApproved}</span>
          </div>
        )}

        {CompletedOn && (
           <div className="bg-green-700 text-white px-4 py-2 rounded-sm text-sm font-normal border border-green-200">
            Completed On :{" "}
            <span className="font-normal">{CompletedOn}</span>
          </div>
        )}

        {showLog && (
          <button
            onClick={clientDiscussionLog}
            className="py-1.5 px-4 rounded-md bg-blue-600 text-white  hover:bg-blue-700 border cursor-pointer"
          >
             Discussion Logs
          </button>
        )}

          {funnel && (
          <button
            onClick={()=> navigate("/design/funnel")}
            className="py-1.5 px-4 rounded-sm bg-orange-500 text-white  hover:bg-orange-600 border cursor-pointer"
          >
             View Funnel
          </button>
        )}

          {assign && (
          <button
            onClick={()=> navigate("/design/manager/designs/received")}
            className="py-1.5 px-4 rounded-sm bg-blue-600 text-white  hover:bg-blue-700 border cursor-pointer"
          >
             Assign Design
          </button>
        )}
      </div>
    </div>
  );
};

export default DesignSimpleHeader;
