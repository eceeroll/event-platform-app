import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";
import User from "./User";
import sequelize from "../config/database";
import { Interest } from "../enums/Interest";
import ParticipationHistory from "./ParticipationHistory";

class Event extends Model<
  InferAttributes<Event>,
  InferCreationAttributes<Event>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare date: Date;
  declare time: string;
  declare description: string;
  declare location: string;
  declare category: string;
  declare createdBy: ForeignKey<User["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare isApproved: boolean;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Event",
    tableName: "events",
    timestamps: false,
  }
);

export default Event;
