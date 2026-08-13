// ═══════════════════════════════════════════
//   GOVT UPDATES PAGE — RSS SYSTEM (v2 — redesigned)
// ═══════════════════════════════════════════

var GU_TYPES = {
  vacancy:   { label:"New Vacancy",   icon:"📋", color:"#4F8EF7" },
  admitcard: { label:"Admit Card",    icon:"🪪", color:"#8b5cf6" },
  examdate:  { label:"Exam Schedule", icon:"📅", color:"#f59e0b" },
  result:    { label:"Result",        icon:"🏆", color:"#4ade80" }
};

// ── RSS feeds via multiple proxy services (tries each until one works)
var GU_RAW_FEEDS = [
  { raw: 'https://www.freejobalert.com/feed/',                          name:'FreeJobAlert' },
  { raw: 'https://www.indgovtjobs.in/feeds/posts/default?alt=rss',      name:'IndGovtJobs' }, // Highly reliable, no Cloudflare
  { raw: 'https://quicksarkari.com/feed/',                              name:'Sarkari Naukri' },
  { raw: 'https://www.rojgarresult.com/feed/',                          name:'Rojgar Result' },
  { raw: 'https://www.freshersworld.com/feeds/jobsalert.xml',           name:'FreshersWorld' },
  { raw: 'https://employmentnews.gov.in/NewMain/EmploymentNewsRss.aspx', name:'Employment News' },
  { raw: 'https://www.freshersworld.com/feeds/jobsalert.xml',           name:'FreshersWorld' },
  { raw: 'https://haryanajobs.in/feed/',                                name:'Haryana Jobs' }
];
var GU_OFFICIAL_LINKS = {
  // ── CENTRAL & NATIONAL BOARDS ──
  'UPSC': 'https://upsc.gov.in',
  'SSC': 'https://ssc.gov.in', // SSC migrated to ssc.gov.in
  'RRB': 'https://indianrailways.gov.in',
  'IBPS': 'https://ibps.in',
  'NTA': 'https://nta.ac.in',
  'DRDO': 'https://drdo.gov.in',
  'ISRO': 'https://www.isro.gov.in/Careers.html',
  'AIIMS': 'https://www.aiims.edu',
  
  // ── BANKING & FINANCE ──
  'SBI': 'https://sbi.co.in/web/careers',
  'RBI': 'https://opportunities.rbi.org.in',
  'NABARD': 'https://nabard.org',
  'LIC': 'https://licindia.in/Bottom-Links/careers',
  'EPFO': 'https://www.epfindia.gov.in',
  'ESIC': 'https://www.esic.gov.in/recruitments',
  
  // ── DEFENCE & FORCES ──
  'ARMY': 'https://joinindianarmy.nic.in',
  'NAVY': 'https://www.joinindiannavy.gov.in',
  'AIR FORCE': 'https://afcat.cdac.in',
  'COAST GUARD': 'https://joinindiancoastguard.cdac.in',
  'BSF': 'https://rectt.bsf.gov.in',
  'CRPF': 'https://rect.crpf.gov.in',
  'CISF': 'https://cisfrectt.cisf.gov.in',
  'ITBP': 'https://recruitment.itbpolice.nic.in',

  // ── PSUs (Public Sector Undertakings) ──
  'ONGC': 'https://ongcindia.com',
  'NTPC': 'https://careers.ntpc.co.in',
  'BHEL': 'https://careers.bhel.in',
  'HAL': 'https://hal-india.co.in/Career',
  'SAIL': 'https://sailcareers.com',
  'FCI': 'https://fci.gov.in/personnel.php',
  'AAI': 'https://www.aai.aero/en/careers/recruitment',

  // ── STATE PUBLIC SERVICE COMMISSIONS (PSCs) ──
  'APPSC': 'https://psc.ap.gov.in',            // Andhra Pradesh
  'APSC': 'https://apsc.nic.in',               // Assam
  'BPSC': 'https://bpsc.bih.nic.in',           // Bihar
  'CGPSC': 'https://psc.cg.gov.in',            // Chhattisgarh
  'GPSC': 'https://gpsc.gujarat.gov.in',       // Gujarat
  'HPSC': 'https://hpsc.gov.in',               // Haryana
  'HPPSC': 'https://hppsc.hp.gov.in',          // Himachal Pradesh
  'JKPSC': 'https://jkpsc.nic.in',             // Jammu & Kashmir
  'JPSC': 'https://jpsc.gov.in',               // Jharkhand
  'KPSC': 'https://kpsc.kar.nic.in',           // Karnataka
  'KERALA PSC': 'https://www.keralapsc.gov.in',// Kerala
  'MPPSC': 'https://mppsc.mp.gov.in',          // Madhya Pradesh
  'MPSC': 'https://mpsc.gov.in',               // Maharashtra
  'MPSC MANIPUR': 'https://mpscmanipur.gov.in',// Manipur
  'MPSC MEGHALAYA': 'https://mpsc.nic.in',     // Meghalaya
  'OPSC': 'https://opsc.gov.in',               // Odisha
  'PPSC': 'https://ppsc.gov.in',               // Punjab
  'RPSC': 'https://rpsc.rajasthan.gov.in',     // Rajasthan
  'SPSC': 'https://spsc.sikkim.gov.in',        // Sikkim
  'TNPSC': 'https://tnpsc.gov.in',             // Tamil Nadu
  'TGPSC': 'https://tgpsc.gov.in',             // Telangana (Recently renamed from TSPSC)
  'TSPSC': 'https://tgpsc.gov.in',             // Fallback for older Telangana notices
  'TPSC': 'https://tpsc.tripura.gov.in',       // Tripura
  'UPPSC': 'https://uppsc.up.nic.in',          // Uttar Pradesh
  'UKPSC': 'https://psc.uk.gov.in',            // Uttarakhand
  'WBPSC': 'https://psc.wb.gov.in'             // West Bengal
};

