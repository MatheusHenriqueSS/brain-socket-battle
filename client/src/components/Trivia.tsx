import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { socket } from "../socket";

export function Trivia() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [username, setUsername] = useState("");
    const [chatMessages, setChatMessages] = useState(new Array<{playerName: string, text: string, createdAt: string}>());
    const roomRef = useRef("");

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
    
    useEffect(() => {
        initializeValues();
    }, [initializeValues]);


    return (
        <main>
            <h1 className="heading">{`Welcome to the Programming Trivia Game, ${username}`}</h1>
            <section className="section game-info"></section>
            <section className="section trivia">
                <h2 className="subheading">trivia</h2>
                <button className="btn trivia__question-btn">Get question</button>
                <button className="btn trivia__answer-btn" disabled>
                    Reveal Answer
                </button>
                <div className="trivia__question"></div>
                <div className="trivia__answers"></div>
                <form className="trivia__form">
                    <input
                        className="form__input trivia__answer"
                        name="answer"
                        placeholder="Your Answer"
                        autoComplete="off"
                        required
                    />
                    <input
                        className="btn trivia__submit-btn"
                        type="submit"
                        value="send"
                        disabled
                    />
                </form>
            </section>

            <section className="section chat">
                <h2 className="subheading">chat</h2>
                <div className="chat__messages">
                    {
                        chatMessages.map((message) => {
                            return (    
                                <div className="message">
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
                <form className="chat__form">
                <input
                    className="form__input chat__message"
                    name="message"
                    placeholder="Your Message"
                    required
                    autoComplete="off"
                />
                <input className="btn chat__submit-btn" type="submit" value="send" />
                </form>
        </section>
        </main>
    )
}