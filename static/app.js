/* ── Nerfstudio GUI ──────────────────────────── */
(() => {

// ================================================================
//  Tab 切换
// ================================================================
document.querySelectorAll('.tab').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tab').forEach(function (b) {
      b.classList.remove('active');
    });
    document.querySelectorAll('.panel').forEach(function (p) {
      p.classList.remove('active');
    });
    btn.classList.add('active');
    var panel = document.getElementById('panel-' + btn.dataset.tab);
    if (panel) panel.classList.add('active');
    if (btn.dataset.tab === 'step4') initBrowser();
  });
});

// ================================================================
//  可折叠区域
// ================================================================
document.querySelectorAll('.collapsible').forEach(function (leg) {
  leg.addEventListener('click', function () {
    var target = document.getElementById(leg.dataset.target);
    target.classList.toggle('collapsed');
    var isCollapsed = target.classList.contains('collapsed');
    leg.textContent = leg.textContent
      .replace('▾', '▸')
      .replace('▸', isCollapsed ? '▸' : '▾');
  });
});

// ================================================================
//  步骤1 — 数据源类型 / SfM 工具切换
// ================================================================
var dataTypeRadios = document.querySelectorAll('input[name="data_type"]');
dataTypeRadios.forEach(function (r) {
  r.addEventListener('change', function () {
    var isVideo = r.value === 'video';
    document.querySelectorAll('.video-only').forEach(function (e) {
      e.classList.toggle('hidden', !isVideo);
    });
  });
});

var sfmSelect = document.getElementById('proc-sfm');
sfmSelect.addEventListener('change', function () {
  var isHloc = this.value === 'hloc';
  document.querySelectorAll('.hloc-only').forEach(function (e) {
    e.classList.toggle('hidden', !isHloc);
  });
});

// ================================================================
//  步骤2 — 训练方法切换 (nerfacto ↔ splatfacto)
// ================================================================
var mSel = document.getElementById('train-method');

function applyMethodVisibility() {
  var isGS = mSel.value.startsWith('splatfacto');
  document.querySelectorAll('.nerf-only,.gs-only').forEach(function (e) {
    var belongsToGS = e.classList.contains('gs-only');
    // gs-only 元素：splatfacto 时显示，nerfacto 时隐藏
    // nerf-only 元素：splatfacto 时隐藏，nerfacto 时显示
    var hide = belongsToGS ? !isGS : isGS;
    e.classList.toggle('hidden', hide);
  });
}
mSel.addEventListener('change', applyMethodVisibility);
applyMethodVisibility();

// ================================================================
//  步骤2 — 显存预设 (区分 nerfacto / splatfacto)
// ================================================================
var presets = {
  nerfacto: {
    low: {
      train_num_rays_per_batch: 1024,
      num_nerf_samples_per_ray: 24,
      num_proposal_samples_per_ray: '96 48',
      max_res: 512,
      log2_hashmap_size: 16,
      num_levels: 8,
      cache_images_type: 'uint8',
      hidden_dim: 32
    },
    mid: {
      train_num_rays_per_batch: 2048,
      num_nerf_samples_per_ray: 32,
      num_proposal_samples_per_ray: '192 64',
      max_res: 1024,
      log2_hashmap_size: 17,
      num_levels: 10,
      cache_images_type: 'uint8'
    },
    high: {}
  },
  splatfacto: {
    low: { sh_degree: 1, cull_alpha_thresh: 0.2, ssim_lambda: 0.1 },
    mid: { sh_degree: 2, cull_alpha_thresh: 0.1, ssim_lambda: 0.2 },
    high: { sh_degree: 3 }
  }
};

document.querySelectorAll('.preset').forEach(function (b) {
  b.addEventListener('click', function () {
    document.querySelectorAll('.preset').forEach(function (x) {
      x.classList.remove('active');
    });
    b.classList.add('active');

    var method = mSel.value.split('-')[0];
    var methodPresets = presets[method] || presets.nerfacto;
    var vals = methodPresets[b.dataset.preset] || {};

    Object.entries(vals).forEach(function (entry) {
      var key = entry[0];
      var val = entry[1];
      var el = document.querySelector('[name="' + key + '"]');
      if (el) {
        if (el.tagName === 'SELECT') el.value = val;
        else el.value = val;
      }
    });
  });
});

// ================================================================
//  步骤3 — 导出方式切换
// ================================================================
var exSel = document.getElementById('export-method');
var exGroups = {
  poisson: 'export-params-poisson',
  tsdf: 'export-params-tsdf',
  pointcloud: 'export-params-pointcloud',
  'marching-cubes': 'export-params-mc',
  'gaussian-splat': 'export-params-gs'
};

exSel.addEventListener('change', function () {
  document.querySelectorAll('.export-params').forEach(function (e) {
    e.classList.add('hidden');
  });
  var targetId = exGroups[exSel.value];
  if (targetId) {
    document.getElementById(targetId).classList.remove('hidden');
  }
});
exSel.dispatchEvent(new Event('change'));

// ================================================================
//  路径书签系统
// ================================================================
var savedPaths = [];

