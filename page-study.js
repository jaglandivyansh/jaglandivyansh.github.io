// ═══════════════════════════════════════════════════════════════════
// SVG ICON SET — replaces emoji glyphs across the Study pages
// Usage: svgIcon("name", { size:18, color:"currentColor" })
// Returns a DOM node built via el(), safe to appendChild anywhere.
// ═══════════════════════════════════════════════════════════════════
var ICO_PATHS = {
  back:      '<path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  forward:   '<path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  cards:     '<rect x="3" y="6" width="14" height="10" rx="2" transform="rotate(-8 10 11)"/><rect x="6" y="4" width="15" height="16" rx="2"/>',
  brain:     '<path d="M9.5 3a3 3 0 0 0-3 3v.3A3 3 0 0 0 5 9v1a3 3 0 0 0-1 5.7 3 3 0 0 0 2.8 4.3H8a2 2 0 0 0 2-2V6a3 3 0 0 0-.5-3Z"/><path d="M14.5 3a3 3 0 0 1 3 3v.3A3 3 0 0 1 19 9v1a3 3 0 0 1 1 5.7 3 3 0 0 1-2.8 4.3H16a2 2 0 0 1-2-2V6a3 3 0 0 1 .5-3Z"/>',
  star:      '<path d="M12 2.5l2.9 6.4 6.9.7-5.2 4.7 1.5 6.8L12 17.6l-6.1 3.5 1.5-6.8-5.2-4.7 6.9-.7Z"/>',
  starOutline:'<path d="M12 2.5l2.9 6.4 6.9.7-5.2 4.7 1.5 6.8L12 17.6l-6.1 3.5 1.5-6.8-5.2-4.7 6.9-.7Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  sword:     '<path d="M14.5 2 21 8.5l-2 2-1.4-1.4-8.4 8.4.9 2.7-1.7 1.7-2.3-.9-.9-2.3 1.7-1.7 2.7.9 8.4-8.4L16.6 8Z"/><path d="M3 21l4-1 8-8-3-3-8 8Z"/>',
  bolt:      '<path d="M13 2 4 14h6l-1 8 9-12h-6Z"/>',
  clock:     '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  alarm:     '<circle cx="12" cy="13" r="8" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 9v4l2.5 1.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M5 3 2 6M19 3l3 3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
  search:    '<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  pencil:    '<path d="M3 21l1-4.5L16 4l4 4L8 20.5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
  chart:     '<path d="M4 20V10M11 20V4M18 20v-7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  tap:       '<path d="M9 12V5.5a1.5 1.5 0 0 1 3 0V11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 11.2V4a1.5 1.5 0 0 1 3 0v7.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 11.5V6.8a1.5 1.5 0 0 1 3 0V14c0 4-2.2 7-6 7s-5.6-1.8-6.9-4.3L3.6 13a1.4 1.4 0 0 1 2.3-1.6L9 15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  frown:     '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 15.5c1-1.3 6-1.3 7 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="9" cy="9.5" r="1.1"/><circle cx="15" cy="9.5" r="1.1"/>',
  thumb:     '<path d="M7 22V11M2 13v7a2 2 0 0 0 2 2h11.3a2 2 0 0 0 2-1.6l1.5-7A2 2 0 0 0 16.8 11H13V5a2 2 0 0 0-2-2L7 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>',
  flame:     '<path d="M12 2s5 4.5 5 10a5 5 0 0 1-10 0c0-1.3.5-2.2 1-3 .3 1 1 1.5 1.5 1.5C9 8 9 5 12 2Z"/>',
  check:     '<path d="M4 12l5 5L20 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
  cross:     '<path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
  trophy:    '<path d="M8 4h8v5a4 4 0 0 1-8 0Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 5H5a3 3 0 0 0 3 4M16 5h3a3 3 0 0 1-3 4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 13v2h4v-2M9 19h6M12 15v4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  heartbreak:'<path d="M12 21S3 15 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 15 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M13 6l-2.5 4L13 12l-1.5 3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
  rocket:    '<path d="M12 2c2.5 1.5 4.5 5 4 9.5l-2 2h-4l-2-2c-.5-4.5 1.5-8 4-9.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="9" r="1.3"/><path d="M9 13.5 6 15v3l3-1.5M15 13.5 18 15v3l-3-1.5M10 18l1 3h2l1-3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
  bulb:      '<path d="M9 18h6M10 21h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M12 2a6.5 6.5 0 0 0-3.5 12c.7.5 1 1 1 2h5c0-1 .3-1.5 1-2A6.5 6.5 0 0 0 12 2Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  handshake: '<path d="M2 12l4-4 4 3-3 3M22 12l-4-4-4 3 3 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/><path d="M8 11l3 3a1.5 1.5 0 0 0 2-2l-3-3M13 9l3 3a1.5 1.5 0 0 1-2 2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>',
  skull:     '<path d="M12 3a7 7 0 0 0-7 7c0 2.5 1.2 4 2 5v2a1 1 0 0 0 1 1h1v2h1v-2h4v2h1v-2h1a1 1 0 0 0 1-1v-2c.8-1 2-2.5 2-5a7 7 0 0 0-7-7Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="9.5" cy="10.5" r="1.2"/><circle cx="14.5" cy="10.5" r="1.2"/>',
  trash:     '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>',
  shield:    '<path d="M12 2 4 5v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  warning:   '<path d="M12 3 2 20h20Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 9v5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="17" r="1"/>',
  skip:      '<path d="M5 5l9 7-9 7Z"/><path d="M17 5h2v14h-2Z"/>',
  refresh:   '<path d="M4 12a8 8 0 0 1 14-5.2M20 12a8 8 0 0 1-14 5.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18 3v4h-4M6 21v-4h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  confetti:  '<path d="M4 20l3-9 9 3Z"/><circle cx="17" cy="5" r="1.3"/><circle cx="20" cy="10" r="1"/><rect x="12" y="3" width="2" height="2" transform="rotate(20 13 4)"/>',
  book:      '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v17H6.5A2.5 2.5 0 0 0 4 22.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v17h5.5a2.5 2.5 0 0 1 2.5 2.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>'
};
function svgIcon(name, opts){
  opts=opts||{};
  var size=opts.size||18, color=opts.color||"currentColor";
  var path=ICO_PATHS[name]||"";
  var svgStr='<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="'+color+'" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;vertical-align:middle">'+path+'</svg>';
  return el("span",{css:{display:"inline-flex",alignItems:"center",lineHeight:"0"},htm:svgStr});
}
// Convenience: icon + text inline row
function icoRow(name, txt, opts){
  opts=opts||{};
  var row=el("span",{css:{display:"inline-flex",alignItems:"center",gap:opts.gap||"6px"}});
  row.appendChild(svgIcon(name,opts));
  if(txt!==undefined&&txt!==null&&txt!=="") row.appendChild(el("span",{},String(txt)));
  return row;
}

function pgSub(){
  var s = sub, ac = typeof AC !== 'undefined' ? AC[s] : "#3b82f6", qs = typeof QD !== 'undefined' ? (QD[s] || []) : [];
  var topic = window.activeTopic;
  
  // ── FILTER BY SELECTED TOPIC ──
  if (topic) {
    qs = qs.filter(function(q) {
      return q.topic && q.topic.toLowerCase().trim() === topic.toLowerCase().trim();
    });
  }

  var bms=getBookmarks(s); 
  var w=el("div",{cls:"fd",css:{maxWidth:"700px",margin:"0 auto"}});
  var nr=el("div",{css:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"32px",paddingBottom:"16px",borderBottom:"1.5px solid var(--border)"}});
  
  // BACK BUTTON GOES TO TOPIC LIST NOW
  nr.appendChild(el("button",{cls:"btn btng",css:{padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:"6px"},onclick:function(){ go("topiclist", s); }},[svgIcon("back",{size:15}),el("span",{},"Back")]));
  
  var nb=el("div",{css:{display:"flex",alignItems:"center",gap:"8px"}});
  if(typeof makeLogo === 'function') nb.appendChild(makeLogo(24));
  nb.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"600"},txt:"StudyLab"}));
  nr.appendChild(nb);w.appendChild(nr);
  
  var c1=el("div",{cls:"mc",onclick:function(){go("fcmenu");}});
  c1.addEventListener("mouseenter",function(){this.style.borderColor=ac;this.style.background="var(--card2)";});
  c1.addEventListener("mouseleave",function(){this.style.borderColor="var(--border)";this.style.background="var(--card)";});
  var c1i=el("div",{css:{width:"48px",height:"48px",borderRadius:"14px",background:ac+"18",color:ac,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"12px"}});
  c1i.appendChild(svgIcon("cards",{size:24}));c1.appendChild(c1i);
  c1.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"600",marginBottom:"4px"},txt:"Flashcards"}));
  c1.appendChild(el("div",{css:{fontSize:".78rem",color:"var(--subtle)"},txt:"Classical or Swipe Mode"}));
  
  var c2=el("div",{cls:"mc",onclick:function(){go("qz");}});
  c2.addEventListener("mouseenter",function(){this.style.borderColor=ac;this.style.background="var(--card2)";});
  c2.addEventListener("mouseleave",function(){this.style.borderColor="var(--border)";this.style.background="var(--card)";});
  var c2i=el("div",{css:{width:"48px",height:"48px",borderRadius:"14px",background:ac+"18",color:ac,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"12px"}});
  c2i.appendChild(svgIcon("brain",{size:24}));c2.appendChild(c2i);
  c2.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"600",marginBottom:"4px"},txt:"Quiz"}));
  c2.appendChild(el("div",{css:{fontSize:".78rem",color:"var(--subtle)"},txt:"Test your knowledge"}));
  
  var c3=el("div",{cls:"mc",onclick:function(){go("bm");}});
  c3.addEventListener("mouseenter",function(){this.style.borderColor="#f59e0b";this.style.background="var(--card2)";});
  c3.addEventListener("mouseleave",function(){this.style.borderColor="var(--border)";this.style.background="var(--card)";});
  var c3i=el("div",{css:{width:"48px",height:"48px",borderRadius:"14px",background:"rgba(245,158,11,0.14)",color:"#f59e0b",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"12px"}});
  c3i.appendChild(svgIcon("star",{size:22}));c3.appendChild(c3i);
  c3.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"600",marginBottom:"4px"},txt:"Bookmarks"}));
  c3.appendChild(el("div",{css:{fontSize:".78rem",color:"var(--subtle)"},txt:bms.length+" saved questions"}));

  // ── READ CARD (only shows as active if content exists for this topic) ──
  var hasReadContent = topic && typeof RD !== 'undefined' && RD[s] && RD[s][topic];
  var c0=el("div",{cls:"mc",onclick:function(){
    if (!hasReadContent) { if (typeof toast === 'function') toast("Notes for this topic are coming soon!", "#f59e0b"); return; }
    go("read");
  }, css: hasReadContent ? {} : { opacity: "0.55" }});
  c0.addEventListener("mouseenter",function(){ if(hasReadContent){ this.style.borderColor="#10b981"; this.style.background="var(--card2)"; } });
  c0.addEventListener("mouseleave",function(){ this.style.borderColor="var(--border)"; this.style.background="var(--card)"; });
  var c0i=el("div",{css:{width:"48px",height:"48px",borderRadius:"14px",background:"rgba(16,185,129,0.14)",color:"#10b981",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"12px"}});
  c0i.appendChild(svgIcon("book",{size:22}));c0.appendChild(c0i);
  c0.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"600",marginBottom:"4px"},txt:"Read"}));
  c0.appendChild(el("div",{css:{fontSize:".78rem",color:"var(--subtle)"},txt: hasReadContent ? "Structured notes · हिंदी + English" : "Coming soon"}));

  var ctr=el("div",{css:{textAlign:"center",padding:"12px 0 32px"}});
  var headerIcon = typeof ICON !== 'undefined' && ICON[s] ? ICON[s] : "📚";
  ctr.appendChild(el("div",{css:{fontSize:"3.5rem",marginBottom:"12px"},txt:headerIcon}));
  
  // SHOW TOPIC TITLE INSTEAD OF SUBJECT
  ctr.appendChild(el("div",{css:{fontSize:"1.5rem",fontWeight:"800",fontFamily:"var(--font-display)", letterSpacing:"-0.02em", marginBottom:"6px"},txt: topic ? topic : s}));
  ctr.appendChild(el("div",{css:{fontSize:".9rem",color:"var(--muted)",marginBottom:"36px"},txt:qs.length+" questions ready"}));
  
  var mrow=el("div",{css:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))",gap:"16px",justifyContent:"center"}});
  mrow.appendChild(c0);mrow.appendChild(c1);mrow.appendChild(c2);mrow.appendChild(c3);
  ctr.appendChild(mrow);w.appendChild(ctr);
  return w;
}

