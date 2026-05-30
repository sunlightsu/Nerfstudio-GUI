/* ── Tab 切换 ─────────────────────────────────── */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

/* ── 可折叠区域 ──────────────────────────────── */
document.querySelectorAll('.collapsible').forEach(legend => {
  legend.addEventListener('click', () => {
    const target = document.getElementById(legend.dataset.target);
    target.classList.toggle('collapsed');
    legend.textContent = legend.textContent.replace('▾', '▸').replace('▸', target.classList.contains('collapsed') ? '▸' : '▾');
  });
});

/* ── 步骤1: data_type 切换 ────────────────────── */
const dataTypeRadios = document.querySelectorAll('input[name="data_type"]');
const videoOnly = document.querySelectorAll('.video-only');
function toggleVideoFields() {
  const isVideo = document.querySelector('input[name="data_type"]:checked').value === 'video';
  videoOnly.forEach(el => { el.style.display = isVideo ? 'flex' : 'none'; });
}
dataTypeRadios.forEach(r => r.addEventListener('change', toggleVideoFields));
toggleVideoFields();

/* ── 步骤1: sfm_tool 切换 hloc 专属参数 ──────── */
const sfmSelect = document.getElementById('proc-sfm');
const hlocOnly = document.querySelectorAll('.hloc-only');
function toggleHlocFields() {
  const isHloc = sfmSelect.value === 'hloc';
  hlocOnly.forEach(el => { el.style.display = isHloc ? 'flex' : 'none'; });
}
sfmSelect.addEventListener('change', toggleHlocFields);
toggleHlocFields();

/* ── 步骤2: method 切换 nerf / gs 专属参数 ────── */
const methodSelect = document.getElementById('train-method');
const nerfOnly = document.querySelectorAll('.nerf-only');
const gsOnly = document.querySelectorAll('.gs-only');

function isSplatfacto(method) { return method.startsWith('splatfacto'); }

function toggleMethodFields() {
  const method = methodSelect.value;
  const gs = isSplatfacto(method);
  nerfOnly.forEach(el => { el.style.display = gs ? 'none' : 'block'; });
  gsOnly.forEach(el => { el.style.display = gs ? 'block' : 'none'; });
}
methodSelect.addEventListener('change', toggleMethodFields);
toggleMethodFields();

/* ── 步骤2: 显存预设 ──────────────────────────── */
const presets = {
  low: {
    train_num_rays_per_batch: 1024,
    num_nerf_samples_per_ray: 24,
    num_proposal_samples_per_ray: '96 48',
    max_res: 512,
    log2_hashmap_size: 16,
    num_levels: 8,
    cache_images_type: 'uint8',
    hidden_dim: 32,
  },
  mid: {
    train_num_rays_per_batch: 2048,
    num_nerf_samples_per_ray: 32,
    num_proposal_samples_per_ray: '192 64',
    max_res: 1024,
    log2_hashmap_size: 17,
    num_levels: 10,
    cache_images_type: 'uint8',
  },
  high: {},
};

document.querySelectorAll('.preset').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const vals = presets[btn.dataset.preset];
    Object.entries(vals).forEach(([key, val]) => {
      const el = document.querySelector(`[name="${key}"]`);
      if (el) {
        if (el.tagName === 'SELECT') el.value = val;
        else el.value = val;
      }
    });
  });
});

/* ── 步骤3: export_method 切换参数区 ──────────── */
const exportMethodSelect = document.getElementById('export-method');
const exportParamGroups = {
  'poisson': 'export-params-poisson',
  'tsdf': 'export-params-tsdf',
  'pointcloud': 'export-params-pointcloud',
  'gaussian-splat': null,
  'marching-cubes': 'export-params-mc',
  'cameras': null,
};

function toggleExportParams() {
  const method = exportMethodSelect.value;
  document.querySelectorAll('.export-params').forEach(el => { el.style.display = 'none'; });
  const target = exportParamGroups[method];
  if (target) document.getElementById(target).style.display = 'block';
}
exportMethodSelect.addEventListener('change', toggleExportParams);
toggleExportParams();

