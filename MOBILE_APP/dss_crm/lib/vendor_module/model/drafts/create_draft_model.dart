class VendorCreateDraftModelResponse {
  bool? success;
  String? message;
  Draft? draft;

  VendorCreateDraftModelResponse({this.success, this.message, this.draft});

  VendorCreateDraftModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    draft = json['draft'] != null ? new Draft.fromJson(json['draft']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['message'] = this.message;
    if (this.draft != null) {
      data['draft'] = this.draft!.toJson();
    }
    return data;
  }
}

class Draft {
  String? draftId;
  List<Items>? items;
  int? grandTotal;
  int? globalDiscount;
  String? globalDiscountType;
  String? invoiceDate;
  String? dueDate;
  String? customerId;
  String? createdBy;
  String? sId;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Draft(
      {this.draftId,
        this.items,
        this.grandTotal,
        this.globalDiscount,
        this.globalDiscountType,
        this.invoiceDate,
        this.dueDate,
        this.customerId,
        this.createdBy,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Draft.fromJson(Map<String, dynamic> json) {
    draftId = json['draftId'];
    if (json['items'] != null) {
      items = <Items>[];
      json['items'].forEach((v) {
        items!.add(new Items.fromJson(v));
      });
    }
    grandTotal = json['grandTotal'];
    globalDiscount = json['globalDiscount'];
    globalDiscountType = json['globalDiscountType'];
    invoiceDate = json['invoiceDate'];
    dueDate = json['dueDate'];
    customerId = json['customerId'];
    createdBy = json['createdBy'];
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['draftId'] = this.draftId;
    if (this.items != null) {
      data['items'] = this.items!.map((v) => v.toJson()).toList();
    }
    data['grandTotal'] = this.grandTotal;
    data['globalDiscount'] = this.globalDiscount;
    data['globalDiscountType'] = this.globalDiscountType;
    data['invoiceDate'] = this.invoiceDate;
    data['dueDate'] = this.dueDate;
    data['customerId'] = this.customerId;
    data['createdBy'] = this.createdBy;
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class Items {
  String? productId;
  String? productName;
  int? quantity;
  int? rateUnit;
  int? netAmount;
  int? netAmountAfterDiscount;
  int? taxPrice;
  int? gstPercent;
  int? discount;
  int? priceWithTax;
  String? sId;

  Items(
      {this.productId,
        this.productName,
        this.quantity,
        this.rateUnit,
        this.netAmount,
        this.netAmountAfterDiscount,
        this.taxPrice,
        this.gstPercent,
        this.discount,
        this.priceWithTax,
        this.sId});

  Items.fromJson(Map<String, dynamic> json) {
    productId = json['productId'];
    productName = json['productName'];
    quantity = json['quantity'];
    rateUnit = json['rateUnit'];
    netAmount = json['netAmount'];
    netAmountAfterDiscount = json['netAmountAfterDiscount'];
    taxPrice = json['taxPrice'];
    gstPercent = json['gstPercent'];
    discount = json['discount'];
    priceWithTax = json['priceWithTax'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['productId'] = this.productId;
    data['productName'] = this.productName;
    data['quantity'] = this.quantity;
    data['rateUnit'] = this.rateUnit;
    data['netAmount'] = this.netAmount;
    data['netAmountAfterDiscount'] = this.netAmountAfterDiscount;
    data['taxPrice'] = this.taxPrice;
    data['gstPercent'] = this.gstPercent;
    data['discount'] = this.discount;
    data['priceWithTax'] = this.priceWithTax;
    data['_id'] = this.sId;
    return data;
  }
}
