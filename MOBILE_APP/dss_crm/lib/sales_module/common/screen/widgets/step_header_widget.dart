import 'package:flutter/material.dart';
import '../../../../ui_helper/app_text_styles.dart';
import '../../../../utils/responsive_helper_utils.dart';

class StepHeaderWidget extends StatelessWidget {
  final int currentStep;
  final List<String> stepTitles;

  const StepHeaderWidget({
    Key? key,
    required this.currentStep,
    required this.stepTitles,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: ResponsiveHelper.paddingAll(context, 16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
      ),
      child: Text(
        '!! ${stepTitles[currentStep]} !!',
        style: AppTextStyles.heading1(
          context,
          overrideStyle: const TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}