import * as React from 'react'
import Board from './Board'

interface Props {}
interface State {
    history: Array <any>
    xIsNext: boolean
}

export default class Game extends React.Component <Props, State> {
    constructor() {
        super()
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            xIsNext: true
        }
    }

    handleClick(i: any) {
        const history: Array <any> = this.state.history
        const current: any = history[history.length - 1]
        const squares : Array <string> = current.squares.slice()
        if (calculateWinner(squares) || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : '0'
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            xIsNext: !this.state.xIsNext
        })
    }

    render() {
        const history: Array <any> = this.state.history
        const current: any = history[history.length - 1]
        const winner: string = calculateWinner(current.squares)

        let status: string
        if (winner) {
            status = 'Winner: ' + winner
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0')
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
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        )
    }
}


function calculateWinner(squares: Array <any>) {
    const lines: Array <Array <number>> = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i: number = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
  return null
}