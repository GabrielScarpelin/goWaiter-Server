import { Sequelize, DataTypes } from "sequelize";
import { db } from "../db.js";
import { Restaurante } from "./Restaurante.js";
const Mesa = db.define('Mesas', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    num_mesa: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})
Restaurante.hasMany(Mesa)
Mesa.belongsTo(Restaurante)
export { Mesa }