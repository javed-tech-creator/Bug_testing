class ApiResponse<T> {
  final T? data;
  final bool success;
  final String? message;
  final int? statusCode;

  // Private constructor
  ApiResponse({
    this.data,
    required this.success,
    this.message,
    this.statusCode,
  });

  //    Factory for success
  factory ApiResponse.success(
      T data, {
        int? statusCode,
      }) {
    return ApiResponse(
      data: data,
      success: true,
      statusCode: statusCode,
    );
  }

  //    Factory for error
  factory ApiResponse.error(
      String message, {
        int? statusCode,
        T? data,
      }) {
    return ApiResponse(
      success: false,
      message: message,
      statusCode: statusCode,
      data: data,
    );
  }
}