// Build feed URLs with multiple proxy strategies
function guBuildFeedUrls(raw, name) {
  var enc = encodeURIComponent(raw);
  return [
    // Your own serverless proxy — tried first, no CORS issues, no rate limits
    { url: '/api/rss-proxy?url=' + enc, type: 'own', name: name },
    // Fallbacks if your proxy fails for any reason
    { url: 'https://api.rss2json.com/v1/api.json?rss_url=' + enc + '&count=120', type: 'r2j', name: name },
    { url: 'https://api.codetabs.com/v1/proxy?quest=' + enc, type: 'xml', name: name },
    { url: 'https://api.allorigins.win/get?url=' + enc, type: 'allorigins', name: name },
    { url: 'https://corsproxy.io/?' + enc, type: 'xml', name: name },
    { url: 'https://thingproxy.freeboard.io/fetch/' + raw, type: 'xml', name: name }
  ];
}

var GU_RSS_FEEDS = GU_RAW_FEEDS.map(function(f){ return guBuildFeedUrls(f.raw, f.name)[0]; });

// Keyword-based auto type classifier
function guClassify(title) {
  var t = (title||'').toLowerCase();
  if (/admit card|hall ticket|call letter/.test(t))              return 'admitcard';
  if (/result|merit list|final list|selected|cut.?off/.test(t))  return 'result';
  if (/exam date|schedule|timetable|postponed|date sheet/.test(t)) return 'examdate';
  return 'vacancy';
}

function guExtractOrg(title) {
  var orgs = [
    'UPSC','SSC','RRB','IBPS','NTA','DRDO','SBI','RBI','NABARD','TNPSC',
    'UPPSC','MPSC','BPSC','RPSC','HPSC','UKPSC','JPSC','OPSC','KPSC','GPSC',
    'APPSC','APSC','CGPSC','HPPSC','JKPSC','PPSC','SPSC','TGPSC','TSPSC',
    'TPSC','WBPSC','KERALA PSC', 'ISRO','HAL','BHEL','ONGC','NTPC','NHM',
    'AIIMS','ESIC','LIC','GIC','EPFO','FCI','AAI','SAIL',
    'ARMY','NAVY','AIR FORCE','COAST GUARD','BSF','CRPF','CISF','ITBP',
    'Police','Railway','High Court','Supreme Court'
  ];
  for (var i=0; i<orgs.length; i++) {
    if ((title||'').toUpperCase().indexOf(orgs[i].toUpperCase()) !== -1) return orgs[i];
  }
  return '';
}

