import { useState } from "react";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [players, setPlayers] = useState({ p1: "", p2: "" });

  return (
    <>
      {page === "home" && (
        <Home
          players={players}
          setPlayers={setPlayers}
          startGame={() => setPage("game")}
          exitGame={() => setPlayers({ p1: "", p2: "" })}
        />
      )}

      {page === "game" && (
        <Game
          players={players}
          goHome={() => setPage("home")}
        />
      )}
    </>
  );
}

/* ---------------- HOME PAGE ---------------- */

function Home({ players, setPlayers, startGame, exitGame }) {
  return (
    <div className="container">
      <h1 className="title"> Tic-Tac-Toe</h1>

      <div className="rules">
        <h3>Rules</h3>
        <ul>
          <li>Player 1 uses X</li>
          <li>Player 2 uses O</li>
          <li>First to align 3 wins</li>
          <li>If all boxes fill → Draw</li>
        </ul>
      </div>

      <input
        placeholder="Player 1 Name"
        value={players.p1}
        onChange={(e) => setPlayers({ ...players, p1: e.target.value })}
      />

      <input
        placeholder="Player 2 Name"
        value={players.p2}
        onChange={(e) => setPlayers({ ...players, p2: e.target.value })}
      />

      <div className="btn-group">
        <button
          onClick={startGame}
          disabled={!players.p1 || !players.p2}
        >
          Start
        </button>
        <button onClick={exitGame}>Reset</button>
      </div>
    </div>
  );
}

/* ---------------- GAME PAGE ---------------- */

function Game({ players, goHome }) {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;

  const squares = history[currentMove];

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";

    const nextHistory = [...history, nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  const winner = calculateWinner(squares);
  const draw = !winner && squares.every(Boolean);

  let status;
  if (winner) {
    status = `Winner: ${winner === "X" ? players.p1 : players.p2}`;
  } else if (draw) {
    status = "Game Draw!";
  } else {
    status = `Next Player: ${xIsNext ? players.p1 : players.p2}`;
  }

  return (
    <div className="container">
      <h1 className="title">Tic-Tac-Toe</h1>

      <div className="board">
        {squares.map((val, i) => (
          <button
            key={i}
            className={`square ${val === "X" ? "x" : val === "O" ? "o" : ""}`}
            onClick={() => handleClick(i)}
          >
            {val}
          </button>
        ))}
      </div>

      <div className="status">{status}</div>

      {/* MOVE HISTORY */}
      <div className="history">
        <h3>Move History</h3>
        <ul>
          {history.slice(1).map((_, move) => (
            <li key={move}>
              Move {move + 1} by {move % 2 === 0 ? players.p1 : players.p2}
            </li>
          ))}
        </ul>
      </div>

      <div className="btn-group">
        <button onClick={() => {
          setHistory([Array(9).fill(null)]);
          setCurrentMove(0);
        }}>
          Replay
        </button>
        <button onClick={goHome}>Back</button>
      </div>
    </div>
  );
}


/* ---------------- LOGIC ---------------- */

function calculateWinner(sq) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of lines) {
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
      return sq[a];
    }
  }
  return null;
}
