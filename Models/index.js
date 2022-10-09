import { db } from "../db.js";
import { Restaurante } from "./Restaurante.js";
import { Usuario } from "./Usuario.js";
import { Mesa } from "./Mesa.js";
import { Prato } from "./Prato.js";
import { Prato_Pedido } from "./Prato_Pedido.js";
import { Pedido } from "./Pedido.js";

(async()=>{
  await db.sync()
})()
export { Restaurante, Usuario, Mesa, Prato, Prato_Pedido, Pedido }