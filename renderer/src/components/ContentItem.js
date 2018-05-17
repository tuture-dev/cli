import React, { Component } from 'react';
import { Diff, parseDiff, Hunk } from 'react-diff-view';

import diffText from '../assets/test.diff'

export default class ContentItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      diffText: '',
    };
  }

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

  renderHunk = (hunk) => {
    console.log('hunk', hunk);
    const header = (
      <div style={{ background: 'yellow' }}>hhhhh</div>
    )

    return <Hunk key={hunk.content} hunk={hunk} header={header} />;
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
      {
        diffText && needRenderFiles.map(({hunks}, i) => <Diff key={i} viewType="split">{hunks.map(this.renderHunk)}</Diff>) }
      }
      </div>
    );
  }
}
