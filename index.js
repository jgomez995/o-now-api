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
    var first = eventos.filter(function(eventos){return eventos.fecha.slice(0,10) == '2017-04-17' })
    var second = eventos.filter(function(eventos){return eventos.fecha.slice(0,11) == '2017-04-18' })
    var third = eventos.filter(function(eventos){return eventos.fecha.slice(0.9) == '2017-04-19' })
    console.log(first)
    res.json({first: first, second: second, third:third})

})
app.use('/', Router)
app.listen(3000)