
class GetAdminProductSingleWorkDetailsModelResponse {
  bool? success;
  String? message;
  Data? data;

  GetAdminProductSingleWorkDetailsModelResponse({
    this.success,
    this.message,
    this.data,
  });

  factory GetAdminProductSingleWorkDetailsModelResponse.fromJson(
      Map<String, dynamic> json) =>
      GetAdminProductSingleWorkDetailsModelResponse(
        success: json['success'] as bool?,
        message: json['message'] as String?,
        data: json['data'] != null ? Data.fromJson(json['data']) : null,
      );

  Map<String, dynamic> toJson() => {
    'success': success,
    'message': message,
    if (data != null) 'data': data!.toJson(),
  };
}

// ---------------------------------------------------------------
//  DATA (top level)
// ---------------------------------------------------------------
class Data {
  String? sId;               // "_id"
  ProductId? productId;
  List<Phase>? phases;
  String? createdAt;
  int? iV;                   // "__v"

  Data({
    this.sId,
    this.productId,
    this.phases,
    this.createdAt,
    this.iV,
  });

  factory Data.fromJson(Map<String, dynamic> json) => Data(
    sId: json['_id'] as String?,
    productId: json['productId'] != null
        ? ProductId.fromJson(json['productId'])
        : null,
    phases: json['phases'] != null
        ? (json['phases'] as List)
        .map((e) => Phase.fromJson(e))
        .toList()
        : null,
    createdAt: json['createdAt'] as String?,
    iV: json['__v'] as int?,
  );

  Map<String, dynamic> toJson() => {
    '_id': sId,
    if (productId != null) 'productId': productId!.toJson(),
    if (phases != null) 'phases': phases!.map((e) => e.toJson()).toList(),
    'createdAt': createdAt,
    '__v': iV,
  };
}

// ---------------------------------------------------------------
//  PRODUCT ID (the product that owns the works)
// ---------------------------------------------------------------
class ProductId {
  ProductImage? productImage;
  String? sId;               // "_id"
  String? title;
  String? description;
  String? alias;
  String? productId;         // the short code, e.g. "PRD017"
  String? createdAt;
  int? iV;                   // "__v"

  ProductId({
    this.productImage,
    this.sId,
    this.title,
    this.description,
    this.alias,
    this.productId,
    this.createdAt,
    this.iV,
  });

  factory ProductId.fromJson(Map<String, dynamic> json) => ProductId(
    productImage: json['productImage'] != null
        ? ProductImage.fromJson(json['productImage'])
        : null,
    sId: json['_id'] as String?,
    title: json['title'] as String?,
    description: json['description'] as String?,
    alias: json['alias'] as String?,
    productId: json['productId'] as String?,
    createdAt: json['createdAt'] as String?,
    iV: json['__v'] as int?,
  );

  Map<String, dynamic> toJson() => {
    if (productImage != null) 'productImage': productImage!.toJson(),
    '_id': sId,
    'title': title,
    'description': description,
    'alias': alias,
    'productId': productId,
    'createdAt': createdAt,
    '__v': iV,
  };
}

// ---------------------------------------------------------------
//  PRODUCT IMAGE
// ---------------------------------------------------------------
class ProductImage {
  String? url;          // "url"
  String? publicUrl;    // "public_url"

  ProductImage({this.url, this.publicUrl});

  factory ProductImage.fromJson(Map<String, dynamic> json) => ProductImage(
    url: json['url'] as String?,
    publicUrl: json['public_url'] as String?,
  );

  Map<String, dynamic> toJson() => {
    'url': url,
    'public_url': publicUrl,
  };
}

// ---------------------------------------------------------------
//  PHASE
// ---------------------------------------------------------------
class Phase {
  String? phaseName;
  List<Department>? departments;

  Phase({this.phaseName, this.departments});

  factory Phase.fromJson(Map<String, dynamic> json) => Phase(
    phaseName: json['phaseName'] as String?,
    departments: json['departments'] != null
        ? (json['departments'] as List)
        .map((e) => Department.fromJson(e))
        .toList()
        : null,
  );

  Map<String, dynamic> toJson() => {
    'phaseName': phaseName,
    if (departments != null)
      'departments': departments!.map((e) => e.toJson()).toList(),
  };
}

// ---------------------------------------------------------------
//  DEPARTMENT
// ---------------------------------------------------------------
class Department {
  String? departmentName;
  List<Work>? works;

  Department({this.departmentName, this.works});

  factory Department.fromJson(Map<String, dynamic> json) => Department(
    departmentName: json['departmentName'] as String?,
    works: json['works'] != null
        ? (json['works'] as List).map((e) => Work.fromJson(e)).toList()
        : null,
  );

  Map<String, dynamic> toJson() => {
    'departmentName': departmentName,
    if (works != null) 'works': works!.map((e) => e.toJson()).toList(),
  };
}

