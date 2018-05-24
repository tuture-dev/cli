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
      <div style={{ display: 'flex', flexDirection: 'column', float: 'left', height:'100%', overflow: 'hidden' }}>
        <Menu
          onClick={this.handleClick}
          defaultSelectedKeys={[selectKey]}
          style={{ width: 256, height: '100%' }}
          mode='inline'
        >
        {
          catalogs.map((item, key) => (
            <Menu.Item key={key}>{item.name}</Menu.Item>
          ))
        }
              
        </Menu>
        
        
      </div>
      
      
    );
  }
}
