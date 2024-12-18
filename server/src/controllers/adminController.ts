import { Request, Response } from "express";
import User from "../models/User";
import Event from "../models/Event";

// Get event details
export const getEvent = async (req: Request, res: Response): Promise<any> => {
  const { eventId } = req.params;

  try {
    const event = await Event.findByPk(eventId);

    if (!event) return res.status(404).json({ message: "Event not found" });

    return res.status(200).json({ event });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get user details
export const getUser = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Approve an Event
export const approveEvent = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { eventId } = req.params;

  // Admin check
  //   if (req.user.role !== "admin") {
  //     return res
  //       .status(403)
  //       .json({ message: "You do not have permission to approve events" });
  //   }

  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.isApproved = true;
    await event.save();

    return res
      .status(200)
      .json({ message: "Event approved successfully", event });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update event
export const updateEventAdmin = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { eventId } = req.params;
  const { name, date, time, description, location, category } = req.body;

  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await event.update({
      name: name || event.name,
      date: date || event.date,
      time: time || event.time,
      description: description || event.description,
      location: location || event.location,
      category: category || event.category,
    });

    return res
      .status(200)
      .json({ message: "Event updated successfully.", event });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
};

// Delete event
export const deleteEventAdmin = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { eventId } = req.params;

  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    await event.destroy();

    return res.status(200).json({
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};
