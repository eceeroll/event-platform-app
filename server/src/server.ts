import express from "express";
import { Express } from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import session from "express-session";
import passport from "./config/passport";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import adminRoutes from "./routes/adminRoutes";
import isAuthenticated from "./middlewares/isAuthenticated";
import { Request, Response } from "express";
import isAdmin from "./middlewares/isAdmin";
import sequelize from "./config/database";
import cors from "cors";

import User from "./models/User";
dotenv.config();

const app: Express = express();

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.sendStatus(204); // No Content
});

app.use(
  session({
    secret: process.env.SECRET_KEY!,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", authRoutes);
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/admin", adminRoutes);

// DB connection
const createDbConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
    });
    console.log("MySQL bağlantısı başarılı!");
    return connection;
  } catch (error) {
    if (error instanceof Error) {
      console.error("MySQL bağlantı hatası:", error.message);
    } else {
      console.error("Bilinmeyen hata:", error);
    }
  }
};

createDbConnection();

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected successfully.");

    await sequelize.sync();

    // for development only
    // await sequelize.sync({ force: true });
    console.log("Tables have been created successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

app.get(
  "/dashboard",
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    return res.status(200).json({ message: "User Dashboard" });
  }
);

app.get(
  "/admin",
  isAuthenticated,
  isAdmin,
  async (req: Request, res: Response): Promise<any> => {
    return res.status(200).json({ message: "Admin Dashboard" });
  }
);

app.listen(process.env.PORT, () => {
  console.log("Server is running at PORT", process.env.PORT);
});
