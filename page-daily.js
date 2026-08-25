// ─── UTILITY: TIMEZONE-SAFE CALENDAR DAILY SEED ──────────────────
function getDailySeedIndex(poolLength) {
  if (!poolLength) return 0;
  var d = new Date();
  var dateCode = (d.getFullYear() * 10000) + ((d.getMonth() + 1) * 100) + d.getDate();
  return dateCode % poolLength;
}

// ─── UTILITY: STREAK AND LOCK-STATE ENGINE ──────────────────────
function getDailyState() {
  var d = new Date();
  var todayKey = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();

  var lastClearedDate = localStorage.getItem("sl_daily_last_cleared");
  var streak = parseInt(localStorage.getItem("sl_daily_streak") || "0", 10);
  var hasPlayedToday = (lastClearedDate === todayKey);

  // Reset streak if user missed yesterday
  if (lastClearedDate && !hasPlayedToday) {
    var todayMs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    var lastActiveParts = lastClearedDate.split("-"); 
    var lastActiveMs = new Date(
      parseInt(lastActiveParts[0], 10),
      parseInt(lastActiveParts[1], 10) - 1,
      parseInt(lastActiveParts[2], 10)
    ).getTime();

    if (todayMs - lastActiveMs > 86400000) {
      streak = 0;
      localStorage.setItem("sl_daily_streak", "0");
    }
  }

  return {
    todayKey: todayKey,
    streak: streak,
    hasPlayedToday: hasPlayedToday,
    savedAnswer: localStorage.getItem("sl_daily_user_ans")
  };
}

// ─── UTILITY: TIME UNTIL MIDNIGHT (next question unlock) ─────────
function getCountdownToMidnight() {
  var now = new Date();
  var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
  var diff = midnight - now.getTime();
  var h = Math.floor(diff / 3600000);
  var m = Math.floor((diff % 3600000) / 60000);
  return h + "h " + m + "m";
}

// ─── SHARE SCORE: OFF-SCREEN CANVAS CARD GENERATOR ──────────────
function shareScore(subj, correct, streak) {
  var canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 440;
  var ctx = canvas.getContext("2d");

  // Background (Updated to match deep dark theme)
  ctx.fillStyle = "#05080F";
  ctx.fillRect(0, 0, 800, 440);

  // Top accent bar
  ctx.fillStyle = correct ? "#10b981" : "#ef4444";
  ctx.fillRect(0, 0, 800, 6);

  // Streak color
  var streakColor = streak >= 7 ? "#f59e0b" : streak >= 3 ? "#3b82f6" : "#8B9CB8";

  ctx.textBaseline = "top";

  // Brand label
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "700 13px 'Syne', -apple-system, sans-serif";
  ctx.fillText("STUDYLAB · DAILY ARENA ", 48, 44);

  // Result headline
  ctx.fillStyle = correct ? "#10b981" : "#ef4444";
  ctx.font = "800 46px 'Syne', -apple-system, sans-serif";
  ctx.fillText(correct ? "Mission Cleared!" : "Attempted", 48, 72);

  // Subject tag background 
  var tagLabel = subj.toUpperCase();
  var tagW = ctx.measureText(tagLabel).width + 28;
  ctx.fillStyle = "rgba(59,130,246,0.15)";
  ctx.beginPath();
  ctx.roundRect(48, 148, tagW, 30, 8);
  ctx.fill();
  ctx.fillStyle = "#60A5FA";
  ctx.font = "700 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(tagLabel, 62, 156);

  // Streak label
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "700 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("CURRENT STREAK", 48, 210);

  // Streak number
  ctx.fillStyle = streakColor;
  ctx.font = "800 68px 'Syne', -apple-system, sans-serif";
  ctx.fillText(String(streak), 48, 232);

  // "days" label beside number
  var numWidth = ctx.measureText(String(streak)).width;
  ctx.fillStyle = streakColor;
  ctx.font = "700 22px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("days", 48 + numWidth + 12, 268);

  // Divider line
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, 340);
  ctx.lineTo(752, 340);
  ctx.stroke();

  // URL
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "500 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("studylab.app", 48, 376);

  var textDescription = "StudyLab Daily Arena | " + subj + " | Streak: " + streak + " days → studylab.app";

  canvas.toBlob(function(blob) {
    if (!blob) return;
    var file = new File([blob], "studylab-daily.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ title: "StudyLab Daily", text: textDescription, files: [file] }).catch(function() {});
    } else {
      navigator.clipboard.writeText(textDescription).then(function() {
        var link = document.createElement("a");
        link.download = "studylab-daily.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        if (typeof toast === "function") toast("Card saved to your device.", "#10b981");
      });
    }
  }, "image/png");
}

