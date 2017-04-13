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

Router.post('/eventos', function(req, res) {
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
app.use('/', Router)
app.listen(3000)