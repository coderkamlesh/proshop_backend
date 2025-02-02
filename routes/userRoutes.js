import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserByID,
  deleteUser,
  updateUser,
  logoutUser,
} from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser).get(protect, admin, getUsers);
router.post("/login", authUser);
router.post("/logout", protect, logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/:id")
  .get(protect, admin, getUserByID)
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUser);

export default router;
