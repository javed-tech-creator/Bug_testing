import 'package:dss_crm/auth/controller/auth_controller.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

import '../../ui_helper/app_colors.dart';
import '../../utils/custom_buttons_utils.dart';
import '../../utils/custom_text_field_utils.dart';
import '../../utils/default_common_app_bar.dart';
import '../../utils/form_validations_utils.dart';
import '../../utils/responsive_dropdown_utils.dart';
import 'email_login_form.dart';
import 'otp_login_form.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;


  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }


  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primary,
      appBar: DefaultCommonAppBar(
        activityName: "Login",
        backgroundColor: AppColors.primary,
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          return SingleChildScrollView(
            child: ConstrainedBox(
              constraints: BoxConstraints(
                minHeight: constraints.maxHeight,
              ),
              child: IntrinsicHeight(
                child: Column(
                  children: [
                    const SizedBox(height: 100),
                    Padding(
                      padding: ResponsiveHelper.paddingAll(context, 15),
                      child: Material(
                        elevation: 10,
                        shadowColor: Colors.black.withAlpha(30),
                        borderRadius: BorderRadius.circular(16),
                        color: Colors.white,
                        child: Container(
                          width: double.infinity,
                          padding:  ResponsiveHelper.paddingAll(context, 5),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            border: Border.all(color: Colors.grey.withAlpha(70)),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: EmailLoginForm(),
                        ),
                      ),
                    ),
                    const Spacer(), // Pushes content up on taller screens
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

}
