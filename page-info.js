// ─── SVG ICON SYSTEM (About Page) ───────────────────────────────────
// Minimal stroke-based icon set, matches app-wide SVG icon convention.
// Usage: icoAbout("target", { size: 20, color: "var(--accent)" })
function icoAbout(name, opts) {
  opts = opts || {};
  var size = opts.size || 20;
  var color = opts.color || "currentColor";
  var sw = opts.strokeWidth || 1.8;

  var paths = {
    // ── Cost comparison ──
    cross: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>',
    // ── Mission / Vision ──
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="' + color + '"/>',
    telescope: '<path d="M4 18l7-9 9 5-13 7z"/><path d="M11 9l2.5-3.5L21 9.5 18.5 13"/><circle cx="6" cy="19.5" r="1.5"/>',
    // ── What's inside list ──
    book: '<path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13z"/><path d="M20 5.5C20 4.7 19.3 4 18.5 4H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13z"/>',
    openBook: '<path d="M12 6.5c-1.8-1.3-4.3-2-7-2v13c2.7 0 5.2.7 7 2 1.8-1.3 4.3-2 7-2V4.5c-2.7 0-5.2.7-7 2z"/><path d="M12 6.5v13"/>',
    map: '<path d="M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
    tree: '<path d="M12 3l4 5h-2.5l3.5 5h-3l3 5H7l3-5H7l3.5-5H8l4-5z"/><path d="M12 19v2.5"/>',
    quiz: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.5 2.5 0 1 1 3.6 2.2c-.9.5-1.1.9-1.1 1.8"/><circle cx="12" cy="16.5" r=".6" fill="' + color + '"/>',
    cards: '<rect x="3" y="8" width="13" height="10" rx="2" transform="rotate(-8 9 13)"/><rect x="7" y="6" width="13" height="10" rx="2" fill="var(--bg2)"/>',
    brain: '<path d="M9 4.5a3 3 0 0 0-3 3v.3A3 3 0 0 0 4.5 10.5a3 3 0 0 0 1 5.4A3 3 0 0 0 8.5 19a3 3 0 0 0 .5-.05V4.5z"/><path d="M15 4.5a3 3 0 0 1 3 3v.3a3 3 0 0 1 1.5 2.7 3 3 0 0 1-1 5.4A3 3 0 0 1 15.5 19a3 3 0 0 1-.5-.05V4.5z"/><path d="M9 8.5h6M9 12.5h6M9 16h6"/>',
    news: '<rect x="3.5" y="5" width="14" height="15" rx="1.5"/><path d="M17.5 8.5H20v9a2 2 0 0 1-2 2h-.5"/><path d="M6.5 8.5h8M6.5 11.5h8M6.5 14.5h5"/>',
    bell: '<path d="M12 4.5a5 5 0 0 0-5 5v3.2c0 .6-.2 1.2-.6 1.7L5 16.5h14l-1.4-2.1c-.4-.5-.6-1.1-.6-1.7V9.5a5 5 0 0 0-5-5z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    sword: '<path d="M14.5 3.5l6 6-9 9-3-3-2.5 2.5-1.5-1.5L6.5 14 4 11.5l1.5-1.5 9-9-.001.001z" transform="translate(0,0)"/><path d="M14.5 3.5L20.5 9.5M8 16l-3.5 3.5M3.5 20.5L5 19"/>',
    // ── Roadmap ──
    done: '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.6 2.6L16 9.3"/>',
    pending: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'
  };

  var body = paths[name] || paths.check;
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
}

function icoAboutEl(name, opts) {
  var d = el("div", {});
  d.innerHTML = icoAbout(name, opts);
  return d.firstChild;
}

