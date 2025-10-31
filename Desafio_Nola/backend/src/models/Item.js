import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Item = sequelize.define("Item", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  brand_id: DataTypes.INTEGER,
  category_id: DataTypes.INTEGER,
  name: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: "items",
  freezeTableName: true,
  timestamps: false
});

export default Item;
