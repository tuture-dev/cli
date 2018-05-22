import React, { Component } from 'react';
import { parseDiff } from 'react-diff-view';
import DiffView from './DiffView/demo/index';


export default class ContentItem extends Component {
  state = {
    diffText: '',
    rendering: [],
    diff: [],
    comments: [],
    writingChanges: [],
    selectedChanges: [],
    zip: false,
    viewType: 'split',
  };

  async getDiffText() {
    const that = this;
    const response = await fetch('assets/test.diff');
    const diffText = await response.text();

    that.setState({
      diffText,
    });
  }

  componentDidMount() {
    this.getDiffText();
  }

  render() {
    const { renderItem } = this.props;

    const { diffText } = this.state;

    let needRenderFiles = [];
    if (diffText) {
      const files = parseDiff(diffText);

      console.log('files', files);

      needRenderFiles = files;
    }
    return (
      <div>
        <DiffView />
      </div>
    );
  }
}
