import * as React from 'react'

interface Props {
    sclass: string
    value: string
    onClick(): void
}
interface State {}

export default class Square extends React.Component <Props, State> {
    render() {
        return (
            <button className={this.props.sclass} onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        )
    }
}