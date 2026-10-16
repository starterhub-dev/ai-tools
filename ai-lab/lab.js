const LOGOS = {
  qwen: "https://cdn.simpleicons.org/qwen/615EFF",
  deepseek: "https://raw.githubusercontent.com/deepseek-ai/awesome-deepseek-integration/main/docs/_logo%20svg/ICON.svg",
  huggingface: "https://cdn.simpleicons.org/huggingface/FFD21E",
  microsoft: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  mistral: "https://cdn.simpleicons.org/mistralai/F2A13A"
};

const MODELS = [
  { id:"Qwen2.5-0.5B-Instruct-q4f16_1-MLC", name:"Qwen2.5", detail:"0.5B · Instruct", kind:"中文通用", category:"general", tier:"light", brand:"Qwen", initials:"QW", logo:LOGOS.qwen, license:"Apache-2.0", vram:"0.95 GB", tag:"推荐起步", featured:true, desc:"入门轻量款，适合概念解释、润色、总结和简单翻译。", link:"https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct", system:"你是一位友善、诚实、善于用简明中文解释问题的助手。优先直接回答；不知道时明确说明，不要编造来源。" },
  { id:"Qwen2.5-Coder-0.5B-Instruct-q4f16_1-MLC", name:"Qwen Coder", detail:"0.5B · Code", kind:"代码助手", category:"coding", tier:"light", brand:"Qwen", initials:"QW", logo:LOGOS.qwen, license:"Apache-2.0", vram:"0.95 GB", tag:"DEV MODE", desc:"写代码、读报错、解释函数，适合编程入门和小工具练习。", link:"https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct", system:"你是一名编程助手，擅长用中文解释代码、分析错误并给出小而清晰的示例。先确认问题和语言；代码要能运行，指出关键假设，不要虚构 API。" },
  { id:"Qwen2.5-Math-1.5B-Instruct-q4f16_1-MLC", name:"Qwen Math", detail:"1.5B · Math", kind:"数学解题", category:"math", tier:"light", brand:"Qwen", initials:"QW", logo:LOGOS.qwen, license:"Apache-2.0", vram:"1.63 GB", tag:"MATH MODE", desc:"数学练习专用，适合列步骤、说明公式和复核中间结果。", link:"https://huggingface.co/Qwen/Qwen2.5-Math-1.5B-Instruct", system:"你是一名耐心的数学辅导老师。请说明已知条件，列出关键公式，再给出必要步骤和最终答案。遇到不确定的计算要复核；不要跳过影响结果的步骤。" },
  { id:"Qwen3-0.6B-q4f16_1-MLC", name:"Qwen3", detail:"0.6B · Q4", kind:"轻量通用", category:"general", tier:"light", brand:"Qwen", initials:"QW", logo:LOGOS.qwen, license:"Apache-2.0", vram:"1.40 GB", tag:"轻量新秀", desc:"新一代轻量开放模型，适合简单问答、摘要和日常小任务。", link:"https://huggingface.co/Qwen/Qwen3-0.6B", system:"你是一位谨慎的中文通用助手。回答尽量清楚简洁，遇到超出小模型能力的问题请诚实说明。" },
  { id:"Qwen3-1.7B-q4f16_1-MLC", name:"Qwen3", detail:"1.7B · Q4", kind:"通用增强", category:"general", tier:"light", brand:"Qwen", initials:"QW", logo:LOGOS.qwen, license:"Apache-2.0", vram:"2.04 GB", tag:"均衡款", desc:"比超轻量款更有余量，适合多轮问答、改写和常见推理。", link:"https://huggingface.co/Qwen/Qwen3-1.7B", system:"你是一位谨慎的中文通用助手。先理解用户目标，再给出可执行、可核验的答复；不确定时明确指出。" },
  { id:"TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC", name:"TinyLlama", detail:"1.1B · Chat", kind:"极轻量模型", category:"global", tier:"light", brand:"TinyLlama / HF", initials:"TL", logo:LOGOS.huggingface, license:"Apache-2.0", vram:"0.70 GB", tag:"低资源", desc:"体积小、启动门槛较低，以英文任务更合适，中文能力有限。", link:"https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0", system:"You are a concise and helpful assistant. Prefer clear answers and admit uncertainty. Respond in the user's language when possible." },
  { id:"SmolLM2-360M-Instruct-q4f16_1-MLC", name:"SmolLM2", detail:"360M · Instruct", kind:"超轻量英文", category:"global", tier:"light", brand:"Hugging Face", initials:"HF", logo:LOGOS.huggingface, license:"Apache-2.0", vram:"0.38 GB", tag:"超轻量", desc:"特别小的开放模型，偏向英文短文本任务；设备需支持 shader-f16。", link:"https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct", system:"You are a small, helpful assistant. Prefer concise English answers. If a task is beyond your capability, say so plainly." },
  { id:"SmolLM2-1.7B-Instruct-q4f16_1-MLC", name:"SmolLM2", detail:"1.7B · Instruct", kind:"轻量通用", category:"global", tier:"light", brand:"Hugging Face", initials:"HF", logo:LOGOS.huggingface, license:"Apache-2.0", vram:"1.77 GB", tag:"多语言尝试", desc:"更大的 SmolLM2 版本，英文表现更稳；设备需支持 shader-f16。", link:"https://huggingface.co/HuggingFaceTB/SmolLM2-1.7B-Instruct", system:"You are a helpful assistant. Respond in the user's language when possible, keep answers grounded, and state uncertainty when needed." },
  { id:"Phi-4-mini-instruct-q4f16_1-MLC", name:"Phi-4 mini", detail:"3.8B · Instruct", kind:"多语言通用", category:"global", tier:"mid", brand:"Microsoft Phi", initials:"φ", logo:LOGOS.microsoft, license:"MIT", vram:"3.44 GB", tag:"中等显存", desc:"偏强的小型指令模型，内存开销更高，建议中高性能设备尝试。", link:"https://huggingface.co/microsoft/Phi-4-mini-instruct", system:"You are a careful assistant. Answer clearly and concisely, prefer verifiable claims, and acknowledge uncertainty." },
  { id:"Mistral-7B-Instruct-v0.3-q4f16_1-MLC", name:"Mistral", detail:"7B · Instruct", kind:"进阶通用", category:"global", tier:"heavy", brand:"Mistral AI", initials:"MI", logo:"https://cdn.simpleicons.org/mistralai/F2A13A", license:"Apache-2.0", vram:"4.57 GB", tag:"高显存", desc:"开放权重 7B 模型，适合尝试更复杂的任务；需支持 shader-f16。", link:"https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3", system:"You are a helpful, careful assistant. Respond in the user's language, structure answers clearly, and avoid inventing facts." },
  { id:"DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC", name:"DeepSeek R1", detail:"Distill · 7B", kind:"复杂问题 · 深度推理", category:"reasoning", tier:"heavy", brand:"DeepSeek", initials:"DS", logo:LOGOS.deepseek, license:"MIT", vram:"5.1 GB", tag:"高显存 · 进阶", heavy:true, desc:"蒸馏推理模型，适合多步骤问题；不建议老旧或内存紧张的设备。", link:"https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-7B", system:"你是一名谨慎的分析助手。面对复杂问题，先梳理条件并检查结论；回答时给出结论和可核验的理由或步骤摘要，不需要展示冗长的内部思考过程。" }
];

