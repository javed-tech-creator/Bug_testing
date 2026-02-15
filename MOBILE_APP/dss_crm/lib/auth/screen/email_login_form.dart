import 'package:dss_crm/tech_module/common/tech_base_dashboard_screen.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/image_loader_util.dart';
import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:dss_crm/utils/storage_util.dart';
import 'package:dss_crm/vendor_module/screen/vendor_dashboard_screen.dart';
import 'package:dss_crm/vendor_module/vendor_base_dashboard_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../hr_module/common/hr_base_dashboard_screen.dart';
import '../../ui_helper/app_text_styles.dart';
import '../../utils/constants.dart';
import '../../utils/custom_buttons_utils.dart';
import '../../utils/custom_text_field_utils.dart';
import '../../utils/form_validations_utils.dart';
import '../../utils/responsive_helper_utils.dart';
import '../controller/auth_controller.dart';

class EmailLoginForm extends StatefulWidget {
  @override
  State<EmailLoginForm> createState() => _EmailLoginFormState();
}

class _EmailLoginFormState extends State<EmailLoginForm> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  bool rememberMe = false;
  // SharedPreferences instance
  late SharedPreferences _prefs;

  final List<Map<String, String>> staticUsers = [
    {
      "email": "hr@gmail.com",
      "password": "123456",
      "role": "hr",
    },
    {
      "email": "javed1dev@gmail.com",
      "password": "EMP25002@545",
      "role": "admin",
    },
    {
      "email": "employee@gmail.com",
      "password": "123456",
      "role": "employee",
    },
    {
      "email": "vendor@gmail.com",
      "password": "123456",
      "role": "vendor",
    },

    {
      "email": "javed.manager@example.com",
      "password": "123456",
      "role": "techManager",
    },
    {
      "email": "javed.employee@example.com",
      "password": "123456",
      "role": "techEmployee",
    },
  ];



  @override
  void initState() {
    super.initState();
    _initSharedPreferences();
  }

  Future<void> _initSharedPreferences() async {
    _prefs = await SharedPreferences.getInstance();
    _loadRememberMe();
  }

  void _loadRememberMe() {
    final savedEmail = _prefs.getString('email');
    final savedRememberMe = _prefs.getBool('rememberMe') ?? false;

    if (savedRememberMe && savedEmail != null) {
      emailController.text = savedEmail;
      setState(() {
        rememberMe = true;
      });
    }
  }
  // Save credentials and remember me state
  Future<void> _saveRememberMe() async {
    if (rememberMe) {
      await _prefs.setString('email', emailController.text.trim());
      await _prefs.setString('password', passwordController.text.trim());
      await _prefs.setBool('rememberMe', true);
    } else {
      await _prefs.remove('email');
      await _prefs.remove('password');
      await _prefs.setBool('rememberMe', false);
    }
  }

  // handle the login api here
  void handleSubmit() async {
    final loginProvider = context.read<AuthApiProvider>();
    final loginBody = {
      "email": emailController.text.trim(),
      "password": passwordController.text.trim(),
    };
    loginProvider.login(context, loginBody);
    // Save credentials after a successful login attempt
    _saveRememberMe();


    // testing credentials for HR DASHBOARD
    // the HR department to log in without needing to hit a backend.

    // final enteredEmail = emailController.text.trim();
    // final enteredPassword = passwordController.text.trim();
    //
    // // Find matching user
    // final user = staticUsers.firstWhere(
    //       (u) =>
    //   u["email"] == enteredEmail &&
    //       u["password"] == enteredPassword,
    //   orElse: () => {},
    // );

    // if (user.isNotEmpty) {
    //   final role = user["role"]!;
    //   StorageHelper().setLoginRole("$role");
    //   debugPrint("Login successful for role: $role");
    //
    //   _saveRememberMe();
    //
    //   // Navigate to role-based dashboard
    //   if(role == "hr") {
    //     Navigator.pushReplacement(
    //       context,
    //       MaterialPageRoute(
    //         builder: (context) => HRBaseDashboardScreen(userRole: role),
    //       ),
    //     );
    //   }else  if(role == "vendor") {
    //     Navigator.pushReplacement(
    //       context,
    //       MaterialPageRoute(
    //         builder: (context) => VendorBaseDashboardScreen(userRole: role),
    //       ),
    //     );
    //   }else  if(role == "techManager")  {
    //     await StorageHelper().setLoginRole(role);
    //     debugPrint("Tech Manager  dsashbaord opened");
    //     Navigator.pushReplacement(
    //       context,
    //       MaterialPageRoute(
    //         builder: (context) => TechBaseDashboardScreen(userRole: role),
    //       ),
    //     );
    //   }
    // } else {
    //   // Show error if invalid credentials
    //   ScaffoldMessenger.of(context).showSnackBar(
    //     const SnackBar(
    //       content: Text('Invalid email or password.'),
    //       backgroundColor: Colors.red,
    //     ),
    //   );
    // }

    // if (emailController.text.trim() == staticHrEmail &&
    //     passwordController.text.trim() == staticHrPassword) {
    //   debugPrint("Static login successful for HR.");
    //   _saveRememberMe();
    //   // Navigate to the next screen upon successful static login
    //   Navigator.pushReplacement(
    //     context,
    //     MaterialPageRoute(
    //         builder: (context) => const HRBaseDashboardScreen(userRole: "hr")),
    //   );
    // } else {
    //   // Show an error message for invalid static credentials
    //   ScaffoldMessenger.of(context).showSnackBar(
    //     const SnackBar(
    //       content: Text('Invalid HR email or password.'),
    //       backgroundColor: Colors.red,
    //     ),
    //   );
    // }
  }

  final Uri _url = Uri.parse(AppConstants.codeCrafterSiteUrl);

  Future<void> _launchURL() async {
    if (!await launchUrl(_url, mode: LaunchMode.externalApplication)) {
      throw Exception('Could not launch $_url');
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthApiProvider>(context);

    return SingleChildScrollView(
      padding: ResponsiveHelper.paddingSymmetric(
        context,
        vertical: 8,
        horizontal: 5,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          // mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Center(
              child: ImageLoaderUtil.assetImage(
                "assets/images/dss_logo.jpeg",
                fit: BoxFit.contain,
                width: ResponsiveHelper.iconSize(context, 120),
                height: ResponsiveHelper.iconSize(context, 100),
              ),
            ),
            SizedBox(height: 10),
            CustomTextField(
              title: "Email",
              hintText: "Enter your email",
              controller: emailController,
              keyboardType: TextInputType.emailAddress,
              prefixIcon: Icons.email,
              validator: FormValidatorUtils.validateEmail,
            ),
            SizedBox(height: 5),
            CustomTextField(
              title: "Password",
              hintText: "Enter password",
              controller: passwordController,
              obscureText: true,
              isPassword: true,
              prefixIcon: Icons.lock,
              validator: (value) => FormValidatorUtils.validateMinLength(
                value,
                6,
                fieldName: "Password",
              ),
            ),
            Padding(
              padding: EdgeInsets.symmetric(vertical: 2),
              // Minimized vertical space
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Checkbox(
                    materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    visualDensity: VisualDensity.compact,
                    value: rememberMe,
                    checkColor: AppColors.whiteColor,
                    activeColor: AppColors.orangeColor,
                    onChanged: (value) {
                      setState(() {
                        rememberMe = value ?? false;
                      });
                    },
                  ),
                  Text(
                    "Remember me",
                    style: AppTextStyles.heading1(
                      context,
                      overrideStyle: TextStyle(
                        fontSize: ResponsiveHelper.fontSize(context, 12),
                      ),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    "Forgot password?",
                    style: AppTextStyles.heading1(
                      context,
                      overrideStyle: TextStyle(
                        color: AppColors.blueColor,
                        fontSize: ResponsiveHelper.fontSize(context, 12),
                        decoration: TextDecoration.underline,
                        decorationColor: AppColors.blueColor,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            authProvider.isLoading
                ? LoadingIndicatorUtils()
                : CustomButton(
                    color: Colors.black,
                    text: "Login",
                    onPressed: () {
                      if (_formKey.currentState!.validate()) {
                        handleSubmit();
                        debugPrint("Email: ${emailController.text}");
                        debugPrint("Password: ${passwordController.text}");
                      }
                    },
                  ),

            // CustomButton(
            //   color: Colors.black,
            //   disabledColor: Colors.black,
            //   text: authProvider.isLoading ? 'Logging in...' : 'Login',
            //   onPressed:authProvider.isLoading
            //       ? null
            //       :  () {
            //     if (_formKey.currentState!.validate()) {
            //       handleSubmit();
            //       debugPrint("Email: ${emailController.text}");
            //       debugPrint("Password: ${passwordController.text}");
            //     }
            //   },
            // ),

            Padding(
              padding: ResponsiveHelper.paddingSymmetric(context, vertical: 5),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Don't have an account?  ",
                    style: AppTextStyles.heading1(
                      context,
                      overrideStyle: TextStyle(
                        fontSize: ResponsiveHelper.fontSize(context, 12),
                      ),
                    ),
                  ),
                  Text(
                    "Contact HR Department",
                    style: AppTextStyles.heading1(
                      context,
                      overrideStyle: TextStyle(
                        color: AppColors.blueColor,
                        fontSize: ResponsiveHelper.fontSize(context, 12),
                        decorationColor: AppColors.blueColor,
                        //   Underline color
                        decoration: TextDecoration.underline, //   Add this line
                      ),
                    ),
                  ),
                ],
              ),
            ),
            ResponsiveHelper.sizedBoxHeight(context, 10),
            // Removed SizedBox here
            Container(
              height: 50,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Powered by",
                    style: AppTextStyles.heading2(
                      context,
                      overrideStyle: const TextStyle(
                        color: Colors.black54,
                        fontSize: 14,
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      _launchURL();
                      print("logo clicked ");
                    },
                    child: Container(
                      // Reduced container size for better alignment
                      width: ResponsiveHelper.containerWidth(context, 100),
                      // Removed fixed height
                      child: ImageLoaderUtil.assetImage(
                        "assets/images/code_crafter_logo.png",
                        fit: BoxFit.cover,
                        width: ResponsiveHelper.iconSize(context, 100),
                      ),
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
