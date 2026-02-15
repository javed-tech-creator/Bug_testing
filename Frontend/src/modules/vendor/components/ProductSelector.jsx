import { useGetCustomersQuery } from "@/api/vendor/customer.api";
import { useState, useRef, useEffect } from "react";
import { useDebounce } from "./customHook/useDebaounse";
import Loader from "./LoadingDropdown";
// import { useDebounce } from "@/hooks/useDebounce";

export function BranchSelector({ selectedBranchId, setSelectedBranchId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  const searchRef = useRef();


  
    // get customer details api 
      const { data:customersResponse, isLoading:customerLoading, isError, error } = useGetCustomersQuery();
// ✅ Extract the actual array safely
const customers = customersResponse?.data || [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const filteredCustomer = customers.filter((customer) =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (customer) => {
    console.log("customer",customer)
    console.log("customer ID",customer._id)
    setSelectedBranchId(customer._id);
    setSearchTerm(customer.fullName);
    setShowDropdown(false);
  };


  return (
    <>
    <div
  className="relative w-full bg-blue-50 p-3.5 rounded-lg shadow border border-blue-100"
  ref={wrapperRef}
>
  <label className="block text-sm font-medium text-black mb-1">
    Search & Select Customer
  </label>

  <div className="flex items-center border border-gray-300 rounded-md bg-white shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
    <span className="text-gray-400 mr-2">🏢</span>
    <input
      type="text"
      ref={searchRef}
      placeholder="Search & Select Customer "
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onFocus={() => setShowDropdown(true)}
      className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none"
      aria-label="Search customer customer"
    />
  </div>

{showDropdown && (
  <div
    role="listbox"
    aria-label="Customer list"
    className="absolute z-50 w-full max-h-60 overflow-y-auto border hide-scrollbar border-gray-200 mt-2 rounded-md bg-white shadow-lg text-sm"
  >
    {customerLoading ? (
      // Loader jab tak data fetch ho raha hai
      <div className="flex items-center justify-center py-4">
   <Loader/>
   </div>
    ) : filteredCustomer.length > 0 ? (
      // Data jab aa jaye
      filteredCustomer.map((customer) => (
        <div
          key={customer._id}
          onClick={() => handleSelect(customer)}
          className={`px-4 py-2 cursor-pointer transition-colors duration-150 ${
            selectedBranchId === customer._id
              ? "bg-blue-100 font-semibold"
              : "hover:bg-blue-50"
          }`}
          tabIndex={0}
        >
          <div className="text-gray-800">
            <span>{customer.fullName}</span> ({customer.companyName || ""})
          </div>
          <div className="text-xs text-gray-500">
            {customer.addressLine1}{" "}
            <span>{customer.addressLine2}</span>{" "}
            <span>{customer.city}</span>{" "}
            <span>{customer.state}</span>
          </div>
        </div>
      ))
    ) : (
      // Agar data empty ho
      <div className="px-4 py-2 text-gray-500 text-center">No customers found</div>
    )}
  </div>
)}



 

</div>

 {selectedBranchId && (
  <div className="mt-2 inline-flex items-center px-3 py-1 bg-rose-50 text-rose-800 rounded-full shadow-sm text-sm">
    <span className="mr-2 font-semibold">
      {customers.find((b) => b._id === selectedBranchId)?.fullName}
    </span>
    <button
      onClick={() => {
        setSelectedBranchId(null);
        setSearchTerm('');
      }}
      className="text-rose-400 hover:text-rose-600 focus:outline-none cursor-pointer"
    >
      &times;
    </button>
  </div>
)}
  </>
  );
}
