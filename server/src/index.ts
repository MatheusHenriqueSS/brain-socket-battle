import express from "express";
import * as http from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 3001;


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on('connection', (socket) => {
    console.log("A new player just connected");

    socket.on('foo', (data) => {
        console.log(data);

        io.emit('foo', data);
    })

})


server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})