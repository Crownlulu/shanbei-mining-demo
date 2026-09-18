import React, { useState } from 'react'
import { Alert, Button, Card, Col, List, Modal, Progress, Row, Space, Tag, Timeline, Typography } from 'antd'
import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons'
import { applicant, sections, timeline, notices } from '../data.js'
import { sectionStatus, yearsSince } from '../checks.js'
import { STATUS } from '../status.js'

const { Text } = Typography

export default function Workbench({ form, issues, app, go }) {
  const st = STATUS[app.status]
  const submitted = ['reviewing', 'approved'].includes(app.status)
  const lastReturn = [...app.logs].reverse().find((l) => l.result === '退回修改')
  const [guideOpen, setGuideOpen] = useState(false)
  const route = [
    ['工作台', '看“申报条件自查”，系统已提示 2025 年继续教育学时不足。'],
    ['申报表 · 申报信息', '点字段旁的问号查看填写说明和条款依据；把“申报方式”切到“破格申报”并选一项依据，系统会判断依据是否成立。'],
    ['申报表 · 逐项修正', '补全证书编号、修正继续教育学时、上传聘任文件、填写获奖排名、在业绩中补充具体数字。'],
    ['提交前检查', '查看“必须修改”和“建议完善”两组问题，点“去修改”可直接定位；改完后勾选承诺并提交。'],
    ['申报记录', '点虚线框内的“模拟退回修改”，回到工作台会看到退回提醒；重新上传材料后重新提交，再点“模拟审核通过”，查看完整审批记录。'],
  ]
  const done = sections.filter((s) => sectionStatus(issues, s.key) === 'ok').length
  const errors = issues.filter((i) => i.level === 'error')
  const titleYears = yearsSince(form.title.obtained)
  const lowYears = form.training.filter((t) => Number(t.hours) < 90)

  const selfCheck = [
    { ok: true, label: '学历', value: `${form.education.degree}，学信网已核验` },
    { ok: titleYears >= 5, label: '任现职年限', value: `取得工程师 ${titleYears} 年（要求满 5 年）` },
    {
      ok: lowYears.length === 0,
      label: '继续教育',
      value: lowYears.length ? `${lowYears.map((t) => t.year).join('、')} 年度学时不足 90` : '近三年均达到 90 学时',
    },
  ]

  return (
    <>
      <div className="page-title-row">
        <h1 className="page-title">你好，{applicant.name}</h1>
        <Text type="secondary">{applicant.dept} · {applicant.post}</Text>
      </div>

      {app.status === 'returned' && (
        <Alert
          type="error" showIcon style={{ marginBottom: 16 }}
          message={`你的申报被退回修改（${lastReturn?.person}，${lastReturn?.time}）`}
          description={`退回意见：${lastReturn?.comment}`}
          action={<Button size="small" type="primary" onClick={() => go('apply', 'attachments')}>去修改</Button>}
        />
      )}
      {['draft', 'withdrawn'].includes(app.status) && (
        <Alert
          type="info" showIcon style={{ marginBottom: 16 }}
          message="2026年度职称评审个人申报已开始，截止时间为 10月31日 17:00"
          action={<Button size="small" type="primary" onClick={() => go('apply')}>去填写</Button>}
        />
      )}

      <Row gutter={16}>
        <Col span={16}>
          <Card title="我的申报" style={{ marginBottom: 16 }}>
            <Row align="middle" gutter={24}>
              <Col flex="auto">
                <Space direction="vertical" size={6}>
                  <Space>
                    <Text strong style={{ fontSize: 16 }}>
                      {applicant.series} · {applicant.major} · {applicant.level}
                    </Text>
                    <Tag color={st.color}>{st.text}</Tag>
                  </Space>
                  <Text type="secondary">
                    {submitted
                      ? `已于 ${app.submittedAt} 提交，申报编号 ${app.no}`
                      : `已完成 ${done} / ${sections.length} 部分` + (errors.length ? `，有 ${errors.length} 项需修改` : '，可以提交')}
                  </Text>
                </Space>
              </Col>
              <Col>
                <Progress type="circle" size={64} percent={submitted ? 100 : Math.round((done / sections.length) * 100)} />
              </Col>
              <Col>
                {submitted
                  ? <Button onClick={() => go('records')}>查看进度</Button>
                  : <Button type="primary" onClick={() => go('apply')}>{app.status === 'returned' ? '去修改' : '继续填写'}</Button>}
              </Col>
            </Row>
          </Card>

          <Card title="申报条件自查" extra={<Text type="secondary">根据已填信息自动判断</Text>} style={{ marginBottom: 16 }}>
            {selfCheck.map((c) => (
              <div className="kv" key={c.label}>
                <Space>
                  {c.ok
                    ? <CheckCircleFilled style={{ color: '#2e9d5b' }} />
                    : <ExclamationCircleFilled style={{ color: '#d4380d' }} />}
                  <Text>{c.label}</Text>
                </Space>
                <Text type={c.ok ? 'secondary' : 'danger'}>{c.value}</Text>
              </div>
            ))}
          </Card>

          <Card title="通知公告" extra={<a>更多</a>}>
            <List
              size="small"
              dataSource={notices}
              renderItem={(n) => (
                <List.Item extra={<Text type="secondary">{n.date}</Text>}>
                  <a>{n.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card title="本年度安排" style={{ marginBottom: 16 }}>
            <Timeline
              items={timeline.map((t) => ({
                color: t.done ? 'gray' : t.current ? 'blue' : 'gray',
                children: (
                  <Space direction="vertical" size={0}>
                    <Text type="secondary" style={{ fontSize: 12 }}>{t.date}</Text>
                    <Text strong={t.current}>{t.text}</Text>
                  </Space>
                ),
              }))}
            />
          </Card>
          <Card title="需要帮助">
            <Space direction="vertical" size={4}>
              <Text>人事专员：李老师</Text>
              <Text type="secondary">内线 6203 · 工作日 8:30–17:30</Text>
              <a onClick={() => go('policies')}>查看评审条件和填写说明</a>
              <a onClick={() => setGuideOpen(true)}>演示说明（5 分钟路线）</a>
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal title="演示说明" open={guideOpen} onCancel={() => setGuideOpen(false)} footer={null} width={640}>
        <p style={{ color: '#5c6370', marginTop: 0 }}>
          这是员工填报端的演示原型。示例员工的材料中预设了 3 项必须修改和 2 项建议完善的问题，可按下面的顺序体验。
        </p>
        <div style={{ marginBottom: 14 }}>
          <Text strong>本次演示的三个重点</Text>
          <ul style={{ paddingLeft: 20, lineHeight: 1.9, margin: '6px 0 0', color: '#5c6370' }}>
            <li>每个字段都有填写说明和条款依据，员工不用问人</li>
            <li>提交前系统逐条列出问题，并说明依据</li>
            <li>学历和职业资格证书联网核验，人事部门不用逐份查验</li>
          </ul>
        </div>
        <ol style={{ paddingLeft: 20, lineHeight: 1.9 }}>
          {route.map(([t, d]) => (
            <li key={t} style={{ marginBottom: 10 }}>
              <Text strong>{t}</Text>
              <div style={{ color: '#5c6370' }}>{d}</div>
            </li>
          ))}
        </ol>
        <div style={{ background: '#f5f6f8', borderRadius: 4, padding: '10px 12px', color: '#5c6370', fontSize: 13 }}>
          说明：页面中的人员、单位、证书编号和政策条款均为示例，接入贵单位正式评审文件后会相应调整；本演示环境没有后端，刷新页面后数据会恢复初始状态。
        </div>
      </Modal>
    </>
  )
}
