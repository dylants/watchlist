import React, { Component } from 'react';

import Header from '../../../components/header/header.component';

export default class HeaderTestContainer extends Component {
  state = {
    selected: 'queue',
  };

  click = (element) => {
    this.setState({
      selected: element,
    });
  }

  render() {
    return (
      <div>
        <Header
          selected={this.state.selected}
          clickQueue={() => this.click('queue')}
          clickSaved={() => this.click('saved')}
          clickDismissed={() => this.click('dismissed')}
        />
      </div>
    );
  }
}
