import 'package:dropdown_button2/dropdown_button2.dart';
import 'package:dss_crm/admin/controller/admin_location_api_provider.dart';
import 'package:dss_crm/admin/controller/admin_main_api_provider.dart';
import 'package:dss_crm/auth/controller/auth_controller.dart';
import 'package:dss_crm/hr_module/controller/hr_emp_doc_api_provider.dart';
import 'package:dss_crm/hr_module/controller/hr_employee_api_provider.dart';
import 'package:dss_crm/hr_module/screen/employee/leave_module/admin_leave_api_provider.dart';
import 'package:dss_crm/marketing_module/marketing_manager/controller/marketing_manager_api_provider.dart';
import 'package:dss_crm/sales_module/common/controller/sales_module_common_controller.dart';
import 'package:dss_crm/sales_module/sales_employee/dashboard_api_controller.dart';
import 'package:dss_crm/sales_module/sales_employee/sales_client_breifing/controller/sales_emp_client_briefing_controller.dart';
import 'package:dss_crm/sales_module/sales_hod/controller/sales_hod_controller.dart';
import 'package:dss_crm/sales_module/sales_hod/lead/controller/sales_hod_lead_controller.dart';
import 'package:dss_crm/sales_module/sales_tl/sales_tl_report/controller/sales_tl_reporting_controller.dart';
import 'package:dss_crm/splash/controller/network_provider_controller.dart';
import 'package:dss_crm/splash/screen/SplashScreen.dart';
import 'package:dss_crm/tech_module/tech_employee/controller/tech_engineer_api_provider.dart';
import 'package:dss_crm/tech_module/tech_manager/controller/tech_manager_api_provider.dart';
import 'package:dss_crm/ui_helper/theme/app_theme.dart';
import 'package:dss_crm/ui_helper/theme/theme_provider.dart';
import 'package:dss_crm/utils/custom_buttons_utils.dart';
import 'package:dss_crm/utils/responsive_dropdown_utils.dart';
import 'package:dss_crm/utils/storage_util.dart';
import 'package:dss_crm/vendor_module/controller/vendor_api_provider.dart';
import 'package:dss_crm/vendor_module/controller/vendor_dashboard_api_provider.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

//    For global navigation (used in NotificationService)
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
void main()  async {

  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  await StorageHelper().init(); //    REQUIRED before using prefs
  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.presentError(details);
    debugPrint("FlutterError: ${details.exceptionAsString()}");
  };
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => NetworkProvider()),
        ChangeNotifierProvider(create: (_) => SalesHODApiProvider()),
        ChangeNotifierProvider(create: (_) => AuthApiProvider()),
        ChangeNotifierProvider(create: (_) => SalesHODLeadApiProvider()),
        ChangeNotifierProvider(create: (_) => SalesTLReportingApiProvider()),
        ChangeNotifierProvider(create: (_) => SalesEmpClientBriefingApiProvider()),
        ChangeNotifierProvider(create: (_) => SalesModuleCommonApiProvider()),
        ChangeNotifierProvider(create: (_) => SalesEmpDashboardApiProvider()),
        ChangeNotifierProvider(create: (_) => HREmployeeApiProvider()),
        ChangeNotifierProvider(create: (_) => HREmployeeLeaveApiProvider()),
        ChangeNotifierProvider(create: (_) => HREmpDocumentUploadProvider()),
        ChangeNotifierProvider(create: (_) => VendorModuleApiProvider()),
        ChangeNotifierProvider(create: (_) => VendorDashboardApiProvider()),
        ChangeNotifierProvider(create: (_) => TechManagerApiProvider()),
        ChangeNotifierProvider(create: (_) => TechEngineerApiProvider()),
        ChangeNotifierProvider(create: (_) => MarketingManagerApiProvider()),
        ChangeNotifierProvider(create: (_) => AdminLocationApiProvider()),
        ChangeNotifierProvider(create: (_) => AdminMainApiProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {

    final themeProvider = Provider.of<ThemeProvider>(context);

    return MaterialApp(
      title: 'DSS CRM',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        fontFamily: 'Poppins',
        textTheme: TextTheme(
          bodyLarge: TextStyle(fontSize: 16),
          bodyMedium: TextStyle(fontSize: 14),
          labelLarge: TextStyle(fontWeight: FontWeight.bold),
        ),
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.light, // Explicitly light theme
        ),
        useMaterial3: true, // Use Material 3 design
      ),
      // Define your dark theme
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple, // Or a different seed color for dark
          brightness: Brightness.dark, // Explicitly dark theme
        ),
        useMaterial3: true, // Use Material 3 design
      ),
      // Configure the app to use the system theme (light or dark)
      themeMode: ThemeMode.light,

      // theme: AppTheme.lightTheme,
      // darkTheme: AppTheme.darkTheme,
      // themeMode: themeProvider.themeMode,
      home: const SplashScreen(),
      // home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  String? selectedDepartment;
  final List<String> departments = ['Sales', 'HR', 'IT', 'Marketing'];
  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),

      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Center(
              child: ResponsiveDropdown<String>(
                label: 'Department',
                hint: 'Select department',
                value: selectedDepartment,
                itemList: ['Sales', 'HR', 'IT', 'Marketing'],
                onChanged: (value) =>
                    setState(() => selectedDepartment = value),
              ),
            ),

            // Form(
            //   key: _formKey,
            //   child: Column(
            //     children: [
            //       CustomTextField(
            //         label: "Name",
            //         hintText: "Enter your name",
            //         controller: nameController,
            //         prefixIcon: Icons.person,
            //         validator: (value) => FormValidatorUtils.validateRequired(value, fieldName: "Name"),
            //       ),
            //       CustomTextField(
            //         label: "Email",
            //         hintText: "Enter your email",
            //         controller: emailController,
            //         keyboardType: TextInputType.emailAddress,
            //         prefixIcon: Icons.email,
            //         validator: FormValidatorUtils.validateEmail,
            //       ),
            //       CustomTextField(
            //         label: "Phone",
            //         hintText: "Enter 10-digit phone number",
            //         controller: phoneController,
            //         keyboardType: TextInputType.phone,
            //         prefixIcon: Icons.phone,
            //         validator: FormValidatorUtils.validatePhone,
            //         inputFormatters: [
            //           FilteringTextInputFormatter.digitsOnly,
            //           LengthLimitingTextInputFormatter(10),
            //         ],
            //       ),
            //       CustomTextField(
            //         label: "Password",
            //         hintText: "Enter password",
            //         controller: passwordController,
            //         obscureText: true,
            //         prefixIcon: Icons.lock,
            //         validator: (value) => FormValidatorUtils.validateMinLength(value, 6, fieldName: "Password"),
            //       ),
            //
            //     ],
            //   ),
            // ),
            CustomButton(
              text: "Login",
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  //    All inputs are valid
                  debugPrint("Name: ${nameController.text}");
                  debugPrint("Email: ${emailController.text}");
                  debugPrint("Phone: ${phoneController.text}");
                  debugPrint("Password: ${passwordController.text}");

                  // Call your API or next screen here
                } else {
                  // ❌ One or more fields failed validation
                  debugPrint("Validation failed");
                }
              },
            ),

          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
