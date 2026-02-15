import RoleModel from "../../models/roles/role.model.js";

// CREATE Role
export const createRole = async (req, res) => {
  try {
    const { role, permissions } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    const roleExists = await RoleModel.findOne({ role });
    if (roleExists) {
      return res.status(409).json({
        success: false,
        message: "Role already exists",
      });
    }

    const newRole = await RoleModel.create({ role, permissions });

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: newRole,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET All Roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleModel.find();
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET Single Role by ID
export const getRoleById = async (req, res) => {
  try {
    const role = await RoleModel.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE Role
export const updateRole = async (req, res) => {
  try {
    const updated = await RoleModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE Role
export const deleteRole = async (req, res) => {
  try {
    const deleted = await RoleModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Role not found" });
    }

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