function guExtractLastDate(text) {
  var match = (text||'').match(/(?:last date|apply till|deadline|closing date)[\s\:-]*(\d{1,2}[\/\-\s](?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|[a-z]+)[\/\-\s]?\d{2,4}|\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i);
  if(match && match[1]) return match[1].trim();
  return null;
}

// Fallback data shown when all RSS feeds fail
var GU_FALLBACK = [
  { id:'f1', type:'vacancy',   title:'UPSC Civil Services 2025 – Notification Released (1078 Posts)', org:'UPSC', date:'2025-02-15', lastDate:'2025-03-10', link:'https://upsc.gov.in', tags:['UPSC','IAS'] },
  { id:'f2', type:'examdate',  title:'SSC CGL Tier-I 2025 Exam Dates Announced (Apr 14–27)', org:'SSC', date:'2025-02-20', examDate:'Apr 14–27, 2025', link:'https://ssc.nic.in', tags:['SSC','CGL'] },
  { id:'f3', type:'admitcard', title:'Railway RRB NTPC Admit Card 2025 Released', org:'RRB', date:'2025-02-22', link:'https://indianrailways.gov.in', tags:['RRB','NTPC'] },
  { id:'f4', type:'result',    title:'IBPS PO Mains 2024 Result Declared', org:'IBPS', date:'2025-02-18', link:'https://ibps.in', tags:['IBPS','PO'] },
  { id:'f5', type:'vacancy',   title:'DRDO Scientist B Recruitment 2025 (635 Posts)', org:'DRDO', date:'2025-02-10', lastDate:'2025-03-25', link:'https://drdo.gov.in', tags:['DRDO','Scientist'] },
  { id:'f6', type:'examdate',  title:'NEET UG 2025 Exam Date – May 4', org:'NTA', date:'2025-02-25', examDate:'May 4, 2025', link:'https://nta.ac.in', tags:['NTA','NEET'] },
  { id:'f7', type:'admitcard', title:'UPPSC PCS Prelims 2025 Admit Card Available', org:'UPPSC', date:'2025-02-28', link:'https://uppsc.up.nic.in', tags:['UPPSC','PCS'] },
  { id:'f8', type:'result',    title:'SBI PO Mains 2024-25 Final Result Out', org:'SBI', date:'2025-03-01', link:'https://sbi.co.in', tags:['SBI','PO'] },
  { id:'f9', type:'vacancy',   title:'NABARD Grade A & B Recruitment 2025 (102 Posts)', org:'NABARD', date:'2025-03-02', lastDate:'2025-04-01', link:'https://nabard.org', tags:['NABARD'] },
  { id:'f10',type:'vacancy',   title:'High Court Allahabad – Law Clerk (150 Posts)', org:'High Court', date:'2025-02-26', lastDate:'2025-03-28', link:'https://allahabadhighcourt.in', tags:['Judiciary'] }
];

// Parse raw XML string into GU entries
function guParseXml(xmlStr, feedName) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(xmlStr, 'text/xml');
  var items = Array.from(doc.querySelectorAll('item'));
  if (!items.length) throw new Error('No items in XML');
  return items.slice(0, 120).map(function(item, idx) { // Raised limit to 120
    var title = (item.querySelector('title')||{}).textContent || '';
    title = title.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();
    var link  = (item.querySelector('link')||{}).textContent || (item.querySelector('guid')||{}).textContent || '#';
    var pub   = (item.querySelector('pubDate')||{}).textContent || '';
    var dateStr = pub ? new Date(pub).toISOString().slice(0,10) : new Date().toISOString().slice(0,10);
    if (isNaN(new Date(dateStr))) dateStr = new Date().toISOString().slice(0,10);
    return {
      id: guStableId(title, feedName),
      type: guClassify(title),
      title: title,
      org: guExtractOrg(title) || feedName,
      date: dateStr,
      lastDate: guExtractLastDate(title), examDate: null,
      link: link.trim() || '#',
      tags: [guExtractOrg(title)].filter(Boolean),
      _rss: true
    };
  }).filter(function(e){ return e.title && e.title.length > 8; });
}

// Fetch one feed with all proxy strategies tried in order
async function guFetchFeed(primaryFeed) {
  var raw = GU_RAW_FEEDS.find(function(f){ return f.name === primaryFeed.name; });
  if (!raw) raw = { raw: '', name: primaryFeed.name };
  var strategies = guBuildFeedUrls(raw.raw, raw.name);

  for (var s = 0; s < strategies.length; s++) {
    var strategy = strategies[s];
    try {
      var res = await Promise.race([
        fetch(strategy.url, { cache: 'no-store' }),
        new Promise(function(_,rej){ setTimeout(function(){ rej(new Error('Timeout')); }, 5000); })
      ]);
      if (!res.ok) continue;

      if (strategy.type === 'own') {
        var ownData = await res.json();
        if (ownData.ok && ownData.items && ownData.items.length) {
          return ownData.items.slice(0, 120).map(function(item, idx) {
            var title = (item.title||'').trim();
            return {
              id: guStableId(title, strategy.name),
              type: guClassify(title),
              title: title,
              org: guExtractOrg(title) || strategy.name,
              date: item.pubDate ? new Date(item.pubDate).toISOString().slice(0,10) : new Date().toISOString().slice(0,10),
              lastDate: guExtractLastDate(title), examDate: null,
              link: item.link || '#',
              tags: [guExtractOrg(title)].filter(Boolean),
              _rss: true
            };
          }).filter(function(e){ return e.title.length > 8; });
        }
      } 
      else if (strategy.type === 'r2j') {
      
        var data = await res.json();
        if (data.status === 'ok' && data.items && data.items.length) {
          return data.items.slice(0, 120).map(function(item, idx) { // Raised limit to 120
            var title = (item.title||'').replace(/<[^>]+>/g,'').trim();
            return {
              id: guStableId(title, strategy.name),
              type: guClassify(title),
              title: title,
              org: guExtractOrg(title) || strategy.name,
              date: item.pubDate ? item.pubDate.slice(0,10) : new Date().toISOString().slice(0,10),
              lastDate: guExtractLastDate(title), examDate: null,
              link: item.link || item.url || '#',
              tags: [guExtractOrg(title)].filter(Boolean),
              _rss: true
            };
          }).filter(function(e){ return e.title.length > 8; });
        }
      } else if (strategy.type === 'allorigins') {
        var json = await res.json();
        if (json && json.contents) {
          return guParseXml(json.contents, strategy.name);
        }
      } else {
        var xmlText = await res.text();
        return guParseXml(xmlText, strategy.name);
      }
    } catch(e) { continue; }
  }
  throw new Error('All strategies failed for ' + primaryFeed.name);
}

