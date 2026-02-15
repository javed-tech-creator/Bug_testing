import 'package:dss_crm/utils/responsive_loader_utils.dart';
import 'package:flutter/material.dart';

class FullScreenLoader {
  static OverlayEntry? _overlayEntry;

  static void show(BuildContext context, {String message = "Loading..."}) {
    // Prevent multiple loaders
    if (_overlayEntry != null) return;

    _overlayEntry = OverlayEntry(
      builder: (context) => Stack(
        children: [
          // Dim background
          ModalBarrier(
            dismissible: false,
            color: Colors.black.withOpacity(0.5),
          ),
          // Loader card - FIXED VERSION
          Center(
            child: Material(
              color: Colors.transparent,
              child: IntrinsicHeight( // ← This ensures height fits content
                child: IntrinsicWidth( // ← This ensures width fits content
                  child: Container(
                    constraints: const BoxConstraints(
                      maxWidth: 280,
                      minWidth: 200,
                      maxHeight: 100, // ← Add max height constraint
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 20,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black26,
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min, // ← Important
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const SizedBox(
                          width: 24,
                          height: 24,
                          child: LoadingIndicatorUtils(),
                        ),
                        const SizedBox(width: 16),
                        Flexible( // ← Changed from Expanded
                          child: Text(
                            message,
                            style: const TextStyle(
                              color: Colors.black87,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                            maxLines: 2, // ← Prevent overflow
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );

    Overlay.of(context, rootOverlay: true).insert(_overlayEntry!);
  }

  static void hide(BuildContext context) {
    _overlayEntry?.remove();
    _overlayEntry = null;
  }
}