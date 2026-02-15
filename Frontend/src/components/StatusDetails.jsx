import React from "react";

const StatusDetails = ({
  fromSource,
  details,
  formatDate,
  titleSuffix = "Status Details",
  SectionHeader,
  InfoField,
}) => {
  if (!["flagRaised", "declined", "waiting", "lost"].includes(fromSource)) {
    return null;
  }

  const getTitle = () => {
    switch (fromSource) {
      case "flagRaised":
        return "Flag Raised";
      case "declined":
        return "Declined";
      case "waiting":
        return "Waiting";
      case "lost":
        return "Lost";
      default:
        return "";
    }
  };

  return (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg shadow-md p-5 mb-6">
      <SectionHeader title={`${getTitle()} ${titleSuffix}`} />

      {/* ================= FLAG RAISED ================= */}
      {fromSource === "flagRaised" && (
        <div className="grid grid-cols-4 gap-x-6">
          <InfoField label="Flag Type" value={details?.flagDetail?.type || "-"} />
          <InfoField
            label="Flag Date"
            value={formatDate(details?.flagDetail?.raisedAt)}
          />
          <InfoField
            label="Department"
            value={details?.flagDetail?.department}
          />
          <InfoField
            label="Person Name"
            value={details?.flagDetail?.raisedBy?.name}
          />
          <InfoField
            label="Designation"
            value={details?.flagDetail?.raisedBy?.role}
          />
          <div className="col-span-3">
            <InfoField
              label="Remark"
              value={details?.flagDetail?.remark}
              fullWidth
            />
          </div>
        </div>
      )}

      {/* ================= DECLINED ================= */}
      {fromSource === "declined" && (
        <div className="grid grid-cols-4 gap-x-6">
          <InfoField
            label="Department"
            value={
              details?.declineDetail?.declinedBy?.role ||
              details?.declineDetail?.department
            }
          />
          <InfoField
            label="Date"
            value={formatDate(details?.declineDetail?.declinedAt)}
          />
          <InfoField
            label="Person Name"
            value={details?.declineDetail?.declinedBy?.name}
          />
          <InfoField
            label="Designation"
            value={details?.declineDetail?.declinedBy?.role}
          />
          <InfoField label="Status" value="Declined" />
          <div className="col-span-3">
            <InfoField
              label="Remark"
              value={
                details?.declineDetail?.remark ||
                details?.declineDetail?.reason
              }
              fullWidth
            />
          </div>
        </div>
      )}

      {/* ================= WAITING ================= */}
      {fromSource === "waiting" && (
        <div className="grid grid-cols-4 gap-x-6">
          <InfoField
            label="Department"
            value={details?.waitingDetail?.department}
          />
          <InfoField
            label="Date"
            value={formatDate(details?.waitingDetail?.since)}
          />
          <InfoField
            label="Person Name"
            value={details?.waitingDetail?.markedBy}
          />
          <InfoField
            label="Designation"
            value={details?.waitingDetail?.designation || "-"}
          />
          <InfoField label="Status" value="Waiting" />
          <div className="col-span-3">
            <InfoField
              label="Remark"
              value={
                details?.waitingDetail?.remark ||
                details?.waitingDetail?.reason
              }
              fullWidth
            />
          </div>
        </div>
      )}

      {/* ================= LOST ================= */}
      {fromSource === "lost" && (
        <div className="grid grid-cols-4 gap-x-6">
          <InfoField
            label="Department"
            value={details?.lostDetail?.department}
          />
          <InfoField
            label="Person Name"
            value={details?.lostDetail?.markedBy}
          />
          <InfoField
            label="Date"
            value={formatDate(details?.lostDetail?.lostAt)}
          />
          <InfoField
            label="Designation"
            value={details?.lostDetail?.designation || "-"}
          />
          <div className="col-span-4">
            <InfoField
              label="Reason"
              value={details?.lostDetail?.reason}
              fullWidth
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDetails;
