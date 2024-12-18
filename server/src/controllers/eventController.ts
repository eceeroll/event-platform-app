import { Request, Response } from "express";
import { Op } from "sequelize";
import Event from "../models/Event";
import User from "../models/User";
import ParticipationHistory from "../models/ParticipationHistory";

export const createEvent = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { name, time, description, date, location, category } = req.body;

  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!name || !date || !time || !location || !category || !description) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // check user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newEvent = await Event.create({
      name,
      time,
      description,
      date,
      location,
      category,
      createdBy: userId,
    });

    return res
      .status(201)
      .json({ message: "Event created successfully", newEvent });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateEvent = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { eventId } = req.params;
  const { name, date, time, description, location, category } = req.body;

  // current user
  const userId = req.user.id;

  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (userId !== event.createdBy) {
      return res.status(403).json({ message: "Forbidden" });
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

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { eventId } = req.params;
  const userId = req.user.id;

  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (event.createdBy !== userId) {
      return res.status(403).json({ message: "Forbidden" });
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

export const joinEvent = async (req: Request, res: Response): Promise<any> => {
  const userId = req.user?.id;
  const { eventId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already joined an event
    const existingParticipation = await ParticipationHistory.findOne({
      where: { userId, eventId },
    });

    if (existingParticipation) {
      return res
        .status(400)
        .json({ message: "Bu etkinliğe zaten kayıtlısınız!" });
    }

    const newParticipationHistory = await ParticipationHistory.create({
      userId,
      eventId,
      participationDate: new Date(),
    });

    user.points += 10;
    await user.save();

    res.status(201).json({
      message:
        "Etkinliğe katılımınız gerçekleştirilmiştir! 10 Puan kazandınız!",
      participationHistory: newParticipationHistory,
      updatedPoints: user.points,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to join event",
      error: error.message,
    });
  }
};

export const getUserEvents = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.user.id;

  if (!userId) return res.status(401).json({ message: "Forbidden" });
  try {
    const events = await Event.findAll({
      where: { createdBy: userId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ events, createdEventCount: events.length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const getPersonalizedRecommendations = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.user?.id;

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const participationHistory = await ParticipationHistory.findAll({
    where: { userId },
    attributes: ["eventId"],
  });

  const pastEventIds = participationHistory.map((record) => record.eventId);

  const recommendedEvents = await Event.findAll({
    where: {
      category: {
        [Op.in]: user.interests.map((interest) => interest.toString()),
      },

      id: {
        [Op.notIn]: pastEventIds, // Kullanıcının katılmadığı etkinlikler
      },
    },
  });

  return res.status(200).json({ recommendedEvents });
};

export const getUserParticipatedEvents = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Kullanıcı doğrulaması gerekli." });
  }

  try {
    const participatedEvents = await ParticipationHistory.findAll({
      where: { userId: userId },
      include: [
        {
          model: Event,
          attributes: ["id", "name", "date", "location", "time", "description"],
        },
      ],
    });

    if (participatedEvents.length === 0) {
      return res
        .status(404)
        .json({ message: "User doesnt participate any events" });
    }

    const joinedEventCount = await ParticipationHistory.count({
      where: { userId },
    });

    res.status(200).json({
      events: participatedEvents.map((participation) => participation.Event),
      joinedEventCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const cancelJoinEvent = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { eventId } = req.params;
  const userId = req.user.id;

  try {
    const participation = await ParticipationHistory.findOne({
      where: { userId, eventId },
    });

    if (!participation)
      return res
        .status(404)
        .json({ message: "No participation to this event." });

    await ParticipationHistory.destroy({
      where: { userId, eventId },
    });

    const user = await User.findByPk(userId);

    // delete points
    if (user.points > 0) {
      user.points -= 10;
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "Successfully cancelled participation" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllEvents = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const personalizedEvents = await Event.findAll({
      where: {
        category: {
          [Op.in]: user.interests.map((interest) => interest.toString()),
        },
      },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    const otherEvents = await Event.findAll({
      where: {
        category: {
          [Op.notIn]: user.interests.map((interest) => interest.toString()),
        },
      },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    const personalizedEventsWithFlag = personalizedEvents.map((event) => ({
      ...event.toJSON(),
      personalized: true,
    }));

    const otherEventsWithFlag = otherEvents.map((event) => ({
      ...event.toJSON(),
      personalized: false,
    }));

    const allEvents = [...personalizedEventsWithFlag, ...otherEventsWithFlag];

    return res.status(200).json({ events: allEvents });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
