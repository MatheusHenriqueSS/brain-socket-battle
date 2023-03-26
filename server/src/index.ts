import express from "express";
import * as http from "http";
import { Server } from "socket.io";
import formatMessage from "../utils/formatMessage";
import PlayerManger from "../utils/players"
import Game from "../utils/game";

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

    socket.on('disconnect', () => {
        console.log("A player has disconnected");

        const disconnectedPlayer = PlayerManger.removePlayer(socket.id);

        if(disconnectedPlayer) {
            const { playerName, room } = disconnectedPlayer;
            io.in(room).emit(
                'message',
                formatMessage('Admin', `${playerName} has left!`)
            )

            io.in(room).emit('room', 
            {
                room,
                players: PlayerManger.getAllPlayers(room)
            })
        }
    })

    socket.on("sendMessage", (message, callback) => {
        const {error, player} = PlayerManger.getPlayer(socket.id);

        if (error) return callback(error.message);

        if (player) {
            io.to(player.room).emit(
                "message",
                formatMessage(player.playerName, message)
            )
        }
        callback();
    });

    socket.on("getQuestion", async (data, callback) => {
        const { error, player } = PlayerManger.getPlayer(socket.id);

        if (error) return callback(error.message);

        if (player) {
            const game = await Game.setGame();
            io.to(player.room).emit("question",
            {
                playerName: player.playerName,
                ...game!.prompt  
            })
        }
    })

    socket.on("sendAnswer", (answer, callback) => {
        const { error, player } = PlayerManger.getPlayer(socket.id);

        if (error) return callback(error.message);

        if (player) {
            const { isRoundOver } = Game.setGameStatus({
                event: "sendAnswer",
                playerId: player.id,
                room: player.room
            })

            io.to(player.room).emit("answer", {
                ...formatMessage(player.playerName, answer),
                isRoundOver
            })

            callback();
        }
    })

    socket.on("getAnswer", (data, callback) => {
        const {error, player} = PlayerManger.getPlayer(socket.id);

        if (error) return callback(error.message); 

        if (player) {
            const { correctAnswer } = Game.getGameStatus({ event: "getAnswer" })!;

            io.to(player.room).emit(
                "correctAnswer",
                formatMessage(player.playerName, correctAnswer)
            )
        }
    })

})


server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})