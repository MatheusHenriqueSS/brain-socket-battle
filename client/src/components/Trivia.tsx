import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function GetUsername() {
}

export function Trivia() {
    

    return (
        <main>
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
                <div className="chat__messages"></div>
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