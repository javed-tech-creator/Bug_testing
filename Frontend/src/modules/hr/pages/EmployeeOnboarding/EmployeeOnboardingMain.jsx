// components/EmployeeOnboarding/EmployeeOnboardingMain.jsx
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  User,
  Home,
  Building,
  Award,
  FileText,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import StepPersonalInfo from "./steps/StepPersonalInfo";
import StepAddressInfo from "./steps/StepAddressInfo";
import StepEmploymentInfo from "./steps/StepEmploymentInfo";
import StepBankDetails from "./steps/StepBankDetails";
import StepDocuments from "./steps/StepDocuments";
import StepTraining from "./steps/StepTraining";
import EmployeeProfileReview from "./steps/EmployeeProfileReview";
import StepEmployeement from "./steps/StepEmployment";

const steps = [
  { id: "personal", name: "Personal Info", icon: User },
  { id: "address", name: "Address", icon: Home },
  { id: "documents", name: "Documents", icon: FileText },
  { id: "bank", name: "Bank", icon: Award },
  { id: "training", name: "Training", icon: BookOpen },
  { id: "employment", name: "Payroll Management", icon: Building },
  {id:"employee",name:"Employment",icon:Building},
  { id: "review", name: "Review & User", icon: ShieldCheck },
];

const EmployeeOnboardingMain = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();
  // Listen query param changes
  useEffect(() => {
    const stepParam = parseInt(searchParams.get("step") || "1", 10);
    setActiveIndex(stepParam - 1);
  }, [searchParams]);

  const activeStep = steps[activeIndex]?.id;

  const goNext = () => {
    if (activeIndex < steps.length - 1) {
      const newIndex = activeIndex + 1;
      setActiveIndex(newIndex);
      setSearchParams({ step: newIndex + 1 });
    } else {

      navigate("/hr/employee/list");
    }
  };

  const goBack = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      setActiveIndex(newIndex);
      setSearchParams({ step: newIndex + 1 });
    }
  };

  const renderStep = () => {
    if (!id && activeStep !== "personal") {
      return <StepPersonalInfo goNext={goNext} />;
    }

    switch (activeStep) {
      case "personal":
        return <StepPersonalInfo goNext={goNext} />;
      case "address":
        return <StepAddressInfo goNext={goNext} goBack={goBack} />;
      case "employment":
        return <StepEmploymentInfo goNext={goNext} goBack={goBack} />;
      case "bank":
        return <StepBankDetails goNext={goNext} goBack={goBack} />;
      case "documents":
        return <StepDocuments goNext={goNext} goBack={goBack} />;
      case "employee":
          return <StepEmployeement  goNext={goNext} goBack={goBack} />;
      case "training":
        return <StepTraining goNext={goNext} goBack={goBack} />;
      case "review":
        return <EmployeeProfileReview goBack={goBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header + Tabs */}
        <div className="sticky top-[-20px]  bg-white shadow-xl  rounded-lg mb-4 overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-l to-black from-neutral-800 text-gray-50 px-8 py-3">
            <h1 className="text-2xl font-bold ">
              {" "}
              {id ? "!! Update Employee !!" : "!! Add New Employee !!"}{" "}
            </h1>
            <p className="text-gray-100 text-sm mt-1">
              Complete the employee information step by step
            </p>
          </div>

          <div className="border-b border-gray-200 px-5 bg-gray-50">
            <nav className="-mb-px overflow-auto flex space-x-1">
              {steps.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = idx === activeIndex;
                const isDisabled = !id && idx > 0;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (!isDisabled) {
                        setSearchParams({ step: idx + 1 }); // URL update
                      }
                    }}
                    disabled={isDisabled}
                    className={`
        flex items-center py-4 px-2 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200
        ${isActive
                        ? "border-orange-500 text-orange-500"
                        : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
                      }
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
                  >
                    <Icon
                      className={`h-4 w-4 mr-2 ${isActive ? "text-orange-500" : ""
                        }`}
                    />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
          <div className="p-2">{renderStep()}</div>

          {/* Navigation */}
          <div className="flex justify-between px-6 py-4 bg-gray-50 border-t">
            <button
              onClick={goBack}
              disabled={activeIndex === 0}
              className="px-6 py-1.5 border rounded-sm cursor-pointer bg-white text-gray-700 disabled:opacity-50"
            >
              Back
            </button>
            {/* <button
              onClick={goNext}
              className="px-6 py-1.5 bg-black cursor-pointer text-white rounded-sm"
            >
              {activeIndex === steps.length - 1 ? "Back Employee List" : "Next"}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeOnboardingMain;
