import ApiError from "../../../../utils/master/ApiError.js";
import User from "../../models/masters/user.model.js";
import mongoose from "mongoose";
import EmployeeProfile from "../../models/onboarding/employeeProfile.model.js";
import Branch from "../../models/masters/branch.model.js";
import Department from "../../models/masters/department.model.js";
import Designation from "../../models/masters/designation.model.js";
import Zone from "../../models/masters/zone.model.js";
import State from "../../models/masters/state.model.js";
import City from "../../models/masters/city.model.js";
import { sendNotification } from "../../../notification/controllers/notification.controller.js";
import ContractorProfile from "../../../admin/models/contractor.model.js";
import VendorProfile from "../../../admin/models/vendor.model.js";
import FreelancerProfile from "../../../admin/models/freelancer.model.js";
import { PROFILE_MAP } from "../../models/masters/user.model.js";
import ActionGroup from "../../models/masters/actionGroup.model.js";
import PartnerProfile from "../../../admin/models/partner.model.js";
import FranchiseProfile from "../../../admin/models/franchise.model.js";

export const validateReferenceExists = async (Model, id, name) => {
  if (!id || !Model || !name) return null;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `${name} ID is invalid`);
  }

  const doc = await Model.findById(id);
  if (!doc || doc.status === "Inactive") {
    throw new ApiError(400, `${name} Not Found Or Inactive`);
  }

  return doc;
};

export const registerUser = async (req, res, next) => {
  try {
    const {
      type,
      name,
      email,
      phone,
      whatsapp,
      altPhone,
      password,
      branch,
      department,
      designation,
      zone,
      state,
      actionGroups,
      city,
      profile,
      manageBy,
    } = req.body;

    console.log("req.body data are", req.body);

    // 1. Validate all required fields
    const requiredFields = {
      type,
      name,
      email,
      phone,
      whatsapp,
      password,
      branch,
      department,
      designation,
      zone,
      state,
      city,
      actionGroups,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length) {
      return next(
        new ApiError(
          400,
          `Missing required fields: ${missingFields.join(", ")}`
        )
      );
    }

    // 2. Validate email format
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return next(new ApiError(400, "Invalid email format"));
    }

    // 3. Validate phone numbers
    const phoneRegex = /^[0-9]{10,15}$/;
    if (phone && !phoneRegex.test(phone)) {
      return next(new ApiError(400, "Invalid phone number"));
    }
    if (whatsapp && !phoneRegex.test(whatsapp)) {
      return next(new ApiError(400, "Invalid WhatsApp number"));
    }

    // 4. Validate user type and profile model
    const profileModel = PROFILE_MAP[type]?.model;
    if (!profileModel) {
      return next(new ApiError(400, "Invalid user type"));
    }
    let profileDoc = null;
    if (profile) {
      const PROFILE_MODEL_INSTANCES = {
        EMPLOYEE: EmployeeProfile,
        VENDOR: VendorProfile,
        FREELANCER: FreelancerProfile,
        CONTRACTOR: ContractorProfile,
        PARTNER: PartnerProfile,
        FRANCHISE: FranchiseProfile,
      };

      const ProfileModel = PROFILE_MODEL_INSTANCES[type];
      if (!ProfileModel) {
        return next(new ApiError(400, "Invalid type for profile"));
      }

      profileDoc = await validateReferenceExists(
        ProfileModel,
        profile,
        `${type} Profile`
      );
    }
    if (profile && !profileDoc) {
      return next(new ApiError(400, `${type} Profile not found`));
    }

    // 6. Validate all references
    await validateReferenceExists(Branch, branch, "Branch");
    await validateReferenceExists(Department, department, "Department");
    await validateReferenceExists(Designation, designation, "Designation");
    await validateReferenceExists(Zone, zone, "Zone");
    await validateReferenceExists(State, state, "State");
    await validateReferenceExists(City, city, "City");

    // Validate actionGroups if provided
    if (actionGroups && actionGroups.length > 0) {
      for (const groupId of actionGroups) {
        await validateReferenceExists(ActionGroup, groupId, "Action Group");
      }
    }

    // Validate manageBy if provided
    if (manageBy) {
      console.log("Validating manageBy:", manageBy);
      await validateReferenceExists(User, manageBy, "Manager");
    }

    // 7. Check for duplicate users
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }, { whatsapp }],
    });

    if (existingUser) {
      return next(
        new ApiError(
          400,
          "User already exists with provided email, phone, or whatsapp number"
        )
      );
    }

    // 8. Create user - FIXED: Only create once
    const user = new User({
      type, // Add this missing field
      name,
      email: email.toLowerCase(),
      phone,
      whatsapp,
      altPhone,
      password,
      branch,
      department,
      designation,
      zone,
      state,
      city,
      profileModel, // Set profileModel
      profile: profile || null,
      actionGroups: actionGroups || [],
      manageBy: manageBy || null,
    });

    const savedUser = await user.save();
    await savedUser.populate("department designation branch");

    // 9. Generate tokens
    const accessToken = savedUser.generateAccessToken();
    const refreshToken = savedUser.generateRefreshToken();

    // 10. Save refresh token
    savedUser.refreshTokens.push({ token: refreshToken });
    await savedUser.save();

    // 11. Send welcome notification
    try {
      await sendNotification({
        channels: ["email"],
        userIds: [savedUser?._id],
        data: {
          title: "Welcome to Company",
          body: `<h2>Your account has been created</h2><br/>
                 <p><strong>User ID:</strong> ${
                   savedUser?.userId || "Pending"
                 }</p>
                 <p><strong>Password:</strong> ${password}</p>
                 <p><strong>Department:</strong> ${
                   savedUser?.department?.title || "-"
                 }</p>
                 <p><strong>Designation:</strong> ${
                   savedUser?.designation?.title || "-"
                 }</p>`,
        },
        options: { type: "transactional" },
      });
    } catch (err) {
      console.log("Notification error:", err);
      // Don't throw error, just log it
    }

    // 12. Return response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          _id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          phone: savedUser.phone,
          whatsapp: savedUser.whatsapp,
          altPhone: savedUser.altPhone,
          userId: savedUser.userId,
          type: savedUser.type,
          branch: savedUser.branch,
          department: savedUser.department,
          designation: savedUser.designation,
          zone: savedUser.zone,
          state: savedUser.state,
          city: savedUser.city,
          status: savedUser.status,
          manageBy: savedUser.manageBy || null,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// User Login
