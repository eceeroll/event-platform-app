import sequelize from "../config/database";
import { ForeignKey, Model, DataTypes } from "sequelize";
import User from "./User";
import Event from "./Event";

class ParticipationHistory extends Model {
  declare userId: ForeignKey<User["id"]>;
  declare eventId: ForeignKey<Event["id"]>;
  declare joinDate: Date;
  Event: any;
}

ParticipationHistory.init(
  {
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    eventId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: Event, key: "id" },
    },
    joinDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "ParticipationHistory",
    tableName: "participation_history",
    timestamps: false,
  }
);

// Event - Participation History - Many to many relation
Event.hasMany(ParticipationHistory, {
  foreignKey: "eventId",
  as: "participants",
});
ParticipationHistory.belongsTo(Event, { foreignKey: "eventId" });

export default ParticipationHistory;
