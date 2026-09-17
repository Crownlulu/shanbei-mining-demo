import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { Layout, Menu, Avatar, Badge, Space, Tag, Breadcrumb, Dropdown } from 'antd'
import {
  AppstoreOutlined, FormOutlined, FileSearchOutlined, BookOutlined, BellOutlined, UserOutlined,
} from '@ant-design/icons'
import { initialForm, applicant } from './data.js'
import { runChecks } from './checks.js'
import Workbench from './pages/Workbench.jsx'
import ApplyForm from './pages/ApplyForm.jsx'
import Review from './pages/Review.jsx'
import Records from './pages/Records.jsx'
import Policies from './pages/Policies.jsx'

const { Header, Sider, Content } = Layout

const crumbs = {
  workbench: ['工作台'],
  apply: ['职称申报', '2026年度申报表'],
  review: ['职称申报', '提交前检查'],
  records: ['申报记录'],
  policies: ['政策文件'],
}

// 演示用的固定时间，保证每次演示看到的记录一致
const CLOCK = ['2026-09-17 15:42', '2026-09-18 10:20', '2026-09-18 11:05', '2026-09-19 09:30', '2026-09-19 16:10', '2026-09-20 09:00']

export default function App() {
  const [page, setPage] = useState('workbench')
  const [form, setForm] = useState(initialForm)
  const [focusSection, setFocusSection] = useState(null)
  // 申报状态：draft 草稿 / reviewing 审核中 / returned 已退回 / withdrawn 已撤回 / approved 审核通过
  const [app, setApp] = useState({ status: 'draft', no: null, submittedAt: null, logs: [], tick: 0 })
  const [collapsed, setCollapsed] = useState(window.innerWidth < 1366)
  useEffect(() => {
    const onResize = () => setCollapsed(window.innerWidth < 1366)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const issues = useMemo(() => runChecks(form), [form])
  const editable = ['draft', 'returned', 'withdrawn'].includes(app.status)

  const go = useCallback((p, section = null) => {
    setPage(p)
    setFocusSection(section)
    if (!section) window.scrollTo({ top: 0 })
  }, [])

  const now = (t) => CLOCK[Math.min(t, CLOCK.length - 1)]

  const submit = () => {
    setApp((a) => {
      const resubmit = a.logs.length > 0
      const t = now(a.tick)
      return {
        ...a,
        status: 'reviewing',
        no: a.no || 'ZC2026-0917-0368',
        submittedAt: a.submittedAt || t,
        tick: a.tick + 1,
        logs: [...a.logs, { node: '个人申报', person: applicant.name, result: resubmit ? '重新提交' : '提交', comment: '', time: t }],
      }
    })
    go('records')
  }

  const withdraw = () => {
    setApp((a) => ({
      ...a, status: 'withdrawn', tick: a.tick + 1,
      logs: [...a.logs, { node: '个人申报', person: applicant.name, result: '本人撤回', comment: '', time: now(a.tick) }],
    }))
  }

  // 演示操作：模拟人事部门退回
  const simulateReturn = () => {
    const reason = '业绩证明材料未加盖单位公章，请重新上传'
    setForm((f) => ({
      ...f,
      attachments: f.attachments.map((x) => (x.key === 'f5' ? { ...x, file: null, returnReason: reason } : x)),
    }))
    setApp((a) => ({
      ...a, status: 'returned', tick: a.tick + 1,
      logs: [...a.logs, { node: '单位审核', person: '人力资源部 李老师', result: '退回修改', comment: reason, time: now(a.tick) }],
    }))
  }

  const simulateApprove = () => {
    setApp((a) => ({
      ...a, status: 'approved', tick: a.tick + 1,
      logs: [...a.logs, { node: '单位审核', person: '人力资源部 李老师', result: '同意', comment: '材料齐全，同意推荐', time: now(a.tick) }],
    }))
  }

  const menuKey = page === 'review' ? 'apply' : page
  const errorCount = editable ? issues.filter((i) => i.level === 'error').length : 0

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="app-header">
        <div className="brand">
          <div className="brand-mark">职</div>
          <span className="brand-name">职称评审申报系统</span>
          <span className="brand-org">{applicant.org} · 人力资源部</span>
          <Tag color="default" style={{ marginLeft: 4 }}>演示环境</Tag>
        </div>
        <Space size={20}>
          <Badge count={app.status === 'returned' ? 1 : 0} size="small">
            <BellOutlined style={{ fontSize: 16, color: '#5c6370' }} />
          </Badge>
          <Dropdown menu={{ items: [{ key: 'p', label: '个人信息' }, { key: 'o', label: '退出登录' }] }}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar size={28} icon={<UserOutlined />} style={{ background: '#c9d6ea' }} />
              <span>{applicant.name}</span>
            </Space>
          </Dropdown>
        </Space>
      </Header>
      <Layout>
        <Sider width={200} collapsedWidth={64} collapsed={collapsed} trigger={null} className="app-sider"
          style={{ position: 'sticky', top: 56, height: 'calc(100vh - 56px)', overflow: 'auto' }}>
          <Menu
            mode="inline"
            selectedKeys={[menuKey]}
            style={{ borderInlineEnd: 0, paddingTop: 8 }}
            onClick={({ key }) => go(key)}
            items={[
              { key: 'workbench', icon: <AppstoreOutlined />, label: '工作台' },
              {
                key: 'apply', icon: <FormOutlined />,
                label: <Space>职称申报{errorCount > 0 && <Badge count={errorCount} size="small" />}</Space>,
              },
              { key: 'records', icon: <FileSearchOutlined />, label: '申报记录' },
              { key: 'policies', icon: <BookOutlined />, label: '政策文件' },
            ]}
          />
        </Sider>
        <Content>
          <div className="page">
            <Breadcrumb items={[{ title: '首页' }, ...crumbs[page].map((t) => ({ title: t }))]} />
            {page === 'workbench' && <Workbench form={form} issues={issues} app={app} go={go} />}
            {page === 'apply' && (
              <ApplyForm form={form} setForm={setForm} issues={issues} go={go}
                focusSection={focusSection} app={app} editable={editable} />
            )}
            {page === 'review' && <Review form={form} issues={issues} go={go} app={app} onSubmit={submit} />}
            {page === 'records' && (
              <Records app={app} go={go} onWithdraw={withdraw}
                onSimulateReturn={simulateReturn} onSimulateApprove={simulateApprove} />
            )}
            {page === 'policies' && <Policies />}
            <div className="demo-footer">演示原型 · 页面中的人员、单位、证书编号和政策条款均为示例数据</div>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
