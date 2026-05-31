# Nerfstudio 方法参考笔记

> 运行 `ns-train --help` 可查看完整方法列表

---

## 一、内置方法（Built-in，可直接使用）

### 1.1 Nerfacto 系列 — 推荐首选

| 方法名 | 说明 | 迭代数 | 单批光线数 | 特点 |
|--------|------|--------|-----------|------|
| `nerfacto` | ⭐ **推荐模型**，融合多项最新技术（相机优化、外观嵌入、哈希编码），适合实际拍摄数据 | 30k | 4096 | 默认首选 |
| `nerfacto-big` | 更大版本，质量更高 | 100k | 8192 | hidden_dim=128, max_res=4096 |
| `nerfacto-huge` | 超大版本，最高质量 | 100k | 16384 | hidden_dim=256, max_res=8192 |
| `depth-nerfacto` | 带深度监督的 Nerfacto，几何更准确 | 30k | 4096 | 需深度数据 |

### 1.2 Instant-NGP 系列 — 快速哈希编码

| 方法名 | 说明 | 特点 |
|--------|------|------|
| `instant-ngp` | Instant-NGP 实现，适合**无界场景**（户外） | 多层级哈希编码 + 场景收缩 |
| `instant-ngp-bounded` | Instant-NGP 适合**有界场景**（合成/室内） | 单层网格，黑色背景，无边收缩 |

### 1.3 经典 NeRF

| 方法名 | 说明 | 速度 |
|--------|------|------|
| `vanilla-nerf` | 原始 NeRF 实现 | ⚠️ 慢 |
| `mipnerf` | 抗锯齿 NeRF，适合有界场景 | ⚠️ 慢 |
| `dnerf` | 动态 NeRF，用于视频/动态场景 | ⚠️ 慢 |

### 1.4 3D Gaussian Splatting

| 方法名 | 说明 | 特点 |
|--------|------|------|
| `splatfacto` | ⭐ **3D高斯泼溅**，实时渲染，极快 | 默认版本 |
| `splatfacto-big` | 更大版本，质量更高 | 更多高斯点 |
| `splatfacto-mcmc` | 带 MCMC 密度化的高斯泼溅 | 不同生长策略 |

### 1.5 其他内置方法

| 方法名 | 说明 | 类别 |
|--------|------|------|
| `tensorf` | 张量分解（CP/VM分解），紧凑表示 | 因子分解 |
| `semantic-nerfw` | 语义分割 + 瞬态物体过滤 | 语义 NeRF |
| `phototourism` | 针对大规模非结构照片集优化 | 旅游景点 |
| `generfacto` | **文本生成 3D 场景**（Text-to-NeRF），需 Stable Diffusion | 生成式 |
| `neus` | 神经隐式表面重建（SDF），慢但几何精确 | SDF/表面 |
| `neus-facto` | NeuS + 提议网络，训练更快 | SDF/表面 |

---

## 二、外部方法（External，需额外安装）

### 2.1 视觉-语言 / 语义理解

| 方法名 | 安装命令 | 说明 |
|--------|----------|------|
| `lerf` / `lerf-big` / `lerf-lite` | `pip install git+https://github.com/kerrj/lerf` | CLIP 语言查询 3D 场景 |
| `livescene` | `pip install git+https://github.com/Tavish9/livescene` | 交互式语言场景探索 |
| `feature-splatting` | `pip install git+https://github.com/vuer-ai/feature-splatting` | 高斯泼溅上的视觉语言特征 |

### 2.2 编辑 / 操控

| 方法名 | 安装命令 | 说明 |
|--------|----------|------|
| `in2n` / `in2n-small` / `in2n-tiny` | `pip install git+https://github.com/ayaanzhaque/instruct-nerf2nerf` | 文本指令编辑 NeRF |
| `igs2gs` | `pip install git+https://github.com/cvachha/instruct-gs2gs` | 文本指令编辑 3DGS |
| `signerf` / `signerf_nerfacto` | `pip install git+https://github.com/cgtuebingen/SIGNeRF` | 语义图像引导编辑（需 Stable Diffusion WebUI） |

### 2.3 快速 / 替代表示

