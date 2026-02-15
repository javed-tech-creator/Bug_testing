import React from "react";
import { useParams } from "react-router-dom";
import Loader from "@/components/Loader";

const SectionTitle = ({ title }) => (
  <h3 className="text-lg font-bold text-black mb-3">{title}</h3>
);
const Label = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-700 mb-1">
    {children}
  </label>
);
const Input = ({ value }) => (
  <input
    type="text"
    value={value || ""}
    readOnly
    className="w-full text-sm border border-gray-200 rounded px-3 py-2 text-gray-700 bg-gray-50 cursor-not-allowed"
  />
);

const CompletedRecceDetail = () => {
  const { id } = useParams();
  const isLoading = false;
  const recce = data?.data || [];
  if (isLoading) return <Loader />;
  if (!recce) {
    console.warn("No recce found for id:", id);
    return <div className="p-6">No data found for this recce.</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <SectionTitle title="Step 1: Installation Details" />
      <div className="bg-white rounded shadow p-4 mb-6 border">
        {recce.installationDetails &&
        Object.values(recce.installationDetails).some((v) => v) ? (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(recce.installationDetails).map(([key, value]) => (
              <div key={key}>
                <Label>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Label>
                <Input value={value} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">
            No installation details available.
          </div>
        )}
      </div>

      <SectionTitle title="Step 2: Data & Instruction" />
      <div className="bg-white rounded shadow p-4 mb-6 border">
        {recce.dataInstruction &&
        Object.values(recce.dataInstruction).some(
          (v) => v && (Array.isArray(v) ? v.length : v),
        ) ? (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(recce.dataInstruction).map(([key, value]) => (
              <div key={key}>
                <Label>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Label>
                {Array.isArray(value) ? (
                  value.length ? (
                    value.map((v, i) => (
                      <Input key={i} value={JSON.stringify(v)} />
                    ))
                  ) : (
                    <Input value="--" />
                  )
                ) : (
                  <Input value={value} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">No data/instruction available.</div>
        )}
      </div>

      <SectionTitle title="Step 3: Review & Submit" />
      <div className="bg-white rounded shadow p-4 mb-6 border">
        {recce.reviewSubmit &&
        Object.values(recce.reviewSubmit).some(
          (v) =>
            v && (typeof v === "object" ? Object.values(v).some((x) => x) : v),
        ) ? (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(recce.reviewSubmit).map(([key, value]) => (
              <div key={key}>
                <Label>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </Label>
                {typeof value === "object" && value !== null ? (
                  Object.entries(value).map(([k, v], i) => (
                    <div key={i} className="mb-1">
                      <span className="font-semibold text-xs text-gray-500">
                        {k
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                        :{" "}
                      </span>
                      <Input value={v} />
                    </div>
                  ))
                ) : (
                  <Input value={value} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">No review/submit data available.</div>
        )}
      </div>

      <SectionTitle title="Step 4: Visual Documentation" />
      <div className="bg-white rounded shadow p-4 mb-6 border">
        {recce.visualDocumentation && recce.visualDocumentation.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {recce.visualDocumentation.map((doc, idx) => (
              <div
                key={idx}
                className="w-40 h-40 border rounded overflow-hidden flex flex-col items-center justify-center"
              >
                <img
                  src={doc.url}
                  alt={doc.publicId}
                  className="object-cover w-full h-full"
                />
                <div className="text-xs mt-2">{doc.publicId}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400">
            No visual documentation available.
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedRecceDetail;
