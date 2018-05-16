import React, { Component } from 'react';
import { Tabs } from 'antd';
import ContentItem from './ContentItem';

const TabPane = Tabs.TabPane;

export default class Content extends Component {
  callback = (key) => {
    console.log('key', key);
  }

  render() {
    const { content } = this.props;

    return (
      <div style={{ width: '70%', marginLeft: '20px' }}>
        <Tabs 
          defaultActiveKey="1" 
          onChange={this.callback}
        >
        {
          content.diff.map((diffItem, key) => (
            <TabPane tab={diffItem.file} key={key}>
              <ContentItem renderItem={diffItem.explain} />
            </TabPane>
          ))
        }
        </Tabs>
      </div>
    );
  }
}