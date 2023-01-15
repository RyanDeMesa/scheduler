import { useState } from "react";

function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    const newHistory = [...history];

    if (replace) {
      newHistory.pop();
    };

    setHistory([...newHistory, newMode]);
  };

  function back() {
    if (history.length === 1) {
      return;
    }

    const newHistory = [...history];
    newHistory.pop(); 

    setHistory(newHistory); 
  };

  const mode = history[history.length - 1];
  return { mode, transition, back };
};


export default useVisualMode;