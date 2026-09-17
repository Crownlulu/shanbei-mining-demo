// 全站统一的状态文字和颜色（参考飞书审批：审批中蓝、已通过绿、退回/撤回红）
export const STATUS = {
  draft: { text: '草稿', color: 'default' },
  withdrawn: { text: '已撤回', color: 'error' },
  reviewing: { text: '单位审核中', color: 'processing' },
  returned: { text: '已退回', color: 'error' },
  approved: { text: '审核通过', color: 'success' },
}

export const RESULT = {
  提交: 'processing',
  重新提交: 'processing',
  同意: 'success',
  退回修改: 'error',
  本人撤回: 'error',
  审核中: 'default',
}
