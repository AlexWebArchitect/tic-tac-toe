import React from 'react';
import Board from './Board';
import MyComponent from './MyComponent';

export default class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      changed: [0],
      liClass: [0],
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const changed = this.state.changed.concat(i);
    const liClass = this.state.liClass.concat("");
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      changed: changed,
      liClass: liClass,
    });
  }

  jumpTo(step) {
    const changed = this.state.changed.slice(0, step+1);
    const liClass = this.state.liClass;
    liClass[step] = "bold";
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
      changed: changed,
      liClass: liClass,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const locations = ["(0, 1)", "(0, 2)", "(0, 3)",
      "(1, 1)", "(1, 2)", "(1, 3)",
      "(2, 1)", "(2, 2)", "(2, 3)"];
    const moves = history.map((step, move) => {
      const desc = move ?
        'Move #' + move + ' at ' + locations[this.state.changed[move]] :
        'Game start';
      return (
        <li key={move} className={this.state.liClass[move]}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });


    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <MyComponent />
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}