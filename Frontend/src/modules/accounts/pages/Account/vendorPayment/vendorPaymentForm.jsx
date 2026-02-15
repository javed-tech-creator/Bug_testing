import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { 
  X, 
  Building, 
  FolderOpen, 
  ListChecks, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Award, 
  Calendar, 
  FileText,
  DollarSign,
  Hash,
  Calculator
} from "lucide-react";

// Yup validation schema
const paymentSchema = yup.object().shape({
  vendor: yup.string().required("Vendor is required"),
  project: yup.string().required("Project is required"),
  tasks: yup
    .array()
    .of(
      yup.object().shape({
        description: yup.string().required("Description required"),
        quantity: yup.number().min(1).required(),
        rate: yup.number().min(0).required(),
      })
    )
    .min(1),
  penalties: yup.number().min(0),
  bonuses: yup.number().min(0),
  dueDate: yup.date().required("Due date required").typeError("Invalid date"),
  notes: yup.array().of(yup.string()),
});

const VendorPaymentForm = ({ vendors, onSubmit, defaultValues, closeModal }) => {
  const { control, handleSubmit, reset, register, watch, formState: { errors } } = useForm({
    resolver: yupResolver(paymentSchema),
    defaultValues,
  });

  const { fields: taskFields, append: addTask, remove: removeTask } = useFieldArray({
    control,
    name: "tasks",
  });

  const { fields: noteFields, append: addNote, remove: removeNote } = useFieldArray({
    control,
    name: "notes",
  });

  const watchedTasks = watch("tasks");
  const watchedPenalties = watch("penalties") || 0;
  const watchedBonuses = watch("bonuses") || 0;

  // Calculate totals
  const subTotal = watchedTasks?.reduce((sum, task) => sum + (task.quantity * task.rate || 0), 0) || 0;
  const totalAmount = subTotal - watchedPenalties + watchedBonuses;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const submitHandler = (data) => {
    const tasksWithAmount = data.tasks.map(t => ({ ...t, amount: t.quantity * t.rate }));
    onSubmit({ ...data, tasks: tasksWithAmount });
  };

  return (
    <div
      className="fixed inset-0 bg-black/40   flex items-center justify-center z-50  animate-[fadeIn_0.3s_ease-out]"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl  max-w-4xl relative overflow-hidden max-h-[95vh] animate-[slideUp_0.4s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-600 to-gray-600 px-8 py-2  text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-10 -mb-10"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Payment Form</h3>
              <p className="text-blue-100">Create or edit vendor payment details</p>
            </div>
            
            <button
              className="p-3 hover:bg-white/20 rounded-full transition-all duration-300 hover:rotate-90"
              onClick={closeModal}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
<div className="overflow-y-auto max-h-[60vh] p-2">
  <form onSubmit={handleSubmit(submitHandler)} className="space-y-2">

    {/* Basic Information Card */}
    <div className="bg-white border-3 rounded-lg p-2 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-100 flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        Basic Information
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Vendor */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            <Building className="w-3 h-3 text-blue-500"/> Vendor *
          </label>
          <select {...register("vendor")} className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-100 focus:border-blue-400 transition-all">
            <option value="">Choose vendor...</option>
            {vendors.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
          </select>
          {errors.vendor && <p className="text-red-500 text-xs flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {errors.vendor.message}</p>}
        </div>

        {/* Project */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            <FolderOpen className="w-3 h-3 text-emerald-500"/> Project *
          </label>
          <input {...register("project")} placeholder="Project name..." className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-100 focus:border-emerald-400 transition-all"/>
          {errors.project && <p className="text-red-500 text-xs flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {errors.project.message}</p>}
        </div>
      </div>
    </div>

    {/* Tasks Section Card */}
    <div className="bg-white border-3 rounded-lg p-2 shadow-sm">
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-400">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
          <ListChecks className="w-4 h-4 text-indigo-500"/> Tasks
        </h3>
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-2 py-1 rounded-full border border-indigo-100">
          <span className="text-xs text-gray-600">Subtotal: </span>
          <span className="font-semibold text-indigo-600">₹{subTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-2">
        {taskFields.map((task, i) => (
          <div key={task.id} className="bg-gray-50 rounded p-2 border border-gray-300 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-center">
              <div className="lg:col-span-5">
                <input
                  {...register(`tasks.${i}.description`)}
                  placeholder="What needs to be done..."
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                />
              </div>
              <div className="lg:col-span-2">
                <input
                  type="number"
                  {...register(`tasks.${i}.quantity`)}
                  placeholder="Qty"
                  className="w-full px-2 py-2 border border-gray-300 rounded text-center text-sm focus:ring-1 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                />
              </div>
              <div className="lg:col-span-2">
                <input
                  type="number"
                  {...register(`tasks.${i}.rate`)}
                  placeholder="Rate"
                  className="w-full px-2 py-2 border border-gray-300 rounded text-right text-sm focus:ring-1 focus:ring-indigo-100 focus:border-indigo-300 transition-all"
                />
              </div>
              <div className="lg:col-span-2 text-right">
                <div className="bg-emerald-50 px-2 py-2 rounded border border-emerald-100">
                  <span className="font-semibold text-emerald-600 text-sm">
                    ₹{((watchedTasks?.[i]?.quantity || 0) * (watchedTasks?.[i]?.rate || 0)).toLocaleString()}
                  </span>
                </div>
              </div>
              {taskFields.length > 1 && (
                <div className="lg:col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => removeTask(i)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-2 transition-all group-hover:opacity-100 opacity-70"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => addTask({ description: "", quantity: 1, rate: 0 })}
          className="w-full py-2 border-2 border-dashed border-indigo-200 rounded text-indigo-500 text-sm flex justify-center items-center gap-2 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
        >
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Add Task
        </button>
      </div>
    </div>

    {/* Financial & Timeline Section */}
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-2">
      
      {/* Financial Details */}
      <div className="xl:col-span-3 bg-white border-3 rounded-lg p-2 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          Financial Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-500"/> Penalties
            </label>
            <input type="number" {...register("penalties")} placeholder="0" 
              className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-red-100 focus:border-red-400 transition-all"/>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <Award className="w-3 h-3 text-emerald-500"/> Bonuses
            </label>
            <input type="number" {...register("bonuses")} placeholder="0" 
              className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-emerald-100 focus:border-emerald-400 transition-all"/>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
              <Calculator className="w-3 h-3 text-blue-500"/> Total Amount
            </label>
            <div className="w-full px-2 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded">
              <span className="font-bold text-blue-600 text-sm">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Due Date */}
      <div className="xl:col-span-2 bg-white border-3 rounded-lg p-2 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-100 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Timeline
        </h3>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-purple-500"/> Due Date *
          </label>
          <input type="date" {...register("dueDate")} 
            className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-100 focus:border-purple-400 transition-all"/>
        </div>
      </div>
    </div>

    {/* Notes Section */}
    <div className="bg-white border-3 rounded-lg p-2 shadow-sm">
      <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-400">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <FileText className="w-4 h-4 text-orange-500"/> Notes
        </h3>
        <button type="button" onClick={()=>addNote("")} 
          className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded p-1 transition-all">
          <Plus className="w-4 h-4"/>
        </button>
      </div>
      <div className="space-y-2">
        {noteFields.map((note,i) => (
          <div key={note.id} className="flex gap-2 items-center">
            <div className="flex-1">
              <input {...register(`notes.${i}`)} placeholder="Add your thoughts..." 
                className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-orange-100 focus:border-orange-400 transition-all"/>
            </div>
            {noteFields.length > 1 &&
              <button type="button" onClick={()=>removeNote(i)} 
                className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded p-1 transition-all">
                <Trash2 className="w-4 h-4"/>
              </button>
            }
          </div>
        ))}
      </div>
    </div>

  </form>
</div>



        {/* Footer */}
        <div className="bg-gray-50 px-8 py-3 border-t border-gray-200">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-1 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit(submitHandler)}
              className="px-8 py-2 bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-700 hover:to-gray-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Submit Payment
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
};

export default VendorPaymentForm;