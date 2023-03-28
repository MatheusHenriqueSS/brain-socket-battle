import PlayerManager from "./players";
import axios from "axios";
import {decode} from "html-entities";

interface Status {
    score: {
        [playerName: string]: number
    },
    submissions: {
        [playerId: string]: boolean
    },
    winners: string[],
    correctAnswer: string,
    isRoundOver: boolean
}

const game: {
    prompt: {
        answers: string[],
        question: string,
        createdAt: number | null
    },
    status: Status
} = {
    prompt: {
        answers: [],
        question: "",
        createdAt: null
    },
    status: {
        submissions: {},
        score: {},
        winners: [],
        correctAnswer: "",
        isRoundOver: false
    }
}

interface IGameStatus {
    event: string,
    playerName?: string
}

const getGameStatus = (obj : IGameStatus) => {
    const { correctAnswer, isRoundOver, winners, score } = game.status;

    if (obj.event === "getAnswer" && isRoundOver) {
        winners.map((playerName, index) => {
            score[playerName] += 10 - index;
            
        })

    }

    if (obj.event ==="newPlayer" && obj.playerName) {
        score[obj.playerName] = 0;
    }

    return game.status;

}

const setGameStatus = ({ event, playerId, playerName, answer, room }: any) => {
    if ( event === "sendAnswer") {
        const { winners, submissions, correctAnswer } = game.status;

        if (!submissions[`${playerId}`]) {
            submissions[`${playerId}`] = true;
            if(answer === correctAnswer)winners.push(playerName);
        }

        
        game.status.isRoundOver = Object.keys(submissions).length === PlayerManager.getAllPlayers(room).length; 
    }

    return game.status;
}

const setGame = async () => {
    try {
        const response = await axios.get("https://opentdb.com/api.php?amount=1&category=18");

        const { correct_answer, incorrect_answers, question } = response.data.results[0];
        
        game.status.submissions = {};
        game.status.winners = [];
        game.status.correctAnswer = correct_answer;
        game.prompt = {
            answers: shuffle([correct_answer, ...incorrect_answers]).map((option) => decode(option)),
            question: decode(question),
            createdAt: new Date().getTime(),
        };

        return game;

    } catch(err) {
        console.log(err);
    }
}

const shuffle = (array: any[]) => {
    for (let end = array.length - 1; end > 0; end--) {
        let random  = Math.floor(Math.random() * (end + 1));
        [array[end], array[random]] = [array[random], array[end]];
    }

    return array;
};

export default {
    getGameStatus,
    setGameStatus,
    setGame
}