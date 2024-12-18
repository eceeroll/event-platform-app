import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/User";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    gender,
    city,
    birthDate,
    phoneNumber,
    interests,
  } = req.body;

  console.log(req.body);

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      username,
      gender,
      city,
      birthDate,
      interests,
      phoneNumber,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully.", user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      try {
        if (err) {
          console.error("Passport authentication error:", err);
          return res.status(500).json({ message: "Server Error" });
        }

        if (!user) {
          return res.status(401).send(info?.message || "User not found");
        }

        req.logIn(user, { session: false }, (err) => {
          if (err) {
            console.error("Error during login:", err);
            return res.status(500).json({ message: "Giriş hatası." });
          }

          // JWT Token oluşturma
          const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username },
            process.env.JWT_SECRET!,
            {
              expiresIn: "24h",
            }
          );

          return res.json({
            message: "Login successful",
            token,
            user,
          });
        });
      } catch (err) {
        console.error("Error during authentication:", err);
        return res.status(500).json({ message: "Server error." });
      }
    }
  )(req, res, next);
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // email sistemde kayıtlı mı?
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.status(200).json({ message: "Password Reset link has been sent" });
    } else {
      res.status(404).json({ message: "User not found with this email" });
    }
  } catch (err) {
    console.error("Server error", err);
    res.status(500).json({ message: "Server error" });
  }
};
