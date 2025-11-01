import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Channel = sequelize.define("Channel", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, allowNull: false },
  type: DataTypes.CHAR(1), // P ou D
}, {
  tableName: "channels",
  freezeTableName: true,
  timestamps: false
});

export default Channel;
