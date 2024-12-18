import express from "express";
import { Request, Response } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import isAdmin from "../middlewares/isAdmin";
import {
  approveEvent,
  deleteEventAdmin,
  getEvent,
  getUser,
  updateEventAdmin,
} from "../controllers/adminController";

const router = express.Router();

router.get("/users/:userId", isAuthenticated, isAdmin, getUser);
router.get("/events/:eventId", isAuthenticated, isAdmin, getEvent);
router.put("/events/approve/:eventId", isAuthenticated, isAdmin, approveEvent);
router.put(
  "/events/update/:eventId",
  isAuthenticated,
  isAdmin,
  updateEventAdmin
);
router.delete(
  "/events/delete/:eventId",
  isAuthenticated,
  isAdmin,
  deleteEventAdmin
);

export default router;
