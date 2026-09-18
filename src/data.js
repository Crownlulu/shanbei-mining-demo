// 演示数据：人物、单位、证书编号均为虚构
export const applicant = {
  name: '王建军',
  gender: '男',
  ethnicity: '汉族',
  phone: '139****6021',
  birth: '1989-03',
  idMasked: '6108**********1532',
  org: '××矿业有限公司',
  dept: '生产技术部',
  post: '采掘技术主管',
  workStart: '2012-07',
  series: '工程系列',
  major: '采矿工程',
  level: '高级工程师',
}

export const initialForm = {
  declare: {
    year: '2026',
    level: '副高级',
    series: '工程系列',
    title: '高级工程师',
    major: '采矿工程',
    method: '正常申报',
    breakRule: null,
    unit: '××矿业有限公司',
    relation: '劳动合同制',
    agency: '',
    dispatch: '',
    workStart: '2012-07',
    proYears: 14,
    entrust: '否',
  },
  education: {
    degree: '大学本科',
    school: '西安科技大学',
    major: '采矿工程',
    graduate: '2012-07',
    certNo: '107041201205002316',
    verified: true,
    verify: {
      channel: '学信网',
      time: '2026-09-15 10:22',
      status: 'verified',
      items: [
        { label: '姓名', result: '一致' },
        { label: '证书编号', result: '一致' },
        { label: '毕业时间', result: '一致' },
      ],
    },
  },
  title: {
    name: '工程师',
    major: '采矿工程',
    obtained: '2019-07-01',
    certNo: 'SXGC2019071186',
    hired: '2019-09-01',
  },
  certs: [
    {
      key: 'c1', name: '注册安全工程师（煤矿安全）', no: 'ZA20210310475', issuer: '应急管理部', date: '2021-03-10',
      status: 'verified',
      verify: {
        channel: '应急管理部职业资格证书查询',
        time: '2026-09-15 10:23',
        status: 'verified',
        items: [
          { label: '姓名', result: '一致' },
          { label: '证书编号', result: '一致' },
          { label: '发证日期', result: '一致' },
        ],
      },
    },
    {
      key: 'c2', name: '一级建造师（矿业工程）', no: '0612345', issuer: '住房和城乡建设部', date: '2022-11-18',
      status: 'manual',
      verify: {
        channel: '中国人事考试网',
        time: '',
        status: 'manual',
        note: '该证书暂不支持联网核验，需人工核对原件',
        items: [],
      },
    },
  ],
  achievement:
    '2021年至今负责3号井综采工作面的采掘技术管理，主持编制工作面作业规程，组织开展顶板管理和巷道支护优化，工作面安全生产情况良好，得到单位领导认可。',
  projects: [
    { key: 'p1', name: '3号井综采工作面顶板支护优化', role: '负责人', period: '2022-03 至 2023-06' },
    { key: 'p2', name: '智能化采掘工作面改造', role: '主要参与人', period: '2024-01 至 2025-08' },
  ],
  awards: [
    { key: 'a1', name: '企业科学技术进步奖', level: '企业级', grade: '二等奖', year: '2023', rank: '' },
  ],
  training: [
    { key: 't2023', year: '2023', hours: 96 },
    { key: 't2024', year: '2024', hours: 104 },
    { key: 't2025', year: '2025', hours: 72 },
  ],
  attachments: [
    { key: 'f1', name: '学历学位证书', required: true, file: '学历证书_王建军.pdf' },
    { key: 'f2', name: '现任职称资格证书', required: true, file: '工程师资格证书.pdf' },
    { key: 'f3', name: '现任职称聘任文件', required: true, file: null },
    { key: 'f4', name: '职业资格证书', required: false, file: '注册安全工程师证书.pdf' },
    { key: 'f5', name: '业绩证明材料', required: true, file: '工作面技术总结.pdf' },
    { key: 'f6', name: '获奖证书', required: false, file: '科技进步奖证书.jpg' },
  ],
}

