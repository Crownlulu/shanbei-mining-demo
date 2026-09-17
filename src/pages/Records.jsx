import React, { useState } from 'react'
import { Avatar, Button, Card, Descriptions, Empty, Space, Steps, Table, Tabs, Tag, Typography } from 'antd'
import { applicant, history } from '../data.js'
import { STATUS, RESULT } from '../status.js'

const { Text } = Typography

function Person({ name }) {
  const short = name.replace('人力资源部 ', '').replace('老师', '').slice(-2)
  return (
    <Space>
      <Avatar size={28} style={{ background: '#6b8fc9', fontSize: 12 }}>{short}</Avatar>
      <span>{name}</span>
    </Space>
  )
}

function LogTable({ logs }) {
  return (
    <Table
      size="middle" pagination={false} rowKey={(r, i) => i} dataSource={logs}
      columns={[
        { title: '节点', dataIndex: 'node', width: 110 },
        { title: '办理人', dataIndex: 'person', width: 190, render: (v) => <Person name={v} /> },
        { title: '结果', dataIndex: 'result', width: 100, render: (v) => <Tag color={RESULT[v]}>{v}</Tag> },
        { title: '意见', dataIndex: 'comment', render: (v) => v || <Text type="secondary">—</Text> },
        { title: '时间', dataIndex: 'time', width: 150, render: (v) => <Text type="secondary">{v || '—'}</Text> },
      ]}
    />
  )
}

function stepState(status) {
  if (status === 'withdrawn') return { current: 0, status: 'error' }
  if (status === 'returned') return { current: 1, status: 'error' }
  if (status === 'approved') return { current: 2, status: 'process' }
  return { current: 1, status: 'process' }
}

export default function Records({ app, go, onWithdraw, onSimulateReturn, onSimulateApprove }) {
  const hasCurrent = app.logs.length > 0
  const [sel, setSel] = useState(hasCurrent ? 'current' : history.key)

  const current = {
    key: 'current',
    title: '高级工程师职称申报',
    year: '2026',
    no: app.no,
    status: app.status,
    at: app.submittedAt,
    logs: app.status === 'reviewing'
      ? [...app.logs, { node: '单位审核', person: '人力资源部 李老师', result: '审核中', comment: '', time: '' }]
      : app.logs,
  }
  const items = hasCurrent ? [current, history] : [history]
  const item = items.find((i) => i.key === sel) || items[0]
  const st = STATUS[item.status]
  const isCurrent = item.key === 'current'
  const steps = stepState(item.status)

  return (
    <>
      <div className="page-title-row"><h1 className="page-title">申报记录</h1></div>
      <div style={{ display: 'grid', gridTemplateColumns: '300px minmax(0, 1fr)', gap: 16, alignItems: 'start' }}>
        <div>
          {!hasCurrent && (
            <Card size="small" style={{ marginBottom: 10 }}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="2026年度尚未提交">
                <Button type="primary" size="small" onClick={() => go('apply')}>去填写申报表</Button>
              </Empty>
            </Card>
          )}
          {items.map((i) => (
            <div key={i.key} className={`rec-item${i.key === item.key ? ' active' : ''}`} onClick={() => setSel(i.key)}>
              <div className="kv" style={{ padding: 0 }}>
                <Text strong>{i.title}</Text>
                <Tag color={STATUS[i.status].color} style={{ marginInlineEnd: 0 }}>{STATUS[i.status].text}</Tag>
              </div>
              <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>申报年度：{i.year}</div>
              <div className="muted" style={{ fontSize: 13 }}>申报编号：{i.no}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>提交时间 {i.at}</div>
            </div>
          ))}
        </div>

        <Card
          title={<Text type="secondary" style={{ fontWeight: 400, fontSize: 13 }}>编号：{item.no}</Text>}
          actions={isCurrent ? [
            <Button key="v" type="link" onClick={() => go('apply')}>
              {['returned', 'withdrawn'].includes(item.status) ? '去修改' : '查看申报表'}
            </Button>,
            <Button key="w" type="link" danger disabled={item.status !== 'reviewing'} onClick={onWithdraw}>撤回</Button>,
          ] : undefined}
        >
          <Space align="center" style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 20, fontWeight: 600 }}>{item.title}</span>
            <Tag color={st.color}>{st.text}</Tag>
          </Space>
          <div className="muted" style={{ marginBottom: 12 }}>
            {applicant.name} · {applicant.dept} · 提交于 {item.at}
          </div>
          <Tabs
            items={[
              { key: 'log', label: '审批记录', children: <LogTable logs={item.logs} /> },
              {
                key: 'progress', label: '办理进度',
                children: (
                  <Steps
                    style={{ padding: '16px 0' }}
                    current={item.key === 'current' ? steps.current : 4}
                    status={item.key === 'current' ? steps.status : 'finish'}
                    items={[
                      { title: '个人申报' },
                      { title: '单位审核', description: item.status === 'returned' ? '已退回，待本人修改' : undefined },
                      { title: '公示', description: '5 个工作日' },
                      { title: '评委会评审' },
                      { title: '结果公布' },
                    ]}
                  />
                ),
              },
              {
                key: 'info', label: '申报信息',
                children: (
                  <Descriptions column={2} size="small">
                    <Descriptions.Item label="申报人">{applicant.name}</Descriptions.Item>
                    <Descriptions.Item label="申报系列">{applicant.series}</Descriptions.Item>
                    <Descriptions.Item label="申报职称">{item.key === 'current' ? '高级工程师' : '工程师'}</Descriptions.Item>
                    <Descriptions.Item label="专业">{applicant.major}</Descriptions.Item>
                  </Descriptions>
                ),
              },
            ]}
          />
        </Card>
      </div>

      {isCurrent && (
        <div className="demo-ops" style={{ marginTop: 16 }}>
          <Space wrap>
            <Text type="secondary">演示操作（模拟人事部门审核，正式系统中由 HR 在审核端完成）：</Text>
            <Button size="small" disabled={app.status !== 'reviewing'} onClick={onSimulateReturn}>模拟退回修改</Button>
            <Button size="small" disabled={app.status !== 'reviewing'} onClick={onSimulateApprove}>模拟审核通过</Button>
          </Space>
        </div>
      )}
    </>
  )
}