// ═══════════════════════════════════════════════════════
// PG-READ — Structured bilingual notes page for a topic
// ═══════════════════════════════════════════════════════
function pgRead(){
  var s = sub, ac = typeof AC !== 'undefined' ? AC[s] : "#3b82f6";
  var topic = window.activeTopic;
  var content = (typeof RD !== 'undefined' && RD[s] && RD[s][topic]) ? RD[s][topic] : null;

  var w = el("div",{cls:"fd",css:{maxWidth:"700px",margin:"0 auto",paddingBottom:"60px"}});

  // ── Header / Back ──
  var nr=el("div",{css:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px",marginBottom:"20px",paddingBottom:"16px",borderBottom:"1.5px solid var(--border)"}});
  nr.appendChild(el("button",{cls:"btn btng",css:{padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:"6px"},onclick:function(){ go("sub", s); }},[svgIcon("back",{size:15}),el("span",{},"Back")]));

  // ── Language Toggle (Hindi / English) ──
  var langState = { lang: "hi" }; // default Hindi
  var toggleWrap = el("div",{css:{display:"flex",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"10px",padding:"3px",gap:"3px"}});
  var hiBtn = el("button",{css:{padding:"6px 14px",borderRadius:"7px",border:"none",fontSize:".8rem",fontWeight:"700",cursor:"pointer",background:ac,color:"#fff"},txt:"हिंदी"});
  var enBtn = el("button",{css:{padding:"6px 14px",borderRadius:"7px",border:"none",fontSize:".8rem",fontWeight:"700",cursor:"pointer",background:"transparent",color:"var(--muted)"},txt:"English"});
  toggleWrap.appendChild(hiBtn); toggleWrap.appendChild(enBtn);
  nr.appendChild(toggleWrap);
  w.appendChild(nr);

  // ── Title ──
  w.appendChild(el("div",{css:{fontSize:"1.4rem",fontWeight:"800",fontFamily:"var(--font-display)",marginBottom:"20px"},txt: topic || s}));

  // ── Content Container (re-rendered on language switch) ──
  var body = el("div",{css:{display:"flex",flexDirection:"column",gap:"14px"}});
  w.appendChild(body);

  function highlightParse(text){
    // Converts <hl>term</hl> markers into colored highlighted spans
    var frag = document.createDocumentFragment();
    var parts = text.split(/(<hl>.*?<\/hl>)/g);
    parts.forEach(function(part){
      var m = part.match(/^<hl>(.*?)<\/hl>$/);
      if (m) {
        frag.appendChild(el("span",{css:{color:ac,fontWeight:"700",background:ac+"15",padding:"1px 5px",borderRadius:"5px"}},m[1]));
      } else if (part) {
        frag.appendChild(document.createTextNode(part));
      }
    });
    return frag;
  }

  function renderContent(lang){
    body.innerHTML = "";
    if (!content) {
      body.appendChild(el("div",{css:{textAlign:"center",padding:"60px 20px",color:"var(--muted)"}},[
        el("div",{css:{fontSize:"2.5rem",marginBottom:"12px"}},"📝"),
        el("div",{css:{fontWeight:"600"}},"Notes for this topic are coming soon!")
      ]));
      return;
    }
    var blocks = content[lang] || [];
    blocks.forEach(function(block){
      if (block.type === "heading") {
        var h = el("div",{css:{fontSize:"1.1rem",fontWeight:"800",color:ac,marginTop:"10px",fontFamily:"var(--font-display)"}});
        h.appendChild(highlightParse(block.text));
        body.appendChild(h);
      } else if (block.type === "bullet") {
        var row = el("div",{css:{display:"flex",gap:"10px",alignItems:"flex-start",fontSize:".92rem",lineHeight:"1.6",color:"var(--text)"}});
        row.appendChild(el("div",{css:{color:ac,fontWeight:"900",flexShrink:"0",marginTop:"1px"}},"•"));
        var txtDiv = el("div",{});
        txtDiv.appendChild(highlightParse(block.text));
        row.appendChild(txtDiv);
        body.appendChild(row);
      } else {
        var p = el("div",{css:{fontSize:".92rem",lineHeight:"1.7",color:"var(--text)"}});
        p.appendChild(highlightParse(block.text));
        body.appendChild(p);
      }
    });
  }

  hiBtn.onclick = function(){
    langState.lang = "hi";
    hiBtn.style.background = ac; hiBtn.style.color = "#fff";
    enBtn.style.background = "transparent"; enBtn.style.color = "var(--muted)";
    renderContent("hi");
  };
  enBtn.onclick = function(){
    langState.lang = "en";
    enBtn.style.background = ac; enBtn.style.color = "#fff";
    hiBtn.style.background = "transparent"; hiBtn.style.color = "var(--muted)";
    renderContent("en");
  };

  renderContent("hi"); // default view
  return w;
}

function pgFCMenu(){
  var s=sub, ac=AC[s], qs=QD[s]||[];
  var w=el("div",{cls:"fd",css:{maxWidth:"700px",margin:"0 auto"}});

  // Header
  var hdr=el("div",{css:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"32px",paddingBottom:"16px",borderBottom:"1.5px solid var(--border)"}});
  hdr.appendChild(el("button",{cls:"btn btng",css:{padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:"6px"},onclick:function(){go("sub");}},[svgIcon("back",{size:15}),el("span",{},"Back")]));
  hdr.appendChild(el("div",{css:{flex:"1"}},[
    el("div",{css:{fontSize:"1rem",fontWeight:"600"},txt:ICON[s]+" "+s+" \u00b7 Flashcards"}),
    el("div",{css:{fontSize:".75rem",color:"var(--subtle)",marginTop:"1px"},txt:qs.length+" cards available"})
  ]));
  w.appendChild(hdr);

  // Title
  var ttl=el("div",{css:{textAlign:"center",marginBottom:"32px"}});
  var ttlIcoWrap=el("div",{css:{display:"inline-flex",width:"52px",height:"52px",borderRadius:"16px",background:ac+"18",color:ac,alignItems:"center",justifyContent:"center",marginBottom:"14px"}});
  ttlIcoWrap.appendChild(svgIcon("cards",{size:26}));ttl.appendChild(ttlIcoWrap);
  ttl.appendChild(el("div",{css:{fontSize:"1.3rem",fontWeight:"800",fontFamily:"var(--font-display)",letterSpacing:"-.02em",marginBottom:"6px"},txt:"Choose Your Mode"}));
  ttl.appendChild(el("div",{css:{fontSize:".85rem",color:"var(--muted)"},txt:"How do you want to study today?"}));
  w.appendChild(ttl);

  // Classical Mode card
  var optClassic=el("div",{css:{
    background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:"20px",
    padding:"28px 24px",marginBottom:"16px",cursor:"pointer",
    transition:"all 0.2s",display:"flex",alignItems:"center",gap:"20px",
    boxShadow:"var(--shadow-card)"
  },onclick:function(){go("fc");}});
  optClassic.addEventListener("mouseenter",function(){this.style.borderColor=ac;this.style.transform="translateY(-2px)";this.style.boxShadow="0 8px 24px rgba(0,0,0,0.2)";});
  optClassic.addEventListener("mouseleave",function(){this.style.borderColor="var(--border)";this.style.transform="translateY(0)";this.style.boxShadow="var(--shadow-card)";});
  var iconClassic=el("div",{css:{
    width:"56px",height:"56px",borderRadius:"16px",flexShrink:"0",
    background:ac+"18",color:ac,display:"flex",alignItems:"center",justifyContent:"center"
  }});
  iconClassic.appendChild(svgIcon("cards",{size:26}));
  var infoClassic=el("div",{css:{flex:"1"}});
  infoClassic.appendChild(el("div",{css:{fontSize:"1.05rem",fontWeight:"700",marginBottom:"4px"},txt:"Classical Mode"}));
  infoClassic.appendChild(el("div",{css:{fontSize:".82rem",color:"var(--muted)",lineHeight:"1.5"},txt:"Browse cards one by one, search, add custom cards & use spaced repetition ratings."}));
  var tagsClassic=el("div",{css:{display:"flex",gap:"6px",marginTop:"10px",flexWrap:"wrap"}});
  [["search","Search"],["pencil","Custom Cards"],["chart","SRS"]].forEach(function(t){
    var tag=el("span",{css:{display:"inline-flex",alignItems:"center",gap:"4px",fontSize:".7rem",padding:"3px 8px",borderRadius:"6px",background:ac+"14",color:ac,fontWeight:"600"}});
    tag.appendChild(svgIcon(t[0],{size:11}));tag.appendChild(el("span",{},t[1]));
    tagsClassic.appendChild(tag);
  });
  infoClassic.appendChild(tagsClassic);
  optClassic.appendChild(iconClassic);
  optClassic.appendChild(infoClassic);
  optClassic.appendChild(svgIcon("forward",{size:18,color:"var(--subtle)"}));
  w.appendChild(optClassic);

  // Swipe Mode card
  var optSwipe=el("div",{css:{
    background:"var(--card)",border:"1.5px solid var(--border)",borderRadius:"20px",
    padding:"28px 24px",marginBottom:"16px",cursor:"pointer",
    transition:"all 0.2s",display:"flex",alignItems:"center",gap:"20px",
    boxShadow:"var(--shadow-card)"
  },onclick:function(){go("swipefc");}});
  optSwipe.addEventListener("mouseenter",function(){this.style.borderColor="#8b5cf6";this.style.transform="translateY(-2px)";this.style.boxShadow="0 8px 24px rgba(0,0,0,0.2)";});
  optSwipe.addEventListener("mouseleave",function(){this.style.borderColor="var(--border)";this.style.transform="translateY(0)";this.style.boxShadow="var(--shadow-card)";});
  var iconSwipe=el("div",{css:{
    width:"56px",height:"56px",borderRadius:"16px",flexShrink:"0",
    background:"rgba(139,92,246,0.12)",color:"#8b5cf6",display:"flex",alignItems:"center",justifyContent:"center"
  }});
  iconSwipe.appendChild(svgIcon("bolt",{size:24}));
  var infoSwipe=el("div",{css:{flex:"1"}});
  infoSwipe.appendChild(el("div",{css:{fontSize:"1.05rem",fontWeight:"700",marginBottom:"4px"},txt:"Swipe Mode"}));
  infoSwipe.appendChild(el("div",{css:{fontSize:".82rem",color:"var(--muted)",lineHeight:"1.5"},txt:"Shorts-style vertical swipe cards. Tap to flip, then rate Hard / Good / Easy."}));
  var tagsSwipe=el("div",{css:{display:"flex",gap:"6px",marginTop:"10px",flexWrap:"wrap"}});
  [["tap","Tap to Flip"],["frown","Hard"],["thumb","Good"],["flame","Easy"]].forEach(function(t){
    var tag=el("span",{css:{display:"inline-flex",alignItems:"center",gap:"4px",fontSize:".7rem",padding:"3px 8px",borderRadius:"6px",background:"rgba(139,92,246,0.1)",color:"#8b5cf6",fontWeight:"600"}});
    tag.appendChild(svgIcon(t[0],{size:11}));tag.appendChild(el("span",{},t[1]));
    tagsSwipe.appendChild(tag);
  });
  infoSwipe.appendChild(tagsSwipe);
  optSwipe.appendChild(iconSwipe);
  optSwipe.appendChild(infoSwipe);
  optSwipe.appendChild(svgIcon("forward",{size:18,color:"var(--subtle)"}));
  w.appendChild(optSwipe);

  return w;
}

function pgFC(){
  var s=sub,ac=AC[s],allQ=QD[s]||[];
  // Apply Active Topic Filter
  if (window.activeTopic) {
      allQ = allQ.filter(function(q) {
          return q.topic && q.topic.toLowerCase().trim() === window.activeTopic.toLowerCase().trim();
      });
  }
  var pool=shuf(allQ),idx=0,fl=false,srch="",tab="browse";
  var sv=Sv.get("fc_"+s)||{c:[],k:{}};var custom=sv.c,known=sv.k;
  function persist(){Sv.set("fc_"+s,{c:custom,k:known});}
  var w=el("div",{css:{maxWidth:"700px",margin:"0 auto"}});
  
  var sessionTime = 0;
  var timerInt = setInterval(function(){
    if(pg !== "fc") { clearInterval(timerInt); return; } 
    sessionTime++;
    var te = document.getElementById("fc-timer-txt");
    if(te) {
      var m = Math.floor(sessionTime/60);
      var sec = sessionTime%60;
      te.textContent = m + ":" + (sec<10?"0":"")+sec;
    }
  }, 1000);

  function getF(){var sc=srch.trim().toLowerCase();return sc?pool.map(function(q){return{id:q.q.slice(0,35),q:q.q,a:q.o[q.a],orig:q};}).filter(function(c){return c.q.toLowerCase().indexOf(sc)>=0||c.a.toLowerCase().indexOf(sc)>=0;}):pool.map(function(q){return{id:q.q.slice(0,35),q:q.q,a:q.o[q.a],orig:q};});}
  
  function build(){
    w.innerHTML="";
    var fc=getF(),si=fc.length?idx%fc.length:0,card=fc[si]||null,isK=card&&known[card.id];
    var isBm=card?isBookmarked(s,card.q):false; 
    var kc=Object.keys(known).filter(function(k){return known[k];}).length;
    
    var hdr=el("div",{css:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px",paddingBottom:"16px",borderBottom:"1.5px solid var(--border)"}});
    hdr.appendChild(el("button",{cls:"btn btng",css:{padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:"6px"},onclick:function(){go("sub");}},[svgIcon("back",{size:15}),el("span",{},"Back")]));
    var hInfo = el("div",{css:{flex:"1"}});
    hInfo.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"600"},txt:ICON[s]+" "+s+" \u00b7 Flashcards"}));
    var hSub = el("div",{css:{fontSize:".75rem",color:"var(--subtle)",marginTop:"1px",display:"flex",alignItems:"center",gap:"10px"}});
    hSub.appendChild(el("span",{},(pool.length+custom.length)+" cards \u00b7 "+kc+" known"));
    var timerBadge=el("span",{id:"fc-timer",css:{display:"inline-flex",alignItems:"center",gap:"4px",color:"var(--accent)",fontWeight:"600",background:"var(--bg2)",padding:"2px 8px",borderRadius:"6px"}});
    timerBadge.appendChild(svgIcon("clock",{size:11}));
    timerBadge.appendChild(el("span",{id:"fc-timer-txt"},Math.floor(sessionTime/60)+":"+(sessionTime%60<10?"0":"")+(sessionTime%60)));
    hSub.appendChild(timerBadge);
    hInfo.appendChild(hSub);
    hdr.appendChild(hInfo);
    hdr.appendChild(el("span",{css:{fontSize:".75rem",color:ac,background:ac+"22",padding:"4px 10px",borderRadius:"6px",fontWeight:"500"},txt:fc.length+" cards"}));
    w.appendChild(hdr);
    
    var tb=el("div",{css:{display:"flex",gap:"4px",background:"var(--bg2)",padding:"4px",borderRadius:"8px",marginBottom:"18px",width:"fit-content"}});
    ["browse","add"].forEach(function(t){tb.appendChild(el("button",{css:{padding:"6px 14px",borderRadius:"6px",fontSize:".8rem",fontWeight:"500",cursor:"pointer",fontFamily:"inherit",background:tab===t?"var(--card)":"transparent",color:tab===t?"var(--text)":"var(--subtle)",border:tab===t?"1px solid var(--border2)":"none"},onclick:function(){tab=t;build();}},t==="browse"?"Browse":"+ Add Card"));});
    w.appendChild(tb);
    
    if(tab==="browse"){
      var sr=el("div",{css:{display:"flex",gap:"8px",alignItems:"center",marginBottom:"16px"}});
      var inp=el("input",{cls:"inp",placeholder:"Search "+s+"...",value:srch,type:"text",css:{flex:"1"}});
      inp.addEventListener("input",function(e){srch=e.target.value;idx=0;fl=false;build();});
      sr.appendChild(inp);sr.appendChild(el("span",{css:{fontSize:".8rem",color:"var(--subtle)",whiteSpace:"nowrap"},txt:(si+1)+"/"+fc.length}));w.appendChild(sr);
      
      var cw = el("div", {
          cls: "cw",
          onclick: function() {
              fl = !fl;
              ci.className = "ci" + (fl ? " fl" : "");
              var std = document.getElementById('srs-standard-btns');
              var rat = document.getElementById('srs-rating-btns');
              if(std && rat) {
                  std.style.display = fl ? 'none' : 'flex';
                  rat.style.display = fl ? 'flex' : 'none';
              }
          }
      });
      var ci = el("div", { cls: "ci" + (fl ? " fl" : "") });
      
      var cf = el("div", { cls: "cf" });
      cf.appendChild(el("div", { css: { fontSize: "1.05rem", lineHeight: "1.65", maxHeight: "170px", overflow: "hidden" }, txt: card ? card.q : "No cards" }));
      cf.appendChild(el("div", { css: { fontSize: ".75rem", color: "var(--subtle)", marginTop: "16px" }, txt: "Click to reveal answer" }));
      ci.appendChild(cf);
      
      var cbk = el("div", { cls: "cf cb", css: { borderColor: ac + "55" } });
      cbk.appendChild(el("div", { css: { fontSize: "1.15rem", fontWeight: "600", color: "#22c55e" }, txt: card ? card.a : "" }));
      if (isK) { var kBadge=el("div",{css:{display:"inline-flex",alignItems:"center",gap:"5px",marginTop:"14px",fontSize:".72rem",color:"#4ade80",background:"rgba(74,222,128,.15)",padding:"4px 10px",borderRadius:"6px"}}); kBadge.appendChild(svgIcon("check",{size:11})); kBadge.appendChild(el("span",{},"Next review pending")); cbk.appendChild(kBadge); }
      ci.appendChild(cbk);
      
      cw.appendChild(ci);
      w.appendChild(cw);

      var nr = el("div", {css: {width: "100%", marginTop: "12px"}});

      var stdBtns = el("div", {id: "srs-standard-btns", css: {display: fl ? "none" : "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap"}});
      stdBtns.appendChild(el("button", {cls: "btn", css:{display:"inline-flex",alignItems:"center",gap:"6px"}, onclick: function(){ idx = (idx - 1 + Math.max(1, fc.length)) % Math.max(1, fc.length); fl = false; build(); }}, [svgIcon("back",{size:13}),el("span",{},"Prev")]));
      stdBtns.appendChild(el("button", {cls: "btn", css: {display:"inline-flex",alignItems:"center",gap:"6px",color: isBm ? "#f59e0b" : "", borderColor: isBm ? "#f59e0b" : ""}, onclick: function(){ if(!card) return; toggleBookmark(s, card.orig); build(); }}, [svgIcon(isBm?"star":"starOutline",{size:13}),el("span",{},isBm?"Saved":"Save")]));
      stdBtns.appendChild(el("button", {cls: "btn btnp", css:{display:"inline-flex",alignItems:"center",gap:"6px"}, onclick: function(){ idx = (idx + 1) % Math.max(1, fc.length); fl = false; build(); }}, [el("span",{},"Next"),svgIcon("forward",{size:13})]));
      
      var ratingBtns = el("div", {id: "srs-rating-btns", css: {display: fl ? "flex" : "none", flexDirection: "column", gap: "8px", width: "100%"}});
      ratingBtns.appendChild(el("div", {css: {textAlign: "center", fontSize: ".75rem", color: "var(--muted)", marginBottom: "4px"}}, "How hard was this to remember?"));
      var rRow = el("div", {css: {display: "flex", gap: "10px", width: "100%"}});
      
      var rateCard = function(days, msg) {
        if(!card) return; known[card.id] = Date.now() + (days * 86400000); persist(); toast(msg);
        idx = (idx + 1) % Math.max(1, fc.length); fl = false; build();
      };
      
      rRow.appendChild(el("button", {cls: "btn btn-srs-hard", css: {flex: "1"}, onclick: function(){ rateCard(1, "Review tomorrow"); }}, "Hard (1d)"));
      rRow.appendChild(el("button", {cls: "btn btn-srs-good", css: {flex: "1"}, onclick: function(){ rateCard(3, "Review in 3 days"); }}, "Good (3d)"));
      rRow.appendChild(el("button", {cls: "btn btn-srs-easy", css: {flex: "1"}, onclick: function(){ rateCard(7, "Review in 7 days"); }}, "Easy (7d)"));
      
      ratingBtns.appendChild(rRow);
      nr.appendChild(stdBtns);
      nr.appendChild(ratingBtns);
      
      w.appendChild(nr);
      var pb=el("div",{cls:"pb",css:{marginTop:"16px"}});pb.appendChild(el("div",{cls:"pf",css:{width:(fc.length?((si+1)/fc.length)*100:0)+"%",background:ac}}));w.appendChild(pb);
    } else {
      var aw=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"20px"}});
      aw.appendChild(el("div",{css:{fontSize:".85rem",fontWeight:"500",marginBottom:"16px"},txt:"Create a custom flashcard"}));
      var ag=el("div",{css:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"12px"}});
      var qta=el("textarea",{cls:"inp",placeholder:"Write your question...",rows:"4",css:{resize:"vertical"}});
      var ata=el("textarea",{cls:"inp",placeholder:"Correct answer...",rows:"4",css:{resize:"vertical"}});
      ag.appendChild(el("div",{},[el("div",{css:{fontSize:".75rem",color:"var(--subtle)",marginBottom:"6px"},txt:"Question"}),qta]));
      ag.appendChild(el("div",{},[el("div",{css:{fontSize:".75rem",color:"var(--subtle)",marginBottom:"6px"},txt:"Answer"}),ata]));
      aw.appendChild(ag);
      aw.appendChild(el("button",{cls:"btn btnp",css:{width:"100%"},onclick:function(){if(!qta.value.trim()||!ata.value.trim()){toast("Fill both fields","#f87171");return;}custom.push({q:qta.value.trim(),a:ata.value.trim()});persist();toast("Card added!");qta.value="";ata.value="";build();}},"Add Flashcard"));
      if(custom.length)aw.appendChild(el("div",{css:{marginTop:"10px",fontSize:".75rem",color:"var(--subtle)"},txt:custom.length+" custom card"+(custom.length>1?"s":"")+" saved"}));
      w.appendChild(aw);
      if(custom.length){var cl=el("div",{css:{marginTop:"16px"}});custom.forEach(function(c){cl.appendChild(el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px 14px",marginBottom:"6px"}},[el("div",{css:{fontSize:".85rem",fontWeight:"500",marginBottom:"4px"},txt:c.q}),el("div",{css:{fontSize:".8rem",color:ac},txt:c.a})]));});w.appendChild(cl);}
    }
  }
  build();return w;
}

function pgQZ(){
  var s=sub,ac=AC[s],allQ=QD[s]||[];
  // Apply Active Topic Filter
  if (window.activeTopic) {
      allQ = allQ.filter(function(q) {
          return q.topic && q.topic.toLowerCase().trim() === window.activeTopic.toLowerCase().trim();
      });
  }
  var qst="home",pool=[],qi=0,sc=0,sk=0,ch=null,isSk=false,cnt=25,wrong=[],sRev=false,sHist=false;
  var sv=Sv.get("qz_"+s)||{best:null,att:0,h:[]};var best=sv.best,att=sv.att,hist=sv.h||[];
  function persist(){Sv.set("qz_"+s,{best:best,att:att,h:hist});}
  var L=["A","B","C","D"];
  var w=el("div",{css:{maxWidth:"700px",margin:"0 auto"}});
  var lock=false; 

  // Timer State
  var isTimed = false;
  var timeTaken = 0;
  var timeLimit = 0;
  var timerInt = null;

  // Challenge State
  var isChallenge = window.challengeData && window.challengeData.s === s;
  var chal = window.challengeData;

  // --- NEW: RPG SKILL TREE STATE ---
  var isSkillMode = !!window.activeSkillNode;
  var skillNode = window.activeSkillNode;
  
  if (isSkillMode) {
      // Find questions that match the exact topic name
      var filtered = allQ.filter(function(q) { 
          return q.topic === skillNode.title || (q.tags && q.tags.includes(skillNode.title)); 
      });
      // Fallback: If your questions aren't tagged with 'topic' in the database yet, 
      // just grab 15 random questions to represent the "Boss Fight"
      if (filtered.length < 5) {
          filtered = shuf(allQ).slice(0, 15); 
      }
      allQ = filtered;
  }
  // ---------------------------------

  function fmt(sec){ var m=Math.floor(sec/60), secR=sec%60; return m+":"+(secR<10?"0":"")+secR; }

  function finishQuiz() {
    if(timerInt) clearInterval(timerInt);
    var pct=pool.length?Math.round((sc/pool.length)*100):0;
    hist=[{date:new Date().toLocaleDateString("en-IN"),pct:pct,correct:sc,skipped:sk,total:pool.length}].concat(hist).slice(0,15);
    if(best===null||pct>best){best=pct;if(pct>0 && !isSkillMode)toast("New best: "+pct+"%!");}
    if(pct === 100) throwConfetti(); 
    persist(); 
    
    // --- EVALUATE SKILL TREE PROGRESS ---
    if (isSkillMode) {
        if (pct >= 80) {
            var userProgress = Sv.get("rpg_progress") || {};
            userProgress[skillNode.id] = true;
            Sv.set("rpg_progress", userProgress);
            toast("Mastery Achieved! Next level unlocked.", "#10b981");
        } else {
            toast("You scored " + pct + "%. You need 80% to master this topic. Try again!", "#ef4444");
        }
    }
    // ------------------------------------

    qst="result"; build();
  }

  function adv(){
    qi++;
    if(qi>=pool.length) finishQuiz();
    else { ch=null; isSk=false; build(); }
  }
  
  function build(){
    w.innerHTML="";
    var hdr=el("div",{css:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px",paddingBottom:"16px",borderBottom:"1.5px solid var(--border)"}});
    hdr.appendChild(el("button",{cls:"btn btng",css:{padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:"6px"},onclick:function(){
      if(window.qzTimeout) clearTimeout(window.qzTimeout); 
      if(isChallenge) { window.challengeData = null; } 
      if(isSkillMode) { window.activeSkillNode = null; go("skilltree"); return; } // Go back to Map
      go("sub");
    }},[svgIcon("back",{size:15}),el("span",{},"Back")]));
    hdr.appendChild(el("div",{css:{flex:"1"}},[
      el("div",{css:{fontSize:"1rem",fontWeight:"600"},txt:ICON[s]+" "+s+(isChallenge?" \u00b7 Challenge":(isSkillMode?" \u00b7 Mastery Challenge":" \u00b7 Quiz"))}),
      el("div",{css:{fontSize:".75rem",color:"var(--subtle)",marginTop:"1px"},txt:isChallenge?"Target: "+chal.sc+" points":allQ.length+" questions available"})
    ]));
    if(qst==="playing")hdr.appendChild(el("span",{css:{fontSize:".8rem",color:"var(--subtle)"},txt:sc+" correct \u00b7 "+sk+" skipped"}));
    w.appendChild(hdr);
    
    if(qst==="home"){
      var hw=el("div",{cls:"fd"});
      
      if(isChallenge) {
         // --- CHALLENGE HOME SCREEN ---
         var cbox=el("div",{css:{background:"linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.08))",border:"1px solid #f59e0b",borderRadius:"16px",padding:"36px 24px",textAlign:"center",marginBottom:"24px",boxShadow:"0 8px 24px rgba(245,158,11,0.15)"}});
         var cboxIco=el("div",{css:{display:"inline-flex",width:"64px",height:"64px",borderRadius:"18px",background:"rgba(245,158,11,0.14)",color:"#f59e0b",alignItems:"center",justifyContent:"center",marginBottom:"14px"}});
         cboxIco.appendChild(svgIcon("sword",{size:32}));cbox.appendChild(cboxIco);
         cbox.appendChild(el("div",{css:{fontSize:"1.6rem",fontWeight:"800",marginBottom:"8px",color:"var(--text)"},txt:chal.n + " challenged you!"}));
         cbox.appendChild(el("div",{css:{fontSize:".95rem",color:"var(--muted)",marginBottom:"28px",lineHeight:"1.6"},txt:"They scored "+chal.sc+" out of "+chal.q.length+" in this exact quiz. Do you have what it takes to beat them?"}));
         
         cbox.appendChild(el("button",{cls:"btn btnp",css:{width:"100%",padding:"14px",fontSize:"1.05rem",borderRadius:"10px",background:"linear-gradient(135deg, #f59e0b, #ef4444)",border:"none",boxShadow:"0 4px 14px rgba(245,158,11,0.3)"},onclick:function(){
            pool = chal.q.map(function(i){ return allQ[i]; }).filter(Boolean);
            qi=0;sc=0;sk=0;ch=null;isSk=false;wrong=[];sRev=false;att++;
            qst="playing"; lock=true; 
            if(timerInt) clearInterval(timerInt);
            timeTaken = 0; isTimed = false; 
            timerInt = setInterval(function(){
                if(pg !== "qz") { clearInterval(timerInt); return; }
                timeTaken++;
                var te = document.getElementById("qz-timer-txt");
                if(te) te.textContent = fmt(timeTaken);
            }, 1000);
            build(); setTimeout(function(){ lock=false; }, 300);
         }},[el("span",{},"Accept Challenge "),svgIcon("rocket",{size:15})]));
         hw.appendChild(cbox);

      } else if (isSkillMode) {
         // --- SKILL TREE BOSS FIGHT SCREEN ---
         var skbox=el("div",{css:{background:"var(--card2)",border:"1.5px solid "+ac,borderRadius:"16px",padding:"36px 24px",textAlign:"center",marginBottom:"24px",boxShadow:"0 8px 24px "+ac+"33"}});
         skbox.appendChild(el("div",{css:{fontSize:"3.5rem",marginBottom:"12px"},txt:skillNode.icon}));
         skbox.appendChild(el("div",{css:{fontSize:"1.6rem",fontWeight:"800",marginBottom:"8px",color:"var(--text)",fontFamily:"var(--font-display)"},txt:skillNode.title + " Mastery"}));
         skbox.appendChild(el("div",{css:{fontSize:".95rem",color:"var(--muted)",marginBottom:"28px",lineHeight:"1.6"},txt:"Score 80% or higher on these "+allQ.length+" questions to master the topic and unlock the next level."}));
         
         skbox.appendChild(el("button",{cls:"btn btnp",css:{width:"100%",padding:"14px",fontSize:"1.05rem",borderRadius:"10px",background:ac,border:"none",boxShadow:"0 4px 14px "+ac+"40"},onclick:function(){
            pool = shuf(allQ).slice(0, Math.min(25, allQ.length)); 
            qi=0;sc=0;sk=0;ch=null;isSk=false;wrong=[];sRev=false;att++;
            qst="playing"; lock=true; 
            if(timerInt) clearInterval(timerInt);
            timeTaken = 0; isTimed = false; 
            timerInt = setInterval(function(){
                if(pg !== "qz") { clearInterval(timerInt); return; }
                timeTaken++;
                var te = document.getElementById("qz-timer-txt");
                if(te) te.textContent = fmt(timeTaken);
            }, 1000);
            build(); setTimeout(function(){ lock=false; }, 300);
         }},[el("span",{},"Start Mastery Test "),svgIcon("sword",{size:15})]));
         hw.appendChild(skbox);

      } else {
         // --- NORMAL HOME SCREEN ---
         var hi=el("div",{css:{display:"flex",alignItems:"center",gap:"16px",marginBottom:"28px"}});
         hi.appendChild(el("span",{css:{fontSize:"2.5rem"},txt:ICON[s]}));
         hi.appendChild(el("div",{},[el("div",{css:{fontSize:"1.25rem",fontWeight:"600",marginBottom:"2px"},txt:s+" Quiz"}),el("div",{css:{fontSize:".85rem",color:"var(--muted)"},txt:allQ.length+" questions, shuffled each time"})]));
         hw.appendChild(hi);
         var sg=el("div",{css:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"24px"}});
         [["Questions",allQ.length],["Sessions",att],["Best",best!==null?best+"%":"\u2014"]].forEach(function(r){sg.appendChild(el("div",{cls:"stb"},[el("div",{css:{fontSize:"1.35rem",fontWeight:"600",marginBottom:"4px"},txt:String(r[1])}),el("div",{css:{fontSize:".72rem",color:"var(--subtle)",textTransform:"uppercase"},txt:r[0]})]));});
         hw.appendChild(sg);
         
         var cg=el("div",{css:{marginBottom:"20px"}});cg.appendChild(el("div",{css:{fontSize:".8rem",color:"var(--subtle)",marginBottom:"10px"},txt:"Questions per session"}));
         var cr=el("div",{css:{display:"flex",gap:"6px",flexWrap:"wrap"}});
         [10,25,50,100].filter(function(n){return n<=allQ.length+5;}).forEach(function(n){cr.appendChild(el("button",{css:{padding:"7px 18px",borderRadius:"6px",border:"1px solid "+(cnt===n?ac:"var(--border)"),background:cnt===n?ac+"22":"var(--card)",color:cnt===n?ac:"var(--muted)",fontWeight:"500",fontSize:".85rem",cursor:"pointer",fontFamily:"inherit"},onclick:function(){cnt=n;build();}},String(n)));});
         cg.appendChild(cr);hw.appendChild(cg);
         
         var tmrG=el("div",{css:{marginBottom:"24px"}});
         tmrG.appendChild(el("div",{css:{fontSize:".8rem",color:"var(--subtle)",marginBottom:"10px"},txt:"Quiz Mode"}));
         var tmrR=el("div",{css:{display:"flex",gap:"6px",flexWrap:"wrap"}});
         var tOpts = [{lbl:"Untimed", val:false, ico:null}, {lbl:"Exam Mode (1 min/Q)", val:true, ico:"clock"}];
         tOpts.forEach(function(o){
           var content = o.ico ? [svgIcon(o.ico,{size:12}),el("span",{},o.lbl)] : o.lbl;
           tmrR.appendChild(el("button",{css:{display:"inline-flex",alignItems:"center",gap:"6px",padding:"7px 18px",borderRadius:"6px",border:"1px solid "+(isTimed===o.val?ac:"var(--border)"),background:isTimed===o.val?ac+"22":"var(--card)",color:isTimed===o.val?ac:"var(--muted)",fontWeight:"500",fontSize:".85rem",cursor:"pointer"},onclick:function(){isTimed=o.val;build();}},content));
         });
         tmrG.appendChild(tmrR); hw.appendChild(tmrG);
         
         hw.appendChild(el("button",{cls:"btn btnp",css:{width:"100%",padding:"12px",fontSize:"1rem",borderRadius:"10px",marginBottom:"20px"},onclick:function(){
           pool=shuf(allQ).slice(0,Math.min(cnt,allQ.length));qi=0;sc=0;sk=0;ch=null;isSk=false;wrong=[];sRev=false;att++;
           persist();qst="playing"; lock=true; 
           
           if(timerInt) clearInterval(timerInt);
           timeTaken = 0;
           timeLimit = isTimed ? cnt * 60 : 0; 
           timerInt = setInterval(function(){
               if(pg !== "qz") { clearInterval(timerInt); return; }
               timeTaken++;
               var te = document.getElementById("qz-timer-txt");
               var tw = document.getElementById("qz-timer");
               if(te) {
                   if(isTimed) {
                       var rem = timeLimit - timeTaken;
                       te.textContent = fmt(rem);
                       if(rem <= 60 && tw) { tw.style.color = "#f87171"; tw.style.background = "rgba(248,113,113,0.1)"; }
                       if(rem <= 0) { clearInterval(timerInt); toast("Time's up!"); finishQuiz(); }
                   } else { te.textContent = fmt(timeTaken); }
               }
           }, 1000);
           
           build(); setTimeout(function(){ lock=false; }, 300);
         }},"Start Quiz"));
         
         if(hist.length){
           hw.appendChild(el("button",{cls:"btn",css:{width:"100%",justifyContent:"space-between",padding:"10px 14px"},onclick:function(){sHist=!sHist;build();}},[el("span",{},"Session History"),el("span",{},sHist?"\u25b2":"\u25bc")]));
           if(sHist){var hl=el("div",{css:{marginTop:"8px"}});hist.forEach(function(e){hl.appendChild(el("div",{cls:"hrow"},[el("span",{css:{color:"var(--subtle)"},txt:e.date}),el("span",{},e.correct+"/"+e.total+(e.skipped?" \u00b7 "+e.skipped+" skipped":"")),el("span",{css:{fontWeight:"600",color:e.pct>=60?"#4ade80":"#f87171"}},e.pct+"%")]));});hw.appendChild(hl);}
         }
      }
      w.appendChild(hw);
    } else if(qst==="playing"&&pool[qi]){
      var q=pool[qi],pw=el("div",{cls:"fd"});
      var pb=el("div",{cls:"pb"});pb.appendChild(el("div",{cls:"pf",css:{width:(qi/pool.length*100)+"%",background:isChallenge?"#f59e0b":ac}}));pw.appendChild(pb);
      var qbox=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"20px 22px",marginBottom:"16px"}});
      
      var qtop=el("div",{css:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}});
      var qtopL = el("div",{css:{display:"flex",alignItems:"center",gap:"10px"}});
      qtopL.appendChild(el("span",{css:{fontSize:".75rem",color:"var(--subtle)",textTransform:"uppercase",fontWeight:"500"},txt:"Q "+(qi+1)+" of "+pool.length}));
      var timerStr = isTimed ? fmt(timeLimit - timeTaken) : fmt(timeTaken);
      var isLowTime = isTimed && (timeLimit - timeTaken <= 60);
      var qzTimerBadge=el("span",{id:"qz-timer",css:{display:"inline-flex",alignItems:"center",gap:"4px",fontSize:".75rem",fontWeight:"700",color:isLowTime?"#f87171":"var(--accent)",background:isLowTime?"rgba(248,113,113,0.1)":"var(--bg2)",padding:"2px 8px",borderRadius:"6px"}});
      qzTimerBadge.appendChild(svgIcon(isLowTime?"alarm":"clock",{size:11}));
      qzTimerBadge.appendChild(el("span",{id:"qz-timer-txt"},timerStr));
      qtopL.appendChild(qzTimerBadge);
      qtop.appendChild(qtopL);
      
      var rside=el("div",{css:{display:"flex",alignItems:"center",gap:"10px"}});
      if(isSk)rside.appendChild(el("span",{css:{fontSize:".72rem",color:"var(--subtle)",background:"var(--bg2)",padding:"2px 8px",borderRadius:"4px"},txt:"Skipped"}));
      var isBm=isBookmarked(s, q.q);
      
      // AI and Bookmark Buttons
      var aiBtn = el("button", {cls: "icon-action-btn"});
      aiBtn.appendChild(svgIcon("bulb",{size:16}));
      aiBtn.onclick = function(e){ e.preventDefault(); openSarvamAIModal(q.q, q.o, q.a, s); };
      rside.appendChild(aiBtn);

      var bmBtn = el("button", {cls: "icon-action-btn" + (isBm ? " bm-active" : "")});
      bmBtn.appendChild(svgIcon(isBm?"star":"starOutline",{size:16}));
      bmBtn.onclick = function(e){ 
        e.preventDefault(); 
        isBm = toggleBookmark(s, q); 
        this.innerHTML = "";
        this.appendChild(svgIcon(isBm?"star":"starOutline",{size:16}));
        this.className = "icon-action-btn" + (isBm ? " bm-active" : "");
        this.style.transform = "scale(1.1)"; 
        var btn = this; setTimeout(function(){ btn.style.transform = ""; }, 200); 
      };
      rside.appendChild(bmBtn);
      qtop.appendChild(rside);

      qbox.appendChild(qtop);qbox.appendChild(el("div",{css:{fontSize:"1.05rem",lineHeight:"1.65"},txt:q.q}));pw.appendChild(qbox);
      var ol=el("div",{css:{marginBottom:"12px"}});
      q.o.forEach(function(opt,i){
        var cls="qo";if(ch!==null){if(i===q.a)cls+=" ok";else if(i===ch)cls+=" no";}
        var ob=el("button",{cls:cls,onclick:function(e){
          e.preventDefault(); if(ch!==null || isSk || lock) return;
          this.blur(); if (document.activeElement) document.activeElement.blur();
          
          lock = true; ch=i;
          if(i===q.a)sc++;else wrong.push({q:q.q,correct:q.o[q.a],chosen:opt,orig:q});
          build();
          
          window.qzTimeout = setTimeout(function(){ 
            adv(); setTimeout(function(){ lock=false; }, 300); 
          }, 1100);
        }});
        ob.appendChild(el("span",{css:{fontSize:".75rem",fontWeight:"600",color:"var(--subtle)",minWidth:"20px"},txt:L[i]+"."}));
        ob.appendChild(el("span",{},opt));
        if(ch!==null||isSk)ob.disabled=true;ol.appendChild(ob);
      });
      pw.appendChild(ol);
      
      if(ch===null&&!isSk)pw.appendChild(el("button",{cls:"btn btng",css:{width:"100%",fontSize:".85rem",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:"6px"},onclick:function(e){ 
        e.preventDefault(); if(lock) return; 
        this.blur(); if (document.activeElement) document.activeElement.blur();
        
        lock=true; isSk=true; sk++; build(); 
        window.qzTimeout = setTimeout(function(){ 
          adv(); setTimeout(function(){ lock=false; }, 300); 
        }, 500); 
      }},[svgIcon("skip",{size:14}),el("span",{},"Skip")]));
      w.appendChild(pw);
    } else if(qst==="result"){
      var pct=pool.length?Math.round((sc/pool.length)*100):0;
      var rw=el("div",{cls:"fd"});
      var rbox=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",padding:"32px 28px",marginBottom:"16px",textAlign:"center"}});
      
      if(isChallenge) {
         var won = sc > chal.sc;
         var tie = sc === chal.sc;
         var rcol = won ? "#4ade80" : (tie ? "#f59e0b" : "#f87171");
         var rIco=won?"trophy":(tie?"handshake":"skull");
         var rIcoWrap=el("div",{css:{display:"inline-flex",width:"48px",height:"48px",borderRadius:"14px",background:rcol+"1E",color:rcol,alignItems:"center",justifyContent:"center",marginBottom:"10px"}});
         rIcoWrap.appendChild(svgIcon(rIco,{size:24}));rbox.appendChild(rIcoWrap);
         rbox.appendChild(el("div",{css:{fontSize:"4rem",fontWeight:"700",color:rcol,lineHeight:"1",marginBottom:"8px"},txt:sc+" / "+pool.length}));
         rbox.appendChild(el("div",{css:{fontSize:"1.2rem",fontWeight:"700",marginBottom:"4px"},txt:won?"You beat "+chal.n+"!":(tie?"It's a tie!":chal.n+" wins!")}));
         rbox.appendChild(el("div",{css:{fontSize:".9rem",color:"var(--muted)",marginBottom:"20px"},txt:"Your Score: "+sc+" | Their Score: "+chal.sc}));
         window.challengeData = null; 
      } else {
         var rlbl=pct===100?"Perfect!":pct>=80?"Excellent!":pct>=60?"Good job!":pct>=40?"Keep practicing!":"Don't give up!";
         var rcol=pct>=60?"#4ade80":pct>=40?ac:"#f87171";
         rbox.appendChild(el("div",{css:{fontSize:"4rem",fontWeight:"700",color:rcol,lineHeight:"1",marginBottom:"8px"},txt:pct+"%"}));
         rbox.appendChild(el("div",{css:{fontSize:"1.1rem",fontWeight:"600",marginBottom:"4px"},txt:rlbl}));
         var rmeta=el("div",{css:{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",fontSize:".85rem",color:"var(--muted)",marginBottom:"20px",flexWrap:"wrap"}});
         rmeta.appendChild(el("span",{},sc+" correct \u00b7 "+(pool.length-sc-sk)+" wrong \u00b7 "+sk+" skipped \u00b7"));
         rmeta.appendChild(svgIcon("clock",{size:12}));
         rmeta.appendChild(el("span",{},fmt(timeTaken)));
         rbox.appendChild(rmeta);
         var bar=el("div",{css:{display:"flex",gap:"2px",height:"6px",borderRadius:"99px",overflow:"hidden",marginBottom:"24px"}});
         bar.appendChild(el("div",{css:{flex:String(sc),background:"#4ade80",borderRadius:"99px"}}));
         bar.appendChild(el("div",{css:{flex:String(Math.max(0,pool.length-sc-sk)),background:"#f87171",borderRadius:"99px"}}));
         bar.appendChild(el("div",{css:{flex:String(sk),background:"var(--border2)",borderRadius:"99px"}}));
         rbox.appendChild(bar);
      }

      var rbts=el("div",{css:{display:"flex",gap:"8px",justifyContent:"center",flexWrap:"wrap"}});
      
      if(!isChallenge && !isSkillMode) {
          var chalBtn = el("button",{cls:"btn btnp",css:{background:"linear-gradient(135deg, #f59e0b, #ef4444)", border:"none", boxShadow:"0 4px 14px rgba(245,158,11,0.3)", width:"100%", marginBottom:"8px"},onclick:function(){
             var qIndices = pool.map(function(q){ return allQ.indexOf(q); }).join('-');
             var uName = window.currentUser && window.currentUser.displayName ? window.currentUser.displayName : "A friend";
             var baseUrl = window.location.origin + window.location.pathname;
             var link = baseUrl + "?c=1&s=" + encodeURIComponent(s) + "&sc=" + sc + "&n=" + encodeURIComponent(uName) + "&q=" + qIndices;
             
             if(navigator.share) {
               navigator.share({title:"Beat my score!", text:"I scored " + sc + "/" + pool.length + " in " + s + " on StudyLab. Can you beat me?", url: link}).catch(function(){});
             } else if (navigator.clipboard && window.isSecureContext !== false) {
               navigator.clipboard.writeText(link).then(function(){ 
                   toast("Challenge link copied! Send it to your friends.", "#f59e0b"); 
               }).catch(function(){ prompt("Copy this link to challenge your friend:", link); });
             } else {
               prompt("Copy this link to challenge your friend:", link);
             }
          }},[svgIcon("sword",{size:14}),el("span",{},"Challenge a Friend to beat "+sc+"!")]); 
          chalBtn.style.display="inline-flex";chalBtn.style.alignItems="center";chalBtn.style.justifyContent="center";chalBtn.style.gap="8px";
          rbox.appendChild(chalBtn);
      }

      // Hide the 'New Quiz' button if they are doing an RPG Mastery challenge
      if (!isSkillMode) {
          rbts.appendChild(el("button",{cls:"btn btnp",css:{flex:"1",justifyContent:"center",display:"inline-flex",alignItems:"center",gap:"6px"},onclick:function(){
            pool=shuf(allQ).slice(0,Math.min(cnt,allQ.length));qi=0;sc=0;sk=0;ch=null;isSk=false;wrong=[];sRev=false;att++; persist();qst="playing"; lock=true; 
            if(timerInt) clearInterval(timerInt);
            timeTaken = 0; timeLimit = isTimed ? cnt * 60 : 0; 
            timerInt = setInterval(function(){
                if(pg !== "qz") { clearInterval(timerInt); return; }
                timeTaken++; var te = document.getElementById("qz-timer-txt"); var tw = document.getElementById("qz-timer");
                if(te) {
                    if(isTimed) {
                        var rem = timeLimit - timeTaken; te.textContent = fmt(rem);
                        if(rem <= 60 && tw) { tw.style.color = "#f87171"; tw.style.background = "rgba(248,113,113,0.1)"; }
                        if(rem <= 0) { clearInterval(timerInt); toast("Time's up!"); finishQuiz(); }
                    } else { te.textContent = fmt(timeTaken); }
                }
            }, 1000);
            build(); setTimeout(function(){ lock=false; }, 300);
          }},[svgIcon("refresh",{size:14}),el("span",{},"New Quiz")]));
      }

      rbts.appendChild(el("button",{cls:"btn",css:{flex:"1",justifyContent:"center",display:"inline-flex",alignItems:"center",gap:"6px"},onclick:function(){
          qst="home"; 
          if(isSkillMode) { window.activeSkillNode = null; go("skilltree"); return; }
          build();
      }}, [svgIcon("back",{size:14}),el("span",{},isSkillMode ? "Back to Skill Map" : "Home")]));
      
      rbox.appendChild(rbts);rw.appendChild(rbox);
      
      if(wrong.length){
        rw.appendChild(el("button",{cls:"btn",css:{width:"100%",justifyContent:"space-between",marginBottom:"8px"},onclick:function(){sRev=!sRev;build();}},[el("span",{},"Review "+wrong.length+" wrong answers"),el("span",{},sRev?"\u25b2":"\u25bc")]));
        if(sRev){wrong.forEach(function(ww){
          var isBmR=isBookmarked(s, ww.q);
          var revW=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"8px",padding:"14px",marginBottom:"8px",position:"relative"}});
          var rmBtnR=el("button",{css:{position:"absolute",top:"12px",right:"12px",background:"transparent",border:"none",cursor:"pointer",color:isBmR?"#f59e0b":"var(--subtle)"}});
          rmBtnR.appendChild(svgIcon(isBmR?"star":"starOutline",{size:16}));
          rmBtnR.onclick=function(){ isBmR=toggleBookmark(s, ww.orig); this.innerHTML=""; this.style.color=isBmR?"#f59e0b":"var(--subtle)"; this.appendChild(svgIcon(isBmR?"star":"starOutline",{size:16})); }; 
          revW.appendChild(rmBtnR);
          revW.appendChild(el("div",{css:{fontSize:".875rem",lineHeight:"1.55",marginBottom:"10px",paddingRight:"24px"},txt:ww.q}));
          var okRow=el("div",{css:{display:"flex",alignItems:"center",gap:"5px",fontSize:".8rem",color:"#4ade80",marginBottom:"4px"}});
          okRow.appendChild(svgIcon("check",{size:12}));okRow.appendChild(el("span",{},ww.correct));revW.appendChild(okRow);
          var noRow=el("div",{css:{display:"flex",alignItems:"center",gap:"5px",fontSize:".8rem",color:"#f87171"}});
          noRow.appendChild(svgIcon("cross",{size:12}));noRow.appendChild(el("span",{},ww.chosen));revW.appendChild(noRow);
          rw.appendChild(revW);
        });}
      }
      w.appendChild(rw);
    }
  }
  build();return w;
}

