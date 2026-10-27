import { supabase, signInWithGoogle } from "../auth.js";
(() => {
"use strict";
const $ = id => document.getElementById(id);
const LOCAL_KEY = "ash:ai-news:favorites:v1";
const PAGE_SIZE = 12;
const L = {
zh:{
kicker:"GLOBAL SIGNAL · 全球 AI 情报",title:"AI，不止于头条。",lead:"追踪全球模型、研究与行业变化，也留一点位置给 AI 世界的抽象瞬间。",
stories:"条资讯",regions:"个地区",sources:"个来源",global:"🌐 全球视野",serious:"🧠 严肃科技",absurd:"🗿 抽象现场",auto:"↻ 自动更新",
recommended:"为你精选",latest:"最新",hot:"热门",shuffle:"随机探索",search:"搜索模型、公司、研究或关键词…",region:"地区",allRegions:"所有地区",time:"时间",allTime:"全部时间",last24:"最近 24 小时",last7:"最近 7 天",last14:"最近 14 天",
all:"全部",major:"重大事件",update:"模型与产品",research:"开源与研究",abstract:"AI 抽象区",featureOverline:"EDITOR'S SIGNAL",featureHeading:"今日焦点",featureNote:"重要内容先看一眼",feedOverline:"THE FEED",feedHeading:"全球动态",loading:"正在加载…",noResults:"暂时没有匹配的资讯",emptyHint:"试试其他关键词或地区。",clear:"清除筛选",more:"加载更多",end:"已经看到全部资讯",feedHint:"资讯来自公开来源，点击卡片查看原文。",disclaimer:"我们尽量核对来源和发布时间；新闻摘要仅供快速浏览，重要信息请以原文为准。",back:"返回 AI 新手导航 ↗",
majorBadge:"重大事件",updateBadge:"模型动态",researchBadge:"开源 / 研究",abstractBadge:"AI 抽象",globalRegion:"全球",unknownRegion:"其他地区",focus:"值得关注",read:"阅读原文 ↗",save:"收藏",saved:"已收藏",like:"点赞",liked:"已点赞",sourceFallback:"公开来源",genericExcerpt:"来自 {source} 的公开更新。点击查看原文与完整背景。",communityExcerpt:"来自全球开发者社区的讨论。点击查看原始讨论。",unknownDate:"时间待核实",justNow:"刚刚",mins:"分钟前",hours:"小时前",days:"天前",
syncAt:"内容更新于",syncFailed:"有来源同步异常",loadFailed:"新闻暂时无法加载",loadErrorHint:"请检查网络后重试。",retry:"重新加载",favoriteLocal:"已保存到此设备；登录后可同步到个人收藏。",favoriteCloud:"已加入个人收藏",favoriteRemoved:"已取消收藏",favoriteError:"收藏同步失败，请稍后重试。",loginForLike:"点赞需要登录，正在打开登录流程。",likeError:"点赞未成功，请稍后重试。",loginError:"登录暂时没有启动，请先点击页面顶部的登录按钮。",signedInSync:"个人收藏已同步",searchCount:"条结果",likes:"赞",official:"官方"
},
en:{
kicker:"GLOBAL SIGNAL · AI AROUND THE WORLD",title:"AI is more than headlines.",lead:"Track models, research and industry shifts worldwide, with a little room for the wonderfully absurd side of AI.",
stories:"stories",regions:"regions",sources:"sources",global:"🌐 Global view",serious:"🧠 Serious tech",absurd:"🗿 Absurd corner",auto:"↻ Auto-updated",
recommended:"For you",latest:"Latest",hot:"Popular",shuffle:"Explore",search:"Search models, companies, research or keywords…",region:"Region",allRegions:"All regions",time:"Time",allTime:"Any time",last24:"Past 24 hours",last7:"Past 7 days",last14:"Past 14 days",
all:"All",major:"Major events",update:"Models & products",research:"Open source & research",abstract:"AI absurdities",featureOverline:"EDITOR'S SIGNAL",featureHeading:"Today's focus",featureNote:"The important stuff, first",feedOverline:"THE FEED",feedHeading:"Global updates",loading:"Loading…",noResults:"No matching stories",emptyHint:"Try a different keyword or region.",clear:"Clear filters",more:"Load more",end:"You've seen all stories",feedHint:"Stories come from public sources. Open any card to read the original.",disclaimer:"We aim to verify source and publication time. Summaries are for scanning; check the original for important details.",back:"Back to AI Starter Hub ↗",
majorBadge:"Major",updateBadge:"Model update",researchBadge:"Open source / research",abstractBadge:"AI absurdity",globalRegion:"Global",unknownRegion:"Other",focus:"Worth a look",read:"Read source ↗",save:"Save",saved:"Saved",like:"Like",liked:"Liked",sourceFallback:"Public source",genericExcerpt:"A public update from {source}. Open the source for the full story and context.",communityExcerpt:"A discussion from the global developer community. Open the original thread.",unknownDate:"Time unverified",justNow:"Just now",mins:"m ago",hours:"h ago",days:"d ago",
syncAt:"Content updated",syncFailed:"Some sources failed to sync",loadFailed:"News could not be loaded",loadErrorHint:"Check your connection and try again.",retry:"Retry",favoriteLocal:"Saved on this device. Sign in to sync it with your personal collection.",favoriteCloud:"Added to your saved news",favoriteRemoved:"Removed from saved news",favoriteError:"Could not sync this save. Please try again.",loginForLike:"Likes require sign-in. Opening the sign-in flow.",likeError:"Like could not be saved. Please try again.",loginError:"Sign-in did not start. Use the sign-in button in the header.",signedInSync:"Personal collection synced",searchCount:"results",likes:"likes",official:"Official"
},
"zh-TW":{
kicker:"GLOBAL SIGNAL · 全球 AI 情報",title:"AI，不只頭條。",lead:"追蹤全球模型、研究與產業變化，也替 AI 世界的抽象瞬間留一個位置。",
stories:"則資訊",regions:"個地區",sources:"個來源",global:"🌐 全球視野",serious:"🧠 嚴肅科技",absurd:"🗿 抽象現場",auto:"↻ 自動更新",
recommended:"為你精選",latest:"最新",hot:"熱門",shuffle:"隨機探索",search:"搜尋模型、公司、研究或關鍵字…",region:"地區",allRegions:"所有地區",time:"時間",allTime:"全部時間",last24:"最近 24 小時",last7:"最近 7 天",last14:"最近 14 天",
all:"全部",major:"重大事件",update:"模型與產品",research:"開源與研究",abstract:"AI 抽象區",featureOverline:"EDITOR'S SIGNAL",featureHeading:"今日焦點",featureNote:"先看重要動態",feedOverline:"THE FEED",feedHeading:"全球動態",loading:"載入中…",noResults:"暫時沒有符合的資訊",emptyHint:"試試其他關鍵字或地區。",clear:"清除篩選",more:"載入更多",end:"已經看到全部資訊",feedHint:"資訊來自公開來源，點擊卡片查看原文。",disclaimer:"我們會盡量核對來源與發布時間；摘要僅供快速瀏覽，重要資訊請以原文為準。",back:"返回 AI 新手導航 ↗",
majorBadge:"重大事件",updateBadge:"模型動態",researchBadge:"開源 / 研究",abstractBadge:"AI 抽象",globalRegion:"全球",unknownRegion:"其他地區",focus:"值得關注",read:"閱讀原文 ↗",save:"收藏",saved:"已收藏",like:"讚",liked:"已按讚",sourceFallback:"公開來源",genericExcerpt:"來自 {source} 的公開更新。點擊查看原文與完整背景。",communityExcerpt:"來自全球開發者社群的討論。點擊查看原始討論。",unknownDate:"時間待核實",justNow:"剛剛",mins:"分鐘前",hours:"小時前",days:"天前",
syncAt:"內容更新於",syncFailed:"部分來源同步異常",loadFailed:"新聞暫時無法載入",loadErrorHint:"請檢查網路後重試。",retry:"重新載入",favoriteLocal:"已儲存到此裝置；登入後可同步至個人收藏。",favoriteCloud:"已加入個人收藏",favoriteRemoved:"已取消收藏",favoriteError:"收藏同步失敗，請稍後重試。",loginForLike:"按讚需要登入，正在開啟登入流程。",likeError:"按讚未成功，請稍後重試。",loginError:"登入暫時沒有啟動，請先點擊頁面頂部的登入按鈕。",signedInSync:"個人收藏已同步",searchCount:"則結果",likes:"讚",official:"官方"
}};
const state={items:[],payload:null,category:"all",region:"all",time:"all",mode:"recommended",query:"",visible:PAGE_SIZE,user:null,authLoaded:false,favorites:new Set(),likes:new Set(),likeCounts:new Map(),randomScores:new Map(),loading:false,dataLoaded:false};
let toastTimer=0;
const lang=()=>window.ASHI18n?.current?.()||"zh";
const t=key=>(L[lang()]||L.zh)[key]??L.zh[key]??key;
const safeUrl=value=>{try{const url=new URL(String(value||""),location.href);return /^https?:$/.test(url.protocol)?url.href:"";}catch{return "";}};
function localFavorites(){try{const items=JSON.parse(localStorage.getItem(LOCAL_KEY)||"[]");return Array.isArray(items)?items.filter(x=>x&&x.news_id&&x.title&&safeUrl(x.url)):[];}catch{return [];}}
function writeLocal(items){try{localStorage.setItem(LOCAL_KEY,JSON.stringify(items));}catch(error){console.warn("News favorites local write failed",error);}}
function toast(textValue){let node=$("newsToast");if(!node){node=document.createElement("div");node.id="newsToast";node.className="news-toast";node.setAttribute("role","status");document.body.append(node);}node.textContent=textValue;node.classList.add("is-visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>node.classList.remove("is-visible"),2800);}
function setText(id,value){const node=$(id);if(node)node.textContent=value;}
function regionOf(item){
 if(item.region)return String(item.region);
 const source=String(item.source||"").toLowerCase(),url=String(item.url||"").toLowerCase();
 if(source.includes("hacker news")||source.includes("hugging face"))return "Global";
 if(["openai","anthropic","google ai","nvidia","microsoft","meta ai"].some(x=>source.includes(x)))return "United States";
 if(url.includes(".cn/"))return "China";if(url.includes(".jp/"))return "Japan";return "Global";
}
function isResearch(item){const hay=[item.title,item.excerpt,item.source,item.url].join(" ").toLowerCase();return /open.?source|research|paper|arxiv|github|dataset|benchmark|hugging.?face|论文|开源|研究|数据集|基准测试|技术报告/.test(hay);}
function normalize(item,index){
 const url=safeUrl(item?.url);if(!item?.title||!url)return null;const ts=Date.parse(item.publishedAt||"");
 const out={id:String(item.id||"story-"+index),title:String(item.title).trim(),url,source:String(item.source||"Public Source"),publishedAt:Number.isFinite(ts)?new Date(ts).toISOString():"",type:["major","update","abstract"].includes(item.type)?item.type:"update",region:regionOf(item),excerpt:String(item.excerpt||"").slice(0,700),sourceKind:String(item.sourceKind||"public"),likeCount:0};
 out.research=isResearch(out);out.randomWeight=out.type==="major"?1.22:out.research?1.14:1;if(["India","Japan","South Korea","China","Africa","Latin America","Taiwan","Brazil","Singapore","Canada"].includes(out.region))out.randomWeight+=.08;if(out.type==="abstract")out.randomWeight+=.04;return out;
}
function regionLabel(value){
 const map={"Global":["全球","Global","全球"],"United States":["美国","United States","美國"],"China":["中国","China","中國"],"Japan":["日本","Japan","日本"],"South Korea":["韩国","South Korea","韓國"],"India":["印度","India","印度"],"United Kingdom":["英国","United Kingdom","英國"],"Europe":["欧洲","Europe","歐洲"],"Germany":["德国","Germany","德國"],"France":["法国","France","法國"],"Australia":["澳大利亚","Australia","澳洲"],"Canada":["加拿大","Canada","加拿大"],"Brazil":["巴西","Brazil","巴西"],"Singapore":["新加坡","Singapore","新加坡"],"Taiwan":["台湾","Taiwan","台灣"],"Global / Community":["全球社区","Global community","全球社群"]};
 const row=map[value];return row?row[lang()==="en"?1:lang()==="zh-TW"?2:0]:(value||t("unknownRegion"));
}
function relativeTime(iso){const time=Date.parse(iso||"");if(!Number.isFinite(time))return t("unknownDate");const mins=Math.max(0,Math.floor((Date.now()-time)/60000));if(mins<1)return t("justNow");if(mins<60)return mins+" "+t("mins");const hrs=Math.floor(mins/60);if(hrs<24)return hrs+" "+t("hours");const days=Math.floor(hrs/24);if(days<14)return days+" "+t("days");return new Intl.DateTimeFormat(lang()==="en"?"en-US":lang()==="zh-TW"?"zh-TW":"zh-CN",{month:"short",day:"numeric"}).format(new Date(time));}
function excerptFor(item){const value=String(item.excerpt||"").trim();if(/^来自 .+ 的公开更新，点击查看原文。$/.test(value))return t("genericExcerpt").replace("{source}",item.source);if(value.startsWith("Hacker News 社区讨论：")||value.startsWith("来自全球开发者社区的讨论。"))return t("communityExcerpt");return value||t("genericExcerpt").replace("{source}",item.source);}
function categoryLabel(item){if(item.type==="abstract")return t("abstractBadge");if(item.research)return t("researchBadge");if(item.type==="major")return t("majorBadge");return t("updateBadge");}
function setStatic(){
 const pairs=[["newsKicker","kicker"],["newsTitle","title"],["newsLead","lead"],["storiesLabel","stories"],["regionsLabel","regions"],["sourcesLabel","sources"],["chipGlobal","global"],["chipSerious","serious"],["chipAbsurd","absurd"],["chipAuto","auto"],["modeRecommended","recommended"],["modeLatest","latest"],["modeHot","hot"],["modeShuffle","shuffle"],["regionSelectLabel","region"],["timeSelectLabel","time"],["catAll","all"],["catMajor","major"],["catUpdate","update"],["catResearch","research"],["catAbstract","abstract"],["featureOverline","featureOverline"],["featureHeading","featureHeading"],["featureNote","featureNote"],["feedOverline","feedOverline"],["feedHeading","feedHeading"],["emptyTitle","noResults"],["emptyHint","emptyHint"],["clearFilters","clear"],["loadMore","more"],["feedFooterHint","feedHint"],["errorTitle","loadFailed"],["errorHint","loadErrorHint"],["retryNews","retry"],["newsDisclaimer","disclaimer"],["footerBack","back"]];
 pairs.forEach(([id,key])=>setText(id,t(key)));const search=$("newsSearch");if(search){search.placeholder=t("search");search.setAttribute("aria-label",t("search"));}rebuildSelects();updateSyncLabel();renderAll();
}
function rebuildSelects(){
 const rs=$("regionSelect"),ts=$("timeSelect");if(!rs||!ts)return;const currentRegion=state.region,currentTime=state.time;
 const vals=["all",...Array.from(new Set(state.items.map(x=>x.region))).sort((a,b)=>regionLabel(a).localeCompare(regionLabel(b),lang()))];
 rs.replaceChildren();vals.forEach(value=>{const option=document.createElement("option");option.value=value;option.textContent=value==="all"?t("allRegions"):regionLabel(value);rs.append(option);});rs.value=vals.includes(currentRegion)?currentRegion:"all";
 const opts=[["all","allTime"],["24h","last24"],["7d","last7"],["14d","last14"]];ts.replaceChildren();opts.forEach(([value,key])=>{const option=document.createElement("option");option.value=value;option.textContent=t(key);ts.append(option);});ts.value=currentTime;
}
function updateSyncLabel(){const node=$("lastSync");if(!node)return;const updated=Date.parse(state.payload?.updatedAt||"");const date=Number.isFinite(updated)?new Intl.DateTimeFormat(lang()==="en"?"en-US":lang()==="zh-TW"?"zh-TW":"zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(updated)):"";const errors=state.payload?.sourceStatus?.errors||[];node.textContent=(date?t("syncAt")+" "+date:"")+(errors.length?" · "+t("syncFailed")+" "+errors.length:"");node.title=errors.join("\n");}
async function loadLikeStats(){try{const result=await supabase.from("ai_news_like_stats").select("news_id,like_count");if(result.error)throw result.error;state.likeCounts=new Map((result.data||[]).map(x=>[x.news_id,Number(x.like_count||0)]));}catch(error){console.warn("Like statistics unavailable",error);state.likeCounts=new Map();}state.items.forEach(item=>item.likeCount=state.likeCounts.get(item.id)||0);}
async function loadFeed(){
 if(state.loading)return;state.loading=true;$("newsFeed").setAttribute("aria-busy","true");$("newsError").hidden=true;
 try{const response=await fetch("../data/ai-news.json",{cache:"no-store"});if(!response.ok)throw new Error("Feed HTTP "+response.status);const payload=await response.json(),seen=new Set();state.payload=payload;
 state.items=(Array.isArray(payload.items)?payload.items:[]).map(normalize).filter(Boolean).filter(item=>{if(seen.has(item.url))return false;seen.add(item.url);return true;});state.dataLoaded=true;
 state.randomScores=new Map(state.items.map(item=>[item.id,Math.pow(Math.random(),1/Math.max(.25,item.randomWeight))]));await loadLikeStats();rebuildSelects();updateSyncLabel();updateStats();renderAll();
 }catch(error){console.error("News feed failed",error);$("newsError").hidden=false;$("newsEmpty").hidden=true;}
 finally{state.loading=false;$("newsFeed").setAttribute("aria-busy","false");}
}
function updateStats(){setText("totalStories",state.items.length);setText("regionCount",new Set(state.items.map(x=>x.region)).size);setText("sourceCount",new Set(state.items.map(x=>x.source)).size);}
function hotScore(item){const age=Math.max(0,(Date.now()-(Date.parse(item.publishedAt)||0))/3600000);return item.likeCount*5+Math.max(0,10-age/16)+(item.type==="major"?1.5:0);}
function recommendScore(item){const age=(Date.now()-(Date.parse(item.publishedAt)||0))/3600000;let score=item.type==="major"?8:item.research?6:item.type==="abstract"?3:4;if(age<24)score+=3;else if(age<72)score+=2;else if(age<168)score+=1;score+=Math.min(1.5,item.likeCount*.08);if(item.sourceKind==="official")score+=.7;return score;}
function sorted(items){const rows=[...items];if(state.mode==="latest")return rows.sort((a,b)=>(Date.parse(b.publishedAt)||0)-(Date.parse(a.publishedAt)||0));if(state.mode==="hot")return rows.sort((a,b)=>hotScore(b)-hotScore(a));if(state.mode==="shuffle")return rows.sort((a,b)=>(state.randomScores.get(b.id)||0)-(state.randomScores.get(a.id)||0));return rows.sort((a,b)=>recommendScore(b)-recommendScore(a));}
function matches(item){
 if(state.category==="major"&&item.type!=="major")return false;if(state.category==="update"&&(item.type!=="update"||item.research))return false;if(state.category==="research"&&!item.research)return false;if(state.category==="abstract"&&item.type!=="abstract")return false;
 if(state.region!=="all"&&item.region!==state.region)return false;
 if(state.time!=="all"){const date=Date.parse(item.publishedAt);if(!Number.isFinite(date))return false;const age=Date.now()-date,limit=state.time==="24h"?86400000:state.time==="7d"?604800000:1209600000;if(age>limit)return false;}
 if(state.query&&!([item.title,item.excerpt,item.source,item.region,item.url].join(" ").toLowerCase().includes(state.query.toLowerCase())))return false;return true;
}
function makeBadge(value,kind){const node=document.createElement("span");node.className="news-badge"+(kind?" "+kind:"");node.textContent=value;return node;}
function renderFeatured(item){
 const host=$("featuredStory");host.replaceChildren();if(!item)return;
 const copy=document.createElement("div");copy.className="featured-copy";const tag=document.createElement("span");tag.className="featured-eyebrow";const dot=document.createElement("span");dot.className="eyebrow-dot";tag.append(dot,document.createTextNode(item.type==="abstract"?t("abstractBadge"):t("focus")));
 const title=document.createElement("h3");title.textContent=item.title;const desc=document.createElement("p");desc.textContent=excerptFor(item);const meta=document.createElement("div");meta.className="featured-meta";
 [item.source,regionLabel(item.region),relativeTime(item.publishedAt)].forEach((value,index)=>{const span=document.createElement("span");span.textContent=(index===0?"◈ ":index===1?"◎ ":"◷ ")+value;meta.append(span);});copy.append(tag,title,desc,meta);
 const visual=document.createElement("div");visual.className="featured-visual";const glyph=document.createElement("div");glyph.className="featured-glyph";glyph.textContent=item.type==="abstract"?"✳":item.research?"⌘":"✦";
 const note=document.createElement("span");note.className="featured-side-note";note.textContent=String(item.region||"GLOBAL").toUpperCase();const open=document.createElement("a");open.className="featured-open";open.href=safeUrl(item.url)||"#";open.target="_blank";open.rel="noopener noreferrer";open.textContent=t("read");visual.append(glyph,note,open);host.append(copy,visual);
}
function renderCard(item){
 const card=document.createElement("article");card.className="news-card"+(item.type==="abstract"?" is-abstract":"")+(item.type==="major"?" is-featured":"");
 const top=document.createElement("div");top.className="news-card-top";const badges=document.createElement("div");badges.className="news-card-badges";badges.append(makeBadge(categoryLabel(item),item.type==="abstract"?"abstract":item.research?"research":item.type),makeBadge(regionLabel(item.region),"region"));if(item.sourceKind==="official")badges.append(makeBadge("✓ "+t("official"),""));top.append(badges);
 const title=document.createElement("a");title.className="news-card-title";title.textContent=item.title;title.href=safeUrl(item.url)||"#";title.target="_blank";title.rel="noopener noreferrer";const excerpt=document.createElement("p");excerpt.className="news-card-excerpt";excerpt.textContent=excerptFor(item);
 const meta=document.createElement("div");meta.className="news-card-meta";const source=document.createElement("span");source.className="source-name";source.textContent=item.source||t("sourceFallback");const dot=document.createElement("span");dot.textContent="·";const time=document.createElement("span");time.textContent=relativeTime(item.publishedAt);const spacer=document.createElement("span");spacer.className="meta-spacer";const count=document.createElement("span");count.textContent="♥ "+(state.likeCounts.get(item.id)||0)+" "+t("likes");meta.append(source,dot,time,spacer,count);
 const actions=document.createElement("div");actions.className="news-card-actions";const saved=state.favorites.has(item.id);const fav=document.createElement("button");fav.type="button";fav.className="news-action favorite-action"+(saved?" is-active":"");fav.setAttribute("aria-pressed",String(saved));fav.setAttribute("aria-label",(saved?t("saved"):t("save"))+": "+item.title);const favIcon=document.createElement("span");favIcon.className="action-icon";favIcon.textContent=saved?"★":"☆";const favLabel=document.createElement("span");favLabel.textContent=saved?t("saved"):t("save");fav.append(favIcon,favLabel);fav.addEventListener("click",()=>toggleFavorite(item));
 const liked=state.likes.has(item.id);const like=document.createElement("button");like.type="button";like.className="news-action like-action"+(liked?" is-active":"");like.setAttribute("aria-pressed",String(liked));like.setAttribute("aria-label",(liked?t("liked"):t("like"))+": "+item.title);const likeIcon=document.createElement("span");likeIcon.className="action-icon";likeIcon.textContent=liked?"♥":"♡";const likeLabel=document.createElement("span");likeLabel.textContent=liked?t("liked"):t("like");like.append(likeIcon,likeLabel);like.addEventListener("click",()=>toggleLike(item));
 const open=document.createElement("a");open.className="news-action open-source";open.href=safeUrl(item.url)||"#";open.target="_blank";open.rel="noopener noreferrer";open.textContent=t("read");actions.append(fav,like,open);card.append(top,title,excerpt,meta,actions);return card;
}
function renderAll(){
 const rows=sorted(state.items.filter(matches));const featured=rows.find(x=>x.type==="major")||rows.find(x=>x.type!=="abstract")||rows[0];
 if(!state.dataLoaded){$("resultCount").textContent=t("loading");return;}
 $("featureSection").hidden=!featured||state.category==="abstract";renderFeatured(featured);const visible=rows.slice(0,state.visible);const feed=$("newsFeed");feed.replaceChildren();visible.forEach(item=>feed.append(renderCard(item)));
 $("newsEmpty").hidden=rows.length>0;$("resultCount").textContent=rows.length+" "+t("searchCount");$("loadMore").hidden=rows.length===0;$("loadMore").disabled=visible.length>=rows.length;$("loadMore").textContent=visible.length>=rows.length?t("end"):t("more");
 document.querySelectorAll(".news-mode").forEach(button=>{const active=button.dataset.mode===state.mode;button.classList.toggle("is-active",active);button.setAttribute("aria-selected",String(active));});
 document.querySelectorAll(".news-category-tabs [data-category]").forEach(button=>button.classList.toggle("is-active",button.dataset.category===state.category));updateSyncLabel();
}
async function toggleFavorite(item){
 if(state.favorites.has(item.id)){
  if(state.user){const result=await supabase.from("ai_news_favorites").delete().eq("user_id",state.user.id).eq("news_id",item.id);if(result.error){console.warn(result.error);toast(t("favoriteError"));return;}}
  else writeLocal(localFavorites().filter(x=>x.news_id!==item.id));
  state.favorites.delete(item.id);toast(t("favoriteRemoved"));
 }else{
  if(state.user){const result=await supabase.from("ai_news_favorites").insert({user_id:state.user.id,news_id:item.id,title:item.title,url:item.url,source:item.source,region:item.region,type:item.type,published_at:item.publishedAt||null});if(result.error){console.warn(result.error);toast(t("favoriteError"));return;}}
  else{const saved=localFavorites().filter(x=>x.news_id!==item.id);saved.unshift({news_id:item.id,title:item.title,url:item.url,source:item.source,region:item.region,type:item.type,published_at:item.publishedAt||null,saved_at:new Date().toISOString()});writeLocal(saved);}
  state.favorites.add(item.id);toast(state.user?t("favoriteCloud"):t("favoriteLocal"));
 }
 renderAll();
}
async function toggleLike(item){
 if(!state.user){toast(t("loginForLike"));try{await signInWithGoogle({redirectTo:location.href});}catch(error){console.warn(error);toast(t("loginError"));}return;}
 const had=state.likes.has(item.id);const result=had?await supabase.from("ai_news_likes").delete().eq("user_id",state.user.id).eq("news_id",item.id):await supabase.from("ai_news_likes").insert({user_id:state.user.id,news_id:item.id});
 if(result.error){console.warn(result.error);toast(t("likeError"));return;}if(had)state.likes.delete(item.id);else state.likes.add(item.id);await loadLikeStats();renderAll();
}
async function syncLocalFavorites(user,cloudIds){
 const local=localFavorites();if(!local.length)return cloudIds;let complete=true;
 for(const item of local){if(cloudIds.has(item.news_id))continue;const url=safeUrl(item.url);if(!url){complete=false;continue;}
 const result=await supabase.from("ai_news_favorites").insert({user_id:user.id,news_id:String(item.news_id),title:String(item.title),url,source:String(item.source||"Public Source"),region:String(item.region||"Global"),type:["major","update","abstract"].includes(item.type)?item.type:"update",published_at:item.published_at||null});
 if(result.error&&result.error.code!=="23505"){complete=false;console.warn("News favorite merge failed",result.error);}else cloudIds.add(item.news_id);}
 if(complete){writeLocal([]);toast(t("signedInSync"));}else toast(t("favoriteError"));return cloudIds;
}
async function loadUserData(user){
 if(!user){state.favorites=new Set(localFavorites().map(x=>String(x.news_id)));state.likes.clear();renderAll();return;}
 const uid=user.id;const result=await Promise.all([supabase.from("ai_news_favorites").select("news_id").eq("user_id",uid),supabase.from("ai_news_likes").select("news_id").eq("user_id",uid)]);
 if(result[0].error){console.warn("News favorite read failed",result[0].error);state.favorites=new Set(localFavorites().map(x=>String(x.news_id)));}else state.favorites=await syncLocalFavorites(user,new Set((result[0].data||[]).map(x=>x.news_id)));
 if(result[1].error){console.warn("News likes read failed",result[1].error);state.likes.clear();}else state.likes=new Set((result[1].data||[]).map(x=>x.news_id));
 if(state.user?.id===uid)renderAll();
}
async function handleSession(session){const user=session?.user||null;if(state.authLoaded&&(state.user?.id||null)===(user?.id||null))return;state.user=user;state.authLoaded=true;if(user)await loadUserData(user);else{state.favorites=new Set(localFavorites().map(x=>String(x.news_id)));state.likes.clear();renderAll();}}
function clearFilters(){state.category="all";state.region="all";state.time="all";state.query="";state.visible=PAGE_SIZE;$("newsSearch").value="";$("regionSelect").value="all";$("timeSelect").value="all";renderAll();}
function bind(){
 document.querySelectorAll(".news-mode").forEach(button=>button.addEventListener("click",()=>{state.mode=button.dataset.mode;state.visible=PAGE_SIZE;renderAll();}));
 document.querySelectorAll(".news-category-tabs [data-category]").forEach(button=>button.addEventListener("click",()=>{state.category=button.dataset.category;state.visible=PAGE_SIZE;renderAll();}));
 $("newsSearch").addEventListener("input",event=>{state.query=event.target.value.trim();state.visible=PAGE_SIZE;renderAll();});$("regionSelect").addEventListener("change",event=>{state.region=event.target.value;state.visible=PAGE_SIZE;renderAll();});$("timeSelect").addEventListener("change",event=>{state.time=event.target.value;state.visible=PAGE_SIZE;renderAll();});$("loadMore").addEventListener("click",()=>{state.visible+=PAGE_SIZE;renderAll();});$("clearFilters").addEventListener("click",clearFilters);$("retryNews").addEventListener("click",loadFeed);
 window.addEventListener("ash:language-changed",setStatic);window.addEventListener("storage",event=>{if(event.key===LOCAL_KEY&&!state.user){state.favorites=new Set(localFavorites().map(x=>String(x.news_id)));renderAll();}});
 document.addEventListener("keydown",event=>{if(event.key==="/"&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||"")){event.preventDefault();$("newsSearch").focus();}});
}
setStatic();bind();loadFeed();supabase.auth.onAuthStateChange((_event,session)=>{queueMicrotask(()=>handleSession(session));});supabase.auth.getSession().then(({data,error})=>{if(error){console.warn("News session unavailable",error);handleSession(null);}else handleSession(data.session);}).catch(error=>{console.warn("News session unavailable",error);handleSession(null);});
})();