/* ── 终端 ─────────────────────────────────────── */
const termOutput = document.getElementById('terminal-output');
const termStatus = document.getElementById('terminal-status');
let lastCmd = '';

function setStatus(state, text) {
  termStatus.className = 'terminal-status ' + state;
  termStatus.textContent = text;
}

function appendTerminal(text, cls) {
  const span = document.createElement('span');
  if (cls) span.className = cls;
  span.textContent = text;
  termOutput.appendChild(span);
  termOutput.scrollTop = termOutput.scrollHeight;
}

function clearTerminal() {
  termOutput.innerHTML = '';
  lastCmd = '';
  setStatus('idle', '就绪');
}

document.getElementById('btn-clear-term').addEventListener('click', clearTerminal);

document.getElementById('btn-copy-cmd').addEventListener('click', () => {
  if (lastCmd) {
    navigator.clipboard.writeText(lastCmd).then(() => {
      setStatus('idle', '已复制!');
      setTimeout(() => setStatus('idle', '就绪'), 2000);
    });
  }
});

/* ── SSE 客户端 ───────────────────────────────── */
async function runCommand(endpoint, formData) {
  // 禁用所有提交按钮
  document.querySelectorAll('.btn-run').forEach(b => b.disabled = true);
  clearTerminal();
  setStatus('running', '执行中...');

  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      appendTerminal('HTTP ' + resp.status + ': ' + errText + '\n', 'err-line');
      setStatus('error', '请求失败');
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // 按行处理
      const lines = buffer.split('\n');
      buffer = lines.pop(); // 保留不完整的最后一行
      for (const line of lines) {
        if (line.startsWith('__CMD__:')) {
          lastCmd = line.slice(8);
          appendTerminal('$ ' + lastCmd + '\n', 'cmd-line');
        } else if (line.startsWith('__EXIT_CODE__:')) {
          const code = parseInt(line.slice(14));
          if (code === 0) {
            appendTerminal('\n── 进程结束 (exit 0) ──\n', 'info-line');
            setStatus('done', '完成 ✓');
          } else {
            appendTerminal('\n── 进程结束 (exit ' + code + ') ──\n', 'err-line');
            setStatus('error', '失败 (exit ' + code + ')');
          }
        } else {
          appendTerminal(line + '\n');
        }
      }
    }
  } catch (err) {
    appendTerminal('Error: ' + err.message + '\n', 'err-line');
    setStatus('error', '连接错误');
  } finally {
    document.querySelectorAll('.btn-run').forEach(b => b.disabled = false);
  }
}

/* ── 表单收集 ─────────────────────────────────── */
function collectForm(form) {
  const fd = new FormData(form);
  const data = {};
  for (const [key, val] of fd.entries()) {
    if (val === 'true') {
      data[key] = true;
    } else if (val === 'false') {
      data[key] = false;
    } else if (val === '' || val === null) {
      // skip empty strings to use server defaults
    } else if (!isNaN(val) && val.trim() !== '') {
      // numeric values
      data[key] = val.includes('.') ? parseFloat(val) : parseInt(val);
    } else {
      data[key] = val;
    }
  }
  // handle checkboxes: unchecked means false
  form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    if (!fd.has(cb.name)) {
      data[cb.name] = false;
    }
  });
  return data;
}

/* ── 表单提交 ─────────────────────────────────── */
document.getElementById('form-step1').addEventListener('submit', e => {
  e.preventDefault();
  const data = collectForm(e.target);
  // set data_type from radio
  data.data_type = document.querySelector('input[name="data_type"]:checked').value;
  runCommand('/api/process', data);
});

document.getElementById('form-step2').addEventListener('submit', e => {
  e.preventDefault();
  const data = collectForm(e.target);
  runCommand('/api/train', data);
});

document.getElementById('form-step3').addEventListener('submit', e => {
  e.preventDefault();
  const data = collectForm(e.target);
  runCommand('/api/export', data);
});
