import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Store = sequelize.define("Store", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.TEXT, allowNull: false },
  city: DataTypes.TEXT,
  state: DataTypes.TEXT,
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  is_own: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: "stores",
  freezeTableName: true,
  timestamps: false
});

export default Store;
