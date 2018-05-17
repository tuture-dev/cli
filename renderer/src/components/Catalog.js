import React, { Component } from 'react';
import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class Catalog extends Component {
  handleClick = (e) => {
    this.props.updateSelect(e.key);
  }

  render() {
    const {
      catalogs,
      catalogsInfo,
      selectKey,
    } = this.props;
    return (
      <div style={{display:'flex',flexDirection:'column', float:'left', height:'100%'}}>
        <Menu
          onClick={this.handleClick}
          defaultSelectedKeys={[selectKey]}
          style={{ width: 256, height: '100%' }}
          mode='inline'
        >
        {
          catalogs.map((item, key) => (
            <Menu.Item key={key}>{item.name}({item.commit})</Menu.Item>
          ))
        }
              
        </Menu>
        <div style={{position:'absolute', bottom:'0', paddingLeft:'24px'}}>
          <hr/>
          <p>name: {catalogsInfo.name}</p>
          <p>language: {catalogsInfo.language}</p>
          <p>maintainer: {catalogsInfo.maintainer}</p>
          <p>topics:  
          {
            catalogsInfo.topics.map((item, key) => (
              <span key={key}> {item}</span>
            ))
          }
          </p>
        </div>
        
      </div>
      
      
    );
  }
}