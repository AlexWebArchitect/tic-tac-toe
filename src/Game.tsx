import * as React from 'react'
import Board from './Board'

interface Props {}
interface State {
    history: Array <any>
    stepNumber: number
    xIsNext: boolean
    changed: Array <number>
    liClass: Array <string>
    sorted: boolean
    sclass: Array <string>
}

export default class Game extends React.Component <Props, State> {
    constructor() {
        super()
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
            changed: [0],
            liClass: [""],
            sorted: false,
            sclass: Array(9).fill("square")
        }
    }

    handleClick(i: number): void {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares : Array <string> = current.squares.slice()
        const changed = this.state.changed.concat(i)
        const liClass = this.state.liClass.concat("")
        if (calculateWinner(squares) || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : '0'
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            changed: changed,
            liClass: liClass
        })
        this.highlight(squares)
    }

    jumpTo(step: number): void {
        const changed = this.state.changed.splice(0, step + 1)
        const liClass = this.state.liClass
        liClass[step] = "bold"
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
            changed: changed,
            liClass: liClass
        })
    }

    handleSort(): void {
        this.setState(prevState => ({
            sorted: !prevState.sorted
        }))
    }

    sortMoves(i: Array <any>) {
        if (this.state.sorted) {
            let sortedMoves = i.reverse()
            return sortedMoves
        }
        return i;
    }

    highlight(squares: Array <any>): void {
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
                const sclass = this.state.sclass
                sclass[a] = "win"
                sclass[b] = "win"
                sclass[c] = "win"
                this.setState({ sclass: sclass })
            }
        }
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        const sclass = this.state.sclass
        const locations: Array <string> = ["(0, 1)", "(0, 2)", "(0, 3)",
                           "(1, 1)", "(1, 2)", "(1, 3)",
                           "(2, 1)", "(2, 2)", "(2, 3)"];

        const moves = history.map((step: string, move: number) => {
            const desc: string = move
            ? 'Move #' + move + ' at ' + locations[this.state.changed[move]]
            : 'Game start'
            return (
                <li key={move} className={this.state.liClass[move]}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            )
        })

        let status: string
        if (winner) {
            status = 'Winner: ' + winner
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0')
        }

        const sorted = this.sortMoves(moves)
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        sclass={sclass}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{sorted}</ol>
                    <button onClick={(i) => this.handleSort()}>Sort</button>
                </div>
            </div>
        )
    }
}


function calculateWinner(squares: Array <string>) {
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