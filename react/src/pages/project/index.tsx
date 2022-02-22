/*
 * @Author: Archy
 * @Date: 2022-01-30 20:30:41
 * @LastEditors: Archy
 * @LastEditTime: 2022-02-22 14:47:53
 * @FilePath: \arkgen\react\src\pages\project\index.tsx
 * @description: 
 */
import React, { useState, useEffect } from "react";
import { notification, Row, Col, Tree, Card, Descriptions, Spin } from "antd";
import { getProjectInfo, getDir, getFile } from "../../api/project";
import type { DirType, ProjectInfo } from "../../api/project"
import SyntaxHighlighter from 'react-syntax-highlighter'
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs'
const { DirectoryTree } = Tree

import './index.less'
const Project: React.FC = () => {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>()
  const [dirs, setDirs] = useState<DirType[]>()
  const [selectFileType, setSelectFileType] = useState<string>('plaintext')
  const [content, setContent] = useState<string>('')
  const [rightSpin, setRightSpin] = useState<boolean>(false)
  const cardHeaderStyle: React.CSSProperties = { display: 'flex', height: '3rem', alignItems: 'center' }
  const handleProjectInfo = async () => {
    const result = await getProjectInfo()
    if (result.success) {
      setProjectInfo(result.data)
      setDirs(result.data?.dirs)
      if (result.data.hasPkg) {
        setContent(result.data.pkg)
        setSelectFileType('json')
      }
    } else {
      notification.error({ message: '获取项目信息出错：' + result.msg })
    }
  }

  useEffect(() => {
    handleProjectInfo()
  }, [])

  const renderProjectCard = () => {
    const cardStyle: React.CSSProperties = { marginBottom: '8px' }
    if (projectInfo) {
      return (
        <Card title="项目详情" headStyle={cardHeaderStyle} style={cardStyle}>
          <Descriptions>
            {projectInfo.hasPkg ?
              <>
                <Descriptions.Item label="名称">{JSON.parse(projectInfo.pkg).name}</Descriptions.Item>
                <Descriptions.Item label="版本">{JSON.parse(projectInfo.pkg).version}</Descriptions.Item>
                <Descriptions.Item label="描述">{JSON.parse(projectInfo.pkg).description}</Descriptions.Item>
                <Descriptions.Item label="作者">{JSON.parse(projectInfo.pkg).author}</Descriptions.Item>
                <Descriptions.Item label="授权">{JSON.parse(projectInfo.pkg).license} </Descriptions.Item>
              </>
              :
              <>
                <Descriptions.Item label="路径">{projectInfo.path}</Descriptions.Item>
                <Descriptions.Item>未找到package.json文件</Descriptions.Item>
              </>
            }

          </Descriptions>
        </Card>
      )
    } else {
      return (<Card title="项目详情" headStyle={cardHeaderStyle} style={cardStyle}>未获取到项目</Card>)
    }
  }

  const renderLeftBody = () => {
    const rowStyle: React.CSSProperties = { padding: 8, paddingRight: 0, height: '100%' }
    const fullHeightStyle: React.CSSProperties = { height: '100%' }
    return (
      < Row style={rowStyle} gutter={8}>
        <Col span={16}>
          {renderProjectCard()}
          {renderTaskList()}
          {renderDependenciesList()}
        </Col>
        <Col span={8} style={fullHeightStyle}>
          {renderDirs()}
        </Col>
      </ Row>)
  }

  const renderDirs = () => {
    const updateDirs = (list: DirType[], key: string, children: DirType[], error?: boolean): DirType[] => {
      return list.map(dir => {
        if (dir.key === key) {
          if (error) {
            return {
              ...dir,
              type: 'error'
            }
          } else {
            return {
              ...dir,
              children,
            };
          }
        }

        if (dir.children) {
          return {
            ...dir,
            children: updateDirs(dir.children, key, children),
          };
        }
        return dir
      })
    }
    const onLoadData = ({ key }: any) => {
      return new Promise<void>((resolve) => {
        getDir({ path: key }).then(res => {
          if (res.success) {
            setDirs(updateDirs(dirs as DirType[], key, res.data))
            resolve()
          } else {
            setDirs(updateDirs(dirs as DirType[], key, res.data, true))
            resolve()
          }
        })
      })
    }

    const customRender = (nodeData: any) => {
      if (nodeData.type === 'error') {
        return <span style={{ color: 'red' }} title="打开失败">{nodeData.title}</span>
      } else {
        return <span>{nodeData.title}</span>
      }
    }

    const onSelect = async (key: (string | number)[], { node }: any) => {
      if (node.type === 'file') {
        setRightSpin(true)
        getFile({ path: key.pop() }).then(res => {
          setRightSpin(false)
          if (res.success) {
            setContent(res.data.content)
            setSelectFileType(res.data.lang)
          } else {
            setContent('文件内容获取出错！')
            setSelectFileType('plaintext')
          }
        })
      }
    }

    const cardStyle: React.CSSProperties = { height: '100%' }
    const bodyStyle: React.CSSProperties = { height: 'calc(100% - 3rem)', overflow: 'auto' }
    return (
      <Card title="项目结构" style={cardStyle} headStyle={cardHeaderStyle} bodyStyle={bodyStyle}>
        <DirectoryTree treeData={dirs} loadData={onLoadData} titleRender={customRender} onSelect={onSelect}></DirectoryTree>
      </Card>
    )
  }

  const renderTaskList = () => {
    const bodyStyle: React.CSSProperties = { marginBottom: '8px' }
    return (
      <Card title="任务列表" style={bodyStyle} headStyle={cardHeaderStyle}>
      </Card>
    )
  }
  const renderDependenciesList = () => {
    return (
      <Card title="依赖列表" headStyle={cardHeaderStyle}>
      </Card>
    )
  }


  const renderLeft = () => {
    return (
      <>
        {renderLeftBody()}
      </>)
  }

  const renderRight = () => {
    const divStyle: React.CSSProperties = { height: '100%', width: '100%' }
    const customStyle: React.CSSProperties = { height: '100%' }
    const spinStyle: React.CSSProperties = { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }
    return (
      <div style={divStyle}>
        <Spin spinning={rightSpin} style={spinStyle} tip='正在打开文件' />
        <SyntaxHighlighter language={selectFileType} style={vs2015} customStyle={customStyle} showLineNumbers >
          {content}
        </SyntaxHighlighter>
      </div>
    )
  }

  const renderAll = () => {
    const fullHeightStyle: React.CSSProperties = { height: '100%' }
    const colLeftStyle: React.CSSProperties = { height: '100%' }
    const colRightStyle: React.CSSProperties = { height: '100%', overflow: 'auto' }
    return (
      <div style={fullHeightStyle}>
        <Row style={fullHeightStyle} gutter={16}>
          <Col span={16} style={colLeftStyle}>
            {renderLeft()}
          </Col>
          <Col span={8} style={colRightStyle}>{renderRight()}</Col>
        </Row>
      </div >
    )
  }

  return renderAll()

}
export default Project
