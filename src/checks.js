import { sections } from './data.js'

const sectionTitle = (k) => sections.find((s) => s.key === k)?.title ?? k

// 根据当前表单内容实时计算检查结果；修改表单后结果随之变化
export function runChecks(form) {
  const issues = []
  const d = form.declare
  const years = yearsSince(form.title.obtained)

  if (d.method === '正常申报' && years < 5) {
    issues.push({
      id: 'declare-years', level: 'error', section: 'declare', field: 'declare.method',
      text: `取得中级职称 ${years} 年，未满 5 年，不能正常申报。如有突出业绩，可改为破格申报。`,
      basis: '示例：本科学历，取得中级职称后满 5 年可申报高级工程师',
    })
  }
  if (d.method === '破格申报') {
    if (!d.breakRule) {
      issues.push({
        id: 'declare-break-empty', level: 'error', section: 'declare', field: 'declare.breakRule',
        text: '选择了破格申报，但还没有选择破格依据。',
        basis: '示例：《工程系列高级职称评审条件》第九条',
      })
    } else if (d.breakRule === 'award') {
      const ok = form.awards.some((a) => ['省部级', '国家级'].includes(a.level) && /第\s*[123]\s*(完成人|名)/.test(a.rank || ''))
      if (!ok) issues.push({
        id: 'declare-break-award', level: 'error', section: 'declare', field: 'declare.breakRule',
        text: '破格依据不成立：已填奖项为企业级，未达到“省部级及以上科技奖励”的要求。你目前满足正常申报条件，建议改回正常申报。',
        basis: '示例：《工程系列高级职称评审条件》第九条第（一）项',
      })
    } else if (d.breakRule === 'patent') {
      issues.push({
        id: 'declare-break-patent', level: 'error', section: 'declare', field: 'declare.breakRule',
        text: '破格依据不成立：申报表中没有填写发明专利。你目前满足正常申报条件，建议改回正常申报。',
        basis: '示例：《工程系列高级职称评审条件》第九条第（二）项',
      })
    }
  }
  if (d.relation === '劳务派遣' && !d.dispatch.trim()) {
    issues.push({
      id: 'declare-dispatch', level: 'error', section: 'declare', field: 'declare.dispatch',
      text: '与单位关系为劳务派遣，需填写劳务派遣单位。', basis: '示例：申报单位应为本人实际工作单位',
    })
  }
  if (d.relation === '人事代理' && !d.agency.trim()) {
    issues.push({
      id: 'declare-agency', level: 'error', section: 'declare', field: 'declare.agency',
      text: '与单位关系为人事代理，需填写人事代理单位。', basis: '示例：申报单位应为本人实际工作单位',
    })
  }

  form.certs.forEach((c, i) => {
    const no = (c.no || '').trim()
    if (!/^[A-Za-z0-9]{10,18}$/.test(no)) {
      issues.push({
        id: `cert-${c.key}`,
        level: 'error',
        section: 'certs',
        field: `certs.${i}.no`,
        text: `“${c.name || '新增证书'}”的证书编号为 ${no.length} 位，应为 10–18 位字母或数字，请对照证书原件核实。`,
        basis: '示例：证书编号应为 10–18 位字母或数字',
      })
    }
  })

  form.training.forEach((t) => {
    if (Number(t.hours) < 90) {
      issues.push({
        id: `train-${t.year}`,
        level: 'error',
        section: 'training',
        field: `training.${t.year}`,
        text: `${t.year} 年度继续教育 ${t.hours} 学时，低于每年 90 学时的要求，还差 ${90 - Number(t.hours)} 学时。如有漏填的培训，请补充后重新填写。`,
        basis: '示例：专业技术人员每年参加继续教育的时间累计不少于90学时',
      })
    }
  })

  form.attachments
    .filter((a) => a.required && !a.file)
    .forEach((a) => {
      issues.push({
        id: `file-${a.key}`,
        level: 'error',
        section: 'attachments',
        field: `attachments.${a.key}`,
        text: a.returnReason ? `单位退回：${a.returnReason}` : `缺少必传材料“${a.name}”。`,
        basis: a.returnReason ? '单位审核意见' : '示例：必传材料不全的申报将退回',
      })
    })

  const quantified = /\d+(\.\d+)?\s*(%|万元|元|吨|米|项|个月|天|人)/
  if (!quantified.test(form.achievement)) {
    issues.push({
      id: 'achievement-quant',
      level: 'warning',
      section: 'achievement',
      field: 'achievement',
      text: '工作业绩中没有可核实的数字。建议补充产量、效率、成本或安全指标等具体结果。',
      basis: '示例：业绩数据应与单位证明材料一致',
    })
  }

  form.awards.forEach((a) => {
    if (!a.rank) {
      issues.push({
        id: `award-${a.key}`,
        level: 'warning',
        section: 'awards',
        field: `awards.${a.key}.rank`,
        text: `“${a.name}”未填写本人排名，评审时可能无法计分。`,
        basis: '示例：科技奖项以证书所列完成人排名为准',
      })
    }
  })

  return issues.map((x) => ({ ...x, sectionTitle: sectionTitle(x.section) }))
}

export function sectionStatus(issues, key) {
  if (issues.some((i) => i.section === key && i.level === 'error')) return 'error'
  if (issues.some((i) => i.section === key && i.level === 'warning')) return 'warning'
  return 'ok'
}

export function yearsSince(dateStr, until = '2026-12-31') {
  const a = new Date(dateStr)
  const b = new Date(until)
  let y = b.getFullYear() - a.getFullYear()
  if (b.getMonth() < a.getMonth() || (b.getMonth() === a.getMonth() && b.getDate() < a.getDate())) y -= 1
  return y
}
