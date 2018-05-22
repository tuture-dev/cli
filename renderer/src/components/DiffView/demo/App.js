import React, {PureComponent} from 'react';
import {uniqueId} from 'lodash';
import {bind} from 'lodash-decorators';
import {Button, Radio, Checkbox, Input} from 'antd';
import { parseDiff } from '../src/';
import File from './File';
import './App.css';

const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

/* eslint-disable no-console */

export default class App extends PureComponent {

    state = {
        zip: false,
        diff: [],
        rendering: [],
        diffText: '',
        viewType: 'split'
    };
    /* eslint-enable react/no-did-update-set-state */

    switchViewType = (e) => {
        this.setState({viewType: e.target.value});
    }

    changeZipType = (e) => {
        this.setState({zip: e.target.checked});
    }

    receiveNewDiff = (e) => {
        this.setState({diffText: e.target.value});
    }

    componentDidMount() {
      this.loadPreset();
    }

    async loadPreset() {
        const response = await fetch(`assets/small.diff`);
        const diffText = await response.text();
        this.setState({diffText});
    }


    render() {
        const { diffText, viewType } = this.state;

        let needRenderFiles = [];
        if (diffText) {
          const files = parseDiff(diffText);

          needRenderFiles = files;
        }

        /* eslint-disable react/jsx-no-bind, react/no-array-index-key */
        return (
            <div className="app">
              <div className="main">
              {needRenderFiles.map((file, i) => (
                <div>
                  <File key={i} {...file} viewType={viewType} />
                  <div>请开始你的表演</div>
                  <Input className="Textarea" style={{ marginTop: '20px' }}></Input>
                </div>
              ))}
              </div>
            </div>
        );
        /* eslint-enable react/jsx-no-bind, react/no-array-index-key */
    }
}
