import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../config/database";
import { Interest } from "../enums/Interest";
import ParticipationHistory from "./ParticipationHistory";
import Event from "./Event";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare username: string;
  declare email: string;
  declare gender: "Female" | "Male";
  declare city: string;
  declare password: string;
  declare role: "user" | "admin";
  declare birthDate: Date;
  declare phoneNumber: string;
  declare interests: Interest[];
  declare points: number;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    gender: {
      type: DataTypes.ENUM("Female", "Male"),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
        len: [10, 12],
      },
    },
    interests: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

// User - Event - Many to Many relation
User.hasMany(Event, { foreignKey: "createdBy", as: "events" });
Event.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// User - participationHistory - many to many relation
User.hasMany(ParticipationHistory, {
  foreignKey: "userId",
  as: "participations",
});
ParticipationHistory.belongsTo(User, { foreignKey: "userId" });

export default User;
