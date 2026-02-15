import 'package:flutter/material.dart';
import 'admin_login_screen.dart';

class AdminLocationSelectionScreen extends StatefulWidget {
  const AdminLocationSelectionScreen({Key? key}) : super(key: key);

  @override
  State<AdminLocationSelectionScreen> createState() => _AdminLocationSelectionScreenState();
}

class _AdminLocationSelectionScreenState extends State<AdminLocationSelectionScreen> {
  String? selectedZone;
  String? selectedState;
  String? selectedCity;
  String? selectedBranch;

  final Map<String, List<String>> zoneStates = {
    'North Zone': ['Punjab', 'Haryana', 'Himachal Pradesh', 'Uttarakhand', 'Jammu & Kashmir'],
    'South Zone': ['Tamil Nadu', 'Karnataka', 'Telangana', 'Andhra Pradesh', 'Kerala'],
    'East Zone': ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha', 'Assam'],
    'West Zone': ['Gujarat', 'Maharashtra', 'Rajasthan', 'Goa'],
    'Central Zone': ['Madhya Pradesh', 'Chhattisgarh', 'Uttar Pradesh'],
  };

  final Map<String, List<String>> stateCities = {
    'Punjab': ['Amritsar', 'Ludhiana', 'Chandigarh', 'Jalandhar', 'Patiala'],
    'Haryana': ['Gurgaon', 'Faridabad', 'Hisar', 'Rohtak', 'Panipat'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy'],
    'Karnataka': ['Bangalore', 'Pune', 'Mysore', 'Hubli', 'Mangalore'],
    'West Bengal': ['Kolkata', 'Darjeeling', 'Asansol', 'Siliguri', 'Durgapur'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Arrah'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Aurangabad', 'Nashik'],
    'Himachal Pradesh': ['Shimla', 'Manali', 'Dharmashala', 'Solan', 'Kullu'],
    'Uttarakhand': ['Dehradun', 'Garhwal', 'Kumaon', 'Nainital', 'Rishikesh'],
    'Telangana': ['Hyderabad', 'Secunderabad', 'Warangal', 'Karimnagar', 'Nizamabad'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Tirupati', 'Nellore', 'Guntur'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Giridih', 'Bokaro'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Balasore', 'Sambalpur'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer', 'Bikaner'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Pernem', 'Ponda'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Durg', 'Rajnandgaon', 'Bilaspur'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut'],
    'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Alappuzha'],
    'Assam': ['Guwahati', 'Dibrugarh', 'Silchar', 'Nagaon', 'Tinsukia'],
    'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Leh', 'Anantnag', 'Samba'],
  };

  final List<String> branches = [
    'Head Office',
    'Branch A',
    'Branch B',
    'Branch C',
    'Branch D',
    'Branch E',
  ];

  bool get isAllSelected =>
      selectedZone != null &&
          selectedState != null &&
          selectedCity != null &&
          selectedBranch != null;

  void _onZoneChanged(String? zone) {
    setState(() {
      selectedZone = zone;
      selectedState = null;
      selectedCity = null;
    });
  }

  void _onStateChanged(String? state) {
    setState(() {
      selectedState = state;
      selectedCity = null;
    });
  }

  void _onCityChanged(String? city) {
    setState(() {
      selectedCity = city;
    });
  }

  void _onBranchChanged(String? branch) {
    setState(() {
      selectedBranch = branch;
    });
  }

  void _proceedToLogin() {
    if (isAllSelected) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => AdminLoginScreen(
            zone: selectedZone!,
            state: selectedState!,
            city: selectedCity!,
            branch: selectedBranch!,
          ),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF1a237e), Color(0xFF3949ab)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: SafeArea(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                  const SizedBox(height: 30),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.15),
                          blurRadius: 15,
                          spreadRadius: 3,
                        ),
                      ],
                    ),
                    child: Icon(
                      Icons.admin_panel_settings,
                      size: 60,
                      color: Color(0xFF1a237e),
                    ),
                  ),
                  const SizedBox(height: 25),
                  const Text(
                    'DSS CRM',
                    style: TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Admin Control Panel',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white70,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 45),
                  Container(
                    padding: const EdgeInsets.all(28),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 25,
                          spreadRadius: 5,
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        const Text(
                          'Select Your Location',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1a237e),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Zone • State • City • Branch',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade600,
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 35),
                        // Zone Dropdown
                        _buildDropdown(
                          label: 'Zone',
                          value: selectedZone,
                          hint: 'Select Zone',
                          icon: Icons.public,
                          items: zoneStates.keys.toList(),
                          onChanged: _onZoneChanged,
                        ),
                        const SizedBox(height: 20),
                        // State Dropdown
                        _buildDropdown(
                          label: 'State',
                          value: selectedState,
                          hint: 'Select State',
                          icon: Icons.domain,
                          items: selectedZone != null ? zoneStates[selectedZone]! : [],
                          onChanged: selectedZone != null ? _onStateChanged : null,
                        ),
                        const SizedBox(height: 20),
                        // City Dropdown
                        _buildDropdown(
                          label: 'City',
                          value: selectedCity,
                          hint: 'Select City',
                          icon: Icons.location_city,
                          items: selectedState != null ? stateCities[selectedState]! : [],
                          onChanged: selectedState != null ? _onCityChanged : null,
                        ),
                        const SizedBox(height: 20),
                        // Branch Dropdown
                        _buildDropdown(
                          label: 'Branch',
                          value: selectedBranch,
                          hint: 'Select Branch',
                          icon: Icons.business,
                          items: branches,
                          onChanged: _onCityChanged != null ? _onBranchChanged : null,
                        ),
                        const SizedBox(height: 45),
                        // Proceed Button
                        SizedBox(
                          width: double.infinity,
                          height: 58,
                          child: ElevatedButton(
                            onPressed: isAllSelected ? _proceedToLogin : null,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color(0xFF3949ab),
                              disabledBackgroundColor: Colors.grey.shade300,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                              elevation: 8,
                            ),
                            child: const Text(
                              'Proceed to Login',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDropdown({
    required String label,
    required String? value,
    required String hint,
    required IconData icon,
    required List<String> items,
    required Function(String?)? onChanged,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      hint: Text(hint),
      items: items.isEmpty
          ? []
          : items.map((item) {
        return DropdownMenuItem<String>(
          value: item,
          child: Text(item),
        );
      }).toList(),
      onChanged: onChanged,
      decoration: InputDecoration(
        prefixIcon: Icon(
          icon,
          color: items.isEmpty ? Colors.grey : Color(0xFF3949ab),
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(
            color: Color(0xFF3949ab).withOpacity(0.3),
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(
            color: Color(0xFF3949ab).withOpacity(0.5),
            width: 2,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(
            color: Color(0xFF3949ab),
            width: 2.5,
          ),
        ),
        disabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(
            color: Colors.grey.shade300,
            width: 1.5,
          ),
        ),
        filled: true,
        fillColor: items.isEmpty ? Colors.grey.shade100 : Color(0xFF3949ab).withOpacity(0.05),
        labelText: label,
        labelStyle: TextStyle(
          color: Color(0xFF3949ab),
          fontWeight: FontWeight.w600,
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
      ),
    );
  }
}