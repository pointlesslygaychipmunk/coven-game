import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "./components/Layout";
import { initialGameState } from "./gameState";

const App = () => {
  const [gameState, setGameState] = useState(initialGameState);
  const [gameOver, setGameOver] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  return (
    <Layout
      gameState={gameState}
      setGameState={setGameState}
      gameOver={gameOver}
      setGameOver={setGameOver}
      scoreData={scoreData}
      setScoreData={setScoreData}
    />
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);