export const sections = [
  { key: 'basic', title: '基本信息' },
  { key: 'declare', title: '申报信息' },
  { key: 'education', title: '学历学位' },
  { key: 'title', title: '现任职称' },
  { key: 'certs', title: '职业资格' },
  { key: 'achievement', title: '工作业绩' },
  { key: 'awards', title: '获奖情况' },
  { key: 'training', title: '继续教育' },
  { key: 'attachments', title: '附件材料' },
]

// 右侧“填写说明”。政策依据为示例条款，正式使用时替换为客户提供的评审文件
// 章节开头的灰底要点（一句话），详细内容在右侧说明面板
export const tips = {
  basic: '基本信息来自人事档案，如需修改请联系人事专员。',
  declare: '申报方式和与单位关系决定后面要填哪些内容，请先确认这两项。',
  education: '学历会自动向学信网核验，通过后无需上传认证报告。',
  title: '任现职年限从取得资格之日算起，不是聘任之日。',
  certs: '只填与申报专业相关的证书，培训合格证不属于职业资格证书。',
  achievement: '写本人做了什么、结果如何，尽量给出可核实的数字。',
  awards: '没有奖项可以不填；有奖项请写明本人排名。',
  training: '按年度填写，每年不少于 90 学时。',
  attachments: '带“必传”的材料缺一项将无法提交，复印件须加盖单位公章。',
}

export const guides = {
  declare: {
    need: '申报方式分为正常申报、破格申报和转评。选择破格申报时，需同时满足所选破格条件，系统会按已填信息逐条判断。',
    example: '2026 / 副高级 / 工程系列 / 高级工程师 / 正常申报',
    mistakes: ['不满足年限要求却选择正常申报', '与单位关系选“劳务派遣”但未填写派遣单位'],
    policy: '示例：《工程系列高级职称评审条件》第四条、第九条',
  },
  basic: {
    need: '基本信息由人事档案同步，如有错误请联系本单位人事专员修改，不能在此处直接编辑。',
    example: null,
    mistakes: ['参加工作时间与档案不一致', '申报专业与现任职称专业不一致且未说明原因'],
    policy: '示例：《工程系列高级职称评审条件》第三条',
  },
  education: {
    need: '填写国家承认的最高学历。系统会自动向学信网核验，核验通过后无需再上传认证报告。',
    example: '大学本科 / 西安科技大学 / 采矿工程 / 2012-07',
    mistakes: ['把在读学历填为最高学历', '证书编号少填或多填位数'],
    policy: '示例：《工程系列高级职称评审条件》第五条',
  },
  title: {
    name: '现任职称',
    need: '填写目前已取得的最高职称。任现职年限从取得资格之日算至今年12月31日。',
    example: '工程师 / 采矿工程 / 2019-07-01 取得',
    mistakes: ['用聘任时间代替取得时间计算年限', '申报高级工程师时，取得中级后未满5年'],
    policy: '示例：本科学历，取得中级职称后从事本专业工作满5年，可申报高级工程师',
  },
  certs: {
    need: '只填写与申报专业相关的职业资格证书。系统会对可联网查询的证书自动核验，其余由人事部门人工核对。',
    example: '注册安全工程师（煤矿安全） / ZA20210310475 / 应急管理部 / 2021-03-10',
    mistakes: ['证书编号少填位数', '把培训合格证当作职业资格证书填写'],
    policy: '示例：证书编号应为 10–18 位字母或数字，以证书原件为准',
  },
  achievement: {
    need: '写清你本人做了什么、结果怎样，尽量给出可核实的数字，例如产量、效率、成本、安全指标。',
    example:
      '主持3号井综采工作面顶板支护优化，将单班推进度由4.2米提高到5.1米，年节约支护材料费约86万元，工作面连续18个月无顶板事故。',
    mistakes: ['只写岗位职责，没有写本人成果', '只有定性评价，如“效果良好”“领导认可”'],
    policy: '示例：业绩需有单位出具的证明材料，数据应与证明材料一致',
  },
  awards: {
    need: '填写任现职以来获得的奖项，并注明本人排名。没有奖项可以不填。',
    example: '企业科学技术进步奖 / 二等奖 / 2023 / 第2完成人',
    mistakes: ['未填写本人排名', '把集体荣誉当作个人奖项'],
    policy: '示例：科技奖项以证书所列完成人排名为准',
  },
  training: {
    need: '按年度填写继续教育学时，系统会逐年检查是否达到要求。',
    example: '2025 / 96 学时',
    mistakes: ['只填合计学时，未按年度填写', '某一年度学时不足'],
    policy: '示例：专业技术人员每年参加继续教育的时间累计不少于90学时',
  },
  attachments: {
    need: '上传 PDF 或 JPG，单个文件不超过 10MB。带“必传”标记的材料缺一项将无法提交。',
    example: null,
    mistakes: ['上传手机翻拍件，文字看不清', '聘任文件漏传'],
    policy: '示例：所有复印件须加盖单位公章',
  },
}

