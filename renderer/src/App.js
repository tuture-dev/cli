import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import tuture from './util/content.json';
import _ from 'lodash';
import styled from 'styled-components';

// import conponents
import {
  Content,
  Catalog,
} from './components/index';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectKey: '1',
    };
  }

  updateSelect = (key) => {
    this.setState({
      selectKey: key,
    });
  }

  render() {
    const catalogs = tuture.steps.map(item => ({
      name: item.name,
      commit: item.commit,
    }));

    const nowSelectKeyNumber = Number(this.state.selectKey);
    const nowRenderContent = tuture.steps[nowSelectKeyNumber];
    return (
      <div style={{ height: '100%', width: '100%', display: 'flex' }}>
        <Catalog 
          catalogs={catalogs}
          selectKey={this.state.selectKey}
          updateSelect={this.updateSelect}
          />
        <Content
          content={nowRenderContent}
        />
      </div>
    );
  }
}

export default App;
