class SalesTLAddMorningEveningReportingModelResponse {
  bool? success;
  String? message;
  Data? data;

  SalesTLAddMorningEveningReportingModelResponse({this.success, this.message, this.data});

  SalesTLAddMorningEveningReportingModelResponse.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    data = json['data'] != null ? new Data.fromJson(json['data']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    return data;
  }
}

class Data {
  Result? result;

  Data({this.result});

  Data.fromJson(Map<String, dynamic> json) {
    result =
    json['result'] != null ? new Result.fromJson(json['result']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    if (this.result != null) {
      data['result'] = this.result!.toJson();
    }
    return data;
  }
}

class Result {
  int? totalAmount;
  String? shift;
  int? totalLead;
  List<Hot>? hot;
  int? hotCount;
  List<Warm>? warm;
  int? warmCount;
  List<Cold>? cold;
  int? coldCount;
  List<Loss>? loss;
  int? lossCount;
  List<Win>? win;
  int? winCount;
  String? sId;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Result(
      {this.totalAmount,
        this.shift,
        this.totalLead,
        this.hot,
        this.hotCount,
        this.warm,
        this.warmCount,
        this.cold,
        this.coldCount,
        this.loss,
        this.lossCount,
        this.win,
        this.winCount,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Result.fromJson(Map<String, dynamic> json) {
    totalAmount = json['totalAmount'];
    shift = json['shift'];
    totalLead = json['totalLead'];
    if (json['hot'] != null) {
      hot = <Hot>[];
      json['hot'].forEach((v) {
        hot!.add(new Hot.fromJson(v));
      });
    }
    hotCount = json['hotCount'];
    if (json['Warm'] != null) {
      warm = <Warm>[];
      json['Warm'].forEach((v) {
        warm!.add(new Warm.fromJson(v));
      });
    }
    warmCount = json['warmCount'];
    if (json['cold'] != null) {
      cold = <Cold>[];
      json['cold'].forEach((v) {
        cold!.add(new Cold.fromJson(v));
      });
    }
    coldCount = json['coldCount'];
    if (json['Loss'] != null) {
      loss = <Loss>[];
      json['Loss'].forEach((v) {
        loss!.add(new Loss.fromJson(v));
      });
    }
    lossCount = json['lossCount'];
    if (json['win'] != null) {
      win = <Win>[];
      json['win'].forEach((v) {
        win!.add(new Win.fromJson(v));
      });
    }
    winCount = json['winCount'];
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['totalAmount'] = this.totalAmount;
    data['shift'] = this.shift;
    data['totalLead'] = this.totalLead;
    if (this.hot != null) {
      data['hot'] = this.hot!.map((v) => v.toJson()).toList();
    }
    data['hotCount'] = this.hotCount;
    if (this.warm != null) {
      data['Warm'] = this.warm!.map((v) => v.toJson()).toList();
    }
    data['warmCount'] = this.warmCount;
    if (this.cold != null) {
      data['cold'] = this.cold!.map((v) => v.toJson()).toList();
    }
    data['coldCount'] = this.coldCount;
    if (this.loss != null) {
      data['Loss'] = this.loss!.map((v) => v.toJson()).toList();
    }
    data['lossCount'] = this.lossCount;
    if (this.win != null) {
      data['win'] = this.win!.map((v) => v.toJson()).toList();
    }
    data['winCount'] = this.winCount;
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class Hot {
  String? companyName;
  int? amount;
  String? sId;

  Hot({this.companyName, this.amount, this.sId});

  Hot.fromJson(Map<String, dynamic> json) {
    companyName = json['companyName'];
    amount = json['amount'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['companyName'] = this.companyName;
    data['amount'] = this.amount;
    data['_id'] = this.sId;
    return data;
  }
}

class Warm {
  String? companyName;
  int? amount;
  String? sId;

  Warm({this.companyName, this.amount, this.sId});

  Warm.fromJson(Map<String, dynamic> json) {
    companyName = json['companyName'];
    amount = json['amount'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['companyName'] = this.companyName;
    data['amount'] = this.amount;
    data['_id'] = this.sId;
    return data;
  }
}

class Cold {
  String? companyName;
  int? amount;
  String? sId;

  Cold({this.companyName, this.amount, this.sId});

  Cold.fromJson(Map<String, dynamic> json) {
    companyName = json['companyName'];
    amount = json['amount'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['companyName'] = this.companyName;
    data['amount'] = this.amount;
    data['_id'] = this.sId;
    return data;
  }
}

class Loss {
  String? companyName;
  int? amount;
  String? sId;

  Loss({this.companyName, this.amount, this.sId});

  Loss.fromJson(Map<String, dynamic> json) {
    companyName = json['companyName'];
    amount = json['amount'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['companyName'] = this.companyName;
    data['amount'] = this.amount;
    data['_id'] = this.sId;
    return data;
  }
}

class Win {
  String? companyName;
  int? amount;
  String? sId;

  Win({this.companyName, this.amount, this.sId});

  Win.fromJson(Map<String, dynamic> json) {
    companyName = json['companyName'];
    amount = json['amount'];
    sId = json['_id'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['companyName'] = this.companyName;
    data['amount'] = this.amount;
    data['_id'] = this.sId;
    return data;
  }
}
