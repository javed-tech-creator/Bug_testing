class AddAdminProductWorksModelResponse {
  bool? success;
  String? message;
  Data? data;

  AddAdminProductWorksModelResponse({this.success, this.message, this.data});

  AddAdminProductWorksModelResponse.fromJson(Map<String, dynamic> json) {
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
  String? productId;
  List<Phases>? phases;
  bool? isDeleted;
  String? deletedAt;
  String? sId;
  String? createdAt;
  String? updatedAt;
  int? iV;

  Data(
      {this.productId,
        this.phases,
        this.isDeleted,
        this.deletedAt,
        this.sId,
        this.createdAt,
        this.updatedAt,
        this.iV});

  Data.fromJson(Map<String, dynamic> json) {
    productId = json['productId'];
    if (json['phases'] != null) {
      phases = <Phases>[];
      json['phases'].forEach((v) {
        phases!.add(new Phases.fromJson(v));
      });
    }
    isDeleted = json['isDeleted'];
    deletedAt = json['deletedAt'];
    sId = json['_id'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    iV = json['__v'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['productId'] = this.productId;
    if (this.phases != null) {
      data['phases'] = this.phases!.map((v) => v.toJson()).toList();
    }
    data['isDeleted'] = this.isDeleted;
    data['deletedAt'] = this.deletedAt;
    data['_id'] = this.sId;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    data['__v'] = this.iV;
    return data;
  }
}

class Phases {
  String? phaseName;
  List<Departments>? departments;

  Phases({this.phaseName, this.departments});

  Phases.fromJson(Map<String, dynamic> json) {
    phaseName = json['phaseName'];
    if (json['departments'] != null) {
      departments = <Departments>[];
      json['departments'].forEach((v) {
        departments!.add(new Departments.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['phaseName'] = this.phaseName;
    if (this.departments != null) {
      data['departments'] = this.departments!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Departments {
  String? departmentName;
  List<Works>? works;

  Departments({this.departmentName, this.works});

  Departments.fromJson(Map<String, dynamic> json) {
    departmentName = json['departmentName'];
    if (json['works'] != null) {
      works = <Works>[];
      json['works'].forEach((v) {
        works!.add(new Works.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['departmentName'] = this.departmentName;
    if (this.works != null) {
      data['works'] = this.works!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Works {
  String? workTitle;
  String? description;
  List<Tasks>? tasks;

  Works({this.workTitle, this.description, this.tasks});

  Works.fromJson(Map<String, dynamic> json) {
    workTitle = json['workTitle'];
    description = json['description'];
    if (json['tasks'] != null) {
      tasks = <Tasks>[];
      json['tasks'].forEach((v) {
        tasks!.add(new Tasks.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['workTitle'] = this.workTitle;
    data['description'] = this.description;
    if (this.tasks != null) {
      data['tasks'] = this.tasks!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Tasks {
  String? taskTitle;
  String? description;
  List<SubTasks>? subTasks;
  List<Activities>? activities;

  Tasks({this.taskTitle, this.description, this.subTasks, this.activities});

  Tasks.fromJson(Map<String, dynamic> json) {
    taskTitle = json['taskTitle'];
    description = json['description'];
    if (json['subTasks'] != null) {
      subTasks = <SubTasks>[];
      json['subTasks'].forEach((v) {
        subTasks!.add(new SubTasks.fromJson(v));
      });
    }


    if (json['activities'] != null) {
      activities = <Activities>[];
      json['activities'].forEach((v) {
        activities!.add(new Activities.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['taskTitle'] = this.taskTitle;
    data['description'] = this.description;
    if (this.subTasks != null) {
      data['subTasks'] = this.subTasks!.map((v) => v.toJson()).toList();
    }
    if (this.activities != null) {
      data['activities'] = this.activities!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class SubTasks {
  String? subTaskTitle;
  String? description;
  List<Activities>? activities;

  SubTasks({this.subTaskTitle, this.description, this.activities});

  SubTasks.fromJson(Map<String, dynamic> json) {
    subTaskTitle = json['subTaskTitle'];
    description = json['description'];
    if (json['activities'] != null) {
      activities = <Activities>[];
      json['activities'].forEach((v) {
        activities!.add(new Activities.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['subTaskTitle'] = this.subTaskTitle;
    data['description'] = this.description;
    if (this.activities != null) {
      data['activities'] = this.activities!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Activities {
  String? name;
  String? description;
  List<SubActivities>? subActivities;
  List<String>? instructions;
  List<String>? checklist;

  Activities(
      {this.name,
        this.description,
        this.subActivities,
        this.instructions,
        this.checklist});

  Activities.fromJson(Map<String, dynamic> json) {
    name = json['name'];
    description = json['description'];
    if (json['subActivities'] != null) {
      subActivities = <SubActivities>[];
      json['subActivities'].forEach((v) {
        subActivities!.add(new SubActivities.fromJson(v));
      });
    }
    instructions = json['instructions'].cast<String>();
    checklist = json['checklist'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['name'] = this.name;
    data['description'] = this.description;
    if (this.subActivities != null) {
      data['subActivities'] =
          this.subActivities!.map((v) => v.toJson()).toList();
    }
    data['instructions'] = this.instructions;
    data['checklist'] = this.checklist;
    return data;
  }
}

class SubActivities {
  String? subActivityTitle;
  String? description;
  List<String>? instructions;
  List<String>? checklist;

  SubActivities(
      {this.subActivityTitle,
        this.description,
        this.instructions,
        this.checklist});

  SubActivities.fromJson(Map<String, dynamic> json) {
    subActivityTitle = json['subActivityTitle'];
    description = json['description'];
    instructions = json['instructions'].cast<String>();
    checklist = json['checklist'].cast<String>();
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['subActivityTitle'] = this.subActivityTitle;
    data['description'] = this.description;
    data['instructions'] = this.instructions;
    data['checklist'] = this.checklist;
    return data;
  }
}
