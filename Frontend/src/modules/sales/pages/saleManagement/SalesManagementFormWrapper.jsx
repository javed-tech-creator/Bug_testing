import { useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import LeadManagementForm from "./steps/LeadManagementForm";
import PreSalesForm from "./steps/PreSalesForm";
import InitialPaymentForm from "./steps/InitialPaymentForm";
import RemainingPaymentForm from "./steps/RemainingPaymentForm";
import PageHeader from "../../components/PageHeader";

const steps = [
  { id: 1, label: "Lead Management", component: LeadManagementForm },
  { id: 2, label: "Pre-Sales", component: PreSalesForm },
  { id: 3, label: "Initial Payment", component: InitialPaymentForm },
  { id: 4, label: "Remaining Payment", component: RemainingPaymentForm },
];

export default function SalesManagementFormWrapper() {
  const [searchParams, setSearchParams] = useSearchParams();
  const step = parseInt(searchParams.get("step") || "1");

  const goToStep = (nextStep) => {
    setSearchParams({ step: nextStep.toString() });
  };

  const currentStep = steps.find((s) => s.id === step);
  const CurrentStepComponent = currentStep?.component;

  if (!CurrentStepComponent) return <div>Invalid Step</div>;

  return (
    <div className="mx-auto bg-white">
      
      {/* Step Navigation */}
      <div className="flex justify-center items-center gap-4 mb-1">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => goToStep(s.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 border-2
                ${s.id === step
                  ? "bg-black text-white border-black shadow-lg scale-110"
                  : s.id < step
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-black-50 hover:border-black-300"}
              `}
            >
              {s.id < step ? (
                <Check className="w-5 h-5" />
              ) : (
                s.id
              )}
            </button>
            
            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 mx-2 transition-colors duration-200
                ${s.id < step ? "bg-green-500" : "bg-gray-300"}
              `} />
            )}
          </div>
        ))}
      </div>

      <PageHeader title={`${currentStep.label}`} />

      <div className="">
        <CurrentStepComponent
          onNext={() => goToStep(step + 1)}
          onBack={() => goToStep(step - 1)}
        />
      </div>
    </div>
  );
}