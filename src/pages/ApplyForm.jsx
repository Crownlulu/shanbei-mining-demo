import React, { useEffect, useRef, useState } from 'react'
import {
  Alert, App as AntApp, Button, Card, Col, DatePicker, Descriptions, Dropdown, Form, Input, InputNumber,
  Popover, Radio, Row, Select, Space, Table, Tag, Typography,
} from 'antd'
import {
  CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled, FileTextOutlined, PaperClipOutlined,
  QuestionCircleOutlined, UploadOutlined, UserOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { applicant, sections, guides, tips, fieldHelp, breakRules } from '../data.js'
import { sectionStatus, yearsSince } from '../checks.js'
import { STATUS } from '../status.js'

const { Text, Paragraph } = Typography

const UPLOAD_NAMES = { f3: '聘任文件_王建军.pdf', f5: '业绩证明材料_已盖章.pdf' }

function StatusIcon({ status }) {
  if (status === 'error') return <CloseCircleFilled style={{ color: '#d4380d' }} />
  if (status === 'warning') return <ExclamationCircleFilled style={{ color: '#d48806' }} />
  return <CheckCircleFilled style={{ color: '#2e9d5b' }} />
}

function Help({ k }) {
  const h = fieldHelp[k]
  return (
    <Popover
      title={h.title}
      trigger="click"
      content={
        <div className="help-body">
          <div>{h.body}</div>
          <div className="policy-ref" style={{ marginTop: 8 }}>依据：{h.basis}</div>
        </div>
      }
    >
      <QuestionCircleOutlined style={{ color: '#1c5bb8', marginLeft: 4, cursor: 'pointer' }} />
    </Popover>
  )
}

const Tip = ({ k }) => <div className="tip">{tips[k]}</div>

function fieldIssue(issues, field) {
  return issues.find((i) => i.field === field)
}

export default function ApplyForm({ form, setForm, issues, go, focusSection, app, editable }) {
  const { message } = AntApp.useApp()
  const [active, setActive] = useState(focusSection || 'basic')
  const refs = useRef({})
  const readOnly = !editable
  const st = STATUS[app.status]
  const lastReturn = [...app.logs].reverse().find((l) => l.result === '退回修改')

  const update = (path, value) => {
    setForm((f) => {
      const next = structuredClone(f)
      let o = next
      for (let i = 0; i < path.length - 1; i++) o = o[path[i]]
      o[path[path.length - 1]] = value
      return next
    })
  }
  const updateRow = (list, key, field, value) => {
    setForm((f) => ({ ...f, [list]: f[list].map((r) => (r.key === key ? { ...r, [field]: value } : r)) }))
  }

  const scrollTo = (key) => {
    setActive(key)
    refs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    if (focusSection) setTimeout(() => scrollTo(focusSection), 50)
  }, [focusSection])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.dataset.key)
      },
      { rootMargin: '-80px 0px -55% 0px' }
    )
    Object.values(refs.current).forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const errors = issues.filter((i) => i.level === 'error')
  const warnings = issues.filter((i) => i.level === 'warning')
  const guide = guides[active]
  const activeIssues = issues.filter((i) => i.section === active)
  const activeTitle = sections.find((s) => s.key === active)?.title
  const d = form.declare

  const sectionProps = (key, title, extra) => ({
    ref: (el) => (refs.current[key] = el),
    'data-key': key,
    id: `sec-${key}`,
    className: `section-card${active === key ? ' active' : ''}`,
    title: <Space><StatusIcon status={sectionStatus(issues, key)} />{title}</Space>,
    extra,
    onFocusCapture: () => setActive(key),
    onMouseDown: () => setActive(key),
  })

  const itemStatus = (field) => {
    const it = fieldIssue(issues, field)
    return it ? { validateStatus: it.level === 'error' ? 'error' : 'warning', help: it.text } : {}
  }

  const upload = (a) => {
    setForm((f) => ({
      ...f,
      attachments: f.attachments.map((x) =>
        x.key === a.key ? { ...x, file: UPLOAD_NAMES[a.key] || `${a.name}.pdf`, returnReason: undefined } : x),
    }))
    message.success(`已上传：${a.name}`)
  }

  return (
    <>
      <div className="page-title-row">
        <Space align="center">
          <h1 className="page-title">2026年度职称申报表</h1>
          <Tag color={st.color}>{st.text}</Tag>
        </Space>
        {!readOnly && (
          <Space size={12}>
            <span className="save-note">内容将自动保存 · 最近保存 15:36</span>
            <Dropdown
              menu={{ items: [{ key: 'd', icon: <FileTextOutlined />, label: '2026年度职称申报表（本草稿）· 15:36' }] }}
            >
              <Button icon={<FileTextOutlined />}>草稿箱（1）</Button>
            </Dropdown>
            <Button onClick={() => message.success('草稿已保存')}>保存草稿</Button>
            <Button type="primary" onClick={() => go('review')}>提交前检查</Button>
          </Space>
        )}
      </div>

      {readOnly && (
        <Alert type="info" showIcon style={{ marginBottom: 16 }}
          message="申报表已提交，当前为只读状态。单位审核开始前可在「申报记录」中撤回修改。" />
      )}
      {app.status === 'returned' && lastReturn && (
        <Alert type="error" showIcon style={{ marginBottom: 16 }}
          message={`单位审核退回：${lastReturn.comment}`}
          description={`${lastReturn.person} · ${lastReturn.time}。修改完成后，请重新进行提交前检查并提交。`} />
      )}

      <div className="form-shell">
        {/* 左：章节导航 */}
        <div className="nav-col sticky">
          <Card size="small" styles={{ body: { padding: 8 } }}>
            {sections.map((s, idx) => (
              <div key={s.key} className={`section-nav-item${active === s.key ? ' active' : ''}`} onClick={() => scrollTo(s.key)}>
                <span>{idx + 1}. {s.title}</span>
                <StatusIcon status={sectionStatus(issues, s.key)} />
              </div>
            ))}
          </Card>
        </div>

        {/* 中：表单 */}
        <Form layout="vertical" disabled={readOnly} requiredMark={false}>
          <Card {...sectionProps('basic', '基本信息', <Text type="secondary">由人事档案同步</Text>)}>
            <Tip k="basic" />
            <div style={{ display: 'flex', gap: 24 }}>
              <div className="photo-box">
                <UserOutlined style={{ fontSize: 28 }} />
                证件照
                <Text type="success" style={{ fontSize: 12 }}>已上传</Text>
              </div>
              <Descriptions column={2} size="small" style={{ flex: 1 }}>
                <Descriptions.Item label="姓名">{applicant.name}</Descriptions.Item>
                <Descriptions.Item label="身份证号">{applicant.idMasked}</Descriptions.Item>
                <Descriptions.Item label="性别">{applicant.gender}</Descriptions.Item>
                <Descriptions.Item label="民族">{applicant.ethnicity}</Descriptions.Item>
                <Descriptions.Item label="出生年月">{applicant.birth}</Descriptions.Item>
                <Descriptions.Item label="手机">{applicant.phone}</Descriptions.Item>
                <Descriptions.Item label="所在部门">{applicant.dept}</Descriptions.Item>
                <Descriptions.Item label="现岗位">{applicant.post}</Descriptions.Item>
                <Descriptions.Item label="参加工作">{applicant.workStart}</Descriptions.Item>
              </Descriptions>
            </div>
          </Card>

          <Card {...sectionProps('declare', '申报信息')}>
            <Tip k="declare" />
            <Form component={false} layout="horizontal" labelCol={{ flex: '128px' }} labelAlign="right"
              colon disabled={readOnly} requiredMark>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="申报年度" required>
                    <Select value={d.year} onChange={(v) => update(['declare', 'year'], v)} options={[{ value: '2026' }]} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="申报级别" required>
                    <Select value={d.level} onChange={(v) => update(['declare', 'level'], v)}
                      options={['初级', '中级', '副高级', '正高级'].map((v) => ({ value: v }))} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="申报系列" required>
                    <Select value={d.series} onChange={(v) => update(['declare', 'series'], v)}
                      options={['工程系列', '经济系列', '会计系列'].map((v) => ({ value: v }))} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="申报职称" required>
                    <Select value={d.title} onChange={(v) => update(['declare', 'title'], v)}
                      options={['高级工程师'].map((v) => ({ value: v }))} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="现从事专业" required>
                    <Input value={d.major} onChange={(e) => update(['declare', 'major'], e.target.value)} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="专业工作年限" required>
                    <InputNumber min={0} max={50} value={d.proYears} addonAfter="年" style={{ width: '100%' }}
                      onChange={(n) => update(['declare', 'proYears'], n ?? 0)} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label={<span>申报方式<Help k="method" /></span>} required {...itemStatus('declare.method')}>
                    <Radio.Group value={d.method}
                      onChange={(e) => {
                        update(['declare', 'method'], e.target.value)
                        if (e.target.value !== '破格申报') update(['declare', 'breakRule'], null)
                      }}
                      options={['正常申报', '破格申报', '转评'].map((v) => ({ value: v, label: v }))} />
                  </Form.Item>
                </Col>
                {d.method === '破格申报' && (
                  <Col span={24}>
                    <Form.Item label={<span>破格依据<Help k="breakRule" /></span>} required {...itemStatus('declare.breakRule')}>
                      <Select placeholder="请选择破格依据" value={d.breakRule} allowClear
                        onChange={(v) => update(['declare', 'breakRule'], v ?? null)} options={breakRules} />
                    </Form.Item>
                  </Col>
                )}
                <Col span={24}>
                  <Form.Item label="申报单位" required>
                    <Input value={d.unit} onChange={(e) => update(['declare', 'unit'], e.target.value)} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<span>与单位关系<Help k="relation" /></span>} required>
                    <Select value={d.relation} onChange={(v) => update(['declare', 'relation'], v)}
                      options={['在编在岗', '劳动合同制', '人事代理', '劳务派遣'].map((v) => ({ value: v }))} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="参加工作时间" required>
                    <DatePicker picker="month" style={{ width: '100%' }} value={dayjs(d.workStart)}
                      onChange={(x) => x && update(['declare', 'workStart'], x.format('YYYY-MM'))} />
                  </Form.Item>
                </Col>
                {d.relation === '人事代理' && (
                  <Col span={24}>
                    <Form.Item label="人事代理单位" required {...itemStatus('declare.agency')}>
                      <Input placeholder="请输入人事代理单位" value={d.agency}
                        onChange={(e) => update(['declare', 'agency'], e.target.value)} />
                    </Form.Item>
                  </Col>
                )}
                {d.relation === '劳务派遣' && (
                  <Col span={24}>
                    <Form.Item label="劳务派遣单位" required {...itemStatus('declare.dispatch')}>
                      <Input placeholder="请输入劳务派遣单位" value={d.dispatch}
                        onChange={(e) => update(['declare', 'dispatch'], e.target.value)} />
                    </Form.Item>
                  </Col>
                )}
                <Col span={12}>
                  <Form.Item label={<span>是否委托评审<Help k="entrust" /></span>} required>
                    <Radio.Group value={d.entrust} onChange={(e) => update(['declare', 'entrust'], e.target.value)}
                      options={['否', '是'].map((v) => ({ value: v, label: v }))} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>

          <Card {...sectionProps('education', '学历学位',
            form.education.verified && <Tag color="success">学信网核验通过</Tag>)}>
            <Tip k="education" />
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="最高学历">
                  <Select value={form.education.degree} onChange={(v) => update(['education', 'degree'], v)}
                    options={['博士研究生', '硕士研究生', '大学本科', '大学专科'].map((v) => ({ value: v }))} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="毕业院校">
                  <Input value={form.education.school} onChange={(e) => update(['education', 'school'], e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="所学专业">
                  <Input value={form.education.major} onChange={(e) => update(['education', 'major'], e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="毕业时间">
                  <DatePicker picker="month" style={{ width: '100%' }} value={dayjs(form.education.graduate)}
                    onChange={(x) => x && update(['education', 'graduate'], x.format('YYYY-MM'))} />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item label="学历证书编号">
                  <Input value={form.education.certNo} onChange={(e) => update(['education', 'certNo'], e.target.value)} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card {...sectionProps('title', '现任职称',
            <Text type="secondary">任现职 {yearsSince(form.title.obtained)} 年</Text>)}>
            <Tip k="title" />
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="职称名称">
                  <Select value={form.title.name} onChange={(v) => update(['title', 'name'], v)}
                    options={['助理工程师', '工程师', '高级工程师'].map((v) => ({ value: v }))} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="职称专业">
                  <Input value={form.title.major} onChange={(e) => update(['title', 'major'], e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="取得资格时间" extra="用于计算任现职年限">
                  <DatePicker style={{ width: '100%' }} value={dayjs(form.title.obtained)}
                    onChange={(x) => x && update(['title', 'obtained'], x.format('YYYY-MM-DD'))} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="聘任时间">
                  <DatePicker style={{ width: '100%' }} value={dayjs(form.title.hired)}
                    onChange={(x) => x && update(['title', 'hired'], x.format('YYYY-MM-DD'))} />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item label="资格证书编号">
                  <Input value={form.title.certNo} onChange={(e) => update(['title', 'certNo'], e.target.value)} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card {...sectionProps('certs', '职业资格')}>
            <Tip k="certs" />
            <Table
              size="small" pagination={false} rowKey="key" dataSource={form.certs}
              columns={[
                {
                  title: '证书', dataIndex: 'name',
                  render: (v, r) => (
                    <Space direction="vertical" size={0}>
                      <Text>{v}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{r.issuer} · {r.date}</Text>
                    </Space>
                  ),
                },
                {
                  title: '证书编号', dataIndex: 'no', width: 230,
                  render: (v, r, i) => {
                    const it = fieldIssue(issues, `certs.${i}.no`)
                    return (
                      <Form.Item style={{ margin: 0 }} validateStatus={it ? 'error' : undefined}
                        help={it ? `当前 ${v.length} 位，应为 10–18 位` : undefined}>
                        <Input value={v} onChange={(e) => updateRow('certs', r.key, 'no', e.target.value)} />
                      </Form.Item>
                    )
                  },
                },
                {
                  title: '核验', dataIndex: 'status', width: 110,
                  render: (s) => s === 'verified'
                    ? <Tag color="success">联网核验通过</Tag>
                    : <Tag>待人工核验</Tag>,
                },
              ]}
            />
          </Card>

          <Card {...sectionProps('achievement', '工作业绩')}>
            <Tip k="achievement" />
            <Form.Item label="任现职以来的主要业绩" {...itemStatus('achievement')}>
              <Input.TextArea rows={5} maxLength={1500} value={form.achievement}
                onChange={(e) => update(['achievement'], e.target.value)} />
            </Form.Item>
            <Text strong style={{ display: 'block', margin: '8px 0' }}>主持或参与的项目</Text>
            <Table size="small" pagination={false} rowKey="key" dataSource={form.projects}
              columns={[
                { title: '项目名称', dataIndex: 'name' },
                { title: '本人角色', dataIndex: 'role', width: 120 },
                { title: '起止时间', dataIndex: 'period', width: 190 },
              ]} />
          </Card>

          <Card {...sectionProps('awards', '获奖情况', <Text type="secondary">选填</Text>)}>
            <Tip k="awards" />
            <Table size="small" pagination={false} rowKey="key" dataSource={form.awards}
              columns={[
                { title: '奖项名称', dataIndex: 'name' },
                { title: '级别', dataIndex: 'level', width: 80 },
                { title: '等级', dataIndex: 'grade', width: 80 },
                { title: '年度', dataIndex: 'year', width: 64 },
                {
                  title: '本人排名', dataIndex: 'rank', width: 160,
                  render: (v, r) => {
                    const it = fieldIssue(issues, `awards.${r.key}.rank`)
                    return (
                      <Form.Item style={{ margin: 0 }} validateStatus={it ? 'warning' : undefined}>
                        <Input placeholder="如：第2完成人" value={v}
                          onChange={(e) => updateRow('awards', r.key, 'rank', e.target.value)} />
                      </Form.Item>
                    )
                  },
                },
              ]} />
          </Card>

          <Card {...sectionProps('training', '继续教育', <Text type="secondary">每年不少于 90 学时</Text>)}>
            <Tip k="training" />
            <Table size="small" pagination={false} rowKey="key" dataSource={form.training}
              columns={[
                { title: '年度', dataIndex: 'year', width: 100 },
                {
                  title: '学时', dataIndex: 'hours', width: 180,
                  render: (v, r) => (
                    <Form.Item style={{ margin: 0 }} validateStatus={Number(v) < 90 ? 'error' : undefined}>
                      <InputNumber min={0} max={500} value={v} addonAfter="学时" style={{ width: 150 }}
                        onChange={(n) => updateRow('training', r.key, 'hours', n ?? 0)} />
                    </Form.Item>
                  ),
                },
                {
                  title: '情况',
                  render: (_, r) => Number(r.hours) >= 90
                    ? <Text type="secondary">达到要求</Text>
                    : <Text type="danger">还差 {90 - Number(r.hours)} 学时</Text>,
                },
              ]} />
          </Card>

          <Card {...sectionProps('attachments', '附件材料', <Text type="secondary">PDF / JPG，单个不超过 10MB</Text>)}>
            <Tip k="attachments" />
            {form.attachments.map((a) => (
              <div className="kv" key={a.key} style={{ borderBottom: '1px solid #f0f1f4', padding: '10px 0' }}>
                <Space>
                  <Text>{a.name}</Text>
                  {a.required ? <Tag color="blue">必传</Tag> : <Tag>选传</Tag>}
                </Space>
                {a.file ? (
                  <Space>
                    <PaperClipOutlined className="muted" />
                    <a>{a.file}</a>
                  </Space>
                ) : (
                  <Space>
                    <Text type="danger">{a.returnReason ? '单位要求重新上传' : '未上传'}</Text>
                    <Button size="small" icon={<UploadOutlined />} onClick={() => upload(a)}>上传</Button>
                  </Space>
                )}
              </div>
            ))}
          </Card>
        </Form>

        {/* 右：智能检查 + 填写说明 */}
        <div className="sticky">
          <Card size="small" style={{ marginBottom: 12 }}>
            <div className="kv" style={{ padding: 0 }}>
              <Text>智能检查</Text>
              <Space size={12}>
                <Text type={errors.length ? 'danger' : 'secondary'}>{errors.length} 项需修改</Text>
                <Text type={warnings.length ? 'warning' : 'secondary'}>{warnings.length} 项建议</Text>
              </Space>
            </div>
          </Card>
          <Card size="small" title={`填写说明 · ${activeTitle}`}>
            {activeIssues.length > 0 && (
              <div className="guide-block">
                {activeIssues.map((i) => (
                  <Alert key={i.id} type={i.level} showIcon style={{ marginBottom: 8 }} message={i.text} />
                ))}
              </div>
            )}
            <div className="guide-block">
              <div className="guide-label">要求</div>
              <Paragraph style={{ marginBottom: 0 }}>{guide.need}</Paragraph>
            </div>
            {guide.example && (
              <div className="guide-block">
                <div className="guide-label">参考写法</div>
                <div className="guide-example">{guide.example}</div>
              </div>
            )}
            <div className="guide-block">
              <div className="guide-label">常见问题</div>
              <ul style={{ paddingLeft: 18, margin: 0 }}>
                {guide.mistakes.map((m) => <li key={m} style={{ lineHeight: 1.8 }}>{m}</li>)}
              </ul>
            </div>
            <div className="guide-block policy-ref">依据：{guide.policy}</div>
          </Card>
        </div>
      </div>
    </>
  )
}
