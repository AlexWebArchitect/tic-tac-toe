import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';

// ========================================

interface OneOrTwoProps {
    visible: boolean;
    onClick(p: boolean): void;
}
interface OneOrTwoState { }

class OneOrTwoModal extends React.Component<OneOrTwoProps, OneOrTwoState> {
    render() {
        if (!this.props.visible) { return null; }
        return (
            <div className="overlay">
                <div className={'modal-dialog'} role="document" onClick={e => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">How do you want to play?</h4>
                        </div>
                        <div id="Xor0" className="modal-body">
                            <button type="button" className="btn btn-primary" onClick={() => this.props.onClick(true)}>
                                One player
                            </button>
                            <span>&nbsp;</span>
                            <button type="button" className="btn btn-primary" onClick={() => this.props.onClick(false)}>
                                Two player
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

interface Xor0ModalProps {
    visible: boolean;
    onClick(x: boolean): void;
}
interface Xor0ModalState { }

class Xor0Modal extends React.Component<Xor0ModalProps, Xor0ModalState> {
    render() {
        if (!this.props.visible) { return null; }
        return (
            <div className="overlay">
                <div className={'modal-dialog'} role="document" onClick={e => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Player 1 : Would you like X or O?</h4>
                        </div>
                        <div id="Xor0" className="modal-body">
                            <button type="button" className="btn btn-primary" onClick={() => this.props.onClick(true)}>
                                X
                            </button>
                            <span>&nbsp;</span>
                            <button type="button" className="btn btn-primary" onClick={() => this.props.onClick(false)}>
                                0
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

interface SquareProps {
    sclass: string;
    value: string;
    onClick(): void;
}
interface SquareState { }

class Square extends React.Component<SquareProps, SquareState> {
    render() {
        return (
            <button className={this.props.sclass} onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
}

interface BoardProps {
    sclass: Array<string>;
    squares: Array<string>;
    onClick(i: number): void;
}
interface BoardState { }

class Board extends React.Component<BoardProps, BoardState>  {

    renderSquare(i: number) {
        return (
            <Square
                sclass={this.props.sclass[i]}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let board = [];
        let rows = [];
        for (let i: number = 0; i < 9; i = i + 3) {
            for (let j: number = i; j < i + 3; j++) {
                rows.push(this.renderSquare(j));
            }
            board.push(
                <div key={i} className="board-row">
                    {rows[i]}
                    {rows[i + 1]}
                    {rows[i + 2]}
                </div>
            );
        }
        return <div>{board}</div>;
    }
}

interface Current {
    squares: Array<string>;
}

interface GameProps { }
interface GameState {
    history: Array<Current>;
    stepNumber: number;
    xIsNext: boolean;
    changed: Array<number>;
    liClass: Array<string>;
    sorted: boolean;
    sclass: Array<string>;
    Xor0Modal: boolean;
    start: boolean;
    OneOrTwoModal: boolean;
    OnePlayer: boolean;
}

class Game extends React.Component<GameProps, GameState> {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
            changed: [0],
            liClass: [''],
            sorted: false,
            sclass: Array(9).fill('square'),
            Xor0Modal: true,
            start: true,
            OneOrTwoModal: true,
            OnePlayer: false
        };
    }

    handleClick(i: number): void {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares: Array<string> = current.squares.slice();
        const changed = this.state.changed.concat(i);
        const liClass = this.state.liClass.concat('');
        const computer = this.state.OnePlayer;
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : '0';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            changed: changed,
            liClass: liClass
        });
        this.highlight(squares);
        setTimeout(() => { if (computer) { this.calculateTurn(); } }, 1000);
    }

    jumpTo(step: number): void {
        const computer = this.state.OnePlayer;
        const sclass = Array(9).fill('square');
        const changed = this.state.changed.splice(0, step + 1);
        const liClass = this.state.liClass;
        const start = this.state.start;
        let xIsNext = true;
        if (start) {
            xIsNext = (step % 2) ? false : true;
        } else {
            xIsNext = (step % 2) ? true : false;
        }
        liClass[step] = 'bold';
        this.setState({
            stepNumber: step,
            xIsNext: xIsNext,
            changed: changed,
            liClass: liClass,
            sclass: sclass
        });
        setTimeout(() => { if (computer && (step + 1) % 2 === 0 && step !== 0) { this.calculateTurn(); } }, 1000);
    }

    handleSort(): void {
        this.setState(prevState => ({
            sorted: !prevState.sorted
        }));
    }

    sortMoves(i: JSX.Element[]) {
        if (this.state.sorted) {
            let sortedMoves = i.reverse();
            return sortedMoves;
        }
        return i;
    }

    highlight(squares: Array<string>): void {
        const lines: Array<Array<number>> = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i: number = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                const sclass = this.state.sclass;
                sclass[a] = 'win';
                sclass[b] = 'win';
                sclass[c] = 'win';
                this.setState({ sclass: sclass });
            }
        }
    }

    Xor0(x: boolean) {
        if (x) {
            this.setState({ xIsNext: true, Xor0Modal: false, start: true });
        } else {
            this.setState({ xIsNext: false, Xor0Modal: false, start: false });
        }
    }

    OneOrTwo(p: boolean) {
        if (p) {
            this.setState({ OnePlayer: true, OneOrTwoModal: false });
        } else {
            this.setState({ OnePlayer: false, OneOrTwoModal: false });
        }
    }

    calculateTurn() {
        let spot: number;
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares: Array<string> = current.squares.slice();
        spot = 0;
        if (squares[4] === null) { spot = 4; }
        this.turn(spot);
    }

    turn(n: number) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares: Array<string> = current.squares.slice();
        const changed = this.state.changed.concat(n);
        const liClass = this.state.liClass.concat('');
        if (calculateWinner(squares) || squares[n]) {
            return;
        }
        squares[n] = this.state.xIsNext ? 'X' : '0';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            changed: changed,
            liClass: liClass
        });
        this.highlight(squares);
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const sclass = this.state.sclass;
        const locations: Array<string> = ['(0, 1)', '(0, 2)', '(0, 3)',
            '(1, 1)', '(1, 2)', '(1, 3)',
            '(2, 1)', '(2, 2)', '(2, 3)'];

        const moves = history.map((step: Current, move: number) => {
            const desc: string = move
                ? 'Move #' + move + ' at ' + locations[this.state.changed[move]]
                : 'Game start';
            return (
                <li key={move} className={this.state.liClass[move]}>
                    <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
                </li>
            );
        });

        let status: string;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0');
        }

        const sorted = this.sortMoves(moves);
        return (
            <div className="game">
                <Xor0Modal visible={this.state.Xor0Modal} onClick={(x) => this.Xor0(x)} />
                <OneOrTwoModal visible={this.state.OneOrTwoModal} onClick={(p) => this.OneOrTwo(p)} />
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
        );
    }
}

function calculateWinner(squares: Array<string>) {
    const lines: Array<Array<number>> = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i: number = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

ReactDOM.render(<Game />, document.getElementById('root'));