import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ItemProductSale = sequelize.define("ItemProductSale", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  product_sale_id: DataTypes.BIGINT,
  item_id: DataTypes.INTEGER,
  option_group_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  additional_price: DataTypes.NUMERIC(12,2),
  price: DataTypes.NUMERIC(12,2),
  observations: DataTypes.TEXT
}, {
  tableName: "item_product_sales",
  freezeTableName: true,
  timestamps: false
});

export default ItemProductSale;
