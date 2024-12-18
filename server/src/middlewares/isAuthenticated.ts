import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Forbidden" });
    }
    (req as any).user = user;
    next();
  });
};

export default isAuthenticated;
