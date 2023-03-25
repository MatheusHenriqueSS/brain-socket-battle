import express from "express";
import * as http from "http";
import { Server } from "socket.io";
import formatMessage from "../utils/formatMessage";
import PlayerManger from "../utils/players"

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

    socket.on('join', ({playerName, room}, callback) => {
        const { error, newPlayer } = PlayerManger.addPlayers({ id: socket.id, playerName, room });

        if(error) return callback(error.message);
        callback();

        socket.join(newPlayer.room);

        socket.emit('message', formatMessage('Admin', 'Welcome!'));

        socket.broadcast.to(newPlayer.room).emit('message', formatMessage('Admin', `${newPlayer.playerName} has joined the game!`));

        io.in(newPlayer.room).emit('room', {
            room: newPlayer.room,
            players: PlayerManger.getAllPlayers(newPlayer.room)
        })
    })

})


server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})