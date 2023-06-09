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
    socket.on('join', ({playerName, room}, callback) => {
        const { error, newPlayer } = PlayerManger.addPlayers({ id: socket.id, playerName, room, score: 0 });

        if(error) return callback(error.message);
        callback();

        if(newPlayer) {

            socket.join(newPlayer.room);

            socket.emit('message', formatMessage('Admin', 'Welcome!'));

            socket.broadcast.to(newPlayer.room).emit('message', formatMessage('Admin', `${newPlayer.playerName} has joined the game!`));

            const { score } = Game.getGameStatus({event: "newPlayer", playerName: newPlayer.playerName});

            io.in(newPlayer.room).emit('room', {
                room: newPlayer.room,
                players: Object.entries(score).sort((a, b) => {return b[1] - a[1]})
            })
        }
    })

    socket.on('disconnect', () => {
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

    socket.on("sendAnswer", ({answer, playerName}, callback) => {
        const { error, player } = PlayerManger.getPlayer(socket.id);

        if (error) return callback(error.message);

        if (player) {
            const { isRoundOver } = Game.setGameStatus({
                event: "sendAnswer",
                playerId: player.id,
                room: player.room,
                answer,
                playerName
            })


            if(isRoundOver) {
                const { correctAnswer, score } = Game.getGameStatus({ event: "getAnswer" })!;
                io.to(player.room).emit(
                    "correctAnswer",
                    formatMessage(player.playerName, correctAnswer)
                )

                io.to(player.room).emit(
                    "room",
                    {
                        room: player.room,
                        players: Object.entries(score).sort((a, b) => {return b[1] - a[1]})
                    }
                )
            }

            // io.to(player.room).emit("answer", {
            //     ...formatMessage(player.playerName, answer),
            //     isRoundOver
            // })

            callback();
        }
    })

    socket.on("getAnswer", (data, callback) => {
    })

})


server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})