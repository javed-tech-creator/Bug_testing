import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../controller/network_provider_controller.dart';

class NoInternetOverlay extends StatelessWidget {
  final Widget child;

  const NoInternetOverlay({required this.child});

  @override
  Widget build(BuildContext context) {
    final isConnected = Provider.of<NetworkProvider>(context).isConnected;

    return Stack(
      children: [
        child,
        if (!isConnected)
          Positioned.fill(
            child: Container(
              color: Colors.white.withOpacity(0.95),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.wifi_off, size: 70, color: Colors.red),
                  const SizedBox(height: 20),
                  const Text(
                    'No Internet Connection',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton.icon(
                    onPressed: () {
                      Provider.of<NetworkProvider>(context, listen: false)
                          .checkConnection(context);
                    },
                    icon: Icon(Icons.refresh),
                    label: Text("Reconnect"),
                  ),
                ],
              ),
            ),
          )
      ],
    );
  }
}