export const login = async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return next(new ApiError(400, "Email/Phone and Password are required"));
    }

    const user = await User.findOne({
      $or: [{ email: email?.toLowerCase() }, { phone }],
    })
      .populate("designation", "title")
      .populate("branch", "title")
      .populate("department", "title")
      .populate("zone", "title")
      .populate("state", "title")
      .populate("city", "title")
      .populate("profile");

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }
    if (user.status === "Deleted") {
      return next(new ApiError(403, "This account has been deleted"));
    }
    if (user.status === "Inactive") {
      return next(
        new ApiError(403, "This account is inactive. Please contact support.")
      );
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return next(
        new ApiError(
          403,
          `Account is locked. Try again after ${new Date(
            user.lockUntil
          ).toLocaleString()}`
        )
      );
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      // user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // if (user.failedLoginAttempts >= 5) {
      //   user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
      // }

      await user.save({ validateBeforeSave: false });

      // if (user.lockUntil) {
      //   return next(
      //     new ApiError(
      //       403,
      //       "Account locked due to too many failed attempts. Try again later."
      //     )
      //   );
      // }

      return next(new ApiError(401, "Invalid password"));
    }

    const permissions = await User.getPermissions(user._id);
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // user.refreshTokens.push({ token: refreshToken });
    user.lastLogin = new Date();
    user.isLogin = true;

    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "Unknown";
    const device = req.headers["user-agent"] || "Unknown";
    // user.loginHistory.push({ ip, device, timestamp: new Date() });

    const savedUser = await user.save();
    const cookieOptions = {
      expires: new Date(Date.now() + 3600 * 12000),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:  (process.env.NODE_ENV === "production")? "None" : "Lax",
    };
    const photo =
      savedUser.employeeProfile?.photo?.public_url ||
      savedUser.employeeProfile?.photo?.url ||
      null;

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .api(200, "Login successful", {
        user: {
          _id: savedUser._id,
          name: savedUser.employeeProfile?.name || savedUser.name,
          email: savedUser.email,
          phone: savedUser.phone,
          branch: savedUser.branch || null,
          department: savedUser.department || null,
          designation: savedUser.designation || null,
          zone: savedUser.zone || null,
          state: savedUser.state || null,
          city: savedUser.city || null,
          photo,
          type: savedUser.type,
          profileId: savedUser.profile?._id || null,
          permissions,
          status: savedUser.status,
        },
        accessToken,
        refreshToken,
      });
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal Server Error"));
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      type,
      phone,
      whatsapp,
      altPhone,
      candidate,
      branch,
      department,
      designation,
      zone,
      state,
      city,
      profile,
      actionGroups,
      manageBy,
    } = req.body;

    const user = await User.findById(id);
    if (!user) return next(new ApiError(404, "User not found"));

    // 1. Validate required fields
    const requiredFields = { name, email, phone, whatsapp };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length) {
      return next(
        new ApiError(
          400,
          `Missing required fields: ${missingFields.join(", ")}`
        )
      );
    }

    // 2. Validate formats
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return next(new ApiError(400, "Invalid email format"));

    const phoneRegex = /^[0-9]{10,15}$/;
    if (phone && !phoneRegex.test(phone))
      return next(new ApiError(400, "Invalid phone number"));
    if (whatsapp && !phoneRegex.test(whatsapp))
      return next(new ApiError(400, "Invalid WhatsApp number"));

    // 3. Validate referenced documents if provided
    const profileModel = PROFILE_MAP[type]?.model;
    if (!profileModel) {
      return next(new ApiError(400, "Invalid user type"));
    }
    let profileDoc = null;
    if (profile) {
      const PROFILE_MODEL_INSTANCES = {
        EMPLOYEE: EmployeeProfile,
        VENDOR: VendorProfile,
        FREELANCER: FreelancerProfile,
        CONTRACTOR: ContractorProfile,
        PARTNER: PartnerProfile,
        FRANCHISE: FranchiseProfile,
      };

      const ProfileModel = PROFILE_MODEL_INSTANCES[type];
      if (!ProfileModel) {
        return next(new ApiError(400, "Invalid type for profile"));
      }

      profileDoc = await validateReferenceExists(
        ProfileModel,
        profile,
        `${type} Profile`
      );
    }
    if (profile && !profileDoc) {
      return next(new ApiError(400, `${type} Profile not found`));
    }
    if (branch) await validateReferenceExists(Branch, branch, "Branch");
    if (department)
      await validateReferenceExists(Department, department, "Department");
    if (designation)
      await validateReferenceExists(Designation, designation, "Designation");
    if (zone) await validateReferenceExists(Zone, zone, "Zone");
    if (state) await validateReferenceExists(State, state, "State");
    if (city) await validateReferenceExists(City, city, "City");

    // 4. Check duplicates
    const duplicateUser = await User.findOne({
      _id: { $ne: id },
      $or: [{ email: email.toLowerCase() }, { phone }, { whatsapp }],
    });
    if (duplicateUser)
      return next(
        new ApiError(
          400,
          "Another user exists with same email, phone or whatsapp"
        )
      );

    // 5. Update fields
    Object.assign(user, {
      name,
      email: email.toLowerCase(),
      phone,
      whatsapp,
      altPhone,
      candidate,
      branch,
      department,
      designation,
      zone,
      state,
      type,
      city,
      profile,
      manageBy,
      actionGroups,
    });

    const updatedUser = await user.save();
    await updatedUser.populate("department designation");

    return res.api(200, "User updated successfully", {
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        whatsapp: updatedUser.whatsapp,
        altPhone: updatedUser.altPhone,
        userId: updatedUser.userId,
        branch: updatedUser.branch,
        department: updatedUser.department,
        designation: updatedUser.designation,
        zone: updatedUser.zone,
        state: updatedUser.state,
        city: updatedUser.city,
        status: updatedUser.status,
        type: updatedUser.type,
        manageBy: updatedUser.manageBy || null,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ status: { $ne: "Deleted" } })
      .populate("branch", "title")
      .populate("department", "title")
      .populate("designation", "title")
      .populate("zone", "title")
      .populate("state", "title")
      .populate("city", "title")
      .select(
        "title type name email phone userId status branch department designation zone state city createdAt"
      )
      .sort({ createdAt: -1 });

    if (!users.length) {
      return next(new ApiError(404, "No users found"));
    }

    return res.api(200, "Users fetched successfully", {
      count: users.length,
      users: users.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        userId: u.userId,
        type: u.type || null,
        department: u.department?.title || null,
        designation: u.designation?.title || null,
        branch: u.branch?.title || null,
        zone: u.zone?.title || null,
        state: u.state?.title || null,
        city: u.city?.title || null,
        status: u.status,
        createdAt: u.createdAt,
      })),
    });

    // res.api(200 , "Users fetched successfully" , users)
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal Server Error"));
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid user ID"));
    }

    const user = await User.findById(id)
      .populate("branch")
      .populate("department")
      .populate("designation")
      .populate("zone")
      .populate("state")
      .populate("city")
      .populate("profile")
      .populate("actionGroups")
      .populate({
        path: "manageBy",
        select: "name email phone userId designation",
        populate: {
          path: "designation",
          select: "title",
        },
      });

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    return res.api(200, "User fetched successfully", { user });
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal Server Error"));
  }
};

