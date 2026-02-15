import 'package:flutter/material.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/responsive_helper_utils.dart';
class CompletionScreenWidget extends StatelessWidget {
  const CompletionScreenWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: ResponsiveHelper.paddingAll(context, 20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Icon(
              Icons.check_circle_outline,
              size: ResponsiveHelper.iconSize(context, 80),
              color: Colors.green,
            ),
            ResponsiveHelper.sizedBoxHeight(context, 20),
            Text(
              "All Steps Completed!",
              style: AppTextStyles.heading2(
                context,
                overrideStyle: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            ResponsiveHelper.sizedBoxHeight(context, 10),
            Text(
              "Sales management process completed successfully",
              style: AppTextStyles.body2(
                context,
                overrideStyle: const TextStyle(color: Colors.grey),
              ),
            ),
          ],
        ),
      ),
    );
  }
}