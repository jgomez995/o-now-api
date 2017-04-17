var credentials = require('./credentials')
var eventos = require('./eventos')

var jwt = require('jsonwebtoken')
var express = require('express')
var bodyParser = require('body-parser') 
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var Router = express.Router()

Router.post('/auth', function(req, res) {
  // Consultamos desde BD si existe el apellido y la habitacion

// comparamos la consulta con el request
  if(credentials.lastname == req.body.lastname && credentials.room == req.body.room){
    // recuperamos la llave de encriptacion desde process.env.key
    var key = 'laclavesupersecretadeencriptacion'
    // creamos el token
    var token = jwt.sign(req.body, key, { expiresIn: '1h' });
    res.json({token: token})
  }else{
    // res.status(404)
    res.status(404).json({error: 'no se encuentra el huesped'})
  }
})

Router.get('/eventos', function(req, res) {
  // Consultamos desde BD si existe el apellido y la habitacion
    var fecha = new Date()

    var hoy = new Date().toISOString().slice(0, 19).replace('T', ' ')
    var manana = new Date(fecha.setTime( fecha.getTime() + 1 * 86400000 )).toISOString().slice(0, 19).replace('T', ' ')
    var pasadomanana = new Date(fecha.setTime( fecha.getTime() + 1 * 86400000 )).toISOString().slice(0, 19).replace('T', ' ')

    var fecha_hoy = hoy.slice(0,10);
    var fecha_man = manana.slice(0,10)
    var fecha_pas = pasadomanana.slice(0,10)

    var first = eventos.filter(function(eventos){return eventos.fecha.slice(0,10) == '2017-04-17' })
    var second = eventos.filter(function(eventos){return eventos.fecha.slice(0,10) == '2017-04-18' })
    var third = eventos.filter(function(eventos){return eventos.fecha.slice(0,10) == '2017-04-19' })
    // console.log(first)
    res.json({first: first, second: second, third:third})

})
app.use('/', Router)
app.listen(3000)