import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';

// Employee data model for the dropdown
class Employee {
  final String id;
  final String name;
  final String email;
  final String avatar;

  Employee({
    required this.id,
    required this.name,
    required this.email,
    required this.avatar,
  });
}

// Data model for attendance status on a specific date
class Attendance {
  final String status;
  final Color color;

  Attendance({required this.status, required this.color});
}

class HREmpCalendarViewWidget extends StatefulWidget {
  const HREmpCalendarViewWidget({super.key});

  @override
  State<HREmpCalendarViewWidget> createState() =>
      _HREmpCalendarViewWidgetState();
}

class _HREmpCalendarViewWidgetState extends State<HREmpCalendarViewWidget> {
  // State variables
  late DateTime _currentDate;
  late Employee _selectedEmployee;
  DateTime? _selectedDay;

  // Mock data
  final List<Employee> _employees = [
    Employee(
      id: 'kn185@gmail.com',
      name: 'Test test1',
      email: 'kn185@gmail.com',
      avatar: 'T',
    ),
    Employee(
      id: 'jsmith@example.com',
      name: 'John Smith',
      email: 'jsmith@example.com',
      avatar: 'J',
    ),
    Employee(
      id: 'dramirez@example.com',
      name: 'David Ramirez',
      email: 'dramirez@example.com',
      avatar: 'D',
    ),
  ];

  // Mock attendance data for the selected employee
  // Map<YYYY-MM-DD, Attendance>
  final Map<String, Attendance> _attendanceData = {
    '2025-08-01': Attendance(status: 'A', color: Colors.red), // Absent
    '2025-08-04': Attendance(status: 'A', color: Colors.red),
    '2025-08-05': Attendance(status: 'A', color: Colors.red),
    '2025-08-06': Attendance(status: 'A', color: Colors.red),
    '2025-08-07': Attendance(status: 'A', color: Colors.red),
    '2025-08-08': Attendance(status: 'A', color: Colors.red),
    '2025-08-11': Attendance(status: 'H', color: Colors.amber), // Half-day
    '2025-08-12': Attendance(status: 'H', color: Colors.amber),
    '2025-08-18': Attendance(status: 'A', color: Colors.red),
    '2025-08-25': Attendance(status: 'P', color: Colors.green), // Present
    '2025-08-14': Attendance(status: 'P', color: Colors.green), // Present
  };

  // Mock data for detailed attendance
  final Map<String, Map<String, String>> _detailedAttendanceData = {
    '2025-08-01': {
      'status': 'Leave',
      'reason': 'Medical Leave',
      'time': 'Full Day',
    },
    '2025-08-11': {
      'status': 'Half Day',
      'checkIn': '09:00 AM',
      'checkOut': '01:00 PM',
      'workDuration': '4h 0m',
    },
    '2025-08-25': {
      'status': 'Full Day',
      'checkIn': '09:00 AM',
      'checkOut': '06:00 PM',
      'workDuration': '9h 0m',
    },
    '2025-08-14': {
      'status': 'Full Day',
      'checkIn': '09:15 AM',
      'checkOut': '06:30 PM',
      'workDuration': '9h 15m',
    },
  };

  @override
  void initState() {
    super.initState();
    _currentDate = DateTime.now();
    _selectedEmployee = _employees.first;
    _selectedDay = _currentDate; // Set the current day as the default selected day
  }

  // Go to the previous month
  void _prevMonth() {
    setState(() {
      _currentDate = DateTime(
        _currentDate.year,
        _currentDate.month - 1,
        1,
      );
      _selectedDay = null; // Clear selection when month changes
    });
  }

  // Go to the next month
  void _nextMonth() {
    setState(() {
      _currentDate = DateTime(
        _currentDate.year,
        _currentDate.month + 1,
        1,
      );
      _selectedDay = null; // Clear selection when month changes
    });
  }

