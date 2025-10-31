import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Customer = sequelize.define("Customer", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_name: DataTypes.TEXT,
  email: DataTypes.TEXT,
  phone_number: DataTypes.TEXT,
  birth_date: DataTypes.DATE
}, {
  tableName: "customers",
  freezeTableName: true,
  timestamps: false
});

export default Customer;
