import express from "express";
import {
  changePassword,
  getUserInfo,
  getUsersSortedByPoints,
  updateUser,
} from "../controllers/userController";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

router.put("/:id", isAuthenticated, updateUser);
router.post("/change-password", isAuthenticated, changePassword);
router.get("/info", isAuthenticated, getUserInfo);
router.get("/ranking", isAuthenticated, getUsersSortedByPoints);

export default router;
