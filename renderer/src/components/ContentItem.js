import React, { Component } from 'react';
import { property, union } from 'lodash/fp';
import { Input } from 'antd';
import { parseDiff, Diff, HunkHeader } from 'react-diff-view';
import './css/Hunk.css';
import './css/Change.css';
import './css/Diff.css';


export default class ContentItem extends Component {
  state = {
    diffText: '',
  };

  async getDiffText(commit) {
    const that = this;
    const response = await fetch(`diff/${commit}.diff`);
    const diffText = await response.text();

    that.setState({
      diffText,
    });
  }

  componentDidMount() {
    const { commit } = this.props;
    console.log('commit', commit);
    this.getDiffText(commit);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.commit !== this.props.commit) {
      this.getDiffText(nextProps.commit);
    }
  }

  extractFileName({ type, oldPath, newPath }) {
    return type === 'delete' ? oldPath : newPath;
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
          needRenderFiles.map((file, i) => (
            <div key={i}>
              <article className="diff-file" key={i}>
                <header className="diff-file-header">
                    <strong className="filename">{this.extractFileName(file)}</strong>
                </header>
                <main>
                  <Diff key={i} hunks={file.hunks} viewType={this.props.viewType} />
                </main>
              </article>
              <div>
                <div style={{ marginTop: '20px' }}>输入你的说明文字</div>
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}
