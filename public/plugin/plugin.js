/*!
 * 职称填表助手 · 浏览器辅助插件（演示原型）
 * 以脚本注入方式运行，不修改所在系统的任何代码与数据。
 */
(function () {
  'use strict';

  var PRIMARY = '#1c5bb8';

  // ---------- 样式（插件自带，不污染宿主页面既有样式） ----------
  var css = [
    '#zcp-root, #zcp-root * { box-sizing: border-box; font-family: "Microsoft YaHei", "PingFang SC", system-ui, sans-serif; }',
    '#zcp-ball { position: fixed; right: 24px; bottom: 28px; width: 52px; height: 52px; border-radius: 50%;',
    '  background: ' + PRIMARY + '; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center;',
    '  box-shadow: 0 4px 14px rgba(28,91,184,.38); cursor: pointer; z-index: 2147483000; user-select: none; }',
    '#zcp-ball:hover { background: #17509f; }',
    '#zcp-ball .zcp-ball-t { font-size: 12px; line-height: 1.15; font-weight: 600; letter-spacing: .5px; }',
    '#zcp-ball .zcp-badge { position: absolute; top: -4px; right: -4px; min-width: 18px; height: 18px; padding: 0 5px;',
    '  border-radius: 9px; background: #d4380d; color: #fff; font-size: 11px; line-height: 18px; text-align: center; }',

    '#zcp-panel { position: fixed; right: 24px; bottom: 92px; width: 340px; max-height: 72vh; background: #fff;',
    '  border: 1px solid #dfe3e9; border-radius: 8px; box-shadow: 0 10px 34px rgba(15,32,60,.20);',
    '  z-index: 2147483000; display: none; flex-direction: column; overflow: hidden; }',
    '#zcp-panel.zcp-open { display: flex; }',

    '.zcp-head { background: ' + PRIMARY + '; color: #fff; padding: 10px 12px; display: flex; align-items: center; justify-content: space-between; }',
    '.zcp-head .zcp-title { font-size: 14px; font-weight: 600; }',
    '.zcp-head .zcp-sub { font-size: 11px; opacity: .8; margin-top: 2px; }',
    '.zcp-x { cursor: pointer; opacity: .85; font-size: 16px; line-height: 1; padding: 2px 4px; }',
    '.zcp-x:hover { opacity: 1; }',

    '.zcp-tabs { display: flex; border-bottom: 1px solid #eceff3; background: #fafbfc; }',
    '.zcp-tab { flex: 1; text-align: center; padding: 8px 4px; font-size: 12px; color: #5a6472; cursor: pointer; border-bottom: 2px solid transparent; }',
    '.zcp-tab.on { color: ' + PRIMARY + '; border-bottom-color: ' + PRIMARY + '; background: #fff; font-weight: 600; }',
    '.zcp-tab .zcp-dot { display: inline-block; min-width: 16px; height: 16px; border-radius: 8px; background: #d4380d;',
    '  color: #fff; font-size: 10px; line-height: 16px; margin-left: 3px; padding: 0 4px; }',

    '.zcp-body { padding: 12px; overflow-y: auto; flex: 1; font-size: 13px; color: #1f2937; line-height: 1.65; }',
    '.zcp-empty { color: #8b95a3; font-size: 12px; padding: 18px 6px; text-align: center; line-height: 1.8; }',

    '.zcp-foot { border-top: 1px solid #eceff3; padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; background: #fafbfc; }',
    '.zcp-foot .zcp-meta { font-size: 11px; color: #97a1af; }',
    '.zcp-btn { background: ' + PRIMARY + '; color: #fff; border: none; border-radius: 4px; padding: 6px 12px; font-size: 12px; cursor: pointer; }',
    '.zcp-btn:hover { background: #17509f; }',
    '.zcp-btn.ghost { background: #fff; color: ' + PRIMARY + '; border: 1px solid #c3d4ec; }',
    '.zcp-btn.ghost:hover { background: #f2f7ff; }',

    '.zcp-fld { border-bottom: 1px solid #eceff3; padding-bottom: 8px; margin-bottom: 10px; }',
    '.zcp-fld .zcp-fname { font-size: 15px; font-weight: 600; color: #0f172a; }',
    '.zcp-fld .zcp-fsec { font-size: 11px; color: #97a1af; margin-top: 2px; }',
    '.zcp-blk { margin-bottom: 11px; }',
    '.zcp-blk .zcp-k { font-size: 11px; color: ' + PRIMARY + '; font-weight: 600; letter-spacing: .5px; margin-bottom: 3px; }',
    '.zcp-blk .zcp-v { font-size: 13px; color: #303a48; white-space: pre-line; }',
    '.zcp-eg { background: #f4f8ff; border-left: 3px solid ' + PRIMARY + '; padding: 7px 9px; border-radius: 0 3px 3px 0; font-size: 12px; color: #24406b; }',
    '.zcp-ms { margin: 0; padding-left: 16px; }',
    '.zcp-ms li { font-size: 12px; color: #6b7684; margin-bottom: 2px; }',
    '.zcp-basis { font-size: 11px; color: #97a1af; border-top: 1px dashed #e5e9ef; padding-top: 7px; margin-top: 4px; }',
    '.zcp-use { margin-top: 6px; }',

    '.zcp-grp { font-size: 11px; font-weight: 600; letter-spacing: .5px; margin: 2px 0 7px; }',
    '.zcp-grp.e { color: #d4380d; }',
    '.zcp-grp.w { color: #d48806; }',
    '.zcp-item { border-left: 3px solid #d4380d; background: #fff6f4; padding: 8px 10px; border-radius: 0 4px 4px 0;',
    '  margin-bottom: 8px; cursor: pointer; }',
    '.zcp-item:hover { background: #ffeeea; }',
    '.zcp-item.w { border-left-color: #d48806; background: #fffbef; }',
    '.zcp-item.w:hover { background: #fff6e0; }',
    '.zcp-item .zcp-it { font-size: 12.5px; color: #26313f; line-height: 1.55; }',
    '.zcp-item .zcp-ib { font-size: 11px; color: #97a1af; margin-top: 4px; }',
    '.zcp-ok { text-align: center; color: #2e9d5b; font-size: 13px; padding: 26px 8px; line-height: 1.9; }',
    '.zcp-fill-src { background: #f6f8fb; border-radius: 4px; padding: 8px 10px; margin-bottom: 10px; font-size: 12px; color: #5a6472; }',
    '.zcp-fill-src b { color: #26313f; }',
    '.zcp-prog { height: 4px; background: #e9edf3; border-radius: 2px; overflow: hidden; margin: 8px 0 10px; }',
    '.zcp-prog i { display: block; height: 100%; background: ' + PRIMARY + '; width: 0; transition: width .12s linear; }',
    '.zcp-line { font-size: 12px; color: #4a5566; padding: 2px 0; }',
    '.zcp-line b { color: #1f2937; font-weight: 600; }',
    '.zcp-done { color: #2e9d5b; font-weight: 600; font-size: 13px; margin-bottom: 6px; }',
    '.zcp-manual { border-left: 3px solid #d48806; background: #fffbef; padding: 8px 10px; border-radius: 0 4px 4px 0; margin-bottom: 7px; }',
    '.zcp-manual .zcp-mn { font-size: 12.5px; color: #26313f; font-weight: 600; }',
    '.zcp-verdict { border-radius: 5px; padding: 10px 12px; margin-bottom: 11px; }',
    '.zcp-verdict.bad { background: #fff1ee; border: 1px solid #ffc7b8; }',
    '.zcp-verdict.good { background: #f0faf4; border: 1px solid #b9e5cb; }',
    '.zcp-verdict .zcp-vt { font-size: 14px; font-weight: 600; }',
    '.zcp-verdict.bad .zcp-vt { color: #c22d05; }',
    '.zcp-verdict.good .zcp-vt { color: #22824a; }',
    '.zcp-verdict .zcp-vd { font-size: 12px; color: #5a6472; margin-top: 4px; line-height: 1.6; }',
    '#zcp-toast { position: fixed; z-index: 2147483001; background: #2b1410; color: #fff; font-size: 13px;',
    '  padding: 10px 14px; border-radius: 6px; box-shadow: 0 6px 20px rgba(0,0,0,.28); display: none;',
    '  font-family: "Microsoft YaHei", sans-serif; max-width: 320px; line-height: 1.6; }',
    '#zcp-toast b { color: #ffb9a3; }',
    '.zcp-manual .zcp-mw { font-size: 11px; color: #8a7443; margin-top: 2px; }',
    '.zcp-sum { font-size: 12px; color: #5a6472; background: #f6f8fb; border-radius: 4px; padding: 7px 9px; margin-bottom: 10px; }',
    '#zcp-ring { position: absolute; border: 2px solid ' + PRIMARY + '; border-radius: 3px; pointer-events: none;',
    '  z-index: 2147482999; display: none; box-shadow: 0 0 0 3px rgba(28,91,184,.14); transition: all .12s ease; }'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.id = 'zcp-style';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ---------- DOM ----------
  var root = document.createElement('div');
  root.id = 'zcp-root';
  root.innerHTML = [
    '<div id="zcp-ball" title="职称填表助手">',
    '  <div class="zcp-ball-t">填表</div>',
    '  <div class="zcp-ball-t">助手</div>',
    '  <span class="zcp-badge" id="zcp-badge" style="display:none">0</span>',
    '</div>',
    '<div id="zcp-panel">',
    '  <div class="zcp-head">',
    '    <div>',
    '      <div class="zcp-title">职称填表助手</div>',
    '      <div class="zcp-sub">2026年度 · 工程系列 · 副高级</div>',
    '    </div>',
    '    <div class="zcp-x" id="zcp-close">×</div>',
    '  </div>',
    '  <div class="zcp-tabs">',
    '    <div class="zcp-tab on" data-tab="guide">填写指引</div>',
    '    <div class="zcp-tab" data-tab="check">实时提醒</div>',
    '    <div class="zcp-tab" data-tab="review">提交前检查</div>',
    '  </div>',
    '  <div class="zcp-body" id="zcp-body">',
    '    <div class="zcp-empty">点击左侧表单中的任意字段<br>这里会显示该字段的填写说明与依据</div>',
    '  </div>',
    '  <div class="zcp-foot">',
    '    <span class="zcp-meta">演示原型 · 数据均为示例</span>',
    '    <button class="zcp-btn ghost" id="zcp-autofill">一键填充</button>',
    '  </div>',
    '</div>'
  ].join('');
  document.body.appendChild(root);

  var ring = document.createElement('div');
  ring.id = 'zcp-ring';
  document.body.appendChild(ring);

  var toast = document.createElement('div');
  toast.id = 'zcp-toast';
  document.body.appendChild(toast);

  // ---------- 行为 ----------
  var ball = document.getElementById('zcp-ball');
  var panel = document.getElementById('zcp-panel');
  var body = document.getElementById('zcp-body');

  function togglePanel(open) {
    if (open === undefined) open = !panel.classList.contains('zcp-open');
    panel.classList.toggle('zcp-open', open);
  }

  ball.addEventListener('click', function () { togglePanel(); });
  document.getElementById('zcp-close').addEventListener('click', function () { togglePanel(false); });

  var tabs = root.querySelectorAll('.zcp-tab');
  var current = 'guide';
  Array.prototype.forEach.call(tabs, function (t) {
    t.addEventListener('click', function () {
      Array.prototype.forEach.call(tabs, function (x) { x.classList.remove('on'); });
      t.classList.add('on');
      current = t.getAttribute('data-tab');
      render();
    });
  });

  // ---------- 字段定位：不修改宿主页面，靠页面结构识别 ----------
  var G = window.ZCP_GUIDE || { byName: {}, byGrid: {}, bySection: {} };

  function sectionOf(el) {
    var node = el;
    while (node && node !== document.body) {
      var prev = node.previousElementSibling;
      while (prev) {
        if (prev.classList && prev.classList.contains('sec-title')) return prev.textContent.trim();
        prev = prev.previousElementSibling;
      }
      node = node.parentElement;
    }
    return '';
  }

  function gridKeyOf(el) {
    var td = el.closest ? el.closest('td') : null;
    var table = el.closest ? el.closest('table') : null;
    if (!td || !table || !table.id) return null;
    var row = td.parentElement;
    var idx = Array.prototype.indexOf.call(row.children, td);
    var head = table.rows[0];
    if (!head || !head.cells[idx]) return null;
    return table.id + ':' + head.cells[idx].textContent.trim();
  }

  function infoOf(el) {
    var sec = sectionOf(el);
    if (el.name && G.byName[el.name]) return { info: G.byName[el.name], sec: sec };
    var gk = gridKeyOf(el);
    if (gk && G.byGrid[gk]) return { info: G.byGrid[gk], sec: sec };
    if (G.bySection[sec]) return { info: G.bySection[sec], sec: sec };
    return null;
  }

  function esc(t) {
    return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function guideHtml(info, sec) {
    var h = '<div class="zcp-fld"><div class="zcp-fname">' + esc(info.label) + '</div>';
    if (sec) h += '<div class="zcp-fsec">' + esc(sec) + '</div>';
    h += '</div>';
    if (info.need) h += '<div class="zcp-blk"><div class="zcp-k">怎么填</div><div class="zcp-v">' + esc(info.need) + '</div></div>';
    if (info.example) {
      h += '<div class="zcp-blk"><div class="zcp-k">参考写法</div><div class="zcp-eg">' + esc(info.example) + '</div>';
      h += '<div class="zcp-use"><button class="zcp-btn ghost" data-fill="1">填入这个示例</button></div></div>';
    }
    if (info.mistakes && info.mistakes.length) {
      h += '<div class="zcp-blk"><div class="zcp-k">常见错误</div><ul class="zcp-ms">';
      info.mistakes.forEach(function (m) { h += '<li>' + esc(m) + '</li>'; });
      h += '</ul></div>';
    }
    if (info.policy) h += '<div class="zcp-basis">依据 · ' + esc(info.policy) + '</div>';
    return h;
  }

  var activeEl = null;
  var activeInfo = null;

  function moveRing(el) {
    if (!el) { ring.style.display = 'none'; return; }
    var r = el.getBoundingClientRect();
    ring.style.display = 'block';
    ring.style.left = (r.left + window.scrollX - 2) + 'px';
    ring.style.top = (r.top + window.scrollY - 2) + 'px';
    ring.style.width = r.width + 'px';
    ring.style.height = r.height + 'px';
  }

  var suppressSwitch = false;

  function focusField(el) {
    var found = infoOf(el);
    if (!found) return;
    activeEl = el;
    activeInfo = found.info;
    moveRing(el);
    if (suppressSwitch) { return; }
    if (current !== 'guide') {
      Array.prototype.forEach.call(tabs, function (x) { x.classList.toggle('on', x.getAttribute('data-tab') === 'guide'); });
      current = 'guide';
    }
    togglePanel(true);
    render();
  }

  function bindFields() {
    var form = document.getElementById('applyForm');
    if (!form) return;
    var els = form.querySelectorAll('input, select, textarea');
    Array.prototype.forEach.call(els, function (el) {
      el.addEventListener('focus', function () { focusField(el); });
      el.addEventListener('click', function () { focusField(el); });
    });
  }

  window.addEventListener('scroll', function () { if (activeEl) moveRing(activeEl); });
  window.addEventListener('resize', function () { if (activeEl) moveRing(activeEl); });

  // ---------- 取值上下文：只读宿主页面，不写入 ----------
  var form = document.getElementById('applyForm');

  function val(name) {
    var el = form ? form.querySelector('[name="' + name + '"]') : null;
    return el ? String(el.value || '').trim() : '';
  }

  function gridRows(tableId) {
    var table = document.getElementById(tableId);
    if (!table) return [];
    var head = table.rows[0];
    var cols = Array.prototype.map.call(head.cells, function (c) { return c.textContent.trim(); });
    var rows = [];
    for (var i = 1; i < table.rows.length; i++) {
      var tr = table.rows[i], obj = {};
      for (var j = 0; j < tr.cells.length; j++) {
        var inp = tr.cells[j].querySelector('input, select, textarea');
        obj[cols[j]] = inp ? String(inp.value || '').trim() : tr.cells[j].textContent.trim();
      }
      rows.push(obj);
    }
    return rows;
  }

  function fileRows() {
    var tables = document.querySelectorAll('table.grid');
    for (var i = 0; i < tables.length; i++) {
      if (tables[i].querySelector('input[type=file]')) return tables[i];
    }
    return null;
  }

  function missingFiles() {
    var t = fileRows();
    if (!t) return [];
    var miss = [];
    for (var i = 1; i < t.rows.length; i++) {
      var tr = t.rows[i];
      var required = (tr.cells[2] ? tr.cells[2].textContent.trim() : '') === '是';
      var input = tr.querySelector('input[type=file]');
      if (required && input && (!input.files || input.files.length === 0)) {
        miss.push({ index: i - 1, name: tr.cells[1].textContent.trim() });
      }
    }
    return miss;
  }

  var CTX = { val: val, gridRows: gridRows, missingFiles: missingFiles };

  // ---------- 定位器 → 元素 ----------
  function resolve(loc) {
    if (!loc) return null;
    if (loc.name) return form ? form.querySelector('[name="' + loc.name + '"]') : null;
    if (loc.grid) {
      var t = document.getElementById(loc.grid);
      if (!t) return null;
      var head = t.rows[0];
      var idx = -1;
      for (var j = 0; j < head.cells.length; j++) {
        if (head.cells[j].textContent.trim() === loc.col) { idx = j; break; }
      }
      var tr = t.rows[loc.row + 1];
      if (!tr || idx < 0 || !tr.cells[idx]) return null;
      return tr.cells[idx].querySelector('input, select, textarea');
    }
    if (typeof loc.file === 'number') {
      var ft = fileRows();
      if (!ft) return null;
      var r = ft.rows[loc.file + 1];
      return r ? r.querySelector('input[type=file]') : null;
    }
    return null;
  }

  // ---------- 校验 ----------
  var issues = [];

  function runChecks() {
    if (!window.ZCP_RULES) return;
    issues = window.ZCP_RULES.run(CTX);
    var errs = issues.filter(function (i) { return i.level === 'error'; }).length;
    var badge = document.getElementById('zcp-badge');
    if (errs > 0) { badge.style.display = 'block'; badge.textContent = errs; }
    else { badge.style.display = 'none'; }
    var tab = root.querySelector('.zcp-tab[data-tab="check"]');
    tab.innerHTML = '实时提醒' + (errs ? '<span class="zcp-dot">' + errs + '</span>' : '');
    if (current === 'check' || current === 'review') render();
  }

  function issuesHtml(showAll) {
    var errs = issues.filter(function (i) { return i.level === 'error'; });
    var warns = issues.filter(function (i) { return i.level === 'warn'; });
    if (!errs.length && !warns.length) {
      return '<div class="zcp-ok">必填内容和硬性条件均已满足<br>可以提交</div>';
    }
    var h = '<div class="zcp-sum">共 ' + errs.length + ' 项必须修改，' + warns.length + ' 项建议完善。点击任意一条可跳转到对应字段。</div>';
    function block(list, cls, title) {
      if (!list.length) return '';
      var b = '<div class="zcp-grp ' + cls + '">' + title + '（' + list.length + '）</div>';
      list.forEach(function (it) {
        var i = issues.indexOf(it);
        b += '<div class="zcp-item' + (cls === 'w' ? ' w' : '') + '" data-issue="' + i + '">';
        b += '<div class="zcp-it">' + esc(it.text) + '</div>';
        if (it.basis) b += '<div class="zcp-ib">依据 · ' + esc(it.basis) + '</div>';
        b += '</div>';
      });
      return b;
    }
    h += block(errs, 'e', '必须修改');
    h += block(warns, 'w', '建议完善');
    return h;
  }

  function bindIssueClicks() {
    Array.prototype.forEach.call(body.querySelectorAll('[data-issue]'), function (node) {
      node.addEventListener('click', function () {
        var it = issues[+node.getAttribute('data-issue')];
        var el = resolve(it.field);
        if (!el) return;
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        setTimeout(function () { moveRing(el); activeEl = el; }, 320);
        suppressSwitch = true;
        if (el.focus) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }
        setTimeout(function () { suppressSwitch = false; }, 300);
      });
    });
  }

  function bindWatchers() {
    if (!form) return;
    var els = form.querySelectorAll('input, select, textarea');
    Array.prototype.forEach.call(els, function (el) {
      el.addEventListener('input', runChecks);
      el.addEventListener('change', runChecks);
    });
  }

  // ---------- 提交前总检 ----------
  function reviewHtml() {
    var errs = issues.filter(function (i) { return i.level === 'error'; });
    var warns = issues.filter(function (i) { return i.level === 'warn'; });
    var h;
    if (errs.length) {
      h = '<div class="zcp-verdict bad"><div class="zcp-vt">还不能提交</div>' +
          '<div class="zcp-vd">有 ' + errs.length + ' 项必须修改' +
          (warns.length ? '，另有 ' + warns.length + ' 项建议完善' : '') +
          '。改完这些再提交，可以避免被单位退回。</div></div>';
    } else {
      h = '<div class="zcp-verdict good"><div class="zcp-vt">可以提交</div>' +
          '<div class="zcp-vd">必填内容和硬性条件均已满足' +
          (warns.length ? '。另有 ' + warns.length + ' 项建议完善，不影响提交。' : '。') +
          '</div></div>';
    }
    if (issues.length) h += issuesHtml();
    h += '<div class="zcp-use"><button class="zcp-btn" id="zcp-sim">模拟提交</button></div>';
    return h;
  }

  function showToast(html, anchorEl) {
    toast.innerHTML = html;
    toast.style.display = 'block';
    var r = anchorEl ? anchorEl.getBoundingClientRect() : null;
    if (r) {
      toast.style.left = Math.max(12, r.left + window.scrollX - 60) + 'px';
      toast.style.top = (r.top + window.scrollY - toast.offsetHeight - 12) + 'px';
      toast.style.position = 'absolute';
    } else {
      toast.style.position = 'fixed';
      toast.style.left = '50%';
      toast.style.top = '80px';
    }
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.style.display = 'none'; }, 3200);
  }

  function gotoReview() {
    Array.prototype.forEach.call(tabs, function (x) { x.classList.toggle('on', x.getAttribute('data-tab') === 'review'); });
    current = 'review';
    togglePanel(true);
    render();
  }

  var submitBtn = null;

  function trySubmit(ev) {
    if (ev) { ev.preventDefault(); ev.stopPropagation(); }
    runChecks();
    var errs = issues.filter(function (i) { return i.level === 'error'; });
    gotoReview();
    if (errs.length) {
      showToast('提交已拦截：还有 <b>' + errs.length + ' 项必须修改</b><br>右侧面板已列出全部问题，点击任意一条可跳转。', submitBtn);
    } else {
      showToast('检查通过，可以提交。<br>（演示原型，不会真的提交数据）', submitBtn);
    }
    return false;
  }

  function bindSubmit() {
    var btns = document.querySelectorAll('.btnbar button');
    Array.prototype.forEach.call(btns, function (b) {
      if (b.textContent.trim() === '提交审核') {
        submitBtn = b;
        b.addEventListener('click', trySubmit, true);
      }
    });
  }

  var PLACEHOLDER = {
    guide: '点击左侧表单中的任意字段<br>这里会显示该字段的填写说明与依据',
    check: '填写过程中发现的问题会实时显示在这里',
    review: '提交前点击这里，一次性列出所有需要修改的地方'
  };

  function render() {
    if (current === 'guide' && activeInfo) {
      body.innerHTML = guideHtml(activeInfo, sectionOf(activeEl));
      var fillBtn = body.querySelector('[data-fill]');
      if (fillBtn) {
        fillBtn.addEventListener('click', function () {
          if (!activeEl || !activeInfo.example) return;
          if (activeEl.tagName === 'SELECT') {
            Array.prototype.forEach.call(activeEl.options, function (o) {
              if (o.text.indexOf(activeInfo.example) === 0) activeEl.value = o.value;
            });
          } else {
            activeEl.value = activeInfo.example;
          }
          activeEl.focus();
          fillBtn.textContent = '已填入';
          fillBtn.disabled = true;
        });
      }
      return;
    }
    if (current === 'check') {
      body.innerHTML = issuesHtml();
      bindIssueClicks();
      return;
    }
    if (current === 'review') {
      body.innerHTML = reviewHtml();
      bindIssueClicks();
      var sim = document.getElementById('zcp-sim');
      if (sim) sim.addEventListener('click', trySubmit);
      return;
    }
    body.innerHTML = '<div class="zcp-empty">' + PLACEHOLDER[current] + '</div>';
  }

  bindFields();
  bindWatchers();
  bindSubmit();
  runChecks();

  // ---------- 一键填充：从单位人事系统带入 ----------
  function flash(el) {
    if (!el) return;
    var old = el.style.backgroundColor;
    el.style.transition = 'background-color .4s ease';
    el.style.backgroundColor = '#fff7cc';
    setTimeout(function () { el.style.backgroundColor = old || ''; }, 620);
  }

  function buildFillPlan() {
    var HR = window.ZCP_HR;
    var plan = [];
    if (!HR) return plan;
    Object.keys(HR.fields).forEach(function (k) {
      var el = resolve({ name: k });
      if (el && !String(el.value || '').trim()) {
        plan.push({ el: el, value: HR.fields[k], label: (G.byName[k] && G.byName[k].label) || k });
      }
    });
    Object.keys(HR.grids).forEach(function (tid) {
      HR.grids[tid].forEach(function (row, ri) {
        Object.keys(row).forEach(function (col) {
          var el = resolve({ grid: tid, row: ri, col: col });
          if (el && !String(el.value || '').trim()) {
            plan.push({ el: el, value: row[col], label: col });
          }
        });
      });
    });
    return plan;
  }

  var filling = false;

  function autofill() {
    if (filling) return;
    var HR = window.ZCP_HR;
    var plan = buildFillPlan();
    filling = true;

    if (current !== 'guide') {
      Array.prototype.forEach.call(tabs, function (x) { x.classList.toggle('on', x.getAttribute('data-tab') === 'guide'); });
      current = 'guide';
    }
    togglePanel(true);

    if (!plan.length) {
      body.innerHTML = '<div class="zcp-fill-src">人事系统里的字段都已填写，没有需要带入的内容。</div>';
      filling = false;
      return;
    }

    body.innerHTML =
      '<div class="zcp-fill-src">数据来源：<b>' + esc(HR.source) + '</b><br>档案更新时间 ' + esc(HR.updated) + '</div>' +
      '<div class="zcp-prog"><i id="zcp-bar"></i></div>' +
      '<div id="zcp-log"></div>';
    var bar = document.getElementById('zcp-bar');
    var log = document.getElementById('zcp-log');

    var i = 0;
    (function step() {
      if (i >= plan.length) {
        finishFill(plan.length);
        return;
      }
      var item = plan[i];
      item.el.value = item.value;
      flash(item.el);
      if (i === 0 || i === plan.length - 1) item.el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      log.insertAdjacentHTML('afterbegin',
        '<div class="zcp-line"><b>' + esc(item.label) + '</b> · ' + esc(item.value) + '</div>');
      while (log.children.length > 6) log.removeChild(log.lastChild);
      i++;
      bar.style.width = Math.round(i / plan.length * 100) + '%';
      setTimeout(step, 110);
    })();
  }

  function finishFill(count) {
    filling = false;
    runChecks();
    var HR = window.ZCP_HR;
    var errs = issues.filter(function (x) { return x.level === 'error'; }).length;
    var h = '<div class="zcp-done">已从人事系统带入 ' + count + ' 个字段</div>';
    h += '<div class="zcp-fill-src">来源：<b>' + esc(HR.source) + '</b> · 档案更新 ' + esc(HR.updated) +
         '<br>带入的内容请与证书原件核对后再提交。</div>';
    h += '<div class="zcp-grp w">人事系统没有、需要你自己填（' + HR.manual.length + '）</div>';
    HR.manual.forEach(function (m) {
      h += '<div class="zcp-manual"><div class="zcp-mn">' + esc(m.name) + '</div><div class="zcp-mw">' + esc(m.why) + '</div></div>';
    });
    if (errs) {
      h += '<div class="zcp-use"><button class="zcp-btn" id="zcp-goto-check">查看剩余 ' + errs + ' 项问题</button></div>';
    }
    body.innerHTML = h;
    var go = document.getElementById('zcp-goto-check');
    if (go) {
      go.addEventListener('click', function () {
        Array.prototype.forEach.call(tabs, function (x) { x.classList.toggle('on', x.getAttribute('data-tab') === 'check'); });
        current = 'check';
        render();
      });
    }
  }

  document.getElementById('zcp-autofill').addEventListener('click', autofill);

  render();
  // 默认展开，便于演示时第一眼看到
  setTimeout(function () { togglePanel(true); }, 400);

  console.log('[职称填表助手] 已注入，宿主页面未被修改');
})();
