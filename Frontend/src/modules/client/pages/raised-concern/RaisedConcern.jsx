import ConcernForm from "../../components/raised-concern/ConcernForm"
import EscalationMatrix from "../../components/raised-concern/EscalationMatrix"

export default function RaiseConcern() {
  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ConcernForm />
        </div>
        <EscalationMatrix />
      </div>
    </div>
  )
}
