import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../../vendor_module/controller/vendor_api_provider.dart';


class HRProfileInformationPage extends StatefulWidget {
  const HRProfileInformationPage({super.key});

  @override
  State<HRProfileInformationPage> createState() =>
      _HRProfileInformationPageState();
}

class _HRProfileInformationPageState
    extends State<HRProfileInformationPage> {
  @override
  void initState() {
    super.initState();
    // screen open hote hi API call
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<VendorModuleApiProvider>(context, listen: false)
          .getVendorProfileData(context);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<VendorModuleApiProvider>(
      builder: (context, provider, child) {
        final response = provider.getVendorProfileModelResponse;

        if (provider.isLoading) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (response == null || response.data == null) {
          return const Scaffold(
            body: Center(
              child: Text("No profile data found"),
            ),
          );
        }

        final data = response.data!.data;
        final personal = data?.personalInfo;
        final address = data?.address;

        return Scaffold(
          backgroundColor: Colors.white,
          appBar: AppBar(
            backgroundColor: AppColors.primary,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
            title: const Text(
              'Profile Information',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.w600,
              ),
            ),
            actions: [
              // IconButton(
              //   icon: const Icon(Icons.edit, color: Colors.white),
              //   onPressed: () {
              //     // edit page navigate
              //   },
              // ),
            ],
          ),
          body: SafeArea(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(
                  children: [
                    const SizedBox(height: 20),
                    // Profile Header Card
                    _buildProfileHeaderCard(
                      personal?.contactPersonName ?? "No Name",
                      personal?.businessName ?? "",
                      data?.profileImage?.fileUrl ??
                          "https://via.placeholder.com/150",
                    ),
                    const SizedBox(height: 20),

                    // Personal Info Section
                    _buildInformationSection(
                      context,
                      'Personal Information',
                      Icons.person,
                      [
                        _buildInfoRow(context, 'Business Name',
                            personal?.businessName ?? "-", Icons.business),
                        _buildInfoRow(context, 'Contact Person',
                            personal?.contactPersonName ?? "-", Icons.person),
                        _buildInfoRow(context, 'Contact Number',
                            personal?.contactNumber ?? "-", Icons.phone),
                        _buildInfoRow(context, 'Alternate Contact',
                            personal?.alternateContact ?? "-", Icons.call),
                        _buildInfoRow(context, 'Email',
                            personal?.email ?? "-", Icons.email),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Address Info Section
                    _buildInformationSection(
                      context,
                      'Address',
                      Icons.location_on,
                      [
                        _buildInfoRow(context, 'Street',
                            address?.street ?? "-", Icons.home),
                        _buildInfoRow(context, 'Area',
                            address?.area ?? "-", Icons.map),
                        _buildInfoRow(context, 'City',
                            address?.city ?? "-", Icons.location_city),
                        _buildInfoRow(context, 'State',
                            address?.state ?? "-", Icons.flag),
                        _buildInfoRow(context, 'Pincode',
                            address?.pincode ?? "-", Icons.pin),
                      ],
                    ),
                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildProfileHeaderCard(
      String name, String business, String imageUrl) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.white, Colors.white],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 35,
            backgroundImage: NetworkImage(imageUrl),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  business,
                  style: TextStyle(
                    color: Colors.black.withOpacity(0.9),
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInformationSection(
      BuildContext context, String title, IconData icon, List<Widget> children) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.withOpacity(0.5), width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(icon, color: Colors.blue),
                const SizedBox(width: 12),
                Text(title,
                    style: const TextStyle(
                        fontSize: 16, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
          const Divider(height: 1, color: Colors.grey),
          Padding(
            padding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Column(children: children),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(
      BuildContext context, String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 18, color: Colors.black54),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: TextStyle(
                        fontSize: 12, color: Colors.grey.shade600)),
                const SizedBox(height: 2),
                Text(value,
                    style: const TextStyle(
                        fontSize: 14, fontWeight: FontWeight.w500)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
