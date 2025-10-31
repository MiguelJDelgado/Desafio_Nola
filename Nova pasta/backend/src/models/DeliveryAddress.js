import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const DeliveryAddress = sequelize.define("DeliveryAddress", {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  sale_id: DataTypes.BIGINT,
  delivery_sale_id: DataTypes.BIGINT,
  street: DataTypes.TEXT,
  number: DataTypes.TEXT,
  complement: DataTypes.TEXT,
  neighborhood: DataTypes.TEXT,
  city: DataTypes.TEXT,
  state: DataTypes.TEXT,
  postal_code: DataTypes.TEXT,
  latitude: DataTypes.DOUBLE,
  longitude: DataTypes.DOUBLE
}, {
  tableName: "delivery_addresses",
  freezeTableName: true,
  timestamps: false
});

export default DeliveryAddress;
