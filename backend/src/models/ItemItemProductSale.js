import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ItemItemProductSale = sequelize.define("ItemItemProductSale", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  item_product_sale_id: DataTypes.BIGINT,
  item_id: DataTypes.INTEGER,
  option_group_id: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER,
  additional_price: DataTypes.NUMERIC(12,2),
  price: DataTypes.NUMERIC(12,2)
}, {
  tableName: "item_item_product_sales",
  freezeTableName: true,
  timestamps: false
});

export default ItemItemProductSale;
