class VendorDashboardChartDataModelResponse {
  bool? success;
  Data? data;

  VendorDashboardChartDataModelResponse({this.success, this.data});

  VendorDashboardChartDataModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    return data;
  }
}

class Data {
  List<Sales>? sales;
  InvoiceStatus? invoiceStatus;
  int? totalInvoices;

  Data({this.sales, this.invoiceStatus, this.totalInvoices});

  Data.fromJson(Map<String, dynamic> json) {
    if (json['sales'] != null) {
      sales = <Sales>[];
      json['sales'].forEach((v) {
        sales!.add(new Sales.fromJson(v));
      });
    }
    invoiceStatus = json['invoiceStatus'] != null
        ? new InvoiceStatus.fromJson(json['invoiceStatus'])
        : null;
    totalInvoices = json['totalInvoices'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.sales != null) {
      data['sales'] = this.sales!.map((v) => v.toJson()).toList();
    }
    if (this.invoiceStatus != null) {
      data['invoiceStatus'] = this.invoiceStatus!.toJson();
    }
    data['totalInvoices'] = this.totalInvoices;
    return data;
  }
}

class Sales {
  String? label;
  int? totalSales;

  Sales({this.label, this.totalSales});

  Sales.fromJson(Map<String, dynamic> json) {
    label = json['label'];
    totalSales = json['totalSales'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['label'] = this.label;
    data['totalSales'] = this.totalSales;
    return data;
  }
}

class InvoiceStatus {
  Pending? pending;
  Pending? partial;
  Pending? paid;

  InvoiceStatus({this.pending, this.partial, this.paid});

  InvoiceStatus.fromJson(Map<String, dynamic> json) {
    pending =
    json['pending'] != null ? new Pending.fromJson(json['pending']) : null;
    partial =
    json['partial'] != null ? new Pending.fromJson(json['partial']) : null;
    paid = json['paid'] != null ? new Pending.fromJson(json['paid']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.pending != null) {
      data['pending'] = this.pending!.toJson();
    }
    if (this.partial != null) {
      data['partial'] = this.partial!.toJson();
    }
    if (this.paid != null) {
      data['paid'] = this.paid!.toJson();
    }
    return data;
  }
}

class Pending {
  int? count;
  String? percentage;

  Pending({this.count, this.percentage});

  Pending.fromJson(Map<String, dynamic> json) {
    count = json['count'];
    percentage = json['percentage'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['count'] = this.count;
    data['percentage'] = this.percentage;
    return data;
  }
}
