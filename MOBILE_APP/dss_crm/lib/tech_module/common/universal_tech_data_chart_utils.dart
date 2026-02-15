import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'dart:math';

// यह enum चार्ट के प्रकार को चुनने में मदद करेगा
enum ChartType { pie, bar }

// यह हमारा मुख्य Generic और Reusable विजेट है
class UniversalDataChart<T> extends StatelessWidget {
  /// डेटा की लिस्ट (यह किसी भी प्रकार की हो सकती है)
  final List<T> data;

  /// यह फ़ंक्शन आपके डेटा ऑब्जेक्ट से संख्यात्मक मान (value) निकालता है
  final double Function(T item) valueMapper;

  /// यह फ़ंक्शन आपके डेटा ऑब्जेक्ट से लेबल (name) निकालता है
  final String Function(T item) labelMapper;

  /// चार्ट का प्रकार (Pie Chart या Bar Graph)
  final ChartType chartType;

  /// (वैकल्पिक) चार्ट के लिए रंगों की सूची
  final List<Color>? colors;

  /// (वैकल्पिक) चार्ट का शीर्षक
  final String? chartTitle;

  const UniversalDataChart({
    super.key,
    required this.data,
    required this.valueMapper,
    required this.labelMapper,
    this.chartType = ChartType.pie, // डिफ़ॉल्ट रूप से पाई चार्ट
    this.colors,
    this.chartTitle,
  });

  // डिफ़ॉल्ट रूप से कुछ रैंडम रंग बनाने के लिए
  List<Color> get _defaultColors {
    final random = Random();
    return List.generate(
      data.length,
          (index) => Color.fromRGBO(
        random.nextInt(256),
        random.nextInt(256),
        random.nextInt(256),
        1,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (data.isEmpty) {
      return Center(
        child: Text(chartTitle != null ? 'No data for $chartTitle' : 'No data available'),
      );
    }

    final chartColors = colors ?? _defaultColors;

    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      margin: const EdgeInsets.all(8.0),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
        child: Column(
          children: [
            if (chartTitle != null)
              Text(
                chartTitle!,
                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
              ),
            if (chartTitle != null) const SizedBox(height: 20),
            Expanded(
              child: chartType == ChartType.pie
                  ? _buildPieChart(chartColors)
                  : _buildBarChart(chartColors),
            ),
            const SizedBox(height: 12),
            _buildLegend(context, chartColors),
          ],
        ),
      ),
    );
  }

  /// पाई चार्ट बनाने के लिए आंतरिक विधि
  Widget _buildPieChart(List<Color> chartColors) {
    final double totalValue = data.fold(0, (sum, item) => sum + valueMapper(item));

    return PieChart(
      PieChartData(
        sectionsSpace: 2,
        centerSpaceRadius: 40,
        sections: List.generate(data.length, (index) {
          final item = data[index];
          final value = valueMapper(item);
          final percentage = totalValue == 0 ? 0 : (value / totalValue) * 100;

          return PieChartSectionData(
            color: chartColors[index % chartColors.length],
            value: value,
            title: '${percentage.toStringAsFixed(1)}%',
            radius: 50,
            titleStyle: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                shadows: <Shadow>[
                  Shadow(color: Colors.black54, blurRadius: 2.0)
                ]
            ),
          );
        }),
      ),
    );
  }

  // ✅ ================== UPDATED METHOD STARTS HERE ================== ✅

  /// बार ग्राफ़ बनाने के लिए आंतरिक विधि (FIXED AGAIN)
  Widget _buildBarChart(List<Color> chartColors) {
    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        barTouchData: BarTouchData(enabled: true),
        titlesData: FlTitlesData(
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),

          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 38,
              getTitlesWidget: (double value, TitleMeta meta) {
                final index = value.toInt();
                String text = '';
                if (index >= 0 && index < data.length) {
                  text = labelMapper(data[index]);
                }

                // *** मुख्य बदलाव: 'SideTitleWidget' को 'meta' पैरामीटर पास किया गया है ***
                return SideTitleWidget(
                  meta: meta, // 👈 REQUIRED
                  space: 8.0,
                  child: Text(text, style: const TextStyle(fontSize: 10)),
                );
              },
            ),
          ),

          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 40,
              getTitlesWidget: (value, meta) {
                // *** यहाँ भी 'SideTitleWidget' का उपयोग किया गया है और 'meta' पास किया गया है ***
                return SideTitleWidget(
                  meta: meta, // 👈 REQUIRED
                  child: Text(meta.formattedValue, style: const TextStyle(fontSize: 10)),
                );
              },
            ),
          ),
        ),
        gridData:  FlGridData(
            show: true,
            drawVerticalLine: false,
            horizontalInterval: 1.0,
            getDrawingHorizontalLine: (value) =>FlLine(color: Colors.black12, strokeWidth: 1)),
        borderData: FlBorderData(
          show: true,
          border: const Border(
            bottom: BorderSide(color: Colors.black26),
            left: BorderSide(color: Colors.black26),
          ),
        ),
        barGroups: List.generate(data.length, (index) {
          final item = data[index];
          return BarChartGroupData(
            x: index,
            barRods: [
              BarChartRodData(
                toY: valueMapper(item),
                color: chartColors[index % chartColors.length],
                width: 16,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(4),
                  topRight: Radius.circular(4),
                ),
              ),
            ],
          );
        }),
      ),
    );
  }

  // ✅ =================== UPDATED METHOD ENDS HERE =================== ✅

  /// लेजेंड (लेबल और रंग) बनाने के लिए विजेट
  Widget _buildLegend(BuildContext context, List<Color> chartColors) {
    return Wrap(
      spacing: 16,
      runSpacing: 8,
      alignment: WrapAlignment.center,
      children: List.generate(data.length, (index) {
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(
                  color: chartColors[index % chartColors.length],
                  shape: BoxShape.rectangle,
                  borderRadius: BorderRadius.circular(2)
              ),
            ),
            const SizedBox(width: 6),
            Text(labelMapper(data[index]), style: const TextStyle(fontSize: 12)),
          ],
        );
      }),
    );
  }
}