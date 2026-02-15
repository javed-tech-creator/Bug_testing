class VendorSingleInvoiceDraftModelResponse {
  bool? success;
  List<Draft>? draft;

  VendorSingleInvoiceDraftModelResponse({this.success, this.draft});

  VendorSingleInvoiceDraftModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    if (json['draft'] != null) {
      draft = <Draft>[];
      json['draft'].forEach((v) {
        draft!.add(new Draft.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    if (this.draft != null) {
      data['draft'] = this.draft!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Draft {
  String? sId;
  String? draftId;
  List<Items>? items;
  int? grandTotal;
  int? globalDiscount;
  String? globalDiscountType;
  String? invoiceDate;
  String? dueDate;
  String? customerId;
  String? createdBy;
  String? createdAt;
  String? updatedAt;
  int? iV;
  String? bankDetailId;

  Draft(
      {this.sId,
        this.draftId,
        this.items,
        this.grandTotal,
        this.globalDiscount,
        this.globalDiscountType,
        this.invoiceDate,
        this.dueDate,
        this.customerId,
        this.createdBy,
        this.createdAt,
        this.updatedAt,
        this.iV,
        this.bankDetailId});

  Draft.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
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
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
    bankDetailId = json['bankDetailId'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
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
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    data['bankDetailId'] = this.bankDetailId;
    return data;
  }
}

class Items {
  String? productName;
  int? quantity;
  double? rateUnit;
  double? netAmount;
  double? netAmountAfterDiscount;
  double? taxPrice;
  int? gstPercent;
  int? discount;
  double? priceWithTax;
  String? sId;

  Items(
      {this.productName,
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
