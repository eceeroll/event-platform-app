import { Request, Response, NextFunction } from "express";

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden (Admin Only)" });
  }
};

export default isAdmin;
