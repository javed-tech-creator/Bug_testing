import RoleCard from "../../components/login/RoleCard"
import LoginForm from "../../components/login/LoginForm"
import logo from "../../../../assets/dss_logo.webp";
import * as Icons from "lucide-react";
export default function Login() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="bg-blue-50 p-10 flex flex-col justify-center">

        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="w-50 bg-white flex items-center justify-center font-bold mb-4 mx-auto">
            <img src={logo} alt="logo" className="block w-full" />
          </div>
          <h1 className="text-3xl font-semibold mb-2">
            Secure ERP Access
          </h1>
          <p className="text-sm text-gray-600 mb-2">
            Log in to manage your projects, invoices, and site updates.
            Your data is isolated and encrypted for maximum privacy.
          </p>
        </div>



        {/* Roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <RoleCard
            title="Owner / Founder"
            desc="Full access to all project data and settings."
            Icon = { Icons.Trophy}
          />
          <RoleCard
            title="Manager"
            desc="View progress and handle key approvals."
            Icon = { Icons.UserRoundCog}
          />
          <RoleCard
            title="Accountant"
            desc="Manage quotations, invoices, and payments."
            Icon = { Icons.Calculator}
          />
          <RoleCard
            title="Site In-charge"
            desc="Update daily recce and installation status."
            Icon = { Icons.Building2 }
          />
        </div>

        {/* Data Rule */}
        <div className="bg-white border rounded-lg p-4 text-sm text-gray-600">
          <strong>Strict Data Isolation Rule</strong>
          <p className="mt-1">
            You will only see data explicitly assigned to your organization.
            Cross-client access is strictly prohibited.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-white flex items-center justify-center p-10">
        <LoginForm />
      </div>

    </div>
  )
}
