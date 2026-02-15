class VendorBankDetailListModelResponse {
  bool? success;
  List<Data>? data;

  VendorBankDetailListModelResponse({this.success, this.data});

  VendorBankDetailListModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Data {
  String? sId;
  String? accountNumber;
  String? bankName;

  Data({this.sId, this.accountNumber, this.bankName});

  Data.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    accountNumber = json['accountNumber'];
    bankName = json['bankName'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['accountNumber'] = this.accountNumber;
    data['bankName'] = this.bankName;
    return data;
  }
}
