import ApiError from "../../../../utils/master/ApiError.js";
import EmployeeProfile from "../../models/onboarding/employeeProfile.model.js";
import Attandance from "../../models/attendance/attendance.model.js";
import salarySlipModel from "../../models/payroll/salarySlip.model.js";
import salaryModel from "../../models/payroll/salary.model.js";
import PDFDocument from "pdfkit";
import dayjs from "dayjs";

// ======================  HELPER FUNCTIONS ======================
const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1];
};
const getWorkingDays = (start, end) => {
    let count = 0;
    const current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
        current.setDate(current.getDate() + 1);
    }
    return count;
};


const calculateEmployeeSalary = (employee) => {
    const sal = employee.salary || {};
    const basic = sal.basic || 0;
    const hra = sal.hra || 0;
    const allowances = sal.allowances || 0;
    const deductions = sal.deductions || 0;
    const ctc = sal.ctc || 0;

    let totalSalary = basic + hra + allowances - deductions;
    return totalSalary > 0 ? totalSalary : ctc;
};

const calculateAttendanceSalary = async (employeeId, start, end, totalSalary) => {
    const attendance = await Attandance.find({
        employeeId: employeeId,
        date: { $gte: start, $lte: end }
    });

    const presentDays = attendance.filter(a => a.status === "present").length;
    const halfDays = attendance.filter(a => a.status === "halfday").length;
    const totalWorkingDays = getWorkingDays(start, end);


    let absentDays = 0;
    if (attendance.length > 0) {
        absentDays = Math.max(0, totalWorkingDays - presentDays - (halfDays * 0.5));
    }

    const oneday_salary = totalWorkingDays > 0 ? totalSalary / totalWorkingDays : 0;
    const estimate_salary = (oneday_salary * presentDays) + (oneday_salary * 0.5 * halfDays);

    return {
        presentDays,
        halfDays,
        absentDays: Math.round(absentDays),
        totalWorkingDays,
        estimate_salary: Math.round(estimate_salary),
        attendanceRecords: attendance.length
    };
};
export const viewSallery_slipe = async (req, res, next) => {
    try {
        const { startDate, endDate, year, month } = req.query;

        //  NEW: Support for month parameter
        if (month && year) {
            const numericYear = Number(year);
            const frontendMonth = parseInt(month);

            if (frontendMonth < 1 || frontendMonth > 12) {
                return res.status(400).json({
                    success: false,
                    message: "Month must be between 1 and 12"
                });
            }

            const allEmployees = await EmployeeProfile.find()
                .select('name email salary employeeId createdAt departmentId designationId')
                .populate('departmentId', 'name')
                .populate('designationId', 'name');

            const result = await Promise.all(
                allEmployees.map(async (employee) => {
                    try {
                        //  Date calculation with 1-based months
                        const start = new Date(numericYear, frontendMonth - 1, 1);
                        const end = new Date(numericYear, frontendMonth, 0, 23, 59, 59, 999);

                        const totalSalary = calculateEmployeeSalary(employee);
                        const attendanceData = await calculateAttendanceSalary(employee._id, start, end, totalSalary);

                        //  Direct 1-based month query
                        const paymentStatus = await salaryModel.findOne({
                            employeeId: employee._id,
                            year: numericYear,
                            month: frontendMonth  //  1-based month
                        });

                        return {
                            employeeId: employee._id,
                            employeeName: employee.name,
                            employeeCode: employee.employeeId,
                            email: employee.email,
                            department: employee.departmentId?.name,
                            designation: employee.designationId?.name,
                            actualSalary: Math.round(totalSalary),
                            presentDays: attendanceData.presentDays,
                            halfDays: attendanceData.halfDays,
                            absentDays: attendanceData.absentDays,
                            totalWorkingDays: attendanceData.totalWorkingDays,
                            estimate_salary: attendanceData.estimate_salary,
                            period: `${getMonthName(frontendMonth)} ${numericYear}`,
                            status: paymentStatus?.isPaid
                                ? "Paid"
                                : paymentStatus
                                ? "Rejected"
                                : "Unpaid",
                            paidAmount: paymentStatus?.paidAmount || 0,
                            attendanceRecords: attendanceData.attendanceRecords,
                            //  Same format as viewSalary_ByMonth
                            queryInfo: {
                                "requested": `${getMonthName(frontendMonth)} ${numericYear} (Month: ${frontendMonth})`,
                                "databaseQuery": {
                                    "year": numericYear,
                                    "month": frontendMonth,
                                    "monthName": getMonthName(frontendMonth)
                                }
                            }
                        };
                    } catch (error) {
                        console.error(`Error processing employee ${employee._id}:`, error);
                        return null;
                    }
                })
            );

            const filteredResult = result.filter(item => item !== null);

            return res.status(200).json({
                success: true,
                message: `Monthly salary details for ${getMonthName(frontendMonth)} ${numericYear} fetched successfully`,
                count: filteredResult.length,
                period: `${getMonthName(frontendMonth)} ${numericYear}`,
                data: filteredResult,
            });
        }

        // Validate input for existing functionality
        if (!startDate && !endDate && !year) {
            return res.status(400).json({
                success: false,
                message: "Please provide either date range (startDate & endDate) or year"
            });
        }

        const allEmployees = await EmployeeProfile.find().select('name email salary employeeId createdAt');

        // CASE 1: Date Range Filter (Existing functionality)
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            if (start > end) {
                return res.status(400).json({
                    success: false,
                    message: "Start date cannot be after end date"
                });
            }

            const result = await Promise.all(
                allEmployees.map(async (employee) => {
                    try {
                        const totalSalary = calculateEmployeeSalary(employee);
                        const attendanceData = await calculateAttendanceSalary(employee._id, start, end, totalSalary);

                        return {
                            employeeId: employee._id,
                            employeeCode: employee.employeeId,
                            employeeName: employee.name,
                            email: employee.email,
                            actualSalary: totalSalary,
                            ...attendanceData,
                            month: start.toLocaleString("default", { month: "long" }),
                            year: start.getFullYear(),
                            period: `${startDate} to ${endDate}`,
                            source: "calculated"
                        };
                    } catch (error) {
                        console.error(`Error processing employee ${employee._id}:`, error);
                        return null;
                    }
                })
            );

            const filteredResult = result.filter(item => item !== null);

            return res.status(200).json({
                success: true,
                message: `Salary slips calculated for ${filteredResult.length} employees`,
                count: filteredResult.length,
                period: `${startDate} to ${endDate}`,
                data: filteredResult,
            });
        }

        // CASE 2: Year Filter (Existing functionality)
        if (year) {
            const numericYear = Number(year);
            const currentYear = new Date().getFullYear();

            if (numericYear > currentYear) {
                return res.status(400).json({
                    success: false,
                    message: `Year ${numericYear} is in the future`
                });
            }

            const result = [];

            await Promise.all(
                allEmployees.map(async (employee) => {
                    try {
                        const totalSalary = calculateEmployeeSalary(employee);
                        const joiningDate = new Date(employee.createdAt);

                        const monthlyResults = await Promise.all(
                            Array.from({ length: 12 }).map(async (_, monthIndex) => {
                                // Skip months before joining
                                if (numericYear < joiningDate.getFullYear() ||
                                    (numericYear === joiningDate.getFullYear() && monthIndex < joiningDate.getMonth())) {
                                    return null;
                                }

                                const start = new Date(numericYear, monthIndex, 1);
                                const end = new Date(numericYear, monthIndex + 1, 0, 23, 59, 59, 999);

                                const attendanceData = await calculateAttendanceSalary(employee._id, start, end, totalSalary);

                                //  UPDATED: 1-based month query
                                const paymentStatus = await salaryModel.findOne({
                                    employeeId: employee._id,
                                    year: numericYear,
                                    month: monthIndex + 1 // 1-based month
                                });

                                return {
                                    employeeId: employee._id,
                                    employeeCode: employee.employeeId,
                                    employeeName: employee.name,
                                    email: employee.email,
                                    actualSalary: totalSalary,
                                    ...attendanceData,
                                    year: numericYear,
                                    month: start.toLocaleString("default", { month: "long" }),
                                    monthNumber: monthIndex + 1,
                                    status: paymentStatus?.isPaid
                                        ? "Paid"
                                        : paymentStatus
                                        ? "Rejected"
                                        : "Unpaid",
                                    paidAmount: paymentStatus?.paidAmount || 0
                                };
                            })
                        );

                        result.push(...monthlyResults.filter(Boolean));
                    } catch (error) {
                        console.error(`Error processing employee ${employee._id}:`, error);
                    }
                })
            );

            // Sort by month number
            result.sort((a, b) => a.monthNumber - b.monthNumber);

            return res.status(200).json({
                success: true,
                message: `Monthly salary slips for year ${numericYear}`,
                count: result.length,
                year: numericYear,
                data: result,
            });
        }

    } catch (err) {
        console.error("Salary slip view error:", err);
        return next(new ApiError(err.message, 500));
    }
};

