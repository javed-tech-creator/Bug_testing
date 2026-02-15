import 'package:flutter/material.dart';

class CustomStepperWidget extends StatelessWidget {
  final int currentStep;
  final List<String> stepTitles;

  const CustomStepperWidget({
    Key? key,
    required this.currentStep,
    required this.stepTitles,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      color: Colors.white,
      child: Center(
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(stepTitles.length * 2 - 1, (index) {
            if (index.isOdd) {
              // Line between steps
              return Container(
                width: 30,
                height: 2,
                color: index ~/ 2 < currentStep ? Colors.green : Colors.grey[300],
              );
            } else {
              int stepIndex = index ~/ 2;
              return Column(
                children: [
                  // Step circle
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: stepIndex < currentStep
                          ? Colors.green
                          : stepIndex == currentStep
                          ? Colors.black
                          : Colors.grey[300],
                    ),
                    child: Center(
                      child: stepIndex < currentStep
                          ? const Icon(Icons.check, color: Colors.white, size: 20)
                          : Text(
                        '${stepIndex + 1}',
                        style: TextStyle(
                          color: stepIndex == currentStep
                              ? Colors.white
                              : Colors.grey[600],
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              );
            }
          }),
        ),
      ),
    );
  }
}