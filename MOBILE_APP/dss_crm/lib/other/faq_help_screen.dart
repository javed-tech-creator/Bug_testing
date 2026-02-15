import 'package:flutter/material.dart';

class FAQItem {
  final int id;
  final String question;
  final String answer;
  bool isExpanded;

  FAQItem({
    required this.id,
    required this.question,
    required this.answer,
    this.isExpanded = false,
  });
}

class FAQHomeScreen extends StatefulWidget {
  @override
  _FAQHomeScreenState createState() => _FAQHomeScreenState();
}

class _FAQHomeScreenState extends State<FAQHomeScreen> {
  TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  final List<FAQItem> generalFAQs = [
    FAQItem(
      id: 1,
      question: "How do I create a new account?",
      answer: "To create a new account, tap on the 'Sign Up' button on the homepage. Fill in your email address, create a secure password, and verify your email. The process takes less than 2 minutes.",
    ),
    FAQItem(
      id: 2,
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and digital wallets like Apple Pay and Google Pay. All transactions are secured with 256-bit SSL encryption.",
    ),
    FAQItem(
      id: 3,
      question: "How can I reset my password?",
      answer: "Tap 'Forgot Password' on the login screen, enter your email address, and we'll send you a secure reset link. The link expires in 24 hours for security purposes.",
    ),
    FAQItem(
      id: 4,
      question: "Is my data secure?",
      answer: "Yes, we use industry-standard encryption and security measures. Your data is stored in secure data centers with regular backups, and we comply with GDPR and other privacy regulations.",
    ),
    FAQItem(
      id: 5,
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime from your account settings. Go to 'Billing' section and tap 'Cancel Subscription'. Your access will continue until the end of your billing period.",
    ),
  ];

  List<FAQItem> get filteredFAQs {
    if (_searchQuery.isEmpty) return generalFAQs;
    return generalFAQs
        .where((faq) =>
    faq.question.toLowerCase().contains(_searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.grey[700]),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            Container(
              padding: EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.blue[600]!, Colors.purple[600]!],
                ),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(Icons.help_outline, color: Colors.white, size: 24),
            ),
            SizedBox(width: 12),
            Text(
              'Help Center',
              style: TextStyle(
                color: Colors.grey[800],
                fontWeight: FontWeight.bold,
                fontSize: 22,
              ),
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          // Header Section
          Container(
            width: double.infinity,
            color: Colors.white,
            padding: EdgeInsets.all(20),
            child: Column(
              children: [
                Text(
                  'How can we help you?',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[800],
                  ),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 8),
                Text(
                  'Find answers to commonly asked questions',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),

          // Categories Section
          Container(
            color: Colors.white,
            padding: EdgeInsets.fromLTRB(20, 0, 20, 20),
            child: Column(
              children: [
                Row(
                  children: [
                    Expanded(
                      child: _buildCategoryCard(
                        'General',
                        'Account, billing, basic questions',
                        Icons.help_outline,
                        Colors.blue,
                            () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => FAQDetailScreen(
                              title: 'General FAQ',
                              faqs: generalFAQs,
                            ),
                          ),
                        ),
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: _buildCategoryCard(
                        'Technical',
                        'App issues, bugs, troubleshooting',
                        Icons.build_outlined,
                        Colors.purple,
                            () => Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => FAQDetailScreen(
                              title: 'Technical Support',
                              faqs: _getTechnicalFAQs(),
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

          // Search Section
          Container(
            padding: EdgeInsets.all(20),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: TextField(
                controller: _searchController,
                onChanged: (value) {
                  setState(() {
                    _searchQuery = value;
                  });
                },
                decoration: InputDecoration(
                  hintText: 'Search FAQs...',
                  hintStyle: TextStyle(color: Colors.grey[400]),
                  prefixIcon: Icon(Icons.search, color: Colors.grey[400]),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.all(16),
                ),
              ),
            ),
          ),

          // FAQ List - Fixed using Expanded with ListView
          Expanded(
            child: filteredFAQs.isEmpty
                ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.search_off,
                    size: 64,
                    color: Colors.grey[400],
                  ),
                  SizedBox(height: 16),
                  Text(
                    'No results found',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            )
                : ListView.builder(
              padding: EdgeInsets.symmetric(horizontal: 20),
              itemCount: filteredFAQs.length + 1, // +1 for contact section
              itemBuilder: (context, index) {
                if (index < filteredFAQs.length) {
                  return _buildFAQItem(filteredFAQs[index]);
                } else {
                  // Contact Section at the bottom
                  return Container(
                    margin: EdgeInsets.symmetric(vertical: 20),
                    padding: EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.blue[600]!, Colors.purple[600]!],
                      ),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      children: [
                        Text(
                          'Still need help?',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            _buildContactButton(Icons.chat_bubble_outline, 'Chat'),
                            _buildContactButton(Icons.phone_outlined, 'Call'),
                            _buildContactButton(Icons.email_outlined, 'Email'),
                          ],
                        ),
                      ],
                    ),
                  );
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryCard(String title, String subtitle, IconData icon,
      Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.08),
              blurRadius: 15,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            SizedBox(height: 16),
            Text(
              title,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: Colors.grey[800],
              ),
            ),
            SizedBox(height: 4),
            Text(
              subtitle,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFAQItem(FAQItem faq) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: ExpansionTile(
        title: Text(
          faq.question,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 16,
            color: Colors.grey[800],
          ),
        ),
        children: [
          Padding(
            padding: EdgeInsets.fromLTRB(16, 0, 16, 20),
            child: Text(
              faq.answer,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 14,
                height: 1.5,
              ),
            ),
          ),
        ],
        iconColor: Colors.blue[600],
        collapsedIconColor: Colors.grey[400],
      ),
    );
  }

  Widget _buildContactButton(IconData icon, String label) {
    return GestureDetector(
      onTap: () {
        // Add your contact functionality here
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('$label option selected'),
            duration: Duration(seconds: 2),
          ),
        );
      },
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: Colors.white, size: 24),
          ),
          SizedBox(height: 8),
          Text(
            label,
            style: TextStyle(color: Colors.white, fontSize: 12),
          ),
        ],
      ),
    );
  }

  List<FAQItem> _getTechnicalFAQs() {
    return [
      FAQItem(
        id: 6,
        question: "What are the system requirements?",
        answer: "Our app works on iOS 12+ and Android 8+. You'll need at least 2GB RAM and 500MB storage space for optimal performance.",
      ),
      FAQItem(
        id: 7,
        question: "Why is the app running slowly?",
        answer: "Slow performance can be due to poor internet connection, insufficient device storage, or outdated app version. Try restarting the app, clearing cache, or updating to the latest version.",
      ),
      FAQItem(
        id: 8,
        question: "How do I sync data across devices?",
        answer: "Enable cloud sync in Settings > Account > Sync. Your data will automatically sync across all logged-in devices when connected to the internet.",
      ),
      FAQItem(
        id: 9,
        question: "Can I use the app offline?",
        answer: "Yes, basic features work offline. However, real-time data updates, cloud sync, and some advanced features require an internet connection.",
      ),
      FAQItem(
        id: 10,
        question: "How do I report a bug?",
        answer: "Report bugs through the app's 'Help & Support' section or email support@company.com. Include device model, OS version, and steps to reproduce the issue.",
      ),
    ];
  }
}

