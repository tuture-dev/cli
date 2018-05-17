import React, { Component } from 'react';
import ContentItem from './ContentItem';



export default class Content extends Component {
  callback = (key) => {
    console.log('key', key);
  }

  render() {
    const { name, explain, diff } = this.props.content;
    return (
      <div style={{ padding: '30px' }}>
        <h1>{name}</h1>
        <p>{explain}</p>
        {
          diff.map((diffItem, key) => (
            <ContentItem key={key} renderItem={diffItem} />
          ))
        }
      </div>
    );
  }
}