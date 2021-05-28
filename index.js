
'use strict';

const express = require('express');
const { Server, defaultMaxListeners } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });
let boys = []
// const wss = new WebSocket.Server({port: 8082})

let games = []
let game = []

wss.on("connection", ws => {
    ws.index = game.length
    game.push(ws)
    let pair = [game.length, -1]
    ws.pair = pair
    ws.on("close", () => {
        let deleter = ws.index

        let minarr = []
        for(let t = 0;t<game.length;t++){
            minarr.push(game[t].pair[1])
        }
        if(Math.max(...minarr) == -1){
            ws.pair[1] = 0
        }else{
            if(!minarr.includes(7)){
                ws.pair[1] = 7
            }
            if(!minarr.includes(6)){
                ws.pair[1] = 6
            }
            if(!minarr.includes(5)){
                ws.pair[1] = 5
            }
            if(!minarr.includes(4)){
                ws.pair[1] = 4
            }
            if(!minarr.includes(3)){
                ws.pair[1] = 3
            }
            if(!minarr.includes(2)){
                ws.pair[1] = 2
            }
            if(!minarr.includes(1)){
                ws.pair[1] = 1
            }
            if(!minarr.includes(0)){
                ws.pair[1] = 0
            }
        }
        game.splice(game.indexOf(ws), 1)
        for (let t = 0; t < game.length; t++) {
            let sjon = {
                "delete": `${ws.pair[1]}`,
                "index": `${t}`,
                "length": `${game.length}`
            }
            // sjon.minarr = minarr
            let ids = []
            for(let t = 0;t<game.length;t++){
                if(t != game.indexOf(ws)){
                    // console.log(game[t].serverID)
                    ids.push(game[t].serverID)
                }
            }
            sjon.playerIDs = ids
            
            game[t].send(JSON.stringify(sjon))
        }
    })
    ws.on("message", data => {
        if (data >= 0) {
            let minarr = []
            for(let t = 0;t<game.length;t++){
                minarr.push(game[t].pair[1])
            }
            if(Math.max(...minarr) == -1){
                ws.pair[1] = 0
            }else{
                if(!minarr.includes(7)){
                    ws.pair[1] = 7
                }
                if(!minarr.includes(6)){
                    ws.pair[1] = 6
                }
                if(!minarr.includes(5)){
                    ws.pair[1] = 5
                }
                if(!minarr.includes(4)){
                    ws.pair[1] = 4
                }
                if(!minarr.includes(3)){
                    ws.pair[1] = 3
                }
                if(!minarr.includes(2)){
                    ws.pair[1] = 2
                }
                if(!minarr.includes(1)){
                    ws.pair[1] = 1
                }
                if(!minarr.includes(0)){
                    ws.pair[1] = 0
                }
            }
            let sjon = {
                "index": `${game.indexOf(ws)}`,
                "length": `${game.length}`,
                "slot": `${ws.pair[1]}`
            }
            // sjon.minarr = minarr
            let storage = []
            for(let t = 0;t<game.length;t++){
                if(t != game.indexOf(ws)){
                    storage.push(game[t].storage)
                }
            }
            sjon.storage = storage
            ws.storage = storage
            ws.serverID = data
            ws.publicID = data
            let ids = []
            for(let t = 0;t<game.length;t++){
                if(t != game.indexOf(ws)){
                    ids.push(game[t].serverID)
                }
            }
            sjon.playerIDs = ids
            ws.send(JSON.stringify(sjon))
        } else {
            data = JSON.parse(data)
            data.players = wss.clients.size
            data.usedslots = []

            let minarr = []
            for(let t = 0;t<game.length;t++){
                minarr.push(game[t].pair[1])
            }
            if(Math.max(...minarr) == -1){
                ws.pair[1] = 0
            }else{
                if(!minarr.includes(7)){
                    ws.pair[1] = 7
                }
                if(!minarr.includes(6)){
                    ws.pair[1] = 6
                }
                if(!minarr.includes(5)){
                    ws.pair[1] = 5
                }
                if(!minarr.includes(4)){
                    ws.pair[1] = 4
                }
                if(!minarr.includes(3)){
                    ws.pair[1] = 3
                }
                if(!minarr.includes(2)){
                    ws.pair[1] = 2
                }
                if(!minarr.includes(1)){
                    ws.pair[1] = 1
                }
                if(!minarr.includes(0)){
                    ws.pair[1] = 0
                }
            }
            // data.minarr = minarr
            let ids = []
            for(let t = 0;t<game.length;t++){
                if(t != game.indexOf(ws)){
                    ids.push(parseFloat(game[t].serverID))
                }
            }
            data.playerIDs = ids
            data = JSON.stringify(data)
            for (let t = 0; t < game.length; t++) {
                if (ws != game[t]) {
                    data = JSON.parse(data)
                    data.serverID = ws.serverID
                    data = JSON.stringify(data)
                    game[t].send(data)
                }else{
                    game[t].storage = JSON.parse(data)
                    game[t].serverID = JSON.parse(data).serverID
                }
            }
        }
    })
})