// --- NEW BOOKMARKS PAGE ---
function pgBookmarks(){
  var s=sub, ac=AC[s];
  var w=el("div",{cls:"fd",css:{maxWidth:"700px",margin:"0 auto"}});
  
  function build(){
    w.innerHTML="";
    var bms=getBookmarks(s);
    
    var hdr=el("div",{css:{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px",paddingBottom:"16px",borderBottom:"1.5px solid var(--border)"}});
    hdr.appendChild(el("button",{cls:"btn btng",css:{padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:"6px"},onclick:function(){go("sub");}},[svgIcon("back",{size:15}),el("span",{},"Back")]));
    hdr.appendChild(el("div",{css:{flex:"1"}},[
      el("div",{css:{fontSize:"1rem",fontWeight:"600"},txt:ICON[s]+" "+s+" \u00b7 Bookmarks"}),
      el("div",{css:{fontSize:".75rem",color:"var(--subtle)",marginTop:"1px"},txt:bms.length+" saved questions"})
    ]));
    w.appendChild(hdr);

    if(!bms.length){
      var emp=el("div",{css:{textAlign:"center",padding:"50px 20px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px"}});
      var empIco=el("div",{css:{display:"inline-flex",width:"56px",height:"56px",borderRadius:"16px",background:"rgba(245,158,11,0.12)",color:"#f59e0b",alignItems:"center",justifyContent:"center",marginBottom:"14px"}});
      empIco.appendChild(svgIcon("star",{size:26}));emp.appendChild(empIco);
      emp.appendChild(el("div",{css:{fontSize:"1.1rem",fontWeight:"600",marginBottom:"8px"},txt:"No bookmarks yet"}));
      var empDesc=el("div",{css:{fontSize:".85rem",color:"var(--muted)",marginBottom:"20px",display:"flex",alignItems:"center",justifyContent:"center",gap:"5px",flexWrap:"wrap"}});
      empDesc.appendChild(el("span",{},"Tap the"));empDesc.appendChild(svgIcon("starOutline",{size:13}));
      empDesc.appendChild(el("span",{},"icon during a quiz or flashcard session to save tricky questions here for quick revision."));
      emp.appendChild(empDesc);
      emp.appendChild(el("button",{cls:"btn btnp",onclick:function(){go("qz");}},"Start a Quiz"));
      w.appendChild(emp);
      return;
    }

    var lw=el("div",{cls:"fd"});
    bms.forEach(function(q){
      var card=el("div",{css:{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",padding:"22px",marginBottom:"14px",position:"relative",boxShadow:"var(--shadow-card)"}});
      
      // Remove Bookmark Button
      var rmBtn=el("button",{css:{position:"absolute",top:"18px",right:"18px",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"8px",cursor:"pointer",color:"#f59e0b",display:"flex",alignItems:"center",padding:"6px 8px",transition:"all 0.2s"}});
      rmBtn.appendChild(svgIcon("star",{size:15}));
      rmBtn.onmouseover = function() { this.innerHTML=""; this.appendChild(svgIcon("trash",{size:15})); this.style.color="#f87171"; this.style.borderColor = "#f87171"; };
      rmBtn.onmouseout = function() { this.innerHTML=""; this.appendChild(svgIcon("star",{size:15})); this.style.color="#f59e0b"; this.style.borderColor = "var(--border)"; };
      rmBtn.onclick=function(){ toggleBookmark(s, q); build(); };
      card.appendChild(rmBtn);
      
      // Question Text
      card.appendChild(el("div",{css:{fontSize:"1.05rem",fontWeight:"500",lineHeight:"1.6",paddingRight:"40px",marginBottom:"18px"},txt:q.q}));
      
      // Correct Answer Box
      var ansBox=el("div",{css:{background:"rgba(74,222,128,.08)",border:"1px solid rgba(74,222,128,.3)",borderRadius:"10px",padding:"14px 18px",color:"#4ade80"}});
      ansBox.appendChild(el("div",{css:{fontSize:".7rem",textTransform:"uppercase",fontWeight:"700",letterSpacing:".08em",marginBottom:"6px",color:"#34d399"},txt:"Correct Answer"}));
      ansBox.appendChild(el("div",{css:{fontWeight:"600",fontSize:".95rem"},txt:q.o[q.a] || q.a})); // Fallback just in case saved from custom FC
      card.appendChild(ansBox);
      
      lw.appendChild(card);
    });
    w.appendChild(lw);
  }
  
  build();
  return w;
}
// ═══════════════════════════════════════════════════════════════════
// SWIPE MODE — Shorts-style vertical flashcards per subject
// ═══════════════════════════════════════════════════════════════════
function pgSwipeFC() {
  var s = sub, ac = AC[s], allQ = QD[s] || [];
  // Apply Active Topic Filter
  if (window.activeTopic) {
      allQ = allQ.filter(function(q) {
          return q.topic && q.topic.toLowerCase().trim() === window.activeTopic.toLowerCase().trim();
      });
  }

  var bgGradients = {
    "History":                  "linear-gradient(135deg, #7c3aed, #4c1d95)",
    "Geography":                "linear-gradient(135deg, #059669, #064e3b)",
    "Environment & Ecology":    "linear-gradient(135deg, #16a34a, #14532d)",
    "Economy":                  "linear-gradient(135deg, #0284c7, #075985)",
    "Polity":                   "linear-gradient(135deg, #dc2626, #7f1d1d)",
    "Physics":                  "linear-gradient(135deg, #0ea5e9, #0c4a6e)",
    "Chemistry":                "linear-gradient(135deg, #f59e0b, #78350f)",
    "Biology":                  "linear-gradient(135deg, #84cc16, #365314)",
    "Science & Technology":     "linear-gradient(135deg, #6366f1, #312e81)",
    "Computer":                 "linear-gradient(135deg, #4f46e5, #1e1b4b)",
    "Art & Culture":            "linear-gradient(135deg, #db2777, #831843)",
    "Sports":                   "linear-gradient(135deg, #f97316, #7c2d12)",
    "Miscellaneous":            "linear-gradient(135deg, #64748b, #1e293b)"
  };
  var bg = bgGradients[s] || "linear-gradient(135deg, #4b5563, #1f2937)";

  // Build card data from QD[s]
  var cards = shuf(allQ).slice(0, 80).map(function(q) {
    var ans = q.o ? q.o[q.a] : (q.options ? q.options[q.a] : String(q.a));
    return {
      q: q.q || q.question || "",
      a: ans || "",
      extra: q.explanation || q.exp || q.desc || "Keep going!"
    };
  }).filter(function(c) { return c.q && c.a && c.a !== c.q; });

  if (!cards.length) {
    var empty = el("div", {css:{padding:"40px",textAlign:"center",color:"var(--muted)"}});
    var emptyIco=el("div",{css:{display:"inline-flex",marginBottom:"12px"}});
    emptyIco.appendChild(svgIcon("frown",{size:32}));empty.appendChild(emptyIco);
    empty.appendChild(el("div",{css:{fontSize:"1rem"}}, "No cards found for this subject."));
    return empty;
  }

  // Inject styles once
  if (!document.getElementById("swipefc-styles")) {
    var st = document.createElement("style");
    st.id = "swipefc-styles";
    st.innerHTML = [
      "@keyframes swipefc-bounce{0%,100%{transform:translate(-50%,0)}50%{transform:translate(-50%,-10px)}}",
      ".swipefc-front,.swipefc-back{position:absolute;width:100%;height:100%;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:24px;padding:28px 24px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.3);overflow:hidden;box-sizing:border-box;}",
      ".swipefc-back{transform:rotateY(180deg);background:var(--card);border:2px solid var(--border2);color:var(--text);}",
      ".swipefc-inner{width:100%;height:100%;position:relative;transition:transform 0.5s cubic-bezier(0.4,0,0.2,1);transform-style:preserve-3d;-webkit-transform-style:preserve-3d;}"
    ].join("");
    document.head.appendChild(st);
  }

  var w = el("div", {
    id: "swipefc-container",
    css: {
      height: "calc(100vh - 65px)",
      width: "100%",
      overflowY: "scroll",
      scrollSnapType: "y mandatory",
      background: "var(--bg)",
      position: "absolute",
      top: "0", left: "0", zIndex: "10"
    }
  });

  

  cards.forEach(function(item, idx) {
    var slide = el("div", {css:{
      height:"100%", width:"100%",
      scrollSnapAlign:"start",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"20px", position:"relative"
    }});

    var cardWrap = el("div", {css:{
      width:"100%", maxWidth:"420px",
      height:"clamp(300px, 65vh, 500px)",
      perspective:"1000px", cursor:"pointer"
    }});

    var cardInner = el("div", {cls:"swipefc-inner"});
    var flipped = false;
    cardWrap.onclick = function() {
      flipped = !flipped;
      cardInner.style.transform = flipped ? "rotateY(180deg)" : "rotateY(0deg)";
    };

    // Front
    var front = el("div", {cls:"swipefc-front", css:{background:bg}});
    front.appendChild(el("div", {css:{
      background:"rgba(255,255,255,0.18)", padding:"4px 14px", borderRadius:"20px",
      fontSize:".7rem", textTransform:"uppercase", letterSpacing:"1px",
      fontWeight:"700", marginBottom:"auto", color:"#fff"
    }}, s));
    var qSize = item.q.length > 180 ? "0.85rem" : item.q.length > 100 ? "1rem" : "1.25rem";
    front.appendChild(el("div", {css:{
      fontSize:qSize, fontWeight:"700", lineHeight:"1.6",
      margin:"auto 0", fontFamily:"var(--font-display)", color:"#fff",
      overflowY:"auto", maxHeight:"62%", wordBreak:"break-word", padding:"4px 2px"
    }}, item.q));
    var tapHint=el("div", {css:{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",fontSize:".8rem",opacity:"0.75",marginTop:"auto",color:"#fff"}});
    tapHint.appendChild(svgIcon("tap",{size:14}));tapHint.appendChild(el("span",{},"Tap to reveal"));
    front.appendChild(tapHint);

    // Back
    var back = el("div", {cls:"swipefc-back"});
    var aSize = item.a.length > 80 ? "1.1rem" : "1.45rem";
    back.appendChild(el("div", {css:{
      fontSize:aSize, fontWeight:"800", color:"var(--accent)",
      marginBottom:"14px", fontFamily:"var(--font-display)",
      lineHeight:"1.4", wordBreak:"break-word",
      overflowY:"auto", maxHeight:"38%"
    }}, item.a));
    var expWrap = el("div", {css:{maxHeight:"42%",overflowY:"auto",paddingRight:"4px"}});
    expWrap.appendChild(el("div", {css:{fontSize:".88rem",color:"var(--muted)",lineHeight:"1.6"}}, item.extra));
    back.appendChild(expWrap);



    cardInner.appendChild(front);
    cardInner.appendChild(back);
    cardWrap.appendChild(cardInner);
    slide.appendChild(cardWrap);

    // Swipe hint on first card
    if (idx === 0) {
      var hintEl=el("div", {css:{
        position:"absolute", bottom:"28px", left:"50%", transform:"translateX(-50%)",
        color:"var(--muted)", fontSize:".78rem", display:"flex",
        flexDirection:"column", alignItems:"center", gap:"2px",
        opacity:"0.65", animation:"swipefc-bounce 2s infinite"
      }});
      hintEl.appendChild(el("span",{},"Swipe up for next"));
      var chevWrap=el("div",{css:{transform:"rotate(-90deg)"}});
      chevWrap.appendChild(svgIcon("back",{size:16}));
      hintEl.appendChild(chevWrap);
      slide.appendChild(hintEl);
    }

    w.appendChild(slide);
  });

  // End slide
  var endSlide = el("div", {css:{
    height:"100%", width:"100%", scrollSnapAlign:"start",
    display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center",
    padding:"20px", textAlign:"center", color:"var(--text)"
  }});
  var endIco=el("div",{css:{display:"inline-flex",width:"64px",height:"64px",borderRadius:"18px",background:"var(--accent)"+"1E",color:"var(--accent)",alignItems:"center",justifyContent:"center",marginBottom:"14px"}});
  endIco.appendChild(svgIcon("confetti",{size:30}));endSlide.appendChild(endIco);
  endSlide.appendChild(el("div", {css:{fontSize:"1.4rem",fontWeight:"800",marginBottom:"8px"}}, "Session Done!"));
  endSlide.appendChild(el("div", {css:{fontSize:".9rem",color:"var(--muted)",marginBottom:"24px"}},
    "You reviewed " + cards.length + " flashcards."));
  var btnRow = el("div", {css:{display:"flex",gap:"10px",flexWrap:"wrap",justifyContent:"center"}});
  btnRow.appendChild(el("button", {
    css:{display:"inline-flex",alignItems:"center",gap:"7px",padding:"11px 22px",background:"var(--accent)",color:"#fff",border:"none",
      borderRadius:"12px",fontWeight:"700",cursor:"pointer",fontFamily:"var(--font-body)"},
    onclick: function(){ go("swipefc"); }
  }, [svgIcon("refresh",{size:15}),el("span",{},"New Batch")]));
  btnRow.appendChild(el("button", {
    css:{display:"inline-flex",alignItems:"center",gap:"7px",padding:"11px 22px",background:"var(--card)",color:"var(--text)",
      border:"1px solid var(--border2)",borderRadius:"12px",fontWeight:"600",
      cursor:"pointer",fontFamily:"var(--font-body)"},
    onclick: function(){ go("sub"); }
  }, [svgIcon("back",{size:14}),el("span",{},"Back")]));
  endSlide.appendChild(btnRow);
  w.appendChild(endSlide);

  return w;
}

// ═══════════════════════════════════════════════════════════════════
// PAGE-TOPICLIST.JS — Structured Syllabus Chapters
// ═══════════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════════
// PAGE-TOPICLIST.JS — Structured Syllabus Chapters (UPDATED)
// ═══════════════════════════════════════════════════════════════════

function pgTopicList() {
    var s = sub; 
    var d = typeof SD !== 'undefined' ? SD[s] : { color: "#3b82f6", topics: [] };
    var qs = (typeof QD !== 'undefined' && QD[s]) ? QD[s] : [];
    
    var w = el("div", { cls: "fd", css: { maxWidth: "760px", margin: "0 auto", paddingBottom: "60px" } });
    
    // Header
    var hdr = el("div", { css: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1.5px solid var(--border)" } });
    hdr.appendChild(el("button", { 
        cls: "btn btng", css: { padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "6px" }, 
        onclick: function() { window.activeTopic = null; go("home"); } 
    }, [svgIcon("back", {size: 15}), el("span", {}, "Home")]));
    
    var hInfo = el("div", { css: { flex: "1" } });
    var headerIcon = typeof ICON !== 'undefined' && ICON[s] ? ICON[s] : "📚";
    hInfo.appendChild(el("div", { css: { fontSize: "1.2rem", fontWeight: "800", fontFamily: "var(--font-display)", color: "var(--text)" }, txt: headerIcon + " " + s }));
    hInfo.appendChild(el("div", { css: { fontSize: ".8rem", color: "var(--subtle)" }, txt: "Select a topic to master" }));
    hdr.appendChild(hInfo);
    w.appendChild(hdr);
    
    // Topics List Container
    var listWrap = el("div", { css: { display: "flex", flexDirection: "column", gap: "12px" } });
    
    // 🎯 NEW LOGIC: Merge Hardcoded Topics with Dynamic Sheet Topics
    var combinedTopics = [];
    
    // Step 1: Add hardcoded topics from page-home.js
    if (d && d.topics) {
        d.topics.forEach(function(t) {
            if (t && !combinedTopics.includes(t)) combinedTopics.push(t);
        });
    }
    
    // Step 2: Scan Google Sheets data for new unique topics
    qs.forEach(function(q) {
        var qTopic = q.topic ? q.topic.trim() : "";
        if (qTopic && !combinedTopics.includes(qTopic)) {
            combinedTopics.push(qTopic);
        }
    });

    if (combinedTopics.length > 0) {
        combinedTopics.forEach(function(topicName, idx) {
            
            // Count exactly how many questions exist for this specific topic
            var tq = qs.filter(function(q) {
                return q.topic && q.topic.toLowerCase().trim() === topicName.toLowerCase().trim();
            });
            var count = tq.length;
            var hasRead = typeof RD !== 'undefined' && RD[s] && RD[s][topicName];
            var unlocked = count > 0 || hasRead;
            
            var card = el("div", {
                css: {
                    background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "16px",
                    padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)", 
                    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)"
                },
                onclick: function() {
                    if (!unlocked) {
                        if(typeof toast === 'function') toast("Content for this topic is being added soon!", "#f59e0b");
                        else alert("Content coming soon!");
                        return;
                    }
                    window.activeTopic = topicName;
                    go("sub", s); // Navigate to the Study Menu (Read/Quiz/Flashcards)
                }
            });
            
            // Hover Effects
            card.addEventListener("mouseenter", function() { 
                if(unlocked) {
                    this.style.transform = "translateY(-3px)"; 
                    this.style.borderColor = d.color; 
                    this.style.background = "var(--card2)";
                    this.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                }
            });
            card.addEventListener("mouseleave", function() { 
                this.style.transform = "translateY(0)"; 
                this.style.borderColor = "var(--glass-border)"; 
                this.style.background = "var(--glass-bg)";
                this.style.boxShadow = "none";
            });
            
            var leftSide = el("div", { css: { display: "flex", alignItems: "center", gap: "16px" } });
            
            // Topic Number Badge
            var numberBadge = el("div", {
                css: {
                    width: "44px", height: "44px", borderRadius: "12px", background: unlocked ? d.color + "15" : "var(--bg2)",
                    border: "1px solid " + (unlocked ? d.color + "40" : "var(--border)"), display: "flex", 
                    alignItems: "center", justifyContent: "center", fontSize: "1.1rem", fontWeight: "800", 
                    color: unlocked ? d.color : "var(--subtle)", fontFamily: "var(--font-display)"
                },
                txt: (idx + 1)
            });
            leftSide.appendChild(numberBadge);
            
            var textCol = el("div", { css: { display: "flex", flexDirection: "column" } });
            textCol.appendChild(el("div", { css: { fontSize: "1.05rem", fontWeight: "700", color: unlocked ? "var(--text)" : "var(--muted)", marginBottom: "4px", fontFamily: "var(--font-body)", lineHeight: "1.3" }, txt: topicName }));
            
            // Status Tag — show what's actually available (Notes and/or Questions)
            var statusParts = [];
            if (hasRead) statusParts.push("Notes");
            if (count > 0) statusParts.push(count + " Questions");
            var statusTag = el("div", { css: { fontSize: ".75rem", fontWeight: "600", color: unlocked ? "var(--subtle)" : "#f59e0b" } });
            statusTag.textContent = unlocked ? statusParts.join(" · ") : "Coming Soon ⏳";
            textCol.appendChild(statusTag);
            
            leftSide.appendChild(textCol);
            card.appendChild(leftSide);
            
            var rightSide = el("div", { css: { fontSize: "1.2rem", color: unlocked ? d.color : "var(--border2)", fontWeight: "800" }, txt: "→" });
            card.appendChild(rightSide);
            
            listWrap.appendChild(card);
        });
    } else {
        listWrap.appendChild(el("div", { css: { padding: "40px", textAlign: "center", color: "var(--muted)" }, txt: "No topics configured for this subject yet." }));
    }
    
    w.appendChild(listWrap);
    return w;
}