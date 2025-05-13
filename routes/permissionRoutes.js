import express from "express";
import {getPermissions, addPermission, updatePermission, deletePermission} from "../controllers/permissionController.js"; // Fixed variable name
import protect from "../middleware/protect.js"; // Middleware for authentication
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

// Middleware to check if the user has one of the required roles
const rolesRequired = (roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({
      message: `Access denied. One of the following roles required: ${roles.join(
        ", "
      )}`,
    });
  }
  next();
};

router.get(
  "/:roleId/permissions", // ✅ Use GET for retrieving role permissions
  protect,
  rolesRequired(["superadmin"]),
  asyncHandler(getPermissions)
);

router.post(
  "/:roleId/permissions", // ✅ POST for adding a new permission
  protect,
  rolesRequired(["superadmin"]),
  asyncHandler(addPermission)
);

router.put(
  "/:roleId/permissions/:permissionId", // ✅ PUT for updating an existing permission
  protect,
  rolesRequired(["superadmin"]),
  asyncHandler(updatePermission)
);

router.delete(
  "/:roleId/permissions/:permissionId", // ✅ DELETE for removing a permission
  protect,
  rolesRequired(["superadmin"]),
  asyncHandler(deletePermission)
);

module.exports = router;

