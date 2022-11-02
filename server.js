String.prototype.haveLetter = function (findLetter){ //Adicionada ao prototipo do objeto da string para ter um método universal de verificar se aquela palavra contém determinada char
    for (let i = 0; i < this.length; i++){
        if (this.charAt(i) === findLetter) return true
    }
    return false
}

function formatarEnderecoParaUrl(endereco){
    const arrayEndereco = endereco.split(' ');
    const virgulaElementIndex = arrayEndereco.findIndex(e => e.haveLetter(','));
    arrayEndereco[virgulaElementIndex] = arrayEndereco[virgulaElementIndex].replace(',', '');
    const enderecoUrlFormated = arrayEndereco.join('+');
    return enderecoUrlFormated
}


import axios from 'axios'
import express, { json } from 'express'
import multer from 'multer'
import cors from 'cors'

const storageUser = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'upload/users/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now()+'-'+file.originalname)
    }
})
const storagePrato = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'upload/pratos/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now()+'-'+file.originalname)
    }
})
const storageRestaurante = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'upload/restaurantes/')
    },
    filename: function (req, file, cb){
        cb(null, Date.now()+'-'+file.originalname)
    }
})
const app = express()

import {Mesa, Pedido, Prato_Pedido, Prato, Restaurante, Usuario} from './Models/index.js'
import { Op, Sequelize, where } from 'sequelize'

app.use(express.json())
app.use('/upload', express.static('./upload'))
app.use(express.urlencoded())
app.use(cors())

app.post('/signin', async (request, response, next)=>{
    try {
        const searchUser = await Usuario.findOne({
            where: {
                email: request.body.email
            }
        })
        if (searchUser){
            const usuario = searchUser.get()
            if (usuario.email == request.body.email && usuario.senha == request.body.senha){
                response.json({logged: true, erro: false, user: usuario})
            }
            else{
                response.json({logged: false, erro: false})
            }
        }
        else{
            response.json({logged: false, erro: false})
        }
    }
    catch(e){
        response.json({logged: false, erro: true})
    }
})

const uploadUser = multer({ storage: storageUser })
app.post('/cadastrarUsuario', uploadUser.single('foto_usuario'), async (req, res)=>{
    const fileName = (()=>{
        try {
            return req.file.filename
        }
        catch(e){
            return null
        }
    })()
    const hasUser = await Usuario.findAll({
        where: {
            email: req.body.email
        }
    })
    if (hasUser.length > 0){
        res.json({created: false, duplicate: true})
    }
    else {
        const usuario = await Usuario.create({
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            senha: req.body.senha,
            uri_foto_usuario: `/upload/users/${fileName}`
        })
        if (usuario){
            res.json({
                created: true,
                duplicate: false
            })
        }
        else {
            res.json({
                created: false,
                duplicate: false
            })
        }
    }
})
const upload = multer({ storage: storageRestaurante })

app.post('/cadastrarRestaurante',upload.single('foto_restaurante'), async (req, res)=>{
    const fileName = (()=>{
        try {
            const file = req.file.filename
            return file
        }
        catch(e){
            return null
        }
    })()
    const enderecoUrlFormated = formatarEnderecoParaUrl(req.body.endereco)
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${enderecoUrlFormated}&apiKey=1rdJexgz_WchXIC95dii3eCEtl2sUAhnCK6pj3Z92dM`;
    const informacoesEndereco = await axios.get(url).then(response => response.data)
    const [latitude, longitude, CEP] = [informacoesEndereco.items[0].position.lat, informacoesEndereco.items[0].position.lng, informacoesEndereco.items[0].address.postalCode]
    const restaurante = await Restaurante.create({
        nome: req.body.nome,
        endereco: req.body.endereco,
        longitude,
        latitude,
        mesas_total: req.body.qtd_mesas,
        hora_abertura: `${req.body.hora_abertura}:${req.body.minuto_abertura}:00`,
        hora_fechar: `${req.body.hora_fechar}:${req.body.minuto_fechar}:00`,
        CEP,
        uri_foto_restaurante: `/upload/restaurantes/${fileName}`,
        categoria_principal: req.body.categoria
    })
    res.json(restaurante)
})

app.get('/termosDeUso', (req, res)=>{
    res.send('termo completo')
})



app.get('/restaurantes/:lat,:long', async (req, res)=>{
    let restaurantesList
    if (req.query.sortByCategory){
        restaurantesList = await Restaurante.findAll({
            where: {
                categoria_principal: req.query.sortByCategory
            },
            attributes: [
                'id',
                'nome',
                'endereco',
                'uri_foto_restaurante',
                'categoria_principal',
                [Sequelize.literal(`(6335*2*asin(sqrt(SIN(RADIANS((latitude-${req.params.lat})/2))*SIN(RADIANS((latitude-${req.params.lat})/2)) + (cos(radians(latitude)) * cos(radians(${req.params.lat})) * (sin(radians((longitude-${req.params.long})/2)) * sin(radians((longitude-${req.params.long})/2)))))))`), 'distance'],
            ],
            order: Sequelize.col('distance'),
            having: Sequelize.literal(`distance <= ${req.query.max || 10}`)
        })
    }
    else {
        restaurantesList = await Restaurante.findAll({

            attributes: [
                'id',
                'nome',
                'endereco',
                'uri_foto_restaurante',
                [Sequelize.literal(`(6335*2*asin(sqrt(SIN(RADIANS((latitude-${req.params.lat})/2))*SIN(RADIANS((latitude-${req.params.lat})/2)) + (cos(radians(latitude)) * cos(radians(${req.params.lat})) * (sin(radians((longitude-${req.params.long})/2)) * sin(radians((longitude-${req.params.long})/2)))))))`), 'distance'],
            ],
            order: Sequelize.col('distance'),
            having: Sequelize.literal(`distance <= ${req.query.max || 10}`)
        })
    }
    res.json(restaurantesList)
})

app.get('/pedidos', async (req, res)=>{
    const pedidosUsuario = await Pedido.findAll({
        where: {
            usuarioId: req.query.id
        },
        include: [{
            model: Restaurante,
            required: false,
            attributes: ['nome', 'endereco', 'uri_foto_restaurante']
        }]
    })
    res.json(pedidosUsuario)
})
app.patch('/userName', async (req, res)=>{
    const updateUsername = await Usuario.update({
        nome: req.body.newUserName
    }, {
        where: {
            id: req.body.id
        }
    })
    res.json({sucess: updateUsername[0] === 1 ? true : false})
})
app.patch('/userEmail', async (req, res)=>{
    console.log(req.body)
    const updateEmail = await Usuario.update({
        email: req.body.newEmail
    }, {
        where: {
            id: req.body.id,
            senha: req.body.senha
        }
    })
    res.json({sucess: updateEmail[0] === 1 ? true : false})
})
app.patch('/userPhone', async (req, res)=>{
    console.log(req.body)
    const updateUserPhone = await Usuario.update({
        telefone: req.body.newPhone
    }, {
        where: {
            id: req.body.id,
            senha: req.body.senha
        }
    })
    res.json({sucess: updateUserPhone[0] === 1 ? true : false})
})
app.patch('/userPassword', async (req, res)=>{
    console.log(req.body)
    const updatePassword = await Usuario.update({
        senha: req.body.newPassword
    }, {
        where: {
            id: req.body.id,
            senha: req.body.oldPassword
        }
    })
    res.json({sucess: updatePassword[0] === 1 ? true : false})
})
app.listen(3333)