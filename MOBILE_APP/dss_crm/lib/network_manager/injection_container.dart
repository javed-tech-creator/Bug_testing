import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:dss_crm/network_manager/print_value_utild.dart';


Dio getDio () {
  Dio dio = Dio();

  dio.interceptors.add(
      InterceptorsWrapper(
          onRequest: (RequestOptions options, handler){
            printValue(tag: 'API URL:', '${options.uri}');
            printValue(tag: 'HEADER:', options.headers);
            // Custom print for FormData
            if (options.data is FormData) {
              final formDataMap = {};
              (options.data as FormData).fields.forEach((field) {
                formDataMap[field.key] = field.value;
              });
              (options.data as FormData).files.forEach((file) {
                formDataMap[file.key] = '📎 File: ${file.value.filename}';
              });

              printValue(tag: '📤 FORM DATA:', formDataMap);
            }
            try{
              printValue(tag: '✔️ REQUEST BODY: ', jsonEncode(options.data));
            }catch (e){
              printValue(tag: '🚫 REQUEST BODY ERROR: ', e.toString());
            }

            return handler.next(options);
          },

          onResponse: (Response response, ResponseInterceptorHandler handler){
            printValue(tag: '   API RESPONSE:', response.data);
            return handler.next(response);
          },

          onError: (DioException e, handler){
            printValue(tag: '❌ STATUS CODE:' ,"${e.response?.statusCode??""}");
            printValue(tag: '❌ ERROR DATA :' ,e.response?.data??"");
            return handler.next(e);
          }
      )
  );
  return dio;
}