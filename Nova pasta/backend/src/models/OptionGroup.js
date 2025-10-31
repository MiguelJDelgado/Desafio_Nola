import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const OptionGroup = sequelize.define("OptionGroup", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.TEXT
}, {
  tableName: "option_groups",
  freezeTableName: true,
  timestamps: false
});

export default OptionGroup;
