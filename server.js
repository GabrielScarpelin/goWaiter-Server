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
const app = express()
import {Mesa, Pedido, Prato_Pedido, Prato, Restaurante, Usuario} from './Models/index.js'
import { Op, Sequelize, where } from 'sequelize'

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get('/signin:email:senha', (request, response, next)=>{
    response.json(['empty'])
})
app.post('/cadastrarUsuario', async (req, res)=>{
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
app.post('/cadastrarRestaurante', async (req, res)=>{
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
        CEP
    })
    res.json(restaurante)
})
app.get('/restaurantes/:lat,:long', async (req, res)=>{
    const moreProximitySort = await Restaurante.findAll({

        attributes: [
            'id',
            'nome',
            'endereco',
            [Sequelize.literal(`(6335*2*asin(sqrt(SIN(RADIANS((latitude-${req.params.lat})/2))*SIN(RADIANS((latitude-${req.params.lat})/2)) + (cos(radians(latitude)) * cos(radians(${req.params.lat})) * (sin(radians((longitude-${req.params.long})/2)) * sin(radians((longitude-${req.params.long})/2)))))))`), 'distance'],
        ],
        order: Sequelize.col('distance'),
        having: Sequelize.literal(`distance <= ${req.query.max || 10}`)
    })
    res.json(moreProximitySort)
})
app.listen(3333)