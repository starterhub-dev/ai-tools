#!/usr/bin/env node
/**
 * AI NOW public-source collector.
 * No API keys, no database, no third-party npm packages.
 *
 * Sources are intentionally limited to public pages/APIs that are useful for
 * AI news and community stories. Network search in the main site is untouched.
 */

import { writeFile } from "node:fs/promises";

const OUTPUT = "data/ai-news.json";

const SOURCE_DEFS = [
  { id:"openai", name:"OpenAI", url:"https://openai.com/news/", kind:"official", region:"United States", weight:1.0, match:/openai|chatgpt|codex|model|gpt|agent|ai/i },
  { id:"anthropic", name:"Anthropic", url:"https://www.anthropic.com/news", kind:"official", region:"United States", weight:1.0, match:/anthropic|claude|agent|ai|model/i },
  { id:"google-ai", name:"Google AI", url:"https://blog.google/innovation-and-ai/technology/ai/", kind:"official", region:"United States", weight:0.95, match:/ai|gemini|agent|model|research/i },
  { id:"huggingface", name:"Hugging Face", url:"https://huggingface.co/blog", kind:"community", region:"Global", weight:0.9, match:/ai|agent|model|llm|open source|llama|qwen|mcp|coding|robot/i },
  { id:"hackernews", name:"Hacker News", url:"https://hn.algolia.com/", kind:"community", region:"Global", weight:0.8, api:"https://hn.algolia.com/api/v1/search_by_date?query=AI&tags=story&hitsPerPage=30" },
  { id:"nvidia-ai", name:"NVIDIA AI", url:"https://blogs.nvidia.com/blog/category/generative-ai/feed/", kind:"official", region:"United States", weight:0.86, feed:true },
  { id:"microsoft-ai", name:"Microsoft AI", url:"https://blogs.microsoft.com/ai/feed/", kind:"official", region:"United States", weight:0.84, feed:true },
  { id:"arxiv-ai", name:"arXiv cs.AI", url:"https://export.arxiv.org/rss/cs.AI", kind:"research", region:"Global", weight:0.9, feed:true },
  { id:"news-us", name:"Google News · US", url:"https://news.google.com/rss/search?q=artificial+intelligence+AI&hl=en-US&gl=US&ceid=US:en", kind:"regional", region:"United States", weight:0.76, feed:true },
  { id:"news-china", name:"Google News · China", url:"https://news.google.com/rss/search?q=%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD+%E5%A4%A7%E6%A8%A1%E5%9E%8B&hl=zh-CN&gl=CN&ceid=CN:zh-Hans", kind:"regional", region:"China", weight:0.76, feed:true },
  { id:"news-japan", name:"Google News · Japan", url:"https://news.google.com/rss/search?q=%E7%94%9F%E6%88%90AI+AI&hl=ja&gl=JP&ceid=JP:ja", kind:"regional", region:"Japan", weight:0.76, feed:true },
  { id:"news-korea", name:"Google News · South Korea", url:"https://news.google.com/rss/search?q=%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5+AI&hl=ko&gl=KR&ceid=KR:ko", kind:"regional", region:"South Korea", weight:0.72, feed:true },
  { id:"news-india", name:"Google News · India", url:"https://news.google.com/rss/search?q=artificial+intelligence+India&hl=en-IN&gl=IN&ceid=IN:en", kind:"regional", region:"India", weight:0.72, feed:true },
  { id:"news-uk", name:"Google News · UK", url:"https://news.google.com/rss/search?q=artificial+intelligence+AI&hl=en-GB&gl=GB&ceid=GB:en", kind:"regional", region:"United Kingdom", weight:0.72, feed:true },
  { id:"news-germany", name:"Google News · Germany", url:"https://news.google.com/rss/search?q=K%C3%BCnstliche+Intelligenz+AI&hl=de&gl=DE&ceid=DE:de", kind:"regional", region:"Germany", weight:0.7, feed:true },
  { id:"news-france", name:"Google News · France", url:"https://news.google.com/rss/search?q=intelligence+artificielle&hl=fr&gl=FR&ceid=FR:fr", kind:"regional", region:"France", weight:0.7, feed:true },
  { id:"news-australia", name:"Google News · Australia", url:"https://news.google.com/rss/search?q=artificial+intelligence&hl=en-AU&gl=AU&ceid=AU:en", kind:"regional", region:"Australia", weight:0.68, feed:true }
];