| 方法名 | 安装命令 | 说明 |
|--------|----------|------|
| `kplanes` / `kplanes-dynamic` | `pip install kplanes-nerfstudio` | 显式平面分解（静态/动态） |
| `zipnerf` | `pip install git+https://github.com/SuLvXiangXin/zipnerf-pytorch` | 抗锯齿网格 NeRF |
| `pynerf` / `pynerf-synthetic` / `pynerf-occupancy-grid` | `pip install git+https://github.com/hturki/pynerf` | 优化 PyTorch NeRF |
| `tetra-nerf` / `tetra-nerf-original` | 见 [tetra-nerf](https://github.com/jkulhanek/tetra-nerf) | 四面体网格 NeRF |

### 2.4 动态场景

| 方法名 | 安装命令 | 说明 |
|--------|----------|------|
| `nerfplayer-nerfacto` / `nerfplayer-ngp` | `pip install git+https://github.com/lsongx/nerfplayer-nerfstudio` | 动态场景播放 |

### 2.5 领域特定

| 方法名 | 安装命令 | 说明 |
|--------|----------|------|
| `seathru-nerf` / `seathru-nerf-lite` | `pip install git+https://github.com/AkerBP/seathru_nerf` | **水下场景**重建 |
| `BioNeRF` | `pip install git+https://github.com/Leandropassosjr/ns_bionerf` | **生物/医学**成像 |
| `volinga` | `pip install git+https://github.com/Volinga/volinga-model` | 导出为 NVOL 格式，用于 Unreal Engine |

### 2.6 3DGS 变体

| 方法名 | 安装命令 | 说明 |
|--------|----------|------|
| `splatfacto-w` | `pip install git+https://github.com/KevinXu02/splatfacto-w` | 野外无约束场景的 3DGS |
| `nerfsh` | `pip install git+https://github.com/grasp-lyrl/NeRFtoGSandBack.git#subdirectory=nerfsh` | 球谐 NeRF↔GS 转换 |
| `nerfgs` | `pip install git+https://github.com/grasp-lyrl/NeRFtoGSandBack.git#subdirectory=nerfgs` | 双向 NeRF↔GS 互转 |

---

## 三、快速选型指南

### 按场景类型

| 场景类型 | 推荐方法 | 理由 |
|----------|----------|------|
| **实际场景拍摄**（室内/室外） | `nerfacto` ⭐ | 综合最优，持续更新 |
| **需要极高精度** | `nerfacto-big` / `nerfacto-huge` | 更多参数，更多迭代 |
| **实时渲染/部署** | `splatfacto` ⭐ | 3DGS 实时渲染 |
| **快速预览** | `instant-ngp` | 训练极快 |
| **有界场景**（合成数据） | `instant-ngp-bounded` / `mipnerf` | 针对有界场景优化 |
| **无界场景**（大场景） | `nerfacto` / `instant-ngp` | 带场景收缩 |
| **动态/视频** | `dnerf` / `kplanes-dynamic` | 支持时间维度 |
| **精确几何/表面** | `neus` / `neus-facto` | SDF 表示，表面精确 |
| **大尺度旅游景点** | `phototourism` | 针对非结构照片集 |

### 按速度排序（快 → 慢）

```
splatfacto > instant-ngp ≈ nerfacto > tensorf ≈ kplanes > zipnerf > vanilla-nerf ≈ mipnerf ≈ neus
```

### 按类型分类

| 类别 | 方法 |
|------|------|
| **NeRF 类** | vanilla-nerf, mipnerf, nerfacto, instant-ngp, dnerf, semantic-nerfw |
| **3DGS 类** | splatfacto, splatfacto-w, feature-splatting, nerfsh, nerfgs |
| **因子分解** | tensorf, kplanes, zipnerf |
| **视觉-语言** | lerf, livescene, feature-splatting |
| **编辑类** | in2n, igs2gs, signerf |
| **SDF/表面** | neus, neus-facto |
| **领域特定** | seathru-nerf, bionerf, volinga |
| **动态** | dnerf, kplanes-dynamic, nerfplayer |
| **生成式** | generfacto |

---

## 四、常用命令

```bash
# 查看所有训练方法
ns-train --help

# 查看某个方法的详细参数
ns-train nerfacto --help

# 使用 nerfacto 训练（推荐）
ns-train nerfacto --data /path/to/data

# 使用 splatfacto 训练（3DGS）
ns-train splatfacto --data /path/to/data

# 使用 instant-ngp 训练
ns-train instant-ngp --data /path/to/data

# 查看导出命令
ns-export --help

# 查看某个导出方式的参数
ns-export pointcloud --help
ns-export poisson --help
ns-export gaussian-splat --help
```



---

## 五、Nerfacto 详细参数参考（ns-train nerfacto --help）

> 所有参数通过 `--` 前缀传递。嵌套参数用 `.` 分隔，数组参数用空格分隔。
> 例：`--pipeline.model.num-proposal-samples-per-ray 256 96`

### 5.1 通用选项（options）

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--output-dir` | PATH | `outputs` | 保存检查点和日志的输出目录 |
| `--method-name` | STR\|None | `nerfacto` | 方法名称 |
| `--experiment-name` | STR\|None | None | 实验名称，不设置则自动使用数据集名 |
| `--project-name` | STR | `nerfstudio-project` | 项目名称 |
| `--timestamp` | STR | `{timestamp}` | 实验时间戳 |
| `--vis` | 枚举 | `viewer` | 可视化方式：`viewer`, `wandb`, `tensorboard`, `comet`, `viewer+wandb` 等 |
| `--data` | PATH\|None | None | **别名**：`--pipeline.datamanager.data` 的简写 |
| `--prompt` | STR\|None | None | **别名**：`--pipeline.model.prompt` 的简写（仅文本生成模型用） |
| `--relative-model-dir` | PATH | `nerfstudio_models` | 保存检查点的相对路径 |
| `--load-scheduler` | True/False | True | 是否恢复 scheduler 状态 |
| `--steps-per-save` | INT | 2000 | 每 N 步保存一次检查点 |
| `--steps-per-eval-batch` | INT | 500 | 每 N 步随机采样批次评估 |
| `--steps-per-eval-image` | INT | 500 | 每 N 步评估单张图像 |
| `--steps-per-eval-all-images` | INT | 25000 | 每 N 步评估所有图像 |
| `--max-num-iterations` | INT | 30000 | **最大训练迭代次数** |
| `--mixed-precision` | True/False | True | 是否使用混合精度训练（省显存） |
| `--use-grad-scaler` | True/False | False | 关闭 AMP 时是否仍使用梯度缩放 |
| `--save-only-latest-checkpoint` | True/False | True | 是否只保存最新检查点 |
| `--load-dir` | PATH\|None | None | 加载预训练模型的目录 |
| `--load-step` | INT\|None | None | 加载指定步数的模型 |
| `--load-config` | PATH\|None | None | 加载 YAML 配置文件 |
| `--load-checkpoint` | PATH\|None | None | 加载检查点文件 |
| `--log-gradients` | True/False | False | 是否记录梯度 |
| `--gradient-accumulation-steps` | [STR INT] | — | 梯度累积步数（格式：`param_group:num`） |
| `--start-paused` | True/False | False | 是否以暂停状态启动训练 |

### 5.2 机器选项（machine options）

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--machine.seed` | INT | 42 | 随机种子 |
| `--machine.num-devices` | INT | 1 | 设备（GPU）数量 |
| `--machine.num-machines` | INT | 1 | 分布式机器数量 |
| `--machine.machine-rank` | INT | 0 | 当前机器的 rank |
| `--machine.dist-url` | STR | auto | 分布式连接地址 |
| `--machine.device-type` | 枚举 | `cuda` | 设备类型：`cpu`, `cuda`, `mps` |

### 5.3 日志选项（logging options）

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--logging.relative-log-dir` | PATH | `.` | 日志保存相对路径 |
| `--logging.steps-per-log` | INT | 10 | 每 N 步打印一次日志 |
| `--logging.max-buffer-size` | INT | 20 | 滑动平均缓存大小 |
| `--logging.profiler` | 枚举 | `basic` | 性能分析：`none`, `basic`, `pytorch` |

#### 5.3.1 local-writer 子选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--logging.local-writer.enable` | True/False | True | 是否启用本地日志 |
| `--logging.local-writer.stats-to-track` | 列表 | ... | 要跟踪的统计指标列表 |
| `--logging.local-writer.max-log-size` | INT | 10 | 打印的最大行数 |

### 5.4 Viewer 选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--viewer.relative-log-filename` | STR | `viewer_log_filename.txt` | 日志文件名 |
| `--viewer.websocket-port` | INT\|None | None | WebSocket 端口，None 则自动分配 |
| `--viewer.websocket-port-default` | INT | 7007 | 默认 WebSocket 端口 |
| `--viewer.websocket-host` | STR | `0.0.0.0` | WebSocket 绑定地址 |
| `--viewer.num-rays-per-chunk` | INT | 32768 | 每块渲染的光线数 |
| `--viewer.max-num-display-images` | INT | 512 | 最多显示的训练图像数（-1 为全部） |
| `--viewer.quit-on-train-completion` | True/False | False | 训练完成后是否退出 |
| `--viewer.image-format` | 枚举 | `jpeg` | 图像格式：`jpeg`, `png` |
| `--viewer.jpeg-quality` | INT | 75 | JPEG 压缩质量 |
| `--viewer.make-share-url` | True/False | False | 是否生成共享 URL |
| `--viewer.camera-frustum-scale` | FLOAT | 0.1 | 视锥体缩放比例 |
| `--viewer.default-composite-depth` | True/False | True | 默认是否合成深度 |

### 5.5 DataManager 选项（`--pipeline.datamanager.*`）

#### 5.5.1 基础配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | PATH\|None | None | 数据路径 |
| `masks-on-gpu` | True/False | False | 是否在 GPU 处理 mask（更快但更耗显存） |
| `images-on-gpu` | True/False | False | 是否在 GPU 处理图像 |
| `cache-images-type` | 枚举 | `float32` | 图像缓存类型：`uint8`（省内存）或 `float32` |
| `train-num-rays-per-batch` | INT | 4096 | **每批训练光线数**（核心显存参数 ↓） |
| `train-num-images-to-sample-from` | INT/FLOAT | inf | 训练时加载到 CPU 的图像数 |
| `train-num-times-to-repeat-images` | INT/FLOAT | inf | 每批图像生成 RayBundle 的重复次数 |
| `eval-num-rays-per-batch` | INT | 4096 | 每批评估光线数 |
| `eval-num-images-to-sample-from` | INT/FLOAT | inf | 评估时采样的图像数 |
| `eval-num-times-to-repeat-images` | INT/FLOAT | inf | 评估时图像重复次数 |
| `eval-image-indices` | [INT] | 0 | 评估使用的图像索引 |
| `camera-res-scale-factor` | FLOAT | 1.0 | 图像/相机内参缩放因子 |
| `patch-size` | INT | 1 | >1 时启用基于 patch 的采样 |
| `load-from-disk` | True/False | False | **从磁盘加载**（省 RAM，慢一点） |
| `dataloader-num-workers` | INT | 4 | DataLoader 工作线程数 |
| `prefetch-factor` | INT\|None | 10 | 预取批次数量 |
| `cache-compressed-images` | True/False | False | 是否压缩缓存图像 |

#### 5.5.2 PixelSampler 子选项（`--pipeline.datamanager.pixel-sampler.*`）

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `num-rays-per-batch` | INT | 4096 | 每批采样光线数（同 `train-num-rays-per-batch`） |
| `keep-full-image` | True/False | False | 是否在 batch 中包含完整图像引用 |
| `is-equirectangular` | True/False | False | 是否为全景相机 |
| `ignore-mask` | True/False | False | 采样时是否忽略 mask |
| `fisheye-crop-radius` | FLOAT\|None | None | 鱼眼裁剪半径（像素） |
| `rejection-sample-mask` | True/False | True | 是否使用拒绝采样 |
| `max-num-iterations` | INT | 100 | 拒绝采样的最大迭代次数 |

### 5.6 Model 选项（`--pipeline.model.*`）— 核心参数

#### 5.6.1 场景与渲染

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable-collider` | True/False | True | 是否创建场景碰撞体来过滤光线 |
| `collider-params` | dict | `near_plane 2.0 far_plane 6.0` | 碰撞体参数 |
| `eval-num-rays-per-chunk` | INT | 32768 | 评估时每块渲染的光线数 |
| `prompt` | STR\|None | None | 文本提示（仅文本生成模型） |
| `near-plane` | FLOAT | 0.05 | **光线起始采样距离** |
| `far-plane` | FLOAT | 1000.0 | **光线结束采样距离** |
| `background-color` | 枚举 | `last_sample` | 背景色：`random`, `last_sample`, `black`, `white` |

#### 5.6.2 网络结构

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `hidden-dim` | INT | 64 | **MLP 隐藏层维度**（↓ 省显存） |
| `hidden-dim-color` | INT | 64 | **颜色网络隐藏层维度** |
| `hidden-dim-transient` | INT | 64 | 瞬态网络隐藏层维度 |
| `num-levels` | INT | 16 | **哈希网格层级数**（↓ 省显存） |
| `base-res` | INT | 16 | 哈希网格基础分辨率 |
| `max-res` | INT | 2048 | **哈希网格最大分辨率**（↓ 省显存） |
| `log2-hashmap-size` | INT | 19 | **哈希表大小（2^N）**（↓ 省显存） |
| `features-per-level` | INT | 2 | 每层级哈希特征数 |
| `appearance-embed-dim` | INT | 32 | 外观嵌入维度 |
| `average-init-density` | FLOAT | 0.01 | MLP 初始平均密度 |
| `implementation` | 枚举 | `tcnn` | 实现方式：`tcnn`（快）或 `torch`（兼容） |
| `disable-scene-contraction` | True/False | False | 是否禁用场景收缩 |
| `use-gradient-scaling` | True/False | False | 是否使用梯度缩放 |

#### 5.6.3 采样参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `num-proposal-samples-per-ray` | [INT...] | `256 96` | **提议网络每光线采样数**（↓ 省显存，核心参数） |
| `num-nerf-samples-per-ray` | INT | 48 | **NeRF 网络每光线采样数**（↓ 省显存） |
| `proposal-update-every` | INT | 5 | 提议网络更新频率 |
| `proposal-warmup` | INT | 5000 | 提议网络预热步数 |
| `num-proposal-iterations` | INT | 2 | 提议网络迭代次数 |
| `use-same-proposal-network` | True/False | False | 是否共享提议网络 |
| `proposal-initial-sampler` | 枚举 | `piecewise` | 提议初始采样器：`piecewise`（无界）或 `uniform` |

#### 5.6.4 提议网络结构（`--pipeline.model.proposal-net-args-list.*`）

| 参数 | 索引 0 默认值 | 索引 1 默认值 | 说明 |
|------|---------------|---------------|------|
| `hidden-dim` | 16 | 16 | MLP 隐藏层维度 |
| `log2-hashmap-size` | 17 | 17 | 哈希表大小 |
| `num-levels` | 5 | 5 | 哈希层级数 |
| `max-res` | 128 | 256 | 最大分辨率 |
| `use-linear` | False | False | 是否使用线性层 |

#### 5.6.5 损失函数权重

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `interlevel-loss-mult` | 1.0 | 提议网络损失权重（层级间一致性） |
| `distortion-loss-mult` | 0.002 | 畸变损失权重（让密度更集中） |
| `orientation-loss-mult` | 0.0001 | 法线方向损失权重 |
| `pred-normal-loss-mult` | 0.001 | 预测法线损失权重 |

#### 5.6.6 其他配置

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `use-proposal-weight-anneal` | True/False | True | 是否使用提议权重退火 |
| `use-appearance-embedding` | True/False | True | 是否使用外观嵌入（处理光照变化） |
| `use-average-appearance-embedding` | True/False | True | 推理时使用平均外观嵌入 |
| `proposal-weights-anneal-slope` | FLOAT | 10.0 | 权重退火斜率 |
| `proposal-weights-anneal-max-num-iters` | INT | 1000 | 权重退火最大迭代数 |
| `use-single-jitter` | True/False | True | 提议网络是否使用单抖动采样 |
| `predict-normals` | True/False | False | 是否预测法线 |

#### 5.6.7 相机优化器（`--pipeline.model.camera-optimizer.*`）

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mode` | 枚举 | `SO3xR3` | 位姿优化策略：`off`（关闭）、`SO3xR3`（推荐）、`SE3` |
| `trans-l2-penalty` | FLOAT | 0.01 | 平移参数的 L2 惩罚 |
| `rot-l2-penalty` | FLOAT | 0.001 | 旋转参数的 L2 惩罚 |

### 5.7 优化器选项

#### 5.7.1 提议网络优化器（`--optimizers.proposal-networks.*`）

优化器类型：**Adam**，默认 lr=0.01, eps=1e-15

Scheduler：**ExponentialDecay**
| 参数 | 默认值 | 说明 |
|------|--------|------|
| `lr-pre-warmup` | 1e-08 | 预热前学习率 |
| `lr-final` | 0.0001 | 最终学习率 |
| `warmup-steps` | 0 | 预热步数 |
| `max-steps` | 200000 | 最大步数 |
| `ramp` | cosine | 预热曲线：`linear` 或 `cosine` |

#### 5.7.2 主网络优化器（`--optimizers.fields.*`）

同提议网络配置（默认 lr=0.01, eps=1e-15, lr_final=0.0001, max_steps=200000）

#### 5.7.3 相机优化器（`--optimizers.camera-opt.*`）

优化器：**Adam**，默认 lr=0.001, eps=1e-15

Scheduler：**ExponentialDecay**
| 参数 | 默认值 | 说明 |
|------|--------|------|
| `lr-pre-warmup` | 1e-08 | 预热前学习率 |
| `lr-final` | 0.0001 | 最终学习率 |
| `warmup-steps` | 0 | 预热步数 |
| `max-steps` | 5000 | 最大步数 |
| `ramp` | cosine | 预热曲线 |

### 5.8 Dataparser 子命令

数据解析器选择（默认 `nerfstudio-data`）：

| 数据解析器 | 适用场景 |
|-----------|----------|
| `nerfstudio-data` | ⭐ 通用 nerfstudio 格式（推荐） |
| `blender-data` | Blender 合成数据（有界场景） |
| `instant-ngp-data` | Instant-NGP 格式 |
| `phototourism-data` | PhotoTourism 数据集 |
| `dnerf-data` | D-NeRF 动态场景数据 |
| `arkit-data` | Apple ARKit 数据 |
| `nuscenes-data` | nuScenes 自动驾驶数据 |
| `dycheck-data` | DyCheck 动态数据 |
| `scannet-data` | ScanNet 数据 |
| `sdfstudio-data` | SDFStudio 数据 |
| `scannetpp-data` | ScanNet++ 数据 |
| `colmap` | COLMAP 数据 |
| `minimal-parser` | 最小解析器 |
| `nerfosr-data` | NeRF-OSR 数据 |
| `sitcoms3d-data` | Sitcoms3D 数据 |

---

## 六、Splatfacto 详细参数参考（ns-train splatfacto --help）

> 3D Gaussian Splatting 模型参数。所有参数通过 `--` 前缀传递。
> 默认数据管理器为 `FullImageDatamanagerConfig`（不同于 nerfacto 的 `ParallelDataManagerConfig`）

### 6.1 通用选项（options）

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--output-dir` | PATH | `outputs` | 保存检查点和日志的输出目录 |
| `--method-name` | STR\|None | `splatfacto` | 方法名称 |
| `--experiment-name` | STR\|None | None | 实验名称，不设置则自动使用数据集名 |
| `--project-name` | STR | `nerfstudio-project` | 项目名称 |
| `--timestamp` | STR | `{timestamp}` | 实验时间戳 |
| `--vis` | 枚举 | `viewer` | 可视化方式 |
| `--data` | PATH\|None | None | 别名：`--pipeline.datamanager.data` |
| `--relative-model-dir` | PATH | `nerfstudio_models` | 保存检查点的相对路径 |
| `--load-scheduler` | True/False | True | 是否恢复 scheduler 状态 |
| `--steps-per-save` | INT | 2000 | 每 N 步保存一次检查点 |
| `--steps-per-eval-batch` | INT | 0 | 每 N 步随机采样批次评估（splatfacto 默认关闭） |
| `--steps-per-eval-image` | INT | 100 | 每 N 步评估单张图像 |
| `--steps-per-eval-all-images` | INT | 1000 | 每 N 步评估所有图像 |
| `--max-num-iterations` | INT | 30000 | **最大训练迭代次数** |
| `--mixed-precision` | True/False | False | ⚠️ splatfacto **默认关闭**混合精度 |
| `--use-grad-scaler` | True/False | False | 是否使用梯度缩放 |
| `--save-only-latest-checkpoint` | True/False | True | 是否只保存最新检查点 |
| `--load-dir` / `--load-config` / `--load-checkpoint` | — | None | 加载预训练模型 |

### 6.2 DataManager 选项（`--pipeline.datamanager.*`）

> splatfacto 使用 `FullImageDatamanager`（全图像数据管理器），不同于 nerfacto 的并行采样方式

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `data` | PATH\|None | None | 数据路径 |
| `masks-on-gpu` | True/False | False | 是否在 GPU 处理 mask |
| `images-on-gpu` | True/False | False | 是否在 GPU 处理图像 |
| `camera-res-scale-factor` | FLOAT | 1.0 | 图像/相机缩放因子 |
| `eval-num-images-to-sample-from` | INT | -1 | 评估时采样图像数（-1 为全部） |
| `eval-num-times-to-repeat-images` | INT | -1 | 评估时图像重复次数 |
| `cache-images` | 枚举 | `gpu` | **图像缓存位置**：`cpu`、`gpu`、`disk` |
| `cache-images-type` | 枚举 | `uint8` | 图像缓存类型（splatfacto 默认就是 uint8） |
| `max-thread-workers` | INT\|None | None | 缓存图像最大线程数 |
| `train-cameras-sampling-strategy` | 枚举 | `random` | 训练相机采样策略：`random`（随机）或 `fps`（最远点采样，减少伪影） |
| `train-cameras-sampling-seed` | INT | 42 | 采样种子 |
| `fps-reset-every` | INT | 100 | FPS 采样器重置间隔 |
| `dataloader-num-workers` | INT | 4 | DataLoader 工作线程数 |
| `prefetch-factor` | INT\|None | 4 | 预取批次数量 |
| `cache-compressed-images` | True/False | False | 是否压缩缓存图像 |

### 6.3 Model 选项（`--pipeline.model.*`）— 核心参数

#### 6.3.1 场景与渲染

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enable-collider` | True/False | True | 是否创建场景碰撞体 |
| `collider-params` | dict | `near_plane 2.0 far_plane 6.0` | 碰撞体参数 |
| `eval-num-rays-per-chunk` | INT | 4096 | 评估时每块渲染的光线数 |
| `background-color` | 枚举 | `random` | 背景色 |
| `prompt` | STR\|None | None | 文本提示 |

#### 6.3.2 训练策略

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `warmup-length` | INT | 500 | 关闭精化的预热步数 |
| `refine-every` | INT | 100 | **高斯精化间隔**（剔除/稠密化） |
| `resolution-schedule` | INT | 3000 | 分辨率调度：从 1/d 开始，每 n 步翻倍 |
| `num-downscales` | INT | 2 | 初始降采样倍数（1/2^d） |

#### 6.3.3 高斯剔除（Culling）

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `cull-alpha-thresh` | FLOAT | 0.1 | **透明度剔除阈值**（↓ 降低可保留更多高斯，提升质量，如 0.005） |
| `cull-scale-thresh` | FLOAT | 0.5 | 尺寸剔除阈值，剔除过大的高斯 |
| `reset-alpha-every` | INT | 30 | 每 N 步精化后重置透明度 |
| `cull-screen-size` | FLOAT | 0.15 | 若高斯占屏幕超过此比例则剔除 |
| `stop-screen-size-at` | INT | 4000 | 停止屏幕尺寸剔除/分割的步数 |

#### 6.3.4 高斯稠密化（Densification）

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `densify-grad-thresh` | FLOAT | 0.0008 | **梯度阈值**：梯度大于此值时稠密化（↓ 降低则更多细分） |
| `use-absgrad` | True/False | True | 是否使用梯度绝对值（False 则用梯度本身） |
| `densify-size-thresh` | FLOAT | 0.01 | 尺寸阈值：小于此值复制高斯，大于则分割 |
| `n-split-samples` | INT | 2 | 分割高斯时的份数 |
| `split-screen-size` | FLOAT | 0.05 | 若高斯占屏幕超过此比例则分割 |
| `stop-split-at` | INT | 15000 | 停止分割的步数 |
| `sh-degree-interval` | INT | 1000 | 每 N 步增加一个球谐阶数 |
| `sh-degree` | INT | 3 | **最大球谐阶数**（0-3，越高颜色细节越丰富） |

#### 6.3.5 初始化

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `random-init` | True/False | False | 是否随机初始化（False 则用 COLMAP/SfM 点） |
| `num-random` | INT | 50000 | 随机初始化高斯数 |
| `random-scale` | FLOAT | 10.0 | 随机初始化范围立方体尺寸 |
| `max-gs-num` | INT | 1000000 | **最大高斯数量**（默认 1M） |

#### 6.3.6 损失函数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `ssim-lambda` | FLOAT | 0.2 | **SSIM 损失权重**（越高纹理越清晰） |
| `use-scale-regularization` | True/False | False | 是否使用 PhysGaussian 尺度正则化（减少尖刺高斯） |
| `max-gauss-ratio` | FLOAT | 10.0 | 尺度正则化触发阈值 |
| `mcmc-opacity-reg` | FLOAT | 0.01 | MCMC 策略的透明度正则化 |
| `mcmc-scale-reg` | FLOAT | 0.01 | MCMC 策略的尺度正则化 |

#### 6.3.7 渲染与输出

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `output-depth-during-training` | True/False | False | 训练时是否输出深度 |
| `rasterize-mode` | 枚举 | `classic` | 光栅化模式：`classic`（经典，兼容性好）或 `antialiased`（抗锯齿，但 PLY 不兼容经典查看器） |
| `use-bilateral-grid` | True/False | False | 是否使用双边网格处理 ISP 变化（Bilateral Guided Radiance Field） |
| `grid-shape` | INT×3 | `16 16 8` | 双边网格形状 (X, Y, W) |
| `color-corrected-metrics` | True/False | False | 评估指标前是否颜色校正 |
| `strategy` | 枚举 | `default` | 训练策略：`default` 或 `mcmc` |
| `noise-lr` | FLOAT | 500000.0 | MCMC 采样噪声学习率 |

### 6.4 相机优化器（`--pipeline.model.camera-optimizer.*`）

> splatfacto **默认关闭**相机优化（`mode=off`），与 nerfacto 不同

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `mode` | 枚举 | `off` | ⚠️ 默认关闭，开启可选 `SO3xR3` 或 `SE3` |
| `trans-l2-penalty` | FLOAT | 0.01 | 平移 L2 惩罚 |
| `rot-l2-penalty` | FLOAT | 0.001 | 旋转 L2 惩罚 |

### 6.5 优化器选项

splatfacto 有多组独立的优化器，每组均可单独配置学习率：

| 优化器组 | 默认 lr | 说明 |
|----------|---------|------|
| `optimizers.means.*` | 0.00016 | 高斯中心位置 |
| `optimizers.features-dc.*` | 0.0025 | 球谐 DC 特征（基础颜色） |
| `optimizers.features-rest.*` | 0.000125 | 球谐高阶特征 |
| `optimizers.opacities.*` | 0.05 | 不透明度 |
| `optimizers.scales.*` | 0.005 | 高斯缩放 |
| `optimizers.quats.*` | 0.001 | 高斯旋转四元数 |
| `optimizers.camera-opt.*` | 0.0001 | 相机位姿优化（默认关闭） |
| `optimizers.bilateral-grid.*` | 0.002 | 双边网格（默认关闭） |

所有优化器使用 **Adam**，scheduler 除 `means` 和 `camera-opt` 为 `ExponentialDecay` 外，其余默认均为 `None`。

### 6.6 与 Nerfacto 的关键区别

| 对比项 | Nerfacto | Splatfacto |
|--------|----------|------------|
| 表示方式 | 隐式神经场（MLP+哈希编码） | 显式高斯泼溅点云 |
| 渲染速度 | 中等 | **实时（毫秒级）** |
| 数据管理器 | `ParallelDataManager` | `FullImageDatamanager` |
| 图像缓存 | `cache-images-type=float32` | `cache-images-type=uint8`（默认） |
| 混合精度 | 默认开启 | **默认关闭** |
| 相机优化 | 默认开启 (`SO3xR3`) | 默认关闭 (`off`) |
| 训练策略 | 提议网络 + NeRF 网络 | 逐帧渲染 + 高斯增删 |
| 导出方式 | `poisson` / `tsdf`（需重建网格） | `gaussian-splat`（直接导出 `.ply`） |

---

## 七、显存优化速查表（以 nerfacto 为例）

### 核心调优参数（按影响从大到小）

| 参数 | 默认值 | 低显存(6GB) | 极限(4GB) | 对质量影响 |
|------|--------|------------|-----------|-----------|
| `train-num-rays-per-batch` | 4096 | 2048 | 1024 | 中 |
| `num-proposal-samples-per-ray` | 256 96 | 128 64 | 96 48 | 大 |
| `num-nerf-samples-per-ray` | 48 | 32 | 24 | 中 |
| `max-res` | 2048 | 1024 | 512 | 大 |
| `log2-hashmap-size` | 19 | 17 | 16 | 中 |
| `num-levels` | 16 | 10 | 8 | 大 |
| `hidden-dim` | 64 | 64 | 32 | 中 |
| `cache-images-type` | float32 | uint8 | uint8 | 无 |
| `load-from-disk` | False | False | True | 无 |

### 快速启动模板

```bash
# 6GB 显存平衡版
ns-train nerfacto --data /path/to/data ^
  --pipeline.datamanager.cache-images-type uint8 ^
  --pipeline.datamanager.train-num-rays-per-batch 2048 ^
  --pipeline.datamanager.eval-num-rays-per-batch 2048 ^
  --pipeline.model.num-nerf-samples-per-ray 32 ^
  --pipeline.model.num-proposal-samples-per-ray 192 64 ^
  --pipeline.model.max-res 1024 ^
  --pipeline.model.log2-hashmap-size 17 ^
  --pipeline.model.num-levels 10

# 8GB+ 显存快速版（推荐 instant-ngp）
ns-train instant-ngp --data /path/to/data ^
  --pipeline.datamanager.cache-images-type uint8

# 12GB+ 显存全质量版
ns-train nerfacto --data /path/to/data
```

---

## 八、注意事项

1. **Windows 限制**：Windows 不完全支持 `torch.compile`，性能会受影响（启动时会有 RuntimeWarning）
2. **数据格式**：默认使用 [nerfstudio 数据格式](https://docs.nerf.studio/)（`NerfstudioDataParserConfig`），需先通过 `ns-process-data` 转换
3. **外部方法**：需要先 `pip install` 对应包才能使用
4. **显存需求**：nerfacto-huge 约需 24GB+ 显存，splatfacto 约需 8-16GB
5. **Windows 换行**：PowerShell 用 `` ` `` 换行，CMD 用 `^` 换行，Linux 用 `\` 换行
6. **参数命名规则**：嵌套参数用 `.` 分隔（如 `pipeline.model.hidden-dim`），数组参数用空格分隔多个值

---

## 九、ns-export 导出命令参考

```bash
ns-export <子命令> [参数]
```

### 导出方式对比：哪些能出彩色三角网格？

| 方式 | 彩色三角网格 | 适用模型 | 说明 |
|------|:----------:|---------|------|
| **`poisson`** ⭐ | ✅ **有纹理 + 顶点颜色** | **任何 NeRF 模型** | 最推荐，通用性强 |
| **`tsdf`** | ✅ **有纹理** | **任何 NeRF 模型** | 从深度图融合，质量取决于深度精度 |
| **`marching-cubes`** | ✅ **有纹理** | ❌ **仅 SDF 模型**（neus/neus-facto） | nerfacto 不能用 |
| `pointcloud` | ❌ 无三角面 | 任何模型 | 只有点云 |
| `gaussian-splat` | ❌ 非三角网格 | splatfacto 系列 | 导出 3DGS 专用 `.ply` |
| `cameras` | ❌ | 任何模型 | 只导出位姿 |

---

### 8.1 poisson — 泊松表面重建（⭐ 推荐，带彩色纹理）

> 适用任何模型（nerfacto / instant-ngp / splatfacto 等）
> 流程：采样带颜色点云 → 泊松重建三角网格 → UV 纹理映射 → 输出 `.obj` + 纹理图

**基本用法：**
```bash
ns-export poisson \
  --load-config outputs/.../config.yml \
  --output-dir exports/mesh
```

**完整参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--num-points` | INT | 1000000 | 采样点数（越多细节越丰富） |
| `--remove-outliers` | True/False | True | 是否移除离群点 |
| `--reorient-normals` | True/False | True | 是否基于视角重定向法线 |
| `--normal-method` | 枚举 | `model_output` | 法线估计方式：`open3d` 或 `model_output` |
| `--texture-method` | 枚举 | `nerf` | **纹理方式**：`nerf`（用 NeRF 渲染纹理）或 `point_cloud`（用点云颜色） |
| `--target-num-faces` | INT\|None | 50000 | 目标三角面数（None 为不简化） |
| `--num-pixels-per-side` | INT | 2048 | 纹理图分辨率（越大纹理越清晰） |
| `--unwrap-method` | 枚举 | `xatlas` | UV 展开方式：`xatlas` 或 `custom` |
| `--px-per-uv-triangle` | INT | 4 | 每个 UV 三角的像素数（custom 方式使用） |
| `--save-point-cloud` | True/False | False | 是否同时保存中间点云 |
| `--num-rays-per-batch` | INT | 32768 | 每批光线数（显存不够时减小） |
| `--obb-center` | [x, y, z] | None | 有向包围盒中心（裁剪用） |
| `--obb-rotation` | [r, p, y] | None | 有向包围盒旋转（弧度） |
| `--obb-scale` | [x, y, z] | None | 有向包围盒缩放 |
| `--std-ratio` | FLOAT | 10.0 | 离群点阈值标准差倍数 |

**输出文件：**
- `poisson_mesh.ply` — 原始三角网格（含顶点颜色）
- `mesh.obj` + `mesh.mtl` + `material_0.png` — **带 UV 纹理的彩色网格**

**高质量导出示例：**
```bash
ns-export poisson \
  --load-config outputs/.../config.yml \
  --output-dir exports/mesh \
  --num-points 2000000 \
  --target-num-faces 100000 \
  --num-pixels-per-side 4096 \
  --texture-method nerf
```

---

### 8.2 tsdf — TSDF 融合

> 适用任何模型。从深度图中融合出三角网格，再用 NeRF 贴纹理。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--downscale-factor` | INT | 2 | 图像降采样因子 |
| `--resolution` | INT\|[x,y,z] | [128,128,128] | TSDF 体素分辨率 |
| `--batch-size` | INT | 10 | 每批处理的深度图数 |
| `--use-bounding-box` | True/False | True | 是否使用包围盒裁剪 |
| `--bounding-box-min` | [x,y,z] | [-1,-1,-1] | 包围盒最小值 |
| `--bounding-box-max` | [x,y,z] | [1,1,1] | 包围盒最大值 |
| `--texture-method` | 枚举 | `nerf` | 纹理方式：`nerf` 或 `tsdf` |
| `--target-num-faces` | INT\|None | 50000 | 目标三角面数 |
| `--num-pixels-per-side` | INT | 2048 | 纹理图分辨率 |
| `--unwrap-method` | 枚举 | `xatlas` | UV 展开方式 |
| `--refine-mesh-using-initial-aabb-estimate` | True/False | False | 是否基于初始 AABB 精化网格 |
| `--refinement-epsilon` | FLOAT | 0.01 | 精化扩展距离（米） |

```bash
ns-export tsdf \
  --load-config outputs/.../config.yml \
  --output-dir exports/mesh \
  --resolution 256 \
  --texture-method nerf
```

---

### 8.3 marching-cubes — 移动立方体

> **⚠️ 仅适用于 SDF 模型（neus / neus-facto）**，nerfacto 等密度场模型不可用

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--resolution` | INT | 1024 | 移动立方体分辨率（需被 512 整除） |
| `--isosurface-threshold` | FLOAT | 0.0 | 等值面阈值（SDF 为零值面） |
| `--simplify-mesh` | True/False | False | 是否简化网格 |
| `--bounding-box-min` | [x,y,z] | [-1,-1,-1] | 包围盒最小值 |
| `--bounding-box-max` | [x,y,z] | [1,1,1] | 包围盒最大值 |
| `--target-num-faces` | INT\|None | 50000 | 目标三角面数 |
| `--num-pixels-per-side` | INT | 2048 | 纹理图分辨率 |
| `--unwrap-method` | 枚举 | `xatlas` | UV 展开方式 |

```bash
ns-export marching-cubes \
  --load-config outputs/.../config.yml \
  --output-dir exports/mesh \
  --resolution 1024
```

---

### 8.4 pointcloud — 导出点云

> 适用任何模型，无三角面，只输出点云

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--num-rays` | INT | 1000000 | 采样光线数 |
| `--remove-outliers` | True/False | True | 是否移除离群点 |
| `--reorient-normals` | True/False | True | 是否重定向法线 |
| `--num-rays-per-batch` | INT | 32768 | 每批光线数 |
| `--obb-center/--obb-rotation/--obb-scale` | — | None | 有向包围盒裁剪 |

```bash
ns-export pointcloud \
  --load-config outputs/.../config.yml \
  --output-dir exports/pointcloud \
  --num-rays 1000000
```

---

### 8.5 cameras — 导出相机位姿

> 适用任何模型，导出相机内参和外参为 `.json` 格式，可用于 COLMAP 等工具

```bash
ns-export cameras \
  --load-config outputs/.../config.yml \
  --output-dir exports/cameras
```

---

### 8.6 gaussian-splat — 导出 3DGS

> ⚠️ 仅适用于 `splatfacto` 系列模型。导出为 `.ply` 格式，可在 [SuperSplat](https://playcanvas.com/supersplat) 或 [gsplat.js](https://github.com/dylanebert/gsplat.js) 中加载。

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `--segmentation-method` | STR\|None | None | 分割方法 |

```bash
ns-export gaussian-splat \
  --load-config outputs/.../config.yml \
  --output-dir exports/gaussians
```
