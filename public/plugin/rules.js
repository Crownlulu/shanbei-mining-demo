/*!
 * 校验规则表
 * 说明：规则与页面结构解耦。ctx 提供取值能力，规则只描述"什么情况算不合格"。
 * 接入客户真实系统时，本文件可原样复用；需要替换的只有 guide-data.js 里的字段定位。
 */
window.ZCP_RULES = (function () {

  var TODAY = new Date('2026-09-20');

  function yearsSince(str) {
    if (!str) return null;
    var m = /^(\d{4})[-/](\d{1,2})(?:[-/](\d{1,2}))?$/.exec(String(str).trim());
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +(m[3] || 1));
    if (isNaN(d.getTime())) return null;
    return (TODAY - d) / (365.25 * 24 * 3600 * 1000);
  }

  var LEVEL_RANK = { '国家级': 4, '省部级': 3, '市厅级': 2, '企业级': 1 };

  function run(ctx) {
    var out = [];
    function err(field, text, basis) { out.push({ level: 'error', field: field, text: text, basis: basis }); }
    function warn(field, text, basis) { out.push({ level: 'warn', field: field, text: text, basis: basis }); }

    var v = ctx.val;

    // --- 任职年限 ---
    var y = yearsSince(v('obtained'));
    if (v('method') === '正常申报' && y !== null && y < 5) {
      err({ name: 'obtained' },
        '取得现职称满 ' + y.toFixed(1) + ' 年，不足 5 年，不符合正常申报条件。',
        '示例：本科学历，取得中级职称后从事本专业工作满 5 年，可申报高级工程师');
    }

    // --- 破格判断 ---
    if (v('method') === '破格申报') {
      var rule = v('breakRule');
      if (!rule) {
        err({ name: 'breakRule' }, '选择了破格申报，但还没有填写破格依据。',
          '示例：《工程系列高级职称评审条件》第九条');
      } else if (rule.indexOf('科技奖励') >= 0 || rule.indexOf('省部级') >= 0) {
        var rows = ctx.gridRows('awardGrid');
        var ok = rows.some(function (r) {
          var lv = LEVEL_RANK[(r['奖励级别'] || '').trim()] || 0;
          var rank = r['本人排名'] || '';
          return lv >= 3 && /第\s*[123]\s*(完成人|名)/.test(rank);
        });
        if (!ok) {
          var filled = rows.filter(function (r) { return r['奖项名称'] || r['奖励级别']; });
          var why = filled.length
            ? '已填奖项为' + (filled[0]['奖励级别'] || '未填级别') + '，未达到"省部级及以上、本人排名前三"的要求。'
            : '获奖情况中还没有填写符合条件的奖项。';
          err({ name: 'breakRule' },
            '破格依据不成立：' + why + (y !== null && y >= 5 ? '你目前满足正常申报条件，建议改回正常申报。' : ''),
            '示例：《工程系列高级职称评审条件》第九条');
        }
      }
    }

    // --- 必填项 ---
    [
      ['school', '毕业院校'], ['eduMajor', '所学专业'], ['graduate', '毕业时间'],
      ['degreeName', '学位'], ['eduCertNo', '学历证书编号'],
      ['curTitle', '现有职称名称'], ['obtained', '取得时间'], ['hired', '聘任时间'],
      ['titleCertNo', '证书编号']
    ].forEach(function (p) {
      if (!v(p[0])) err({ name: p[0] }, p[1] + '尚未填写。', '示例：带 * 的项目为必填');
    });

    // --- 与单位关系 ---
    if (v('relation') === '劳务派遣' || v('relation') === '人事代理') {
      warn({ name: 'relation' },
        '与单位关系为"' + v('relation') + '"，评审时需另附' + (v('relation') === '劳务派遣' ? '派遣' : '代理') + '单位证明材料。',
        '示例：申报单位应为本人实际工作单位');
    }

    // --- 职业资格证书编号 ---
    ctx.gridRows('certGrid').forEach(function (r, i) {
      var no = (r['证书编号'] || '').trim();
      if (no && !/^[A-Za-z0-9]{10,18}$/.test(no)) {
        err({ grid: 'certGrid', row: i, col: '证书编号' },
          '证书编号"' + no + '"格式不符，应为 10–18 位字母或数字。',
          '示例：以证书原件为准');
      }
      if ((r['证书名称'] || '').trim() && !no) {
        err({ grid: 'certGrid', row: i, col: '证书编号' },
          '填写了证书名称但没有填证书编号，无法联网核验。', '示例：以证书原件为准');
      }
    });

    // --- 继续教育 ---
    var trainRows = ctx.gridRows('trainGrid').filter(function (r) { return (r['年度'] || '').trim(); });
    if (!trainRows.length) {
      err({ grid: 'trainGrid', row: 0, col: '年度' },
        '继续教育尚未填写，需按年度逐年填写学时。',
        '示例：专业技术人员每年参加继续教育的时间累计不少于 90 学时');
    }
    trainRows.forEach(function (r, i) {
      var h = parseFloat(r['学时']);
      if (!isNaN(h) && h < 90) {
        err({ grid: 'trainGrid', row: i, col: '学时' },
          r['年度'] + ' 年度学时为 ' + h + '，未达到每年 90 学时的要求。',
          '示例：专业技术人员每年参加继续教育的时间累计不少于 90 学时');
      }
    });

    // --- 工作业绩 ---
    var ach = (v('achievement') || '').trim();
    if (!ach) {
      err({ name: 'achievement' }, '主要工作业绩尚未填写。', '示例：带 * 的项目为必填');
    } else if (!/\d/.test(ach)) {
      warn({ name: 'achievement' },
        '工作业绩中没有可核实的数字，建议补充产量、效率、成本或安全指标等具体结果。',
        '示例：业绩数据应与单位证明材料一致');
    }

    // --- 获奖排名 ---
    ctx.gridRows('awardGrid').forEach(function (r, i) {
      var blank = !r['奖项名称'] && !r['奖励级别'] && !r['等次'] && !r['年度'] && !r['本人排名'];
      if (blank) return;
      if (!(r['本人排名'] || '').trim()) {
        var label = r['奖项名称'] ? '"' + r['奖项名称'] + '"' : '获奖情况第 ' + (i + 1) + ' 行';
        warn({ grid: 'awardGrid', row: i, col: '本人排名' },
          label + '未填写本人排名，评审时可能无法计分。',
          '示例：科技奖项以证书所列完成人排名为准');
      }
    });

    // --- 附件 ---
    var missing = ctx.missingFiles();
    missing.forEach(function (m) {
      err({ file: m.index }, '必传材料"' + m.name + '"尚未上传。', '示例：所有复印件须加盖单位公章');
    });

    return out;
  }

  return { run: run, yearsSince: yearsSince };
})();
