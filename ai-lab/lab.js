const MODELS = [
  {
    id: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
    name: "Qwen2.5 · 0.5B",
    kind: "中文通用",
    license: "Apache-2.0",
    link: "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct",
    system: "你是一位友善、诚实、善于用简明中文解释问题的助手。优先直接回答；不知道时明确说明，不要编造来源。"
  },
  {
    id: "Qwen2.5-Coder-0.5B-Instruct-q4f16_1-MLC",
    name: "Qwen Coder · 0.5B",
    kind: "代码助手",
    license: "Apache-2.0",
    link: "https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct",
    system: "你是一名编程助手，擅长用中文解释代码、分析错误并给出小而清晰的示例。先确认问题和语言；代码要能运行，指出关键假设，不要虚构 API。"
  },
  {
    id: "Qwen2.5-Math-1.5B-Instruct-q4f16_1-MLC",
    name: "Qwen Math · 1.5B",
    kind: "数学解题",
    license: "Apache-2.0",
    link: "https://huggingface.co/Qwen/Qwen2.5-Math-1.5B-Instruct",
    system: "你是一名耐心的数学辅导老师。请说明已知条件，列出关键公式，再给出必要步骤和最终答案。遇到不确定的计算要复核；不要跳过影响结果的步骤。"
  },
  {
    id: "DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC",
    name: "DeepSeek R1 · 7B",
    kind: "进阶推理",
    license: "MIT",
    link: "https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
    system: "你是一名谨慎的分析助手。面对复杂问题，先梳理条件并检查结论；回答时给出结论和可核验的理由或步骤摘要，不需要展示冗长的内部思考过程。"
  }
];

const $ = (selector) => document.querySelector(selector);
const modelCards = Array.from(document.querySelectorAll(".model-card"));
const statusBox = $("#runtimeStatus");
const statusText = $("#statusText");
const gpuBadge = $("#gpuBadge");
const progressWrap = $("#progressWrap");
const progressText = $("#progressText");
const progressPercent = $("#progressPercent");
const progressBar = $("#progressBar");
const chatMessages = $("#chatMessages");
const promptInput = $("#promptInput");
const sendButton = $("#sendButton");
const launchButton = $("#loadModel");
const chatForm = $("#chatForm");
const supportNote = $("#supportNote");

let selectedId = modelCards.find((card) => card.classList.contains("is-active"))?.dataset.modelId || MODELS[0].id;
let engine = null;
let engineModelId = "";
let loading = false;
let generating = false;
let loadPromise = null;
let webgpuReady = false;
let chatHistory = [];

function selectedModel() {
  return MODELS.find((model) => model.id === selectedId) || MODELS[0];
}

function setStatus(message, kind = "") {
  statusText.textContent = message;
  statusBox.classList.remove("is-ready", "is-loading", "is-error");
  if (kind) statusBox.classList.add(kind);
}

function setProgress(progress, message) {
  const value = Math.max(0, Math.min(100, Math.round((Number(progress) || 0) * 100)));
  progressWrap.hidden = false;
  progressText.textContent = message || "正在准备模型资源…";
  progressPercent.textContent = value + "%";
  progressBar.style.width = value + "%";
}

function hideProgress() {
  progressWrap.hidden = true;
  progressBar.style.width = "0%";
}

function updateControls() {
  const locked = loading || generating;
  modelCards.forEach((card) => {
    card.disabled = locked;
    card.setAttribute("aria-pressed", String(card.dataset.modelId === selectedId));
  });
  if (launchButton) launchButton.disabled = locked || !webgpuReady;
  sendButton.disabled = locked || !webgpuReady;
  promptInput.disabled = locked || !webgpuReady;
  $("#clearChat").disabled = locked;
  document.querySelectorAll("[data-prompt]").forEach((button) => { button.disabled = locked; });
}

function addMessage(role, content) {
  const article = document.createElement("article");
  article.className = "message " + (role === "user" ? "message-user" : "message-assistant");
  const avatar = document.createElement("span");
  avatar.className = "message-avatar " + (role === "user" ? "avatar-user" : "avatar-ai");
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = role === "user" ? "YOU" : "✦";
  const wrapper = document.createElement("div");
  wrapper.className = "message-content";
  const label = document.createElement("div");
  label.className = "message-label";
  label.textContent = role === "user" ? "YOU" : "LOCAL AI";
  if (role !== "user") {
    const sub = document.createElement("span");
    sub.textContent = selectedModel().name;
    label.appendChild(sub);
  }
  const body = document.createElement("div");
  body.className = "message-body";
  body.textContent = content || "";
  wrapper.append(label, body);
  article.append(avatar, wrapper);
  chatMessages.appendChild(article);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return body;
}

