import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Sale = sequelize.define("Sale", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  store_id: DataTypes.INTEGER,
  channel_id: DataTypes.INTEGER,
  customer_id: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  sale_status_desc: DataTypes.TEXT,
  total_amount_items: DataTypes.NUMERIC(12,2),
  total_discount: DataTypes.NUMERIC(12,2),
  total_increase: DataTypes.NUMERIC(12,2),
  delivery_fee: DataTypes.NUMERIC(12,2),
  service_tax_fee: DataTypes.NUMERIC(12,2),
  total_amount: DataTypes.NUMERIC(12,2),
  value_paid: DataTypes.NUMERIC(12,2),
  production_seconds: DataTypes.INTEGER,
  delivery_seconds: DataTypes.INTEGER,
  people_quantity: DataTypes.INTEGER,
  discount_reason: DataTypes.TEXT,
  origin: DataTypes.TEXT
}, {
  tableName: "sales",
  freezeTableName: true,
  timestamps: false
});

export default Sale;
