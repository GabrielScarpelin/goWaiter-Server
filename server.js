import express, { json } from 'express'
const app = express()
import {Mesa, Pedido, Prato_Pedido, Prato, Restaurante, Usuario} from './Models/index.js'
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get('/restaurantes', (request, response, next)=>{
    response.json(['empty'])
})
app.post('/cadastroUser', async (req, res)=>{
    const usuario = await Usuario.create({
        nome: req.body.nome,
        email: req.body.email,
        telefone: req.body.telefone,
        senha: req.body.senha
    })
    console.log(usuario)
    if (usuario){
        res.json({
            success: true
        })
    }
    else {
        res.json({
            success: false
        })
    }
})
app.listen(3333)