import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ChatRoom = sequelize.define("ChatRoom", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default ChatRoom;
