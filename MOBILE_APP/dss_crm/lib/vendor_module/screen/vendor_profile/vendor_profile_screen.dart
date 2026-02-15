import 'package:dss_crm/hr_module/screen/hr_profile/hr_profile_info_screen.dart';
import 'package:dss_crm/other/faq_help_screen.dart';
import 'package:dss_crm/ui_helper/app_colors.dart';
import 'package:dss_crm/utils/responsive_helper_utils.dart';
import 'package:dss_crm/vendor_module/screen/vendor_profile/vendor_profile_info_screen.dart';
import 'package:flutter/material.dart';

import '../../../hr_module/screen/notification/hr_notifications_screen.dart';
import '../../../hr_module/screen/notification/notification_service.dart';
import '../../../other/webview_screen.dart';
import '../../../ui_helper/app_text_styles.dart';

// Mock data to simulate an API response. Replace this with your actual data models.
class UserProfile {
  final String name;
  final String email;
  final String profileImage;
  final List<Section> sections;

  UserProfile({
    required this.name,
    required this.email,
    required this.profileImage,
    required this.sections,
  });
}

class Section {
  final String title;
  final List<MenuItem> items;

  Section({required this.title, required this.items});
}

class MenuItem {
  final IconData icon;
  final String title;
  final String subtitle;

  MenuItem({required this.icon, required this.title, required this.subtitle});
}

// Profile Page
class VendorProfileScreen extends StatelessWidget {
  VendorProfileScreen({super.key});

  final UserProfile user = UserProfile(
    name: 'Javed Vendor',
    email: 'javed1dev@gmail.com',
    profileImage: "https://dss-web.netlify.app/assets/DSS_logo-DnT0ZKPG.png",
    sections: [
      Section(
        title: 'Account',
        items: [
          MenuItem(
            icon: Icons.person_outline,
            title: 'Profile information',
            subtitle: 'Change number, email id',
          ),
          // MenuItem(
          //     icon: Icons.sort,
          //     title: 'Preferences',
          //     subtitle: 'Theme, travel preferences'),
          // MenuItem(
          //     icon: Icons.wallet_outlined,
          //     title: 'Payment methods',
          //     subtitle: 'Saved cards, Paypal'),
          // MenuItem(
          //     icon: Icons.confirmation_number_outlined,
          //     title: 'Coupons',
          //     subtitle: 'All vPasses & vouchers'),
          // MenuItem(
          //   icon: Icons.notifications_none,
          //   title: 'Notifications',
          //   subtitle: 'Push notifications',
          // ),
        ],
      ),
      Section(
        title: 'Help & Support',
        items: [
          MenuItem(
            icon: Icons.lock_outlined,
            title: 'Privacy Policy',
            subtitle: 'Security notifications',
          ),
          MenuItem(
            icon: Icons.description_outlined,
            title: 'Terms & Conditions',
            subtitle: 'Cancellation policy',
          ),
          MenuItem(
            icon: Icons.help_outline,
            title: 'FAQ & Help',
            subtitle: 'Get in touch with us',
          ),
        ],
      ),
    ],
  );

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background(context),
      appBar: AppBar(
        backgroundColor: AppColors.background(context),
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: AppColors.iconColor(context)),
          onPressed: () {
            Navigator.pop(context); // 🔹 go back
          },
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: ResponsiveHelper.paddingSymmetric(
              context,
              horizontal: 16.0,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // User profile header
                UserProfileHeader(user: user),
                ResponsiveHelper.sizedBoxHeight(context, 12),
                // Menu sections
                ...user.sections
                    .map((section) => MenuSection(section: section))
                    .toList(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// UserProfileHeader widget
class UserProfileHeader extends StatelessWidget {
  final UserProfile user;

  const UserProfileHeader({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        // CircleAvatar(
        //   radius: ResponsiveHelper.circleRadius(context, 30),
        //   backgroundImage: NetworkImage(user.profileImage,),
        //   // backgroundImage: NetworkImage(user.profileImage,),
        // ),
        Container(
          width:ResponsiveHelper.containerWidth(context, 60),
          height:ResponsiveHelper.containerWidth(context, 60),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: Colors.grey[200], // Optional: a placeholder color
          ),
          child: ClipOval(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Image.network(
                user.profileImage,
                fit: BoxFit.fill, // This is the key line to make it fit properly
                loadingBuilder: (BuildContext context, Widget child, ImageChunkEvent? loadingProgress) {
                  if (loadingProgress == null) return child;
                  return Center(
                    child: CircularProgressIndicator(
                      value: loadingProgress.expectedTotalBytes != null
                          ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
                          : null,
                      strokeWidth: 2.0,
                      color: Colors.blue,
                    ),
                  );
                },
                errorBuilder: (context, error, stackTrace) {
                  return const Icon(Icons.person, color: Colors.grey, size: 40); // Fallback icon
                },
              ),
            ),
          ),
        ),
        ResponsiveHelper.sizedBoxWidth(context, 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                user.name,
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    color: AppColors.textPrimary(context),
                    fontSize: ResponsiveHelper.fontSize(context, 16),
                  ),
                ),
              ),
              Text(
                user.email,
                style: AppTextStyles.heading2(
                  context,
                  overrideStyle: TextStyle(
                    color: AppColors.textPrimary(context),
                    fontSize: ResponsiveHelper.fontSize(context, 12),
                  ),
                ),
              ),
            ],
          ),
        ),
        // IconButton(
        //   onPressed: () {},
        //   icon: Icon(Icons.more_vert, color: AppColors.iconColor(context)),
        // ),
      ],
    );
  }
}

