import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

class PermissionManager {

  // PHOTOS
  static Future<bool> requestPhotos(BuildContext context) async {
    if (Platform.isAndroid) {
      int sdk = await DeviceUtils.getAndroidSDK();
      if (sdk >= 33) return await _handle(context, Permission.photos, "Photos");
      return await _handle(context, Permission.storage, "Storage");
    }
    return await _handle(context, Permission.photos, "Photo Library");
  }

  // PHOTOS + VIDEOS
  static Future<bool> requestPhotosAndVideos(BuildContext context) async {
    if (Platform.isAndroid) {
      int sdk = await DeviceUtils.getAndroidSDK();

      if (sdk >= 33) {
        bool img = await _handle(context, Permission.photos, "Photos");
        bool vid = await _handle(context, Permission.videos, "Videos");
        return img && vid;
      }
      return await _handle(context, Permission.storage, "Storage");
    }
    return await _handle(context, Permission.photos, "Photo Library");
  }

  // CAMERA
  static Future<bool> requestCamera(BuildContext context) async {
    return await _handle(context, Permission.camera, "Camera");
  }

  // MICROPHONE
  static Future<bool> requestMicrophone(BuildContext context) async {
    return await _handle(context, Permission.microphone, "Microphone");
  }

  // STORAGE — FIXED ✔ (NO more manageExternalStorage)
  static Future<bool> requestStorage(BuildContext context) async {
    int sdk = await DeviceUtils.getAndroidSDK();

    // Android 13+ → No permission needed
    if (sdk >= 33) return true;

    // Android 11 & 12 → FilePicker works without permission
    if (sdk >= 30) return true;

    // Android 10 or lower → require storage permission
    return await _handle(context, Permission.storage, "Storage");
  }

  // AUDIO FILES
  static Future<bool> requestAudio(BuildContext context) async {
    if (Platform.isAndroid) {
      int sdk = await DeviceUtils.getAndroidSDK();
      if (sdk >= 33) return await _handle(context, Permission.audio, "Audio");
      return await _handle(context, Permission.storage, "Storage");
    }

    return await _handle(context, Permission.mediaLibrary, "Media Library");
  }

  // GENERIC HANDLER
  static Future<bool> _handle(
      BuildContext context,
      Permission permission,
      String name) async {

    PermissionStatus status = await permission.status;

    if (status.isGranted || status.isLimited) return true;

    if (status.isDenied) {
      bool? allow = await PermissionDialogs.showPermissionDialog(
        context,
        "$name Permission Required",
        "Please allow $name permission to continue.",
      );

      if (allow == true) {
        var req = await permission.request();
        if (req.isGranted || req.isLimited) return true;

        if (req.isPermanentlyDenied) {
          await PermissionDialogs.showSettingsDialog(context);
        }
      }

      return false;
    }

    if (status.isPermanentlyDenied) {
      await PermissionDialogs.showSettingsDialog(context);
      return false;
    }

    var newReq = await permission.request();
    return newReq.isGranted || newReq.isLimited;
  }
}

class PermissionDialogs {
  static Future<bool?> showPermissionDialog(
      BuildContext context, String title, String message) async {
    return await showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text("Cancel"),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text("Continue"),
          ),
        ],
      ),
    );
  }

  static Future<void> showSettingsDialog(BuildContext context) async {
    return await showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text("Permission Required"),
        content: const Text("Permission is permanently denied. Open settings to enable it."),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Cancel"),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await openAppSettings();
            },
            child: const Text("Open Settings"),
          ),
        ],
      ),
    );
  }
}

class DeviceUtils {
  static Future<int> getAndroidSDK() async {
    if (!Platform.isAndroid) return 0;

    try {
      final info = await DeviceInfoPlugin().androidInfo;
      return info.version.sdkInt;
    } catch (e) {
      return 33;
    }
  }
}
