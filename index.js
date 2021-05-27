
'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => //console.log(`Listening on ${PORT}`));

const wss = new Server({ server });
let boys = []
// const wss = new WebSocket.Server({port: 8082})

let games = []
let game = []

wss.on("connection", ws => {
    //console.log("new client")
    //console.log(wss.clients.size)
    game.push(ws)
    ws.on("close", () => {
        //console.log("client left")
        game.splice(game.indexOf(ws))
    })
    ws.on("message", data => {
        if (data >= 0) {
            // //console.log(data)
            // //console.log([game.indexOf(ws), game.length])

            let sjon = {
                "index":`${game.indexOf(ws)}`,
                "length":`${game.length}`
             }
            // //console.log(sjon)
            ws.publicID = data
            ws.send(JSON.stringify(sjon))
        } else {
            data = JSON.parse(data)
            data.players = wss.clients.size
            data = JSON.stringify(data)
            for (let t = 0; t < game.length; t++) {
                if(ws!=game[t]){
                    game[t].send(data)
                }
            }
        }
    })
})


