import React, { useRef, useEffect, useCallback } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
const QuotationForm = ({ onUpdate, initialData, formContainerRef }) => {
  const { register, control, watch, setValue } = useForm({
    defaultValues: initialData || {
      client: {
        name: "",
        company: "",
        contact: "",
        email: "",
        address: "",
      },
      project: {
        title: "",
        code: "",
        description: "",
      },
      products: [],
      totalAmount: 0,
      discountPercent: 0,
      discountAmount: 0,
      netAmount: 0,
      remark: "",
    },
  });

  const { fields } = useFieldArray({ control, name: "products" });
  const formValues = useWatch({ control });
  const isInitialLoad = useRef(true);
  const totalAmount = watch("totalAmount");
  const discountPercent = watch("discountPercent");
  const discountAmount = watch("discountAmount");

  // ✅ FIX: Proper useEffect dependencies
  useEffect(() => {
    if (initialData && isInitialLoad.current) {
      Object.keys(initialData).forEach((key) => {
        setValue(key, initialData[key]);
      });
      isInitialLoad.current = false;
    }
  }, [initialData, setValue]);

  // ✅ FIX: Proper useCallback with stable dependencies
  const updateCalculations = useCallback(() => {
    if (isInitialLoad.current) return;

    const products = formValues.products || [];
    const calculatedTotal = products.reduce((sum, p) => {
      const qty = Number(p.qty) || 0;
      const price = Number(p.basePrice) || 0;
      return sum + qty * price;
    }, 0);

    let finalDiscount = 0;

    if (discountPercent > 0) {
      finalDiscount = (calculatedTotal * discountPercent) / 100;
    } else if (discountAmount > 0) {
      finalDiscount = Number(discountAmount);
    }

    const netAmt = calculatedTotal - finalDiscount;

    setValue("totalAmount", calculatedTotal);
    setValue("discountAmount", finalDiscount);
    setValue("netAmount", netAmt);

    onUpdate({
      ...formValues,
      totalAmount: calculatedTotal,
      discountAmount: finalDiscount,
      netAmount: netAmt,
    });
  }, [formValues, discountPercent, discountAmount, setValue, onUpdate]);

  // ✅ FIX: Remove infinite loop by using proper dependencies
  useEffect(() => {
    const subscription = watch(() => {
      updateCalculations();
    });
    return () => subscription.unsubscribe();
  }, [watch, updateCalculations]);

  const handleDiscountPercentChange = (e) => {
    const percent = Number(e.target.value) || 0;
    setValue("discountPercent", percent);
    setValue("discountAmount", 0);
  };

  const handleDiscountAmountChange = (e) => {
    const amount = Number(e.target.value) || 0;
    setValue("discountAmount", amount);
    setValue("discountPercent", 0);
  };

  return (
    <div
      ref={formContainerRef}
      className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 overflow-auto no-print"
    >
      {/* Client Details - Editable */}
      <div className="borde border-orange-600">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">
          Client Details
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              {...register("client.name")}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              {...register("client.company")}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              {...register("client.contact")}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("client.email")}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              {...register("client.address")}
              rows={1}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Project Details - Editable */}
      <div className="borde border-orange-600">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">
          Project Details
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              {...register("project.title")}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Project ID
            </label>
            <input
              type="text"
              {...register("project.code")}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("project.description")}
              rows={2}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="borde border-orange-600 ">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">
          Products & Pricing
        </h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                  Product
                </th>
                <th className="px-3 py-2 min-w-[100px] text-center text-xs font-semibold text-gray-700 w-24">
                  Price (₹)
                </th>
                <th className="px-3 min-w-[90px] py-2 text-center text-xs font-semibold text-gray-700 w-16">
                  Qty
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 w-28">
                  Total (₹)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {fields.map((item, i) => {
                const qty = Number(watch(`products.${i}.qty`)) || 0;
                const price = Number(watch(`products.${i}.basePrice`)) || 0;
                const total = qty * price;

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900">{item.name}</td>

                    {/* Editable Price Field */}
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        {...register(`products.${i}.basePrice`)}
                        className="w-full px-2 py-1 text-right text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        {...register(`products.${i}.qty`)}
                        className="w-full px-2 py-1 text-center text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </td>

                    {/* Calculated Total */}
                    <td className="px-3 py-2 text-right font-medium text-gray-900">
                      ₹{total.toLocaleString("en-IN")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-sm text-gray-900 mb-2">
          Pricing Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Total Amount
            </label>
            <input
              type="number"
              {...register("totalAmount")}
              disabled
              className="w-full px-3 py-2 text-sm border rounded bg-white font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Discount %
            </label>
            <input
              type="number"
              step="0.01"
              value={discountPercent || ""}
              onChange={handleDiscountPercentChange}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Discount Amount
            </label>
            <input
              type="number"
              step="1"
              value={discountAmount || ""}
              onChange={handleDiscountAmountChange}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Net Amount
            </label>
            <input
              type="number"
              {...register("netAmount")}
              disabled
              className="w-full px-3 py-2 text-sm border rounded bg-orange-600 text-white font-bold"
            />
          </div>
        </div>
      </div>

      {/* Remarks */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Remarks / Terms & Conditions
        </label>
        <textarea
          {...register("remark")}
          rows={2}
          placeholder="Enter any additional remarks, terms, or conditions..."
          className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
    </div>
  );
};

export default QuotationForm;