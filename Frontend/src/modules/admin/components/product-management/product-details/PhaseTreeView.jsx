import React, { useState, useMemo } from "react";

// 🎨 Compact Modal for showing instruction details
const InstructionModal = ({ instruction, onClose, type }) => {
  if (!instruction) return null;

  const isChecklist = type === "checklist";
  const title = isChecklist ? "Checklist Items" : "Instructions";
  const items = Array.isArray(instruction) ? instruction : [];

  return (
    <div 
      className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-0 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-blue-800 text-white rounded-t-lg px-5 py-3">
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <div className="p-5 space-y-3">
          <div className={`${isChecklist ? 'bg-pink-50 border-pink-500' : 'bg-yellow-50 border-yellow-500'} rounded-lg p-3 border-l-4`}>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                  <span className="font-semibold">{index + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            className="w-full bg-blue-800 text-white rounded-lg py-2.5 font-semibold hover:scale-101 cursor-pointer transition-all  text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// 🎨 Enhanced NodeBox with smaller size
const NodeBox = ({ label, color, children, onClick, isClickable }) => {
  const childArray = React.Children.toArray(children);
  const hasChildren = childArray.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Enhanced Node Box with smaller size */}
      <div
        className={`relative flex items-center justify-center text-white rounded-md px-3 py-2 text-xs transition-all duration-300 ${
          isClickable ? 'cursor-pointer hover:shadow-lg hover:scale-105 hover:-translate-y-1' : 'hover:shadow-lg'
        }`}
        style={{ 
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          minWidth: '90px',
          maxWidth: '130px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: `0 3px 10px rgba(0, 0, 0, 0.2), 0 0 15px ${color}40`
        }}
        onClick={onClick}
      >
        <div className="relative z-10 text-center leading-tight drop-shadow-md">{label}</div>
        {isClickable && (
          <>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse border-2 border-white"></div>
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-white/20 to-transparent"></div>
          </>
        )}
      </div>

      {/* Enhanced connecting lines to children */}
      {hasChildren && (
        <div className="relative mt-3">
          {/* Vertical line from parent with gradient */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-0.5 rounded-full h-3 -top-3"
            style={{
              background: `linear-gradient(180deg, ${color} 0%, #9ca3af 100%)`
            }}
          />
          
          <div className="relative flex justify-center gap-5">
            {/* Horizontal connector line with shadow */}
            {childArray.length > 1 && (
              <div 
                className="absolute h-0.5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 rounded-full top-0 shadow-sm"
                style={{
                  left: '8%',
                  right: '8%',
                }}
              />
            )}

            {childArray.map((child, index) => (
              <div key={index} className="flex flex-col items-center relative">
                {/* Vertical line to child with gradient */}
                <div 
                  className="w-0.5 bg-gradient-to-b from-gray-500 to-gray-400 rounded-full mb-3 h-3 shadow-sm" 
                />
                {child}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProductHierarchyTree = ({ data }) => {
  const [selectedPhase, setSelectedPhase] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedWork, setSelectedWork] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [modalInstruction, setModalInstruction] = useState(null);
  const [modalType, setModalType] = useState("instruction");

  const phases = data || [];

  const departments = useMemo(() => {
    const phase = phases.find((p) => p.phaseName === selectedPhase);
    return phase?.departments || [];
  }, [selectedPhase]);

  const works = useMemo(() => {
    const dept = departments.find((d) => d.departmentName === selectedDept);
    return dept?.works || [];
  }, [selectedDept]);

  const selectedWorkData = works.find((w) => w.workTitle === selectedWork);

  // Recursive renderers with compact styling
  const renderInstructions = (instructions = []) => {
    if (!instructions || instructions.length === 0) return null;
    
    return (
      <NodeBox 
        label="📋 Instruction" 
        color="#eab308"
        isClickable={true}
        onClick={() => {
          setModalInstruction(instructions);
          setModalType("instruction");
        }}
      />
    );
  };

  const renderChecklists = (checklists = []) => {
    if (!checklists || checklists.length === 0) return null;
    
    return (
      <NodeBox 
        label="✅ Checklist" 
        color="#ec4899"
        isClickable={true}
        onClick={() => {
          setModalInstruction(checklists);
          setModalType("checklist");
        }}
      />
    );
  };

  const renderSubActivities = (subActivities = []) => {
    if (!subActivities || subActivities.length === 0) return null;
    
    return (
      <div className="relative flex gap-5">
        {subActivities.length > 1 && (
          <div 
            className="absolute h-0.5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 rounded-full top-0 shadow-sm"
            style={{
              left: '8%',
              right: '8%',
            }}
          />
        )}
        
        {subActivities.map((sub, i) => {
          const hasInstructions = sub.instructions && sub.instructions.length > 0;
          const hasChecklists = sub.checklist && sub.checklist.length > 0;
          const hasBoth = hasInstructions && hasChecklists;
          
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="w-0.5 bg-gradient-to-b from-gray-500 to-gray-400 rounded-full mb-3 h-3 shadow-sm" />
              <NodeBox label={sub.subActivityTitle} color="#f97316">
                {(hasInstructions || hasChecklists) && (
                  <div className="relative flex gap-5 mt-3">
                    {hasBoth && (
                      <div 
                        className="absolute h-0.5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 rounded-full top-0 shadow-sm"
                        style={{ left: '8%', right: '8%' }}
                      />
                    )}
                    {hasInstructions && (
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 bg-gradient-to-b from-gray-500 to-gray-400 rounded-full mb-3 h-3 shadow-sm" />
                        {renderInstructions(sub.instructions)}
                      </div>
                    )}
                    {hasChecklists && (
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 bg-gradient-to-b from-gray-500 to-gray-400 rounded-full mb-3 h-3 shadow-sm" />
                        {renderChecklists(sub.checklist)}
                      </div>
                    )}
                  </div>
                )}
              </NodeBox>
            </div>
          );
        })}
      </div>
    );
  };

  const renderActivities = (activities = []) => {
    if (!activities || activities.length === 0) return null;
    
    return (
      <div className="relative flex gap-5">
        {activities.length > 1 && (
          <div 
            className="absolute h-0.5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 rounded-full top-0 shadow-sm"
            style={{
              left: '8%',
              right: '8%',
            }}
          />
        )}
        
        {activities.map((act, i) => {
          const hasInstructions = act.instructions && act.instructions.length > 0;
          const hasChecklists = act.checklist && act.checklist.length > 0;
          const hasBoth = hasInstructions && hasChecklists;
          
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="w-0.5 bg-gradient-to-b from-gray-500 to-gray-400 rounded-full mb-3 h-3 shadow-sm" />
              <NodeBox label={act.name} color="#22c55e">
                {act.subActivities?.length > 0
                  ? renderSubActivities(act.subActivities)
                  : (hasInstructions || hasChecklists) && (
                    <div className="relative flex gap-5 mt-3">
                      {hasBoth && (
                        <div 
                          className="absolute h-0.5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 rounded-full top-0 shadow-sm"
                          style={{ left: '8%', right: '8%' }}
                        />
                      )}
                      {hasInstructions && (
                        <div className="flex flex-col items-center">
                          <div className="w-0.5 bg-gradient-to-b from-gray-500 to-gray-400 rounded-full mb-3 h-3 shadow-sm" />
                          {renderInstructions(act.instructions)}
                        </div>
                      )}
                      {hasChecklists && (
                        <div className="flex flex-col items-center">
                          <div className="w-0.5 bg-gradient-to-b from-gray-500 to-gray-400 rounded-full mb-3 h-3 shadow-sm" />
                          {renderChecklists(act.checklist)}
                        </div>
                      )}
                    </div>
                  )}
              </NodeBox>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSubTasks = (subTasks = []) => {
    if (!subTasks || subTasks.length === 0) return null;
    
    return (
      <div className="relative flex gap-5">
        {subTasks.length > 1 && (
          <div 
            className="absolute h-0.5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 rounded-full top-0 shadow-sm"
            style={{
              left: '8%',
              right: '8%',
            }}
          />
        )}
        
        {subTasks.map((sub, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-0.5 bg-gradient-to-b from-gray-500 to-gray-400 rounded-full mb-3 h-3 shadow-sm" />
            <NodeBox label={sub.subTaskTitle} color="#3b82f6">
              {sub.activities?.length > 0 && renderActivities(sub.activities)}
            </NodeBox>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-[300px] bg-white border border-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Legend for better understanding */}
        <div className="mb-6 bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">📋 Hierarchy Guide:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-purple-200">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Phase</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-indigo-200">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Department</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-teal-200">
              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Work</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-amber-200">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Task</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-blue-200">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Sub-Task</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-green-200">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Activity</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-orange-200">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Sub-Activity</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-yellow-200">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Instruction</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-pink-200">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span className="font-medium text-gray-700">Checklist</span>
            </div>
          </div>
        </div>
    
        {/* Compact Dropdown Flow */}
        <div className="flex flex-col items-center gap-0 my-8">
          {/* Phase Selection */}
          <div className="flex flex-col items-center">
            <select
              value={selectedPhase}
              onChange={(e) => {
                setSelectedPhase(e.target.value);
                setSelectedDept("");
                setSelectedWork("");
                setSelectedTask("");
              }}
              className="border-2 border-purple-400 rounded-lg px-6 py-2 bg-purple-500 text-white font-semibold shadow-md focus:ring-2 focus:ring-purple-300 focus:outline-none text-sm cursor-pointer"
            >
              <option value="">🎯 Select Phase</option>
              {phases.map((p) => (
                <option key={p.phaseName} value={p.phaseName}>
                  {p.phaseName}
                </option>
              ))}
            </select>
            
            {selectedPhase && (
              <div className="w-0.5 h-6 bg-gray-400 my-2" />
            )}
          </div>

          {/* Department Selection */}
          {selectedPhase && (
            <div className="flex flex-col items-center animate-fadeIn">
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setSelectedWork("");
                  setSelectedTask("");
                }}
                className="border-2 border-indigo-400 rounded-lg px-6 py-2 bg-indigo-500 text-white font-semibold shadow-md focus:ring-2 focus:ring-indigo-300 focus:outline-none text-sm cursor-pointer"
              >
                <option value="">🏢 Select Department</option>
                {departments.map((d) => (
                  <option key={d.departmentName} value={d.departmentName}>
                    {d.departmentName}
                  </option>
                ))}
              </select>
              
              {selectedDept && (
                <div className="w-0.5 h-6 bg-gray-400 my-2" />
              )}
            </div>
          )}

          {/* Works Selection */}
          {selectedDept && (
            <div className="flex flex-col items-center animate-fadeIn">
              <div className="bg-teal-500 text-white rounded-lg px-5 py-2 font-semibold shadow-md text-sm">
                📋 Works
              </div>
              
              {works.length > 0 && (
                <div className="w-0.5 h-6 bg-gray-400 my-2" />
              )}
              
              <div className="bg-purple-700 rounded-xl py-4 px-6 shadow-lg">
                <div className="flex justify-center gap-2 flex-wrap">
                  {works.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedWork(w.workTitle);
                        setSelectedTask("");
                      }}
                      className={`w-8 h-8 rounded-full font-bold text-sm transition-all ${
                        selectedWork === w.workTitle
                          ? "bg-white text-purple-700 shadow-lg scale-110"
                          : "bg-purple-500 text-white hover:bg-purple-400 shadow-md"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                {selectedWork && (
                  <div className="text-white text-center mt-3 text-xs font-medium bg-white/20 rounded-lg py-1.5 px-3">
                    {selectedWork}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Compact Hierarchy Tree */}
        {selectedWork && selectedWorkData ? (
          <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-4 overflow-x-auto shadow-inner">
            <div className="min-w-max flex justify-center">
              <div className="flex flex-col items-center">
                {/* Enhanced vertical line from Works to Tasks */}
                <div 
                  className="w-0.5 h-8 rounded-full mb-3 shadow-sm"
                  style={{
                    background: 'linear-gradient(180deg, #14b8a6 0%, #9ca3af 100%)'
                  }}
                />
                
                {/* Tasks in horizontal layout */}
                {selectedWorkData.tasks?.length > 0 && (
                  <div className="relative flex gap-5">
                    {/* Enhanced horizontal connector line for tasks */}
                    {selectedWorkData.tasks.length > 1 && (
                      <div 
                        className="absolute h-0.5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 rounded-full top-0 shadow-sm"
                        style={{
                          left: '8%',
                          right: '8%',
                        }}
                      />
                    )}
                    
                    {selectedWorkData.tasks.map((task, i) => (
                      <div key={i} className="flex flex-col items-center">
                        {/* Enhanced vertical line to each task */}
                        <div className="w-0.5 bg-gradient-to-b from-gray-500 to-gray-400 rounded-full mb-3 h-3 shadow-sm" />
                        
                        <NodeBox 
                          label={task.taskTitle} 
                          color="#f59e0b"
                          isClickable={true}
                          onClick={() => setSelectedTask(selectedTask === task.taskTitle ? "" : task.taskTitle)}
                        >
                          {selectedTask === task.taskTitle && (task.subTasks?.length > 0 || task.activities?.length > 0) && (
                            <>
                              {task.subTasks?.length > 0 && renderSubTasks(task.subTasks)}
                              {task.activities?.length > 0 && renderActivities(task.activities)}
                            </>
                          )}
                        </NodeBox>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-8 bg-white rounded-xl p-8 ">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-base font-semibold">Please select Phase, Department, and Work</p>
            <p className="text-gray-500 text-sm mt-1">Your workflow structure will appear here</p>
          </div>
        )}
      </div>

      {/* Instruction Modal */}
      {modalInstruction && (
        <InstructionModal
          instruction={modalInstruction}
          onClose={() => setModalInstruction(null)}
          type={modalType}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductHierarchyTree;