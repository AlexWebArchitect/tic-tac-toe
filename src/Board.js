import React from 'react';
import Square from './Square';

export default class Board extends React.Component {
  renderSquare(i) {
    return ( 
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    var board = [];
    var rows = [];
    for (var i = 0; i < 9; i=i+3) {
      for (var j = i; j < i+3; j++) {
        rows.push(this.renderSquare(j));
      }
      board.push(
        <div key = {i} className="board-row">
          {rows[i]}
          {rows[i+1]}
          {rows[i+2]}
        </div>
      );
    }
    return (<div>{board}</div>);
  }
}