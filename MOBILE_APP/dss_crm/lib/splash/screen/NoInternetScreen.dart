import 'package:flutter/material.dart';
 import 'package:provider/provider.dart';
import '../../utils/image_loader_util.dart';
import 'SplashScreen.dart';
import '../controller/network_provider_controller.dart';

class NoInternetScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Access the network connection status from the provider
    bool isConnected = Provider.of<NetworkProvider>(context).isConnected;

    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          ImageLoaderUtil.assetImage("assets/images/img_no_internet.png", width: 250), // Show No Internet Image
          SizedBox(height: 20),
          Text(
            "No Internet Connection!",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 10),
          Text("Please check your network and try again."),
          SizedBox(height: 20),
          ElevatedButton(
            onPressed: () async {
              await Provider.of<NetworkProvider>(context, listen: false).checkConnection(context);
              bool updatedConnectionStatus = Provider.of<NetworkProvider>(context, listen: false).isConnected;

              if (updatedConnectionStatus) {
                Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => SplashScreen()));
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("No internet connection. Please try again.")),
                );
              }
            },
            child: Text("Retry"),
          ),
        ],
      ),
    );
  }
}
