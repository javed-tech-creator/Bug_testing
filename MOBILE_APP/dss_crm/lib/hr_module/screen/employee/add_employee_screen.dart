import 'dart:io';
import 'package:dio/dio.dart';
import 'package:dss_crm/admin/utils/location_hierarchy_utils.dart';
import 'package:dss_crm/hr_module/controller/hr_employee_api_provider.dart';
import 'package:dss_crm/hr_module/screen/candidate/model/candidate_list_model.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/custom_snack_bar.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/default_common_app_bar.dart';
import '../../../utils/form_validations_utils.dart';
import '../../../utils/permission_manager_utils.dart';
import '../../../utils/responsive_dropdown_utils.dart';
import '../../../utils/responsive_helper_utils.dart';
import '../../controller/hr_emp_doc_api_provider.dart';

class AddEmployeeScreen extends StatefulWidget {
  const AddEmployeeScreen({Key? key}) : super(key: key);

  @override
  State<AddEmployeeScreen> createState() => _AddEmployeeScreenState();
}

class _AddEmployeeScreenState extends State<AddEmployeeScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _formKey = GlobalKey<FormState>();

  String? _selectedCandidateId;
  List<Data> _candidateList = [];
  bool _candidateLoading = true;

  String? get _employeeId => Provider.of<HREmployeeApiProvider>(context, listen: false).createdEmployeeId;

  final _locationKey = GlobalKey<LocationHierarchyDropdownsState>();
  String? localSelectedZoneId;
  String? localSelectedStateId;
  String? localSelectedCityId;
  String? localSelectedBranchId;
  String? localSelectedDepartmentId;
  String? localSelectedDesignationId;
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
  final TextEditingController candidateController = TextEditingController();
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


  final TextEditingController experienceController = TextEditingController();
  final TextEditingController roleController = TextEditingController(text: "employee");
  final TextEditingController designationController = TextEditingController();
  final TextEditingController salaryController = TextEditingController();
  final TextEditingController esicNoController = TextEditingController();
  final TextEditingController pfAccountNoController = TextEditingController();
  final TextEditingController probationPeriodController = TextEditingController();
  final TextEditingController uanController = TextEditingController();
  final TextEditingController allowancesController = TextEditingController();
  final TextEditingController basicController = TextEditingController();
  final TextEditingController ctcController = TextEditingController();
  final TextEditingController deductionsController = TextEditingController();
  final TextEditingController hraController = TextEditingController();

  // Dropdowns
  String? selectedGender = "Male";
  String? selectedMaritalStatus = "Single";
  String? selectedBloodGroup;
  String? selectedEmployeeType = "Full-time";
  String? selectedWorkLocation = "Onsite";
  String? selectedDepartment;
  String? selectedAccountType = "Savings";
  String? _selectedDateForApi;
  String? _selectedJoiningDateForApi;

  final List<String> genderList = ['Male', 'Female', 'Other'];
  final List<String> maritalStatusList = ['Single', 'Married'];
  final List<String> bloodGroupList = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  final List<String> employeeTypeList = ['Full-time', 'Part-time', 'Contract', 'Intern'];
  final List<String> workLocationList = ['Onsite', 'Remote', 'Hybrid'];
  final List<String> departmentList = ['HR', 'Finance', 'IT', 'Marketing', 'Sales'];
  final List<String> accountTypeList = ['Savings', 'Current'];

  // Documents
  final Map<String, File?> _uploadedDocuments = {
    'Aadhaar Card': null,
    'PAN Card': null,
    'Bank Passbook': null,
    'High School Marksheet': null,
    'Graduation Marksheet': null,
    'Salary Slips': null,
  };

  File? _image;
  bool _isAgreed = false;
  bool _isDataPrefilled = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    _loadCandidates();
  }

  Future<void> _loadCandidates() async {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<HREmployeeApiProvider>(context, listen: false)
          .getAllHRHiredCandidatesList(context)
          .then((_) {
        final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
        setState(() {
          _candidateLoading = false;
          if (provider.getAllCandidateListModel?.success == true &&
              provider.getAllCandidateListModel?.data?.data != null) {
            _candidateList = provider.getAllCandidateListModel!.data!.data!;
          }
        });
      });
    });
  }

  Future<void> _prefillEmployeeData() async {
    if (_employeeId == null || _isDataPrefilled) return;

    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    final success = await provider.getHREmployeeDetail(_employeeId!);

    if (success && provider.employeeListDetailModel != null) {
      final data = provider.employeeListDetailModel!.data!;

      setState(() {
        // Personal Info
        nameController.text = data.name ?? '';
        emailController.text = data.email ?? '';
        workEmailController.text = data.workEmail ?? '';
        phoneController.text = data.phone ?? '';
        altPhoneController.text = data.alternateNo ?? '';
        whatsappController.text = data.whatsapp ?? '';
        dobController.text = data.dob != null ? DateFormat('dd-MM-yyyy').format(DateTime.parse(data.dob!)) : '';
        _selectedDateForApi = data.dob;
        selectedGender = data.gender;
        qualificationController.text = data.qualification ?? '';
        selectedMaritalStatus = data.maritalStatus;
        selectedBloodGroup = data.bloodGroup;
        joiningDateController.text = data.joiningDate != null ? DateFormat('dd-MM-yyyy').format(DateTime.parse(data.joiningDate!)) : '';
        _selectedJoiningDateForApi = data.joiningDate;
        selectedEmployeeType = data.employeeType;
        selectedWorkLocation = data.workLocation;

        // Address
        currentAddressController.text = data.currentAddress ?? '';
        permanentAddressController.text = data.permanentAddress ?? '';
        countryController.text = data.country ?? 'India';
        stateController.text = data.state ?? '';
        cityController.text = data.city ?? '';
        emergencyNameController.text = data.emergencyContact?.name ?? '';
        emergencyPhoneController.text = data.emergencyContact?.phone ?? '';
        emergencyRelationController.text = data.emergencyContact?.relation ?? '';
        pincodeController.text = data.cityId?.title ?? '';

        // Bank Details
        if (data.bankDetail != null) {
          accountHolderController.text = data.bankDetail!.accountHolderName ?? '';
          accountNumberController.text = data.bankDetail!.accountNumber.toString() ?? '';
          ifscController.text = data.bankDetail!.ifscCode ?? '';
          bankNameController.text = data.bankDetail!.bankName ?? '';
          branchController.text = data.bankDetail!.branchName ?? '';
          // selectedAccountType = data.bankDetail!.accountType ?? "Savings";
        }

        // Employment
        // experienceController.text = data.experience ?? '';
        selectedDepartment = data.departmentId?.title;
        designationController.text = data.designationId?.title ?? '';
        salaryController.text = data.salary?.ctc?.toString() ?? '';
        esicNoController.text = data.esicNo?.toString() ?? '';
        pfAccountNoController.text = data.pfAccountNo?.toString() ?? '';
        probationPeriodController.text = data.probationPeriod?.toString() ?? '';
        uanController.text = data.uan?.toString() ?? '';
        allowancesController.text = data.salary?.allowances.toString() ?? '';
        basicController.text = data.salary?.basic.toString() ?? '';
        ctcController.text = data.salary?.ctc.toString() ?? '';
        deductionsController.text = data.salary?.deductions.toString() ?? '';
        hraController.text = data.salary?.hra.toString() ?? '';

        _isDataPrefilled = true;
      });
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    // Dispose all controllers
    candidateController.dispose();
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
    pincodeController.dispose();
    accountHolderController.dispose();
    accountNumberController.dispose();
    ifscController.dispose();
    bankNameController.dispose();
    branchController.dispose();
    experienceController.dispose();
    roleController.dispose();
    designationController.dispose();
    salaryController.dispose();
    esicNoController.dispose();
    pfAccountNoController.dispose();
    probationPeriodController.dispose();
    uanController.dispose();
    allowancesController.dispose();
    basicController.dispose();
    ctcController.dispose();
    deductionsController.dispose();
    hraController.dispose();
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
    } else {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        message: "No image was selected.",
        backgroundColor: Colors.grey,
      );
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

  // - First Tab
  Future<void> _savePersonalInfo() async {
    if (!_formKey.currentState!.validate()) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        backgroundColor: Colors.red,
        message: "Please fill all required fields",
      );
      return;
    }

    final Map<String, dynamic> personalData = {
      "candidateId": _selectedCandidateId,
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
    await provider.createEmployee(context: context, requestBody: personalData , photoFile: _image,);

    if (_employeeId != null) {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        backgroundColor: Colors.green,
        message: "Employee created! ID: $_employeeId",
      );
      if (provider.createdEmployeeId != null) {
        await _prefillEmployeeData();
        _tabController.animateTo(1);
      }
      // // Prefill all data
      // await _prefillEmployeeData();
      // _tabController.animateTo(1);
    } else {
      CustomSnackbarHelper.customShowSnackbar(
        context: context,
        backgroundColor: Colors.red,
        message: "Failed to create employee.",
      );
    }
  }

  // UPDATE ADDRESS
  Future<void> _updateAddress() async {
    if (_employeeId == null) {
      CustomSnackbarHelper.customShowSnackbar(context: context, backgroundColor: Colors.red, message: "Create employee first!");
      return;
    }

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
      // "pincode": pincodeController.text.trim(),
    };

    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    await provider.updateEmployee(employeId: _employeeId!, requestBody: addressData, context: context);

    CustomSnackbarHelper.customShowSnackbar(context: context, backgroundColor: Colors.green, message: "Address updated!");
    _tabController.animateTo(2);
  }

  // UPLOAD DOCUMENTS
  Future<void> _updateDocuments() async {
    if (_employeeId == null) {
      CustomSnackbarHelper.customShowSnackbar(context: context, backgroundColor: Colors.red, message: "Create employee first!");
      return;
    }

    final selected = Map<String, File>.fromEntries(
      _uploadedDocuments.entries.where((e) => e.value != null).map((e) => MapEntry(e.key, e.value!)),
    );

    final docProvider = Provider.of<HREmpDocumentUploadProvider>(context, listen: false);
    await docProvider.uploadEmployeeDocuments(documents: selected, empId: _employeeId!, context: context);

    CustomSnackbarHelper.customShowSnackbar(context: context, backgroundColor: Colors.green, message: "Documents uploaded!");
    _tabController.animateTo(3);
  }

  // UPDATE BANK DETAILS
  Future<void> _updateBankDetails() async {
    if (_employeeId == null) {
      CustomSnackbarHelper.customShowSnackbar(context: context, backgroundColor: Colors.red, message: "Create employee first!");
      return;
    }

    final Map<String, dynamic> bankData = {
      "bankDetail": {
        "accountHolderName": accountHolderController.text.trim(),
        "accountNumber": accountNumberController.text.trim(),
        "ifscCode": ifscController.text.trim(),
        "bankName": bankNameController.text.trim(),
        "branchName": branchController.text.trim(),
        // "accountType": selectedAccountType,
      }
    };

    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    await provider.updateEmployee(employeId: _employeeId!, requestBody: bankData, context: context);

    CustomSnackbarHelper.customShowSnackbar(context: context, backgroundColor: Colors.green, message: "Bank details saved!");
    _tabController.animateTo(4);
  }

  // UPDATE EMPLOYMENT
  Future<void> _updateEmployment() async {
    if (_employeeId == null) {
      CustomSnackbarHelper.customShowSnackbar(context: context, backgroundColor: Colors.red, message: "Create employee first!");
      return;
    }

    final Map<String, dynamic> employmentData = {
      "esicNo": esicNoController.text.trim(),
      "pfAccountNo": pfAccountNoController.text.trim(),
      "probationPeriod": probationPeriodController.text.trim(),
      "uan": uanController.text.trim(),
      "salary": {
        "allowances": allowancesController.text.trim(),
        "basic": basicController.text.trim(),
        "ctc": ctcController.text.trim(),
        "deductions":deductionsController.text.trim(),
        "hra": hraController.text.trim(),
      },
      // Location Hierarchy IDs
      "zoneId": localSelectedZoneId,
      "stateId": localSelectedStateId,
      "cityId": localSelectedCityId,
      "branchId": localSelectedBranchId,
      "departmentId": localSelectedDepartmentId,
      "designationId": localSelectedDesignationId,
    };

    final provider = Provider.of<HREmployeeApiProvider>(context, listen: false);
    await provider.updateEmployee(employeId: _employeeId!, requestBody: employmentData, context: context);

    CustomSnackbarHelper.customShowSnackbar(context: context, backgroundColor: Colors.green, message: "Employment details saved!");
    _tabController.animateTo(5);
  }

  // FINAL SUBMIT
  Future<void> handleFinalSubmit() async {
    if (!_isAgreed) {
      CustomSnackbarHelper.customShowSnackbar(context: context, backgroundColor: Colors.red, message: "Please agree to terms");
      return;
    }

    CustomSnackbarHelper.customShowSnackbar(context: context, backgroundColor: Colors.green, message: "Employee created successfully!");
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.lightBgColor,
      appBar: const DefaultCommonAppBar(activityName: "Add New Employee", backgroundColor: AppColors.primary),
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
              labelStyle: AppTextStyles.heading1(context, overrideStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
              tabs: _tabs.map((tab) => Tab(text: tab["name"], icon: Icon(tab["icon"], size: 18))).toList(),
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

  // ALL UI METHODS REMAIN SAME AS BEFORE (only API calls changed above)
  // Include all your existing _build* methods here (unchanged)
  // For brevity, I'm including only key ones — paste your original UI code here

  Widget _buildPersonalInfoTab() {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
            child: Column(
              children: [
                _buildPhotoUploadSection(),
                const SizedBox(height: 20),
                _buildSectionCard(
                  title: "Personal Information",
                  children: [
                    _candidateDropdown(),
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
        _buildFixedBottomButton("Save & Next", _savePersonalInfo),
      ],
    );
  }
  Widget _buildFixedBottomButton(String text, VoidCallback onPressed) => Container(
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, -2))]),
    child: Row(
      children: [
        if (_tabController.index > 0)
          Expanded(child: CustomButton(text: "Back", color: Colors.grey, onPressed: () => _tabController.animateTo(_tabController.index - 1))),
        if (_tabController.index > 0) const SizedBox(width: 10),
        Expanded(flex: 2, child: CustomButton(text: text, color: AppColors.primary, onPressed: onPressed)),
      ],
    ),
  );

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
              _buildTextField("Emergency Name", emergencyNameController, prefixIcon: Icons.supervised_user_circle, keyboardType: TextInputType.text, validationType: ValidationType.name),
              _buildTextField("Emergency Phone", emergencyPhoneController, prefixIcon: Icons.phone_android, keyboardType: TextInputType.text, maxLength: 10, validationType: ValidationType.phone),
              _buildTextField("Emergency Relation", emergencyRelationController, prefixIcon: Icons.replay_5, keyboardType: TextInputType.text, validationType: ValidationType.name),
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
              final File? doc = _uploadedDocuments[docKey];
              String? fileName = doc?.path.split('/').last;
              return Card(
                margin: const EdgeInsets.symmetric(vertical: 10),
                elevation: 0,
                color: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(docKey, style: AppTextStyles.heading1(context, overrideStyle: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: ResponsiveHelper.fontSize(context, 16)))),
                      const SizedBox(height: 15),
                      Container(
                        width: double.infinity,
                        height: doc == null ? 100 : 200,
                        decoration: BoxDecoration(color: Colors.grey[200], borderRadius: BorderRadius.circular(10), border: Border.all(color: Colors.grey.shade300)),
                        child: doc == null
                            ? Column(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.cloud_upload, size: 40, color: Colors.grey[600]), const SizedBox(height: 8), Text('No file selected', style: AppTextStyles.body2(context))])
                            : _isImage(fileName)
                            ? ClipRRect(borderRadius: BorderRadius.circular(10), child: Image.file(doc, fit: BoxFit.contain, width: double.infinity, height: double.infinity))
                            : Column(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.description, size: 40, color: Colors.grey[600]), const SizedBox(height: 8), Padding(padding: const EdgeInsets.symmetric(horizontal: 8), child: Text(fileName!, textAlign: TextAlign.center, style: AppTextStyles.body1(context, overrideStyle: const TextStyle(fontWeight: FontWeight.bold)), maxLines: 2, overflow: TextOverflow.ellipsis))]),
                      ),
                      const SizedBox(height: 15),
                      Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => _pickFile(docKey),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                decoration: BoxDecoration(borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.primary)),
                                child: Text('Select File', textAlign: TextAlign.center, style: AppTextStyles.body2(context).copyWith(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 12)),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: GestureDetector(
                              onTap: doc == null ? null : () => _clearFile(docKey),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                decoration: BoxDecoration(borderRadius: BorderRadius.circular(8), color: doc == null ? Colors.grey : Colors.red),
                                child: Text('Clear', textAlign: TextAlign.center, style: AppTextStyles.body2(context)?.copyWith(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
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
              _buildTextField("Probation Period", probationPeriodController, prefixIcon: Icons.work, keyboardType: TextInputType.text, validationType: ValidationType.name),
              // ResponsiveDropdown<String>(value: selectedDepartment, itemList: departmentList, onChanged: (v) => setState(() => selectedDepartment = v), hint: 'Select Department', label: 'Department'),
              _buildTextField("CTC", ctcController, prefixIcon: Icons.badge, keyboardType: TextInputType.text,  validationType: ValidationType.name),
              _buildTextField("Basic", basicController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),
              _buildTextField("HRA", hraController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),
              _buildTextField("Allowances", allowancesController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),
              _buildTextField("Deductions", deductionsController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),
              _buildTextField("PF Account", pfAccountNoController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),
              _buildTextField("UAN", uanController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),
              _buildTextField("ESIC No", esicNoController, prefixIcon: Icons.currency_rupee, keyboardType: TextInputType.text, validationType: ValidationType.name),

              SizedBox(child: ResponsiveHelper.sizedBoxHeight(context, 10),),
              Text("Location Details", style: AppTextStyles.heading2(context).copyWith(color: AppColors.primary, fontSize: 15, fontWeight: FontWeight.bold)),

              SizedBox(child: ResponsiveHelper.sizedBoxHeight(context, 10),),

              LocationHierarchyDropdowns(
                key: _locationKey,
                // initialZoneId: _selectedZoneId,
                // initialStateId: _selectedStateId,
                // initialCityId: _selectedCityId,
                // initialBranchId: _selectedBranchId,
                // initialDepartmentId: _selectedDepartmentId,
                // initialDesignationId: _selectedDesignationId,
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
                  localSelectedBranchId = value;
                },
                designationValidator: (value) {
                  localSelectedBranchId = value;
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
              const SizedBox(height: 20),
              _buildSectionCard(title: "Personal Information", children: [
                _buildReviewField("Name", nameController.text),
                _buildReviewField("Email", emailController.text),
                _buildReviewField("Phone", phoneController.text),
                _buildReviewField("Gender", selectedGender ?? '-'),
                _buildReviewField("DOB", dobController.text),
                _buildReviewField("Qualification", qualificationController.text),
              ]),
              const SizedBox(height: 16),
              _buildSectionCard(title: "Address", children: [
                _buildReviewField("Address", currentAddressController.text),
                _buildReviewField("City", cityController.text),
                _buildReviewField("State", stateController.text),
                _buildReviewField("Emergency Contact Name", emergencyNameController.text),
                _buildReviewField("Emergency Phone ", emergencyPhoneController.text),
                _buildReviewField("Emergency Relation", emergencyRelationController.text),
              ]),
              const SizedBox(height: 16),
              _buildSectionCard(title: "Bank Details", children: [
                _buildReviewField("Account Holder", accountHolderController.text),
                _buildReviewField("Account Number", accountNumberController.text),
                _buildReviewField("IFSC Code", ifscController.text),
                _buildReviewField("Bank Name", bankNameController.text),
              ]),
              const SizedBox(height: 16),
              _buildSectionCard(title: "Employment", children: [
                _buildReviewField("Department", selectedDepartment ?? '-'),
                _buildReviewField("Designation", designationController.text),
                _buildReviewField("Employee Type", selectedEmployeeType ?? '-'),
                _buildReviewField("Work Location", selectedWorkLocation ?? '-'),
                _buildReviewField("Salary", salaryController.text),
              ]),
              const SizedBox(height: 20),
              Row(
                children: [
                  Checkbox(value: _isAgreed, onChanged: (v) => setState(() => _isAgreed = v ?? false), activeColor: AppColors.primary),
                  Expanded(
                    child: RichText(
                      text: TextSpan(
                        children: [
                          TextSpan(text: "I agree to the ", style: AppTextStyles.body1(context)),
                          TextSpan(text: "Terms & Conditions & Privacy Policy", style: AppTextStyles.body1(context).copyWith(color: AppColors.primary, fontWeight: FontWeight.bold)),
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

  Widget _buildPhotoUploadSection() => GestureDetector(
    onTap: () async {
      bool granted = await PermissionManager.requestPhotos(context);
      if (granted) _doPickImage();
    },
    child: Center(
      child: Column(
        children: [
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(color: AppColors.endingGreyColor, shape: BoxShape.circle, border: Border.all(color: AppColors.primary, width: 3)),
            child: _image == null
                ? ClipOval(child: Icon(Icons.person, size: 50, color: AppColors.primary))
                : ClipOval(child: Image.file(_image!, fit: BoxFit.cover)),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(20)),
            child: Text("Upload Photo", style: AppTextStyles.body2(context).copyWith(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12)),
          ),
        ],
      ),
    ),
  );

  Widget _buildSectionCard({required String title, required List<Widget> children}) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(16),
    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 6, offset: Offset(0, 2))]),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: AppTextStyles.heading2(context).copyWith(color: AppColors.primary, fontSize: 15, fontWeight: FontWeight.bold)),
        const SizedBox(height: 12),
        ...children,
      ],
    ),
  );

  Widget _buildReviewField(String label, String value) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 6),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(flex: 2, child: Text("$label:", style: AppTextStyles.body1(context).copyWith(fontWeight: FontWeight.bold))),
        Expanded(flex: 3, child: Text(value.isEmpty ? '-' : value, style: AppTextStyles.body2(context))),
      ],
    ),
  );

  // Widget _buildFixedBottomButton(String text, VoidCallback onPressed) => Container(
  //   padding: const EdgeInsets.all(16),
  //   decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, -2))]),
  //   child: Row(
  //     children: [
  //       if (_tabController.index > 0)
  //         Expanded(child: CustomButton(text: "Back", color: Colors.grey, onPressed: () => _tabController.animateTo(_tabController.index - 1))),
  //       if (_tabController.index > 0) const SizedBox(width: 10),
  //       Expanded(flex: 2, child: CustomButton(text: text, color: AppColors.primary, onPressed: onPressed)),
  //     ],
  //   ),
  // );

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
        padding: const EdgeInsets.symmetric(vertical: 0),
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

  Widget _candidateDropdown() {
    if (_candidateLoading) {
      return ResponsiveDropdown<String>(value: null, itemList: const [], onChanged: null, hint: 'Loading candidates…', label: 'Candidate *');
    }
    if (_candidateList.isEmpty) {
      return ResponsiveDropdown<String>(value: null, itemList: const [], onChanged: null, hint: 'No candidates found', label: 'Candidate *');
    }
    final List<String> displayList = _candidateList.map((c) => "${c.name ?? '–'} – ${c.email ?? '–'}").toList();
    return ResponsiveDropdown<String>(
      value: _selectedCandidateId == null ? null : displayList[_candidateList.indexWhere((c) => c.sId == _selectedCandidateId)],
      itemList: displayList,
      onChanged: (String? newValue) {
        if (newValue == null) return;
        final idx = displayList.indexOf(newValue);
        final selectedCandidate = _candidateList[idx];
        setState(() {
          _selectedCandidateId = selectedCandidate.sId;
          candidateController.text = selectedCandidate.name ?? '';
          nameController.text = selectedCandidate.name ?? '';
          emailController.text = selectedCandidate.email ?? '';
          phoneController.text = selectedCandidate.phone ?? '';
          altPhoneController.text = selectedCandidate.phone ?? '';
          whatsappController.text = selectedCandidate.phone ?? '';
          qualificationController.text = selectedCandidate.skills?.join(', ') ?? '';
          experienceController.text = selectedCandidate.experience ?? '';
        });
      },
      hint: 'Select Candidate',
      label: 'Candidate *',
    );
  }
}