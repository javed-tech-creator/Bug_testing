// import 'package:dss_crm/utils/responsive_loader_utils.dart';
// import 'package:flutter/material.dart';
// import 'package:provider/provider.dart';
// import '../../common/model/sales_emp_client_briefing_form_list_model.dart';
// import '../../sales_employee/sales_client_breifing/controller/sales_emp_client_briefing_controller.dart';
//
// class SalesBriefingStepperScreen extends StatefulWidget {
//   @override
//   _SalesBriefingStepperScreenState createState() => _SalesBriefingStepperScreenState();
// }
//
// class _SalesBriefingStepperScreenState extends State<SalesBriefingStepperScreen> {
//   int _currentStep = 0;
//
//   @override
//   void initState() {
//     super.initState();
//     WidgetsBinding.instance.addPostFrameCallback((_) {
//       Provider.of<SalesEmpClientBriefingApiProvider>(context, listen: false)
//           .getAllSalesClientBriefingList(context);
//     });
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     final provider = Provider.of<SalesEmpClientBriefingApiProvider>(context);
//     final data = provider.getSalesEmpClientBreifingListLeadModelResponse;
//
//     return Scaffold(
//       appBar: AppBar(title: Text('Sales Client Briefing')),
//       body:
//
//       Consumer<SalesEmpClientBriefingApiProvider>(
//           builder: (context, provider, _) {
//             if (provider.isLoading) {
//               return const Center(child: LoadingIndicatorUtils());
//             }
//             final response =  provider.getSalesEmpClientBreifingListLeadModelResponse;
//
//             final briefingList = response!.data!.data!;
//             response.success != true || response.data?.data == null
//             ? Center(
//               child: Column(
//                 mainAxisAlignment: MainAxisAlignment.center,
//                 children: [
//                   Icon(Icons.error_outline, size: 64, color: Colors.grey[400]),
//                   const SizedBox(height: 16),
//                   Text(
//                     response.message ?? "Failed to load data.",
//                     style: TextStyle(color: Colors.grey[600], fontSize: 16),
//                     textAlign: TextAlign.center,
//                   ),
//                 ],
//               ),
//             )
//             : data!.data!.data!.isEmpty
//             ? Center(child: Text('No data found'))
//             : Stepper(
//           currentStep: _currentStep,
//           onStepContinue: () {
//             if (_currentStep < 3) setState(() => _currentStep += 1);
//           },
//           onStepCancel: () {
//             if (_currentStep > 0) setState(() => _currentStep -= 1);
//           },
//           steps: [
//             _stepLeadInfo(data[0]),
//             _stepPreSales(data[0]),
//             _stepInitialPayment(data[0]),
//             _stepDocumentUpload(data[0]),
//           ],
//         ),
//       ),
//     );
//   }
//
//   Step _stepLeadInfo(Data d) {
//     return Step(
//       title: Text('Lead Info'),
//       content: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           AppTextStyleText(title: 'Client Name: ${d.d ?? ""}'),
//           AppTextStyleText(title: 'Company: ${d.companyName ?? ""}'),
//           AppTextStyleText(title: 'Project: ${d.projectName ?? ""}'),
//           AppTextStyleText(title: 'Product: ${d.productName ?? ""}'),
//         ],
//       ),
//       isActive: _currentStep >= 0,
//     );
//   }
//
//   Step _stepPreSales(Data d) {
//     return Step(
//       title: Text('Pre-Sales'),
//       content: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           AppTextStyleText(title: 'Client Profile: ${d.clientProfile ?? ""}'),
//           AppTextStyleText(title: 'Behaviour: ${d.clientBehaviour ?? ""}'),
//           AppTextStyleText(title: 'Discussion Done: ${d.discussionDone ?? ""}'),
//           AppTextStyleText(title: 'Recce Instruction: ${d.instructionRecce ?? ""}'),
//           AppTextStyleText(title: 'Design Instruction: ${d.instructionDesign ?? ""}'),
//         ],
//       ),
//       isActive: _currentStep >= 1,
//     );
//   }
//
//   Step _stepInitialPayment(Data d) {
//     return Step(
//       title: Text('Initial Payment'),
//       content: AppTextStyleText(title: 'InitialPaymentForm Placeholder'),
//       isActive: _currentStep >= 2,
//     );
//   }
//
//   Step _stepDocumentUpload(Data d) {
//     return Step(
//       title: Text('Documents'),
//       content: Column(
//         children: d.documentUpload?.map((doc) {
//           return AppTextStyleText(title: 'Doc: ${doc.url ?? "No URL"}');
//         }).toList() ??
//             [AppTextStyleText(title: 'No Documents')],
//       ),
//       isActive: _currentStep >= 3,
//     );
//   }
// }
