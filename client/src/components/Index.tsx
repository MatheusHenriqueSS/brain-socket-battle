import React from "react";

export function Index() {
    return (
        <form className="registration-form" action="/trivia">
            <label htmlFor="player-name">Player name</label>
            <input
                id="player-name"
                placeholder="Player name"
                name="playerName"
                required
                type="text"
            />
            <label htmlFor="room">Room</label>
            <input
                id="room"
                name="room"
                placeholder="Room"
                required
                type="text"
            />
            <input
                className="btn registration-form__submit-btn"
                type="submit"
                value="Join"
            />
        </form>
    )
}