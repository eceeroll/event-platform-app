import { Sequelize } from "sequelize";

const sequelize = new Sequelize("event-app", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log,
});

export default sequelize;
