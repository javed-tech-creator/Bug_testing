import { useGetTeamReportingStatusQuery, useSubmitManagerReportMutation } from '@/api/sales/reporting.api';
import { Eye, Target, TrendingDown, TrendingUp, Users, DollarSign, Briefcase, Package, BarChart, PieChart, Clock, Activity } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import SubmitTeamReportModal from './SubmitTeamReportModal';


function MorningTeam() {

    const fmt = (n) =>
        typeof n === "number"
            ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n)
            : n;

    const PERCENT = 0.02;


    const { data } = useGetTeamReportingStatusQuery({ date: new Date().toISOString().split('T')[0] });
    const [open, setOpen] = React.useState(false);
    const [submitReport, { isLoading }] = useSubmitManagerReportMutation();



    // Mock team data with daily reporting fields
    const teamMembers = data?.data?.teamMembers || []

    // Calculate team summary
    const teamSummary = data?.data?.teamSummary || {}
    const handleSubmitTeamReport = async (payload) => {
        try {
            console.log("Submitting payload:", payload);
            await submitReport({formData:payload, reportType:payload?.reportType}).unwrap();
            toast.success("Team morning report submitted");
            setOpen(false);
        } catch (e) {
            toast.error(e?.data?.message || "Submit failed");
        }
    };


    return (
        <div>
            <SubmitTeamReportModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmitTeamReport}
                loading={isLoading}
                reportType="morning"
            />

            <div className="space-y-6">
                {/* First Row - 4 Cards (Lead Counts) */}
                <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-4">
                    {/* Total Lead In */}
                    <div className="bg-white  border-t-4 shadow-md  border-black rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className=" text-gray-600">Total Lead In</div>
                                <div className="text-2xl font-bold mt-1">{teamSummary?.totalLeadIn}</div>

                            </div>
                            <div className="p-2 bg-black rounded-md">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                            <div className="text-sm text-gray-600">Avg per member</div>
                            <div className="text-sm font-medium">{Math.round(teamSummary?.totalLeadIn / teamMembers?.length)}</div>
                        </div>
                    </div>

                    {/* Total Sales In */}
                    <div className="bg-white border-t-4 shadow-md border-black rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className=" text-gray-600">Sales In</div>
                                <div className="text-2xl font-bold mt-1">{teamSummary.totalSalesIn}</div>

                            </div>
                            <div className="p-2 bg-black rounded-md">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                            <div className="text-sm text-gray-600">Avg per member</div>
                            <div className="text-sm font-medium">{Math.round(teamSummary.totalSalesIn / teamMembers?.length)}</div>
                        </div>
                    </div>

                    {/* Total Business In */}
                    <div className="bg-white border-t-4 shadow-md border-black rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className=" text-gray-600">Business In</div>
                                <div className="text-2xl font-bold mt-1">{teamSummary.totalBusinessIn}</div>

                            </div>
                            <div className="p-2 bg-black rounded-md">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                            <div className="text-sm text-gray-600">Avg per member</div>
                            <div className="text-sm font-medium">{Math.round(teamSummary.totalBusinessIn / teamMembers?.length)}</div>
                        </div>
                    </div>

                    {/* Total Amount In */}
                    <div className="bg-white border-t-4 shadow-md border-black rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className=" text-gray-600">Amount In</div>
                                <div className="text-2xl font-bold mt-1">{teamSummary.totalAmountIn}</div>

                            </div>
                            <div className="p-2 bg-black rounded-md">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                            <div className="text-sm text-gray-600">Avg per member</div>
                            <div className="text-sm font-medium">{Math.round(teamSummary.totalAmountIn / teamMembers?.length)}</div>
                        </div>
                    </div>
                </div>

                {/* Second Row - 4 Cards (Performance Metrics) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Total Expected */}
                    <div className="bg-white border-t-4 shadow-md border-black rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className=" text-gray-600">Total Expected</div>
                                <div className="text-xl font-bold mt-1">{fmt(teamSummary.totalExpected)}</div>
                            </div>
                            <div className="p-2 bg-black rounded-md">
                                <Target className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                            <div className="text-sm text-gray-600">Avg per member</div>
                            <div className="text-sm font-medium">{fmt(Math.round(teamSummary.totalExpected / teamMembers?.length))}</div>
                        </div>
                    </div>

                    {/* Total Time Spent */}
                    <div className="bg-white border-t-4 shadow-md border-black rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className=" text-gray-600">Total Time Spent</div>
                                <div className="text-2xl font-bold mt-1">{teamSummary.totalTimeSpent}h</div>
                            </div>
                            <div className="p-2 bg-black rounded-md">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                            <div className="text-sm text-gray-600">Avg per member</div>
                            <div className="text-sm font-medium">{(teamSummary.totalTimeSpent / teamMembers?.length).toFixed(1)}h</div>
                        </div>
                    </div>


                    {/* Total Incentive */}
                    <div className="bg-white border-t-4 shadow-md border-black rounded-md p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className=" text-gray-600">Total Incentive</div>
                                <div className="text-xl font-bold mt-1">
                                    {fmt(
                                        (teamSummary.totalLeadIn + teamSummary.totalSalesIn + teamSummary.totalBusinessIn) *
                                        10000 * PERCENT
                                    )}
                                </div>
                            </div>
                            <div className="p-2 bg-black rounded-md">
                                <BarChart className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                            <div className="text-sm text-gray-600">Per member avg</div>
                            <div className="text-sm font-medium">
                                {fmt(Math.round(
                                    (teamSummary.totalLeadIn + teamSummary.totalSalesIn + teamSummary.totalBusinessIn) *
                                    10000 * PERCENT / teamMembers?.length
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {teamMembers?.length === 0 ? (
                    <div className="text-center text-gray-500 mt-10">
                        No team reporting data available for today.
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                        <div className="p-4 border-b bg-black">
                            <h3 className="text-lg font-semibold text-white">Team Daily Reporting</h3>
                            <p className="text-sm text-gray-100">Click on any employee to view detailed daily report</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="text-left p-3 text-sm font-medium text-gray-800">Employee</th>
                                        <th className="text-left p-3 text-sm font-medium text-gray-800">Total Lead</th>
                                        <th className="text-left p-3 text-sm font-medium text-gray-800">Lead In</th>
                                        <th className="text-left p-3 text-sm font-medium text-gray-800">Sales In</th>
                                        <th className="text-left p-3 text-sm font-medium text-gray-800">Business In</th>
                                        <th className="text-left p-3 text-sm font-medium text-gray-800">Amount In</th>
                                        <th className="text-left p-3 text-sm font-medium text-gray-800">Total Expected</th>
                                        <th className="text-left p-3 text-sm font-medium text-gray-800">Time Spent</th>

                                        <th className="text-left p-3 text-sm font-medium text-gray-800">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {teamMembers?.map((member) => {
                                        return (
                                            <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-3">
                                                    <div className="font-medium text-gray-900">{member.name}</div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex flex-col">
                                                        <div className="text-lg font-bold text-orange-600">{member.totalLead}</div>

                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex flex-col">
                                                        <div className="text-lg font-bold text-blue-600">{member.totalLeadIn}</div>

                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex flex-col">
                                                        <div className="text-lg font-bold text-green-600">{member.salesIn}</div>

                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex flex-col">
                                                        <div className="text-lg font-bold text-purple-600">{member.businessIn}</div>

                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="text-lg font-bold text-gray-900">{member.amountIn}</div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-bold text-gray-900">{fmt(member.totalExpected)}</div>

                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="text-sm font-medium text-gray-900">{member.timeSpent}h</div>
                                                </td>


                                                <td className="p-3">
                                                    <Link to={`/sales/reporting/morning`}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {/* Total Row */}
                                    <tr className="bg-gray-100 font-semibold">
                                        <td className="p-3">
                                            <div className="font-medium text-gray-900">TOTAL</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="text-lg font-bold text-orange-600">{teamSummary.totalLead}</div>

                                        </td>
                                        <td className="p-3">
                                            <div className="text-lg font-bold text-blue-600">{teamSummary.totalLeadIn}</div>

                                        </td>
                                        <td className="p-3">
                                            <div className="text-lg font-bold text-green-600">{teamSummary.totalSalesIn}</div>

                                        </td>
                                        <td className="p-3">
                                            <div className="text-lg font-bold text-purple-600">{teamSummary.totalBusinessIn}</div>

                                        </td>
                                        <td className="p-3">
                                            <div className="text-lg font-bold text-gray-900">{teamSummary.totalAmountIn}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="text-sm font-bold text-gray-900">{fmt(teamSummary.totalExpected)}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="text-sm font-bold text-gray-900">{teamSummary.totalTimeSpent}h</div>
                                        </td>

                                        <td className="p-3">
                                            --
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                <div className='flex justify-end cursor-pointer'>

                    <button
                        onClick={() => setOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-black text-gray-50 rounded-sm"
                    >
                        Submit Team Report
                    </button>

                </div>
            </div>
        </div>
    )
}

export default MorningTeam