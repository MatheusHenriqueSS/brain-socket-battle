import React, { useEffect, useState } from 'react';
import './App.css';
import { socket } from "./socket";
import { Index } from './components/Index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Trivia } from './components/Trivia';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }


    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };

  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index/>}/>
          <Route path="/trivia" element={<Trivia/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
