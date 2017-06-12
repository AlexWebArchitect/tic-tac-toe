import * as React from 'react'
import Square from './Square'

interface Props {
    sclass: Array <string>
    squares: Array <string>
    onClick(i: number): void
}
interface State {}

export default class Board extends React.Component <Props, State>  {

    renderSquare(i: number) {
        return (
            <Square 
                sclass={this.props.sclass[i]}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        let board = []
        let rows = []
        for (let i: number = 0; i < 9; i = i+3) {
            for (let j: number = i; j < i+3; j++) {
                rows.push(this.renderSquare(j))
            }
            board.push(
                <div key = {i} className="board-row">
                    {rows[i]}
                    {rows[i+1]}
                    {rows[i+2]}
                </div>
            )
        }
        return (<div>{board}</div>)
    }
}