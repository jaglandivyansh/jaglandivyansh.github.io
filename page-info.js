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
      width: "500px", height: "500px", background: "radial-gradient(circle, var(--accent) 0%, transparent 60%)",
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
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px",
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
  var cmpLeftList = el("div", { css: { fontSize: ".9rem", color: "var(--muted)", lineHeight: "2.2" } });
  ["❌ Ads between questions", "❌ Mock tests behind paywall", "❌ Recurring subscription"].forEach(function(t) { cmpLeftList.appendChild(el("div", {}, t)); });
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
  var cmpRightList = el("div", { css: { fontSize: ".9rem", color: "var(--text)", lineHeight: "2.2", fontWeight: "500" } });
  ["✅ Zero ads, ever", "✅ Everything unlocked", "✅ Free, always"].forEach(function(t) { cmpRightList.appendChild(el("div", {}, t)); });
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
  var mvBox = el("div", { css: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" } });
  [
    {icon: "🎯", title: "Mission", text: "Make quality government exam preparation accessible, simple and completely free for every aspirant."},
    {icon: "🔭", title: "Vision", text: "Build India's most student-friendly learning platform powered by technology and focused learning."}
  ].forEach(function(item) {
    var card = el("div", { 
        css: { background: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", padding: "24px", transition: "transform 0.3s ease, border-color 0.3s ease" } 
    });
    card.addEventListener("mouseenter", function() { this.style.transform = "translateY(-4px)"; this.style.borderColor = "var(--accent)"; });
    card.addEventListener("mouseleave", function() { this.style.transform = "translateY(0)"; this.style.borderColor = "var(--border)"; });
    
    card.appendChild(el("div", { css: { fontSize: "1.5rem", marginBottom: "12px" }, txt: item.icon }));
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
    ["📚", tot.toLocaleString() + "+ MCQs", "Curated and categorized"],
    ["📰", "Daily digest", "Live current affairs fetched daily"],
    ["🧠", "AI doubt solver", "Instant answers to your study queries"],
    ["🎯", "Quiz mode", "MCQ sessions with instant feedback"],
    ["🔔", "Govt updates", "Live vacancies, admit cards via RSS"],
    ["📊", "Progress tracker", "Accuracy, streaks and subject breakdown"],
    ["⚔️", "Daily challenge", "Fresh mixed quiz every day"],
    ["🗂️", "Flashcards", "Tap-to-flip cards for quick revision"]
  ].forEach(function(f) {
    var row = el("div", { css: { display: "flex", alignItems: "center", gap: "12px" } });
    row.appendChild(el("div", { css: { fontSize: "1.2rem", background: "var(--bg2)", padding: "10px", borderRadius: "10px", border: "1px solid var(--border)" }, txt: f[0] }));
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
    ["PYQ analysis", false], ["Smart study planner", false], ["Revision scheduler", false], ["Mock test mode", false]
  ].forEach(function(t) {
    var row = el("div", { css: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "var(--card)", borderRadius: "12px", border: "1px solid var(--border)" } });
    var icon = el("span", { css: { fontSize: "1.1rem" }, txt: t[1] ? "✅" : "⏳" });
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
    ["Can I use it offline?", "Once loaded, most features work without internet. Govt updates and daily digest require a connection."],
    ["How often is new content added?", "Questions are added on an hourly automated schedule, so the bank keeps growing while you study."]
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
  fnote.appendChild(el("div", { css: { marginBottom: "4px" }, txt: "Made with care by Aman — a fellow aspirant, for all aspirants." }));
  fnote.appendChild(el("div", {}, "StudyLab is free forever. Good luck with your preparation."));
  wrap.appendChild(fnote);

  w.appendChild(wrap);
  return w;
}