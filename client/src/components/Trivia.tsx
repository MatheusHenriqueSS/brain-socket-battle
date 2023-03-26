import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { socket } from "../socket";

interface IPlayer {
    id: string,
    playerName: string,
    room: string
}

interface IGameInfo {
    room: string,
    players: IPlayer[];
}

interface TriviaQuestion {
    playerName: string,
    prompt: string,
    answers: string[],
    createdAt: number
}

export function Trivia() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [username, setUsername] = useState("");
    const [chatMessages, setChatMessages] = useState(new Array<{playerName: string, text: string, createdAt: string}>());
    const [gameInfo, setGameInfo] = useState({} as IGameInfo);
    const [isSending, setIsSending] = useState(false);
    const roomRef = useRef("");
    const chatFormInputRef = useRef<HTMLInputElement>(null);
    const answerFormInputRef = useRef<HTMLInputElement>(null);
    const [questionDisplayed, setQuestionDisplayed] = useState(false);
    const [triviaQuestion, setTriviaQuestion] = useState({} as TriviaQuestion);
    const [submittedAnswer, setSubmittedAnswer] = useState(false);
    const [triviaAnswers, setTriviaAnswers] = useState(new Array<{playerName: string, text: string, createdAt: string}>())
    const [isRoundOver, setIsRoundOver] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState("");

    const getAnswer = () => {
        socket.emit('getAnswer', null ,(err: any) => {
            if (err) return alert(err);
        })
    }

    const getQuestion = () => {
        socket.emit("getQuestion", null, (error: any) => {
            if (error) return alert(error);
        })
    }

    const submitAnswer = (e: any) => {
        e.preventDefault();

        setSubmittedAnswer(true);

        const answer = e.target.elements.answer.value;

        socket.emit("sendAnswer", answer, (error: any) => {

            answerFormInputRef.current?.focus();
            answerFormInputRef.current!.value = ""

            if(error) alert(error.message);
        })
    }
    const handleChatSubmit = (e: any) => {
        e.preventDefault();

        setIsSending(true);

        const message = e.target.elements.message.value;

        socket.emit("sendMessage", message, (error: any) => {
            setIsSending(false);
            chatFormInputRef.current!.focus();
            chatFormInputRef.current!.value = "";

            if(error) return alert(error);
        })

    }

    const initializedRef = useRef(false);

    const initializeValues = useCallback(() => {
        if(!initializedRef.current) {
            const currentUsername = searchParams.get("playerName") || ""; 
            setUsername(currentUsername);
            roomRef.current = searchParams.get("room") || "";
            socket.emit('join', {playerName: currentUsername, room: roomRef.current}, (err: any) => {
                if(err) {
                    alert(err);
        
                }
            });

            initializedRef.current = true;
        }
    }, []);

    socket.on('message', ({ playerName, text, createdAt}) => {
        setChatMessages([...chatMessages, {playerName, text, createdAt}]);
    })

    socket.on('room', ({room, players}) => {
        setGameInfo({room, players});
    })

    socket.on('question', ({answers, createdAt, playerName, question}) => {
        setTriviaQuestion({
            playerName,
            prompt: question,
            answers,
            createdAt
        });
        setSubmittedAnswer(false);
        setIsRoundOver(false);
        setCorrectAnswer("");
    })
    
    useEffect(() => {
        initializeValues();
    }, [initializeValues]);

    socket.on("answer", ({text, createdAt, playerName, isRoundOver}) => {
        setTriviaAnswers([...triviaAnswers, {playerName, text, createdAt}]);
        setIsRoundOver(true);
    })

    socket.on("correctAnswer", ({text}) => {
        setCorrectAnswer(text);
    })


    return (
        <main>
            <h1 className="heading">{`Welcome to the Programming Trivia Game, ${username}`}</h1>
            <section className="section game-info">
                {Object.keys(gameInfo).length && 
                <div>
                    <h2 className="subheading"> game info </h2>
                    <h3> Room: {gameInfo.room}</h3>
                    <h3> Players: </h3>
                    <ul>
                        {gameInfo.players.map((player) => {
                            return (
                                <li key={player.playerName}>{player.playerName}</li>
                            )
                        })}
                    </ul>
                </div>
                }
            </section>
            <section className="section trivia">
                <h2 className="subheading">trivia</h2>
                <button className="btn trivia__question-btn"  disabled={questionDisplayed} onClick={() => getQuestion()}>Get question</button>
                <button className="btn trivia__answer-btn" onClick={() => getAnswer()} disabled={!isRoundOver}>
                    Reveal Answer
                </button>
                <div className="trivia__question">
                    { Object.keys(triviaQuestion).length && 
                    <div>
                        <p>
                            <span className="trivia__question-playername">{triviaQuestion.playerName} picked a question!</span>
                            <span className="trivia__question-meta">{new Date(triviaQuestion.createdAt).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                        </p>
                        <p>
                            {triviaQuestion.prompt}
                        </p>
                        <ul>
                        {triviaQuestion.answers.map((answer) => (
                            <li>{answer}</li>
                        ))}
                        </ul>
                    </div>
                    }

                </div>
                <div className="trivia__answers">
                {
                    !!correctAnswer && 
                    (<p className="trivia__correct-answer"> {`The correct answer is: ${correctAnswer}`}</p>)
                    }
                {
                        triviaAnswers.map((message) => {
                            return (    
                                <div key={message.createdAt} className="message">
                                    <p>
                                        <span className="message__playername"> {message.playerName} </span>
                                        <span className="message__meta"> {new Date(message.createdAt).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true })} </span>
                                    </p>
                                    <p>
                                        {message.text}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
                <form className="trivia__form" onSubmit={(e: any) => submitAnswer(e)}>
                    <input
                        ref={answerFormInputRef}
                        className="form__input trivia__answer"
                        name="answer"
                        placeholder="Your Answer"
                        autoComplete="off"
                        required
                    />
                    <input
                        className="btn trivia__submit-btn"
                        type="submit"
                        value="send"submit-btn
                        disabled={!questionDisplayed && submittedAnswer}
                        
                    />
                </form>
            </section>

            <section className="section chat">
                <h2 className="subheading">chat</h2>
                <div className="chat__messages">
                    {
                        chatMessages.map((message) => {
                            return (    
                                <div key={message.createdAt} className="message">
                                    <p>
                                        <span className="message__playername"> {message.playerName} </span>
                                        <span className="message__meta"> {new Date(message.createdAt).toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true })} </span>
                                    </p>
                                    <p>
                                        {message.text}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>
                <form className="chat__form" onSubmit={(e: any) => handleChatSubmit(e)}>
                <input
                    className="form__input chat__message"
                    name="message"
                    placeholder="Your Message"
                    required
                    autoComplete="off"
                    ref={chatFormInputRef}
                />
                <input className="btn chat__submit-btn" type="submit" value="send" disabled={isSending}/>
                </form>
        </section>
        </main>
    )
}