class DeleteCompaignModelResponse {
  bool? success;
  String? message;
  String? deletedBy;

  DeleteCompaignModelResponse({this.success, this.message, this.deletedBy});

  DeleteCompaignModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    deletedBy = json['deletedBy'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['message'] = this.message;
    data['deletedBy'] = this.deletedBy;
    return data;
  }
}