function renderWelcome() {
  chatMessages.replaceChildren();
  const article = document.createElement("article");
  article.className = "message message-assistant welcome-message";
  const avatar = document.createElement("span");
  avatar.className = "message-avatar avatar-ai";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = "✦";
  const wrapper = document.createElement("div");
  wrapper.className = "message-content";
  const label = document.createElement("div");
  label.className = "message-label";
  label.append(document.createTextNode("LOCAL AI "));
  const sub = document.createElement("span");
  sub.textContent = selectedModel().name;
  label.appendChild(sub);
  const body = document.createElement("div");
  body.className = "message-body";
  body.textContent = "已选择 " + selectedModel().name + "。加载模型后就可以开始聊天。第一次需要下载模型文件，网速和设备性能会影响等待时间。";
  wrapper.append(label, body);
  article.append(avatar, wrapper);
  chatMessages.appendChild(article);
}

async function releaseEngine() {
  const oldEngine = engine;
  engine = null;
  engineModelId = "";
  if (oldEngine && typeof oldEngine.unload === "function") {
    try { await oldEngine.unload(); } catch (error) { console.warn("释放模型时遇到提示：", error); }
  }
}

async function selectModel(id) {
  if (loading || generating || id === selectedId) return;
  selectedId = id;
  updateControls();
  setStatus("正在切换模型…", "is-loading");
  hideProgress();
  await releaseEngine();
  chatHistory = [];
  renderWelcome();
  modelCards.forEach((card) => {
    const active = card.dataset.modelId === selectedId;
    card.classList.toggle("is-active", active);
    card.setAttribute("aria-pressed", String(active));
  });
  setStatus("已选择 " + selectedModel().name + "，尚未加载");
  updateControls();
}

async function loadModel() {
  if (engine && engineModelId === selectedId) return engine;
  if (loadPromise) return loadPromise;
  if (!webgpuReady) throw new Error("当前浏览器没有可用的 WebGPU 设备。请尝试最新版 Chrome 或 Edge，并确认设备支持硬件加速。");

  loading = true;
  updateControls();
  setStatus("正在启动本地模型…", "is-loading");
  setProgress(0, "正在连接开源推理引擎…");

  loadPromise = (async () => {
    const webllm = await import("https://esm.run/@mlc-ai/web-llm");
    const modelId = selectedId;
    const available = webllm.prebuiltAppConfig?.model_list?.some((model) => model.model_id === modelId);
    if (!available) {
      throw new Error("当前推理引擎版本暂未包含 " + modelId + "。请刷新页面稍后重试，或查看模型清单。");
    }
    const created = await webllm.CreateMLCEngine(modelId, {
      initProgressCallback: (info) => {
        setProgress(info.progress, info.text || "正在下载并初始化模型…");
      }
    });
    if (modelId !== selectedId) {
      if (created && typeof created.unload === "function") await created.unload();
      throw new Error("加载期间模型选择发生变化，请重新加载。");
    }
    engine = created;
    engineModelId = modelId;
    setProgress(1, "模型已准备就绪");
    setStatus(selectedModel().name + " 已就绪 · 推理在本地运行", "is-ready");
    window.setTimeout(hideProgress, 900);
    return engine;
  })();

  try {
    return await loadPromise;
  } catch (error) {
    hideProgress();
    setStatus("模型加载失败", "is-error");
    const detail = error instanceof Error ? error.message : String(error);
    supportNote.textContent = "加载失败：" + detail + "。可尝试换轻量模型、关闭占用显存的应用或使用支持 WebGPU 的最新版浏览器。";
    supportNote.classList.add("is-error");
    throw error;
  } finally {
    loading = false;
    loadPromise = null;
    updateControls();
  }
}