async function loadPaths() {
  try {
    var r = await fetch('/api/paths');
    var d = await r.json();
    savedPaths = d.paths || [];
  } catch (e) {}
}

async function savePath(p) {
  await fetch('/api/paths', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: p })
  });
}

async function delPath(p) {
  await fetch('/api/paths', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: p })
  });
}
loadPaths();

// 给所有路径输入框添加 📌 快速选择按钮
function attachBookmark(inputEl) {
  // 包裹输入框
  var wrapper = document.createElement('span');
  wrapper.className = 'path-row';
  wrapper.style.display = 'flex';
  wrapper.style.flex = '1';
  wrapper.style.position = 'relative';
  inputEl.parentNode.insertBefore(wrapper, inputEl);
  wrapper.appendChild(inputEl);

  // 📌 按钮
  var btn = document.createElement('button');
  btn.className = 'btn-bookmark';
  btn.textContent = '📌';
  btn.title = '快速选择已保存路径';
  wrapper.appendChild(btn);

  // 下拉菜单
  var dd = document.createElement('div');
  dd.className = 'path-dropdown';
  wrapper.appendChild(dd);

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (dd.classList.contains('show')) {
      dd.classList.remove('show');
      return;
    }
    dd.innerHTML = '';
    savedPaths.forEach(function (p) {
      var row = document.createElement('div');
      row.textContent = p;
      row.addEventListener('click', function () {
        inputEl.value = p;
        dd.classList.remove('show');
      });
      dd.appendChild(row);
    });
    dd.classList.add('show');
    if (!savedPaths.length) {
      var empty = document.createElement('div');
      empty.textContent = '(暂无书签，在浏览页添加)';
      empty.style.color = '#666';
      dd.appendChild(empty);
    }
  });

  // 点击外部关闭
  document.addEventListener('click', function (e) {
    if (!wrapper.contains(e.target)) dd.classList.remove('show');
  });
}

document.querySelectorAll(
  'input[name="data"],input[name="output_dir"],input[name="load_config"]'
).forEach(attachBookmark);


// ================================================================
//  步骤4 — 文件浏览器
// ================================================================
var browserInit = false;

function initBrowser() {
  if (browserInit) return;
  browserInit = true;

  var inp = document.getElementById('browse-path');
  var list = document.getElementById('browse-list');
  var bc = document.getElementById('browse-breadcrumb');

  // —— 浏览指定路径 ——
  async function browse(p) {
    try {
      var r = await fetch('/api/browse?path=' + encodeURIComponent(p));
      if (!r.ok) {
        appendTerm('浏览失败: ' + r.status + '\n', 'err-line');
        return;
      }
      var d = await r.json();
      if (d.error) {
        appendTerm(d.error + '\n', 'err-line');
        return;
      }
      inp.value = d.current || p;
      renderBreadcrumb(d.current);
      renderList(d.folders, d.current);
    } catch (e) {
      appendTerm('浏览错误: ' + e.message + '\n', 'err-line');
    }
  }

  // —— 面包屑导航 ——
  function renderBreadcrumb(current) {
    if (!current) return;
    var parts = current.split('\\').filter(Boolean);
    var acc = '';
    var html = '';
    parts.forEach(function (p, i) {
      acc += (i === 0 ? p : '\\' + p);
      html += '<a data-path="' + acc + '">' + p + '</a>';
      if (i < parts.length - 1) html += ' \\ ';
    });
    bc.innerHTML = html;
    bc.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        browse(a.dataset.path);
      });
    });
  }

  // —— 渲染文件夹列表 ——
  function renderList(folders, current) {
    list.innerHTML = '';
    folders.forEach(function (f) {
      var div = document.createElement('div');
      div.className = 'browse-item';
      div.innerHTML = '<span class="folder-icon">📁</span>' +
        '<span class="item-name">' + f.name + '</span>';

      // 每个文件夹旁的 📌 按钮
      var bm = document.createElement('button');
      bm.className = 'btn-bookmark-item';
      bm.textContent = '📌';
      bm.title = '添加到书签';
      bm.addEventListener('click', async function (e) {
        e.stopPropagation();
        await savePath(f.path);
        savedPaths.push(f.path);
        bm.textContent = '✓';
        setTimeout(function () { bm.textContent = '📌'; }, 1500);
      });
      div.appendChild(bm);

      div.addEventListener('click', function () { browse(f.path); });
      list.appendChild(div);
    });

    // 底部"保存当前路径"
    var saveBtn = document.getElementById('btn-save-browse-path');
    saveBtn.onclick = async function () {
      await savePath(current);
      savedPaths.push(current);
    };
  }

  // —— 绑定事件 ——
  document.getElementById('btn-browse-go')
    .addEventListener('click', function () { browse(inp.value); });

  inp.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') browse(inp.value);
  });

  // —— 书签管理列表 ——
  var bml = document.getElementById('bookmark-list');

  function renderBookmarks() {
    bml.innerHTML = '';
    savedPaths.forEach(function (p, i) {
      var row = document.createElement('div');
      row.className = 'bookmark-row';

      var span = document.createElement('span');
      span.className = 'bm-path';
      span.textContent = p;
      span.addEventListener('click', function () { browse(p); });

      var del = document.createElement('button');
      del.className = 'bm-del';
      del.textContent = '✕';
      del.title = '删除此书签';
      del.addEventListener('click', async function () {
        await delPath(p);
        savedPaths.splice(i, 1);
        renderBookmarks();
      });

      row.appendChild(span);
      row.appendChild(del);
      bml.appendChild(row);
    });

    if (!savedPaths.length) {
      bml.innerHTML = '<div style="color:#666;font-size:0.73rem;' +
        'padding:4px">暂无书签</div>';
    }
  }

  // 初始加载
  browse('C:\\');
  setTimeout(renderBookmarks, 200);
}