// ====================== 2️⃣ VIEW SINGLE EMPLOYEE SALARY ======================
export const viewSallery_employee = async (req, res, next) => {
    try {
        const { id } = req.params; // This can be employee ID or registrationId
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required"
            });
        }

        // Try finding employee by registrationId first, then by _id
        let employee = await EmployeeProfile.findOne({ registrationId: id });
        if (!employee) {
            employee = await EmployeeProfile.findById(id);
        }
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (start > end) {
            return res.status(400).json({
                success: false,
                message: "Start date cannot be after end date"
            });
        }

        const totalSalary = calculateEmployeeSalary(employee);
        const attendanceData = await calculateAttendanceSalary(employee._id, start, end, totalSalary);

        return res.status(200).json({
            success: true,
            message: "Employee salary details fetched successfully",
            data: {
                employeeId: employee._id,
                employeeCode: employee.employeeId,
                employeeName: employee.name,
                email: employee.email,
                actualSalary: totalSalary,
                ...attendanceData,
                period: `${startDate} to ${endDate}`
            }
        });
    } catch (err) {
        console.error("Employee salary view error:", err);
        return next(new ApiError(err.message, 500));
    }
};

// ====================== 3️⃣ ADD MANUAL SALARY SLIP ======================
export const add_salary_slip = async (req, res, next) => {
    try {
        const { employeeId, name, email, mobile, actualSalary, totalDay, presentDay, absentDay, estimateSalary, month, year } = req.body;

        // Validate required fields
        if (!employeeId || !actualSalary) {
            return res.status(400).json({
                success: false,
                message: "Employee ID and actual salary are required"
            });
        }

        // Check if employee exists
        const employee = await EmployeeProfile.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        // Create salary slip
        const result = await salarySlipModel.create({
            employeeId,
            name: name || employee.name,
            email: email || employee.email,
            mobile: mobile || employee.phone,
            actualSalary,
            totalDay,
            presentDay,
            absentDay,
            estimateSalary,
            month: month || new Date().getMonth() + 1,
            year: year || new Date().getFullYear(),
            source: "manual"
        });

        return res.status(201).json({
            success: true,
            message: "Salary slip created successfully",
            data: result
        });
    } catch (err) {
        console.error("Add salary slip error:", err);
        return next(new ApiError(err.message, 500));
    }
};

