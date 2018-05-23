import React, { Component } from 'react';
import ContentItem from './ContentItem';



export default class Content extends Component {
  callback = (key) => {
    console.log('key', key);
  }

  render() {
    const { name, explain, diff, commit } = this.props.content;
    console.log('diff', diff);
    return (
      <div style={{ padding: '30px' }}>
        <h1>{name}</h1>
        <p>{explain}</p>
        <ContentItem diff={diff} commit={commit} />
      </div>
    );
  }
}
