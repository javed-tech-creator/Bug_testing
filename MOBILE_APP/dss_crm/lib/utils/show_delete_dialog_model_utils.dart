import 'package:flutter/material.dart';

/// Shows a customizable and reusable confirmation dialog for delete operations.
///
/// Returns `true` if the user confirms the deletion, `false` otherwise.
Future<bool?> showDeleteConfirmationDialog({
  required BuildContext context,
  required String title,
  required String message,
  required Future<void> Function() onConfirm,
}) async {
  return await showDialog<bool>(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        title: Text(title),
        content: Text(message),
        actions: <Widget>[
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Colors.grey),
            ),
          ),
          ElevatedButton(
            onPressed: () async {
              try {
                // Execute the provided delete function
                await onConfirm();
                // Pop the dialog with a true value to indicate success
                Navigator.of(context).pop(true);
              } catch (e) {
                // If an error occurs, pop the dialog with a false value
                Navigator.of(context).pop(false);
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: const Text('Delete'),
          ),
        ],
      );
    },
  );
}
