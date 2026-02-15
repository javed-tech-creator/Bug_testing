import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class Asset {
  final String id;
  final String tag;
  final String type;
  final String brand;
  final String model;
  final String location;
  final String status;
  final String department;
  final String assignedTo;
  final DateTime purchaseDate;
  final DateTime warrantyEnd;
  final bool hasAMCContract;
  final String? contractNo;
  final DateTime? validity;
  final DateTime createdAt;

  Asset({
    required this.id,
    required this.tag,
    required this.type,
    required this.brand,
    required this.model,
    required this.location,
    required this.status,
    required this.department,
    required this.assignedTo,
    required this.purchaseDate,
    required this.warrantyEnd,
    required this.hasAMCContract,
    this.contractNo,
    this.validity,
    required this.createdAt,
  });

  factory Asset.fromJson(Map<String, dynamic> json) {
    return Asset(
      id: json['id'],
      tag: json['tag'],
      type: json['type'],
      brand: json['brand'],
      model: json['model'],
      location: json['location'],
      status: json['status'],
      department: json['department'],
      assignedTo: json['assignedTo'],
      purchaseDate: DateTime.parse(json['purchaseDate']),
      warrantyEnd: DateTime.parse(json['warrantyEnd']),
      hasAMCContract: json['hasAMCContract'],
      contractNo: json['contractNo'],
      validity: DateTime.parse(json['validity']),
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'tag': tag,
      'type': type,
      'brand': brand,
      'model': model,
      'location': location,
      'status': status,
      'department': department,
      'assignedTo': assignedTo,
      'purchaseDate': purchaseDate.toIso8601String(),
      'warrantyEnd': warrantyEnd.toIso8601String(),
      'hasAMCContract': hasAMCContract,
      'contractNo': contractNo,
      'validity': validity?.toIso8601String() ?? "",
      'createdAt': createdAt.toIso8601String(),
    };
  }
}

// models/filter_model.dart
// Updated AssetFilter class to work with your API model
class AssetFilter {
  final String? type;
  final String? brand;
  final String? status;
  final String? department;
  final String? location;
  final bool? hasAMCContract;

  AssetFilter({
    this.type,
    this.brand,
    this.status,
    this.department,
    this.location,
    this.hasAMCContract,
  });

  AssetFilter copyWith({
    String? type,
    String? brand,
    String? status,
    String? department,
    String? location,
    bool? hasAMCContract,
  }) {
    return AssetFilter(
      type: type,
      brand: brand,
      status: status,
      department: department,
      location: location,
      hasAMCContract: hasAMCContract,
    );
  }

  bool get isEmpty {
    return type == null &&
        brand == null &&
        status == null &&
        department == null &&
        location == null &&
        hasAMCContract == null;
  }
}

// Updated AssetUtils class to work with your predefined values and API model
class AssetUtils {
  static Color getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'in use':
        return Colors.green;
      case 'repair':
        return Colors.orange;
      case 'spare':
        return Colors.blue;
      case 'scrap':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  static Color getTypeColor(String type) {
    switch (type.toLowerCase()) {
      case 'laptop':
        return Colors.purple;
      case 'server':
        return Colors.red;
      case 'led display controller':
        return Colors.indigo;
      case 'printer':
        return Colors.teal;
      case 'camera':
        return Colors.orange;
      case 'router':
        return Colors.green;
      case 'other':
        return Colors.grey;
      default:
        return Colors.blue;
    }
  }

  static IconData getTypeIcon(String type) {
    switch (type.toLowerCase()) {
      case 'laptop':
        return Icons.laptop_mac;
      case 'server':
        return Icons.dns;
      case 'led display controller':
        return Icons.monitor;
      case 'printer':
        return Icons.print;
      case 'camera':
        return Icons.camera_alt;
      case 'router':
        return Icons.router;
      case 'other':
        return Icons.devices_other;
      default:
        return Icons.devices;
    }
  }

  static String formatDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return 'N/A';
    try {
      final date = DateTime.parse(dateString);
      return DateFormat('dd/MM/yyyy').format(date);
    } catch (e) {
      return dateString; // Return original if parsing fails
    }
  }
}