// /controllers/user.controller.js
export const patchUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["Active", "Inactive", "Deleted"];

    if (!status || !allowedStatus.includes(status)) {
      return next(new ApiError(400, "Invalid or missing status"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return next(new ApiError(404, "User not found"));
    }

    return res.status(200).json({
      success: true,
      message: "User status updated",
      data: updatedUser,
    });
  } catch (error) {
    console.error("PATCH Status Error:", error);
    next(new ApiError(500, error.message));
  }
};

export const getUserByCandidateOrEmployeeId = async (req, res, next) => {
  try {
    const { candidateId, userId } = req.query;

    if (!candidateId && !userId) {
      return next(new ApiError(400, "candidateId or userId required"));
    }

    const query = candidateId ? { candidate: candidateId } : { userId: userId };

    if (candidateId && !mongoose.isValidObjectId(candidateId)) {
      return next(new ApiError(400, "Invalid candidateId"));
    }
    if (userId && typeof userId !== "string") {
      return next(new ApiError(400, "Invalid userId"));
    }

    const user = await User.findOne(query)
      .populate("designation")
      .populate("branch")
      .populate("depId");

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }
    // hide sensitive info
    const {
      password,
      refreshTokens,
      failedLoginAttempts,
      lockUntil,
      __v,
      ...publicData
    } = user.toObject();

    res.status(200).json({ user: publicData });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

export const getUsersByLocation = async (req, res, next) => {
  try {
    const { zone, city, branch, dep, state } = req.query;

    const limit = parseInt(req.query.limit);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return next(new ApiError(400, "Limit should be between 1 and 100"));
    }
    const page = parseInt(req.query.page);
    if (isNaN(page) || page < 1 || page > 20) {
      return next(new ApiError(400, "Page should be between 1 and 20"));
    }

    const filter = { status: "Active" };
    if (zone) {
      if (!mongoose.isValidObjectId(zone))
        return next(new ApiError(400, "Invalid zone Id"));
      filter.zone = zone;
    }
    if (city) {
      if (!mongoose.isValidObjectId(city))
        return next(new ApiError(400, "Invalid city Id"));
      filter.city = city;
    }
    if (branch) {
      if (!mongoose.isValidObjectId(branch))
        return next(new ApiError(400, "Invalid branch Id"));
      filter.branch = branch;
    }
    if (dep) {
      if (!mongoose.isValidObjectId(dep))
        return next(new ApiError(400, "Invalid department Id"));
      filter.depId = dep;
    }
    if (state) {
      if (!mongoose.isValidObjectId(state))
        return next(new ApiError(400, "Invalid state Id"));
      filter.state = state;
    }

    const users = await User.find(filter)
      .select("-password -refreshTokens -failedLoginAttempts -lockUntil -__v")
      .skip(req.query.page ? (parseInt(req.query.page) - 1) * limit : 0)
      .limit(limit);

    res.status(200).json({ users });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

export const getUsersByLocationMinimal = async (req, res, next) => {
  try {
    const { zone, city, branch, dep, state } = req.query;

    const filter = { status: "Active" };
    if (zone) {
      if (!mongoose.isValidObjectId(zone))
        return next(new ApiError(400, "Invalid zone Id"));
      filter.zone = zone;
    }
    if (city) {
      if (!mongoose.isValidObjectId(city))
        return next(new ApiError(400, "Invalid city Id"));
      filter.city = city;
    }
    if (branch) {
      if (!mongoose.isValidObjectId(branch))
        return next(new ApiError(400, "Invalid branch Id"));
      filter.branch = branch;
    }
    if (dep) {
      if (!mongoose.isValidObjectId(dep))
        return next(new ApiError(400, "Invalid department Id"));
      filter.depId = dep;
    }
    if (state) {
      if (!mongoose.isValidObjectId(state))
        return next(new ApiError(400, "Invalid state Id"));
      filter.state = state;
    }

    const users = await User.find(filter)
      .select("_id name designation")
      .populate("designation", "name");

    res.status(200).json({ users });
  } catch (err) {
    next(new ApiError(500, err.message));
  }
};

//  Hard Delete User by ID
export const hardDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid user ID"));
    }

    // ✅ Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    // ⚠️ Optional: Prevent deleting certain roles (e.g. Admin)
    // if (user.role === "Admin") {
    //   return next(new ApiError(403, "Admin accounts cannot be deleted"));
    // }

    // 🚮 Delete the user permanently
    await User.deleteOne({ _id: id });

    // ✅ Optionally, also clean related data (e.g. logs, tokens)
    // await LoginHistory.deleteMany({ userId: id });
    // await Notifications.deleteMany({ userId: id });

    return res.api(200, "User deleted permanently", {
      deletedUserId: id,
    });
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal Server Error"));
  }
};

