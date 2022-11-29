import { db } from "../db.js";
import { Sequelize, DataTypes } from "sequelize";
import { Restaurante } from "./Restaurante.js";
const Prato = db.define('Pratos', {
    id: {
        type: DataTypes.STRING, 
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    preco: {
        type: DataTypes.FLOAT(4,2),
        allow: false
    },
    ingredientes: {
        type: DataTypes.JSON,
        allowNull: true
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    disponivel: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    tempo_preparo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    acompanhamentos: {
        type: DataTypes.JSON,
        allowNull: true
    },
    uri_foto_prato: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    }
})
Restaurante.hasMany(Prato)
Prato.belongsTo(Restaurante)
export { Prato }