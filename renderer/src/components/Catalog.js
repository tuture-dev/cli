import React, { Component } from 'react';
import { Menu, Icon, Affix } from 'antd';

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
      <div 
        style={{ 
          width: '20%',
          height: '100%',
          overflowY: 'scroll'
        }}
      >
          <Menu
            onClick={this.handleClick}
            defaultSelectedKeys={[selectKey]}
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
