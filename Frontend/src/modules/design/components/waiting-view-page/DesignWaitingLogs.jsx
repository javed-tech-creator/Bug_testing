const DesignWaitingLogs = ({waitingLogsData}) => {
  const log = waitingLogsData;

  return (
    <div className="bg-white rounded-sm border shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Design Waiting Logs</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Top Fields */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Field label="Waiting Status">
            <input
              readOnly
              value={log.status}
              className="w-full px-3 py-2 border rounded-sm bg-gray-50 text-red-600 font-semibold"
            />
          </Field>

          <Field label="1st Asking Date" value={log.askingDate} />
          <Field label="Waiting Time" value={log.waitingTime} />
          <Field label="Last Updated Date" value={log.lastUpdated} />
        </div>

        {/* Discussions */}
        {log.discussions.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Field label="Discussion Date" value={item.date} />
            <div className="md:col-span-3">
              <Field label="Discussion Summary" value={item.summary} />
            </div>
          </div>
        ))}

        {/* Remark */}
        <div>
          <label className="block text-sm font-medium mb-1">Remark</label>
          <textarea
            readOnly
            rows={3}
            value={log.remark}
            className="w-full px-3 py-2 border rounded-sm text-gray-700 bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
};

export default DesignWaitingLogs;

const Field = ({ label, value, children }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    {children ? (
      children
    ) : (
      <input
        readOnly
        value={value}
        className="w-full px-3 py-2 border rounded-sm text-gray-700 bg-gray-50"
      />
    )}
  </div>
);
