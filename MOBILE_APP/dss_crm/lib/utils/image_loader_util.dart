import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';

class ImageLoaderUtil {
  /// Loads a normal Network Image
  static Widget networkImage(String imageUrl,
      {double? width, double? height, BoxFit fit = BoxFit
          .cover, Widget? errorWidget}) {
    return Image.network(
      imageUrl,
      width: width,
      height: height,
      fit: fit,
      errorBuilder: (context, error, stackTrace) =>
      errorWidget ?? Icon(Icons.broken_image, color: Colors.grey),
      loadingBuilder: (context, child, loadingProgress) {
        if (loadingProgress == null) return child;
        return Center(child: CircularProgressIndicator());
      },
    );
  }

  /// Loads a Cached Network Image
  static Widget cacheNetworkImage(String imageUrl,
      {double? width, double? height, BoxFit fit = BoxFit
          .cover, String? errorWidget}) {
    return CachedNetworkImage(
      imageUrl: imageUrl,
      width: width,
      height: height,
      fit: fit,
      placeholder: (context, url) =>
          Center(child: Image.asset("assets/images/imgage_placeholder.jpg")),
      errorWidget: (context, url, error) =>
          Center(child: Image.asset("assets/images/imgage_placeholder.jpg")),
      fadeInDuration: const Duration(milliseconds: 300),
      fadeOutDuration: const Duration(milliseconds: 300),
    );
  }

  /// Loads an Asset Image
  static Widget assetImage(String assetPath,
      {double? width, double? height, BoxFit fit = BoxFit.cover,Color? iconColor}) {
    return Image.asset(
      assetPath,
      width: width,
      height: height,
      fit: fit,
      color: iconColor,
    );
  }
}
