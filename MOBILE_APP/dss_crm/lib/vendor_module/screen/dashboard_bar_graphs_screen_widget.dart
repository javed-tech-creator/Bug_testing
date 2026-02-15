// monthly_sales_bar_chart.dart
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';

// Import your MonthlySalesData model
// import 'sales_data_model.dart'; // Uncomment if in a separate file

// Assuming MonthlySalesData is defined in the same file for this example
class MonthlySalesData {
  final String month;
  final double sales;

  MonthlySalesData({required this.month, required this.sales});
}


class MonthlySalesBarChart extends StatelessWidget {
  final String title;
  final List<MonthlySalesData> salesData;
  final double maxYValue;
  final Color barColor;
  final Color gradientStartColor;
  final Color gradientEndColor;

  const MonthlySalesBarChart({
    super.key,
    required this.title,
    required this.salesData,
    required this.maxYValue,
    this.barColor = Colors.blue,
    this.gradientStartColor = const Color(0xFF64B5F6), // Light blue
    this.gradientEndColor = const Color(0xFF1E88E5),   // Dark blue
  });

  // Helper method to get the titles for the bottom axis (months)
  Widget _getBottomTitles(double value, TitleMeta meta) {
    const style = TextStyle(
      color: Color(0xFF64748B),
      fontWeight: FontWeight.bold,
      fontSize: 10,
    );
    String text;
    if (value >= 0 && value < salesData.length) {
      text = salesData[value.toInt()].month;
    } else {
      text = '';
    }
    return SideTitleWidget(
      meta: meta,
      space: 8.0,
      child: Text(text, style: style),
    );
  }

  // Helper method to get the titles for the left axis (sales values)
  Widget _getLeftTitles(double value, TitleMeta meta) {
    const style = TextStyle(
      color: Color(0xFF64748B),
      fontWeight: FontWeight.bold,
      fontSize: 10,
    );
    // Format sales value as currency (e.g., ₹26,000)
    // You might need to import intl package for advanced formatting if not already
    // For simplicity, we'll just add '₹' and format to nearest thousand
    String text;
    if (value % (maxYValue / 4) == 0) { // Show labels at intervals
      text = '₹${value ~/ 1000}k';
    } else {
      text = '';
    }
    return SideTitleWidget(
      meta: meta,
      space: 8.0,
      child: Text(text, style: style),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 24, 16), // Adjust padding for titles
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.shopping_cart, color: Color(0xFF1E88E5)),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E293B),
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  '6 Months', // This could also be a parameter if dynamic
                  style: TextStyle(
                    fontSize: 12,
                    color: Color(0xFF64748B),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 250, // Fixed height for the chart area
            child: BarChart(
              BarChartData(
                alignment: BarChartAlignment.spaceAround,
                maxY: maxYValue,
                barTouchData: BarTouchData(
                  enabled: true,
                  touchTooltipData: BarTouchTooltipData(
                    getTooltipItem: (group, groupIndex, rod, rodIndex) {
                      return BarTooltipItem(
                        '${salesData[group.x.toInt()].month}\n',
                        const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                        children: <TextSpan>[
                          TextSpan(
                            text: '₹${rod.toY.toInt()}',
                            style: TextStyle(
                              color: gradientEndColor,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),
                titlesData: FlTitlesData(
                  show: true,
                  rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: _getBottomTitles,
                      reservedSize: 28,
                    ),
                  ),
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: _getLeftTitles,
                      reservedSize: 40,
                    ),
                  ),
                ),
                gridData: FlGridData(
                  show: true,
                  drawVerticalLine: false,
                  horizontalInterval: maxYValue / 4, // 4 horizontal grid lines
                  getDrawingHorizontalLine: (value) => FlLine(
                    color: Colors.grey.withOpacity(0.3),
                    strokeWidth: 0.8,
                  ),
                ),
                borderData: FlBorderData(
                  show: false, // Removed border as per image
                ),
                barGroups: salesData
                    .asMap()
                    .entries
                    .map(
                      (entry) => BarChartGroupData(
                    x: entry.key,
                    barRods: [
                      BarChartRodData(
                        toY: entry.value.sales,
                        width: 20, // Adjust bar width
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(6),
                          topRight: Radius.circular(6),
                        ),
                        gradient: LinearGradient(
                          colors: [
                            gradientStartColor,
                            gradientEndColor,
                          ],
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                        ),
                      ),
                    ],
                    showingTooltipIndicators: [], // Initially no tooltips
                  ),
                )
                    .toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}