const express = require('express')
const start = require('./helper/start')

const server = express()

server.get("/", (req, res) => {
    res.send("Hello World from server")
})

start(server)
