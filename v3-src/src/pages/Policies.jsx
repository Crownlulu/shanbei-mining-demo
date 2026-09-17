import React from 'react'
import { Card, List, Tag, Typography } from 'antd'
import { FilePdfOutlined } from '@ant-design/icons'

const { Text } = Typography

const docs = [
  { title: '工程系列高级职称评审条件', type: '评审条件', date: '2026-09-15' },
  { title: '2026年度职称申报材料填写说明', type: '填写说明', date: '2026-09-15' },
  { title: '专业技术人员继续教育学时认定办法', type: '相关规定', date: '2025-03-01' },
  { title: '职业资格证书与职称对应关系说明', type: '相关规定', date: '2024-06-20' },
]

export default function Policies() {
  return (
    <>
      <div className="page-title-row">
        <h1 className="page-title">政策文件</h1>
        <Text type="secondary">演示环境：文件名为示例，正式上线时替换为贵单位的评审文件</Text>
      </div>
      <Card>
        <List
          dataSource={docs}
          renderItem={(d) => (
            <List.Item actions={[<a key="v">查看</a>, <a key="d">下载</a>]}>
              <List.Item.Meta
                avatar={<FilePdfOutlined style={{ fontSize: 20, color: '#8a919f', marginTop: 4 }} />}
                title={<a>{d.title}</a>}
                description={<><Tag>{d.type}</Tag><Text type="secondary">发布日期 {d.date}</Text></>}
              />
            </List.Item>
          )}
        />
      </Card>
    </>
  )
}