// ====================== 4️⃣ DOWNLOAD SALARY SLIP PDF ======================
export const download_salary_slip = async (req, res, next) => {
    try {
        const { id } = req.params;
        let { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: "Year and month are required"
            });
        }

        // Trim & sanitize query params to remove newline or extra spaces
        year = String(year).trim();
        month = String(month).trim();

        const employee = await EmployeeProfile.findById(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0, 23, 59, 59, 999);

        const totalSalary = calculateEmployeeSalary(employee);
        const attendanceData = await calculateAttendanceSalary(employee._id, start, end, totalSalary);

        // Safe string for filename (remove newlines / special chars)
        const safeString = (str) => String(str || 'Unknown').replace(/[\n\r]/g, '').trim();
        const filename = `salary-slip-${safeString(employee.name)}-${month}-${year}.pdf`;

        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "application/pdf");

        // Create PDF
        const doc = new PDFDocument({ size: "A4", margin: 40 });
        doc.pipe(res);

        // PDF Content
        doc.fontSize(20).font("Helvetica-Bold").text("CODE CRAFTER WEB SOLUTIONS", { align: "center" });
        doc.moveDown(0.5);
        doc.fontSize(16).text("Salary Slip", { align: "center" });
        doc.moveDown(1);

        // Employee Details
        doc.fontSize(12).font("Helvetica-Bold").text("Employee Details:", 50, 150);
        doc.font("Helvetica");
        doc.text(`Name: ${safeString(employee.name)}`, 50, 170);
        doc.text(`Employee ID: ${safeString(employee.employeeId)}`, 50, 185);
        doc.text(`Email: ${safeString(employee.email)}`, 50, 200);
        doc.text(`Phone: ${safeString(employee.phone)}`, 50, 215);

        // Salary Details
        doc.font("Helvetica-Bold").text("Salary Details:", 300, 150);
        doc.font("Helvetica");
        doc.text(`Month: ${dayjs(start).format("MMMM YYYY")}`, 300, 170);
        doc.text(`Actual Salary: ₹${totalSalary}`, 300, 185);
        doc.text(`Present Days: ${attendanceData.presentDays || 0}`, 300, 200);
        doc.text(`Half Days: ${attendanceData.halfDays || 0}`, 300, 215);
        doc.text(`Absent Days: ${attendanceData.absentDays || 0}`, 300, 230);
        doc.text(`Working Days: ${attendanceData.totalWorkingDays || 0}`, 300, 245);
        doc.text(`Estimated Salary: ₹${attendanceData.estimate_salary || 0}`, 300, 260);

        // Footer
        doc.fontSize(10).text("Generated on: " + new Date().toLocaleDateString(), 50, 400);
        doc.text("This is a computer generated document", 50, 415);

        doc.end();
    } catch (err) {
        console.error("PDF download error:", err);
        return next(
            new ApiError(
                String(err?.message ?? 'Something went wrong'),
                500
            )
        );
    }
};



