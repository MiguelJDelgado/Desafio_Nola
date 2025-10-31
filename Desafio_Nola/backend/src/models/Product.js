import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  brand_id: DataTypes.INTEGER,
  category_id: DataTypes.INTEGER,
  name: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: "products",
  freezeTableName: true,
  timestamps: false
});

export default Product;
