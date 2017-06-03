import React from 'react';

export default class MyComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      word: "sturf",
      i: 0,
    }
  }

  componentDidMount() {
    setInterval(() => this.handleWord(1), 500);
  }

  handleWord(a) {
    this.setState({i: this.state.i + a});
    let arr = ["stuff", "shit", "else", "more words", "a lot", "fcking", "peemaker", "bitch"];
    if (this.state.i < 8) this.setState({word: arr[this.state.i]});
    else this.setState({word: arr[0], i: 0}) 
  }

  render() {
    return (<h1>it is {this.state.word}</h1>);
  }
}