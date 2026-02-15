import 'package:flutter/material.dart';
import 'package:html_editor_enhanced/html_editor.dart';
import 'package:provider/provider.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/custom_snack_bar.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/default_common_app_bar.dart';
import '../../../utils/form_validations_utils.dart';
import '../../../utils/responsive_dropdown_utils.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../controller/hr_employee_api_provider.dart';

class CreateJobOpeningScreen extends StatefulWidget {
  const CreateJobOpeningScreen({Key? key}) : super(key: key);

  @override
  State<CreateJobOpeningScreen> createState() => _CreateJobOpeningScreenState();
}

class _CreateJobOpeningScreenState extends State<CreateJobOpeningScreen> {
  // Controllers
  final TextEditingController titleController = TextEditingController();
  final TextEditingController experienceController = TextEditingController();
  final TextEditingController salaryController = TextEditingController();
  final TextEditingController openingsController = TextEditingController();
  final HtmlEditorController descriptionController = HtmlEditorController();
  final HtmlEditorController skillsController = HtmlEditorController();

  final _formKey = GlobalKey<FormState>();

  // Dropdown
  String? selectedEmploymentType;
  final List<String> employmentTypesList = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
  ];

  String? selectedJobType;
  final List<String> selectedJobTypeList = ['Public', 'Internal'];

  String? _probationUnit = "Month"; // Default Month

  // Submit
  Future<void> handleSubmit(HREmployeeApiProvider provider) async {
    if (!_formKey.currentState!.validate()) return;

    final int? experienceNo = int.tryParse(experienceController.text.trim());
    final String experienceText = experienceNo != null && experienceNo > 0
        ? "$experienceNo $_probationUnit${experienceNo == 1 ? '' : 's'}"
        : "";

    // Get HTML → plain text
    final String descriptionHtml = await descriptionController.getText();
    final String skillsHtml = await skillsController.getText();

    // Convert skills HTML → List<String>
    final List<String> skillsList = skillsHtml
        .replaceAll(RegExp(r'<[^>]*>'), '') // strip tags
        .split(RegExp(r'[,;\n]')) // split by comma, semicolon, newline
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();

    final Map<String, dynamic> requestData = {
      "title": titleController.text.trim(),
      "description": descriptionHtml,
      "jobType": selectedJobType,
      "skills": skillsList,
      "employmentType": selectedEmploymentType,
      if (experienceText.isNotEmpty) "experience": experienceText,
      "salaryRange": salaryController.text.trim(),
      "openings": int.tryParse(openingsController.text.trim()) ?? 1,
      "status": "Open",
      "postedBy": null,
    };

    debugPrint("REQUEST BODY: ${requestData.toString()}");

    await provider.createHrJobPosting(context, requestData);
  }

  @override
  void dispose() {
    titleController.dispose();
    experienceController.dispose();
    salaryController.dispose();
    openingsController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: DefaultCommonAppBar(
        activityName: "Create Job",
        backgroundColor: AppColors.primary,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(12.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Job Title
                _buildTextField(
                  "Job Title",
                  titleController,
                  isRequired: true,
                  prefixIcon: Icons.work,
                ),

                // 2. Employment Type
                ResponsiveDropdown<String>(
                  value: selectedEmploymentType,
                  itemList: employmentTypesList,
                  onChanged: (v) => setState(() => selectedEmploymentType = v),
                  hint: 'Select Employment Type',
                  label: 'Employment Type *',
                ),

                ResponsiveDropdown<String>(
                  value: selectedJobType,
                  itemList: selectedJobTypeList,
                  onChanged: (v) => setState(() => selectedJobType = v),
                  hint: 'Select Job Type',
                  label: 'Job Type *',
                ),

                // 3. Experience with Unit Dropdown (Horizontal Layout)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Experience Number Field
                      Expanded(
                        child: CustomTextField(
                          title: "Experience",
                          hintText: "Enter Experience",
                          controller: experienceController,
                          prefixIcon: Icons.timeline,
                          keyboardType: TextInputType.number,
                          validator: (v) => FormValidatorUtils.validateRequired(
                            v?.trim(),
                            fieldName: "Experience",
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      // Unit Dropdown (Year/Month)
                      Expanded(
                        child: ResponsiveDropdown<String>(
                          value: _probationUnit,
                          itemList: const ["Year", "Month"],
                          onChanged: (value) {
                            setState(() {
                              _probationUnit = value;
                            });
                          },
                          hint: 'Select Unit',
                          label: 'Unit',
                          validator: (value) {
                            if (value == null) {
                              return 'Select unit';
                            }
                            return null;
                          },
                        ),
                      ),
                    ],
                  ),
                ),

                // 4. Salary Range
                _buildTextField(
                  "Salary Range",
                  salaryController,
                  isRequired: true,
                  prefixIcon: Icons.currency_rupee,
                ),

                // 5. Openings
                _buildTextField(
                  "Openings",
                  openingsController,
                  isRequired: true,
                  prefixIcon: Icons.people,
                  keyboardType: TextInputType.number,
                ),

                // 6. Job Description
                ResponsiveHelper.sizedBoxHeight(context, 10),
                Text(
                  "Job Description *",
                  style: AppTextStyles.heading2(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 12),
                    ),
                  ),
                ),
                ResponsiveHelper.sizedBoxHeight(context, 8),
                HtmlEditor(
                  controller: descriptionController,
                  htmlEditorOptions: const HtmlEditorOptions(
                    hint: "Enter job description...",
                  ),
                  otherOptions: const OtherOptions(height: 250),
                ),

                // 7. Skills
                ResponsiveHelper.sizedBoxHeight(context, 10),
                Text(
                  "Required Skills *",
                  style: AppTextStyles.heading2(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 12),
                    ),
                  ),
                ),
                ResponsiveHelper.sizedBoxHeight(context, 8),
                HtmlEditor(
                  controller: skillsController,
                  htmlEditorOptions: const HtmlEditorOptions(
                    hint: "Enter skills (comma separated)...",
                  ),
                  otherOptions: const OtherOptions(height: 150),
                ),

                const SizedBox(height: 20),

                // Submit Button
                Consumer<HREmployeeApiProvider>(
                  builder: (context, createJobPosting, child) {
                    return Container(
                      width: double.infinity,
                      child: CustomButton(
                        color: AppColors.primary,
                        text: createJobPosting.isLoading
                            ? 'Creating...'
                            : "Create Job",
                        onPressed: createJobPosting.isLoading
                            ? null
                            : () {
                                if (_formKey.currentState!.validate()) {
                                  handleSubmit(createJobPosting);
                                }
                              },
                      ),
                    );
                  },
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(
    String title,
    TextEditingController controller, {
    bool isRequired = false,
    IconData? prefixIcon,
    TextInputType? keyboardType,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: CustomTextField(
        title: title,
        hintText: "Enter $title",
        controller: controller,
        prefixIcon: prefixIcon,
        keyboardType: keyboardType ?? TextInputType.text,
        validator: isRequired
            ? (v) => FormValidatorUtils.validateRequired(
                v?.trim(),
                fieldName: title,
              )
            : null,
      ),
    );
  }
}
