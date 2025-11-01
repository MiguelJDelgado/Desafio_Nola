import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ProductSale = sequelize.define("ProductSale", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  sale_id: DataTypes.BIGINT,
  product_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  base_price: DataTypes.NUMERIC(12,2),
  total_price: DataTypes.NUMERIC(12,2),
  observations: DataTypes.TEXT
}, {
  tableName: "product_sales",
  freezeTableName: true,
  timestamps: false
});

export default ProductSale;
