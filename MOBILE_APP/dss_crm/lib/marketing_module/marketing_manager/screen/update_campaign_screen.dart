import 'package:dss_crm/marketing_module/marketing_manager/controller/marketing_manager_api_provider.dart';
import 'package:dss_crm/marketing_module/marketing_manager/marketing_get_all_compaign_list_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/default_common_app_bar.dart';
import '../../../utils/responsive_dropdown_utils.dart';
import '../../../utils/responsive_helper_utils.dart';

class UpdateCampaignFormScreen extends StatefulWidget {
  final Campaigns campaign;

  const UpdateCampaignFormScreen({Key? key, required this.campaign}) : super(key: key);

  @override
  State<UpdateCampaignFormScreen> createState() =>
      _UpdateCampaignFormScreenState();
}

class _UpdateCampaignFormScreenState extends State<UpdateCampaignFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _campaignIdController = TextEditingController();
  final _campaignNameController = TextEditingController();
  final _regionController = TextEditingController();
  final _demographicsController = TextEditingController();
  final _interestsController = TextEditingController();
  final _budgetController = TextEditingController();
  final _landingPageController = TextEditingController();

  String? _selectedType;
  String? _selectedPlatform;
  String? _selectedObjective;
  DateTime? _startDate;
  DateTime? _endDate;

  // Selected interests tracking
  Set<String> _selectedInterests = {};

  final List<String> _types = ['Print', 'Digital', 'Event'];
  final List<String> _platforms = [
    'Facebook',
    'Instagram',
    'Google Ads',
    'Whatsapp',
  ];
  final List<String> _objectives = [
    'Brand Awareness',
    'Lead Gen',
    'Sales',
    'Traffic',
    'Engagement',
  ];

  // Interest suggestions
  final List<String> _interestSuggestions = [
    'Technology',
    'Sports',
    'Fashion',
    'Travel',
    'Food',
    'Health',
    'Finance',
    'Education',
    'Music',
    'Entertainment',
    'Gaming',
    'Fitness',
  ];

  @override
  void initState() {
    super.initState();
    _populateFormData();
  }

  void _populateFormData() {
    // Populate text fields
    _campaignIdController.text = widget.campaign.campaignId ?? '';
    _campaignNameController.text = widget.campaign.campaignName ?? '';
    _budgetController.text = widget.campaign.budget?.toString() ?? '';
    _landingPageController.text = widget.campaign.landingPage ?? '';

    // Populate dropdowns
    _selectedType = widget.campaign.type;
    _selectedPlatform = widget.campaign.platform;
    _selectedObjective = widget.campaign.objective;

    // Populate target audience fields
    if (widget.campaign.targetAudience != null) {
      _regionController.text = widget.campaign.targetAudience!.region ?? '';
      _demographicsController.text = widget.campaign.targetAudience!.demographics ?? '';

      // Populate interests
      if (widget.campaign.targetAudience!.interests != null) {
        _selectedInterests = Set.from(widget.campaign.targetAudience!.interests!);
        _interestsController.text = _selectedInterests.join(', ');
      }
    }

    // Populate dates
    if (widget.campaign.startDate != null) {
      try {
        _startDate = DateTime.parse(widget.campaign.startDate!);
      } catch (e) {
        _startDate = null;
      }
    }

    if (widget.campaign.endDate != null) {
      try {
        _endDate = DateTime.parse(widget.campaign.endDate!);
      } catch (e) {
        _endDate = null;
      }
    }
  }

  @override
  void dispose() {
    _campaignIdController.dispose();
    _campaignNameController.dispose();
    _regionController.dispose();
    _demographicsController.dispose();
    _interestsController.dispose();
    _budgetController.dispose();
    _landingPageController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context, bool isStartDate) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: isStartDate
          ? (_startDate ?? DateTime.now())
          : (_endDate ?? DateTime.now()),
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
      builder: (context, child) {
        return Theme(
          data: ThemeData.light().copyWith(
            canvasColor: Colors.white,
            colorScheme: ColorScheme.light(
              primary: Colors.blue,
              onPrimary: Colors.white,
              surface: Colors.white,
              onSurface: Colors.black87,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        if (isStartDate) {
          _startDate = picked;
        } else {
          _endDate = picked;
        }
      });
    }
  }

  String _formatDate(DateTime? date) {
    if (date == null) return 'dd-mm-yyyy';
    return '${date.day.toString().padLeft(2, '0')}-${date.month.toString().padLeft(2, '0')}-${date.year}';
  }

  String _formatDateForApi(DateTime? date) {
    if (date == null) return '';
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  void _addInterest(String interest) {
    setState(() {
      if (_selectedInterests.contains(interest)) {
        _selectedInterests.remove(interest);
      } else {
        _selectedInterests.add(interest);
      }
      _interestsController.text = _selectedInterests.join(', ');
    });
  }

  void _removeInterestFromField(String interest) {
    setState(() {
      _selectedInterests.remove(interest);
      _interestsController.text = _selectedInterests.join(', ');
    });
  }

  void _submitForm(MarketingManagerApiProvider provider) {
    if (!(_formKey.currentState?.validate() ?? false)) {
      return;
    }

    if (_startDate != null && _endDate != null && _startDate!.isAfter(_endDate!)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Start Date cannot be after End Date')),
      );
      return;
    }

    final body = {
      "campaign_id": _campaignIdController.text.trim(),
      "campaignName": _campaignNameController.text.trim(),
      "type": _selectedType ?? "",
      "platform": _selectedPlatform ?? "",
      "objective": _selectedObjective ?? "",
      "targetAudience": {
        "region": _regionController.text.trim(),
        "demographics": _demographicsController.text.trim(),
        "interests": _interestsController.text
            .split(',')
            .map((e) => e.trim())
            .where((e) => e.isNotEmpty)
            .toList(),
      },
      "budget": int.tryParse(_budgetController.text.trim()) ?? 0,
      "landingPage": _landingPageController.text.trim(),
      "startDate": _formatDateForApi(_startDate),
      "endDate": _formatDateForApi(_endDate),
    };
    provider.updateCampaign(context, body, widget.campaign.sId ?? '');
    if (provider.updateCampaignModelResponse?.success == true) {
      if (mounted) {
        Navigator.pop(context, true);
      }
    }
  }

  String? _requiredValidator(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required';
    }
    return null;
  }

  String? _budgetValidator(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Budget is required';
    }
    if (int.tryParse(value.trim()) == null) {
      return 'Budget must be a valid number';
    }
    return null;
  }

  String? _linkValidator(String? value) {
    if (value != null && value.isNotEmpty) {
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        return 'Enter a valid URL (e.g., https://example.com)';
      }
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: DefaultCommonAppBar(
        activityName: "Update Campaign",
        backgroundColor: AppColors.primary,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildTextField(
                  label: 'Campaign ID',
                  controller: _campaignIdController,
                  hint: 'Enter campaign ID',
                  isRequired: true,
                  validator: (value) => _requiredValidator(value, 'Campaign ID'),
                ),
                _buildTextField(
                  label: 'Campaign Name',
                  controller: _campaignNameController,
                  hint: 'Enter campaign name',
                  isRequired: true,
                  validator: (value) => _requiredValidator(value, 'Campaign Name'),
                ),
                _buildDropdown(
                  label: 'Type',
                  value: _selectedType,
                  items: _types,
                  hint: 'Select Type',
                  isRequired: true,
                  onChanged: (value) {
                    setState(() {
                      _selectedType = value;
                      _formKey.currentState?.validate();
                    });
                  },
                ),
                _buildDropdown(
                  label: 'Platform',
                  value: _selectedPlatform,
                  items: _platforms,
                  hint: 'Select Platform',
                  isRequired: true,
                  onChanged: (value) {
                    setState(() {
                      _selectedPlatform = value;
                      _formKey.currentState?.validate();
                    });
                  },
                ),
                _buildDropdown(
                  label: 'Objective',
                  value: _selectedObjective,
                  items: _objectives,
                  hint: 'Select Objective',
                  isRequired: true,
                  onChanged: (value) {
                    setState(() {
                      _selectedObjective = value;
                      _formKey.currentState?.validate();
                    });
                  },
                ),
                _buildTextField(
                  label: 'Region',
                  controller: _regionController,
                  hint: 'Enter target region',
                  isRequired: true,
                  validator: (value) => _requiredValidator(value, 'Region'),
                ),
                _buildTextField(
                  label: 'Demographics',
                  controller: _demographicsController,
                  hint: 'Enter demographics',
                  isRequired: true,
                  validator: (value) => _requiredValidator(value, 'Demographics'),
                ),
                _buildTextField(
                  label: 'Interests',
                  controller: _interestsController,
                  hint: 'e.g. Technology, Sports',
                  isRequired: true,
                  validator: (value) => _requiredValidator(value, 'Interests'),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: _interestSuggestions.map((interest) {
                    bool isSelected = _selectedInterests.contains(interest);
                    return InkWell(
                      onTap: () => _addInterest(interest),
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? Colors.blue.shade50
                              : Colors.white,
                          border: Border.all(
                            color: isSelected ? Colors.blue : Colors.grey[300]!,
                            width: isSelected ? 1 : 0.5,
                          ),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              interest,
                              style: AppTextStyles.body2(
                                context,
                                overrideStyle: TextStyle(
                                  fontSize: ResponsiveHelper.fontSize(
                                    context,
                                    13,
                                  ),
                                  color: Colors.black87,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            InkWell(
                              onTap: () {
                                _removeInterestFromField(interest);
                              },
                              child: Icon(
                                Icons.cancel_outlined,
                                size: 16,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
                _buildTextField(
                  label: 'Budget',
                  controller: _budgetController,
                  hint: 'Enter budget',
                  isRequired: true,
                  keyboardType: TextInputType.number,
                  validator: _budgetValidator,
                ),
                _buildTextField(
                  label: 'Landing Page',
                  controller: _landingPageController,
                  hint: 'https://example.com',
                  isRequired: false,
                  validator: _linkValidator,
                ),
                SizedBox(height: 10),
                _buildDatePicker(
                  label: 'Start Date',
                  date: _startDate,
                  isRequired: true,
                  onTap: () => _selectDate(context, true),
                  validator: (date) => date == null ? 'Start Date is required' : null,
                ),
                SizedBox(height: 10),
                _buildDatePicker(
                  label: 'End Date',
                  date: _endDate,
                  isRequired: true,
                  onTap: () => _selectDate(context, false),
                  validator: (date) => date == null ? 'End Date is required' : null,
                ),
                SizedBox(height: 10),
                Consumer<MarketingManagerApiProvider>(
                  builder: (context, updateCampaignProvider, child) {
                    return Container(
                      width: double.infinity,
                      child: CustomButton(
                        color: AppColors.primary,
                        text: updateCampaignProvider.isLoading
                            ? 'Updating...'
                            : "Update Campaign",
                        onPressed: updateCampaignProvider.isLoading
                            ? null
                            : () {
                          if (_formKey.currentState!.validate()) {
                            _submitForm(updateCampaignProvider);
                          }
                        },
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String label,
    required TextEditingController controller,
    required String hint,
    required bool isRequired,
    TextInputType keyboardType = TextInputType.text,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CustomTextField(
          controller: controller,
          validator: validator,
          hintText: hint,
          title: label,
          keyboardType: keyboardType,
        ),
      ],
    );
  }

  Widget _buildDropdown({
    required String label,
    required String? value,
    required List<String> items,
    required String hint,
    required bool isRequired,
    required Function(String?) onChanged,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ResponsiveDropdown<String>(
          value: value,
          itemList: items,
          onChanged: onChanged,
          hint: hint,
          label: "${label}*",
        ),
      ],
    );
  }

  Widget _buildDatePicker({
    required String label,
    required DateTime? date,
    required bool isRequired,
    required VoidCallback onTap,
    required String? Function(DateTime?) validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RichText(
          text: TextSpan(
            children: [
              TextSpan(
                text: label,
                style: AppTextStyles.body1(
                  context,
                  overrideStyle: TextStyle(
                    fontSize: ResponsiveHelper.fontSize(context, 14),
                    color: Colors.black87,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              if (isRequired)
                TextSpan(
                  text: ' *',
                  style: TextStyle(
                    color: Colors.red,
                    fontSize: ResponsiveHelper.fontSize(context, 14),
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 8),
        InkWell(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border.all(color: Colors.grey[300]!),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _formatDate(date),
                  style: AppTextStyles.body2(
                    context,
                    overrideStyle: TextStyle(
                      fontSize: ResponsiveHelper.fontSize(context, 13),
                      color: date == null ? Colors.grey[400] : Colors.black87,
                    ),
                  ),
                ),
                Icon(Icons.calendar_month_outlined, size: 18, color: Colors.grey[600]),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
