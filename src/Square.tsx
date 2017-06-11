import * as React from 'react'

interface Props {
    value: string
    onClick(): void
}
interface State {}

export default class Square extends React.Component <Props, State> {
    render() {
        return (
            <button className="square" onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        )
    }
}