import React, { Component } from 'react';
import ContentItem from './ContentItem';



export default class Content extends Component {
  callback = (key) => {
    console.log('key', key);
  }

  render() {
    const { content } = this.props;
    return (
      <div style={{ padding:'30px' }}>
        <h1>{content.name}</h1>
        <p>{content.explain}</p>
        {
          content.diff.map((diffItem, key) => (
            <ContentItem key={key} renderItem={diffItem} />
          ))
        }
      </div>
    );
  }
}