// ================================================================
//  终端输出 — RAF 批量缓冲，防止训练日志卡死页面
// ================================================================
var termOut = document.getElementById('terminal-output');
var termStat = document.getElementById('terminal-status');
var lastCmd = '';
var lineBuf = [];
var rafId = null;

function flushBuf() {
  if (!lineBuf.length) return;
  termOut.appendChild(document.createTextNode(lineBuf.join('')));
  lineBuf = [];
  termOut.scrollTop = termOut.scrollHeight;
}

function appendTerm(text, cls) {
  if (cls) {
    var span = document.createElement('span');
    span.className = cls;
    span.textContent = text;
    termOut.appendChild(span);
  } else {
    lineBuf.push(text);
    if (!rafId) {
      rafId = requestAnimationFrame(function () {
        rafId = null;
        flushBuf();
      });
    }
  }
}

function setStat(state, text) {
  termStat.className = 'terminal-status ' + state;
  termStat.textContent = text;
}

document.getElementById('btn-clear-term')
  .addEventListener('click', function () {
    termOut.innerHTML = '';
    lastCmd = '';
    setStat('idle', '就绪');
  });

document.getElementById('btn-copy-cmd')
  .addEventListener('click', function () {
    if (lastCmd) navigator.clipboard.writeText(lastCmd);
  });


// ================================================================
//  SSE 通信 — 发送命令、流式接收输出
// ================================================================
async function runCmd(endpoint, data) {
  // 禁用所有执行按钮
  document.querySelectorAll('.btn-run').forEach(function (b) {
    b.disabled = true;
  });
  termOut.innerHTML = '';
  lastCmd = '';
  setStat('running', '执行中...');

  try {
    var r = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!r.ok) {
      appendTerm('HTTP ' + r.status + '\n', 'err-line');
      setStat('error', '请求失败');
      return;
    }

    var reader = r.body.getReader();
    var dec = new TextDecoder();
    var buf = '';

    while (true) {
      var chunk = await reader.read();
      if (chunk.done) { flushBuf(); break; }
      buf += dec.decode(chunk.value, { stream: true });

      var lines = buf.split('\n');
      buf = lines.pop();  // 保留不完整的末行

      for (var i = 0; i < lines.length; i++) {
        var l = lines[i];
        if (l.startsWith('__CMD__:')) {
          lastCmd = l.slice(8);
          appendTerm('$ ' + lastCmd + '\n', 'cmd-line');
        } else if (l.startsWith('__EXIT_CODE__:')) {
          var code = parseInt(l.slice(14));
          if (code === 0) {
            appendTerm('\n── 完成 (exit 0) ──\n', 'info-line');
            setStat('done', '完成');
          } else {
            appendTerm('\n── 失败 (exit ' + code + ') ──\n', 'err-line');
            setStat('error', '失败');
          }
        } else {
          appendTerm(l + '\n');
        }
      }
    }
  } catch (e) {
    appendTerm('Error: ' + e.message + '\n', 'err-line');
    setStat('error', '连接错误');
    flushBuf();
  } finally {
    document.querySelectorAll('.btn-run').forEach(function (b) {
      b.disabled = false;
    });
  }
}

// ================================================================
//  表单数据收集
// ================================================================
function collectForm(form) {
  var fd = new FormData(form);
  var data = {};

  fd.forEach(function (v, k) {
    if (v === 'true') {
      data[k] = true;
    } else if (v === 'false') {
      data[k] = false;
    } else if (v === '' || v === null) {
      // 跳过空值，让服务端使用默认值
    } else if (!isNaN(v) && v.trim() !== '') {
      data[k] = v.includes('.') ? parseFloat(v) : parseInt(v);
    } else {
      data[k] = v;
    }
  });

  // 未勾选的 checkbox 视为 false
  form.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
    if (!fd.has(cb.name)) data[cb.name] = false;
  });

  return data;
}

// ================================================================
//  表单提交事件绑定
// ================================================================
document.getElementById('form-step1')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    var d = collectForm(e.target);
    d.data_type = document.querySelector(
      'input[name="data_type"]:checked'
    ).value;
    runCmd('/api/process', d);
  });

document.getElementById('form-step2')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    runCmd('/api/train', collectForm(e.target));
  });

document.getElementById('form-step3')
  .addEventListener('submit', function (e) {
    e.preventDefault();
    runCmd('/api/export', collectForm(e.target));
  });

})();
