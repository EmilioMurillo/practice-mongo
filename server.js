const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://user:useruser1@ds257640.mlab.com:57640/migladi', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 4000, () => {
    console.log('listening on 4000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('creations').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {creations: result})
  })
})

app.get('/react', (req, res) => {
  db.collection('creations').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.json(result)
  })
})

app.post('/creations', (req, res) => {
  db.collection('creations').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/creations', (req, res) => {
  db.collection('creations')
  .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    $set: {
      thumbUp:req.body.thumbUp + 1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/creations', (req, res) => {
  db.collection('creations').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Creations deleted!')
  })
})
