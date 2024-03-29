import * as net from "net";
import * as http from "http";
import { WebSocketServer } from "ws";

const port = process.env.PORT || 3000;

let computercraftSocket = false;
let pendingResponses = {};

let httpServer = false;
let netServer = false;

const waitForRequestConnections = () => {
    netServer = net.createServer((socket) => {
        console.log("Incoming request socket");

        if (!computercraftSocket) {
            console.log("Websocket connection lost!");
            socket.destroy();
            netServer.close();
            netServer = false;
            establishWebsocketConnection();
            return;
        }

        console.log("Websocket connection intact");

        socket.setEncoding("utf8");
        socket.on("data", (data) => {
            const requestID = Date.now() + "" + Math.random();
            pendingResponses[requestID] = socket;
            const requestText = requestID + "\r\n" + data.toString();

            console.log(requestText);

            computercraftSocket.send(requestText);
            console.log("Request forwarded to websocket");
        });
    });
    netServer.listen(port, () => {
        console.log("Request server started");
    });
};

const establishWebsocketConnection = () => {
    httpServer = http.createServer();
    httpServer.listen(port, () => {
        console.log("Websocket server started");
    });

    const wsServer = new WebSocketServer({ server: httpServer });
    wsServer.on("connection", (ws) => {
        console.log("Websocket connection established!");

        wsServer.close();
        httpServer.close();
        httpServer = false;

        console.log("Websocket server shut down");

        computercraftSocket = ws;
        computercraftSocket.on("message", (data) => {
            console.log("Received response from websocket");

            const dataString = data.toString();

            const requestID = dataString.substring(0, dataString.indexOf("\r\n"));
            const responseText = dataString.substring(dataString.indexOf("\r\n") + 2);

            console.log("Request ID: " + requestID);

            pendingResponses[requestID].end(responseText);
            delete pendingResponses[requestID];

            console.log("Replied with websocket response");
        });
        computercraftSocket.on("close", () => {
            computercraftSocket = false;
        });

        waitForRequestConnections();
    });
};

setInterval(() => {
    if (computercraftSocket) {
        computercraftSocket.send("KA");
    }
}, 30000)

establishWebsocketConnection();