const MAX_ITEMS = 80;
const KEEP_DAYS = 14;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function cleanText(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function absoluteUrl(base, href) {
  try {
    const url = new URL(href, base);
    if (!/^https?:$/.test(url.protocol)) return "";
    return url.toString();
  } catch {
    return "";
  }
}

function stripTracking(url) {
  try {
    const u = new URL(url);
    [
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
      "utm_id", "gclid", "fbclid", "src", "source"
    ].forEach(key => u.searchParams.delete(key));
    u.hash = "";
    return u.toString();
  } catch {
    return url;
  }
}

function canonicalId(url, title) {
  const base = stripTracking(url).toLowerCase();
  let hash = 2166136261;
  for (const ch of base || title) {
    hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
  }
  return `news-${(hash >>> 0).toString(36)}`;
}

function parseDate(value) {
  if (!value) return null;
  const match = value.match(
    /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}|\d{4}-\d{2}-\d{2}/i
  );
  if (!match) return null;
  const parsed = new Date(match[0]);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function classify(title, summary, source) {
  const text = `${title} ${summary}`.toLowerCase();

  if (
    /(agent said it was done|database disagreed|open source hell|bug-fixing agent|\bcat\b|absurd|weird|funny|hell|chaos|AI fail|wtf|meme|shitpost)/i.test(text)
  ) return { type: "abstract", label: "🗿 AI 抽象" };

  if (
    /(invest|acqui|fund|launch|release|introduc|model|gpt|claude|gemini|breakthrough|partnership|policy|research)/i.test(text)
  ) return { type: "major", label: "🔴 AI 大事" };

  return { type: "update", label: "🟣 AI 动态" };
}

function looksUseful(title, href, source) {
  if (!title || title.length < 18 || title.length > 180) return false;
  const normalized = title.toLowerCase();
  const blocked = [
    "skip to", "privacy", "terms", "sign up", "log in", "learn more",
    "view all", "load more", "careers", "pricing", "support", "contact",
    "home", "search"
  ];
  if (blocked.some(word => normalized === word || normalized.startsWith(word + " "))) return false;

  const url = href.toLowerCase();
  if (source === "Google AI" || source === "OpenAI" || source === "Anthropic" || source === "Hugging Face") {
    return /ai|model|agent|gpt|claude|gemini|llm|open source|coding|research|developer/i.test(`${title} ${url}`);
  }
  return true;
}

function extractAnchors(html, baseUrl, sourceDef) {
  const items = [];
  const re = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = re.exec(html))) {
    const href = absoluteUrl(baseUrl, match[1]);
    const title = cleanText(match[2]);
    if (!href || !looksUseful(title, href, sourceDef.name)) continue;

    const around = html.slice(Math.max(0, match.index - 700), Math.min(html.length, match.index + match[0].length + 700));
    const publishedAt = parseDate(cleanText(around));
    const lower = href.toLowerCase();

    if (sourceDef.id === "openai" && !lower.includes("openai.com/")) continue;
    if (sourceDef.id === "anthropic" && !lower.includes("anthropic.com/news/")) continue;
    if (sourceDef.id === "google-ai" && !lower.includes("blog.google/")) continue;
    if (sourceDef.id === "huggingface" && !lower.includes("huggingface.co/blog/")) continue;

    const classification = classify(title, "", sourceDef.name);
    items.push({
      id: canonicalId(href, title),
      type: classification.type,
      label: classification.label,
      title,
      excerpt: `${title}。来自 ${sourceDef.name} 的公开更新，点击查看原文。`,
      source: sourceDef.name,
      url: stripTracking(href),
      publishedAt: publishedAt || "",
      sourceKind: sourceDef.kind,
      region: sourceDef.region || "Global",
      score: 45 * sourceDef.weight + (classification.type === "abstract" ? 12 : classification.type === "major" ? 20 : 8)
    });
  }
  return items;
}

