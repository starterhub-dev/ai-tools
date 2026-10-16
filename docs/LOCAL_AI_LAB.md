# 浏览器本地 AI 实验室

AI Starter Hub 的免费本地推理实验区。静态页面部署在 GitHub Pages，不建立新的推理后端、用户数据库或收费推理 API。

## 模型清单

下表使用 WebLLM `0.2.86` 预构建配置中存在的模型 ID。显存值取自同一版本的 `vram_required_MB` 并换算为约数；它不是下载大小，也不保证设备一定能运行。

| 用途 | 模型 | WebLLM 模型 ID | 显存估算 | 权重许可 |
|---|---|---|---:|---|
| 中文通用 | Qwen2.5-0.5B-Instruct | `Qwen2.5-0.5B-Instruct-q4f16_1-MLC` | 0.95 GB | Apache-2.0 |
| 编程入门 | Qwen2.5-Coder-0.5B-Instruct | `Qwen2.5-Coder-0.5B-Instruct-q4f16_1-MLC` | 0.95 GB | Apache-2.0 |
| 数学解题 | Qwen2.5-Math-1.5B-Instruct | `Qwen2.5-Math-1.5B-Instruct-q4f16_1-MLC` | 1.63 GB | Apache-2.0 |
| 中文通用 | Qwen3-0.6B | `Qwen3-0.6B-q4f16_1-MLC` | 1.40 GB | Apache-2.0 |
| 通用增强 | Qwen3-1.7B | `Qwen3-1.7B-q4f16_1-MLC` | 2.04 GB | Apache-2.0 |
| 极轻量英文 | TinyLlama-1.1B-Chat-v1.0 | `TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC` | 0.70 GB | Apache-2.0 |
| 极轻量英文 | SmolLM2-360M-Instruct | `SmolLM2-360M-Instruct-q4f16_1-MLC` | 0.38 GB | Apache-2.0 |
| 轻量通用 | SmolLM2-1.7B-Instruct | `SmolLM2-1.7B-Instruct-q4f16_1-MLC` | 1.77 GB | Apache-2.0 |
| 多语言通用 | Phi-4-mini-instruct | `Phi-4-mini-instruct-q4f16_1-MLC` | 3.44 GB | MIT |
| 进阶通用 | Mistral-7B-Instruct-v0.3 | `Mistral-7B-Instruct-v0.3-q4f16_1-MLC` | 4.57 GB | Apache-2.0 |
| 深度推理 | DeepSeek-R1-Distill-Qwen-7B | `DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC` | 5.1 GB | MIT |

模型 ID 与显存配置来源：[WebLLM v0.2.86 预构建配置](https://github.com/mlc-ai/web-llm/blob/v0.2.86/src/config.ts)。

## 模型选择、下载与兼容性

- 选中模型卡只切换当前模型，不会自动下载。只有点击卡片中的「下载」按钮，或直接发送第一条消息，页面才会开始加载所选模型。
- 同一时间只保留一个 WebLLM 引擎；切换模型会先尝试释放旧引擎，减少显存与系统内存压力。浏览器可能缓存模型文件，但缓存是否保留由浏览器管理。

- 聊天标题栏和 AI 回复头像会跟随当前选择切换品牌标识；切换模型会释放旧引擎并重置当前聊天。
- 模型卡提供轻量、编程、数学、推理和海外开源模型筛选项。筛选只影响展示，不会改变当前选择。
- SmolLM2、Mistral 等部分预构建模型要求浏览器设备支持 `shader-f16`。运行时会检查 WebLLM 是否提供对应配置；硬件、驱动、浏览器内存和上下文占用都会影响实际能否运行。
- 首次使用时模型权重需要下载。较大的 7B 模型通常需要更多显存与存储空间，不建议低配手机尝试。

## 品牌标识说明

- Qwen、DeepSeek 等模型卡显示对应模型系列的品牌标识。
- 主视觉中的 Qwen、DeepSeek、Gemini、Meta AI、Claude/Anthropic、Mistral、Hugging Face、Perplexity 标识只作模型生态展示，不代表云端服务已接入；实际对话始终使用下方所选的浏览器本地模型。
- 部分图形标识来自 [Simple Icons](https://github.com/simple-icons/simple-icons)，Qwen 使用其品牌图标资源，DeepSeek 图形取自 [DeepSeek 官方品牌素材库](https://github.com/deepseek-ai/awesome-deepseek-integration/tree/main/docs/_logo%20svg)。请遵守商标及品牌使用规范。AI Starter Hub 不代表上述公司，也不暗示官方合作或背书。

## 隐私与成本边界

- 语言模型推理在访问者自己的浏览器和设备上运行，当前页面代码不会把聊天提示发送至自建 AI 推理服务器。
- 首次加载会通过 CDN 引入 WebLLM，并从模型托管资源获取模型文件。用户需要网络流量；下载缓存取决于浏览器存储策略。
- 这不意味着完全离线：首次加载和缺失缓存的资源需要联网，某些浏览器或设备无法使用 WebGPU。
- 对话内容只保存在当前页面内存中，刷新页面会清空前端对话。不要输入密码、身份证号或其他敏感信息。
- 开源推理引擎与模型权重是不同许可对象。使用或再分发模型时，应阅读对应模型仓库当前提供的许可文件。
- 模型会产生错误内容。重要的数学、编程、安全或事实性建议需要自行核验。

## 测试清单

1. 在支持 WebGPU 的 Chrome 或 Edge 中打开页面。
2. 首次选择一个轻量模型，确认进度条能更新，并能完成一次对话。
3. 切换模型，确认聊天标题和 AI 头像的 logo 同步变化、旧模型释放，且对话按预期重置。
4. 测试模型分类筛选、发送、Shift+Enter 换行、清空对话、模型加载失败提示及手机布局。
5. 对 SmolLM2、Mistral 等要求 `shader-f16` 的模型，额外验证目标设备兼容性。
6. 打开 GitHub Pages Actions，确认 SEO 生成、上传和部署步骤成功。
