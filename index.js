var credentials = require('./credentials')
var eventos = require('./eventos')

var jwt = require('jsonwebtoken')
var express = require('express')
var bodyParser = require('body-parser')
var firebase = require('./firebase')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var Router = express.Router()

Router.post('/auth', function(req, res) {
  // Consultamos desde BD si existe el apellido y la habitacion
var userFound = credentials.find(function(user){
  return user.lastname == req.body.lastname
})
// comparamos la consulta con el request
  if(userFound.lastname == req.body.lastname && userFound.room == req.body.room){
    // recuperamos la llave de encriptacion desde process.env.key
    var key = 'laclavesupersecretadeencriptacion'
    // creamos el token
    var token = jwt.sign(req.body, key, { expiresIn: '1h' });
    res.json({token: token,details: userFound})
  }else{
    // res.status(404)
    res.status(404).json({error: 'no se encuentra el huesped'})
  }
})

Router.get('/eventos', function(req, res) {
  // Consultamos desde BD los eventos basados en los proximos dias
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

Router.get('/eventos/:eventId', function(req, res) {
  // Consultamos desde BD el id del evento seleccionado
    

    var evento = eventos.filter(function(eventos){return eventos.id == req.params.eventId })
    // console.log(first)
    res.json(evento)

})

Router.post('/send/msg', function(req, res) {
  // Consultamos desde BD el id del evento seleccionado
  // The topic name can be optionally prefixed with "/topics/".
  var topic = "GOC";

  // See the "Defining the message payload" section below for details
  // on how to define a message payload.
  var payload = {
    notification: {
      title: "Grand Oasis Cancun",
      body: "SHOWS"
    }
  };

  // Send a message to devices subscribed to the provided topic.
  firebase.messaging().sendToTopic(topic, payload)
    .then(function(response) {
      // See the MessagingTopicResponse reference documentation for the
      // contents of response.
      res.json({"success": response})
      console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
      res.json({"error": error})
      console.log("Error sending message:", error);
    });
    

})

Router.post('/favorites/add', function(req, res) {
  
    var user = req.body.user
    var section = req.body.section
    // Consultamos desde BD el id del evento seleccionado
    var evento = eventos.filter(function(eventos){return eventos.id == req.body.eventId })
    console.log(req.body)
    var db = firebase.database();
    var ref = db.ref("users/"+user+"/favorites/"+section).push();
    evento[0].key = ref.key
    ref.set(evento[0],function(error){
      if(error){
        res.json({error: error})
      }else{
        res.json({success: true})
      }
    })
})

app.use('/', Router)
app.listen(3000)


