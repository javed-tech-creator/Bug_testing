import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart'; // Import the image_picker package

class CameraCaptureUtils {
  static final ImagePicker _picker = ImagePicker();

  /// Captures a picture from the camera and attempts to reduce its file size to below 2MB.
  ///
  /// Returns the file of the captured image if successful, otherwise null.
  static Future<File?> captureImage() async {
    try {
      final XFile? photo = await _picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 70, // Adjust image quality (0-100). Lower means smaller file size.
        maxWidth: 1920,   // Optional: Limit the maximum width of the image (e.g., Full HD)
        maxHeight: 1080,  // Optional: Limit the maximum height of the image (e.g., Full HD)
      );
      if (photo != null) {
        debugPrint("Photo captured: ${photo.path}");
        final File capturedFile = File(photo.path);
        final int fileSizeInBytes = await capturedFile.length();
        final double fileSizeInMB = fileSizeInBytes / (1024 * 1024);
        debugPrint("Captured photo size: ${fileSizeInMB.toStringAsFixed(2)} MB");

        // Optional: Add a check here if you want to strictly enforce 2MB and discard if larger
        if (fileSizeInMB > 2.0) {
          debugPrint("Warning: Captured photo is larger than 2MB (${fileSizeInMB.toStringAsFixed(2)} MB). Consider adjusting imageQuality or dimensions further.");
          // You could return null here or show a user message if you want to reject it.
          // For now, we'll return the file and let the UI handle the display.
        }

        return capturedFile;
      }
      debugPrint("Photo capture canceled or failed.");
      return null;
    } catch (e) {
      debugPrint("Error capturing photo: $e");
      return null;
    }
  }

  /// Captures a video from the camera with a maximum duration of 15 seconds.
  /// Note: image_picker does not support direct file size limits for video capture.
  /// File size will depend on resolution, frame rate, and compression used by the device.
  ///
  /// Returns the file of the captured video if successful, otherwise null.
  static Future<File?> captureVideo() async {
    try {
      final XFile? video = await _picker.pickVideo(
        source: ImageSource.camera,
        maxDuration: const Duration(seconds: 15), // 15-second limit is applied here
      );
      if (video != null) {
        debugPrint("Video captured (15s): ${video.path}");
        final File capturedFile = File(video.path);
        final int fileSizeInBytes = await capturedFile.length();
        final double fileSizeInMB = fileSizeInBytes / (1024 * 1024);
        debugPrint("Captured video size: ${fileSizeInMB.toStringAsFixed(2)} MB");

        // Optional: Add a check here if you want to strictly enforce 10MB and discard if larger
        if (fileSizeInMB > 5.0) {
          debugPrint("Warning: Captured video is larger than 10MB (${fileSizeInMB.toStringAsFixed(2)} MB).");
          // You could return null here or show a user message if you want to reject it.
          // For now, we'll return the file and let the UI handle the display.
        }

        return capturedFile;
      }
      debugPrint("Video capture canceled or failed.");
      return null;
    } catch (e) {
      debugPrint("Error capturing video: $e");
      return null;
    }
  }
}
