import 'dart:io';
import 'package:dss_crm/admin/utils/location_hierarchy_utils.dart';
import 'package:dss_crm/hr_module/controller/hr_employee_api_provider.dart';
import 'package:dss_crm/hr_module/screen/employee/model/hr_employee_list_detail_model.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/custom_snack_bar.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/default_common_app_bar.dart';
import '../../../utils/permission_manager_utils.dart';
import '../../../utils/responsive_dropdown_utils.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../controller/hr_emp_doc_api_provider.dart';

class UpdateEmployeeScreen extends StatefulWidget {
  final String employeeId;

  const UpdateEmployeeScreen({Key? key, required this.employeeId})
      : super(key: key);

  @override
  State<UpdateEmployeeScreen> createState() => _UpdateEmployeeScreenState();
}

class _UpdateEmployeeScreenState extends State<UpdateEmployeeScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _formKey = GlobalKey<FormState>();

  final _locationKey = GlobalKey<LocationHierarchyDropdownsState>();
  String? localSelectedZoneId;
  String? localSelectedStateId;
  String? localSelectedCityId;
  String? localSelectedBranchId;
  String? localSelectedDepartmentId;
  String? localSelectedDesignationId;

  String? _probationUnit = "Month"; // Default Month
  File? _photoFile;
  final Map<String, File> _docFiles = {};

  // Tab list
  final List<Map<String, dynamic>> _tabs = [
    {"name": "Personal Information", "icon": Icons.person},
    {"name": "Address", "icon": Icons.location_on},
    {"name": "Documents", "icon": Icons.file_download_outlined},
    {"name": "Bank Details", "icon": Icons.account_balance},
    {"name": "Employment", "icon": Icons.work_history_outlined},
    {"name": "Review", "icon": Icons.rate_review},
  ];

  // Controllers
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController workEmailController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController altPhoneController = TextEditingController();
  final TextEditingController whatsappController = TextEditingController();
  final TextEditingController dobController = TextEditingController();
  final TextEditingController qualificationController = TextEditingController();
  final TextEditingController joiningDateController = TextEditingController();

  final TextEditingController currentAddressController = TextEditingController();
  final TextEditingController permanentAddressController = TextEditingController();
  final TextEditingController countryController = TextEditingController(text: "India");
  final TextEditingController stateController = TextEditingController();
  final TextEditingController cityController = TextEditingController();
  final TextEditingController pincodeController = TextEditingController();
  final TextEditingController emergencyNameController = TextEditingController();
  final TextEditingController emergencyPhoneController = TextEditingController();
  final TextEditingController emergencyRelationController = TextEditingController();

  final TextEditingController accountHolderController = TextEditingController();
  final TextEditingController accountNumberController = TextEditingController();
  final TextEditingController ifscController = TextEditingController();
  final TextEditingController bankNameController = TextEditingController();
  final TextEditingController branchController = TextEditingController();

  final TextEditingController probationPeriodController = TextEditingController();
  final TextEditingController allowancesController = TextEditingController();
  final TextEditingController basicController = TextEditingController();
  final TextEditingController ctcController = TextEditingController();
  final TextEditingController deductionsController = TextEditingController();
  final TextEditingController hraController = TextEditingController();
  final TextEditingController pfAccountNoController = TextEditingController();
  final TextEditingController uanController = TextEditingController();
  final TextEditingController esicNoController = TextEditingController();

  // Dropdowns
  String? selectedGender = "Male";
  String? selectedMaritalStatus = "Single";
  String? selectedBloodGroup;
  String? selectedEmployeeType = "Full-time";
  String? selectedWorkLocation = "Onsite";
  String? selectedAccountType = "Savings";
  String? _selectedDateForApi;
  String? _selectedJoiningDateForApi;

  final List<String> genderList = ['Male', 'Female', 'Other'];
  final List<String> maritalStatusList = ['Single', 'Married'];
  final List<String> bloodGroupList = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  final List<String> employeeTypeList = ['Full-time', 'Part-time', 'Contract', 'Intern'];
  final List<String> workLocationList = ['Onsite', 'Remote', 'Hybrid'];
  final List<String> accountTypeList = ['Savings', 'Current'];

  final Map<String, String?> _existingDocumentUrls = {}; // Keys: 'Aadhaar Card', etc.
  final Map<String, File?> _uploadedDocuments = {
    'Aadhaar Card': null,
    'PAN Card': null,
    'Bank Passbook': null,
    'High School Marksheet': null,
    'Graduation Marksheet': null,
    'Salary Slips': null,
  };

  File? _image;
  String? _existingPhotoUrl;
  bool _isAgreed = false;
  bool _isDataPrefilled = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    // Fix: Delay API call until after first frame
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _fetchEmployeeData();
    });
    // _fetchEmployeeData();
  }

  Future<void> _fetchEmployeeData() async {
    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    final success = await provider.getHREmployeeDetail(widget.employeeId);

    if (!mounted) return; // Prevent setState if widget disposed

    if (success && provider.employeeListDetailModel?.data != null) {
      final data = provider.employeeListDetailModel!.data!;
      _prefillEmployeeData(data);
    } else {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: "Failed to load employee data",
        backgroundColor: Colors.red,
      );
      Navigator.pop(context);
    }
  }

  void _prefillEmployeeData(Data data) {
    setState(() {
      // Personal Info
      _existingPhotoUrl = data.photo?.publicUrl;
      nameController.text = data.name ?? '';
      emailController.text = data.email ?? '';
      workEmailController.text = data.workEmail ?? '';
      phoneController.text = data.phone ?? '';
      altPhoneController.text = data.alternateNo ?? '';
      whatsappController.text = data.whatsapp ?? '';
      dobController.text = data.dob != null
          ? DateFormat('dd-MM-yyyy').format(DateTime.parse(data.dob!))
          : '';
      _selectedDateForApi = data.dob;
      selectedGender = data.gender;
      qualificationController.text = data.qualification ?? '';
      selectedMaritalStatus = data.maritalStatus;
      selectedBloodGroup = data.bloodGroup;

      joiningDateController.text = data.joiningDate != null
          ? DateFormat('dd-MM-yyyy').format(DateTime.parse(data.joiningDate!))
          : '';
      _selectedJoiningDateForApi = data.joiningDate;
      selectedEmployeeType = data.employeeType;
      selectedWorkLocation = data.workLocation;

      // Address
      currentAddressController.text = data.currentAddress ?? '';
      permanentAddressController.text = data.permanentAddress ?? '';
      countryController.text = data.country ?? 'India';
      if (data.stateId != null && data.stateId!.title != null && data.stateId!.title!.trim().isNotEmpty) {
        stateController.text = data.stateId!.title!;
      } else if (data.state != null && data.state!.trim().isNotEmpty) {
        stateController.text = data.state!;
      } else {
        stateController.text = '';
      }
      if (data.cityId != null && data.cityId!.title != null && data.cityId!.title!.trim().isNotEmpty) {
        cityController.text = data.cityId!.title!;
      } else if (data.city != null && data.city!.trim().isNotEmpty) {
        cityController.text = data.city!;
      } else {
        cityController.text = '';
      }
      emergencyNameController.text = data.emergencyContact?.name ?? '';
      emergencyPhoneController.text = data.emergencyContact?.phone ?? '';
      emergencyRelationController.text = data.emergencyContact?.relation ?? '';

      // Bank Details
      if (data.bankDetail != null) {
        accountHolderController.text = data.bankDetail!.accountHolderName ?? '';
        accountNumberController.text = data.bankDetail!.accountNumber?.toString() ?? '';
        ifscController.text = data.bankDetail!.ifscCode ?? '';
        bankNameController.text = data.bankDetail!.bankName ?? '';
        branchController.text = data.bankDetail!.branchName ?? '';
      }

      // Employment
      probationPeriodController.text = data.probationPeriod ?? '';
      pfAccountNoController.text = data.pfAccountNo ?? '';
      uanController.text = data.uan ?? '';
      esicNoController.text = data.esicNo ?? '';

      allowancesController.text = data.salary?.allowances?.toString() ?? '';
      basicController.text = data.salary?.basic?.toString() ?? '';
      ctcController.text = data.salary?.ctc?.toString() ?? '';
      deductionsController.text = data.salary?.deductions?.toString() ?? '';
      hraController.text = data.salary?.hra?.toString() ?? '';

      // Location Hierarchy
      localSelectedZoneId = data.zoneId?.sId;
      localSelectedStateId = data.stateId?.sId ?? data.state;
      localSelectedCityId = data.cityId?.sId ?? data.city;
      localSelectedBranchId = data.branchId?.sId;
      localSelectedDepartmentId = data.departmentId?.sId;
      localSelectedDesignationId = data.designationId?.sId;

      // Photo
      if (data.photo?.publicUrl != null) {
        // Optional: Download image if needed
      }

      // Documents
      if (data.documents != null && data.documents!.isNotEmpty) {
        for (var doc in data.documents!) {
          final key = _mapDocTypeToKey(doc.type);
          if (key != null && doc.publicUrl != null) {
            _existingDocumentUrls[key] = doc.publicUrl; // Now key matches UI
          }
        }
      }

      _isDataPrefilled = true;
    });
  }

  String? _mapDocTypeToKey(String? apiType) {
    if (apiType == null) return null;
    final lower = apiType.toLowerCase().trim();

    if (lower.contains('aadhaar') || lower.contains('adhar')) {
      return 'Aadhaar Card';
    }
    if (lower.contains('pan')) {
      return 'PAN Card';
    }
    if (lower.contains('passbook') || lower.contains('bank')) {
      return 'Bank Passbook';
    }
    if (lower.contains('high') && lower.contains('school')) {
      return 'High School Marksheet';
    }
    if (lower.contains('graduation') || lower.contains('degree')) {
      return 'Graduation Marksheet';
    }
    if (lower.contains('salary') && lower.contains('slip')) {
      return 'Salary Slips';
    }

    return null; // Ignore unknown types
  }

  // String? _mapDocTypeToKey(String? apiType) {
  //   if (apiType == null) return null;
  //   final lower = apiType.toLowerCase();
  //   if (lower.contains('pan')) return 'pan';
  //   if (lower.contains('aadhaar') || lower.contains('adhar')) return 'aadhaar';
  //   if (lower.contains('passbook') || lower.contains('bank')) return 'passbook';
  //   if (lower.contains('high') && lower.contains('school')) return 'highSchool';
  //   if (lower.contains('graduation') || lower.contains('degree')) return 'graduation';
  //   return null;
  // }

  // String? _mapDocTypeToKey(String? type) {
  //   switch (type) {
  //     case 'aadhaar':
  //       return 'Aadhaar Card';
  //     case 'pan':
  //       return 'PAN Card';
  //     case 'bank_passbook':
  //       return 'Bank Passbook';
  //     case 'high_school':
  //       return 'High School Marksheet';
  //     case 'graduation':
  //       return 'Graduation Marksheet';
  //     case 'salary_slips':
  //       return 'Salary Slips';
  //     default:
  //       return null;
  //   }
  // }

  @override
  void dispose() {
    _tabController.dispose();
    nameController.dispose();
    emailController.dispose();
    workEmailController.dispose();
    phoneController.dispose();
    altPhoneController.dispose();
    whatsappController.dispose();
    dobController.dispose();
    qualificationController.dispose();
    joiningDateController.dispose();
    currentAddressController.dispose();
    permanentAddressController.dispose();
    countryController.dispose();
    stateController.dispose();
    cityController.dispose();
    emergencyNameController.dispose();
    emergencyPhoneController.dispose();
    emergencyRelationController.dispose();
    accountHolderController.dispose();
    accountNumberController.dispose();
    ifscController.dispose();
    bankNameController.dispose();
    branchController.dispose();
    probationPeriodController.dispose();
    allowancesController.dispose();
    basicController.dispose();
    ctcController.dispose();
    deductionsController.dispose();
    hraController.dispose();
    pfAccountNoController.dispose();
    uanController.dispose();
    esicNoController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(
      BuildContext context,
      TextEditingController controller,
      Function(String) setApiDate,
      ) async {
    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1950),
      lastDate: DateTime(2100),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          canvasColor: Colors.white,
          colorScheme: ColorScheme.light(
            primary: AppColors.primary,
            onPrimary: Colors.white,
            onSurface: Colors.black,
          ),
        ),
        child: child!,
      ),
    );

    if (pickedDate != null) {
      setState(() {
        setApiDate(DateFormat('yyyy-MM-dd').format(pickedDate));
        controller.text = DateFormat('dd-MM-yyyy').format(pickedDate);
      });
    }
  }

  Future<void> _doPickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() => _image = File(pickedFile.path));
    }
  }

  Future<void> _pickFile(String docKey) async {
    final granted = await PermissionManager.requestPhotos(context);
    if (!granted) return;

    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    );

    if (result?.files.single.path != null) {
      setState(() {
        _uploadedDocuments[docKey] = File(result!.files.single.path!);
      });
    }
  }

  void _clearFile(String docKey) => setState(() => _uploadedDocuments[docKey] = null);

  bool _isImage(String? name) {
    if (name == null) return false;
    final l = name.toLowerCase();
    return l.endsWith('.jpg') || l.endsWith('.jpeg') || l.endsWith('.png');
  }

  // UPDATE PERSONAL INFO
  Future<void> _updatePersonalInfo() async {
    final Map<String, dynamic> personalData = {
      "name": nameController.text.trim(),
      "email": emailController.text.trim(),
      "workEmail": workEmailController.text.trim(),
      "phone": phoneController.text.trim(),
      "alternateNo": altPhoneController.text.trim(),
      "whatsapp": whatsappController.text.trim(),
      "dob": _selectedDateForApi,
      "gender": selectedGender,
      "qualification": qualificationController.text.trim(),
      "maritalStatus": selectedMaritalStatus,
      "bloodGroup": selectedBloodGroup,
      "joiningDate": _selectedJoiningDateForApi,
      "employeeType": selectedEmployeeType,
      "workLocation": selectedWorkLocation,
    };

    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    await provider.updateEmployee(
      employeId: widget.employeeId,
      requestBody: personalData,
      photoFile: _image,
      context: context,
    );

    CustomSnackbarHelper.customShowSnackbar(
      context: context,
      backgroundColor: Colors.green,
      message: "Personal info updated!",
    );
    _tabController.animateTo(1);
  }

  // UPDATE ADDRESS
  Future<void> _updateAddress() async {
    final Map<String, dynamic> addressData = {
      "currentAddress": currentAddressController.text.trim(),
      "permanentAddress": permanentAddressController.text.trim(),
      "country": countryController.text.trim(),
      "state": stateController.text.trim(),
      "city": cityController.text.trim(),
      "emergencyContact": {
        "name": emergencyNameController.text.trim(),
        "relation": emergencyRelationController.text.trim(),
        "phone": emergencyPhoneController.text.trim(),
      },
    };

    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    await provider.updateEmployee(
      employeId: widget.employeeId,
      requestBody: addressData,
      context: context,
    );

    CustomSnackbarHelper.customShowSnackbar(
      context: context,
      backgroundColor: Colors.green,
      message: "Address updated!",
    );
    _tabController.animateTo(2);
  }

  // UPLOAD DOCUMENTS
  Future<void> _updateDocuments() async {
    final selected = Map<String, File>.fromEntries(
      _uploadedDocuments.entries.where((e) => e.value != null).map((e) => MapEntry(e.key, e.value!)),
    );

    if (selected.isEmpty) {
      _tabController.animateTo(3);
      return;
    }

    final docProvider = Provider.of<HREmpDocumentUploadProvider>(context, listen: false);
    await docProvider.uploadEmployeeDocuments(
      documents: selected,
      empId: widget.employeeId,
      context: context,
    );

    CustomSnackbarHelper.customShowSnackbar(
      context: context,
      backgroundColor: Colors.green,
      message: "Documents updated!",
    );
    _tabController.animateTo(3);
  }

  // UPDATE BANK DETAILS
  Future<void> _updateBankDetails() async {
    final Map<String, dynamic> bankData = {
      "bankDetail": {
        "accountHolderName": accountHolderController.text.trim(),
        "accountNumber": accountNumberController.text.trim(),
        "ifscCode": ifscController.text.trim(),
        "bankName": bankNameController.text.trim(),
        "branchName": branchController.text.trim(),
      }
    };

    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    await provider.updateEmployee(
      employeId: widget.employeeId,
      requestBody: bankData,
      context: context,
    );

    CustomSnackbarHelper.customShowSnackbar(
      context: context,
      backgroundColor: Colors.green,
      message: "Bank details updated!",
    );
    _tabController.animateTo(4);
  }

  // UPDATE EMPLOYMENT
  Future<void> _updateEmployment() async {
    // Validate probation period
    if (probationPeriodController.text.trim().isEmpty) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        backgroundColor: Colors.red,
        message: "Please enter probation period",
      );
      return;
    }

    if (_probationUnit == null) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        backgroundColor: Colors.red,
        message: "Please select Year or Month",
      );
      return;
    }

    final int? probationNumber = int.tryParse(probationPeriodController.text.trim());
    final String probationText = probationNumber != null && probationNumber > 0
        ? "$probationNumber $_probationUnit${probationNumber == 1 ? '' : 's'}"
        : "";
    final Map<String, dynamic> employmentData = {
      "esicNo": esicNoController.text.trim(),
      "pfAccountNo": pfAccountNoController.text.trim(),
      // Probation Period - Final concatenated value
      if (probationText.isNotEmpty) "probationPeriod": probationText,

      // "probationPeriod": probationPeriodController.text.trim(),
      "uan": uanController.text.trim(),
      "salary": {
        "allowances": allowancesController.text.trim(),
        "basic": basicController.text.trim(),
        "ctc": ctcController.text.trim(),
        "deductions": deductionsController.text.trim(),
        "hra": hraController.text.trim(),
      },
      "zoneId": localSelectedZoneId,
      "stateId": localSelectedStateId,
      "cityId": localSelectedCityId,
      "branchId": localSelectedBranchId,
      "departmentId": localSelectedDepartmentId,
      "designationId": localSelectedDesignationId,
    };

    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    await provider.updateEmployee(
      employeId: widget.employeeId,
      requestBody: employmentData,
      context: context,
    );

    CustomSnackbarHelper.customShowSnackbar(
      context: context,
      backgroundColor: Colors.green,
      message: "Employment details updated!",
    );
    _tabController.animateTo(5);
  }

  // FINAL SUBMIT
  Future<void> handleFinalSubmit() async {
    CustomSnackbarHelper.customShowSnackbar(
      context: context,
      backgroundColor: Colors.green,
      message: "Employee updated successfully!",
    );
    Navigator.pop(context, true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.lightBgColor,
      appBar: const DefaultCommonAppBar(
        activityName: "Update Employee",
        backgroundColor: AppColors.primary,
      ),
      body: Column(
        children: [
          Container(
            color: AppColors.primary,
            child: TabBar(
              controller: _tabController,
              isScrollable: true,
              tabAlignment: TabAlignment.start,
              labelColor: AppColors.whiteColor,
              unselectedLabelColor: AppColors.whiteColor.withOpacity(0.7),
              indicatorColor: AppColors.whiteColor,
              indicatorWeight: 4.0,
              labelStyle: AppTextStyles.heading1(
                context,
                overrideStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
              ),
              tabs: _tabs
                  .map((tab) => Tab(text: tab["name"], icon: Icon(tab["icon"], size:  ResponsiveHelper.iconSize(context,18))))
                  .toList(),
            ),
          ),
          Expanded(
            child: Form(
              key: _formKey,
              child: TabBarView(
                controller: _tabController,
                physics: const NeverScrollableScrollPhysics(),
                children: [
                  _buildPersonalInfoTab(),
                  _buildAddressTab(),
                  _buildDocumentsTab(),
                  _buildBankTab(),
                  _buildEmploymentTab(),
                  _buildReviewTab(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // === UI METHODS (Same as Add Screen) ===

  Widget _buildPersonalInfoTab() {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
            child: Column(
              children: [
                _buildPhotoUploadSection(),
                ResponsiveHelper.sizedBoxHeight(context,  20),
                _buildSectionCard(
                  title: "Personal Information",
                  children: [
                    _buildTextField("Name", nameController, isRequired: true, prefixIcon: Icons.person, validationType: ValidationType.name),
                    _buildTextField("Personal Email", emailController, isRequired: true, prefixIcon: Icons.email, keyboardType: TextInputType.emailAddress, validationType: ValidationType.email),
                    _buildTextField("Work Email", workEmailController, prefixIcon: Icons.email_outlined, keyboardType: TextInputType.emailAddress, validationType: ValidationType.email),
                    _buildTextField("Phone", phoneController, isRequired: true, prefixIcon: Icons.phone, keyboardType: TextInputType.phone, maxLength: 10, validationType: ValidationType.phone),
                    _buildTextField("Alternate No", altPhoneController, prefixIcon: Icons.phone_android, keyboardType: TextInputType.phone, maxLength: 10, validationType: ValidationType.phone),
                    _buildTextField("WhatsApp", whatsappController, prefixIcon: Icons.phone_android, keyboardType: TextInputType.phone, maxLength: 10, validationType: ValidationType.phone),
                    GestureDetector(
                      onTap: () => _selectDate(context, dobController, (date) => _selectedDateForApi = date),
                      child: AbsorbPointer(
                        child: CustomTextField(
                          title: "Date of Birth",
                          hintText: "Select Date of Birth",
                          controller: dobController,
                          prefixIcon: Icons.calendar_today,
                          validator: (value) => value?.isEmpty == true ? 'Please select Date of Birth' : null,
                        ),
                      ),
                    ),
                    ResponsiveDropdown<String>(value: selectedGender, itemList: genderList, onChanged: (v) => setState(() => selectedGender = v), hint: 'Select Gender', label: 'Gender *'),
                    _buildTextField("Qualification", qualificationController, prefixIcon: Icons.school, validationType: ValidationType.name),
                    ResponsiveDropdown<String>(value: selectedMaritalStatus, itemList: maritalStatusList, onChanged: (v) => setState(() => selectedMaritalStatus = v), hint: 'Select Marital Status', label: 'Marital Status'),
                    ResponsiveDropdown<String>(value: selectedBloodGroup, itemList: bloodGroupList, onChanged: (v) => setState(() => selectedBloodGroup = v), hint: 'Select Blood Group', label: 'Blood Group'),
                    GestureDetector(
                      onTap: () => _selectDate(context, joiningDateController, (date) => _selectedJoiningDateForApi = date),
                      child: AbsorbPointer(
                        child: CustomTextField(
                          title: "Joining Date",
                          hintText: "Select Joining Date",
                          controller: joiningDateController,
                          prefixIcon: Icons.date_range,
                          validator: (value) => value?.isEmpty == true ? 'Please select Joining Date' : null,
                        ),
                      ),
                    ),
                    ResponsiveDropdown<String>(value: selectedEmployeeType, itemList: employeeTypeList, onChanged: (v) => setState(() => selectedEmployeeType = v), hint: 'Select Employee Type', label: 'Employee Type *'),
                    ResponsiveDropdown<String>(value: selectedWorkLocation, itemList: workLocationList, onChanged: (v) => setState(() => selectedWorkLocation = v), hint: 'Select Work Location', label: 'Work Location *'),
                  ],
                ),
              ],
            ),
          ),
        ),
        _buildFixedBottomButton("Save & Next", _updatePersonalInfo),
      ],
    );
  }

  // Reuse all other UI methods from AddEmployeeScreen (Address, Documents, Bank, Employment, Review)
  // Just copy-paste them here — they are 100% same

  Widget _buildAddressTab() => Column(
    children: [
      Expanded(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
          child: _buildSectionCard(
            title: "Address Details",
            children: [
              _buildTextField("Current Address", currentAddressController, lines: 3, validationType: ValidationType.name),
              _buildTextField("Permanent Address", permanentAddressController, lines: 3, validationType: ValidationType.name),
              _buildTextField("Country", countryController, prefixIcon: Icons.location_city, validationType: ValidationType.name),
              _buildTextField("State", stateController, prefixIcon: Icons.location_city, validationType: ValidationType.name),
              _buildTextField("City", cityController, prefixIcon: Icons.location_on, validationType: ValidationType.name),
              _buildTextField("Emergency Name", emergencyNameController, prefixIcon: Icons.supervised_user_circle, validationType: ValidationType.name),
              _buildTextField("Emergency Phone", emergencyPhoneController, prefixIcon: Icons.phone_android, keyboardType: TextInputType.phone, maxLength: 10, validationType: ValidationType.phone),
              _buildTextField("Emergency Relation", emergencyRelationController, prefixIcon: Icons.family_restroom, validationType: ValidationType.name),
            ],
          ),
        ),
      ),
      _buildFixedBottomButton("Save & Next", _updateAddress),
    ],
  );

  Widget _buildDocumentsTab() => Column(
    children: [
      Expanded(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
          child: Column(
            children: _uploadedDocuments.keys.map((docKey) {
              final File? newDoc = _uploadedDocuments[docKey];
              final String? existingUrl = _existingDocumentUrls[docKey];
              String? fileName = newDoc?.path.split('/').last;

              // Determine if we have any document (new or existing)
              final hasDocument = newDoc != null || existingUrl != null;

              return Card(
                margin: const EdgeInsets.symmetric(vertical: 10),
                elevation: 0,
                color: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                child: Padding(
                  padding:ResponsiveHelper.paddingAll(context,16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              docKey,
                              style: AppTextStyles.heading1(
                                context,
                                overrideStyle: TextStyle(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: ResponsiveHelper.fontSize(context, 16),
                                ),
                              ),
                            ),
                          ),
                          // ✅ Show status badge
                          if (hasDocument)
                            Container(
                              padding: ResponsiveHelper.paddingSymmetric(context,horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: newDoc != null ? Colors.orange.shade100 : Colors.green.shade100,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                newDoc != null ? 'New Upload' : 'Uploaded',
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: newDoc != null ? Colors.orange.shade700 : Colors.green.shade700,
                                ),
                              ),
                            ),
                        ],
                      ),
                      ResponsiveHelper.sizedBoxHeight(context,  15),

                      // ✅ Document Preview Container
                      Container(
                        width: double.infinity,
                        height: hasDocument ? 200 : 100,
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: _buildDocumentPreview(newDoc, existingUrl, fileName),
                      ),

                      ResponsiveHelper.sizedBoxHeight(context,  15),

                      // ✅ Action Buttons
                      Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => _pickFile(docKey),
                              child: Container(
                                padding:ResponsiveHelper.paddingSymmetric(context,horizontal: 10, vertical: 8),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: AppColors.primary),
                                ),
                                child: Text(
                                  hasDocument ? 'Change File' : 'Select File',
                                  textAlign: TextAlign.center,
                                  style: AppTextStyles.body2(context).copyWith(
                                    color: AppColors.primary,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          ResponsiveHelper.sizedBoxWidth(context,  10),
                          Expanded(
                            child: GestureDetector(
                              onTap: hasDocument
                                  ? () {
                                setState(() {
                                  _uploadedDocuments[docKey] = null;
                                  _existingDocumentUrls[docKey] = null;
                                });
                              }
                                  : null,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(8),
                                  color: hasDocument ? Colors.red : Colors.grey,
                                ),
                                child: Text(
                                  'Clear',
                                  textAlign: TextAlign.center,
                                  style: AppTextStyles.body2(context)?.copyWith(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ),
      _buildFixedBottomButton("Save & Next", _updateDocuments),
    ],
  );

// ✅ NEW HELPER METHOD - Build Document Preview
  Widget _buildDocumentPreview(File? newDoc, String? existingUrl, String? fileName) {
    // Priority: Show new document first, then existing
    if (newDoc != null) {
      // New document uploaded
      if (_isImage(fileName)) {
        return ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Image.file(newDoc, fit: BoxFit.contain),
        );
      } else {
        return Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.description, size: ResponsiveHelper.iconSize(context,40), color: Colors.grey[600]),
            ResponsiveHelper.sizedBoxHeight(context, 8),
            Padding(
              padding: ResponsiveHelper.paddingSymmetric(context, horizontal: 8),
              child: Text(
                fileName!,
                textAlign: TextAlign.center,
                style: AppTextStyles.body1(
                  context,
                  overrideStyle: const TextStyle(fontWeight: FontWeight.bold),
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        );
      }
    } else if (existingUrl != null) {
      // Existing document from API
      if (existingUrl.toLowerCase().endsWith('.pdf')) {
        return Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.picture_as_pdf, size: ResponsiveHelper.iconSize(context,40), color: Colors.red[400]),
            ResponsiveHelper.sizedBoxHeight(context,  8),
            Text(
              'PDF Document',
              style: AppTextStyles.body1(context),
            ),
            ResponsiveHelper.sizedBoxHeight(context, 4),
            Text(
              'Already Uploaded',
              style: AppTextStyles.body2(context)?.copyWith(
                color: Colors.green,
                fontSize: 10,
              ),
            ),
          ],
        );
      } else {
        // Assume it's an image
        return ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Image.network(
            existingUrl,
            fit: BoxFit.contain,
            loadingBuilder: (context, child, loadingProgress) {
              if (loadingProgress == null) return child;
              return Center(
                child: CircularProgressIndicator(
                  value: loadingProgress.expectedTotalBytes != null
                      ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
                      : null,
                ),
              );
            },
            errorBuilder: (context, error, stackTrace) {
              return Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.broken_image, size: ResponsiveHelper.iconSize(context, 40), color: Colors.grey[600]),
                  ResponsiveHelper.sizedBoxHeight(context,  8),
                  Text('Failed to load', style: AppTextStyles.body2(context)),
                ],
              );
            },
          ),
        );
      }
    } else {
      // No document
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.cloud_upload, size: ResponsiveHelper.iconSize(context, 40), color: Colors.grey[600]),
          ResponsiveHelper.sizedBoxHeight(context,  8),
          Text('No file selected', style: AppTextStyles.body2(context)),
        ],
      );
    }
  }

  Widget _buildBankTab() => Column(
    children: [
      Expanded(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
          child: _buildSectionCard(
            title: "Bank Details",
            children: [
              _buildTextField("Account Holder Name", accountHolderController, prefixIcon: Icons.person, validationType: ValidationType.name),
              _buildTextField("Account Number", accountNumberController, prefixIcon: Icons.account_balance, keyboardType: TextInputType.number, validationType: ValidationType.phone),
              _buildTextField("IFSC Code", ifscController, prefixIcon: Icons.code, validationType: ValidationType.name),
              _buildTextField("Bank Name", bankNameController, prefixIcon: Icons.account_balance_wallet, validationType: ValidationType.name),
              _buildTextField("Branch", branchController, prefixIcon: Icons.business, validationType: ValidationType.name),
              ResponsiveDropdown<String>(value: selectedAccountType, itemList: accountTypeList, onChanged: (v) => setState(() => selectedAccountType = v), hint: 'Select Account Type', label: 'Account Type'),
            ],
          ),
        ),
      ),
      _buildFixedBottomButton("Save & Next", _updateBankDetails),
    ],
  );

  Widget _buildEmploymentTab() =>
      Column(

        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
              child: _buildSectionCard(
                title: "Employment Details",
                children: [
                  // Probation Period with ResponsiveDropdown (Year/Month)
                  // Replace purana probation period field with this
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    child: Row(
                      children: [
                        // Number Field
                        Expanded(
                          flex: 3,
                          child: CustomTextField(
                            title: "Probation Period",
                            hintText: "Enter number",
                            controller: probationPeriodController,
                            prefixIcon: Icons.work,
                            keyboardType: TextInputType.number,
                            maxLength: 2,
                            validator: (value) {
                              if (value == null || value.trim().isEmpty) {
                                return 'Enter probation period';
                              }
                              final num = int.tryParse(value);
                              if (num == null || num <= 0) {
                                return 'Enter valid number';
                              }
                              return null;
                            },
                          ),
                        ),
                        const SizedBox(width: 12),

                        // Unit Dropdown (Year/Month)
                        Expanded(
                          flex: 2,
                          child: ResponsiveDropdown<String>(
                            value: _probationUnit,
                            itemList: const ["Year", "Month"],
                            onChanged: (value) {
                              setState(() {
                                _probationUnit = value;
                              });
                            },
                            hint: 'Select',
                            label: '',
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
                  // _buildTextField("Probation Period", probationPeriodController, prefixIcon: Icons.work, keyboardType: TextInputType.text, validationType: ValidationType.name),
                  // ResponsiveDropdown<String>(value: selectedDepartment, itemList: departmentList, onChanged: (v) => setState(() => selectedDepartment = v), hint: 'Select Department', label: 'Department'),
                  _buildTextField("CTC", ctcController, prefixIcon: Icons.badge, keyboardType: TextInputType.text,  validationType: ValidationType.name),
                  _buildTextField("Basic", basicController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),
                  _buildTextField("HRA", hraController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),
                  _buildTextField("Allowances", allowancesController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),
                  _buildTextField("Deductions", deductionsController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),
                  _buildTextField("PF Account", pfAccountNoController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),
                  _buildTextField("UAN", uanController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),
                  _buildTextField("ESIC No", esicNoController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),

                  ResponsiveHelper.sizedBoxHeight(context, 30),
                  Text("Designation Details", style: AppTextStyles.heading2(context).copyWith(color: AppColors.primary, fontSize: 15, fontWeight: FontWeight.bold)),


                  ResponsiveHelper.sizedBoxHeight(context, 14),

                  LocationHierarchyDropdowns(
                    key: _locationKey,
                    initialZoneId: localSelectedZoneId,
                    initialStateId: localSelectedStateId,
                    initialCityId: localSelectedCityId,
                    initialBranchId: localSelectedBranchId,
                    initialDepartmentId: localSelectedDepartmentId,
                    initialDesignationId: localSelectedDesignationId,
                    showUpTo: LocationLevel.designation,
                    enableValidation: false,
                    onZoneChanged: (value) {
                      localSelectedZoneId = value;
                    },
                    onStateChanged: (value) {
                      localSelectedStateId = value;
                    },
                    onCityChanged: (value) {
                      localSelectedCityId = value;
                    },
                    onBranchChanged: (value) {
                      localSelectedBranchId = value;
                    },
                    onDepartmentChanged: (value) {
                      localSelectedDepartmentId = value;
                    },
                    designationValidator: (value) {
                      localSelectedDesignationId = value;
                    },
                  ),

                ],
              ),
            ),
          ),
          _buildFixedBottomButton("Save & Next", _updateEmployment),
        ],
      );

  Widget _buildReviewTab() => Column(
    children: [
      Expanded(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text("Review Employee Information", style: AppTextStyles.heading1(context).copyWith(color: AppColors.primary, fontSize: 18)),
              ResponsiveHelper.sizedBoxHeight(context,  20),
              _buildSectionCard(title: "Personal Information", children: [
                _buildReviewField("Name", nameController.text),
                _buildReviewField("Email", emailController.text),
                _buildReviewField("Phone", phoneController.text),
                _buildReviewField("Gender", selectedGender ?? '-'),
                _buildReviewField("DOB", dobController.text),
                _buildReviewField("Qualification", qualificationController.text),
              ]),
              ResponsiveHelper.sizedBoxHeight(context,  16),
              _buildSectionCard(title: "Address", children: [
                _buildReviewField("Address", currentAddressController.text),
                _buildReviewField("City", cityController.text),
                _buildReviewField("State", stateController.text),
                _buildReviewField("Emergency Contact Name", emergencyNameController.text),
                _buildReviewField("Emergency Phone ", emergencyPhoneController.text),
                _buildReviewField("Emergency Relation", emergencyRelationController.text),
              ]),
              ResponsiveHelper.sizedBoxHeight(context, 16),
              _buildSectionCard(title: "Bank Details", children: [
                _buildReviewField("Account Holder", accountHolderController.text),
                _buildReviewField("Account Number", accountNumberController.text),
                _buildReviewField("IFSC Code", ifscController.text),
                _buildReviewField("Bank Name", bankNameController.text),
              ]),
              ResponsiveHelper.sizedBoxHeight(context,  16),
              _buildSectionCard(title: "Employment", children: [
                _buildReviewField("Department", localSelectedDepartmentId ?? '-'),
                _buildReviewField("Designation", localSelectedDesignationId ?? '-'),
                _buildReviewField("Employee Type", selectedEmployeeType ?? '-'),
                _buildReviewField("Work Location", selectedWorkLocation ?? '-'),
                // _buildReviewField("Salary", salaryController.text),
              ]),
              ResponsiveHelper.sizedBoxHeight(context, 20),
              Row(
                children: [
                  Checkbox(value: _isAgreed, onChanged: (v) => setState(() => _isAgreed = v ?? false), activeColor: AppColors.primary),
                  Expanded(
                    child: RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(text: "I agree to the ", style: AppTextStyles.body1(context).copyWith(fontSize: 12)),
                          TextSpan(text: "Terms & Conditions & Privacy Policy", style: AppTextStyles.body1(context).copyWith(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
      _buildFixedBottomButton("Create Employee", handleFinalSubmit),
    ],
  );

  // Widget _buildPhotoUploadSection() => GestureDetector(
  //   onTap: () async {
  //     bool granted = await PermissionManager.requestPhotosPermission(context);
  //     if (granted) _doPickImage();
  //   },
  //   child: Center(
  //     child: Column(
  //       children: [
  //         Container(
  //           width: 100,
  //           height: 100,
  //           decoration: BoxDecoration(color: AppColors.endingGreyColor, shape: BoxShape.circle, border: Border.all(color: AppColors.primary, width: 3)),
  //           child: _image == null
  //               ? ClipOval(child: Icon(Icons.person, size: 50, color: AppColors.primary))
  //               : ClipOval(child: Image.file(_image!, fit: BoxFit.cover)),
  //         ),
  //         const SizedBox(height: 8),
  //         Container(
  //           padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
  //           decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(20)),
  //           child: Text("Upload Photo", style: AppTextStyles.body2(context)?.copyWith(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
  //         ),
  //       ],
  //     ),
  //   ),
  // );

  // Widget _buildSectionCard({required String title, required List<Widget> children}) => Container(
  //   width: double.infinity,
  //   padding: const EdgeInsets.all(16),
  //   decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 6, offset: Offset(0, 2))]),
  //   child: Column(
  //     crossAxisAlignment: CrossAxisAlignment.start,
  //     children: [
  //       Text(title, style: AppTextStyles.heading2(context).copyWith(color: AppColors.primary, fontSize: 15, fontWeight: FontWeight.bold)),
  //       const SizedBox(height: 12),
  //       ...children,
  //     ],
  //   ),
  // );

  // Widget _buildReviewField(String label, String value) => Padding(
  //   padding: const EdgeInsets.symmetric(vertical: 6),
  //   child: Row(
  //     crossAxisAlignment: CrossAxisAlignment.start,
  //     children: [
  //       Expanded(flex: 2, child: Text("$label:", style: AppTextStyles.body1(context).copyWith(fontWeight: FontWeight.bold))),
  //       Expanded(flex: 3, child: Text(value.isEmpty ? '-' : value, style: AppTextStyles.body2(context))),
  //     ],
  //   ),
  // );

  Widget _buildFixedBottomButton(String text, VoidCallback onPressed) => Container(
    padding: ResponsiveHelper.paddingAll(context,16),
    decoration: BoxDecoration(
      color: Colors.white,
      boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: const Offset(0, -2))],
    ),
    child: Row(
      children: [
        if (_tabController.index > 0)
          Expanded(
            child: CustomButton(
              text: "Back",
              color: Colors.grey,
              onPressed: () => _tabController.animateTo(_tabController.index - 1),
            ),
          ),
        if (_tabController.index > 0) const SizedBox(width: 10),
        Expanded(
          flex: 2,
          child: CustomButton(text: text, color: AppColors.primary, onPressed: onPressed),
        ),
      ],
    ),
  );

  Widget _buildTextField(
      String title,
      TextEditingController controller, {
        int? lines,
        int? maxLength,
        IconData? prefixIcon,
        TextInputType? keyboardType,
        bool isRequired = false,
        ValidationType? validationType,
      }) =>
      Padding(
        padding: ResponsiveHelper.paddingSymmetric(context,vertical: 0),
        child: CustomTextField(
          title: title,
          hintText: "Enter $title",
          controller: controller,
          prefixIcon: prefixIcon,
          maxLength: maxLength,
          maxLines: lines ?? 1,
          keyboardType: keyboardType ?? TextInputType.text,
          validationType: validationType ?? ValidationType.name,
        ),
      );

  Widget _buildPhotoUploadSection() => GestureDetector(
    onTap: () async {
      bool granted = await PermissionManager.requestPhotos(context);
      if (granted) _doPickImage();
    },
    child: Center(
      child: Column(
        children: [
          Container(
            width: ResponsiveHelper.containerWidth(context, 100),
            height: ResponsiveHelper.containerWidth(context, 100),
            decoration: BoxDecoration(
              color: AppColors.endingGreyColor,
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.primary, width: 1),
            ),
            child: ClipOval(
              child: _image != null
                  ? Image.file(_image!, fit: BoxFit.cover)
                  : (_existingPhotoUrl != null
                  ? Image.network(
                _existingPhotoUrl!,
                fit: BoxFit.cover,
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child;
                  return Center(
                    child: CircularProgressIndicator(
                      value: loadingProgress.expectedTotalBytes != null
                          ? loadingProgress.cumulativeBytesLoaded /
                          loadingProgress.expectedTotalBytes!
                          : null,
                    ),
                  );
                },
                errorBuilder: (context, error, stackTrace) {
                  return Icon(Icons.person, size: ResponsiveHelper.iconSize(context, 50), color: AppColors.primary);
                },
              )
                  : Icon(Icons.person, size: ResponsiveHelper.iconSize(context, 50), color: AppColors.primary)),
            ),
          ),
         ResponsiveHelper.sizedBoxHeight(context, 8),
          Container(
            padding: ResponsiveHelper.paddingSymmetric(context,horizontal: 20, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              _image != null || _existingPhotoUrl != null ? "Change Photo" : "Upload Photo",
              style: AppTextStyles.body2(context).copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 12,
              ),
            ),
          ),
        ],
      ),
    ),
  );

  Widget _buildSectionCard({required String title, required List<Widget> children}) => Container(
    width: double.infinity,
    padding: ResponsiveHelper.paddingAll(context,16),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 6, offset: const Offset(0, 2))],
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: AppTextStyles.heading2(context).copyWith(color: AppColors.primary, fontSize: 15, fontWeight: FontWeight.bold)),
         ResponsiveHelper.sizedBoxHeight(context, 12),
        ...children,
      ],
    ),
  );

  Widget _buildReviewField(String label, String value) => Padding(
    padding: ResponsiveHelper.paddingSymmetric(context,vertical: 6),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(flex: 2, child: Text("$label:", style: AppTextStyles.body1(context).copyWith(fontSize: 12,  fontWeight: FontWeight.bold))),
        Expanded(flex: 3, child: Text(value.isEmpty ? '-' : value, style: AppTextStyles.body2(context).copyWith(fontSize: 12,))),
      ],
    ),
  );
}