import Section from "../../../components/project-list/project-modules/sales/Section"
import Row from "../../../components/project-list/project-modules/sales/Row"
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom"

export default function SalesDetails() {

    const navigate = useNavigate()

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="bg-white border rounded-lg p-4 flex items-center gap-3">
                <button className="text-xl cursor-pointer" onClick={() => navigate(-1)}>
                    <Icons.ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-semibold">Sales Details</h1>
            </div>

            {/* Sales Executive */}
            <Section title="Sales Executive">
                <div className="flex items-center gap-4">
                    <img
                        src="https://i.pravatar.cc/100?img=13"
                        alt="Rahul Verma"
                        className="w-16 h-16 rounded-full object-cover"
                    />

                    <div>
                        <h2 className="text-lg font-semibold">Rahul Verma</h2>

                        <div className="flex gap-4 mt-2 text-sm">
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md">
                                📞 0987654321
                            </span>
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md">
                                ✉️ rahulverma.partners@gmail.com
                            </span>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Order Info */}
            <Section title="Order Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                        <p className="text-gray-500">Order Date</p>
                        <p className="text-blue-600 font-semibold">October 12, 2024</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Commitment Timeline</p>
                        <p className="text-orange-500 font-semibold">Nov 12, 2024</p>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-gray-500 text-sm mb-1">Scope of Work</p>
                    <p className="text-sm text-gray-700">
                        End-to-end design, fabrication, and installation of external 3D backlit signage and internal
                        wayfinding systems for the new HQ building. Includes site recce, structural safety clearance,
                        and municipal approvals.
                    </p>
                </div>
            </Section>

            {/* Products Table */}
            <Section title="Finalized Products">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-300">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="p-3 text-left border-r border-blue-700 w-20">S. No</th>
                                <th className="p-3 text-left border-r border-blue-700">Product Name</th>
                                <th className="p-3 text-left w-28">Unit</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <Row no="01" name="Reception Wall Signage (Acrylic)" unit="1 Unit" />
                            <Row no="02" name="Wayfinding Directionals" unit="2 Unit" />
                            <Row no="03" name="3D Backlit Facade Logo" unit="3 Unit" />
                        </tbody>
                    </table>

                </div>
            </Section>

        </div>
    )
}
