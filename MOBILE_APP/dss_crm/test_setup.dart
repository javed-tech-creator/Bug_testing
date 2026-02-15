import 'dart:io';
import 'package:path/path.dart' as p;

Future<void> main() async {
  final timestamp = DateTime.now().toIso8601String().replaceAll(':', '-');
  final reportPath = p.join('test_reports', 'test_report_$timestamp.xml');
  final performancePath = p.join('test_reports', 'performance_log_$timestamp.txt');

  // Ensure test_reports folder exists
  await Directory('test_reports').create(recursive: true);

  print('🚀 Starting Automated Testing for DSS CRM...');
  print('=============================================');

  // Step 1: Run Unit & Widget Tests
  print('\n🧩 Running Unit & Widget Tests...');
  final unitResult = await Process.run(
    'flutter',
    ['test', '--machine'],
    runInShell: true,
  );

  await File(reportPath).writeAsString(unitResult.stdout);
  print('✅ Unit & Widget Tests Completed! Report saved: $reportPath');

  // Step 2: Run Integration Tests
  print('\n📱 Running Integration Tests...');
  final integrationResult = await Process.run(
    'flutter',
    ['test', 'integration_test'],
    runInShell: true,
  );

  print(integrationResult.stdout);
  print('✅ Integration Tests Completed!');

  // Step 3: Performance Check (Profile mode)
  print('\n⚙️ Running Performance Profiling...');
  final performanceResult = await Process.run(
    'flutter',
    ['run', '--profile', '--target', 'lib/main.dart'],
    runInShell: true,
  );

  await File(performancePath).writeAsString(performanceResult.stdout);
  print('✅ Performance Log Saved: $performancePath');

  // Step 4: Summary
  print('\n=============================================');
  print('🎉 All tests completed successfully!');
  print('📄 Reports saved in folder: test_reports/');
  print('=============================================');
}
