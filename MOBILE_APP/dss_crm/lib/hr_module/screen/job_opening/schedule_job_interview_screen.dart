import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../ui_helper/app_colors.dart';
import '../../../ui_helper/app_text_styles.dart';
import '../../../utils/custom_buttons_utils.dart';
import '../../../utils/custom_text_field_utils.dart';
import '../../../utils/default_common_app_bar.dart';
import '../../../utils/form_validations_utils.dart';
import '../../../utils/responsive_dropdown_utils.dart';
import '../../../utils/responsive_helper_utils.dart';

class ScheduleInterviewScreen extends StatefulWidget {
  final String candidateName; // Candidate ka naam auto populate hoga

  const ScheduleInterviewScreen({Key? key, required this.candidateName})
      : super(key: key);

  @override
  State<ScheduleInterviewScreen> createState() =>
      _ScheduleInterviewScreenState();
}

class _ScheduleInterviewScreenState extends State<ScheduleInterviewScreen> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController interviewerNameController =
  TextEditingController();
  final TextEditingController notesController = TextEditingController();

  //    DateTime controller added
  final TextEditingController dateTimeController = TextEditingController();

  String? selectedInterviewType;
  DateTime? selectedDateTime;

  final List<String> interviewTypes = ["Telephonic", "Video", "Face-to-Face"];

  Future<void> _pickDateTime() async {
    final DateTime? date = await showDatePicker(
      context: context,
      firstDate: DateTime.now(),
      lastDate: DateTime(2100),
      initialDate: DateTime.now(),
    );

    if (date != null) {
      final TimeOfDay? time = await showTimePicker(
        context: context,
        initialTime: TimeOfDay.now(),
        builder: (BuildContext context, Widget? child) {
          return MediaQuery(
            data: MediaQuery.of(context).copyWith(alwaysUse24HourFormat: false), //    Force AM/PM
            child: child!,
          );
        },
      );

      if (time != null) {
        setState(() {
          selectedDateTime = DateTime(
            date.year,
            date.month,
            date.day,
            time.hour,
            time.minute,
          );

          //    Format with intl (dd MMM yyyy, hh:mm a) → AM/PM show karega
          final formattedDate =
          DateFormat("dd MMM yyyy, hh:mm a").format(selectedDateTime!);

          dateTimeController.text = formattedDate;
        });
      }
    }
  }

  void _handleSubmit() {
    if (_formKey.currentState!.validate() &&
        selectedDateTime != null &&
        selectedInterviewType != null) {
      // TODO: API call for scheduling interview
      debugPrint("Interview Scheduled for: ${widget.candidateName}");
      debugPrint("Type: $selectedInterviewType");
      debugPrint("DateTime: $selectedDateTime");
      debugPrint("Interviewer: ${interviewerNameController.text}");
      debugPrint("Notes: ${notesController.text}");

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Interview Scheduled Successfully   ")),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please fill all required fields ❌")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.whiteColor,
      appBar: DefaultCommonAppBar(
        activityName: "Schedule Interview",
        backgroundColor: AppColors.primary,
      ),
      body: SingleChildScrollView(
        padding: ResponsiveHelper.paddingAll(context, 16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Candidate Name (read-only)
              CustomTextField(
                title: "Candidate Name",
                hintText: "Candidate Name",
                controller: TextEditingController(text: widget.candidateName),
                readOnly: true,
              ),

              // Interview Type Dropdown
              ResponsiveDropdown<String>(
                value: selectedInterviewType,
                itemList: interviewTypes,
                onChanged: (value) {
                  setState(() {
                    selectedInterviewType = value;
                  });
                },
                hint: "Select Interview Type",
                label: "Interview Type *",
              ),
              //    Interview Date & Time (Custom TextField with controller)
              CustomTextField(
                title: "Interview Date & Time *",
                hintText: "Select Date & Time",
                controller: dateTimeController,
                readOnly: true,
                onTap: _pickDateTime,
                validator: (value) =>
                value == null || value.isEmpty ? "Please select date & time" : null,
              ),
              // Interviewer Name
              CustomTextField(
                title: "Interviewer Name *",
                hintText: "Interviewer Name *",
                controller: interviewerNameController,
                validator: (value) => FormValidatorUtils.validateRequired(
                  value,
                  fieldName: "Interviewer Name",
                ),
              ),

              // Notes
              CustomTextField(
                title: "Notes",
                controller: notesController,
                maxLines: 4,
                hintText: 'Notes',
              ),

              const SizedBox(height: 20),

              // Submit Button
              CustomButton(
                color: Colors.black,
                text: "Schedule Interview",
                onPressed: _handleSubmit,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