class AssetService {
  // Sample data - replace with actual API calls
  static final List<Asset> _sampleAssets = [
    Asset(
      id: '1',
      tag: 'ASSET-001',
      type: 'Laptop',
      brand: 'Dell',
      model: 'Latitude 5420',
      location: 'HQ Office',
      status: 'In Use',
      department: 'IT',
      assignedTo: 'John Doe',
      purchaseDate: DateTime(2023, 5, 10),
      warrantyEnd: DateTime(2026, 5, 10),
      hasAMCContract: true,
      contractNo: 'AMC-12345',
      validity: DateTime(2025, 12, 31),
      createdAt: DateTime(2023, 5, 10),
    ),
    Asset(
      id: '2',
      tag: 'ASSET-002',
      type: 'Server',
      brand: 'HP',
      model: 'ProLiant DL380',
      location: 'Data Center',
      status: 'Available',
      department: 'Infra',
      assignedTo: 'Suresh Kumar',
      purchaseDate: DateTime(2022, 1, 15),
      warrantyEnd: DateTime(2025, 1, 15),
      hasAMCContract: false,
      createdAt: DateTime(2022, 1, 15),
    ),
    Asset(
      id: '3',
      tag: 'ASSET-003',
      type: 'Desktop',
      brand: 'Lenovo',
      model: 'ThinkCentre M720',
      location: 'Branch Office',
      status: 'In Use',
      department: 'HR',
      assignedTo: 'Sarah Wilson',
      purchaseDate: DateTime(2023, 3, 20),
      warrantyEnd: DateTime(2026, 3, 20),
      hasAMCContract: true,
      contractNo: 'AMC-67890',
      validity: DateTime(2026, 3, 20),
      createdAt: DateTime(2023, 3, 20),
    ),
    Asset(
      id: '4',
      tag: 'ASSET-004',
      type: 'Printer',
      brand: 'Canon',
      model: 'imageRUNNER 2525i',
      location: 'HQ Office',
      status: 'Maintenance',
      department: 'Admin',
      assignedTo: 'Michael Brown',
      purchaseDate: DateTime(2022, 8, 5),
      warrantyEnd: DateTime(2025, 8, 5),
      hasAMCContract: true,
      contractNo: 'AMC-11111',
      validity: DateTime(2025, 08, 05),
      createdAt: DateTime(2022, 8, 5),
    ),
  ];

  static Future<List<Asset>> getAssets({
    int page = 1,
    int limit = 10,
    String? searchQuery,
    AssetFilter? filter,
  }) async {
    await Future.delayed(const Duration(milliseconds: 500)); // Simulate API call

    List<Asset> assets = List.from(_sampleAssets);

    // Apply search filter
    if (searchQuery != null && searchQuery.isNotEmpty) {
      assets = assets.where((asset) {
        return asset.tag.toLowerCase().contains(searchQuery.toLowerCase()) ||
            asset.model.toLowerCase().contains(searchQuery.toLowerCase()) ||
            asset.assignedTo.toLowerCase().contains(searchQuery.toLowerCase());
      }).toList();
    }

    // Apply filters
    if (filter != null && !filter.isEmpty) {
      assets = assets.where((asset) {
        bool matches = true;
        if (filter.type != null) matches &= asset.type == filter.type;
        if (filter.brand != null) matches &= asset.brand == filter.brand;
        if (filter.status != null) matches &= asset.status == filter.status;
        if (filter.department != null) matches &= asset.department == filter.department;
        if (filter.location != null) matches &= asset.location == filter.location;
        if (filter.hasAMCContract != null) matches &= asset.hasAMCContract == filter.hasAMCContract;
        return matches;
      }).toList();
    }

    // Apply pagination
    int startIndex = (page - 1) * limit;
    int endIndex = startIndex + limit;
    if (startIndex >= assets.length) return [];
    if (endIndex > assets.length) endIndex = assets.length;

    return assets.sublist(startIndex, endIndex);
  }

  static Future<int> getTotalCount({
    String? searchQuery,
    AssetFilter? filter,
  }) async {
    await Future.delayed(const Duration(milliseconds: 100));

    List<Asset> assets = List.from(_sampleAssets);

    if (searchQuery != null && searchQuery.isNotEmpty) {
      assets = assets.where((asset) {
        return asset.tag.toLowerCase().contains(searchQuery.toLowerCase()) ||
            asset.model.toLowerCase().contains(searchQuery.toLowerCase()) ||
            asset.assignedTo.toLowerCase().contains(searchQuery.toLowerCase());
      }).toList();
    }

    if (filter != null && !filter.isEmpty) {
      assets = assets.where((asset) {
        bool matches = true;
        if (filter.type != null) matches &= asset.type == filter.type;
        if (filter.brand != null) matches &= asset.brand == filter.brand;
        if (filter.status != null) matches &= asset.status == filter.status;
        if (filter.department != null) matches &= asset.department == filter.department;
        if (filter.location != null) matches &= asset.location == filter.location;
        if (filter.hasAMCContract != null) matches &= asset.hasAMCContract == filter.hasAMCContract;
        return matches;
      }).toList();
    }

    return assets.length;
  }

  static List<String> getUniqueTypes() {
    return _sampleAssets.map((e) => e.type).toSet().toList();
  }

  static List<String> getUniqueBrands() {
    return _sampleAssets.map((e) => e.brand).toSet().toList();
  }

  static List<String> getUniqueStatuses() {
    return _sampleAssets.map((e) => e.status).toSet().toList();
  }

  static List<String> getUniqueDepartments() {
    return _sampleAssets.map((e) => e.department).toSet().toList();
  }

  static List<String> getUniqueLocations() {
    return _sampleAssets.map((e) => e.location).toSet().toList();
  }
}