async function sendMessage(text) {
  const clean = String(text || "").trim();
  if (!clean || loading || generating) return;
  promptInput.value = "";
  supportNote.classList.remove("is-error");
  const chosen = selectedModel();
  addMessage("user", clean);
  chatHistory.push({ role: "user", content: clean });
  const answerBody = addMessage("assistant", "");
  generating = true;
  updateControls();

  try {
    const currentEngine = await loadModel();
    if (!currentEngine) throw new Error("模型尚未准备好。");
    setStatus("正在生成回答…", "is-loading");
    const requestMessages = [{ role: "system", content: chosen.system }, ...chatHistory];
    const response = await currentEngine.chat.completions.create({
      model: chosen.id,
      messages: requestMessages,
      temperature: 0.65,
      max_tokens: 700,
      stream: true
    });
    let answer = "";
    for await (const chunk of response) {
      const delta = chunk?.choices?.[0]?.delta?.content;
      if (typeof delta === "string" && delta) {
        answer += delta;
        answerBody.textContent = answer;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }
    if (!answer.trim()) answer = "这次没有生成文字。可以换个问法再试一次。";
    answerBody.textContent = answer;
    chatHistory.push({ role: "assistant", content: answer });
    setStatus(chosen.name + " · 本地生成完成", "is-ready");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    answerBody.textContent = "这次没有成功生成回答。\n\n" + detail + "\n\n请确认设备支持 WebGPU、网络能访问模型资源，或切换更轻量的模型后重试。";
    setStatus("生成遇到问题", "is-error");
    supportNote.textContent = "运行提示：" + detail;
    supportNote.classList.add("is-error");
  } finally {
    generating = false;
    updateControls();
    promptInput.focus();
  }
}

async function checkWebGPU() {
  if (!window.isSecureContext || !navigator.gpu) {
    webgpuReady = false;
    gpuBadge.textContent = "需要 WebGPU";
    statusBox.classList.add("gpu-no");
    setStatus("当前环境不支持 WebGPU", "is-error");
    supportNote.textContent = "这页需要支持 WebGPU 的安全浏览器环境。请优先尝试最新版 Chrome 或 Edge；部分手机、浏览器版本或显卡驱动可能不兼容。";
    supportNote.classList.add("is-error");
    updateControls();
    return;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("浏览器没有找到可用的 GPU 适配器。");
    webgpuReady = true;
    gpuBadge.textContent = "WebGPU 可用";
    statusBox.classList.add("gpu-yes");
    setStatus("设备已就绪，选择模型开始");
    supportNote.textContent = "当前浏览器检测到 WebGPU。实际能否运行还取决于可用显存、浏览器限制和模型大小；若大模型失败，请先试轻量款。";
  } catch (error) {
    webgpuReady = false;
    gpuBadge.textContent = "GPU 不可用";
    statusBox.classList.add("gpu-no");
    setStatus("没有可用的 GPU 适配器", "is-error");
    supportNote.textContent = "浏览器发现 WebGPU，但未能创建 GPU 适配器。请检查硬件加速设置、显卡驱动或改用另一款浏览器。";
    supportNote.classList.add("is-error");
  }
  updateControls();
}

modelCards.forEach((card) => {
  card.addEventListener("click", () => selectModel(card.dataset.modelId));
});

$("#clearChat").addEventListener("click", async () => {
  if (loading || generating) return;
  chatHistory = [];
  if (engine && typeof engine.resetChat === "function") {
    try { await engine.resetChat(false, selectedId); } catch (error) { console.warn("重置模型会话时遇到提示：", error); }
  }
  renderWelcome();
  setStatus(engine ? selectedModel().name + " 已就绪 · 对话已重置" : "已重置对话");
  promptInput.focus();
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(promptInput.value);
});

promptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    promptInput.value = button.dataset.prompt || "";
    promptInput.focus();
    promptInput.setSelectionRange(promptInput.value.length, promptInput.value.length);
  });
});

const loadButton = document.createElement("button");
loadButton.type = "button";
loadButton.className = "load-model-button";
loadButton.id = "loadModel";
loadButton.textContent = "加载所选模型";
loadButton.addEventListener("click", () => loadModel().catch((error) => console.warn("模型启动失败：", error)));
const composer = $("#chatForm");
const chatHead = document.querySelector(".chat-head");
const headAction = document.createElement("button");
headAction.type = "button";
headAction.className = "load-model-button head-load-button";
headAction.textContent = "加载模型";
headAction.addEventListener("click", () => loadModel().catch((error) => console.warn("模型启动失败：", error)));
chatHead.appendChild(headAction);
launchButton = headAction;
updateControls();
renderWelcome();
checkWebGPU();