// MenuSection widget
class MenuSection extends StatefulWidget {
  final Section section;

  const MenuSection({super.key, required this.section});

  @override
  State<MenuSection> createState() => _MenuSectionState();
}

class _MenuSectionState extends State<MenuSection> {
  final NotificationService _notificationService = NotificationService();

  void loadNotificationScreen(BuildContext context) async {
    await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) =>
            HRNotificationsScreen(service: _notificationService),
      ),
    );
    setState(() {}); // refresh badge count
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 24),
        Text(
          widget.section.title,
          style: AppTextStyles.heading2(
            context,
            overrideStyle: TextStyle(
              color: AppColors.textPrimary(context),
              fontSize: ResponsiveHelper.fontSize(context, 14),
            ),
          ),
        ),
        ResponsiveHelper.sizedBoxHeight(context, 8),
        Container(
          decoration: BoxDecoration(
            color: AppColors.background(context),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.divider(context)),
          ),
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: widget.section.items.length,
            itemBuilder: (context, index) {
              final item = widget.section.items[index];
              return ListTile(
                leading: Icon(item.icon, color: AppColors.iconColor(context)),
                title: Text(
                  item.title,
                  style: AppTextStyles.heading2(
                    context,
                    overrideStyle: TextStyle(
                      color: AppColors.textPrimary(context),
                      fontSize: ResponsiveHelper.fontSize(context, 14),
                    ),
                  ),
                ),
                subtitle: Text(
                  item.subtitle,
                  style: AppTextStyles.body1(
                    context,
                    overrideStyle: TextStyle(
                      color: AppColors.textPrimary(context),
                      fontSize: ResponsiveHelper.fontSize(context, 10),
                    ),
                  ),
                ),
                onTap: () {
                  if (item.title == 'Profile information') {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => VendorProfileInformationPage(),
                      ),
                    );
                  } else if (item.title == 'Privacy Policy') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => WebViewScreen(
                          isPrivacyPolicy: true,
                          isRefundPolicy: false,
                          isTermAndConditions: false,
                          aciviyName: "Privacy Policy",
                          url: "https://dss-web.netlify.app/privacy-policy",
                        ),
                      ),
                    );
                  } else if (item.title == 'Terms & Conditions') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => WebViewScreen(
                          isPrivacyPolicy: false,
                          isRefundPolicy: false,
                          isTermAndConditions: true,
                          aciviyName: "Privacy Policy",
                          url:
                              "https://www.termsfeed.com/live/7babeefd-2eea-435a-9245-79f226692551",
                        ),
                      ),
                    );
                  } else if (item.title == 'FAQ & Help') {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => FAQHomeScreen(),
                      ),
                    );
                  } else if (item.title == 'Notifications') {
                    loadNotificationScreen(context);
                  }
                },
              );
            },
            separatorBuilder: (context, index) => Divider(
              indent: 60,
              endIndent: 16,
              height: 0,
              color: AppColors.divider(context),
            ),
          ),
        ),
      ],
    );
  }
}
