import User from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const getUserInfo = async (
  req: Request,
  res: Response
): Promise<any> => {
  const userId = req.user.id;

  try {
    if (!userId) return res.status(404).json({ message: "User not found" });

    const user = await User.findByPk(userId);

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const {
    tcNo,
    firstName,
    lastName,
    username,
    email,
    gender,
    city,
    birthDate,
    phoneNumber,
    interests,
    role,
  } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({
      firstName,
      lastName,
      username,
      email,
      gender,
      city,
      birthDate,
      phoneNumber,
      interests,
      role,
    });

    return res
      .status(200)
      .json({ message: "User updated successfully.", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const userId = req.user.id;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords Does not match" });
  }

  try {
    const user = await User.findByPk(userId);

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be 8 characters or longer" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsersSortedByPoints = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const users = await User.findAll({
      order: [["points", "DESC"]],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
