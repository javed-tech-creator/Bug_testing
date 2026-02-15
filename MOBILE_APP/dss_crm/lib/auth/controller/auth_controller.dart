import 'package:dss_crm/network_manager/repository.dart';
import 'package:dss_crm/role_selection/main_role_selections_screen.dart';
import 'package:dss_crm/sales_module/common/screen/base_dashboard_screen.dart';
import 'package:dss_crm/utils/storage_util.dart';
import 'package:flutter/material.dart';
import '../../main_dashboard_manager.dart';
import '../../network_manager/api_response.dart';
import '../../auth/model/login_model.dart';
import '../../sales_module/sales_hod/screen/sales_hod_dashboard_screen.dart';
import '../../ui_helper/app_colors.dart';
import '../../utils/custom_snack_bar.dart';
import '../../utils/full_screen_loader_utiil.dart';

class AuthApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  ApiResponse<LoginResponseModel>? _loginResponse;
  ApiResponse<LoginResponseModel>? get loginResponse => _loginResponse;

  Future<void> login(BuildContext context,Map<String, dynamic> body) async {
    _isLoading = true;
    notifyListeners();
    try {
      final response = await _repository.loginUser(body);
      _loginResponse = response;

      if (response.success && response.data != null) {
        await _saveUserData(response.data);
        final message = response.data!.message!.isNotEmpty == true ? response.data!.message!  : "Login successful!";
          CustomSnackbarHelper.customShowSnackbar(
            context: context,
            message: message,
            duration: const Duration(seconds: 2),
          );


        final savedRole = await StorageHelper().getLoginRole() ?? "";

        debugPrint("🔍 Selected Role from Storage: $savedRole");

        // Navigate to appropriate dashboard based on saved role
        if (savedRole.isNotEmpty) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
                builder: (context) =>
                    MainDashboardManager.getDashboardForRole(savedRole)
            ),
          );
        }
          // final role = _loginResponse!.data!.data!.user?.designation.toString().trim() ?? "N/A";
        //   final role =await StorageHelper().getLoginRole() ?? "";
        // // Navigator.pushReplacement(
        // //   context,
        // //   MaterialPageRoute(builder: (context) => BaseDashboardScreen(userRole: role)),
        // // );
        //
        // Navigator.pushReplacement(
        //   context,
        //   MaterialPageRoute(
        //       builder: (context) => MainDashboardManager.getDashboardForRole(role)
        //   ),
        // );


      } else {
        debugPrint("Login failed: ${response.message}");
        CustomSnackbarHelper.customShowSnackbar(
          context: context,
          message: response.message ?? 'Login failed!',
          backgroundColor: Colors.red,
          duration: Duration(seconds: 2),
        );
      }
    } catch (e, stackTrace) {
      debugPrint("Login Exception: $e");
    } finally {
      _isLoading = false;
      notifyListeners();
    }


  }

  Future<void> _saveUserData(LoginResponseModel? loginResponseModel) async {

    if(loginResponseModel?.data !=null){
      final loginUserId = loginResponseModel?.data?.user?.sId ?? "NA";
      final role = loginResponseModel?.data?.user?.designation ?? "NA";
      final name = loginResponseModel?.data?.user?.name ?? "NA";
      final email = loginResponseModel?.data?.user?.email ?? "NA";
      final phone = loginResponseModel?.data?.user?.phone ?? "NA";
      // final altPhone = loginResponseModel?.data?.user?.altNo ?? "NA";
      // final whatsappPhone = loginResponseModel?.data?.allData?.whatsappNo ?? "NA";

      await StorageHelper().setLoginUserId(loginUserId);
      // await StorageHelper().setLoginRole(role);
      await StorageHelper().setLoginUserName(name);
      await StorageHelper().setLoginUserEmail(email);
      await StorageHelper().setLoginUserPhone(phone);
      // await StorageHelper().setLoginUserAltPhone(altPhone);
      // await StorageHelper().setLoginUserWhatsappPhone(whatsappPhone);
      await StorageHelper().setBoolIsLoggedIn(true);
    }

  }

  void logoutUser(BuildContext context) {
    // _setLoading(true);
    // FullScreenLoader.show(context, message: "Logout");
    // Future.delayed(Duration(seconds: 1), () async {
      StorageHelper().logout();
      // FullScreenLoader.hide(context);
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => MainRoleSelectionScreen()),
            (route) => false,
      );
    // });
  }

}
