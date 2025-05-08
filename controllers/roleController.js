import jwt from "jsonwebtoken";
import Role from "../models/Role.js";

export const getRoles = async (req, res) => {
    try {
    const roles = await Role.find({});
    res.status(200).json(roles);
  } catch (error) {
    console.error("Failed to fetch data:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const addRole = async (req, res) => {
  try {
    const { roleName, permissions } = req.body;

    // Validate roleName and permissions
    if (!roleName) {
      return res.status(400).json({ message: "Role name is required." });
    }
    if (
      !permissions ||
      !Array.isArray(permissions) ||
      permissions.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Permissions are required and must be an array." });
    }
    for (const permission of permissions) {
      if (!permission.tableName || !permission.accessType) {
        return res.status(400).json({
          message: "Each permission must have tableName and accessType.",
        });
      }
    }

    // Normalize roleName to lowercase
    const normalizedRoleName = roleName.toLowerCase();

    // Check if the role already exists
    const existingRole = await Role.findOne({ roleName: normalizedRoleName });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    // Create a new role
    const newRole = new Role({
      roleName: normalizedRoleName,
      permissions, // Array of tableName and accessType objects
    });

    // Save the role to the database
    await newRole.save();

    res.status(201).json({
      success: true,
      message: "Role added successfully",
      data: newRole,
    });
  } catch (error) {
    console.error("Error adding role:", {
      error: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: "Internal server error" });
  }
};
