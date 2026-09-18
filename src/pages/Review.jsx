import React, { useState } from 'react'
import { Alert, Button, Card, Checkbox, Descriptions, Space, Table, Tag, Typography } from 'antd'
import { CloseCircleFilled, ExclamationCircleFilled } from '@ant-design/icons'
import { applicant, verifyRows, VERIFY_TEXT } from '../data.js'
import { yearsSince } from '../checks.js'

const { Text } = Typography

function IssueList({ items, level, go }) {
  return items.map((i) => (
    <div className="check-item" key={i.id}>
      {level === 'error'
        ? <CloseCircleFilled style={{ color: '#d4380d', marginTop: 4 }} />
        : <ExclamationCircleFilled style={{ color: '#d48806', marginTop: 4 }} />}
      <div style={{ flex: 1 }}>
        <div>{i.text}</div>
        <div className="policy-ref">{i.sectionTitle} · 依据：{i.basis}</div>
      </div>
      <Button size="small" onClick={() => go('apply', i.section)}>去修改</Button>
    </div>
  ))
}

export default function Review({ form, issues, go, app, onSubmit }) {
  const editable = ['draft', 'returned', 'withdrawn'].includes(app.status)
  const [agree, setAgree] = useState(false)
  const errors = issues.filter((i) => i.level === 'error')
  const warnings = issues.filter((i) => i.level === 'warning')
  const uploaded = form.attachments.filter((a) => a.file).length

  return (
    <>
      <div className="page-title-row">
        <h1 className="page-title">提交前检查</h1>
        <Button onClick={() => go('apply')}>返回申报表</Button>
      </div>

      {errors.length > 0 ? (
        <Alert type="error" showIcon style={{ marginBottom: 16 }}
          message={`有 ${errors.length} 项必须修改，修改后才能提交`}
          description="下列问题由系统根据评审条件逐项检查得出。点击“去修改”会直接定位到对应位置。" />
      ) : (
        <Alert type="success" showIcon style={{ marginBottom: 16 }}
          message="必填内容和硬性条件均已满足，可以提交"
          description={warnings.length ? `另有 ${warnings.length} 项建议完善，不影响提交。` : undefined} />
      )}

      {errors.length > 0 && (
        <Card title={`必须修改（${errors.length}）`} style={{ marginBottom: 16 }}>
          <IssueList items={errors} level="error" go={go} />
        </Card>
      )}
      {warnings.length > 0 && (
        <Card title={`建议完善（${warnings.length}）`} style={{ marginBottom: 16 }}>
          <IssueList items={warnings} level="warning" go={go} />
        </Card>
      )}

      <Card title="材料核验结果" style={{ marginBottom: 16 }}>
        <Table
          size="small" pagination={false} rowKey="key" dataSource={verifyRows(form)}
          columns={[
            { title: '材料名称', dataIndex: 'material', width: 300 },
            { title: '核验渠道', dataIndex: 'channel', width: 220 },
            { title: '核验时间', dataIndex: 'time', width: 150 },
            {
              title: '核验结果', dataIndex: 'status', width: 230,
              render: (v, r) => (
                <Space direction="vertical" size={2}>
                  {v === 'verified'
                    ? <Tag color="success" style={{ marginInlineEnd: 0 }}>核验通过</Tag>
                    : <Tag style={{ marginInlineEnd: 0 }}>{VERIFY_TEXT[v] || VERIFY_TEXT.none}</Tag>}
                  {v === 'verified' && r.items.length > 0 && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {r.items.map((it) => `${it.label}${it.result}`).join('，')}
                    </Text>
                  )}
                </Space>
              ),
            },
          ]}
        />
        <div className="policy-ref" style={{ marginTop: 12 }}>
          演示环境中核验结果为示例数据，正式环境对接官方查询渠道。
        </div>
      </Card>

      <Card title="核对申报信息" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small" bordered labelStyle={{ width: 140 }}>
          <Descriptions.Item label="申报人">{applicant.name}（{applicant.dept}）</Descriptions.Item>
          <Descriptions.Item label="申报">{form.declare.year}年 · {form.declare.series} · {form.declare.title} · {form.declare.method}</Descriptions.Item>
          <Descriptions.Item label="最高学历">{form.education.degree} · {form.education.school} · {form.education.major}</Descriptions.Item>
          <Descriptions.Item label="现任职称">{form.title.name}，{form.title.obtained} 取得，任职 {yearsSince(form.title.obtained)} 年</Descriptions.Item>
          <Descriptions.Item label="职业资格">{form.certs.map((c) => c.name).join('；')}</Descriptions.Item>
          <Descriptions.Item label="获奖">{form.awards.filter((a) => a.name || a.grade || a.rank).map((a) => `${a.name || '（未填名称）'}${a.grade}（${a.rank || '未填排名'}）`).join('；') || '无'}</Descriptions.Item>
          <Descriptions.Item label="继续教育">{form.training.map((t) => `${t.year}年 ${t.hours}学时`).join('，')}</Descriptions.Item>
          <Descriptions.Item label="附件">{uploaded} / {form.attachments.length} 份已上传</Descriptions.Item>
          <Descriptions.Item label="工作业绩" span={2}>{form.achievement}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)}>
            本人承诺所填信息和上传材料真实、准确，如有不实愿承担相应责任。
          </Checkbox>
          <Space>
            <Button type="primary" disabled={!editable || errors.length > 0 || !agree} onClick={onSubmit}>{app.status === 'returned' || app.status === 'withdrawn' ? '重新提交' : '提交申报'}</Button>
            {!editable && <Text type="secondary">申报已提交，当前不可重复提交</Text>}
            {editable && errors.length > 0 && <Text type="secondary">还有 {errors.length} 项需修改</Text>}
            {editable && errors.length === 0 && !agree && <Text type="secondary">请先勾选承诺</Text>}
          </Space>
        </Space>
      </Card>
    </>
  )
}
