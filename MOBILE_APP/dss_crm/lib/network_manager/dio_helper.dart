// dio_helper.dart
import 'package:dio/dio.dart';
import 'package:flutter/cupertino.dart';
import '../utils/storage_util.dart';
import 'api_response.dart';
import 'injection_container.dart';
import 'intercepter.dart';

class DioHelper {
  final Dio dio = getDio()
    ..interceptors.add(AuthInterceptor())
    ..interceptors.add(LogInterceptor(
      request: true,
      requestBody: true,
      responseBody: true,
      responseHeader: false,
      requestHeader: true,
      error: true,
    ));

  Options _buildOptions(bool isAuthRequired, {bool isMultipart = false, Map<String, dynamic>? customHeaders,}) {
    final headers = <String, dynamic>{
      // Default headers can go here if needed
    };
    // Add custom headers if provided
    if (customHeaders != null) {
      headers.addAll(customHeaders);
    }
    return Options(
      contentType: isMultipart ? 'multipart/form-data' : 'application/json',
      sendTimeout: const Duration(seconds: 120),
      receiveTimeout: const Duration(seconds: 120),
      headers: headers,
      // headers: {
      //   // "x-api-key": "ayush_don_123",
      //   if (isAuthRequired)
      //     "x-api-key": "ayush_don_123",
      //     // "Authorization": "Bearer ${StorageHelper().getUserAccessToken()}",
      // },
    );
  }

  ApiResponse<T> _handleError<T>(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.sendTimeout) {
      return ApiResponse<T>(
        success: false,
        message: "Request timed out",
        statusCode: 408,
      );
    }

    if (e.response != null) {
      return ApiResponse<T>(
        success: false,
        message: e.response?.data['message'] ?? "Something went wrong",
        statusCode: e.response?.statusCode,
        data: e.response?.data is T ? e.response?.data : null,
      );
    }

    return ApiResponse<T>(
      success: false,
      message: "Network error",
      statusCode: 503,
    );
  }

  Future<ApiResponse<T>> get<T>({
    required String url,
    bool isAuthRequired = false,
    Map<String, dynamic>? queryParams,
    Map<String, dynamic>? customHeaders,
  }) async {
    try {
      final response = await dio.get(
        url,
        queryParameters: queryParams,
        options: _buildOptions(isAuthRequired, customHeaders: customHeaders),
      );
      return ApiResponse<T>(
        success: true,
        data: response.data as T?,
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      return _handleError<T>(e);
    }
  }

  Future<ApiResponse<T>> post<T>({
    required String url,
    Object? requestBody,
    bool isAuthRequired = false,
    Map<String, dynamic>? customHeaders,
  }) async {
    try {
      final isMultipart = requestBody is FormData;
      debugPrint("requestbody : ${isMultipart}");
      final response = await dio.post(
        url,
        data: requestBody,
        options: _buildOptions(isAuthRequired, isMultipart: isMultipart,
          customHeaders: customHeaders,),
      );
      return ApiResponse<T>(
        success: true,
        data: response.data as T?,
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      return _handleError<T>(e);
    }
  }

  Future<ApiResponse<T>> put<T>({
    required String url,
    Object? requestBody,
    bool isAuthRequired = false,
    Map<String, dynamic>? customHeaders,
  }) async {
    try {
      final isMultipart = requestBody is FormData;
      final response = await dio.put(
        url,
        data: requestBody,
        options: _buildOptions(isAuthRequired, isMultipart: isMultipart,
          customHeaders: customHeaders,),
      );
      return ApiResponse<T>(
        success: true,
        data: response.data as T?,
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      return _handleError<T>(e);
    }
  }

  Future<ApiResponse<T>> patch<T>({
    required String url,
    Object? requestBody,
    bool isAuthRequired = false,
    Map<String, dynamic>? customHeaders,
  }) async {
    try {
      final isMultipart = requestBody is FormData;
      final response = await dio.patch(
        url,
        data: requestBody,
        options: _buildOptions(isAuthRequired, isMultipart: isMultipart,
          customHeaders: customHeaders,),
      );
      return ApiResponse<T>(
        success: true,
        data: response.data as T?,
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      return _handleError<T>(e);
    }
  }

  Future<ApiResponse<T>> delete<T>({
    required String url,
    Object? requestBody,
    bool isAuthRequired = false,
    Map<String, dynamic>? customHeaders,
  }) async {
    try {
      final isMultipart = requestBody is FormData;
      final response = await dio.delete(
        url,
        data: requestBody,
        options: _buildOptions(isAuthRequired, isMultipart: isMultipart,
          customHeaders: customHeaders,),
      );
      return ApiResponse<T>(
        success: true,
        data: response.data as T?,
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      return _handleError<T>(e);
    }
  }

  Future<ApiResponse<T>> uploadFile<T>({
    required String url,
    required FormData requestBody,
    bool isAuthRequired = false,
    Map<String, dynamic>? customHeaders,
  }) async {
    try {
      final response = await dio.post(
        url,
        data: requestBody,
        options: _buildOptions(isAuthRequired, isMultipart: true,
          customHeaders: customHeaders,),
      );
      return ApiResponse<T>(
        success: true,
        data: response.data as T?,
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      return _handleError<T>(e);
    }
  }
}
