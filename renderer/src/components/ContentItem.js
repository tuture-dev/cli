import React, { Component } from 'react';

export default class ContentItem extends Component {
  render() {
    const { file, change, explain } = this.props.renderItem;
    return (
      <div>
        <h3>{file}</h3>
        <p>{change}</p>
        <p>{explain}</p>
      </div>
    );
  }
}