// ====================== 5️⃣ SALARY PAYMENT ======================
export const SalaryPay = async (req, res, next) => {
    try {
        const { employeeId, year, month, isPaid } = req.body;  
        if (!employeeId || year === undefined || month === undefined) {
            return res.status(400).json({
                success: false,
                message: "Employee ID, year, and month are required"
            });
        }

        const frontendMonth = parseInt(month);
        if (frontendMonth < 1 || frontendMonth > 12) {
            return res.status(400).json({
                success: false,
                message: "Month must be between 1 and 12"
            });
        }

        const employee = await EmployeeProfile.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        // ✅ Automatically calculate estimated salary
        const start = new Date(year, frontendMonth - 1, 1);
        const end = new Date(year, frontendMonth, 0, 23, 59, 59, 999);
        const totalSalary = calculateEmployeeSalary(employee);  // total salary
        const attendanceData = await calculateAttendanceSalary(employee._id, start, end, totalSalary);
        const estimatedPayment = attendanceData.estimate_salary || 0;  // use estimate_salary

        // Save payment record
        const record = await salaryModel.findOneAndUpdate(
            {
                employeeId,
                year: parseInt(year),
                month: frontendMonth
            },
            {
                isPaid: isPaid !== undefined ? isPaid : true,  // mark paid
                paidAmount: estimatedPayment
            },
            {
                upsert: true,
                new: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: `Salary payment for ${getMonthName(frontendMonth)} ${year} marked as paid`,
            data: record
        });
    } catch (err) {
        console.error("❌ Salary payment error:", err);
        return next(new ApiError(err.message, 500));
    }
};