export const timeline = [
  { date: '09-15', text: '年度职称评审通知发布', done: true },
  { date: '10-31', text: '个人网上申报截止', done: false, current: true },
  { date: '11-15', text: '单位审核及公示', done: false },
  { date: '12 月', text: '评审委员会评审', done: false },
]

export const notices = [
  { title: '关于开展2026年度职称评审工作的通知', date: '2026-09-15' },
  { title: '职称申报材料填写说明（2026版）', date: '2026-09-15' },
  { title: '继续教育学时认定常见问题解答', date: '2026-09-10' },
]

// 申报信息中带“?”的字段说明
export const fieldHelp = {
  method: {
    title: '申报方式怎么选',
    body: '正常申报：学历和任职年限均满足要求。\n破格申报：年限不足，但有突出业绩，需满足破格条件之一。\n转评：已取得其他系列同级职称，转到本系列。',
    basis: '示例：《工程系列高级职称评审条件》第四条',
  },
  breakRule: {
    title: '破格条件',
    body: '选择破格申报时必须选择一项破格依据，并上传对应证明材料。',
    basis: '示例：《工程系列高级职称评审条件》第九条',
  },
  relation: {
    title: '与申报单位关系',
    body: '人事代理人员需填写人事代理单位；劳务派遣人员需填写劳务派遣单位。',
    basis: '示例：申报单位应为本人实际工作单位',
  },
  entrust: {
    title: '什么是委托评审',
    body: '本单位所在地没有对应评审委员会时，由上级主管部门委托其他评委会评审。本单位员工一般选择“否”。',
    basis: '示例：以本年度评审通知为准',
  },
}

export const breakRules = [
  { value: 'award', label: '获省部级及以上科技奖励（本人排名前三）' },
  { value: 'patent', label: '作为第一发明人取得发明专利 2 项及以上' },
]

export const history = {
  key: 'h2019',
  title: '工程师（中级）职称申报',
  year: '2019',
  no: 'ZC2019-0412-0127',
  status: 'approved',
  at: '2019-04-12 09:18',
  logs: [
    { node: '个人申报', person: '王建军', result: '提交', comment: '', time: '2019-04-12 09:18' },
    { node: '单位审核', person: '人力资源部 李老师', result: '同意', comment: '材料齐全', time: '2019-04-15 14:02' },
    { node: '评委会评审', person: '工程系列中级评委会', result: '同意', comment: '', time: '2019-06-20 10:00' },
  ],
}


// 核验结果文字（演示环境为示例数据，正式环境对接官方查询渠道）
export const VERIFY_TEXT = {
  verified: '核验通过',
  manual: '需人工核对原件',
  none: '待人工核对',
}

// 汇总学历和职业资格的核验情况，供提交前检查页展示
export function verifyRows(form) {
  const rows = []
  const ev = form.education.verify
  rows.push({
    key: 'edu',
    material: `学历证书（${form.education.degree}）`,
    channel: ev?.channel || '—',
    time: ev?.time || '—',
    status: ev?.status || 'none',
    note: ev?.note || '',
    items: ev?.items || [],
  })
  form.certs.forEach((c) => {
    rows.push({
      key: c.key,
      material: c.name || '（未填写证书名称）',
      channel: c.verify?.channel || '—',
      time: c.verify?.time || '—',
      status: c.verify?.status || (c.status === 'verified' ? 'verified' : 'none'),
      note: c.verify?.note || '',
      items: c.verify?.items || [],
    })
  })
  return rows
}