function rank(items) {
  return [...items].sort((a, b) => {
    const scoreDiff = Number(b.score || 0) - Number(a.score || 0);
    if (scoreDiff) return scoreDiff;
    return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
  });
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "AI-Starter-Hub-NewsBot/1.0 (public-source aggregation)",
      "accept": "application/json"
    },
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "AI-Starter-Hub-NewsBot/1.0 (public-source aggregation)",
      "accept": "text/html,application/xhtml+xml,application/rss+xml,application/atom+xml,application/xml"
    },
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return response.text();
}

function xmlValue(block, names) {
  for (const name of names) {
    const escaped = name.replace(":", "\\:");
    const element = new RegExp("<" + escaped + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + escaped + ">", "i");
    const match = block.match(element);
    if (match) {
      return match[1]
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
        .replace(/<[^>]*>/g, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&apos;|&#39;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
        .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
        .replace(/\s+/g, " ")
        .trim();
    }
  }
  return "";
}

function extractFeedItems(xml, sourceDef) {
  const blocks = xml.match(/<(?:item|entry)\b[^>]*>[\s\S]*?<\/(?:item|entry)>/gi) || [];
  return blocks.slice(0, 50).map(block => {
    const title = cleanText(xmlValue(block, ["title"]));
    const linkMatch = block.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*\/?\s*>/i);
    const linkText = xmlValue(block, ["link"]);
    const rawUrl = linkMatch ? linkMatch[1] : linkText;
    const url = stripTracking(absoluteUrl(sourceDef.url, rawUrl));
    const dateText = xmlValue(block, ["pubDate", "published", "updated", "dc:date", "date"]);
    const date = Date.parse(dateText);
    const publishedAt = Number.isFinite(date) ? new Date(date).toISOString() : "";
    const excerpt = cleanText(xmlValue(block, ["description", "summary", "content:encoded"])).slice(0, 260);
    const publisher = cleanText(xmlValue(block, ["source"])) || sourceDef.name;
    const classification = classify(title, excerpt, sourceDef.name);
    return {
      id: canonicalId(url, title),
      type: classification.type,
      label: classification.label,
      title,
      excerpt: excerpt || (sourceDef.name + " public update: " + title),
      source: publisher,
      url,
      publishedAt,
      sourceKind: sourceDef.kind,
      region: sourceDef.region || "Global",
      score: 43 * sourceDef.weight + (classification.type === "abstract" ? 12 : classification.type === "major" ? 18 : 8)
    };
  }).filter(item => item.title && item.url && item.publishedAt && looksUseful(item.title, item.url, sourceDef.name));
}

async function collectSource(sourceDef) {
  if (sourceDef.feed) {
    const xml = await fetchText(sourceDef.url);
    return extractFeedItems(xml, sourceDef);
  }
  if (sourceDef.api) {
    const payload = await fetchJson(sourceDef.api);
    return (payload.hits || []).map(hit => {
      const title = cleanText(hit.title || hit.story_title || "");
      const url = stripTracking(hit.url || hit.story_url || `https://news.ycombinator.com/item?id=${hit.objectID}`);
      const classification = classify(title, cleanText(hit.story_text || ""), sourceDef.name);
      return {
        id: canonicalId(url, title),
        type: classification.type,
        label: classification.label,
        title,
        excerpt: cleanText(hit.story_text || "") || `Hacker News 社区讨论：${title}`,
        source: sourceDef.name,
        url,
        publishedAt: hit.created_at || "",
        sourceKind: sourceDef.kind,
        region: sourceDef.region || "Global",
        score: 35 * sourceDef.weight + Number(hit.points || 0) * 0.12 + (classification.type === "abstract" ? 18 : 0)
      };
    }).filter(item => looksUseful(item.title, item.url, sourceDef.name));
  }

  const html = await fetchText(sourceDef.url);
  return extractAnchors(html, sourceDef.url, sourceDef);
}

