import 'package:flutter/material.dart';

import '../../../ui_helper/app_colors.dart';
import '../../../utils/default_common_app_bar.dart';

class EmployeeProfileScreen extends StatelessWidget {
  final String name;
  final String empId;
  final int totalPatients;
  final double revenue;
  final double paidToDoctor;
  final int appointments;
  final int invoices;

  const EmployeeProfileScreen({
    super.key,
    required this.name,
    required this.empId,
    required this.totalPatients,
    required this.revenue,
    required this.paidToDoctor,
    required this.appointments,
    required this.invoices,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      // appBar: AppBar(
      //   title: Text(name, style: const TextStyle(color: Colors.white)),
      //   backgroundColor: const Color(0xFF0A4BA6),
      //   iconTheme: const IconThemeData(color: Colors.white),
      // ),
      appBar: DefaultCommonAppBar(
      activityName: "Your Profile",
      backgroundColor: AppColors.primary,
    ),
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          children: [
            // Profile Card
            Card(
              color: Colors.white,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: const Color(0xFF0A4BA6),
                  child: const Icon(Icons.person, color: Colors.white),
                ),
                title: Text(
                  name.toUpperCase(),
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Specialist: $empId"),
                    Text("Total Patients: $totalPatients"),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Revenue
            _buildStatCard("Revenue", revenue.toStringAsFixed(2),
                Colors.green, Icons.currency_rupee),

            // Paid to Doctor
            _buildStatCard("Paid To Doctor", "${paidToDoctor}K",
                Colors.purple, Icons.person),

            // Appointments
            _buildStatCard("Appointments", "$appointments",
                Colors.orange, Icons.calendar_today),

            // Invoices
            _buildStatCard("Invoices", "$invoices",
                Colors.red, Icons.receipt_long),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(
      String title, String value, Color color, IconData icon) {
    return Card(
      color: Colors.white,
      child: ListTile(
        leading: Icon(icon, color: color),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        trailing: Text(
          value,
          style: TextStyle(
              fontWeight: FontWeight.bold, color: color, fontSize: 16),
        ),
      ),
    );
  }
}
