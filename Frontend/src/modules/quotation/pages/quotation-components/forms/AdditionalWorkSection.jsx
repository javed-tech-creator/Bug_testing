import React from "react";
import { ToggleItem } from "../ui/CommonComponents";

const AdditionalWorkSection = ({
  workCharges,
  selectedWorks,
  totalDiscount,
  cgstSgst,
  grandTotal,
  onToggleCharge,
  onWorkChange,
  onTotalDiscountChange,
  onCgstSgstChange,
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200 space-y-10">
      <div className="flex flex-col gap-8">
        {/* Left Column: Toggles */}
        <div className="flex-1">
          <h3 className="text-base font-semibold mb-6 text-gray-900 tracking-wide">
            Additional Work Charges
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <ToggleItem
              label="ACP Work"
              checked={workCharges.acpWork}
              onChange={() => onToggleCharge("acpWork", "ACP Work")}
            />
            <ToggleItem
              label="Stencil Work"
              checked={workCharges.stencilWork}
              onChange={() => onToggleCharge("stencilWork", "Stencil Work")}
            />
            <ToggleItem
              label="Fabrication Work"
              checked={workCharges.fabricationWork}
              onChange={() =>
                onToggleCharge("fabricationWork", "Fabrication Work")
              }
            />
            <ToggleItem
              label="Board Repair Work"
              checked={workCharges.boardRepairWork}
              onChange={() =>
                onToggleCharge("boardRepairWork", "Board Repair Work")
              }
            />
            <ToggleItem
              label="Paad Work"
              checked={workCharges.paadWork}
              onChange={() => onToggleCharge("paadWork", "Paad Work")}
            />
            <ToggleItem
              label="Dismantling Work"
              checked={workCharges.dismantlingWork}
              onChange={() =>
                onToggleCharge("dismantlingWork", "Dismantling Work")
              }
            />
            <ToggleItem
              label="Hydra Work"
              checked={workCharges.hydraWork}
              onChange={() => onToggleCharge("hydraWork", "Hydra Work")}
            />
            <ToggleItem
              label="Installation"
              checked={workCharges.installation}
              onChange={() => onToggleCharge("installation", "Installation")}
            />
            <ToggleItem
              label="Iron Work"
              checked={workCharges.ironWork}
              onChange={() => onToggleCharge("ironWork", "Iron Work")}
            />
            <ToggleItem
              label="Transportation"
              checked={workCharges.transportation}
              onChange={() =>
                onToggleCharge("transportation", "Transportation")
              }
            />
            <ToggleItem
              label="Civil Work"
              checked={workCharges.civilWork}
              onChange={() => onToggleCharge("civilWork", "Civil Work")}
            />
            <ToggleItem
              label="More"
              checked={workCharges.more}
              onChange={() => onToggleCharge("more", "More")}
            />
          </div>
        </div>

        {/* Right Column: Selected Works & Totals */}
        <div className="w-full space-y-6">
          {/* Work Charges Table */}
          <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-white w-16">
                    S. No
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-white">
                    Work
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-white w-28">
                    Charge (Rs)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedWorks.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-3 py-6 text-center text-sm text-gray-400"
                    >
                      No work selected
                    </td>
                  </tr>
                ) : (
                  selectedWorks.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs text-gray-600">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={item.work}
                          onChange={(e) =>
                            onWorkChange(item.id, "work", e.target.value)
                          }
                          placeholder={item.isCustom ? "Enter work name" : ""}
                          className="w-full text-xs px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center h-[30px] border border-gray-300 rounded-md px-2">
                          <span className="text-xs text-gray-500 mr-1 flex items-center h-full leading-none">
                            ₹
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={item.charge}
                            onChange={(e) =>
                              onWorkChange(
                                item.id,
                                "charge",
                                Math.max(0, Number(e.target.value))
                              )
                            }
                            className="w-full text-xs py-1.5 text-right focus:outline-none"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-gray-200 pt-10">
        {/* Bank Details */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-[11px]">
          <h5 className="font-bold text-sm mb-3 text-gray-800">Bank Details</h5>

          <div className="flex gap-6">
            <div className="space-y-1.5 text-gray-600">
              <div className="grid grid-cols-[80px_1fr] gap-2">
                <span className="font-bold text-gray-800">Bank Name:</span>
                <span>State Bank Of India</span>

                <span className="font-bold text-gray-800">Account No:</span>
                <span>00000000000001</span>

                <span className="font-bold text-gray-800">IFSC:</span>
                <span>SBIN0000001</span>

                <span className="font-bold text-gray-800">Branch:</span>
                <span>Gomti Nagar, Lucknow</span>
              </div>
            </div>

            <div className="ml-4">
              <span className="font-bold block mb-2 text-gray-800">
                Pay Using UPI
              </span>
              <div className="w-20 h-20 bg-gray-100 flex items-center justify-center border border-gray-200 rounded overflow-hidden">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grand Totals */}
        <div className="space-y-3 text-sm mt-12">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="font-medium text-gray-700">Total Discount</span>
            <div className="flex items-center h-[30px] border border-gray-300 rounded-md px-2 w-32">
              <span className="text-xs text-gray-500 mr-1 flex items-center h-full leading-none">
                ₹
              </span>
              <input
                type="number"
                min={0}
                value={totalDiscount}
                onChange={onTotalDiscountChange}
                placeholder="Enter discount"
                className="w-full text-xs py-1.5 text-center placeholder:text-center focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="font-bold text-gray-800">Taxable Amount</span>
            <span className="font-medium text-gray-700">
              ₹{selectedWorks.reduce((sum, work) => sum + (Number(work.charge) || 0), 0).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="font-bold text-gray-800">CGST+SGST</span>
            <div className="flex items-center h-[30px] border border-gray-300 rounded-md px-2 w-32">
              <span className="text-xs text-gray-500 mr-1 flex items-center h-full leading-none">
                ₹
              </span>
              <input
                type="number"
                min={0}
                value={cgstSgst}
                onChange={(e) =>
                  onCgstSgstChange({
                    target: { value: Math.max(0, Number(e.target.value)) },
                  })
                }
                placeholder="Enter CGST+SGST"
                className="w-full text-xs py-1.5 text-center placeholder:text-center focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <span className="text-base font-bold text-gray-900">
              Grand Total
            </span>
            <span className="text-2xl font-bold text-green-600">
              ₹{grandTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalWorkSection;