function dedupe(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = item.url || item.title.toLowerCase().replace(/\W+/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function withinWindow(item) {
  const time = new Date(item.publishedAt).getTime();
  if (!Number.isFinite(time)) return false;
  if (time > Date.now() + 86400000) return false;
  return Date.now() - time <= KEEP_DAYS * 86400000;
}

async function readExisting() {
  try {
    const text = await (await import("node:fs/promises")).readFile(OUTPUT, "utf8");
    const data = JSON.parse(text);
    return Array.isArray(data.items) ? data : { items: [] };
  } catch {
    return { items: [] };
  }
}

const fetchedAt = new Date().toISOString();
const errors = [];
const all = [];

for (const source of SOURCE_DEFS) {
  try {
    const collected = await collectSource(source);
    all.push(...collected);
    console.log(`[${source.name}] collected ${collected.length}`);
  } catch (error) {
    errors.push(`${source.name}: ${error.message}`);
    console.warn(`[${source.name}] skipped: ${error.message}`);
  }
  await sleep(250);
}

const existing = await readExisting();
const existingByUrl = new Map((existing.items || []).map(item => [stripTracking(String(item.url || "")), item]));

const merged = dedupe([...all, ...(existing.items || [])])
  .filter(item => withinWindow({
    ...item,
    publishedAt: item.publishedAt || existingByUrl.get(stripTracking(String(item.url || "")))?.publishedAt || ""
  }))
  .map(item => {
    const prior = existingByUrl.get(stripTracking(String(item.url || "")));
    return {
      id: item.id || prior?.id || canonicalId(item.url, item.title),
      type: item.type || prior?.type || "update",
      label: item.label || prior?.label || "🟣 AI 动态",
      title: String(item.title || prior?.title || "").trim(),
      excerpt: String(item.excerpt || prior?.excerpt || "").trim().slice(0, 260),
      source: String(item.source || prior?.source || "Public Source"),
      url: stripTracking(String(item.url || prior?.url || "")),
      publishedAt: item.publishedAt || prior?.publishedAt || "",
      sourceKind: item.sourceKind || prior?.sourceKind || "community",
      region: item.region || prior?.region || "Global",
      score: Number(item.score ?? prior?.score ?? 0)
    };
  })
  .filter(item => item.title && item.url);

if (!all.length && !(existing.items || []).length) {
  throw new Error("All news sources failed and no existing feed is available.");
}

const ranked = rank(merged).slice(0, MAX_ITEMS);
const stableItems = ranked.map(({score, ...item}) => item);
const previousStableItems = (existing.items || []).map(({score, ...item}) => item);
const sourceStatus = {
  checked: SOURCE_DEFS.map(source => source.name),
  errors
};
const itemsChanged = JSON.stringify(stableItems) !== JSON.stringify(previousStableItems);
const sourceStatusChanged = JSON.stringify(sourceStatus) !== JSON.stringify(existing.sourceStatus || {});

if (!itemsChanged && !sourceStatusChanged) {
  console.log("No feed or source-status changes; keeping the existing feed untouched.");
} else {
  const output = {
    version: 1,
    updatedAt: itemsChanged ? fetchedAt : (existing.updatedAt || fetchedAt),
    sourceStatus,
    items: stableItems
  };
  await writeFile(OUTPUT, JSON.stringify(output, null, 2) + "\n", "utf8");
  console.log(`Wrote ${stableItems.length} news items to data/ai-news.json`);
}

if (errors.length) {
  console.warn(`Source warnings: ${errors.join(" | ")}`);
}
