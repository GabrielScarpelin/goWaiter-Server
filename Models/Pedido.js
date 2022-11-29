import { Sequelize, DataTypes } from "sequelize";
import { db } from "../db.js";
import { Mesa } from "./Mesa.js";
import { Restaurante } from "./Restaurante.js";
import { Usuario } from "./Usuario.js";
const Pedido = db.define('Pedidos', {
    num_pedido: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true
    },
    valor_pedido: {
        type: DataTypes.FLOAT(4, 2),
        allowNull: false
    },
    horario_reservado: {
        type: DataTypes.TIME,
        allowNull: false
    },
    data_reservada: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    observacao: {
        type: DataTypes.STRING,
        allowNull: true
    }
})
Usuario.hasMany(Pedido)
Pedido.belongsTo(Usuario)
Restaurante.hasMany(Pedido)
Pedido.belongsTo(Restaurante)
export { Pedido }