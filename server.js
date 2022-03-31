/* eslint-disable no-console */
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(morgan('dev'))

app.use(bodyParser.json({ limit: '500mb', type: 'application/json' }))
app.use(bodyParser.urlencoded({ limit: '256mb', extended: true }))

app.use('/api', express.static(path.join(__dirname, 'public')))

// port config
const port = 5000
const db = process.env.db

// Connect to Mongo
mongoose.set('debug', true)
mongoose
    .connect(db, {
        useNewUrlParser: true, // Adding new mongo url parser
        useUnifiedTopology: true,
    })
    .then(() => console.log(`MongoDB Connected to KPII Database`))
    .catch((err) => console.log(err))


// Require routes
require('./Routes/index.js')(app)

app.get('/', (req, res) => {
    res.send(`Hello!`)
})

// Express application will listen to port mentioned in our configuration
app.listen(port, (err) => {
    if (err) throw err
    console.log(`App listening on port ${port}`)
})
