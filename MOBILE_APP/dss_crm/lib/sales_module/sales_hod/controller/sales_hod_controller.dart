import 'package:dss_crm/network_manager/repository.dart';
import 'package:flutter/material.dart';
import '../../../network_manager/api_response.dart';
import '../../../auth/model/login_model.dart';

class SalesHODApiProvider with ChangeNotifier {
  final Repository _repository = Repository();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

}
