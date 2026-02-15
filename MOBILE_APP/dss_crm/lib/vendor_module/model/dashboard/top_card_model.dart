class VendorDashboardTopCardDataModelResponse {
  bool? success;
  int? totalInvoices;
  int? totalProducts;
  int? totalSales;
  int? totalCustomers;

  VendorDashboardTopCardDataModelResponse(
      {this.success,
        this.totalInvoices,
        this.totalProducts,
        this.totalSales,
        this.totalCustomers});

  VendorDashboardTopCardDataModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    totalInvoices = json['totalInvoices'];
    totalProducts = json['totalProducts'];
    totalSales = json['totalSales'];
    totalCustomers = json['totalCustomers'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['totalInvoices'] = this.totalInvoices;
    data['totalProducts'] = this.totalProducts;
    data['totalSales'] = this.totalSales;
    data['totalCustomers'] = this.totalCustomers;
    return data;
  }
}
