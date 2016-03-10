import React, { Component } from 'react';
import { NICE, SUPER_NICE } from './colors';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.interval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    this.setState({
      counter: this.state.counter + this.props.increment
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <h1 style={{ color: this.props.color }}>
          Counter ({this.props.increment}): {this.state.counter}
      </h1>
    );
  }
}

export class App extends Component {
  render() {
    return (
      <div>
          <h1>Welcome to Code Slinger Boilerplate</h1>
          <p>
              Based on
              <a href="https://github.com/gaearon/react-transform-boilerplate">
                  Dan Abramov's React Transform Boilerplate
              </a>
          </p>
          <Counter increment={1} color={NICE} />
          <Counter increment={5} color={SUPER_NICE} />
      </div>
    );
  }
}