// AI-powered data generation when all RSS fails
async function guFetchAI() {
  try {
    var today = new Date().toISOString().slice(0,10);
    var res = await Promise.race([
      fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: 'Generate 40 realistic Indian government job notifications for today (' + today + '). Return ONLY a JSON array, no markdown, no extra text. Each object must have exactly these fields: id (string), type (one of: vacancy/admitcard/examdate/result), title (string), org (string like UPSC/SSC/RRB/IBPS/NTA/DRDO/SBI/RBI/AIIMS/ISRO), date (YYYY-MM-DD near today), lastDate (YYYY-MM-DD or null), examDate (string or null), link (official URL), tags (array of strings). Mix all 4 types. Make titles realistic and specific with post counts.'
          }]
        })
      }),
      new Promise(function(_,rej){ setTimeout(function(){ rej(new Error('AI Timeout')); }, 15000); })
    ]);
    if (!res.ok) throw new Error('AI API error');
    var aiData = await res.json();
    var text = (aiData.content||[]).map(function(c){ return c.text||''; }).join('');
    text = text.replace(/```json|```/g,'').trim();
    var entries = JSON.parse(text);
    if (!Array.isArray(entries) || !entries.length) throw new Error('Bad AI response');
    return entries.map(function(e, i){
      return {
        id: 'ai_'+i+'_'+Date.now(),
        type: ['vacancy','admitcard','examdate','result'].includes(e.type) ? e.type : 'vacancy',
        title: e.title || 'Government Notification',
        org: e.org || 'GOI',
        date: e.date || today,
        lastDate: e.lastDate || null,
        examDate: e.examDate || null,
        link: e.link || '#',
        tags: Array.isArray(e.tags) ? e.tags : [],
        _ai: true
      };
    });
  } catch(e) {
    return null;
  }
}

// ── Stable ID so "new" detection works across refreshes (title+source based, not time-based)
function guStableId(title, source) {
  var s = (title||'') + '|' + (source||'');
  var h = 0;
  for (var i=0; i<s.length; i++) { h = ((h<<5)-h) + s.charCodeAt(i); h |= 0; }
  return 'gu_' + Math.abs(h);
}

// ── Seen-entries tracking (for "NEW" badge)
function guGetSeenIds() { return Sv.get("gu_seen_ids") || []; }
function guMarkAllSeen(entries) {
  var ids = entries.map(function(e){ return e.id; });
  Sv.set("gu_seen_ids", ids.slice(0, 500)); // cap growth
  Sv.set("gu_last_visit", Date.now());
}
function guIsNew(entry, seenIds) {
  return seenIds.length > 0 && seenIds.indexOf(entry.id) === -1;
}

// ── Bookmarks for govt updates (separate namespace so it doesn't clash with quiz bookmarks)
function guGetBookmarks() { return Sv.get("gu_bookmarks") || []; }
function guIsBookmarked(entryId) { return guGetBookmarks().some(function(b){ return b.id === entryId; }); }
function guToggleBookmark(entry) {
  var bms = guGetBookmarks();
  var idx = bms.findIndex(function(b){ return b.id === entry.id; });
  if (idx >= 0) { bms.splice(idx,1); Sv.set("gu_bookmarks", bms); toast("Bookmark removed"); return false; }
  bms.push(entry); Sv.set("gu_bookmarks", bms); toast("Saved! ⭐"); return true;
}

// ── Days-left helper (also used for sort priority)
function guDaysLeft(lastDateStr) {
  if (!lastDateStr) return null;
  var cleanDateStr = lastDateStr.replace(/(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})/, '$3-$2-$1');
  var parsedDate = new Date(cleanDateStr);
  if (isNaN(parsedDate)) return null;
  var diffMs = parsedDate - new Date();
  return Math.ceil(diffMs / (1000*60*60*24));
}

// ── Sort: closing-soon-and-still-open first, then new items, then by date desc
function guSortEntries(entries, seenIds) {
  return entries.slice().sort(function(a,b){
    var da = guDaysLeft(a.lastDate), db = guDaysLeft(b.lastDate);
    var aUrgent = da !== null && da >= 0 && da <= 5;
    var bUrgent = db !== null && db >= 0 && db <= 5;
    if (aUrgent && !bUrgent) return -1;
    if (bUrgent && !aUrgent) return 1;
    if (aUrgent && bUrgent) return da - db;

    var aNew = guIsNew(a, seenIds), bNew = guIsNew(b, seenIds);
    if (aNew && !bNew) return -1;
    if (bNew && !aNew) return 1;

    return (b.date||'') > (a.date||'') ? 1 : -1;
  });
}

// Cache for RSS results (persisted across sessions too)
var guRssCache = null;
var guLastFetch = 0;

