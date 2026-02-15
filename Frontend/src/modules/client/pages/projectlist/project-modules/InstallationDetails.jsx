import Member from "../../../components/project-list/project-modules/installation/Member"
import ImageSection from "../../../components/project-list/project-modules/installation/ImageSection"
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom"

export default function InstallationDetails() {
    const navigate = useNavigate()

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="bg-white border rounded-lg p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                     <button className="text-xl cursor-pointer" onClick={() => navigate(-1)}>
                                        <Icons.ArrowLeft size={20} />
                                    </button>
                    <h1 className="text-lg font-semibold">Installation Details</h1>
                </div>

                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                    ✔ Installation Completed
                </span>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Installation Date */}
                <div className="bg-white border-l-4 border-blue-500 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Installation Date</p>
                    <div className="flex gap-6 mt-2 text-sm">
                        <div>
                            <p className="font-semibold">Date & Time</p>
                            <p className="text-gray-600">Oct 24, 2024 | 10:00 AM – 4:30 PM</p>
                        </div>
                        <div>
                            <p className="font-semibold">Completion Time</p>
                            <p className="text-gray-600">6 Hours 30 Minutes</p>
                        </div>
                    </div>
                </div>

                {/* Team Assigned */}
                <div className="bg-white border-l-4 border-green-500 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-2">Team Assigned</p>
                    <div className="flex gap-6">
                        <Member
                            name="Rajesh Kumar"
                            role="Lead Installer"
                            avatarSrc="https://i.pravatar.cc/100?img=12"
                        />
                        <Member
                            name="Amit Singh"
                            role="Technician"
                            avatarSrc="https://i.pravatar.cc/100?img=13 "
                        />
                    </div>
                </div>

            </div>

            {/* Site Evidence */}
            <div className="bg-white border rounded-lg overflow-hidden">
                <div className="bg-blue-600 text-white px-4 py-3 font-semibold">
                    Site Evidence
                </div>
                <div className="p-4 text-sm text-gray-500">
                    Please review the before and after photos to confirm the work quality.
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageSection title="Before Installation" />
                    <ImageSection title="After Installation" />
                </div>
            </div>

            {/* Confirmation */}
            <div className="bg-white border rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" />
                    By confirming, you acknowledge the work is complete as per scope.
                </label>

                <div className="flex gap-3">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm">
                        ⭐ Give Feedback
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm">
                        ✔ Confirm Completion
                    </button>
                </div>
            </div>

        </div>
    )
}
