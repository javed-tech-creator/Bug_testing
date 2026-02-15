import React, { useState,   } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  useGetVendorPaymentsQuery,
  useCreateVendorPaymentMutation,
  useUpdateVendorPaymentMutation,
  useDeleteVendorPaymentMutation,
} from "@/api/accounts/Payables.api";
import { useGetVendorsQuery } from "@/api/accounts/vendor.api";

// Yup validation schema
const paymentSchema = yup.object().shape({
  vendor: yup.string().required("Vendor is required"),
  project: yup.string().required("Project is required"),
  tasks: yup
    .array()
    .of(
      yup.object().shape({
        description: yup.string().required("Description required"),
        quantity: yup.number().min(1, "Quantity must be at least 1").required(),
        rate: yup.number().min(0, "Rate must be ≥ 0").required(),
      })
    )
    .min(1, "At least 1 task required"),
  penalties: yup.number().min(0, "Penalties must be ≥ 0"),
  bonuses: yup.number().min(0, "Bonuses must be ≥ 0"),
  dueDate: yup
    .date()
    .required("Due date is required")
    .typeError("Invalid date"),
  notes: yup.array().of(yup.string()),
});

const VendorPaymentComponent = () => {
  const { data: payments, isLoading, isError } = useGetVendorPaymentsQuery();
  const { data: vendors = [] } = useGetVendorsQuery();
  const [createPayment] = useCreateVendorPaymentMutation();
  const [updatePayment] = useUpdateVendorPaymentMutation();
  const [deletePayment] = useDeleteVendorPaymentMutation();

  console.log(payments,"pey");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const { control, handleSubmit, reset, register, formState: { errors } } = useForm({
    resolver: yupResolver(paymentSchema),
    defaultValues: {
      vendor: "",
      project: "",
      tasks: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
      penalties: 0,
      bonuses: 0,
      dueDate: "",
      notes: [""],
    },
  });

  const { fields: taskFields, append: addTask, remove: removeTask } = useFieldArray({
    control,
    name: "tasks",
  });

  const { fields: noteFields, append: addNote, remove: removeNote } = useFieldArray({
    control,
    name: "notes",
  });

  const openCreateModal = () => {
    reset({
      vendor: "",
      project: "",
      tasks: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
      penalties: 0,
      bonuses: 0,
      dueDate: "",
      notes: [""],
    });
    setEditingPayment(null);
    setModalOpen(true);
  };

  const openEditModal = (payment) => {
    reset({
      vendor: payment.vendor?._id || payment.vendor || "",
      project: payment.project || "",
      tasks: payment.tasks.map(t => ({
        description: t.description || "",
        quantity: t.quantity || 1,
        rate: t.rate || 0,
        amount: t.amount || 0,
      })),
      penalties: payment.penalties || 0,
      bonuses: payment.bonuses || 0,
      dueDate: payment.dueDate ? payment.dueDate.slice(0,10) : "",
      notes: payment.notes.length ? payment.notes : [""],
    });
    setEditingPayment(payment._id);
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    // Calculate amounts
    const tasksWithAmount = data.tasks.map(t => ({
      ...t,
      amount: t.quantity * t.rate,
    }));

    const finalData = { ...data, tasks: tasksWithAmount };

    if (editingPayment) {
      await updatePayment({ id: editingPayment, ...finalData });
    } else {
      await createPayment(finalData);
    }
    setModalOpen(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading payments.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Vendor Payments</h2>
      <button onClick={openCreateModal} className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">
        + Create Payment
      </button>
      <table className="w-full border-collapse border">
  <thead>
    <tr className="bg-gray-100">
      <th className="border px-2 py-1">Vendor</th>
      <th className="border px-2 py-1">Project</th>
      <th className="border px-2 py-1">Tasks</th>
      <th className="border px-2 py-1">Sub Total</th>
      <th className="border px-2 py-1">Penalties</th>
      <th className="border px-2 py-1">Bonuses</th>
      <th className="border px-2 py-1">Total Amount</th>
      <th className="border px-2 py-1">Paid</th>
      <th className="border px-2 py-1">Remaining</th>
      <th className="border px-2 py-1">Status</th>
      <th className="border px-2 py-1">Approval</th>
      <th className="border px-2 py-1">Due Date</th>
      <th className="border px-2 py-1">Actions</th>
    </tr>
  </thead>
  <tbody>
    {payments?.map((pay) => (
      <tr key={pay._id} className="hover:bg-gray-50">
        <td className="border px-2 py-1">{pay.vendor?.name || "N/A"}</td>
        <td className="border px-2 py-1">{pay.project}</td>
        <td className="border px-2 py-1">
          {pay.tasks.map((task) => (
            <div key={task._id}>
              {task.description} ({task.quantity} x {task.rate} = {task.amount})
            </div>
          ))}
        </td>
        <td className="border px-2 py-1">{pay.subTotal}</td>
        <td className="border px-2 py-1">{pay.penalties}</td>
        <td className="border px-2 py-1">{pay.bonuses}</td>
        <td className="border px-2 py-1">{pay.totalAmount}</td>
        <td className="border px-2 py-1">{pay.paidAmount}</td>
        <td className="border px-2 py-1">{pay?.remainingAmount}</td>
        <td className="border px-2 py-1">{pay.status}</td>
        <td className="border px-2 py-1">{pay.approvalStatus}</td>
        <td className="border px-2 py-1">{new Date(pay.dueDate).toLocaleDateString()}</td>
        <td className="border px-2 py-1 flex gap-2">
          <button
            onClick={() => openEditModal(pay)}
            className="bg-yellow-500 text-white px-2 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => deletePayment(pay._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


            {/* Modal */}
   {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setModalOpen(false)}
            >✕</button>

            <h3 className="text-lg font-bold mb-4">{editingPayment ? "Update Payment" : "Create Payment"}</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                <select {...register("vendor")} className="border p-2 w-full">
                  <option value="">Select Vendor</option>
                  {vendors.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                </select>
                {errors.vendor && <p className="text-red-500 text-sm">{errors.vendor.message}</p>}
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <input {...register("project")} className="border p-2 w-full" />
                {errors.project && <p className="text-red-500 text-sm">{errors.project.message}</p>}
              </div>

              {/* Tasks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tasks</label>
                {taskFields.map((task, index) => (
                  <div key={task.id} className="flex gap-2 items-center mb-1">
                    <input
                      {...register(`tasks.${index}.description`)}
                      placeholder="Description"
                      className="border p-2 flex-1"
                    />
                    <input
                      type="number"
                      {...register(`tasks.${index}.quantity`)}
                      placeholder="Quantity"
                      className="border p-2 w-24"
                    />
                    <input
                      type="number"
                      {...register(`tasks.${index}.rate`)}
                      placeholder="Rate"
                      className="border p-2 w-24"
                    />
                    <span className="w-24 text-center">{task.quantity * task.rate}</span>
                    {taskFields.length > 1 && <button type="button" onClick={() => removeTask(index)} className="text-red-500 font-bold">×</button>}
                  </div>
                ))}
                {errors.tasks && <p className="text-red-500 text-sm">{errors.tasks.message}</p>}
                <button type="button" onClick={() => addTask({ description: "", quantity: 1, rate: 0, amount: 0 })} className="text-blue-600 font-medium">
                  + Add Task
                </button>
              </div>

              {/* Penalties & Bonuses */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deductions / Penalties</label>
                  <input type="number" {...register("penalties")} className="border p-2 w-full" />
                  {errors.penalties && <p className="text-red-500 text-sm">{errors.penalties.message}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bonuses</label>
                  <input type="number" {...register("bonuses")} className="border p-2 w-full" />
                  {errors.bonuses && <p className="text-red-500 text-sm">{errors.bonuses.message}</p>}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" {...register("dueDate")} className="border p-2 w-64" />
                {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                {noteFields.map((note, index) => (
                  <div key={note.id} className="flex gap-2 mb-1">
                    <input {...register(`notes.${index}`)} className="border p-2 w-full" />
                    {noteFields.length > 1 && <button type="button" onClick={() => removeNote(index)} className="text-red-500 font-bold">×</button>}
                  </div>
                ))}
                <button type="button" onClick={() => addNote("")} className="text-blue-600 font-medium">+ Add Note</button>
              </div>

              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">{editingPayment ? "Update Payment" : "Create Payment"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorPaymentComponent;