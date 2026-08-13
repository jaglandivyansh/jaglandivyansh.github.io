// ── UTILITY: TRIGGER REVEAL ANIMATION ──
function triggerReveal(container) {
  if (!container) return;
  var items = container.querySelectorAll(".news-card, .ca-card, .reveal-item");
  items.forEach(function(item, i) {
    item.style.opacity = "0";
    item.style.transform = "translateY(16px)";
    item.style.transition = "opacity 0.35s ease " + (i * 0.07) + "s, transform 0.35s ease " + (i * 0.07) + "s";
    setTimeout(function() {
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    }, 20);
  });
}

// ── SARVAM AI TUTOR MODAL ──

function openSarvamAIModal(questionText, optionsArr, correctIndex, subject) {
  var overlay = el("div", {
    css: {
      position: "fixed", inset: "0", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: "10000"
    }
  });

  var card = el("div", {
    cls: "glass-modal", 
    css: {
      border: "1px solid var(--border2)", 
      borderRadius: "18px",
      padding: "26px", 
      maxWidth: "500px", 
      width: "90%", 
      boxShadow: "0 24px 60px rgba(0,0,0,0.4)"
    }
  });

  var header = el("div", {css:{display:"flex", justifyContent:"space-between", marginBottom:"16px"}});
  header.appendChild(el("h3", {css:{margin:0, color:"var(--text)", fontFamily:"var(--font-display)"}, txt: "💡 AI Tutor Analysis"}));
  var closeBtn = el("button", {css:{background:"none", border:"none", color:"var(--subtle)", cursor:"pointer", fontSize:"1.2rem"}, txt:"✕", onclick: () => document.body.removeChild(overlay)});
  header.appendChild(closeBtn);
  card.appendChild(header);

  var contentArea = el("div", {css:{fontSize:"0.95rem", color:"var(--text)", lineHeight:"1.6", maxHeight:"60vh", overflowY:"auto"}});
  contentArea.innerHTML = "<div style='text-align:center; padding: 20px; color: var(--muted);'>Analyzing problem...</div>";
  card.appendChild(contentArea);
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  var correctAns = optionsArr ? optionsArr[correctIndex] : "Not provided";
  
  // Ekdum seedha instruction
  var prompt = `Give a direct 1-2 sentence explanation of why "${correctAns}" is the correct answer for this ${subject} question: "${questionText}". Do not include any brainstorming steps. Start directly with the explanation.`;

  fetch("api/tutor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "sarvam-30b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.0, 
      max_tokens: 300 
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.choices && data.choices[0] && data.choices[0].message) {
      let mainContent = data.choices[0].message.content || data.choices[0].message.reasoning_content || "";

      if (mainContent.includes("1. ") || mainContent.includes("Analyze")) {
        var parts = mainContent.split(/\n\n/);
        mainContent = parts[parts.length - 1];
      }

      contentArea.style.color = "var(--text)"; // Text color ensure karne ke liye
      contentArea.innerText = mainContent.trim() || "No clear answer returned.";
    } 
    else if (data.answer) {
      contentArea.style.color = "var(--text)";
      contentArea.innerText = data.answer;
    }
    else if (data.error) {
      contentArea.innerText = "Error: " + data.error;
    } 
    else {
      contentArea.innerText = "The AI is thinking... please try again in a second.";
    }
  })
  .catch(err => {
    contentArea.innerText = "Connection lost. Please check your internet.";
  });
}

// ========================================
// LIVE DAILY CURRENT AFFAIRS — RSS SYSTEM
// ========================================

const CA_TABS = [
  { id: 'national',  label: '🇮🇳 National',       color: '#4F8EF7' },
  { id: 'world',     label: '🌐 International',  color: '#f87171' },
  { id: 'polity',    label: '⚖️ Polity & Law',   color: '#dc2626' },
  { id: 'economy',   label: '📈 Economy',        color: '#f59e0b' },
  { id: 'envgeo',    label: '🌍 Env & Geo',      color: '#16a34a' },
  { id: 'heritage',  label: '🛕 Heritage',       color: '#7c3aed' },
  { id: 'scitech',   label: '🚀 Sci & Tech',     color: '#6366f1' },
  { id: 'sports',    label: '🏆 Sports',         color: '#ec4899' },
  { id: 'misc',      label: '🎖️ Misc & Awards',  color: '#14b8a6' }
];

// rss2json base — free, no key, works directly from browser sandbox
const R2J = 'https://api.rss2json.com/v1/api.json?rss_url=';

// Consolidated High-Volume Feeds 
// Consolidated High-Volume Balanced Matrix: Sourced from Top Dailies, Google News, and Global Outlets
const CA_FEEDS = {
  national: [
    { url: R2J + encodeURIComponent('https://www.thehindu.com/news/national/feeder/default.rss'), name: 'The Hindu' },
    { url: R2J + encodeURIComponent('https://indianexpress.com/section/india/feed/'),             name: 'Indian Express' },
    { url: R2J + encodeURIComponent('https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml'), name: 'Hindustan Times' },
    { url: R2J + encodeURIComponent('https://www.news18.com/rss/india.xml'),                      name: 'News18' }
  ],
  world: [
    { url: R2J + encodeURIComponent('https://www.thehindu.com/news/international/feeder/default.rss'), name: 'The Hindu World' },
    { url: R2J + encodeURIComponent('https://feeds.bbci.co.uk/news/world/rss.xml'),               name: 'BBC World' },
    { url: R2J + encodeURIComponent('https://www.aljazeera.com/xml/rss/all.xml'),                 name: 'Al Jazeera' }
  ],
  polity: [
    { url: R2J + encodeURIComponent('https://news.google.com/rss/search?q=Supreme+Court+Constitution+Polity+India&hl=en-IN&gl=IN&ceid=IN:en'), name: 'Polity Intel' }
  ],
  economy: [
    { url: R2J + encodeURIComponent('https://economictimes.indiatimes.com/rssfeedsdefault.cms'),  name: 'Economic Times' },
    { url: R2J + encodeURIComponent('https://www.livemint.com/rss/economy'),                      name: 'Mint Economy' },
    { url: R2J + encodeURIComponent('https://www.financialexpress.com/feed/'),                    name: 'Financial Express' }
  ],
  envgeo: [
    { url: R2J + encodeURIComponent('https://news.google.com/rss/search?q=Environment+Ecology+Geography+Monsoon+India&hl=en-IN&gl=IN&ceid=IN:en'), name: 'Eco/Geo News' },
    { url: R2J + encodeURIComponent('https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss'), name: 'The Hindu Eco' }
  ],
  heritage: [
    { url: R2J + encodeURIComponent('https://news.google.com/rss/search?q=Archaeology+History+Heritage+Culture+India&hl=en-IN&gl=IN&ceid=IN:en'), name: 'Heritage Intel' },
    { url: R2J + encodeURIComponent('https://www.thehindu.com/entertainment/art/feeder/default.rss'), name: 'The Hindu Culture' }
  ],
  scitech: [
    { url: R2J + encodeURIComponent('https://www.thehindu.com/sci-tech/feeder/default.rss'),      name: 'The Hindu Sci-Tech' },
    { url: R2J + encodeURIComponent('https://news.google.com/rss/search?q=ISRO+Space+Technology+AI+India&hl=en-IN&gl=IN&ceid=IN:en'), name: 'Tech Intel' }
  ],
  sports: [
    { url: R2J + encodeURIComponent('https://www.thehindu.com/sport/feeder/default.rss'),         name: 'The Hindu Sports' },
    { url: R2J + encodeURIComponent('https://www.hindustantimes.com/feeds/rss/sports/rssfeed.xml'), name: 'HT Sports' }
  ],
  misc: [
    { url: R2J + encodeURIComponent('https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3'),    name: 'PIB India' },
    { url: R2J + encodeURIComponent('https://news.google.com/rss/search?q=Indian+Defense+Military+Awards&hl=en-IN&gl=IN&ceid=IN:en'), name: 'Defense & Awards' }
  ]
};

