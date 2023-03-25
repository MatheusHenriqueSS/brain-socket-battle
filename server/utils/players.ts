
interface IPlayer {
    id: string,
    playerName: string,
    room: string
}

const players: IPlayer[] = [];


const addPlayers = ({id, playerName, room}: IPlayer) => {
    console.log(playerName, room);
    if(!playerName || !room) {
        return {
            error: new Error("Please enter a player name and room!")
        }
    }

    playerName = playerName.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingPlayer = players.find((player) => {
        return player.room === room && player.playerName === playerName;
    })

    if(existingPlayer) {
        return {
            error: new Error("Player name is in use!")
        }
    }

    const newPlayer= {id, playerName, room };
    players.push(newPlayer);

    return { newPlayer };
}

const getPlayer = (id: string) => {
    const player = players.find((player) => player.id === id);
    
    if(!player) {
        return {
            error: new Error("Player not found!")
        }
    }

    return { player };
}

const getAllPlayers = (room: string) => {
    return players.filter((player) => player.room === room);
}

const removePlayer = (id: string) => {
    return players.find((player, index) => {
        if(player.id === id) {
            return players.splice(index, 1)[0];
        }

        return false;
    })
}

export default {
    addPlayers, 
    getPlayer,
    getAllPlayers,
    removePlayer
}