import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';

/// Reusable File Picker Utility Class
/// Works on both Android and iOS (all versions)
class FilePickerUtil {
  /// Pick a single file
  ///
  /// Parameters:
  /// - allowedExtensions: List of file extensions to allow (e.g., ['pdf', 'doc', 'jpg'])
  /// - type: FileType enum (any, image, video, audio, custom)
  ///
  /// Returns: File object or null if cancelled
  static Future<File?> pickSingleFile({
    List<String>? allowedExtensions,
    FileType type = FileType.any,
  }) async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: type,
        allowedExtensions: type == FileType.custom ? allowedExtensions : null,
        allowMultiple: false,
      );

      if (result != null && result.files.single.path != null) {
        return File(result.files.single.path!);
      }
      return null;
    } catch (e) {
      if (kDebugMode) {
        print('Error picking file: $e');
      }
      return null;
    }
  }

  /// Pick multiple files
  ///
  /// Parameters:
  /// - allowedExtensions: List of file extensions to allow
  /// - type: FileType enum (any, image, video, audio, custom)
  ///
  /// Returns: List of File objects or empty list if cancelled
  static Future<List<File>> pickMultipleFiles({
    List<String>? allowedExtensions,
    FileType type = FileType.any,
  }) async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: type,
        allowedExtensions: type == FileType.custom ? allowedExtensions : null,
        allowMultiple: true,
      );

      if (result != null) {
        return result.paths
            .where((path) => path != null)
            .map((path) => File(path!))
            .toList();
      }
      return [];
    } catch (e) {
      if (kDebugMode) {
        print('Error picking files: $e');
      }
      return [];
    }
  }

  /// Pick image file
  static Future<File?> pickImage() async {
    return await pickSingleFile(type: FileType.image);
  }

  /// Pick multiple images
  static Future<List<File>> pickMultipleImages() async {
    return await pickMultipleFiles(type: FileType.image);
  }

  /// Pick video file
  static Future<File?> pickVideo() async {
    return await pickSingleFile(type: FileType.video);
  }

  /// Pick audio file
  static Future<File?> pickAudio() async {
    return await pickSingleFile(type: FileType.audio);
  }

  /// Pick PDF file
  static Future<File?> pickPDF() async {
    return await pickSingleFile(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );
  }

  /// Pick document files (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX)
  static Future<File?> pickDocument() async {
    return await pickSingleFile(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
    );
  }

  /// Pick custom file types
  ///
  /// Example: pickCustomFile(['jpg', 'png', 'pdf'])
  static Future<File?> pickCustomFile(List<String> extensions) async {
    return await pickSingleFile(
      type: FileType.custom,
      allowedExtensions: extensions,
    );
  }

  /// Pick multiple custom file types
  static Future<List<File>> pickMultipleCustomFiles(List<String> extensions) async {
    return await pickMultipleFiles(
      type: FileType.custom,
      allowedExtensions: extensions,
    );
  }

  /// Get file details
  static Future<Map<String, dynamic>?> getFileDetails(File file) async {
    try {
      final fileName = file.path.split('/').last;
      final fileSize = await file.length();
      final fileExtension = fileName.split('.').last;

      return {
        'name': fileName,
        'path': file.path,
        'size': fileSize,
        'sizeInKB': (fileSize / 1024).toStringAsFixed(2),
        'sizeInMB': (fileSize / (1024 * 1024)).toStringAsFixed(2),
        'extension': fileExtension,
      };
    } catch (e) {
      if (kDebugMode) {
        print('Error getting file details: $e');
      }
      return null;
    }
  }
}