// ---------------------------------------------------------------
//  WORK
// ---------------------------------------------------------------
class Work {
  String? workTitle;
  String? description;
  List<Task>? tasks;

  Work({this.workTitle, this.description, this.tasks});

  factory Work.fromJson(Map<String, dynamic> json) => Work(
    workTitle: json['workTitle'] as String?,
    description: json['description'] as String?,
    tasks: json['tasks'] != null
        ? (json['tasks'] as List).map((e) => Task.fromJson(e)).toList()
        : null,
  );

  Map<String, dynamic> toJson() => {
    'workTitle': workTitle,
    'description': description,
    if (tasks != null) 'tasks': tasks!.map((e) => e.toJson()).toList(),
  };
}

// ---------------------------------------------------------------
//  TASK
// ---------------------------------------------------------------
class Task {
  String? taskTitle;
  String? description;
  List<SubTask>? subTasks;      // present when type == "subtask"
  List<Activity>? activities;   // present when type != "subtask"

  Task({
    this.taskTitle,
    this.description,
    this.subTasks,
    this.activities,
  });

  factory Task.fromJson(Map<String, dynamic> json) => Task(
    taskTitle: json['taskTitle'] as String?,
    description: json['description'] as String?,
    subTasks: json['subTasks'] != null
        ? (json['subTasks'] as List).map((e) => SubTask.fromJson(e)).toList()
        : null,
    activities: json['activities'] != null
        ? (json['activities'] as List)
        .map((e) => Activity.fromJson(e))
        .toList()
        : null,
  );

  Map<String, dynamic> toJson() => {
    'taskTitle': taskTitle,
    'description': description,
    if (subTasks != null) 'subTasks': subTasks!.map((e) => e.toJson()).toList(),
    if (activities != null)
      'activities': activities!.map((e) => e.toJson()).toList(),
  };
}

// ---------------------------------------------------------------
//  SUB-TASK
// ---------------------------------------------------------------
class SubTask {
  String? subTaskTitle;
  String? description;
  List<Activity>? activities;   // activities **inside** a sub-task

  SubTask({this.subTaskTitle, this.description, this.activities});

  factory SubTask.fromJson(Map<String, dynamic> json) => SubTask(
    subTaskTitle: json['subTaskTitle'] as String?,
    description: json['description'] as String?,
    activities: json['activities'] != null
        ? (json['activities'] as List)
        .map((e) => Activity.fromJson(e))
        .toList()
        : null,
  );

  Map<String, dynamic> toJson() => {
    'subTaskTitle': subTaskTitle,
    'description': description,
    if (activities != null)
      'activities': activities!.map((e) => e.toJson()).toList(),
  };
}

// ---------------------------------------------------------------
//  ACTIVITY (used in Task & SubTask)
// ---------------------------------------------------------------
class Activity {
  String? name;                     // "name" in the API
  String? description;
  List<SubActivity>? subActivities;
  List<String>? instructions;
  List<String>? checklist;

  Activity({
    this.name,
    this.description,
    this.subActivities,
    this.instructions,
    this.checklist,
  });

  factory Activity.fromJson(Map<String, dynamic> json) => Activity(
    name: json['name'] as String?,
    description: json['description'] as String?,
    subActivities: json['subActivities'] != null
        ? (json['subActivities'] as List)
        .map((e) => SubActivity.fromJson(e))
        .toList()
        : null,
    instructions: (json['instructions'] as List<dynamic>?)
        ?.cast<String>(),
    checklist:
    (json['checklist'] as List<dynamic>?)?.cast<String>(),
  );

  Map<String, dynamic> toJson() => {
    'name': name,
    'description': description,
    if (subActivities != null)
      'subActivities': subActivities!.map((e) => e.toJson()).toList(),
    'instructions': instructions,
    'checklist': checklist,
  };
}

// ---------------------------------------------------------------
//  SUB-ACTIVITY (nested inside Activity)
// ---------------------------------------------------------------
class SubActivity {
  String? subActivityTitle;
  String? description;
  List<String>? instructions;
  List<String>? checklist;

  SubActivity({
    this.subActivityTitle,
    this.description,
    this.instructions,
    this.checklist,
  });

  factory SubActivity.fromJson(Map<String, dynamic> json) => SubActivity(
    subActivityTitle: json['subActivityTitle'] as String?,
    description: json['description'] as String?,
    instructions: (json['instructions'] as List<dynamic>?)
        ?.cast<String>(),
    checklist:
    (json['checklist'] as List<dynamic>?)?.cast<String>(),
  );

  Map<String, dynamic> toJson() => {
    'subActivityTitle': subActivityTitle,
    'description': description,
    'instructions': instructions,
    'checklist': checklist,
  };
}