export const viewSalary_ByMonth = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: "Year and month are required"
            });
        }

        //  NO CONVERSION - Direct 1-based months
        const frontendMonth = parseInt(month);

        if (frontendMonth < 1 || frontendMonth > 12) {
            return res.status(400).json({
                success: false,
                message: "Month must be between 1 and 12"
            });
        }

        const employee = await EmployeeProfile.findById(id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        //  Date calculation with 1-based months
        // Note: JavaScript Date uses 0-based months, so we need conversion only for dates
        const start = new Date(parseInt(year), frontendMonth - 1, 1);
        const end = new Date(parseInt(year), frontendMonth, 0, 23, 59, 59, 999);

        const attendance = await Attandance.find({
            employeeId: employee._id,
            date: { $gte: start, $lte: end }
        });

        const presentDays = attendance.filter(a => a.status === "present").length;
        const halfDays = attendance.filter(a => a.status === "halfday").length;
        const totalWorkingDays = getWorkingDays(start, end);

        let absentDays = 0;
        if (attendance.length > 0) {
            absentDays = Math.max(0, totalWorkingDays - presentDays - (halfDays * 0.5));
        }

        const sal = employee.salary || {};
        const totalSalary = sal.ctc || (sal.basic + sal.hra + sal.allowances - sal.deductions) || 0;
        const oneday_salary = totalWorkingDays > 0 ? totalSalary / totalWorkingDays : 0;
        const estimate_salary = Math.round((oneday_salary * presentDays) + (oneday_salary * 0.5 * halfDays));

        //  Direct 1-based month query
        const paymentStatus = await salaryModel.findOne({
            employeeId: id,
            year: parseInt(year),
            month: frontendMonth  //  1-based month
        });

        return res.status(200).json({
            success: true,
            message: `Monthly salary details for ${getMonthName(frontendMonth)} ${year} fetched successfully`,
            data: {
                employeeId: employee._id,
                employeeName: employee.name,
                employeeCode: employee.employeeId,
                email: employee.email,
                actualSalary: Math.round(totalSalary),
                presentDays,
                halfDays,
                absentDays: Math.round(absentDays),
                totalWorkingDays,
                estimate_salary,
                period: `${getMonthName(frontendMonth)} ${year}`,
                status: paymentStatus?.isPaid
                    ? "Paid"
                    : paymentStatus
                    ? "Rejected"
                    : "Unpaid",
                paidAmount: paymentStatus?.paidAmount || 0,
                attendanceRecords: attendance.length,
                queryInfo: {
                    "requested": `${getMonthName(frontendMonth)} ${year} (Month: ${frontendMonth})`,
                    "databaseQuery": {
                        "year": parseInt(year),
                        "month": frontendMonth,  //  Same 1-based month
                        "monthName": getMonthName(frontendMonth)
                    }
                }
            }
        });
    } catch (err) {
        return next(new ApiError(err.message, 500));
    }
};

// Helper function to get month name

// ====================== 7️⃣ TOTAL PAID & UNPAID ======================
export const total_paid_unpaid = async (req, res, next) => {
    try {
        const { year, month } = req.query;

        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: "Year and month are required"
            });
        }

        //  NO CONVERSION - Direct 1-based months
        const frontendMonth = parseInt(month);

        const records = await salaryModel.find({
            year: parseInt(year),
            month: frontendMonth  //  1-based month
        }).populate('employeeId', 'name employeeId');

        const totalPaid = records.filter(r => r.isPaid).length;
        const totalUnpaid = records.filter(r => !r.isPaid).length;

        const paidEmployees = records.filter(r => r.isPaid).map(r => ({
            employeeId: r.employeeId?._id,
            employeeName: r.employeeId?.name,
            employeeCode: r.employeeId?.employeeId,
            paidAmount: r.paidAmount
        }));

        const unpaidEmployees = records.filter(r => !r.isPaid).map(r => ({
            employeeId: r.employeeId?._id,
            employeeName: r.employeeId?.name,
            employeeCode: r.employeeId?.employeeId
        }));

        return res.status(200).json({
            success: true,
            message: "Payment summary fetched successfully",
            data: {
                totalPaid,
                totalUnpaid,
                paidEmployees,
                unpaidEmployees,
                period: `${month}/${year}`,
                queryUsed: {
                    "year": parseInt(year),
                    "month": frontendMonth  //  Same 1-based month
                }
            }
        });
    } catch (err) {
        return next(new ApiError(err.message, 500));
    }

};