class FAQDetailScreen extends StatefulWidget {
  final String title;
  final List<FAQItem> faqs;

  FAQDetailScreen({required this.title, required this.faqs});

  @override
  _FAQDetailScreenState createState() => _FAQDetailScreenState();
}

class _FAQDetailScreenState extends State<FAQDetailScreen> {
  TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  List<FAQItem> get filteredFAQs {
    if (_searchQuery.isEmpty) return widget.faqs;
    return widget.faqs
        .where((faq) =>
    faq.question.toLowerCase().contains(_searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().contains(_searchQuery.toLowerCase()))
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: Colors.grey[700]),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          widget.title,
          style: TextStyle(
            color: Colors.grey[800],
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
      ),
      body: Column(
        children: [
          // Search Bar
          Container(
            color: Colors.white,
            padding: EdgeInsets.all(20),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: TextField(
                controller: _searchController,
                onChanged: (value) {
                  setState(() {
                    _searchQuery = value;
                  });
                },
                decoration: InputDecoration(
                  hintText: 'Search in ${widget.title}...',
                  hintStyle: TextStyle(color: Colors.grey[500]),
                  prefixIcon: Icon(Icons.search, color: Colors.grey[500]),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.all(16),
                ),
              ),
            ),
          ),

          // FAQ List
          Expanded(
            child: filteredFAQs.isEmpty
                ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.search_off,
                    size: 64,
                    color: Colors.grey[400],
                  ),
                  SizedBox(height: 16),
                  Text(
                    'No results found',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            )
                : ListView.builder(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              itemCount: filteredFAQs.length,
              itemBuilder: (context, index) {
                return _buildFAQItem(filteredFAQs[index]);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFAQItem(FAQItem faq) {
    return Container(
      margin: EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: ExpansionTile(
        title: Text(
          faq.question,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 16,
            color: Colors.grey[800],
          ),
        ),
        children: [
          Container(
            width: double.infinity,
            padding: EdgeInsets.fromLTRB(16, 0, 16, 20),
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(color: Colors.grey[100]!),
              ),
            ),
            child: Padding(
              padding: EdgeInsets.only(top: 16),
              child: Text(
                faq.answer,
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                  height: 1.6,
                ),
              ),
            ),
          ),
        ],
        iconColor: Colors.blue[600],
        collapsedIconColor: Colors.grey[400],
      ),
    );
  }
}