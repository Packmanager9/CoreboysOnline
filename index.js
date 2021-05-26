const WebSocket = require("ws")
let boys = []
const wss = new WebSocket.Server({port: 8082})

let games = []
let game = []

wss.on("connection", ws => {
    console.log("new client")
    console.log(wss.clients.size)
    game.push(ws)
    ws.on("close", () => {
        console.log("client left")
        game.splice(game.indexOf(ws))
    })
    ws.on("message", data => {
        if(data <= 1 || data >= 0){
            console.log(data)
            console.log(game.length-1)
            ws.publicID = data
            ws.send(game.length-1)
        }else{
            for(let t = 0;t<Object.keys(game).length;t++){
                if(ws.publicID!=data[6]){
                    for(let t = 0;t<game.length;t++){
                        game[t].send(data)
                    }

                }
            }
        }
    })
})
