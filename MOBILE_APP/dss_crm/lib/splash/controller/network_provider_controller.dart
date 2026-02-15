import 'dart:async';
import 'dart:io';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';

class NetworkProvider with ChangeNotifier {
  bool _isConnected = true;

  bool get isConnected => _isConnected;


  // 🟢 Listen to changes continuously
  void initializeConnectivityListener(BuildContext context) {
    Connectivity().onConnectivityChanged.listen((_) async {
      bool previousStatus = _isConnected;

      // Use the improved connection check
      bool isNotConnected = true;
      try {
        final result = await InternetAddress.lookup('example.com');
        if (result.isNotEmpty && result[0].rawAddress.isNotEmpty) {
          isNotConnected = false;
        }
      } on SocketException catch (_) {
        isNotConnected = true;
      }

      _isConnected = !isNotConnected;

      if (previousStatus != _isConnected) {
        notifyListeners();
        _showNetworkStatusSnackBar(context, isNotConnected);
      }
    });
  }


  // Method to manually check the network status
  Future<void> checkConnection(BuildContext context,
      {bool showSnackBar = false}) async {
    bool isNotConnected = true;

    try {
      final result = await InternetAddress.lookup(
          'example.com'); // You can use 'google.com' too
      if (result.isNotEmpty && result[0].rawAddress.isNotEmpty) {
        isNotConnected = false;
      }
    } on SocketException catch (_) {
      isNotConnected = true;
    }

    _isConnected = !isNotConnected;
    notifyListeners();
    // Only show snackbar if explicitly requested
    if (showSnackBar) {
      _showNetworkStatusSnackBar(context, isNotConnected);
    }
    // _showNetworkStatusSnackBar(context, isNotConnected);
  }

  // Method to listen for connectivity changes and show the snackbar
  void _showNetworkStatusSnackBar(BuildContext context, bool isNotConnected) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: isNotConnected ? Colors.red : Colors.green,
        duration: Duration(seconds: isNotConnected ? 6 : 3),
        content: Text(
          isNotConnected ? "No internet connection" : "Connected",
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}
