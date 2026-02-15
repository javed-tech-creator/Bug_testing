import { InfoField } from "./InfoField";

const ProjectInformation = ({projectInfo,recceRemark}) => {
  return (
    <div className="bg-white border rounded-sm shadow-sm">
      {/* HEADER */}
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">Project Information</h2>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-4">
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectInfo.map((item, index) => (
            <InfoField
              key={index}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>

        {/* REMARK */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            Recce Notes / Remark
          </p>
          <div className="bg-gray-50 border rounded-sm px-3 py-3 text-sm text-gray-700">
            {recceRemark}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInformation;
