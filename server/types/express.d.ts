import * as express from "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      role: string;
      username: string;
    }
  }
}