// ─── REIMAGINED ABOUT PAGE ──────────────────────────────────────────
function pgAbout() {
  var w = el("div", { cls: "fd" });
  w.appendChild(makeNav("about"));
  
  var wrap = el("div", { 
      css: { 
          maxWidth: "760px", margin: "0 auto", paddingBottom: "60px", 
          position: "relative", zIndex: "1" 
      } 
  });

  // Dynamic Ambient Glow
  var bgGlow = el("div", {
    css: {
      position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)",
      width: "500px", maxWidth: "100vw", height: "500px", background: "radial-gradient(circle, var(--accent) 0%, transparent 60%)",
      opacity: "0.08", filter: "blur(80px)", pointerEvents: "none", zIndex: "-1"
    }
  });
  wrap.appendChild(bgGlow);

  var tot = (typeof SUBJ !== "undefined" && typeof QD !== "undefined")
    ? SUBJ.reduce(function(s, k) { return s + (QD[k] || []).length; }, 0)
    : 0;
  var subjCount = (typeof SUBJ !== "undefined") ? SUBJ.length : 0;

  // ── 1. Hero Section ──
  var hero = el("div", { css: { padding: "40px 20px 20px", textAlign: "center" } });
  
  var badge = el("div", {
      css: {
          display: "inline-block", padding: "6px 14px", borderRadius: "100px",
          background: "var(--bg2)", border: "1px solid var(--border)",
          fontSize: "0.7rem", fontWeight: "700", color: "var(--muted)",
          textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "20px"
      },
      txt: "About The Project"
  });
  hero.appendChild(badge);

  var heroTitle = el("div", { 
      css: { fontSize: "clamp(2.5rem, 6vw, 3.5rem)", fontWeight: "800", letterSpacing: "-0.04em", fontFamily: "var(--font-display)", marginBottom: "16px" } 
  });
  heroTitle.innerHTML = 'Study<span style="color:var(--accent)">Lab</span>';
  hero.appendChild(heroTitle);
  
  hero.appendChild(el("div", { 
      css: { fontSize: "1.1rem", color: "var(--muted)", lineHeight: "1.6", maxWidth: "500px", margin: "0 auto", fontWeight: "400" }, 
      txt: "Built by one aspirant, for every aspirant. No ads. No paywalls. Nothing to unlock." 
  }));
  wrap.appendChild(hero);

  // ── 2. Cost Comparison Strip ──
  var cmpBox = el("div", { css: { padding: "0 20px", marginBottom: "40px" } });
  var cmp = el("div", { 
      css: { 
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "16px",
          marginTop: "32px" 
      } 
  });

  // Typical Apps Card
  var cmpLeft = el("div", { 
      css: { 
          padding: "24px", background: "var(--card)", border: "1px solid var(--border)", 
          borderRadius: "16px", opacity: "0.8" 
      } 
  });
  cmpLeft.appendChild(el("div", { 
      css: { fontSize: ".75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: "700", marginBottom: "16px" }, 
      txt: "Typical exam apps" 
  }));
  var cmpLeftList = el("div", { css: { display: "flex", flexDirection: "column", gap: "10px" } });
  ["Ads between questions", "Mock tests behind paywall", "Recurring subscription"].forEach(function(t) {
    var row = el("div", { css: { display: "flex", alignItems: "center", gap: "10px", fontSize: ".9rem", color: "var(--muted)" } });
    var ic = icoAboutEl("cross", { size: 16, color: "var(--muted)" });
    ic.style.flexShrink = "0";
    row.appendChild(ic);
    row.appendChild(el("span", {}, t));
    cmpLeftList.appendChild(row);
  });
  cmpLeft.appendChild(cmpLeftList);
  cmp.appendChild(cmpLeft);

  // StudyLab Card
  var cmpRight = el("div", { 
      css: { 
          padding: "24px", background: "linear-gradient(145deg, var(--card2), var(--card))", 
          border: "1px solid var(--accent)", borderRadius: "16px", 
          boxShadow: "0 12px 32px rgba(59, 130, 246, 0.15)" 
      } 
  });
  cmpRight.appendChild(el("div", { 
      css: { fontSize: ".75rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: "800", marginBottom: "16px" }, 
      txt: "StudyLab" 
  }));
  var cmpRightList = el("div", { css: { display: "flex", flexDirection: "column", gap: "10px" } });
  ["Zero ads, ever", "Everything unlocked", "Free, always"].forEach(function(t) {
    var row = el("div", { css: { display: "flex", alignItems: "center", gap: "10px", fontSize: ".9rem", color: "var(--text)", fontWeight: "500" } });
    var ic = icoAboutEl("check", { size: 16, color: "var(--accent)" });
    ic.style.flexShrink = "0";
    row.appendChild(ic);
    row.appendChild(el("span", {}, t));
    cmpRightList.appendChild(row);
  });
  cmpRight.appendChild(cmpRightList);
  cmp.appendChild(cmpRight);
  
  cmpBox.appendChild(cmp);
  cmpBox.appendChild(el("div", { 
      css: { fontSize: ".8rem", color: "var(--muted)", fontWeight: "400", textAlign: "center", marginTop: "16px", fontStyle: "italic" }, 
      txt: "Built to stay free — for as long as StudyLab exists." 
  }));
  wrap.appendChild(cmpBox);

  // ── 3. Founder Note ──
  var founderWrap = el("div", { css: { padding: "0 20px", marginBottom: "40px" } });
  var founder = el("div", { 
      css: { 
          padding: "32px", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", 
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: "20px" 
      } 
  });
  founder.appendChild(el("div", { css: { fontSize: "1.8rem", color: "var(--accent)", marginBottom: "12px", fontFamily: "Georgia, serif" }, txt: "“" }));
  founder.appendChild(el("div", { 
      css: { fontSize: "1rem", color: "var(--text)", lineHeight: "1.8", fontWeight: "400", marginBottom: "20px", fontStyle: "italic" }, 
      txt: "During my own government exam preparation, I struggled to find a clean and distraction-free platform. Most study apps were filled with ads, paywalls, and unnecessary complexity. StudyLab was created to solve that problem and provide focused learning tools that every aspirant can access freely." 
  }));
  founder.appendChild(el("div", { css: { fontSize: ".85rem", color: "var(--muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }, txt: "— Aman, govt exam aspirant and developer" }));
  founderWrap.appendChild(founder);
  wrap.appendChild(founderWrap);

  // ── 4. Mission & Vision ──
  var mvWrap = el("div", { css: { padding: "0 20px", marginBottom: "40px" } });
  var mvBox = el("div", { css: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "16px" } });
  [
    {icon: "target", title: "Mission", text: "Make quality government exam preparation accessible, simple and completely free for every aspirant."},
    {icon: "telescope", title: "Vision", text: "Build India's most student-friendly learning platform powered by technology and focused learning."}
  ].forEach(function(item) {
    var card = el("div", { 
        css: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", transition: "transform 0.3s ease, border-color 0.3s ease" } 
    });
    card.addEventListener("mouseenter", function() { this.style.transform = "translateY(-4px)"; this.style.borderColor = "var(--accent)"; });
    card.addEventListener("mouseleave", function() { this.style.transform = "translateY(0)"; this.style.borderColor = "var(--border)"; });
    
    var iconWrap = el("div", { css: { width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg2)", borderRadius: "10px", marginBottom: "12px" } });
    iconWrap.appendChild(icoAboutEl(item.icon, { size: 20, color: "var(--accent)" }));
    card.appendChild(iconWrap);
    card.appendChild(el("div", { css: { fontWeight: "800", marginBottom: "8px", fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--text)" }, txt: item.title }));
    card.appendChild(el("div", { css: { fontSize: ".85rem", color: "var(--muted)", lineHeight: "1.6" }, txt: item.text }));
    mvBox.appendChild(card);
  });
  mvWrap.appendChild(mvBox);
  wrap.appendChild(mvWrap);

  // ── 5. At A Glance (Stats) ──
  var impactBox = el("div", { css: { padding: "0 20px", marginBottom: "40px" } });
  impactBox.appendChild(el("div", { css: { fontSize: ".75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: "700", marginBottom: "16px", textAlign: "center" }, txt: "Platform Stats" }));
  var impactGrid = el("div", { css: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" } });
  
  [[tot.toLocaleString(), "Questions"], [subjCount.toString(), "Subjects"], ["100%", "Free"], ["0", "Ads"]].forEach(function(item) {
    var card = el("div", { 
        css: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px 12px", textAlign: "center" } 
    });
    card.appendChild(el("div", { css: { fontSize: "1.8rem", fontWeight: "800", color: "var(--accent)", fontFamily: "var(--font-display)", marginBottom: "4px" }, txt: item[0] }));
    card.appendChild(el("div", { css: { fontSize: ".75rem", color: "var(--muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }, txt: item[1] }));
    impactGrid.appendChild(card);
  });
  impactBox.appendChild(impactGrid);
  impactBox.appendChild(el("div", { css: { fontSize: ".75rem", color: "var(--subtle)", marginTop: "16px", textAlign: "center" }, txt: "New questions are added on an hourly schedule." }));
  wrap.appendChild(impactBox);

  // ── 6. What's Inside ──
  var fboxWrap = el("div", { css: { padding: "0 20px", marginBottom: "40px" } });
  var fbox = el("div", { 
      css: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "20px", padding: "24px" } 
  });
  fbox.appendChild(el("div", { css: { fontSize: "1.2rem", color: "var(--text)", fontFamily: "var(--font-display)", fontWeight: "800", marginBottom: "20px" }, txt: "What's inside" }));
  
  var flist = el("div", { css: { display: "flex", flexDirection: "column", gap: "16px" } });
  [
    ["book", tot.toLocaleString() + "+ MCQs", "Curated and categorized across all subjects"],
    ["openBook", "Bilingual reading notes", "Structured notes in Hindi & English for every topic"],
    ["map", "Topic-wise navigation", "Browse each subject topic by topic, exam-syllabus style"],
    ["tree", "RPG skill tree", "Prerequisite-locked topic mastery for History & Polity"],
    ["quiz", "Quiz mode", "MCQ sessions with instant feedback"],
    ["cards", "Flashcards", "Classic tap-to-flip, plus a Shorts-style swipe mode"],
    ["brain", "AI doubt solver", "Instant answers to your study queries"],
    ["news", "Daily digest", "Live current affairs fetched daily"],
    ["bell", "Govt updates", "Live vacancies, admit cards via RSS"],
    ["chart", "Progress tracker", "Accuracy, streaks and subject breakdown"],
    ["sword", "Daily challenge", "Fresh mixed quiz every day"]
  ].forEach(function(f) {
    var row = el("div", { css: { display: "flex", alignItems: "center", gap: "12px" } });
    var iconBox = el("div", { css: { width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg2)", borderRadius: "10px", border: "1px solid var(--border)", flexShrink: "0" } });
    iconBox.appendChild(icoAboutEl(f[0], { size: 18, color: "var(--accent)" }));
    row.appendChild(iconBox);
    var textCol = el("div", { css: { display: "flex", flexDirection: "column" } });
    textCol.appendChild(el("div", { css: { fontSize: ".9rem", fontWeight: "700", color: "var(--text)" }, txt: f[1] }));
    textCol.appendChild(el("div", { css: { fontSize: ".8rem", color: "var(--muted)" }, txt: f[2] }));
    row.appendChild(textCol);
    flist.appendChild(row);
  });
  fbox.appendChild(flist);
  fboxWrap.appendChild(fbox);
  wrap.appendChild(fboxWrap);

  // ── 7. Roadmap ──
  var rmWrapArea = el("div", { css: { padding: "0 20px", marginBottom: "40px" } });
  var roadmap = el("div", { css: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "20px", padding: "24px" } });
  roadmap.appendChild(el("div", { css: { fontSize: "1.2rem", color: "var(--text)", fontFamily: "var(--font-display)", fontWeight: "800", marginBottom: "20px" }, txt: "Development Roadmap" }));
  
  var rmWrap = el("div", { css: { display: "flex", flexDirection: "column", gap: "12px" } });
  [
    ["AI doubt solver", true], ["Current affairs", true], ["Flashcards", true], ["Mobile app (installable PWA)", true],
    ["Bilingual reading notes", true], ["Topic-wise navigation", true], ["RPG skill tree", true],
    ["Full reading coverage — all subjects", false], ["PYQ analysis", false], ["Smart study planner", false], ["Revision scheduler", false], ["Mock test mode", false]
  ].forEach(function(t) {
    var row = el("div", { css: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "var(--card)", borderRadius: "12px", border: "1px solid var(--border)" } });
    var icon = icoAboutEl(t[1] ? "done" : "pending", { size: 18, color: t[1] ? "var(--accent)" : "var(--muted)" });
    row.appendChild(icon);
    row.appendChild(el("div", { css: { fontSize: ".9rem", fontWeight: t[1] ? "600" : "400", color: t[1] ? "var(--text)" : "var(--muted)" }, txt: t[0] }));
    if(!t[1]) row.appendChild(el("div", { css: { fontSize: ".7rem", color: "var(--accent)", marginLeft: "auto", fontWeight: "700", background: "var(--accent-glow)", padding: "4px 8px", borderRadius: "6px" }, txt: "PLANNED" }));
    rmWrap.appendChild(row);
  });
  roadmap.appendChild(rmWrap);
  rmWrapArea.appendChild(roadmap);
  wrap.appendChild(rmWrapArea);

  // ── 8. FAQ ──
  var faqWrapArea = el("div", { css: { padding: "0 20px", marginBottom: "40px" } });
  faqWrapArea.appendChild(el("div", { css: { fontSize: ".75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: "700", marginBottom: "16px", textAlign: "center" }, txt: "Frequently Asked Questions" }));
  
  var faqWrap = el("div", { css: { display: "flex", flexDirection: "column", gap: "12px" } });
  var faqs = [
    ["Is StudyLab free?", "Yes, completely free. No subscription, no hidden charges, no ads — ever."],
    ["Which exams is this useful for?", "Primarily for UPSC, SSC, RRB, State PCS and other competitive govt exams."],
    ["Are reading notes available in Hindi?", "Yes — most topics have full Hindi and English notes, switchable with a single tap wherever available."],
    ["Can I use it offline?", "Once loaded, most features work without internet. Govt updates and daily digest require a connection."],
    ["How often is new content added?", "Questions are added on an hourly automated schedule, and reading notes are being expanded topic by topic across all subjects."]
  ];
  
  var faqOpen = {};
  faqs.forEach(function(faq, i) {
    var item = el("div", { css: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", transition: "all 0.3s ease" } });
    var qrow = el("div", {
        css: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", cursor: "pointer", userSelect: "none" },
        onclick: function() {
            faqOpen[i] = !faqOpen[i];
            ans.style.display = faqOpen[i] ? "block" : "none";
            arrow.style.transform = faqOpen[i] ? "rotate(180deg)" : "rotate(0deg)";
            item.style.borderColor = faqOpen[i] ? "var(--accent)" : "var(--border)";
        }
    });
    qrow.appendChild(el("div", { css: { fontSize: ".95rem", fontWeight: "600", color: "var(--text)" }, txt: faq[0] }));
    var arrow = el("span", { css: { fontSize: ".8rem", color: "var(--muted)", transition: "transform 0.3s ease" }, txt: "▼" });
    qrow.appendChild(arrow);
    item.appendChild(qrow);
    
    var ans = el("div", { css: { padding: "0 20px 18px", fontSize: ".85rem", color: "var(--muted)", lineHeight: "1.6", display: "none" }, txt: faq[1] });
    item.appendChild(ans);
    faqWrap.appendChild(item);
  });
  faqWrapArea.appendChild(faqWrap);
  wrap.appendChild(faqWrapArea);

  // ── 9. Privacy ──
  var endWrap = el("div", { css: { padding: "0 20px", marginBottom: "40px" } });
  
  var privacy = el("div", { css: { background: "var(--card2)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px", textAlign: "center" } });
  privacy.appendChild(el("div", { css: { fontSize: ".8rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: ".1em", fontWeight: "700", marginBottom: "8px" }, txt: "Your Privacy" }));
  privacy.appendChild(el("div", { css: { fontSize: ".85rem", color: "var(--subtle)", lineHeight: "1.6" }, txt: "Your progress, streaks, and bookmarks are stored securely on your device. StudyLab does not sell or share your data." }));
  endWrap.appendChild(privacy);
  wrap.appendChild(endWrap);

  // ── 10. Footer Note ──
  var fnote = el("div", { css: { textAlign: "center", padding: "10px 20px 40px", color: "var(--subtle)", fontSize: ".8rem", lineHeight: "1.7" } });
  fnote.appendChild(el("div", { css: { marginBottom: "4px" }, txt: "Made with Love and care by Aman — a fellow aspirant, for all aspirants." }));
  fnote.appendChild(el("div", {}, "StudyLab is free forever. Good luck with your preparation."));
  wrap.appendChild(fnote);

  w.appendChild(wrap);
  return w;
}