  // Function to build a single day cell in the calendar grid
  Widget _buildCalendarDay(int day) {
    final date = DateTime(_currentDate.year, _currentDate.month, day);
    final formattedDate = DateFormat('yyyy-MM-dd').format(date);
    final attendance = _attendanceData[formattedDate];
    final bool isToday = date.day == DateTime.now().day &&
        date.month == DateTime.now().month &&
        date.year == DateTime.now().year;
    final bool isSelected = _selectedDay != null && date.day == _selectedDay!.day &&
        date.month == _selectedDay!.month && date.year == _selectedDay!.year;

    Color backgroundColor = Colors.white;
    Color textColor = Colors.black;
    if (attendance != null) {
      backgroundColor = attendance.color;
      textColor = Colors.white;
    }

    BoxDecoration? containerDecoration;
    if (isSelected) {
      containerDecoration = BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: AppColors.primary, width: 2),
      );
    } else if (isToday) {
      containerDecoration = BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.blue, width: 2),
      );
    }

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedDay = date;
        });
      },
      child: Container(
        decoration: containerDecoration,
        child: Center(
          child: Container(
            width: 32, // Fixed width for the circle
            height: 32, // Fixed height for the circle
            decoration: BoxDecoration(
              color: backgroundColor,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                day.toString(),
                style: AppTextStyles.body1(
                  context,
                  overrideStyle: TextStyle(
                    color: textColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // Function to build the legend item
  Widget _buildLegendItem(Color color, String label, int count) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 4),
        Text(
          '$count $label',
          style: AppTextStyles.body1(context),
        ),
        const SizedBox(width: 12),
      ],
    );
  }

  // Widget to build the day details section
  Widget _buildDayDetails() {
    if (_selectedDay == null) {
      return const SizedBox(); // Return an empty box if no day is selected
    }

    final formattedDate = DateFormat('yyyy-MM-dd').format(_selectedDay!);
    final details = _detailedAttendanceData[formattedDate];

    // Default values if no details are found
    String status = details?['status'] ?? 'No data found';
    String checkIn = details?['checkIn'] ?? '--';
    String checkOut = details?['checkOut'] ?? '--';
    String workDuration = details?['workDuration'] ?? '--';
    String reason = details?['reason'] ?? 'N/A';

    return Container(
      padding: const EdgeInsets.all(16),
      margin: ResponsiveHelper.paddingSymmetric(context, horizontal: 10, vertical: 20),
      decoration: BoxDecoration(
        color: AppColors.whiteColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Details for ${DateFormat('EEE, MMM d, yyyy').format(_selectedDay!)}',
            style: AppTextStyles.heading2(
              context,
              overrideStyle: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          const Divider(height: 20, thickness: 1),
          _buildDetailRow('Status', status),
          if (details != null && details['status'] == 'Leave')
            _buildDetailRow('Reason', reason),
          if (details != null && details['status'] != 'Leave') ...[
            _buildDetailRow('Check In', checkIn),
            _buildDetailRow('Check Out', checkOut),
            _buildDetailRow('Total Hours', workDuration),
          ],
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: AppTextStyles.body1(context).copyWith(color: AppColors.txtGreyColor),
          ),
          Text(
            value,
            style: AppTextStyles.body1(context).copyWith(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Get the number of days in the current month
    final daysInMonth = DateTime(_currentDate.year, _currentDate.month + 1, 0).day;

    // Get the weekday of the first day of the month
    final firstDayOfMonthWeekday = DateTime(_currentDate.year, _currentDate.month, 1).weekday;

    // Adjust the weekday to correctly map to a grid starting on Sunday.
    final int firstDayOffset = firstDayOfMonthWeekday == DateTime.sunday ? 0 : firstDayOfMonthWeekday;

    final totalGridItems = daysInMonth + firstDayOffset;

    // Calculate legend counts
    int lateCount = 0;
    int halfDayCount = 0;
    int absentCount = 0;
    int presentCount = 0;

    _attendanceData.forEach((key, value) {
      if (key.startsWith(DateFormat('yyyy-MM').format(_currentDate))) {
        if (value.status == 'L') lateCount++;
        if (value.status == 'H') halfDayCount++;
        if (value.status == 'A') absentCount++;
        if (value.status == 'P') presentCount++;
      }
    });

    return Padding(
      padding: ResponsiveHelper.paddingOnly(context, top: 10),
      child: Container(
        color: AppColors.whiteColor,
        padding: ResponsiveHelper.paddingSymmetric(context, horizontal: 10, vertical: 10),
        child: Column(
          children: [
            Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.chevron_left),
                  onPressed: _prevMonth,
                ),
                Expanded(
                  child: Center(
                    child: Text(
                      DateFormat('MMMM yyyy').format(_currentDate),
                      style: AppTextStyles.heading1(
                        context,
                        overrideStyle: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.chevron_right),
                  onPressed: _nextMonth,
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Calendar Grid
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Weekday headers
                  Padding(
                    padding: ResponsiveHelper.paddingSymmetric(context, vertical: 10),
                    child: Row(
                      children: [
                        Expanded(child: Center(child: Text('Sun', style: AppTextStyles.body1(context)))),
                        Expanded(child: Center(child: Text('Mon', style: AppTextStyles.body1(context)))),
                        Expanded(child: Center(child: Text('Tue', style: AppTextStyles.body1(context)))),
                        Expanded(child: Center(child: Text('Wed', style: AppTextStyles.body1(context)))),
                        Expanded(child: Center(child: Text('Thu', style: AppTextStyles.body1(context)))),
                        Expanded(child: Center(child: Text('Fri', style: AppTextStyles.body1(context)))),
                        Expanded(child: Center(child: Text('Sat', style: AppTextStyles.body1(context)))),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Calendar days
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 7,
                      crossAxisSpacing: 4,
                      mainAxisSpacing: 4,
                      childAspectRatio: 1.0,
                    ),
                    itemCount: totalGridItems,
                    itemBuilder: (context, index) {
                      if (index < firstDayOffset) {
                        return const SizedBox();
                      }
                      final day = index - firstDayOffset + 1;
                      return _buildCalendarDay(day);
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            // Legend
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildLegendItem(Colors.green, 'Present', presentCount),
                _buildLegendItem(Colors.amber, 'Half-day', halfDayCount),
                _buildLegendItem(Colors.red, 'Absent', absentCount),
                // Note: The mock data doesn't contain a 'Late' status (L), so it won't appear in the legend.
              ],
            ),
            _buildDayDetails(), // Display details below the calendar
          ],
        ),
      ),
    );
  }
}