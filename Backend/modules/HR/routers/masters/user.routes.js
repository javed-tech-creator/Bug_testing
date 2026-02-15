import express from "express";
import {
  registerUser,
  login,
  getUserByCandidateOrEmployeeId,
  getUsersByLocation,
  getUsersByLocationMinimal,
  getAllUsers,
  getUserById,
  updateUser,
  hardDeleteUser,
  getAllUsersByQuery,
  patchUserStatus,
} from "../../controllers/masters/user.controller.js";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";

const router = express.Router();

router.post("/register",  registerUser);
router.post("/login", login);

router.get("/", getAllUsers)
router.get("/query", getAllUsersByQuery)
router.get("/:id",getUserById)
router.put("/:id", updateUser)
router.patch("/:id", patchUserStatus)
router.delete("/:id", hardDeleteUser)


router.get("/by-candidate-employee", getUserByCandidateOrEmployeeId);

router.get("/by-location", getUsersByLocation);


router.get("/by-location-min", getUsersByLocationMinimal);

export default router;
