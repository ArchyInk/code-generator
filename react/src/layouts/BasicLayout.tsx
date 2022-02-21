/*
 * @Author: Archy
 * @Date: 2022-01-30 09:16:43
 * @LastEditors: Archy
 * @LastEditTime: 2022-02-21 17:01:54
 * @FilePath: \arkgen\react\src\layouts\BasicLayout.tsx
 * @description: 
 */
import React, { useState } from 'react'
import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { appState } from '../stores/app'
import { useRecoilState } from 'recoil'
import './BasicLayout.less'
import Menu from '../components/Menu'
import { ConsoleMenu } from '../components/Console'
import ConsoleUI from '../components/Console/consoleUI'
const { Sider, Content } = Layout
const BasicLayout: React.FC = () => {
  const [app, setApp] = useRecoilState(appState)
  const [width, setWidth] = useState(64)
  const [collapsed, setCollapsed] = useState(false)
  const handleMouseenter = () => {
    setWidth(168)
    setCollapsed(true)
  }

  const handleMouselevel = () => {
    setWidth(64)
    setCollapsed(false)
  }
  return (
    <Layout className='arkgen-layout'>
      <Sider
        theme={app.theme}
        collapsed={false}
        trigger={null}
        width={width}
        onMouseEnter={handleMouseenter}
        onMouseLeave={handleMouselevel}

      >
        <Menu collapsed={collapsed}></Menu>
        <ConsoleMenu collapsed={collapsed} style={{ position: 'absolute', bottom: '20px' }}></ConsoleMenu>
        <ConsoleUI></ConsoleUI>
      </Sider>
      <Layout>
        <Content><Outlet /></Content>
      </Layout>
    </Layout>
  )
}

export default BasicLayout