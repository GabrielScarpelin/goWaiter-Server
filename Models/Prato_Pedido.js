import { Sequelize, DataTypes } from "sequelize";
import { db } from "../db.js";
import { Prato } from "./Prato.js";
import { Pedido } from "./Pedido.js";
const Prato_Pedido = db.define('Pratos_pedidos', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ingredientes_excluidos: {
        type: DataTypes.JSON,
        allowNull: true
    },
    preparar: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    observacao: {
        type: DataTypes.STRING,
        allowNull: true
    }
})
Pedido.hasMany(Prato_Pedido)
Prato_Pedido.belongsTo(Pedido)
Prato.hasMany(Prato_Pedido)
Prato_Pedido.belongsTo(Prato)
export { Prato_Pedido }