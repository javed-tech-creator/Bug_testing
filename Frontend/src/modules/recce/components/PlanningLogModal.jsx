import React from 'react';
import { X, Calendar, User, Briefcase, ClipboardList, Info, CircleCheck, AlertCircle, Clock } from 'lucide-react';

const PlanningLogModal = ({ isOpen, onClose, logs = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Planning History</h2>
              <p className="text-sm text-gray-500">Review all status changes and coordinator remarks</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-600 uppercase tracking-tighter text-[11px]">#</th>
                <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-600 uppercase tracking-tighter text-[11px]">Date & Timestamp</th>
                <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-600 uppercase tracking-tighter text-[11px]">Personnel involved</th>
                <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-600 uppercase tracking-tighter text-[11px]">Project Status</th>
                <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-600 uppercase tracking-tighter text-[11px]">Planning Status</th>
                <th className="border-b border-gray-200 px-6 py-4 font-semibold text-gray-600 uppercase tracking-tighter text-[11px]">Planning Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-6 py-5 text-gray-400 font-mono text-xs">{log.sno}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <Calendar size={14} className="text-gray-400" />
                      {log.dateTime}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-50 p-1 rounded-md"><User size={14} className="text-blue-600" /></div>
                        <div>
                          <p className="font-semibold text-gray-800 leading-none">{log.coordinator}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Co-Ordinator</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 border-t border-gray-50 pt-2">
                        <div className="bg-emerald-50 p-1 rounded-md"><Briefcase size={14} className="text-emerald-600" /></div>
                        <div>
                          <p className="font-semibold text-gray-800 leading-none">{log.manager}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Manager</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={log.projectStatus} />
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={log.planningStatus} />
                  </td>
                  <td className="px-6 py-5 max-w-xs">
                    <div className="flex gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 italic text-gray-600 leading-relaxed shadow-sm">
                      <Info size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      "{log.remark}"
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 text-right">
           <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all shadow-sm">
             Dismiss Log
           </button>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const getBadgeConfig = (status) => {
    switch (status) {
      case 'Approved': return { style: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', icon: <CircleCheck size={12}/> };
      case 'Rejected': 
      case 'Hold By Client': return { style: 'bg-rose-50 text-rose-700 ring-rose-600/20', icon: <AlertCircle size={12}/> };
      case 'On Track': return { style: 'bg-sky-50 text-sky-700 ring-sky-600/20', icon: <Clock size={12}/> };
      default: return { style: 'bg-gray-50 text-gray-600 ring-gray-200', icon: <Info size={12}/> };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${config.style}`}>
      {config.icon}
      {status}
    </span>
  );
};

export default PlanningLogModal;