// ─── MAIN DAILY ARENA PAGE ────────────────────────────────────────
function pgDaily() {
  var w = el("div", { cls: "fd" });
  if (typeof makeNav === 'function') w.appendChild(makeNav("daily"));

  var wrap = el("div", { css: {
    maxWidth: "680px", margin: "0 auto", padding: "0 20px 80px", position: "relative"
  }});

  // Dynamic Ambient Glow
  var bgGlow = el("div", {
    css: {
      position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
      width: "400px", maxWidth: "100vw", height: "400px", background: "radial-gradient(circle, var(--accent) 0%, transparent 60%)",
      opacity: "0.08", filter: "blur(60px)", pointerEvents: "none", zIndex: "-1"
    }
  });
  wrap.appendChild(bgGlow);

  // Loading guard
  if (!window.SUBJ || !window.QD || Object.keys(window.QD).length === 0) {
    wrap.appendChild(el("div", { css: {
      textAlign: "center", padding: "80px 20px", color: "var(--muted)", fontSize: "0.95rem"
    }, txt: "Loading today's challenge..." }));
    w.appendChild(wrap);
    return w;
  }

  var appState = getDailyState();
  var allQ = [];
  window.SUBJ.forEach(function(subj) {
    (window.QD[subj] || []).forEach(function(item) {
      allQ.push({ data: item, subjectName: subj });
    });
  });

  if (allQ.length === 0) {
    wrap.appendChild(el("div", { css: { textAlign: "center", padding: "60px", color: "var(--muted)" }, txt: "No questions configured yet." }));
    w.appendChild(wrap);
    return w;
  }

  var entry = allQ[getDailySeedIndex(allQ.length)];
  var Q     = entry.data;
  var Subj  = entry.subjectName;

  var now    = new Date();
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var WDAYS  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var dateStr = WDAYS[now.getDay()] + ", " + now.getDate() + " " + MONTHS[now.getMonth()];

  // ── HEADER ──────────────────────────────────────────────────────
  var hdr = el("div", { css: {
    display: "flex", alignItems: "center", justifyContent: "space-between", 
    marginBottom: "32px", marginTop: "20px"
  }});

  var hLeft = el("div", {});
  hLeft.appendChild(el("div", { css: {
    fontSize: "0.75rem", fontWeight: "700", color: "var(--accent2)",
    textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px"
  }, txt: dateStr }));
  hLeft.appendChild(el("div", { css: {
    fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.03em",
    color: "var(--text)", fontFamily: "var(--font-display)", lineHeight: "1.1"
  }, txt: "Daily Arena " }));
  hLeft.appendChild(el("div", { css: {
    fontSize: "0.85rem", color: "var(--muted)", marginTop: "6px"
  }, txt: "One high-yield question. Every 24 hours." }));
  hdr.appendChild(hLeft);

  var sColor  = appState.streak >= 7 ? "#f59e0b" : appState.streak >= 3 ? "var(--accent)" : "var(--muted)";
  var sBg     = appState.streak >= 7 ? "rgba(245,158,11,0.15)" : appState.streak >= 3 ? "var(--accent-glow)" : "var(--card2)";
  var sBorder = appState.streak >= 7 ? "rgba(245,158,11,0.4)" : appState.streak >= 3 ? "rgba(59,130,246,0.4)" : "var(--border)";
  var sEmoji  = appState.streak >= 7 ? "🔥" : appState.streak >= 3 ? "⚡" : "📅";

  var sPill = el("div", { css: {
    display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", 
    borderRadius: "20px", background: "var(--glass-bg)", 
    border: "1px solid " + sBorder, backdropFilter: "blur(12px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
  }});
  sPill.appendChild(el("span", { css: { fontSize: "1.2rem", lineHeight: "1" }, txt: sEmoji }));
  var sTextCol = el("div", { css: { display: "flex", flexDirection: "column" }});
  sTextCol.appendChild(el("span", { css: { fontSize: "1.2rem", fontWeight: "800", color: sColor, lineHeight: "1", fontFamily: "var(--font-display)" }, txt: String(appState.streak) }));
  sTextCol.appendChild(el("span", { css: { fontSize: "0.65rem", fontWeight: "700", color: sColor, textTransform: "uppercase", letterSpacing: "0.05em", opacity: "0.8" }, txt: "Streak" }));
  sPill.appendChild(sTextCol);
  
  hdr.appendChild(sPill);
  wrap.appendChild(hdr);

  // ── QUESTION CARD ────────────────────────────────────────────────
  var qCard = el("div", { css: {
    background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px", overflow: "hidden", marginBottom: "24px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.15)"
  }});

  // Glowing Top Border
  qCard.appendChild(el("div", { css: { height: "4px", background: "linear-gradient(90deg, var(--accent) 0%, #8b5cf6 100%)" }}));

  var qBody = el("div", { css: { padding: "32px" }});

  // Subject Badge
  var pillRow = el("div", { css: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }});
  pillRow.appendChild(el("span", { css: {
    fontSize: "0.7rem", fontWeight: "800", padding: "6px 12px", borderRadius: "8px",
    background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid rgba(59,130,246,0.3)",
    textTransform: "uppercase", letterSpacing: "0.08em"
  }, txt: Subj }));
  
  if (Q.topic) {
    pillRow.appendChild(el("span", { css: { fontSize: "0.8rem", color: "var(--muted)", fontWeight: "600" }, txt: Q.topic }));
  }
  qBody.appendChild(pillRow);

  // Question Text
  qBody.appendChild(el("p", { css: {
    fontSize: "1.15rem", fontWeight: "600", lineHeight: "1.7",
    color: "var(--text)", margin: "0 0 28px", fontFamily: "var(--font-body)"
  }, txt: Q.q }));

  // ── OPTIONS ──────────────────────────────────────────────────────
  var LABELS = ["A", "B", "C", "D", "E"];
  var optsWrap = el("div", { css: { display: "flex", flexDirection: "column", gap: "12px" }});
  var optionsList = Q.o || [];

  optionsList.forEach(function(optText, idx) {
    if (!optText) return;

    var isSel  = (appState.savedAnswer !== null && parseInt(appState.savedAnswer, 10) === idx);
    var isCorr = (idx === Q.a);
    var locked = appState.hasPlayedToday;

    var btnCss = {
      width: "100%", display: "flex", alignItems: "center", gap: "16px",
      padding: "16px 20px", borderRadius: "16px",
      border: "1.5px solid var(--border)", background: "var(--card2)",
      textAlign: "left", cursor: locked ? "default" : "pointer",
      fontSize: "0.95rem", fontWeight: "500", color: "var(--text)", lineHeight: "1.5",
      transition: "all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)"
    };

    var lblCss = {
      flexShrink: "0", width: "28px", height: "28px", borderRadius: "8px",
      background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "0.8rem", fontWeight: "800", color: "var(--text)", fontFamily: "var(--font-display)"
    };

    if (locked) {
      if (isCorr) {
        btnCss.background  = "rgba(16,185,129,0.1)";
        btnCss.borderColor = "#10b981";
        btnCss.boxShadow = "0 0 0 1px rgba(16,185,129,0.3)";
        lblCss.background  = "#10b981"; lblCss.color = "#fff";
      } else if (isSel) {
        btnCss.background  = "rgba(239,68,68,0.1)";
        btnCss.borderColor = "#ef4444";
        lblCss.background  = "#ef4444"; lblCss.color = "#fff";
      } else {
        btnCss.opacity = "0.5";
      }
    }

    var lblSymbol = locked && isCorr ? "✓" : (locked && isSel && !isCorr) ? "✗" : LABELS[idx];

    var btn = el("button", { css: btnCss });
    btn.appendChild(el("span", { css: lblCss, txt: lblSymbol }));
    btn.appendChild(el("span", { txt: optText }));

    if (!locked) {
      btn.onmouseover = function() {
        this.style.borderColor = "var(--accent)";
        this.style.background  = "var(--accent-glow)";
        this.style.transform = "translateX(4px)";
      };
      btn.onmouseout = function() {
        this.style.borderColor = "var(--border)";
        this.style.background  = "var(--card2)";
        this.style.transform = "translateX(0)";
      };

      btn.onclick = function() {
        var isCorrect  = (idx === Q.a);
        var newStreak  = isCorrect ? (appState.streak + 1) : 0;

        localStorage.setItem("sl_daily_last_cleared", appState.todayKey);
        localStorage.setItem("sl_daily_user_ans", String(idx));
        localStorage.setItem("sl_daily_streak", String(newStreak));

        if (typeof toast === "function") {
          toast(
            isCorrect ? "Brilliant! Streak: " + newStreak + " day" + (newStreak !== 1 ? "s" : "") + " 🔥"
                      : "Incorrect. Try again tomorrow.",
            isCorrect ? "#10b981" : "#ef4444"
          );
        }

        if (typeof go === "function") {
          go("daily");
        } else {
          var container = document.getElementById("app") || document.body;
          container.innerHTML = "";
          container.appendChild(pgDaily());
        }
      };
    }
    optsWrap.appendChild(btn);
  });

  qBody.appendChild(optsWrap);
  qCard.appendChild(qBody);
  wrap.appendChild(qCard);

  // ── POST-ANSWER SECTION ──────────────────────────────────────────
  if (appState.hasPlayedToday) {
    var wasCorrect = (parseInt(appState.savedAnswer, 10) === Q.a);

    // Explanation Card
    if (Q.exp) {
      var expCard = el("div", { css: {
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: "20px", padding: "24px", marginBottom: "20px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
      }});
      expCard.appendChild(el("div", { css: {
        fontSize: "0.75rem", fontWeight: "800", color: "var(--accent)",
        textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px"
      }, htm: "<span>💡</span> WHY THIS ANSWER?" }));
      expCard.appendChild(el("div", { css: {
        fontSize: "0.95rem", lineHeight: "1.7", color: "var(--text)"
      }, txt: Q.exp }));
      wrap.appendChild(expCard);
    }

    // Result & Share Card
    var resCard = el("div", { css: {
      background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderRadius: "20px", padding: "24px"
    }});

    var resTop = el("div", { css: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }});
    resTop.appendChild(el("div", { css: { 
        fontSize: "2.5rem", background: "var(--card2)", width: "60px", height: "60px", 
        borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)"
    }, txt: wasCorrect ? "🎯" : "📖" }));

    var resTxt = el("div", {});
    resTxt.appendChild(el("div", { css: {
      fontSize: "1.2rem", fontWeight: "800", fontFamily: "var(--font-display)", marginBottom: "4px",
      color: wasCorrect ? "#10b981" : "#ef4444"
    }, txt: wasCorrect ? "Streak Extended!" : "Mission Failed" }));
    resTxt.appendChild(el("div", { css: {
      fontSize: "0.85rem", color: "var(--muted)", lineHeight: "1.5"
    }, txt: wasCorrect
      ? "You're on a " + appState.streak + "-day streak. Keep the momentum going."
      : "The correct answer is highlighted above. Review it and return tomorrow." }));
    resTop.appendChild(resTxt);
    resCard.appendChild(resTop);

    resCard.appendChild(el("div", { css: { height: "1px", background: "var(--border)", margin: "0 0 20px" }}));

    var nextRow = el("div", { css: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }});
    nextRow.appendChild(el("span", { css: { fontSize: "0.85rem", color: "var(--muted)", fontWeight: "600" }, txt: "Next challenge unlocks in" }));
    nextRow.appendChild(el("span", { css: {
      fontSize: "0.95rem", fontWeight: "700", color: "var(--text)", fontVariantNumeric: "tabular-nums",
      background: "var(--bg2)", padding: "4px 12px", borderRadius: "8px", border: "1px solid var(--border)"
    }, txt: getCountdownToMidnight() }));
    resCard.appendChild(nextRow);

    // Share Button
    var shareBtn = el("button", {
      css: {
        width: "100%", padding: "16px 0", fontSize: "1rem", fontWeight: "700",
        borderRadius: "16px", border: "none", background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        cursor: "pointer", boxShadow: "0 8px 24px rgba(59,130,246,0.3)", transition: "all 0.2s"
      },
      onclick: function() { shareScore(Subj, wasCorrect, appState.streak); }
    });
    
    shareBtn.onmouseover = function() { this.style.transform = "translateY(-2px)"; this.style.boxShadow = "0 12px 32px rgba(59,130,246,0.4)"; };
    shareBtn.onmouseout = function() { this.style.transform = "translateY(0)"; this.style.boxShadow = "0 8px 24px rgba(59,130,246,0.3)"; };

    shareBtn.appendChild(el("span", { txt: "Share Result" }));
    shareBtn.appendChild(el("svg", { attr: {
      viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round"
    }}, [
      el("circle", { attr: { cx: "18", cy: "5",  r: "3" }}),
      el("circle", { attr: { cx: "6",  cy: "12", r: "3" }}),
      el("circle", { attr: { cx: "18", cy: "19", r: "3" }}),
      el("line", { attr: { x1: "8.59",  y1: "13.51", x2: "15.42", y2: "17.49" }}),
      el("line", { attr: { x1: "15.41", y1: "6.51",  x2: "8.59",  y2: "10.49" }})
    ]));
    resCard.appendChild(shareBtn);

    wrap.appendChild(resCard);
  }

  w.appendChild(wrap);
  return w;
}