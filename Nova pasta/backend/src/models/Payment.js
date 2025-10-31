import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Payment = sequelize.define("Payment", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  sale_id: DataTypes.BIGINT,
  payment_type_id: DataTypes.INTEGER,
  value: DataTypes.NUMERIC(12,2),
  is_online: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: "payments",
  freezeTableName: true,
  timestamps: false
});

export default Payment;
