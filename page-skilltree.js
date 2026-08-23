// ═══════════════════════════════════════════════════════════════════
// PAGE-SKILLTREE.JS — RPG-Style Syllabus Progression
// Nodes are generated live from window.SD (the same topic board the
// home page uses) — so the skill tree never goes stale when topics
// are added, renamed, or reordered on the home page.
// ═══════════════════════════════════════════════════════════════════

function slSlug(subj) {
  return subj.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

function getSkillTree(subj) {
  var d = (typeof window.SD !== "undefined") ? window.SD[subj] : null;
  if (!d || !d.topics || !d.topics.length) return null;

  var slug = slSlug(subj);
  var syms = (d.sym && d.sym.length) ? d.sym : ["📘"];

  var nodes = d.topics.map(function(topic, idx) {
    return {
      id: slug + "_" + idx,
      title: topic,
      desc: "",
      icon: syms[idx % syms.length],
      req: idx === 0 ? [] : [slug + "_" + (idx - 1)]
    };
  });

  return { theme: d.color || "var(--accent)", nodes: nodes };
}

function pgSkillTree() {
  var w = el("div", { cls: "fd" });
  w.appendChild(makeNav("home"));

  var allSubjects = (typeof window.SD !== "undefined") ? Object.keys(window.SD) : [];
  var currentSubj = window.skillTreeSubj || allSubjects[0] || "History";
  var treeData = getSkillTree(currentSubj);
  
  if (!treeData) {
    w.appendChild(el("div", {css: {padding: "40px", textAlign: "center", color: "var(--muted)"}}, "Skill tree coming soon for " + currentSubj));
    return w;
  }

  var userProgress = Sv.get("rpg_progress") || {}; 
  var wrap = el("div", { css: { maxWidth: "600px", margin: "0 auto", padding: "0 20px 60px", position: "relative" } });

  // ── HEADER ──
  var hd = el("div", { css: { textAlign: "center", marginBottom: "40px" } });
  hd.appendChild(el("div", { css: { fontSize: ".65rem", color: treeData.theme, textTransform: "uppercase", letterSpacing: ".18em", fontWeight: "800", marginBottom: "8px", fontFamily: "var(--font-display)" }, txt: "Skill Tree" }));
  hd.appendChild(el("div", { css: { fontSize: "2.2rem", fontWeight: "800", letterSpacing: "-.04em", fontFamily: "var(--font-display)", color: "var(--text)" }, txt: currentSubj + " Mastery" }));
  hd.appendChild(el("div", { css: { fontSize: ".9rem", color: "var(--muted)", marginTop: "8px" }, txt: "Score 80% in challenges to unlock the next level." }));
  
  var switcher = el("div", { css: { display: "flex", gap: "8px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" } });
  allSubjects.forEach(function(s) {
    var sColor = (window.SD[s] && window.SD[s].color) || "var(--accent)";
    var btn = el("button", {
      css: {
        padding: "6px 14px", borderRadius: "20px", border: "1px solid " + (s === currentSubj ? sColor : "var(--border)"),
        background: s === currentSubj ? sColor + "20" : "transparent",
        color: s === currentSubj ? sColor : "var(--muted)",
        fontSize: ".8rem", fontWeight: "700", cursor: "pointer"
      },
      onclick: function() { window.skillTreeSubj = s; go("skilltree"); }
    }, s);
    switcher.appendChild(btn);
  });
  hd.appendChild(switcher);
  wrap.appendChild(hd);

  // ── THE TREE PATH ──
  var pathContainer = el("div", { css: { position: "relative", paddingBottom: "40px" } });
  
  var line = el("div", {
    css: {
      position: "absolute", top: "0", bottom: "0", left: "50%",
      transform: "translateX(-50%)", width: "4px", background: "var(--border2)",
      borderRadius: "2px", zIndex: "0"
    }
  });
  pathContainer.appendChild(line);

  treeData.nodes.forEach(function(node, idx) {
    var isOdd = idx % 2 !== 0;
    var isUnlocked = node.req.length === 0 || node.req.every(function(reqId) { return userProgress[reqId] === true; });
    var isCompleted = userProgress[node.id] === true;

    var nodeBg = isCompleted ? treeData.theme : (isUnlocked ? "var(--card)" : "var(--bg2)");
    var borderColor = isCompleted ? treeData.theme : (isUnlocked ? treeData.theme : "var(--border)");
    var iconOp = isUnlocked ? "1" : "0.4";
    var textCol = isCompleted ? "#fff" : (isUnlocked ? "var(--text)" : "var(--muted)");

    var nodeWrap = el("div", {
      css: {
        display: "flex", alignItems: "center", justifyContent: isOdd ? "flex-start" : "flex-end",
        marginBottom: "30px", position: "relative", zIndex: "1", width: "100%"
      }
    });

    // --- UPDATED CLICK ACTION ---
    var circleWrap = el("div", {
      css: {
        position: "absolute", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", cursor: isUnlocked ? "pointer" : "not-allowed"
      },
      onclick: function() {
        if (!isUnlocked) {
          toast("🔒 Pass previous topics to unlock this!", "#ef4444");
          return;
        }
        
        // TELL THE APP WE ARE ENTERING RPG MODE
        window.activeSkillNode = node;
        window.activeSkillSubject = currentSubj;

        if (!isCompleted) {
            toast("⚔️ Boss Fight: Score 80% to Master " + node.title, treeData.theme);
        } else {
            toast("🔄 Practicing Mastered Topic: " + node.title, treeData.theme);
        }
        
        // GO TO QUIZ
        go("qz", currentSubj); 
      }
    });

    var circle = el("div", {
      css: {
        width: "64px", height: "64px", borderRadius: "50%",
        background: nodeBg, border: "3px solid " + borderColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.8rem", opacity: iconOp, boxShadow: isUnlocked ? "0 8px 20px rgba(0,0,0,0.2)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s"
      }
    });
    circle.innerHTML = isCompleted ? "✓" : (isUnlocked ? node.icon : "🔒");
    
    if (isUnlocked) {
        circle.addEventListener("mouseenter", function() { this.style.transform = "scale(1.1)"; this.style.boxShadow = "0 10px 25px " + treeData.theme + "40"; });
        circle.addEventListener("mouseleave", function() { this.style.transform = "scale(1)"; this.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)"; });
    }

    circleWrap.appendChild(circle);
    nodeWrap.appendChild(circleWrap);

    var textCard = el("div", {
      css: {
        width: "calc(50% - 50px)", background: isUnlocked ? "var(--card)" : "transparent",
        padding: "16px", borderRadius: "16px",
        border: isUnlocked ? "1px solid var(--border)" : "none",
        textAlign: isOdd ? "left" : "right",
        opacity: isUnlocked ? "1" : "0.5"
      }
    });
    
    var levelTag = el("div", {css: {fontSize: ".65rem", color: treeData.theme, fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px"}}, "Level " + (idx + 1));
    var title = el("div", {css: {fontSize: "1rem", fontWeight: "700", color: textCol, marginBottom: "4px", fontFamily: "var(--font-display)", lineHeight: "1.3"}}, node.title);
    textCard.appendChild(levelTag);
    textCard.appendChild(title);
    if (node.desc) textCard.appendChild(el("div", {css: {fontSize: ".75rem", color: "var(--muted)", lineHeight: "1.5"}}, node.desc));
    nodeWrap.appendChild(textCard);

    pathContainer.appendChild(nodeWrap);
  });

  wrap.appendChild(pathContainer);
  w.appendChild(wrap);
  return w;
}