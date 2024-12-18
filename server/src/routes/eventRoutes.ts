import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import {
  cancelJoinEvent,
  createEvent,
  deleteEvent,
  getAllEvents,
  getPersonalizedRecommendations,
  getUserEvents,
  getUserParticipatedEvents,
  joinEvent,
  updateEvent,
} from "../controllers/eventController";

const router = express.Router();

router.post("/create", isAuthenticated, createEvent);
router.put("/update/:eventId", isAuthenticated, updateEvent);
router.delete("/delete/:eventId", isAuthenticated, deleteEvent);
router.post("/join/:eventId", isAuthenticated, joinEvent);
router.get("/all", isAuthenticated, getAllEvents);
router.get("/my", isAuthenticated, getUserEvents);
router.get("/rec-events", isAuthenticated, getPersonalizedRecommendations);
router.get("/joined", isAuthenticated, getUserParticipatedEvents);
router.delete("/leave/:eventId", isAuthenticated, cancelJoinEvent);

export default router;
