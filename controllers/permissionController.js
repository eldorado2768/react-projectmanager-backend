import Permission from "../models/Permission.js";

/** ✅ Get all permissions for a specific role */
export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find({ roleId: req.params.roleId });
    res.json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/** ✅ Add a new permission to a role */
export const addPermission = async (req, res) => {
  try {
    const { permissionDescription, tableName, permission } = req.body;

    // Validate input
    if (!permissionDescription || !tableName || !permission) {
      return res.status(400).json({
        message: "All fields are required: permissionDescription, tableName, and permission.",
      });
    }

    // Normalize tableName and permission to lowercase
    const normalizedTableName = tableName.toLowerCase();
    const normalizedPermission = permission.toLowerCase();

    // Check if the permission already exists
    const existingPermission = await Permission.findOne({
      roleId: req.params.roleId,
      tableName: normalizedTableName,
      permission: normalizedPermission,
    });
    if (existingPermission) {
      return res.status(400).json({ message: "Permission already exists" });
    }

    // Create and save the permission
    const newPermission = new Permission({
      roleId: req.params.roleId,
      permissionDescription,
      tableName: normalizedTableName,
      permission: normalizedPermission,
    });
    await newPermission.save();

    res.status(201).json({
      success: true,
      message: "Permission added successfully",
      permission: newPermission,
    });
  } catch (error) {
    console.error("Error adding permission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/** ✅ Update an existing permission */
export const updatePermission = async (req, res) => {
  try {
    const updatedPermission = await Permission.findByIdAndUpdate(
      req.params.permissionId,
      { name: req.body.name },
      { new: true }
    );

    if (!updatedPermission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    res.json(updatedPermission);
  } catch (error) {
    console.error("Error updating permission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/** ✅ Delete a permission */
export const deletePermission = async (req, res) => {
  try {
    const deletedPermission = await Permission.findByIdAndDelete(req.params.permissionId);
    if (!deletedPermission) {
      return res.status(404).json({ message: "Permission not found" });
    }
    res.json({ message: "Permission deleted successfully" });
  } catch (error) {
    console.error("Error deleting permission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
