# 浏览器本地 AI 实验室

本页是 AI Starter Hub 的免费、本地推理实验区。静态页面部署在 GitHub Pages，不建立新的推理后端、用户数据库或收费 API 账户。

## 模型清单

| 用途 | 模型 | 页面标注的显存估算 | 权重许可 |
|---|---|---:|---|
| 中文通用 | Qwen2.5-0.5B-Instruct | 约 0.95 GB | Apache-2.0 |
| 代码助手 | Qwen2.5-Coder-0.5B-Instruct | 约 0.95 GB | Apache-2.0 |
| 数学解题 | Qwen2.5-Math-1.5B-Instruct | 约 1.63 GB | Apache-2.0 |
| 深度推理 | DeepSeek-R1-Distill-Qwen-7B | 约 5.1 GB | MIT |

页面中的模型 ID 与 MLC WebLLM 当前预构建模型清单对应；选择某个模型前，前端还会再次检查当前 CDN 版本的预构建列表。显存数值取自 WebLLM 的模型配置，不等于首次下载大小，也不是成功运行的保证。运行时会受硬件、驱动、浏览器、系统内存和上下文占用影响。

- [WebLLM 推理引擎](https://github.com/mlc-ai/web-llm)
- [Qwen2.5-0.5B-Instruct 模型卡](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct)
- [Qwen2.5-Coder-0.5B-Instruct 模型卡](https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct)
- [Qwen2.5-Math-1.5B-Instruct 模型卡](https://huggingface.co/Qwen/Qwen2.5-Math-1.5B-Instruct)
- [DeepSeek-R1-Distill-Qwen-7B 模型卡与许可说明](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B)

## 隐私与成本边界

- 语言模型推理在访问者自己的浏览器和设备上运行，当前页面代码不会把聊天提示发送至自建 AI 推理服务器。
- 首次加载会通过 CDN 引入 WebLLM，并从模型托管资源获取模型文件。用户需要网络流量；下载缓存取决于浏览器存储策略。
- 这不意味着完全离线：首次加载和缺失缓存的资源需要联网，某些浏览器或设备无法使用 WebGPU。
- 对话内容只保存在当前页面内存中，刷新页面会清空前端对话。不要输入密码、身份证号或其他敏感信息。
- 开源推理引擎与模型权重是不同许可对象。使用或再分发模型时，应阅读对应模型仓库中的许可文件。
- 模型会产生错误内容。重要的数学、编程、安全或事实性建议需要用户自行核验。

## 测试清单

1. 在支持 WebGPU 的 Chrome 或 Edge 中打开页面。
2. 首次选择轻量模型，确认进度条能更新，并能完成一次对话。
3. 切换模型，确认旧模型能够释放，页面对话会被重置。
4. 测试发送、Shift+Enter 换行、清空对话、模型加载失败提示及手机布局。
5. 打开 GitHub Pages 的 Actions，确认 SEO 生成、上传和部署步骤成功。

## 许可证注意

Qwen 系列模型卡标注 Apache-2.0；DeepSeek-R1-Distill-Qwen-7B 模型卡标注 MIT。具体权重与其许可来源应以各自官方模型仓库当前提供的 LICENSE 和模型说明为准。本页使用的品牌标识只用于识别所选模型系列：Qwen 标识取自 [Qwen 官方仓库 README 所引用的资源](https://qianwen-res.oss-cn-beijing.aliyuncs.com/logo_qwen.jpg)，DeepSeek 图形取自 [DeepSeek 官方品牌素材仓库](https://github.com/deepseek-ai/awesome-deepseek-integration/tree/main/docs/_logo%20svg)。请遵守 [DeepSeek 品牌素材使用规范](https://github.com/deepseek-ai/awesome-deepseek-integration/blob/main/docs/_logo%20svg/guidelines.md)。这些标识不表示 AI Starter Hub 与相关厂商存在合作、背书或官方关系。
