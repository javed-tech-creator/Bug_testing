import 'dart:io';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

class NotificationService {
  static final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;

  static Future<void> initialize(BuildContext context) async {
    await requestPermission(); // Request permission first
    await getFCMToken(); // Fetch FCM Token
    listenForTokenRefresh(); // Listen for token refresh

    if (Platform.isIOS) {
      await FirebaseMessaging.instance.setForegroundNotificationPresentationOptions(
        alert: true,
        badge: true,
        sound: true,
      );
    }

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print("📩 Foreground notification received: ${message.notification?.title}");
      _showNotificationDialog(context, message);
    });

    // 🔵 Handle Notification Click (When app is in background)
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print("📩 Notification clicked while app was in background: ${message.notification?.title}");
      // Navigate to specific screen if needed
    });

    // 🟢 Background Notification Handling
    FirebaseMessaging.onBackgroundMessage(backgroundHandler);
  }

  /// Request Notification Permission and Handle Responses
  static Future<void> requestPermission() async {
    NotificationSettings settings = await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: true, // Allows "quiet" notifications for first-time users
    );

    // Handle all possible permission responses
    switch (settings.authorizationStatus) {
      case AuthorizationStatus.authorized:
        print(" User granted permission for notifications.");
        // Fluttertoast.showToast(msg: "Notifications Enabled");
        break;

      case AuthorizationStatus.provisional:
        print("⚠️ User granted provisional (silent) notifications.");
        Fluttertoast.showToast(msg: "Provisional Notifications Enabled");
        break;

      case AuthorizationStatus.denied:
        print("❌ User denied notification permission.");
        Fluttertoast.showToast(msg: "Notifications Denied! Please enable them in settings.");
        break;

      default:
        print("❓ Unknown permission status: ${settings.authorizationStatus}");
    }
  }

  /// Fetch and Print FCM Token (Handles Null Values)
  static Future<void> getFCMToken() async {
    try {
      String? token = await _firebaseMessaging.getToken();
      if (token != null) {
        print("🔑 FCM Token: $token");
        // sendTokenToServer(token);
        // Provider.of<DeliveryOrdersProvider>(context, listen: false).sendFcmToken(context, token);
      } else {
        print("❌ Failed to fetch FCM token.");
      }
    } catch (e) {
      print("❌ Error fetching FCM token: $e");
    }
  }
  /// Listen for Token Refresh and Update Backend
  static void listenForTokenRefresh( ) {
    _firebaseMessaging.onTokenRefresh.listen((newToken) {
      print("🔄 FCM Token Refreshed: $newToken");
      // sendTokenToServer(newToken); // Send updated token to backend

      // Provider.of<DeliveryOrdersProvider>(context, listen: false).sendFcmToken(context, newToken);
    }).onError((error) {
      print("❌ Error in token refresh: $error");
    });
  }

  /// Send Token to Backend (Replace with actual API call)
  /// Send Token to Backend with Context (Updated)
  // static Future<void> sendTokenToServer(String token) async {
  //   try {
  //     print("📤 Sending Token to Backend: $token");
  //     // Direct API call (Even if context is null)
  //     await DeliveryOrdersProvider().sendFcmToken(token);
  //     // 🟢 Get context using global navigation key
  //     final context = navigatorKey.currentContext;
  //     if (context != null) {
  //       print("📤 Context not null and  Token send to Backend: $token");
  //       Provider.of<DeliveryOrdersProvider>(context, listen: false).sendFcmToken(token);
  //     } else {
  //       print("⚠️ Context is null, couldn't send FCM token to backend.");
  //     }
  //
  //   } catch (e) {
  //     print("❌ Error sending token to backend: $e");
  //   }
  // }


  /// Background Notification Handler (When app is fully closed)
  static Future<void> backgroundHandler(RemoteMessage message) async {
    print("📩 Background notification received: ${message.notification?.title}");
  }

  /// Show Alert Dialog for Foreground Notifications
  static void _showNotificationDialog(BuildContext context, RemoteMessage message) {
    if (context.mounted) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text(message.notification?.title ?? "No Title"),
          content: Text(message.notification?.body ?? "No Body"),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("OK"),
            ),
          ],
        ),
      );
    }
  }
}
