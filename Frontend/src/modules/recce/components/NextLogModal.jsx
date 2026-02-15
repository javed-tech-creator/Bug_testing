import React from 'react';
import { X, ClipboardList, Clock } from 'lucide-react';
import Table from "../../../components/Table"; // Path check kar lijiyega

const NextLogModal = ({ isOpen, onClose, data = [], columnConfig }) => {
  if (!isOpen) return null;

  // Sections defined as requested
  const timeSlots = ["10:30 AM", "8:00 PM", "5:00 PM"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-7xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5 bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Planning Logs By Time</h2>
              <p className="text-sm text-gray-500">View planned activities categorized by their time slots</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 bg-gray-50/50 p-6 space-y-12">
          {timeSlots.map((slot, index) => {
            // Filter the actual planning data based on the slot
            const slotData = data.filter(item => item.timeSlot === slot);

            return (
              <div key={slot} className="space-y-4">
                {/* Visual Time Separator */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                   <b>{index === 0 ? "Today" : "Yesterday"}</b>
                    <Clock size={16} className="text-blue-600" />
                    <span className="font-bold text-gray-800">{slot}</span>
                  </div>
                  <div className="h-[1px] flex-1 bg-gray-200"></div>
                  <span className="text-xs font-medium text-gray-400">
                    {slotData.length} Records
                  </span>
                </div>

                {/* Main Table Component used inside the Modal */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  {slotData.length > 0 ? (
                    <Table 
                      data={slotData} 
                      columnConfig={columnConfig} 
                    />
                  ) : (
                    <div className="px-6 py-12 text-center text-gray-400 italic">
                      No records found for the {slot} slot.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 flex justify-end">
           <button 
             onClick={onClose} 
             className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
           >
             Close Logs
           </button>
        </div>
      </div>
    </div>
  );
};

export default NextLogModal;