import 'package:dss_crm/sales_module/common/model/sales_management_sheet_form_2_model.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../../../utils/custom_text_field_utils.dart';
import '../../../../utils/responsive_helper_utils.dart';

class PreSalesFormWidget extends StatelessWidget {

  final TextEditingController briefingAtController;
  final TextEditingController clientNameController;
  final TextEditingController preSalesCompanyNameController;
  final TextEditingController projectNameController;
  final TextEditingController productNameController;
  final TextEditingController clientRequirementsController;
  final TextEditingController clientProfileController;
  final TextEditingController clientBehaviourController;
  final TextEditingController discussionDoneController;
  final TextEditingController instructionsRecceController;
  final TextEditingController instructionsDesignController;
  final TextEditingController instructionsInstallationController;
  final TextEditingController instructionsOtherController;

  final List<String> documentUrls;

  // final List<DocumentUpload> documents;

  const PreSalesFormWidget({
    Key? key,
    required this.briefingAtController,
    required this.clientNameController,
    required this.preSalesCompanyNameController,
    required this.projectNameController,
    required this.productNameController,
    required this.clientRequirementsController,
    required this.clientProfileController,
    required this.clientBehaviourController,
    required this.discussionDoneController,
    required this.instructionsRecceController,
    required this.instructionsDesignController,
    required this.instructionsInstallationController,
    required this.instructionsOtherController,
    required this.documentUrls,
    // required this.documents,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      CustomTextField(
        controller: briefingAtController,
        title: "Briefing At",
        readOnly: true,
        prefixIcon: Icons.calendar_month_outlined,
        // onTap: () async {
        //   final picked = await showDatePicker(
        //     context: context,
        //     initialDate: DateTime.now(),
        //     firstDate: DateTime(2000),
        //     lastDate: DateTime(2100),
        //   );
        //   if (picked != null) {
        //     briefingAtController.text =
        //     "${picked.day}/${picked.month}/${picked.year}";
        //   }
        // },
        hintText: 'Briefing At',
      ),
      ResponsiveHelper.sizedBoxHeight(context, 10),
      CustomTextField(
        controller: clientNameController,
        title: "Client Name *",
        hintText: 'Client Name',
        readOnly: true,
      ),
      CustomTextField(
        controller: preSalesCompanyNameController,
        title: "Company Name *",
        hintText: 'Company Name',
        readOnly: true,
      ),
      CustomTextField(
        controller: projectNameController,
        title: "Project Name *",
        hintText: 'Project Name',
        readOnly: true,
      ),
      CustomTextField(
        controller: productNameController,
        title: "Product Name *",
        hintText: 'Product Name',
        readOnly: true,
      ),
      CustomTextField(
        controller: clientRequirementsController,
        title: "Client's Requirements",
        maxLines: 3,
        hintText: 'Client Requirements',
        readOnly: true,
      ),
      CustomTextField(
        controller: clientProfileController,
        title: "Client's Profile",
        maxLines: 3,
        hintText: 'Client Profile',
        readOnly: true,
      ),
      CustomTextField(
        controller: clientBehaviourController,
        title: "Client's Behaviour",
        hintText: 'Client Behaviour',
        readOnly: true,
      ),
      CustomTextField(
        controller: discussionDoneController,
        title: "Discussion Done (with client) *",
        maxLines: 3,
        hintText: 'Discussion Done (with client)',
        readOnly: true,
      ),
      CustomTextField(
        controller: instructionsRecceController,
        title: "Instructions to Recce Team",
        maxLines: 3,
        hintText: 'Instructions to Recce Team',
        readOnly: true,
      ),
      CustomTextField(
        controller: instructionsDesignController,
        title: "Instructions to Design Team",
        maxLines: 3,
        hintText: 'Instructions to Design Team',
        readOnly: true,
      ),
      CustomTextField(
        controller: instructionsInstallationController,
        title: "Instructions to Installation Team",
        maxLines: 3,
        hintText: 'Instructions to Installation Team',
        readOnly: true,
      ),
      CustomTextField(
        controller: instructionsOtherController,
        title: "Instructions to Other Teams",
        maxLines: 3,
        hintText: 'Instructions to Other Teams',
        readOnly: true,
      ),

      if (documentUrls.isNotEmpty)
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Text(
            'Documents:',
            style: Theme.of(context).textTheme.titleLarge,
          ),
        ),

      // Display the list of documents
      ...documentUrls.map((url) {
        // You can extract the filename from the URL for a cleaner display
        final fileName = url.split('/').last;

        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 4.0),
          child: InkWell(
            onTap: () {
              // Implement logic to open the URL (e.g., using url_launcher)
              // For now, let's just print a message.
              debugPrint('Tapped on document: $url');
            },
            child: Row(
              children: [
                const Icon(Icons.file_copy, color: Colors.blue),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    fileName,
                    style: const TextStyle(
                      color: Colors.blue,
                      decoration: TextDecoration.underline,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),

      // if(documents !=null && documents!.isNotEmpty)...{
      //   ResponsiveHelper.sizedBoxHeight(context, 20),
      //   _buildDocumentsSection(context),
      // }
    ]);
  }

}
