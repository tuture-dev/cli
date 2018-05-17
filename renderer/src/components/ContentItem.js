import React, { Component } from 'react';

export default class ContentItem extends Component {
  render() {
    const { renderItem } = this.props;
    console.log(renderItem);
    return (
      <div>
        <h3>{this.props.renderItem.file}</h3>
        <p>{this.props.renderItem.change}</p>
        <p>{this.props.renderItem.explain}</p>
      </div>
    );
  }
}