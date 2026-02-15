import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../ui_helper/app_colors.dart';
import '../ui_helper/app_text_styles.dart';
import '../utils/responsive_helper_utils.dart';

class WebViewScreen extends StatefulWidget {
  final String aciviyName;
  final bool isTermAndConditions;
  final bool isPrivacyPolicy;
  final bool isRefundPolicy;
  final String url;

  WebViewScreen({
    required this.aciviyName,
    required this.isTermAndConditions,
    required this.isPrivacyPolicy,
    required this.isRefundPolicy,
    required this.url,
  });

  @override
  State<WebViewScreen> createState() => _WebViewScreenState();
}

class _WebViewScreenState extends State<WebViewScreen> {
  @override
  void initState() {
    super.initState();
    _launchPolicyURL(); // launch URL when screen opens
  }

  Future<void> _launchPolicyURL() async {
    String urlToLaunch = widget.url;

    if (widget.isTermAndConditions) {
      urlToLaunch ;
    } else if (widget.isPrivacyPolicy) {
      urlToLaunch ;
    } else if (widget.isRefundPolicy) {
      urlToLaunch ;
    }

    final Uri url = Uri.parse(urlToLaunch);
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      throw Exception('Could not launch $url');
    }

    // Close this screen after launching the URL
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    // Show loading UI briefly before pop
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        title: Text(
          widget.aciviyName,
          style: AppTextStyles.body1(
            context,
            overrideStyle: TextStyle(
              color: Colors.white,
              fontSize: ResponsiveHelper.fontSize(context, 14),
            ),
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}




















// import 'package:flutter/material.dart';
// import 'package:flutter_html/flutter_html.dart';
// import 'package:shanya_scans/base_widgets/loading_indicator.dart';
// import 'package:shanya_scans/screen/profile/controller/term_condition_provider.dart';
// import 'package:shanya_scans/ui_helper/app_text_styles.dart';
// import 'package:shanya_scans/ui_helper/responsive_helper.dart';
// import 'package:provider/provider.dart';
// import 'package:shanya_scans/util/image_loader_util.dart';
//
// import '../../../ui_helper/app_colors.dart';
// import '../../base_widgets/expandable_text_widget.dart';
// import 'package:url_launcher/url_launcher.dart';
//
//
// class WebViewScreen extends StatefulWidget {
//   final String aciviyName;
//   final String url;
//   final bool isTermAndConditions;
//   final bool isPrivacyPolicy;
//   final bool isRefundPolicy;
//
//   WebViewScreen({
//     required this.aciviyName,
//     required this.url,
//     required this.isTermAndConditions,
//     required this.isPrivacyPolicy,
//     required this.isRefundPolicy,
//   });
//
//   @override
//   State<WebViewScreen> createState() => _WebViewScreenState();
// }
//
// class _WebViewScreenState extends State<WebViewScreen> {
//
//   void _launchPrivacyPolicy() async {
//     const url = 'https://shanyascans.com/privacy-policy'; // Your real URL
//     if (await canLaunchUrl(Uri.parse(url))) {
//       await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
//     } else {
//       throw 'Could not launch $url';
//     }
//   }
//
//   @override
//   void initState() {
//     super.initState();
//
//     if (widget.isTermAndConditions) {
//       Provider.of<TermConditionPrivacyPolicyApiProvider>(context, listen: false)
//           .getTermAndConditions(context);
//     }
//     if (widget.isPrivacyPolicy) {
//       _launchPrivacyPolicy();
//       // Provider.of<TermConditionPrivacyPolicyApiProvider>(context, listen: false)
//       //     .getPrivacyPolicy(context);
//     }
//     if (widget.isRefundPolicy) {
//       Provider.of<TermConditionPrivacyPolicyApiProvider>(context, listen: false)
//           .getRefundPolicy(context);
//     }
//
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.white,
//       appBar: AppBar(
//         backgroundColor: AppColors.primary,
//         title: Text(
//           "${widget.aciviyName}",
//           style: AppTextStyles.bodyText1(context,
//               overrideStyle: TextStyle(
//                   color: Colors.white,
//                   fontSize: ResponsiveHelper.fontSize(context, 14))),
//         ),
//         leading: IconButton(
//           icon: Icon(
//             Icons.arrow_back,
//             color: Colors.white,
//           ),
//           onPressed: () => Navigator.pop(context),
//         ),
//       ),
//       body: Consumer<TermConditionPrivacyPolicyApiProvider>(
//         builder: (context, provider, child) {
//           print("API Response: ${provider.termAndConditionsModel?.data}");
//
//           if (provider.isLoading) {
//             return loadingIndicator();
//           }
//           if (provider.errorMessage.isNotEmpty) {
//             return Center(
//               child: SizedBox(
//                 width: ResponsiveHelper.containerWidth( context, 50),
//                 height: ResponsiveHelper.containerWidth(context, 50),
//                 child: ImageLoaderUtil.assetImage(
//                   "assets/images/img_error.jpg",
//                 ),
//               ),
//             );
//           }
//
//           return SingleChildScrollView(
//             padding: EdgeInsets.all(16), // Add some padding
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 ExpandableTextWidget(
//                   text: provider.termAndConditionsModel!.data!.description
//                       .toString(),
//                   customStyles: {
//                     "span": Style(
//                       fontSize: FontSize(ResponsiveHelper.fontSize(context, 20)), // Make headings bigger
//                       // color: Colors.green, // Change heading color
//                     ),
//                     "strong": Style(
//                       fontWeight: FontWeight.w700, // Make bold text even heavier
//                       // color: Colors.black, // Change bold text color
//                     ),
//                     "h1": Style(fontSize: FontSize(15.0), fontWeight: FontWeight.bold, ),
//                     "h2": Style(fontSize: FontSize(15.0), fontWeight: FontWeight.bold,),
//                   },
//                 ),
//                 SizedBox(height: 20), // Add some spacing at the bottom
//               ],
//             ),
//           );
//         },
//       ),
//     );
//   }
// }
