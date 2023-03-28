## Brain Socket Battle
This is a multiplayer programming trivia game where players can join a game room and compete with each other by answering programming-related questions.
![image](https://user-images.githubusercontent.com/46387641/227793947-dba9b4c6-d42c-4a8e-ac50-67ce349ad197.png)

### Installation
Clone the repository and install dependencies:
```
  git clone https://github.com/MatheusHenriqueSS/brain-socket-battle.git
  cd programming-trivia-game
  ```
  In the server: 
  ```
    cd server
    npm install
  ```
  In the client
  ```
    cd client
    npm install
  ```
  
### Usage
Start the server:
```
  cd server
  npm run dev
```
Start the client: 
```
  cd client
  npm start
```
This will start the application at http://localhost:3000.
To play the game, navigate to http://localhost:3000 in your browser. You will be prompted to enter a username and a room name. Once you enter this information, you will be directed to the game lobby, where you can see the list of players in the room and start the game.

When the game starts, any player can request a trivia question. All the players will be given multiple choice answers to the question. After all players have answered, the players can reveal the correct answer.

### Features
- Players can join a room with a username and compete against each other to answer programming-related questions
- Each round, a player chooses a question for everyone to answer
- Players can chat with each other in the same room during the game
- The game has a timer for each question, and the player who answers the question correctly in the shortest time wins the round
- At the end of each round, the correct answer is revealed, and the player with the most correct answers wins the game.

### Technologies Used
- React
- Node.js
- Socket.io
- Typescript

### Futher Development
- Allow players to create rooms setting question categories and difficulty level
- Set a time limit to answer the questions
- Set the options as clickable options and validate the correct answer for each problem
- Define a score for each player based on the order they answered
- Display winner of each round
