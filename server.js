import * as net from "net";
import * as http from "http";
import { WebSocketServer } from "ws";

const port = process.env.PORT || 3000;

let computercraftSocket = false;
let pendingResponses = {};

// const netServer = createServer((socket) => {

//     if (!computercraftSocket) {
//         socket.destroy();
//         return;
//     }

//     socket.setEncoding("utf8")
//     socket.on("data", (data) => {
//         const requestID = Date.now() + Math.random();
//         pendingResponses[requestID] = socket;
//         const requestText = requestID + "\r\n" + data.toString();

//         console.log(requestText);

//         computercraftSocket.send(requestText);
//     });
// });

let httpServer = http.createServer((req, res) => {});

// netServer.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

const wsServer = new WebSocketServer({ server: httpServer });
wsServer.on("connection", (ws) => {
    console.log("Websocket connection!");
    httpServer.close();

    if (!computercraftSocket) {
        computercraftSocket = ws;
        computercraftSocket.on("message", (data) => {
            const requestID = data.substring(0, data.indexOf("\r\n"));
            const requestText = data.substring(data.indexOf("\r\n") + 2);

            pendingResponses[requestID].end(requestText);
            pendingResponses.delete(requestID);
        });
        computercraftSocket.on("close", () => {
            computercraftSocket = false;
            httpServer = http.createServer((req, res) => {});
        })
    }
});