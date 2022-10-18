String.prototype.haveLetter = function (findLetter){ //Adicionada ao prototipo do objeto da string para ter um método universal de verificar se aquela letra contém determinada char
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
import formidableMiddleware from 'express-formidable'


const storageUser = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, '/upload/users/')
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


app.post('/cadastrarUsuario', async (req, res)=>{
    const hasUser = await Usuario.findAll({
        where: {
            email: req.body.email
        }
    })
    if (hasUser){
        res.json({created: false, duplicate: true})
    }
    else {
        const usuario = await Usuario.create({
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            senha: req.body.senha
        })
        console.log(usuario)
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
    const fileName = req.file.filename
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
        uri_foto_restaurante: `./upload/restaurantes/${fileName}`
    })
    res.json(restaurante)
})
app.get('/restaurantes/:lat,:long', async (req, res)=>{
    const moreProximitySort = await Restaurante.findAll({

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
    res.json(moreProximitySort)
})
app.listen(3333)