export const getAllUsersByQuery = async (req, res, next) => {
  try {
    const {
      zoneId,
      branchId,
      stateId,
      departmentId,
      designationId,
      cityId,
      name,
      userId,
      email,
      phone,
      type,
      match = "and",
    } = req.query;

    // Base condition (not deleted)
    const baseFilter = { status: { $ne: "Deleted" } };

    // Build dynamic filters
    const filters = [];
    const allowedTypes = [
      "CONTRACTOR",
      "FREELANCER",
      "PARTNER",
      "EMPLOYEE",
      "VENDOR",
      "FRANCHISE",
    ];
    if (zoneId) filters.push({ zone: zoneId });
    if (branchId) filters.push({ branch: branchId });
    if (stateId) filters.push({ state: stateId });
    if (departmentId) filters.push({ department: departmentId });
    if (designationId) filters.push({ designation: designationId });
    if (cityId) filters.push({ city: cityId });
    if (userId) filters.push({ userId: new RegExp(userId, "i") });
    if (name) filters.push({ name: new RegExp(name, "i") });
    if (email) filters.push({ email: new RegExp(email, "i") });
    if (phone) filters.push({ phone: new RegExp(phone, "i") });
    if (type && allowedTypes.includes(type)) filters.push({ type });
    // Combine filters based on user choice
    const query =
      filters.length > 0
        ? {
            ...baseFilter,
            ...(match.toLowerCase() === "or"
              ? { $or: filters }
              : { $and: filters }),
          }
        : baseFilter;

    // Query database
    const users = await User.find(query)
      .populate("branch", "title")
      .populate("department", "title")
      .populate("designation", "title")
      .populate("zone", "title")
      .populate("state", "title")
      .populate("city", "title")
      .populate("profile", "name photo");

    if (!users.length) {
      return next(new ApiError(404, "No users found"));
    }

    return res.api(200, "Users fetched successfully", {
      count: users.length,
      users: users.map((u) => ({
        _id: u._id,
        name: u.name,
        type: u.type || null,
        email: u.email,
        phone: u.phone,
        userId: u.userId,
        department: u.department?.title || null,
        designation: u.designation?.title || null,
        branch: u.branch?.title || null,
        zone: u.zone?.title || null,
        state: u.state?.title || null,
        city: u.city?.title || null,
        status: u.status,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal Server Error"));
  }
};

//get user by query params
export const getAllUsersByQueryHigh = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      whatsapp,
      userId,
      type,
      branch,
      department,
      designation,
      zone,
      state,
      city,
      status,
      isActive,
      isVerified,
      lastLoginAfter,
      lastLoginBefore,
      createdAfter,
      createdBefore,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      match = "and",
      page = 1,
      limit = 10,
      includeProfile = "false",
      includePermissions = "false",
    } = req.query;

    const baseFilter = {};
    const filters = [];

    // 1. Name (ID or Name)
    if (name) {
      if (mongoose.isValidObjectId(name)) {
        filters.push({ _id: name });
      } else {
        filters.push({ name: new RegExp(name.trim(), "i") });
      }
    }

    // 2. Email
    if (email && typeof email === "string" && email.trim()) {
      filters.push({ email: new RegExp(email.trim(), "i") });
    }

    // 3. Phone
    if (phone && typeof phone === "string" && phone.trim()) {
      filters.push({ phone: new RegExp(phone.trim(), "i") });
    }

    // 4. WhatsApp
    if (whatsapp && typeof whatsapp === "string" && whatsapp.trim()) {
      filters.push({ whatsapp: new RegExp(whatsapp.trim(), "i") });
    }

    // 5. User ID (Employee ID)
    if (userId && typeof userId === "string" && userId.trim()) {
      filters.push({ userId: new RegExp(userId.trim(), "i") });
    }

    // 6. Type
    if (type) {
      const allowedTypes = [
        "CONTRACTOR",
        "FREELANCER",
        "PARTNER",
        "EMPLOYEE",
        "VENDOR",
      ];
      const typeValue = type.toUpperCase();

      if (!allowedTypes.includes(typeValue)) {
        return next(new ApiError(400, "Invalid user type"));
      }
      filters.push({ type: typeValue });
    }

    // 7. Branch (ID or Name)
    if (branch) {
      if (mongoose.isValidObjectId(branch)) {
        filters.push({ branch });
      } else {
        filters.push({
          "branch.name": new RegExp(branch.trim(), "i"),
        });
      }
    }

    // 8. Department (ID or Name)
    if (department) {
      if (mongoose.isValidObjectId(department)) {
        filters.push({ department });
      } else {
        filters.push({
          "department.title": new RegExp(department.trim(), "i"),
        });
      }
    }

    // 9. Designation (ID or Name)
    if (designation) {
      if (mongoose.isValidObjectId(designation)) {
        filters.push({ designation });
      } else {
        filters.push({
          "designation.title": new RegExp(designation.trim(), "i"),
        });
      }
    }

    // 10. Zone (ID or Name)
    if (zone) {
      if (mongoose.isValidObjectId(zone)) {
        filters.push({ zone });
      } else {
        filters.push({
          "zone.name": new RegExp(zone.trim(), "i"),
        });
      }
    }

    // 11. State (ID or Name)
    if (state) {
      if (mongoose.isValidObjectId(state)) {
        filters.push({ state });
      } else {
        filters.push({
          "state.name": new RegExp(state.trim(), "i"),
        });
      }
    }

    // 12. City (ID or Name)
    if (city) {
      if (mongoose.isValidObjectId(city)) {
        filters.push({ city });
      } else {
        filters.push({
          "city.name": new RegExp(city.trim(), "i"),
        });
      }
    }

    // 13. Status
    if (status) {
      const allowedStatuses = ["Active", "Inactive", "Deleted"];
      const statusValue =
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

      if (!allowedStatuses.includes(statusValue)) {
        return next(new ApiError(400, "Invalid status value"));
      }
      filters.push({ status: statusValue });
    }

    // 14. Active/Inactive (legacy support)
    if (isActive !== undefined) {
      if (!["true", "false", true, false].includes(isActive)) {
        return next(
          new ApiError(400, "Invalid isActive value. Use true/false.")
        );
      }
      filters.push({
        status:
          isActive === "true" || isActive === true ? "Active" : "Inactive",
      });
    }

    // 15. Verified status
    if (isVerified !== undefined) {
      if (!["true", "false", true, false].includes(isVerified)) {
        return next(
          new ApiError(400, "Invalid isVerified value. Use true/false.")
        );
      }
      filters.push({
        isVerified: isVerified === "true" || isVerified === true,
      });
    }

    // 16. Last Login Date Range
    if (lastLoginAfter || lastLoginBefore) {
      const dateFilter = {};

      if (lastLoginAfter) {
        const date = new Date(lastLoginAfter);
        if (isNaN(date.getTime())) {
          return next(new ApiError(400, "Invalid lastLoginAfter date format"));
        }
        dateFilter.$gte = date;
      }

      if (lastLoginBefore) {
        const date = new Date(lastLoginBefore);
        if (isNaN(date.getTime())) {
          return next(new ApiError(400, "Invalid lastLoginBefore date format"));
        }
        dateFilter.$lte = date;
      }

      filters.push({ lastLogin: dateFilter });
    }

    // 17. Created Date Range
    if (createdAfter || createdBefore) {
      const dateFilter = {};

      if (createdAfter) {
        const date = new Date(createdAfter);
        if (isNaN(date.getTime())) {
          return next(new ApiError(400, "Invalid createdAfter date format"));
        }
        dateFilter.$gte = date;
      }

      if (createdBefore) {
        const date = new Date(createdBefore);
        if (isNaN(date.getTime())) {
          return next(new ApiError(400, "Invalid createdBefore date format"));
        }
        dateFilter.$lte = date;
      }

      filters.push({ createdAt: dateFilter });
    }

    // 18. Text Search across multiple fields
    if (search && typeof search === "string" && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filters.push({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
          { whatsapp: searchRegex },
          { userId: searchRegex },
        ],
      });
    }

    // Combine filters using match strategy
    const query =
      filters.length > 0
        ? {
            ...baseFilter,
            ...(match.toLowerCase() === "or"
              ? { $or: filters }
              : { $and: filters }),
          }
        : baseFilter;

    // Exclude deleted users unless specifically requested
    if (!status || status !== "Deleted") {
      query.status = { $ne: "Deleted" };
    }

    // Pagination
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * pageSize;

    // Sorting
    const allowedSortFields = [
      "name",
      "email",
      "userId",
      "type",
      "status",
      "createdAt",
      "updatedAt",
      "lastLogin",
      "department",
      "designation",
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // Build population options
    const populateOptions = [
      { path: "branch", select: "name code" },
      { path: "department", select: "title description" },
      { path: "designation", select: "title level permissions" },
      { path: "zone", select: "name code" },
      { path: "state", select: "name code" },
      { path: "city", select: "name code" },
      { path: "manageBy", select: "name email userId" },
      { path: "actionGroups", select: "name description permissions" },
    ];

    // Conditionally include profile
    if (includeProfile === "true") {
      // Dynamic population based on profileModel
      populateOptions.push({
        path: "profile",
        select: "-__v -createdAt -updatedAt",
      });
    }

    // Query Database
    const [users, total] = await Promise.all([
      User.find(query)
        .populate(populateOptions)
        .select(
          "-password -refreshTokens -verificationCode -failedLoginAttempts -lockUntil -webPushSubscription -meta"
        )
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),

      User.countDocuments(query),
    ]);

    // Get permissions if requested
    let usersWithPermissions = users;
    if (includePermissions === "true") {
      usersWithPermissions = await Promise.all(
        users.map(async (user) => {
          try {
            const permissions = await User.getPermissions(user._id);
            return {
              ...user,
              permissions,
            };
          } catch (error) {
            return {
              ...user,
              permissions: {
                crud: [],
                workflow: [],
                data: [],
                system: [],
              },
            };
          }
        })
      );
    }

    // Calculate additional statistics
    const stats = await User.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] },
          },
          verifiedUsers: {
            $sum: { $cond: ["$isVerified", 1, 0] },
          },
          usersByType: {
            $push: {
              type: "$type",
              status: "$status",
            },
          },
        },
      },
      {
        $project: {
          totalUsers: 1,
          activeUsers: 1,
          verifiedUsers: 1,
          employeeCount: {
            $size: {
              $filter: {
                input: "$usersByType",
                as: "user",
                cond: { $eq: ["$$user.type", "EMPLOYEE"] },
              },
            },
          },
          vendorCount: {
            $size: {
              $filter: {
                input: "$usersByType",
                as: "user",
                cond: { $eq: ["$$user.type", "VENDOR"] },
              },
            },
          },
          contractorCount: {
            $size: {
              $filter: {
                input: "$usersByType",
                as: "user",
                cond: { $eq: ["$$user.type", "CONTRACTOR"] },
              },
            },
          },
        },
      },
    ]);

    // Response
    return res.api(200, "Users fetched successfully", {
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: pageNumber < Math.ceil(total / pageSize),
      hasPrevPage: pageNumber > 1,
      users: usersWithPermissions,
      stats: stats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        verifiedUsers: 0,
        employeeCount: 0,
        vendorCount: 0,
        contractorCount: 0,
      },
      filters: {
        applied: filters.length,
        matchStrategy: match,
      },
    });
  } catch (err) {
    console.error("Get users error:", err);
    return next(new ApiError(500, "Failed to fetch users"));
  }
};
