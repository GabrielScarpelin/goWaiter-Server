import { Sequelize } from "sequelize";
const db = new Sequelize('gowaiter', 'root', '', {
    logging: console.log,
    dialect: 'mysql',
    port: 3306
})
export { db }