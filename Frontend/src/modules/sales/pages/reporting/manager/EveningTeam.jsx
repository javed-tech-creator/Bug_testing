// EveningTeam.jsx
import { useGetTeamReportingStatusQuery, useSubmitManagerReportMutation } from '@/api/sales/reporting.api';
import { Eye, Target, TrendingDown, TrendingUp, Users, DollarSign, Briefcase, Package, BarChart, Clock, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';
import SubmitTeamReportModal from './SubmitTeamReportModal';
import { toast } from 'react-toastify';

function EveningTeam() {

    const fmt = (n) =>
        typeof n === "number"
            ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n)
            : n;


    const { data, isLoading } = useGetTeamReportingStatusQuery({ date: new Date().toISOString().split('T')[0] });
   
       const [open, setOpen] = React.useState(false);
       const [submitReport, { isLoading:teamLoading }] = useSubmitManagerReportMutation();

    // Mock team data with daily reporting fields
    const teamMembers = data?.data?.teamMembers || []
    // Calculate team summary
    const teamSummary = data?.data?.teamSummary || {}

    const totalIncentive = teamSummary.totalTeamIncentive || 0;
    const conversionRate = teamSummary.teamConversionRate || 0;

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
        <div className="space-y-6">
              <SubmitTeamReportModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onSubmit={handleSubmitTeamReport}
                    loading={teamLoading}
                    reportType="evening"
                />
            {/* First Row - 4 Cards (Lead Counts) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Lead In */}
                <div className="bg-white border-t-4 shadow-md border-black rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-600">Total Lead In</div>
                            <div className="text-2xl font-bold mt-1">{teamSummary.totalLeadIn}</div>
                        </div>
                        <div className="p-2 bg-black rounded-md">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                        <div className="text-sm text-gray-600">Avg per member</div>
                        <div className="text-sm font-medium">{Math.round(teamSummary.totalLeadIn / teamMembers.length)}</div>
                    </div>
                </div>

                {/* Sales In */}
                <div className="bg-white border-t-4 shadow-md border-black rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-600">Sales In</div>
                            <div className="text-2xl font-bold mt-1">{teamSummary.totalSalesIn}</div>
                        </div>
                        <div className="p-2 bg-black rounded-md">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                        <div className="text-sm text-gray-600">Avg per member</div>
                        <div className="text-sm font-medium">{Math.round(teamSummary.totalSalesIn / teamMembers.length)}</div>
                    </div>
                </div>

                {/* Business In */}
                <div className="bg-white border-t-4 shadow-md border-black rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-600">Business In</div>
                            <div className="text-2xl font-bold mt-1">{teamSummary.totalBusinessIn}</div>
                        </div>
                        <div className="p-2 bg-black rounded-md">
                            <Briefcase className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                        <div className="text-sm text-gray-600">Avg per member</div>
                        <div className="text-sm font-medium">{Math.round(teamSummary.totalBusinessIn / teamMembers.length)}</div>
                    </div>
                </div>

                {/* Amount In */}
                <div className="bg-white border-t-4 shadow-md border-black rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-600">Amount In</div>
                            <div className="text-2xl font-bold mt-1">{teamSummary.totalAmountIn}</div>
                        </div>
                        <div className="p-2 bg-black rounded-md">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                        <div className="text-sm text-gray-600">Avg per member</div>
                        <div className="text-sm font-medium">{Math.round(teamSummary.totalAmountIn / teamMembers.length)}</div>
                    </div>
                </div>
            </div>

            {/* Second Row - 3 Cards (Performance Metrics) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Actual Amount */}
                <div className="bg-white border-t-4 shadow-md border-black rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-600">Expected Amount</div>
                            <div className="text-xl font-bold mt-1">{fmt(teamSummary.totalExpected)}</div>
                          
                        </div>
                        <div className="p-2 bg-black rounded-md">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                        <div className="text-sm text-gray-600">Conversion Rate</div>
                        <div className="text-sm font-medium">{conversionRate}%</div>
                    </div>
                </div>

                {/* Time Spent */}
                <div className="bg-white border-t-4 shadow-md border-black rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-600">Total Time Spent</div>
                            <div className="text-2xl font-bold mt-1">{teamSummary.totalTimeSpent}h</div>
                        </div>
                        <div className="p-2 bg-black rounded-md">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                        <div className="text-sm text-gray-600">Avg per member</div>
                        <div className="text-sm font-medium">{(teamSummary.totalTimeSpent / teamMembers.length).toFixed(1)}h</div>
                    </div>
                </div>

                {/* Total Incentive */}
                <div className="bg-white border-t-4 shadow-md border-black rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-gray-600">Total Incentive</div>
                            <div className="text-xl font-bold mt-1">
                                {fmt(totalIncentive)}
                            </div>
                        </div>
                        <div className="p-2 bg-black rounded-md">
                            <BarChart className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-2 flex justify-between pt-3 border-t border-gray-100">
                        <div className="text-sm text-gray-600">Per member avg</div>
                        <div className="text-sm font-medium">
                            {fmt(Math.round(totalIncentive / teamMembers.length))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Performance Table */}
            <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                <div className="p-4 border-b border-black/10 bg-gray-50">
                    <h3 className="text-lg font-semibold text-black">Team Evening Reporting</h3>
                    <p className="text-sm text-gray-900">Click on any employee to view detailed evening report</p>
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
                                <th className="text-left p-3 text-sm font-medium text-gray-800">Exepected Amount</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-800">Time Spent</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-800">Status</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-800">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {teamMembers.map((member) => {
                                return (
                                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3">
                                            <div className="font-medium text-gray-900">{member.name}</div>
                                            <div className="text-xs text-gray-500">{member.designation}</div>
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
                                                {member.totalExpected >= member.totalExpected ? (
                                                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">Expected: {fmt(member.totalExpected)}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="text-sm font-medium text-gray-900">{member.timeSpent}h</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                    <span className="text-xs text-gray-600">Won: {member.won}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                    <span className="text-xs text-gray-600">Lost: {member.lost}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                    <span className="text-xs text-gray-600">Progress: {member.inProgress}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <Link to={`/sales/reporting/evening`}
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
                                    <div className="text-xs text-gray-500">Expected: {fmt(teamSummary.totalExpected)}</div>
                                </td>
                                <td className="p-3">
                                    <div className="text-sm font-bold text-gray-900">{teamSummary.totalTimeSpent}h</div>
                                </td>
                                <td className="p-3">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            <span className="text-xs text-gray-600">Won: {teamSummary.totalWon}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                            <span className="text-xs text-gray-600">Lost: {teamSummary.totalLost}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                            <span className="text-xs text-gray-600">Progress: {teamSummary.totalInProgress}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3">
                                  --
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='flex justify-end'>
                 <button
                        onClick={() => setOpen(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-black text-gray-50 rounded-sm"
                    >
                        Submit Team Report
                    </button>
            </div>
        </div>
    )
}

export default EveningTeam;