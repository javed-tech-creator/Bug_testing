import 'package:shared_preferences/shared_preferences.dart';

class StorageHelper {
  static final StorageHelper _singleton = StorageHelper._internal();

  factory StorageHelper() => _singleton;

  StorageHelper._internal();

  late SharedPreferences prefs;

  Future<void> init() async {
    prefs = await SharedPreferences.getInstance();
    print("✅ SharedPreferences initialized");
  }
  /// 🔐 Logout and clear user data
  Future<void> logout() async {
    await prefs.remove('isLoggedIn');
  }
  // ---------------------- Token ----------------------
  Future<void> setUserAccessToken(String token) async {
    print("📝 setUserAccessToken: $token");
    await prefs.setString('user_access_token', token);
  }

  Future<String> getUserAccessToken() async {
    final value = prefs.getString('user_access_token') ?? "";
    print("📤 getUserAccessToken: $value");
    return value;
  }

  // ---------------------- Login Flag ----------------------
  Future<void> setBoolIsLoggedIn(bool value) async {
    print("📝 setBoolIsLoggedIn: $value");
    await prefs.setBool("isLoggedIn", value);
  }

  Future<bool> getBoolIsLoggedIn() async {
    final value = prefs.getBool("isLoggedIn") ?? false;
    print("📤 getBoolIsLoggedIn: $value");
    return value;
  }

  // ---------------------- Role ----------------------
  Future<void> setLoginRole(String token) async {
    print("📝 setLoginRole: $token");
    await prefs.setString('login_user_role', token);
  }

  Future<String> getLoginRole() async {
    final value = prefs.getString('login_user_role') ?? "";
    print("📤 getLoginRole: $value");
    return value;
  }

  // ---------------------- User Info ----------------------

  Future<void> setLoginHODId(String token) async {
    print("📝 setLoginUserName: $token");
    await prefs.setString('login_sales_hod_id', token);
  }

  Future<String> getLoginHODId() async {
    return prefs.getString('login_sales_hod_id') ?? "";
  }
  Future<void> setLoginTLId(String token) async {
    print("📝 setLoginUserName: $token");
    await prefs.setString('login_TL_id', token);
  }

  Future<String> getLoginTLId() async {
    return prefs.getString('login_TL_id') ?? "";
  }
  Future<void> setLoginUserId(String token) async {
    print("📝 setLoginUserName: $token");
    await prefs.setString('login_user_id', token);
  }

  Future<String> getLoginUserId() async {
    return prefs.getString('login_user_id') ?? "";
  }


  Future<void> setLoginUserName(String token) async {
    print("📝 setLoginUserName: $token");
    await prefs.setString('login_user_name', token);
  }

  Future<String> getLoginUserName() async {
    return prefs.getString('login_user_name') ?? "";
  }

  Future<void> setLoginUserEmail(String token) async {
    await prefs.setString('login_user_email', token);
  }

  Future<String> getLoginUserEmail() async {
    return prefs.getString('login_user_email') ?? "";
  }

  Future<void> setLoginUserPhone(String token) async {
    await prefs.setString('login_user_phone', token);
  }

  Future<String> getLoginUserPhone() async {
    return prefs.getString('login_user_phone') ?? "";
  }

  Future<void> setLoginUserAltPhone(String token) async {
    await prefs.setString('login_user_alt_phone', token);
  }

  Future<String> getLoginUserAltPhone() async {
    return prefs.getString('login_user_alt_phone') ?? "";
  }

  Future<void> setLoginUserWhatsappPhone(String token) async {
    await prefs.setString('login_user_whatsapp_phone', token);
  }

  Future<String> getLoginUserWhatsappPhone() async {
    return prefs.getString('login_user_whatsapp_phone') ?? "";
  }
}
