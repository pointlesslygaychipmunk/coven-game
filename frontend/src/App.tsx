import React, { useState } from 'react';
import GameView from './components/GameView';
import type { GameState } from '../../shared/src/types';

const initialState: GameState = /* your initial mock gameState here */;

function App() {
  const [state, setState] = useState(initialState);

  return (
    <GameView state={state} dispatch={() => {}} />
  );
}

export default App;