function pgGovtUpdates(){
  var w = el("div",{cls:"fd"});
  w.appendChild(makeNav("govtupdates"));
  var wrap = el("div",{css:{maxWidth:"780px",margin:"0 auto"}});

  // Header
  var hd = el("div",{css:{textAlign:"center",marginBottom:"24px"}});
  hd.appendChild(el("div",{css:{fontSize:"2rem",marginBottom:"6px"},txt:"🔔"}));
  hd.appendChild(el("div",{css:{fontSize:"1.4rem",fontWeight:"800",letterSpacing:"-.02em",marginBottom:"4px"},txt:"Government Job Updates"}));
  hd.appendChild(el("div",{css:{fontSize:".85rem",color:"var(--muted)"},txt:"Vacancies · Admit Cards · Exam Dates · Results — live from RSS"}));
  wrap.appendChild(hd);

  // Status bar (live indicator + compact toggle + refresh button)
  var statusBar = el("div",{css:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"11px 18px",marginBottom:"18px",flexWrap:"wrap"}});
  var statusLeft = el("div",{css:{display:"flex",alignItems:"center",gap:"8px"}});
  var liveDot = el("div",{cls:"gu-live-dot"});
  var statusTxt = el("div",{css:{fontSize:".78rem",color:"var(--muted)"},txt:"Loading live updates..."});
  statusLeft.appendChild(liveDot);
  statusLeft.appendChild(statusTxt);
  statusBar.appendChild(statusLeft);

  var statusRight = el("div",{css:{display:"flex",alignItems:"center",gap:"8px"}});
  var compactMode = {v: Sv.get("gu_compact") || false};
  var compactBtn = el("button",{cls:"gu-fetch-btn",onclick:function(){
    compactMode.v = !compactMode.v;
    Sv.set("gu_compact", compactMode.v);
    compactBtn.textContent = compactMode.v ? "▤ Compact" : "▥ Cards";
    renderList();
  }},compactMode.v ? "▤ Compact" : "▥ Cards");
  var refreshBtn = el("button",{cls:"gu-fetch-btn",onclick:function(){
    guRssCache = null; guLastFetch = 0;
    Sv.set("gu_cache", null);
    go("govtupdates");
    toast("🔄 Refreshing...");
  }},"🔄 Refresh");
  statusRight.appendChild(compactBtn);
  statusRight.appendChild(refreshBtn);
  statusBar.appendChild(statusRight);
  wrap.appendChild(statusBar);

  // Search
  var searchBox = el("input",{cls:"gu-search",placeholder:"🔍  Search vacancies, exams, boards..."});

  // Tabs + list container
  var activeTab = {v:"all"};
  var showBookmarksOnly = {v:false};
  var listWrap = el("div",{});
  var allEntries = [];
  var seenIds = guGetSeenIds();

  // Stats bar (tap a stat to filter that category)
  var statsBar = el("div",{cls:"gu-stats-bar",css:{marginBottom:"18px",cursor:"pointer"}});
  wrap.appendChild(statsBar);

  function updateStats() {
    var counts = {vacancy:0,admitcard:0,examdate:0,result:0};
    var newCounts = {vacancy:0,admitcard:0,examdate:0,result:0};
    allEntries.forEach(function(e){
      if(counts[e.type]!==undefined) counts[e.type]++;
      if(newCounts[e.type]!==undefined && guIsNew(e, seenIds)) newCounts[e.type]++;
    });
    statsBar.innerHTML = '';
    [["vacancy","📋"],["admitcard","🪪"],["examdate","📅"],["result","🏆"]].forEach(function(r){
      var t = GU_TYPES[r[0]];
      var sc = el("div",{cls:"gu-stat",onclick:function(){
        activeTab.v = r[0];
        tabs.querySelectorAll(".gu-tab").forEach(function(b){ b.classList.remove("gu-active"); });
        var match = Array.from(tabs.querySelectorAll(".gu-tab")).find(function(b){ return b.dataset.type===r[0]; });
        if(match) match.classList.add("gu-active");
        renderList();
      }});
      sc.appendChild(el("div",{css:{fontSize:"1.1rem"}},r[1]));
      var numWrap = el("div",{css:{display:"flex",alignItems:"center",justifyContent:"center",gap:"4px"}});
      numWrap.appendChild(el("div",{cls:"gu-stat-num",css:{color:t.color}},String(counts[r[0]])));
      if(newCounts[r[0]] > 0){
        numWrap.appendChild(el("span",{css:{fontSize:".62rem",fontWeight:"800",color:"#fff",background:"#ef4444",borderRadius:"99px",padding:"1px 6px"}},"+"+newCounts[r[0]]));
      }
      sc.appendChild(numWrap);
      sc.appendChild(el("div",{cls:"gu-stat-lbl"},t.label));
      statsBar.appendChild(sc);
    });
  }

  function renderList(){
    var q = searchBox.value.toLowerCase().trim();
    var filtered = allEntries.filter(function(e){
      var typeMatch = activeTab.v === "all" || e.type === activeTab.v;
      var bmMatch = !showBookmarksOnly.v || guIsBookmarked(e.id);
      var textMatch = !q ||
        (e.title||'').toLowerCase().indexOf(q) !== -1 ||
        (e.org||'').toLowerCase().indexOf(q) !== -1 ||
        (e.tags||[]).join(' ').toLowerCase().indexOf(q) !== -1;
      return typeMatch && textMatch && bmMatch;
    });
    filtered = guSortEntries(filtered, seenIds);

    listWrap.innerHTML = '';
    listWrap.className = compactMode.v ? 'gu-list-compact' : '';

    if(!filtered.length){
      var emp = el("div",{cls:"gu-empty"});
      emp.appendChild(el("div",{css:{fontSize:"2.5rem",marginBottom:"10px"}},showBookmarksOnly.v?'⭐':(activeTab.v!=='all'?(GU_TYPES[activeTab.v]||{icon:'📭'}).icon:'📭')));
      emp.appendChild(el("div",{css:{fontWeight:"600",marginBottom:"6px"}},showBookmarksOnly.v?'No saved updates yet':(q?'No results for "'+q+'"':'Nothing here yet')));
      emp.appendChild(el("div",{css:{fontSize:".82rem",color:"var(--muted)"}},showBookmarksOnly.v?'Tap ⭐ on any update to save it here':'Try another tab or refresh'));
      listWrap.appendChild(emp);
      return;
    }

    filtered.forEach(function(entry, idx){
      var t = GU_TYPES[entry.type] || GU_TYPES.vacancy;
      var isNewEntry = guIsNew(entry, seenIds);
      var daysLeft = guDaysLeft(entry.lastDate);
      var closingSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 5;

      if (compactMode.v) {
        var row = el("div",{cls:"gu-row"});
        row.style.setProperty("--gu-color", t.color);
        var rowLeft = el("div",{css:{display:"flex",alignItems:"center",gap:"8px",flex:"1",minWidth:"0"}});
        rowLeft.appendChild(el("span",{},t.icon));
        if(isNewEntry) rowLeft.appendChild(el("span",{css:{fontSize:".6rem",fontWeight:"800",color:"#fff",background:"#ef4444",borderRadius:"4px",padding:"1px 5px"}},"NEW"));
        var targetLink = (entry.org && GU_OFFICIAL_LINKS[entry.org]) ? GU_OFFICIAL_LINKS[entry.org] : entry.link;
var rowTitle = el("a",{href:targetLink,target:"_blank",rel:"noopener",css:{color:"var(--fg)",textDecoration:"none",fontSize:".85rem",fontWeight:"600",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}},entry.title);
        rowLeft.appendChild(rowTitle);
        row.appendChild(rowLeft);
        var rowRight = el("div",{css:{display:"flex",alignItems:"center",gap:"8px",fontSize:".72rem",color:"var(--muted)",flexShrink:"0"}});
        if(closingSoon) rowRight.appendChild(el("span",{css:{color:"#ef4444",fontWeight:"700"}},daysLeft===0?"Today!":daysLeft+"d left"));
        rowRight.appendChild(el("span",{},entry.org||''));
        (function(en){
          rowRight.appendChild(el("button",{cls:"gu-star-btn",onclick:function(ev){
            ev.preventDefault();
            var bm = guToggleBookmark(en);
            ev.currentTarget.textContent = bm ? "★" : "☆";
          }}, guIsBookmarked(en.id) ? "★" : "☆"));
        })(entry);
        row.appendChild(rowRight);
        listWrap.appendChild(row);
        return;
      }

      var card = el("div",{cls:"gu-card"});
      card.style.setProperty("--gu-color", t.color);
      card.style.animationDelay = (idx*30)+"ms";

      var topRow = el("div",{css:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px"}});
      var badgeWrap = el("div",{css:{display:"flex",alignItems:"center",gap:"6px"}});
      var badge = el("span",{cls:"gu-badge"},t.icon+" "+t.label);
      badge.style.background = t.color+"20";
      badge.style.color = t.color;
      badgeWrap.appendChild(badge);
      if(isNewEntry) badgeWrap.appendChild(el("span",{css:{fontSize:".65rem",fontWeight:"800",color:"#fff",background:"#ef4444",borderRadius:"6px",padding:"2px 7px"}},"● NEW"));
      topRow.appendChild(badgeWrap);
      (function(en){
        topRow.appendChild(el("button",{cls:"gu-star-btn",css:{fontSize:"1.1rem"},onclick:function(){
          var bm = guToggleBookmark(en);
          starBtn.textContent = bm ? "★" : "☆";
        }},guIsBookmarked(en.id) ? "★" : "☆"));
      })(entry);
      var starBtn = topRow.lastChild;
      card.appendChild(topRow);

      card.appendChild(el("div",{cls:"gu-title",css:{marginTop:"8px"}},entry.title));

      var meta = el("div",{cls:"gu-meta"});
      if(entry.org)      meta.appendChild(el("span",{},"🏛 "+entry.org));
      if(entry.date)     meta.appendChild(el("span",{},"📅 "+entry.date));
      if(entry.lastDate) {
        if(closingSoon) {
          meta.appendChild(el("span",{css:{color:"#ef4444", fontWeight:"700", background:"rgba(239,68,68,0.15)", padding:"2px 8px", borderRadius:"6px"}},"🚨 Closing Soon: " + entry.lastDate + (daysLeft === 0 ? " (Today!)" : " (" + daysLeft + " days left)")));
        } else {
          meta.appendChild(el("span",{css:{color:"#f87171"}},"⏰ Last Date: "+entry.lastDate));
        }
      }
      if(entry.examDate) meta.appendChild(el("span",{css:{color:"#f59e0b"}},"📝 Exam: "+entry.examDate));
      card.appendChild(meta);

      if(entry.tags && entry.tags.length){
        var tagWrap = el("div",{css:{display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"10px"}});
        entry.tags.filter(Boolean).forEach(function(tag){
          tagWrap.appendChild(el("span",{css:{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"99px",padding:"2px 9px",fontSize:".68rem",color:"var(--muted)",fontWeight:"600"}},tag));
        });
        card.appendChild(tagWrap);
      }

      var foot = el("div", {css: {display: "flex", alignItems: "center", justifyContent: "space-between"}});
var linksWrap = el("div", {css: {display: "flex", gap: "12px", alignItems: "center"}});

// 1. Always provide the third-party "Details" link (from the RSS feed)
if (entry.link) {
  linksWrap.appendChild(el("a", {
    cls: "gu-link", 
    href: entry.link, 
    target: "_blank", 
    rel: "noopener", 
    css: {color: t.color}
  }, "📝 Details ↗"));
}

// 2. Add the Official Site link right next to it (if we have it)
if (entry.org && GU_OFFICIAL_LINKS[entry.org]) {
  linksWrap.appendChild(el("a", {
    cls: "gu-link", 
    href: GU_OFFICIAL_LINKS[entry.org], 
    target: "_blank", 
    rel: "noopener", 
    css: {color: "var(--fg)", opacity: "0.8"} // Slightly different color so they stand apart
  }, "🏛 Official Site ↗"));
}

foot.appendChild(linksWrap);

// Keep your existing AI/User tags logic here
if (entry._ai) {
  foot.appendChild(el("span", {css: {fontSize: ".65rem", color: "#8b5cf6", fontWeight: "600", background: "rgba(139,92,246,0.12)", padding: "2px 8px", borderRadius: "6px"}}, "🤖 AI"));
}
if (entry._user) {
  (function(eid) {
    foot.appendChild(el("button", {cls: "btng", css: {fontSize: ".72rem", padding: "4px 10px"}, onclick: function() {
      var s = Sv.get("gu_entries") || [];
      Sv.set("gu_entries", s.filter(function(x) { return x.id !== eid; }));
      go("govtupdates");
      toast("Entry removed");
    }}, "✕ Remove"));
  })(entry.id);
}

card.appendChild(foot);
      if(entry._ai){
        foot.appendChild(el("span",{css:{fontSize:".65rem",color:"#8b5cf6",fontWeight:"600",background:"rgba(139,92,246,0.12)",padding:"2px 8px",borderRadius:"6px"}},"🤖 AI"));
      }
      if(entry._user){
        (function(eid){
          foot.appendChild(el("button",{cls:"btng",css:{fontSize:".72rem",padding:"4px 10px"},onclick:function(){
            var s = Sv.get("gu_entries")||[];
            Sv.set("gu_entries", s.filter(function(x){ return x.id!==eid; }));
            go("govtupdates");
            toast("Entry removed");
          }},"✕ Remove"));
        })(entry.id);
      }
      card.appendChild(foot);
      listWrap.appendChild(card);
    });
    setTimeout(function(){ triggerReveal(listWrap); }, 10);
  }

  // Tabs (+ bookmarks filter chip)
  var tabs = el("div",{cls:"gu-tabs"});
  [["all","🔔 All"],["vacancy","📋 Vacancy"],["admitcard","🪪 Admit Card"],["examdate","📅 Exam Date"],["result","🏆 Result"]].forEach(function(td){
    var tb = el("button",{cls:"gu-tab"+(activeTab.v===td[0]?" gu-active":""),onclick:function(){
      activeTab.v = td[0];
      tabs.querySelectorAll(".gu-tab").forEach(function(b){ b.classList.remove("gu-active"); });
      tb.classList.add("gu-active");
      renderList();
    }},td[1]);
    tb.dataset.type = td[0];
    tabs.appendChild(tb);
  });
  var bmTab = el("button",{cls:"gu-tab",onclick:function(){
    showBookmarksOnly.v = !showBookmarksOnly.v;
    bmTab.classList.toggle("gu-active", showBookmarksOnly.v);
    renderList();
  }},"⭐ Saved");
  tabs.appendChild(bmTab);

  searchBox.addEventListener("input", renderList);

  wrap.appendChild(searchBox);
  wrap.appendChild(tabs);

  // Loading skeleton
  var skeleton = el("div",{css:{display:"flex",flexDirection:"column",gap:"14px",paddingTop:"10px"}});
  skeleton.innerHTML = Array(4).fill(
    '<div class="gu-card skeleton-box" style="height:120px;border-color:transparent;box-shadow:none;">' +
      '<div class="skeleton-box" style="height:22px;width:30%;border-radius:6px;margin-bottom:14px;background:var(--bg)!important"></div>' +
      '<div class="skeleton-box" style="height:16px;width:85%;border-radius:4px;margin-bottom:10px;background:var(--bg)!important"></div>' +
      '<div class="skeleton-box" style="height:16px;width:60%;border-radius:4px;background:var(--bg)!important"></div>' +
    '</div>'
  ).join('');
  wrap.appendChild(skeleton);
  wrap.appendChild(listWrap);

  // ── Fetch Live Government Updates ──
  (async function(){
    var persistedCache = Sv.get("gu_cache");
    var persistedFetchTime = Sv.get("gu_cache_time") || 0;
    if(!guRssCache && persistedCache && (Date.now()-persistedFetchTime) < 600000){
      guRssCache = persistedCache;
      guLastFetch = persistedFetchTime;
    }

    if(guRssCache && (Date.now()-guLastFetch) < 600000){
      allEntries = guRssCache;
      skeleton.style.display = 'none';
      updateStats();
      renderList();
      statusTxt.textContent = '✅ Cached — '+allEntries.length+' updates loaded';
      guMarkAllSeen(allEntries);
      return;
    }

    skeleton.innerHTML = '<div class="ca-spinner" style="margin:0 auto 12px"></div>Fetching live govt updates...';

    var stored = Sv.get("gu_entries") || [];

    var fetchPromises = GU_RSS_FEEDS.map(function(feed){
      return Promise.race([
        guFetchFeed(feed),
        new Promise(function(_, reject) {
          setTimeout(function(){ reject(new Error('timeout')); }, 20000);
        })
      ]).catch(function(){ return []; });
    });

    var results = await Promise.allSettled(fetchPromises);
    var fetchedEntries = [];
    results.forEach(function(r){
      if(r.status === 'fulfilled' && Array.isArray(r.value)){
        fetchedEntries = fetchedEntries.concat(r.value);
      }
    });

    var usedFallback = false;
    var oldCache = Sv.get("gu_cache") || [];
    var usedFallback = false;

    // If we fetched ANY new items, OR if we already have items in our cache:
    if (fetchedEntries.length > 0 || oldCache.length > 0) {
      
      // Combine new live entries + old cached entries + user entries
      var combined = fetchedEntries.concat(oldCache).concat(stored);
      
      var seen = {};
      var finalEntries = [];
      
      // Deduplicate (so we don't show the same job twice)
      for(var i = 0; i < combined.length; i++) {
        var e = combined[i];
        var key = (e.title || '').slice(0, 50).toLowerCase();
        if(!seen[key]) {
          seen[key] = true;
          finalEntries.push(e);
        }
      }
      
      // Sort by date (newest first)
      finalEntries.sort(function(a,b){ return (b.date||'') > (a.date||'') ? 1 : -1; });
      
      // Cap it at 150 total items
      allEntries = finalEntries.slice(0, 150);
      
      if (fetchedEntries.length > 0) {
        statusTxt.textContent = '● Live — ' + allEntries.length + ' updates available';
        liveDot.style.background = '#4ade80'; // Green dot
      } else {
        // The fetch failed (network drop/proxy block), but we kept the cache!
        statusTxt.textContent = '✅ Cached — ' + allEntries.length + ' updates available';
        liveDot.style.background = '#f59e0b'; // Yellow/Orange dot
      }
      
    } else {
      // ONLY trigger the hardcoded 10-item fallback if both the fetch AND the cache are completely empty
      usedFallback = true;
      allEntries = stored.concat(GU_FALLBACK);
      statusTxt.textContent = '📋 Offline Mode — ' + GU_FALLBACK.length + ' curated updates';
      liveDot.style.background = '#f59e0b';
    }

    // Save our hard work to the cache for next time
    guRssCache = allEntries;
    guLastFetch = Date.now();
    Sv.set("gu_cache", allEntries);
    Sv.set("gu_cache_time", guLastFetch);

    if (usedFallback) {
      var banner = el("div",{css:{background:"rgba(245,158,11,0.12)",border:"1px solid rgba(245,158,11,0.3)",borderRadius:"10px",padding:"10px 14px",marginBottom:"14px",fontSize:".78rem",color:"#f59e0b",fontWeight:"600"}},"⚠️ Live feed unavailable right now — showing curated updates instead.");
      wrap.insertBefore(banner, statsBar);
    }

    skeleton.style.display = 'none';
    updateStats();
    renderList();
    guMarkAllSeen(allEntries);
  })();

  w.appendChild(wrap);
  return w;
}

// --- BOOKMARK HELPERS (quiz/study bookmarks — unchanged, separate from gu_bookmarks) ---
function getBookmarks(subj) { return Sv.get("bm_"+subj) || []; }
function isBookmarked(subj, qText) { return getBookmarks(subj).some(function(b){ return b.q === qText; }); }
function toggleBookmark(subj, qObj) {
  var bms = getBookmarks(subj);
  var idx = bms.findIndex(function(b){ return b.q === qObj.q; });
  var isBm = false;
  if (idx >= 0) { bms.splice(idx, 1); toast("Bookmark removed"); }
  else { bms.push(qObj); toast("Saved to Bookmarks! ⭐"); isBm = true; }
  Sv.set("bm_"+subj, bms);
  return isBm;
}