import PlayerManager from "./players";
import axios from "axios";

interface Status {
    submissions: {
        [playerId: string]: string;
    },
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
        correctAnswer: "",
        isRoundOver: false
    }
}

const getGameStatus = ({event}: any) => {
    const { correctAnswer, isRoundOver } = game.status;

    if (event === "getAnswer" && isRoundOver) {
        return { correctAnswer };
    }
}

const setGameStatus = ({ event, playerId, answer, room }: any) => {
    if ( event === "sendAnswer") {
        const { submissions } = game.status;

        if (!submissions[`${playerId}`]) {
            submissions[`${playerId}`] = answer;
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
        game.status.correctAnswer = correct_answer;
        game.prompt = {
            answers: shuffle([correct_answer, ...incorrect_answers]),
            question,
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