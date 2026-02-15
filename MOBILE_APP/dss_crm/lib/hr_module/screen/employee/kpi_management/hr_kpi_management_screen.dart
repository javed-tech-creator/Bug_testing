import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

import '../../../../ui_helper/app_colors.dart';
import '../../../../utils/default_common_app_bar.dart';

class KpiManagementScreen extends StatelessWidget {
  const KpiManagementScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.whiteColor,
      appBar: DefaultCommonAppBar(
        activityName: 'KPI Management',
        backgroundColor: AppColors.primary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 🔹 Top KPI Summary Cards (Fixed with Wrap)
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                SizedBox(
                    width: MediaQuery.of(context).size.width / 2 - 24,
                    child: kpiCard("All Employees", "120", Icons.people, Colors.blue)),
                SizedBox(
                    width: MediaQuery.of(context).size.width / 2 - 24,
                    child: kpiCard("Present Today", "108", Icons.check_circle, Colors.green)),
                SizedBox(
                    width: MediaQuery.of(context).size.width / 2 - 24,
                    child: kpiCard("Avg KPI Score", "82%", Icons.trending_up, Colors.orange)),
                SizedBox(
                    width: MediaQuery.of(context).size.width / 2 - 24,
                    child: kpiCard("Attrition Rate", "5%", Icons.warning, Colors.red)),
              ],
            ),
            const SizedBox(height: 20),

            // 🔹 Attendance Trend Chart
            Text("Attendance Trend (Last 6 months)",
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 10),
            SizedBox(
              height: 200,
              child: LineChart(
                LineChartData(
                  titlesData: FlTitlesData(
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(showTitles: true),
                    ),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
                          if (value.toInt() >= 0 && value.toInt() < months.length) {
                            return Text(months[value.toInt()]);
                          }
                          return const Text("");
                        },
                      ),
                    ),
                  ),
                  lineBarsData: [
                    LineChartBarData(
                      spots: const [
                        FlSpot(0, 90),
                        FlSpot(1, 88),
                        FlSpot(2, 95),
                        FlSpot(3, 92),
                        FlSpot(4, 94),
                        FlSpot(5, 97),
                      ],
                      isCurved: true,
                      color: Colors.blue,
                      barWidth: 3,
                      dotData: FlDotData(show: true),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // 🔹 Performance Distribution Pie Chart
            Text("Performance Distribution",
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 10),
            SizedBox(
              height: 200,
              child: PieChart(
                PieChartData(
                  sections: [
                    PieChartSectionData(
                        value: 40, title: "Excellent", color: Colors.blue, radius: 60),
                    PieChartSectionData(
                        value: 30, title: "Good", color: Colors.green, radius: 60),
                    PieChartSectionData(
                        value: 20, title: "Average", color: Colors.orange, radius: 60),
                    PieChartSectionData(
                        value: 10, title: "Poor", color: Colors.red, radius: 60),
                  ],
                  sectionsSpace: 2,
                  centerSpaceRadius: 30,
                ),
              ),
            ),
            const SizedBox(height: 20),

            // 🔹 Employee KPI Table
            Text("Employee KPIs", style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 10),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal, // ⚡ Fix overflow in DataTable
              child: DataTable(
                headingRowColor: MaterialStateColor.resolveWith(
                      (states) => Colors.grey.shade200,
                ),
                columns: const [
                  DataColumn(label: Text("Name")),
                  DataColumn(label: Text("Dept")),
                  DataColumn(label: Text("KPI Score")),
                  DataColumn(label: Text("Status")),
                ],
                rows: [
                  DataRow(cells: [
                    const DataCell(Text("Alice Johnson")),
                    const DataCell(Text("Sales")),
                    const DataCell(Text("85%")),
                    DataCell(statusChip("On Track", Colors.green)),
                  ]),
                  DataRow(cells: [
                    const DataCell(Text("Bob Smith")),
                    const DataCell(Text("HR")),
                    const DataCell(Text("70%")),
                    DataCell(statusChip("Needs Improvement", Colors.orange)),
                  ]),
                  DataRow(cells: [
                    const DataCell(Text("Charlie Brown")),
                    const DataCell(Text("IT")),
                    const DataCell(Text("92%")),
                    DataCell(statusChip("Excellent", Colors.blue)),
                  ]),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 🔹 Reusable KPI Card
  Widget kpiCard(String title, String value, IconData icon, Color color) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(
              backgroundColor: color.withOpacity(0.1),
              child: Icon(icon, color: color),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style:
                    const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
                Text(value,
                    style: TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold, color: color)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // 🔹 Status Chip
  Widget statusChip(String text, Color color) {
    return Chip(
      label:
      Text(text, style: const TextStyle(color: Colors.white, fontSize: 12)),
      backgroundColor: color,
    );
  }
}