const CA_FALLBACK = {
  national: [{ title: "India's GDP growth forecast revised upward", source: "Economic Times", url: "#", pubDate: "" }],
  world: [{ title: "Global strategic partnership strengthened at UN", source: "Reuters", url: "#", pubDate: "" }],
  polity: [{ title: "Supreme Court delivers landmark verdict on fundamental rights", source: "The Hindu", url: "#", pubDate: "" }],
  economy: [{ title: "RBI holds repo rate steady; focuses on inflation", source: "Mint", url: "#", pubDate: "" }],
  envgeo: [{ title: "Meteorological Dept issues updated monsoon & climate forecast", source: "Geo Intel", url: "#", pubDate: "" }],
  heritage: [{ title: "Ancient artifacts discovered in recent ASI excavation", source: "Heritage Intel", url: "#", pubDate: "" }],
  scitech: [{ title: "ISRO successfully tests next-generation satellite launcher", source: "The Hindu", url: "#", pubDate: "" }],
  sports: [{ title: "National athletics team completes historic gold medal run", source: "Sports Daily", url: "#", pubDate: "" }],
  misc: [{ title: "Ministry of Defence introduces new procurement policy", source: "PIB India", url: "#", pubDate: "" }]
};

var caActiveTab = 'national';
var caCache = {}; 

async function fetchRSSFeed(feedObj) {
  try {
    const res = await Promise.race([
      fetch(feedObj.url),
      new Promise(function(_, rej) { setTimeout(function() { rej(new Error('Timeout')); }, 5000); })
    ]);
    if (!res.ok) return [];
    
    const data = await res.json();
    if (data.status !== 'ok' || !data.items || !data.items.length) return [];
    
    return data.items.map(function(item) {
      return {
        title: (item.title || '').split(' - ')[0].split(' | ')[0].trim(),
        source: feedObj.name,
        url: item.link || item.url || '#',
        pubDate: item.pubDate ? new Date(item.pubDate).getTime() : 0
      };
    }).filter(function(a) { return a.title.length > 10; });
  } catch (e) {
    return []; 
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    var now = new Date();
    var diff = Math.floor((now.getTime() - d.getTime()) / 60000); 
    if (diff < 60) return (diff < 1 ? 'Just now' : diff + 'm ago');
    if (diff < 1440) return Math.floor(diff / 60) + 'h ago';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch(e) { return ''; }
}

function renderCurrentAffairs(articles, isLive, tabId) {
  const container = document.getElementById('current-affairs-container');
  if (!container) return;
  const tab = CA_TABS.find(function(t) { return t.id === tabId; }) || CA_TABS[0];

  var tabsHTML = CA_TABS.map(function(t) {
    return `<button class="ca-tab${t.id === tabId ? ' ca-tab-active' : ''}"
      style="${t.id === tabId ? '--ca-color:' + t.color : ''}"
      onclick="switchCATab('${t.id}')">
      ${t.label}
    </button>`;
  }).join('');

  var cardsHTML = articles.slice(0, 15).map(function(a, i) {
    return `<div class="news-card ca-card" style="animation-delay:${i * 40}ms">
      <div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div class="news-source" style="color:${tab.color}">${a.source}</div>
          ${a.pubDate ? `<div style="font-size:.65rem;color:var(--subtle)">${formatDate(a.pubDate)}</div>` : ''}
        </div>
        <div class="news-title">${a.title}</div>
      </div>
      <a href="${a.url}" target="_blank" rel="noopener" class="news-btn" style="color:${tab.color}">Read Full Story ↗</a>
    </div>`;
  }).join('');

  container.innerHTML = `
    <div class="news-header" style="margin-bottom:14px">
      <h2>Daily <span>Current Affairs</span></h2>
      <div class="news-live-badge">${isLive ? '<span class="ca-live-dot"></span>AGGREGATED LIVE' : '📰 OFFLINE BACKUP'}</div>
    </div>
    <div class="ca-tabs-wrap" style="overflow-x: auto; white-space: nowrap; scrollbar-width: none;">${tabsHTML}</div>
    <div class="news-scroller ca-scroller">${cardsHTML || '<div class="ca-empty">No articles found. Try another tab.</div>'}</div>
  `;

  var tabsWrap = container.querySelector('.ca-tabs-wrap');
  if(tabsWrap) tabsWrap.style.cssText += '::-webkit-scrollbar { display: none; }';

  if (typeof triggerReveal === "function") {
    setTimeout(function(){ triggerReveal(container); }, 10);
  }
}

async function switchCATab(tabId) {
  caActiveTab = tabId;
  
  document.querySelectorAll('.ca-tab').forEach(function(b) {
    const isActive = b.getAttribute('onclick').includes("'" + tabId + "'");
    b.classList.toggle('ca-tab-active', isActive);
    const tab = CA_TABS.find(function(t) { return t.id === tabId; });
    if (isActive && tab) b.style.setProperty('--ca-color', tab.color);
    else b.style.removeProperty('--ca-color');
  });

  const activeBtn = document.querySelector('.ca-tab-active');
  if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

  if (caCache[tabId]) {
    renderCurrentAffairs(caCache[tabId].articles, caCache[tabId].isLive, tabId);
    return;
  }

  const scroller = document.querySelector('.ca-scroller');
  if (scroller) scroller.innerHTML = '<div class="ca-loading"><div class="ca-spinner"></div>Consolidating ' + tabId + ' networks...</div>';
  await loadCATab(tabId);
}

async function loadCATab(tabId) {
  const feeds = CA_FEEDS[tabId] || [];
  
  const fetchPromises = feeds.map(function(feed) { return fetchRSSFeed(feed); });
  const results = await Promise.allSettled(fetchPromises);
  
  let aggregatedArticles = [];
  let isLive = false;

  results.forEach(function(result) {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      aggregatedArticles = aggregatedArticles.concat(result.value);
      isLive = true; 
    }
  });

  const seenTitles = new Set();
  let uniqueArticles = aggregatedArticles.filter(function(article) {
    var cleanTitle = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seenTitles.has(cleanTitle)) return false;
    seenTitles.add(cleanTitle);
    return true;
  });

  if (uniqueArticles.length < 3) {
    const fallbacks = CA_FALLBACK[tabId] || [];
    fallbacks.forEach(function(f) {
      var cleanFBTitle = f.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenTitles.has(cleanFBTitle)) {
        uniqueArticles.push({
          title: f.title,
          source: f.source + " Archive",
          url: f.url,
          pubDate: f.pubDate ? new Date(f.pubDate).getTime() : Date.now() - 86400000 
        });
        seenTitles.add(cleanFBTitle);
      }
    });
  }

  uniqueArticles.sort(function(a, b) { return b.pubDate - a.pubDate; });

  caCache[tabId] = { articles: uniqueArticles, isLive: isLive };
  
  if (caActiveTab === tabId) {
    renderCurrentAffairs(uniqueArticles, isLive, tabId);
  }
}

async function loadCurrentAffairs() {
  const container = document.getElementById('current-affairs-container');
  if (!container) return;
  container.innerHTML = `
    <div class="news-header">
      <h2>Daily <span>Current Affairs</span></h2>
      <div class="news-live-badge"><span class="ca-live-dot"></span>Synchronizing...</div>
    </div>
    <div style="padding:40px;text-align:center;color:var(--muted);font-size:.85rem">
      <div class="ca-spinner" style="margin:0 auto 12px"></div>Polling multi-media channels...
    </div>`;
  
  caCache = {};
  await loadCATab(caActiveTab);
}

