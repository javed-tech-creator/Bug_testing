import 'package:dss_crm/hr_module/screen/job_opening/model/single_job_opening_details_model.dart';
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

class UpdateJobOpeningScreen extends StatefulWidget {
  final String jobId; // Only jobId now

  const UpdateJobOpeningScreen({Key? key, required this.jobId})
    : super(key: key);

  @override
  State<UpdateJobOpeningScreen> createState() => _UpdateJobOpeningScreenState();
}

class _UpdateJobOpeningScreenState extends State<UpdateJobOpeningScreen> {
  // Controllers
  late final TextEditingController titleController;
  late final TextEditingController experienceController;
  late final TextEditingController salaryController;
  late final TextEditingController openingsController;
  late final HtmlEditorController descriptionController;
  late final HtmlEditorController skillsController;

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

  bool _isLoading = true;
  Data? _job;

  @override
  void initState() {
    super.initState();
    titleController = TextEditingController();
    experienceController = TextEditingController();
    salaryController = TextEditingController();
    openingsController = TextEditingController();
    descriptionController = HtmlEditorController();
    skillsController = HtmlEditorController();

    // GOOD: Post frame callback
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchJobDetails();
    });
  }

  Future<void> _fetchJobDetails() async {
    if (!mounted) return;

    setState(() => _isLoading = true);

    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    final success = await provider.singleHrJobPostDetail(context, widget.jobId);

    if (!mounted) return;

    if (success && provider.getSingleJobPostingListModel?.data?.data != null) {
      _job = provider.getSingleJobPostingListModel!.data!.data;
      _prefillData();
    } else {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: "Failed to load job details",
        backgroundColor: Colors.red,
      );
      // Navigator.pop(context); // Safe pop
    }

    setState(() => _isLoading = false);
  }

  void _prefillData() {
    if (_job == null) return;

    titleController.text = _job!.title ?? '';
    experienceController.text = _job!.experience ?? '';
    salaryController.text = _job!.salaryRange ?? '';
    openingsController.text = _job!.openings?.toString() ?? '1';

    selectedEmploymentType = _job!.employmentType;
    selectedJobType = _job!.jobType;

    // Prefill HTML editors
    Future.delayed(const Duration(milliseconds: 800), () {
      if (mounted) {
        descriptionController.setText(_job!.description ?? '');
        final skillsText = (_job!.skills ?? []).join(', ');
        skillsController.setText(skillsText);
      }
    });
  }

  Future<void> handleSubmit(HREmployeeApiProvider provider) async {
    if (!_formKey.currentState!.validate()) return;

    final String descriptionHtml = await descriptionController.getText();
    final String skillsHtml = await skillsController.getText();

    final List<String> skillsList = skillsHtml
        .replaceAll(RegExp(r'<[^>]*>'), '')
        .split(RegExp(r'[,;\n]'))
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();

    final Map<String, dynamic> requestData = {
      "title": titleController.text.trim(),
      "description": descriptionHtml,
      "jobType": selectedJobType,
      "skills": skillsList,
      "employmentType": selectedEmploymentType,
      "experience": experienceController.text.trim(),
      "salaryRange": salaryController.text.trim(),
      "openings": int.tryParse(openingsController.text.trim()) ?? 1,
      "status": "Open",
      "postedBy": null,
    };

    debugPrint("UPDATE BODY: $requestData");

    await provider.updateHrJobPost(context, widget.jobId, requestData);
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
        activityName: "Update Job",
        backgroundColor: AppColors.primary,
      ),
      body: SafeArea(
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                padding: const EdgeInsets.all(12.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildTextField(
                        "Job Title",
                        titleController,
                        isRequired: true,
                        prefixIcon: Icons.work,
                      ),
                      ResponsiveDropdown<String>(
                        value: selectedEmploymentType,
                        itemList: employmentTypesList,
                        onChanged: (v) =>
                            setState(() => selectedEmploymentType = v),
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
                      _buildTextField(
                        "Experience",
                        experienceController,
                        isRequired: true,
                        prefixIcon: Icons.timeline,
                      ),
                      _buildTextField(
                        "Salary Range",
                        salaryController,
                        isRequired: true,
                        prefixIcon: Icons.currency_rupee,
                      ),
                      _buildTextField(
                        "Openings",
                        openingsController,
                        isRequired: true,
                        prefixIcon: Icons.people,
                        keyboardType: TextInputType.number,
                      ),

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
                        callbacks: Callbacks(
                          onInit: () {
                            if (_job != null) {
                              descriptionController.setText(_job!.description ?? '');
                            }
                          },
                        ),
                        otherOptions: const OtherOptions(height: 250),
                      ),

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
                        callbacks: Callbacks(
                          onInit: () {
                            if (_job != null) {
                              final skillsText = (_job!.skills ?? []).join(', ');
                              skillsController.setText(skillsText);
                            }
                          },
                        ),
                        otherOptions: const OtherOptions(height: 150),
                      ),

                      const SizedBox(height: 20),

                      Consumer<HREmployeeApiProvider>(
                        builder: (context, provider, child) {
                          return Container(
                            width: double.infinity,
                            child: CustomButton(
                              color: AppColors.primary,
                              text: provider.isLoading
                                  ? 'Updating...'
                                  : "Update Job",
                              onPressed: provider.isLoading
                                  ? null
                                  : () {
                                      if (_formKey.currentState!.validate()) {
                                        handleSubmit(provider);
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
