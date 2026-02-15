import '../../../sales_tl/model/pending_lead_list_model.dart';

class CommonLeadModel {
  final String? sId;
  final String? leadStatus;
  final String? leadSource;
  final String? leadType;
  final String? queryDate;
  final String? senderName;
  final String? contactPerson;
  final String? concernedPerson;
  final String? concernPersonName;
  final String? company;
  final String? remark;
  final String? clientRatingInBusiness;
  final int? price;
  final int? payamout;
  final String? email;
  final String? city;
  final String? phone;
  final String? altPhone;
  final String? address;
  final String? pincode;
  final String? sender;
  final String? requirement;
  final String? costumerStatus;
  final String? status;
  final String? salesTLId;
  final String? salesHodId;
  final String? saleEmployeeId;
  final String? assignedTo;
  final String? assignedId;
  final String? notes;
  final String? createdAt;
  final String? updatedAt;
  final int? iV;

  CommonLeadModel({
    this.sId,
    this.leadStatus,
    this.leadSource,
    this.leadType,
    this.queryDate,
    this.senderName,
    this.contactPerson,
    this.concernedPerson,
    this.concernPersonName,
    this.company,
    this.remark,
    this.clientRatingInBusiness,
    this.price,
    this.payamout,
    this.email,
    this.city,
    this.phone,
    this.altPhone,
    this.address,
    this.pincode,
    this.sender,
    this.requirement,
    this.costumerStatus,
    this.status,
    this.salesTLId,
    this.salesHodId,
    this.saleEmployeeId,
    this.assignedTo,
    this.assignedId,
    this.notes,
    this.createdAt,
    this.updatedAt,
    this.iV,
  });

  /// From Pending Lead `Result` model
  factory CommonLeadModel.fromPendingLead(Result result) {
    return CommonLeadModel(
      sId: result.sId,
      leadStatus: result.leadStatus,
      leadSource: result.leadSource,
      leadType: result.leadType,
      queryDate: result.queryDate,
      senderName: result.senderName,
      contactPerson: result.contactPerson,
      concernedPerson: result.concernedPerson,
      concernPersonName: result.concernedPerson,
      company: result.company,
      remark: result.remark,
      clientRatingInBusiness: result.clientRatingInBusiness,
      price: result.price,
      payamout: result.payamout,
      email: result.email,
      // city: result.city,
      phone: result.phone,
      altPhone: result.phone,
      address: result.address,
      pincode: result.pinCode,
      sender: result.sender,
      requirement: result.requirement,
      costumerStatus: result.costumerStatus,
      status: result.status,
      salesTLId: result.salesTLId,
      salesHodId: result.salesHodId,
      saleEmployeeId: result.saleEmployeeId,
      notes: result.notes,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      iV: result.iV,
    );
  }

  /// From Sales Assigned `Updated` model
  factory CommonLeadModel.fromAssignedLead(Result updated) {
    return CommonLeadModel(
      sId: updated.sId,
      leadStatus: updated.leadStatus,
      leadSource: updated.leadSource,
      leadType: updated.leadType,
      queryDate: updated.queryDate,
      senderName: updated.senderName,
      contactPerson: updated.contactPerson,
      concernedPerson: updated.concernedPerson,
      company: updated.company,
      remark: updated.remark,
      clientRatingInBusiness: updated.clientRatingInBusiness,
      price: updated.price,
      payamout: updated.payamout,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      pincode: updated.pinCode,
      sender: updated.sender,
      requirement: updated.requirement,
      costumerStatus: updated.costumerStatus,
      status: updated.status,
      salesTLId: updated.salesTLId,
      saleEmployeeId: updated.saleEmployeeId,
      assignedTo: updated.assignedTo,
      assignedId: updated.assignedId,
      notes: updated.notes,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      iV: updated.iV,
    );
  }
}