/**
 * 8️⃣ APPROVE SALARY PAYMENT
 * Marks salary as PAID (cannot revert once paid)
 */
export const approveSalary = async (req, res, next) => {
    try {
        const { employeeId, year, month } = req.body;

        if (!employeeId || !year || !month) {
            return res.status(400).json({
                success: false,
                message: "employeeId, year, and month are required"
            });
        }

        const frontendMonth = parseInt(month);

        const employee = await EmployeeProfile.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        // Calculate estimated payment
        const start = new Date(year, frontendMonth - 1, 1);
        const end = new Date(year, frontendMonth, 0, 23, 59, 59, 999);

        const totalSalary = calculateEmployeeSalary(employee);
        const attendanceData = await calculateAttendanceSalary(employee._id, start, end, totalSalary);
        const estimatedPayment = attendanceData.estimate_salary || 0;

        const updated = await salaryModel.findOneAndUpdate(
            { employeeId, year, month: frontendMonth },
            {
                isPaid: true,
                paidAmount: estimatedPayment
            },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Salary approved successfully",
            data: updated
        });
    } catch (err) {
        console.error("Approve Salary Error:", err);
        return next(new ApiError(err.message, 500));
    }
};

/**
 * 9️⃣ REJECT SALARY PAYMENT
 * Marks salary as UNPAID — ONLY if not already paid
 */
export const rejectSalary = async (req, res, next) => {
    try {
        const { employeeId, year, month } = req.body;

        if (!employeeId || !year || !month) {
            return res.status(400).json({
                success: false,
                message: "employeeId, year, and month are required"
            });
        }

        const frontendMonth = parseInt(month);

        const record = await salaryModel.findOne({
            employeeId,
            year,
            month: frontendMonth
        });

        // Cannot reject after approval
        if (record?.isPaid) {
            return res.status(400).json({
                success: false,
                message: "Cannot mark as unpaid after salary is already paid"
            });
        }

        const updated = await salaryModel.findOneAndUpdate(
            { employeeId, year, month: frontendMonth },
            { isPaid: false, paidAmount: 0 },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Salary rejected successfully",
            data: updated
        });
    } catch (err) {
        console.error("Reject Salary Error:", err);
        return next(new ApiError(err.message, 500));
    }
};

/**
 *  🔟 PAYROLL MONTHLY EXPENSE CHART (FOR DASHBOARD)
 *  Returns total payroll paid per month for a given year.
 */
export const getPayrollChart = async (req, res, next) => {
  try {
    const { year } = req.query;
    const selectedYear = parseInt(year) || new Date().getFullYear();

    // Fetch all salary payment records for the selected year
    const records = await salaryModel.find({ year: selectedYear });

    // Initialize 12 months with zero
    const monthlyTotals = Array.from({ length: 12 }, () => 0);

    // Sum paidAmount for each month
    records.forEach((rec) => {
      const monthIndex = (rec.month || 1) - 1; // convert 1-based month to 0-based index
      monthlyTotals[monthIndex] += rec.paidAmount || 0;
    });

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return res.status(200).json({
      success: true,
      year: selectedYear,
      months: monthNames,
      amounts: monthlyTotals
    });
  } catch (err) {
    return next(new ApiError(err.message, 500));
  }
};