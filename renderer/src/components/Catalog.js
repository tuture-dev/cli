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
      selectKey,
    } = this.props;
    return (
      <Menu
        onClick={this.handleClick}
        style={{ width: 256, height: '100%' }}
        defaultSelectedKeys={[selectKey]}
        mode='inline'
      >
      {
        catalogs.map((item, key) => (
          <Menu.Item key={key}>{item.name}({item.commit})</Menu.Item>
        ))
      }
      </Menu>
    );
  }
}