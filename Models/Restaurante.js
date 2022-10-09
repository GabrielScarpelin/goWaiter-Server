import { Sequelize, DataTypes } from "sequelize";
import { db } from "../db.js";
const Restaurante = db.define('Restaurantes', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    nome:{
        type: DataTypes.STRING,
        allowNull: false
    },
    endereco: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    longitude: {
        type: DataTypes.FLOAT(8, 3),
        allowNull: false
    },
    latitude: {
        type: DataTypes.FLOAT(8, 5),
        allowNull: false
    },
    mesas_total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hora_abertura: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fechar: {
        type: DataTypes.TIME,
        allowNull: false,
    }

})
export { Restaurante }