const $ = (selector) => document.querySelector(selector);
let modelCards = [];
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
let launchButton = $("#loadModel");
const chatForm = $("#chatForm");
const supportNote = $("#supportNote");

let selectedId = MODELS[0].id;
let engine = null;
let engineModelId = "";
let loading = false;
let generating = false;
let loadPromise = null;
let webgpuReady = false;
let chatHistory = [];
let currentFilter = "all";
let modelStates = new Map();

function selectedModel() {
  return MODELS.find((model) => model.id === selectedId) || MODELS[0];
}

function createLogoNode(model, className) {
  const node = document.createElement("span");
  node.className = className;
  node.title = model.brand;
  const image = document.createElement("img");
  image.src = model.logo;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  image.addEventListener("error", () => {
    image.remove();
    node.textContent = model.initials || "AI";
    node.classList.add("logo-fallback");
  }, { once: true });
  node.appendChild(image);
  return node;
}

function createModelCard(model) {
  const card = document.createElement("article");
  card.className = "model-card" + (model.featured ? " model-card-featured" : "") + (model.heavy ? " model-card-heavy" : "");
  card.dataset.modelId = model.id;
  card.dataset.category = model.category;
  card.dataset.tier = model.tier;
  card.classList.toggle("is-active", model.id === selectedId);

  const select = document.createElement("button");
  select.type = "button";
  select.className = "model-card-select";
  select.dataset.selectModelId = model.id;
  select.setAttribute("aria-pressed", String(model.id === selectedId));

  const top = document.createElement("span");
  top.className = "model-card-top";
  top.appendChild(createLogoNode(model, "model-logo"));
  const tag = document.createElement("span");
  tag.className = model.featured ? "recommend-tag" : (model.heavy ? "heavy-tag" : "type-tag");
  tag.textContent = model.tag;
  top.appendChild(tag);

  const name = document.createElement("span");
  name.className = "model-name";
  name.appendChild(document.createTextNode(model.name));
  const detail = document.createElement("small");
  detail.textContent = model.detail;
  name.appendChild(detail);

  const kind = document.createElement("span");
  kind.className = "model-type";
  kind.textContent = model.kind;
  const description = document.createElement("span");
  description.className = "model-desc";
  description.textContent = model.desc;
  const meta = document.createElement("span");
  meta.className = "model-meta";
  const license = document.createElement("span");
  license.textContent = model.license;
  const memory = document.createElement("span");
  memory.textContent = "显存 ≈ " + model.vram;
  meta.append(license, memory);
  select.append(top, name, kind, description, meta);
  select.addEventListener("click", () => selectModel(model.id));

  const actions = document.createElement("div");
  actions.className = "model-card-actions";
  const download = document.createElement("button");
  download.type = "button";
  download.className = "model-download";
  download.dataset.downloadModelId = model.id;
  download.title = "仅点击后才下载并加载这个模型";
  download.textContent = "↓ 下载";
  download.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    downloadModelForCard(model.id);
  });
  actions.appendChild(download);
  card.append(select, actions);
  return card;
}

function applyModelFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll(".model-filter").forEach((button) => {
    const active = button.dataset.filter === filter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  let visibleCount = 0;
  modelCards.forEach((card) => {
    const model = MODELS.find((item) => item.id === card.dataset.modelId);
    const visible = filter === "all"
      || (filter === "light" && model.tier === "light")
      || model.category === filter;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  $("#modelCount").textContent = (filter === "all" ? MODELS.length : visibleCount + " / " + MODELS.length) + " MODELS";
}

function renderModelCards() {
  const grid = $("#modelGrid");
  const fragment = document.createDocumentFragment();
  MODELS.forEach((model) => fragment.appendChild(createModelCard(model)));
  grid.replaceChildren(fragment);
  modelCards = Array.from(grid.querySelectorAll(".model-card"));
  $("#allModelCount").textContent = String(MODELS.length);
  applyModelFilter(currentFilter);
  updateSelectedModelDisplay();
  updateDownloadButtons();
}

function updateSelectedModelDisplay() {
  const model = selectedModel();
  const headerLogo = $("#chatModelLogo");
  if (headerLogo) {
    headerLogo.replaceChildren(createLogoNode(model, "selected-model-logo-image"));
    headerLogo.title = model.name + " · " + model.brand;
  }
}

function updateDownloadButtons() {
  document.querySelectorAll("[data-download-model-id]").forEach((button) => {
    const id = button.dataset.downloadModelId;
    const state = modelStates.get(id) || "idle";
    button.textContent = state === "loading" ? "加载中…" :
      state === "loaded" && id === engineModelId ? "已就绪" :
      state === "used" ? "再加载" :
      state === "error" ? "重试" : "↓ 下载";
    button.disabled = loading || generating || !webgpuReady;
    button.setAttribute("aria-label", (state === "idle" ? "下载并加载 " : "加载 ") + (MODELS.find((model) => model.id === id)?.name || "模型"));
  });
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
    const active = card.dataset.modelId === selectedId;
    card.classList.toggle("is-active", active);
    const select = card.querySelector("[data-select-model-id]");
    if (select) {
      select.disabled = locked;
      select.setAttribute("aria-pressed", String(active));
    }
  });
  if (launchButton) launchButton.disabled = locked || !webgpuReady;
  sendButton.disabled = locked || !webgpuReady;
  promptInput.disabled = locked || !webgpuReady;
  $("#clearChat").disabled = locked;
  document.querySelectorAll("[data-prompt]").forEach((button) => { button.disabled = locked; });
  updateDownloadButtons();
}

function addMessage(role, content) {
  if (role === "user") chatMessages.querySelector(".sleeping-bot")?.remove();
  const article = document.createElement("article");
  article.className = "message " + (role === "user" ? "message-user" : "message-assistant");
  const avatar = role === "user"
    ? document.createElement("span")
    : createLogoNode(selectedModel(), "message-avatar avatar-ai");
  avatar.setAttribute("aria-hidden", "true");
  if (role === "user") {
    avatar.className = "message-avatar avatar-user";
    avatar.textContent = "YOU";
  }
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
  updateSelectedModelDisplay();
  const model = selectedModel();
  const article = document.createElement("article");
  article.className = "message message-assistant welcome-message";
  const avatar = createLogoNode(model, "message-avatar avatar-ai");
  avatar.setAttribute("aria-hidden", "true");
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

  const sleeping = document.createElement("div");
  sleeping.className = "sleeping-bot";
  const bedImage = document.createElement("img");
  bedImage.src = "assets/ai-bed.webp";
  bedImage.alt = "";
  bedImage.loading = "eager";
  bedImage.decoding = "async";
  const bedLabel = document.createElement("strong");
  bedLabel.textContent = "AI 待机舱";
  const bedCaption = document.createElement("span");
  bedCaption.textContent = "还没开始聊，先在小床上眯一会儿。";
  sleeping.append(bedImage, bedLabel, bedCaption);
  chatMessages.appendChild(sleeping);
}

async function releaseEngine() {
  const oldEngine = engine;
  const oldModelId = engineModelId;
  engine = null;
  engineModelId = "";
  if (oldEngine && oldModelId) modelStates.set(oldModelId, "used");
  updateDownloadButtons();
  if (oldEngine && typeof oldEngine.unload === "function") {
    try { await oldEngine.unload(); } catch (error) { console.warn("释放模型时遇到提示：", error); }
  }
}

async function selectModel(id) {
  if (loading || generating || id === selectedId) return;
  loading = true;
  selectedId = id;
  updateSelectedModelDisplay();
  updateControls();
  setStatus("正在切换模型…", "is-loading");
  hideProgress();
  try {
    await releaseEngine();
    chatHistory = [];
    renderWelcome();
    setStatus("已选择 " + selectedModel().name + "，尚未加载");
  } finally {
    loading = false;
    updateControls();
  }
}

async function downloadModelForCard(id) {
  if (loading || generating) return;
  if (!webgpuReady) {
    setStatus("当前设备暂时不能加载本地模型", "is-error");
    supportNote.textContent = "需要支持 WebGPU 的浏览器与 GPU。选择模型不会下载；请先检查浏览器硬件加速和设备兼容性。";
    supportNote.classList.add("is-error");
    return;
  }
  try {
    if (id !== selectedId) await selectModel(id);
    if (loading || generating) return;
    if (engine && engineModelId === id) {
      setStatus(selectedModel().name + " 已就绪，可开始聊天", "is-ready");
      return;
    }
    modelStates.set(id, "loading");
    updateDownloadButtons();
    await loadModel();
  } catch (error) {
    modelStates.set(id, "error");
    updateDownloadButtons();
    console.warn("下载或加载模型失败：", error);
  }
}

async function loadModel() {
  if (engine && engineModelId === selectedId) return engine;
  if (loadPromise) return loadPromise;
  if (!webgpuReady) throw new Error("当前浏览器没有可用的 WebGPU 设备。请尝试最新版 Chrome 或 Edge，并确认设备支持硬件加速。");

  loading = true;
  modelStates.set(selectedId, "loading");
  updateControls();
  setStatus("正在下载并启动本地模型…", "is-loading");
  setProgress(0, "正在连接开源推理引擎…");

  loadPromise = (async () => {
    const webllm = await import("https://esm.run/@mlc-ai/web-llm@0.2.86");
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
    modelStates.set(modelId, "loaded");
    updateDownloadButtons();
    setProgress(1, "模型已准备就绪");
    setStatus(selectedModel().name + " 已就绪 · 推理在本地运行", "is-ready");
    window.setTimeout(hideProgress, 900);
    return engine;
  })();

  try {
    return await loadPromise;
  } catch (error) {
    modelStates.set(selectedId, "error");
    updateDownloadButtons();
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

const chatHead = document.querySelector(".chat-head");
const headAction = document.createElement("button");
headAction.type = "button";
headAction.className = "load-model-button head-load-button";
headAction.textContent = "加载模型";
headAction.addEventListener("click", () => loadModel().catch((error) => console.warn("模型启动失败：", error)));
chatHead.appendChild(headAction);
launchButton = headAction;
renderModelCards();
updateControls();
renderWelcome();
document.querySelectorAll(".model-filter").forEach((button) => {
  button.addEventListener("click", () => applyModelFilter(button.dataset.filter || "all"));
});
checkWebGPU();
