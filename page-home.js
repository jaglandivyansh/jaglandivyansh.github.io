window.STUDYLAB_FEEDBACK_URL = "https://formspree.io/f/mzdyqbyz";
const DAILY_QUOTES = [
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "Arise, awake, and stop not till the goal is reached.", author: "Swami Vivekananda" },
  { text: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.", author: "A.P.J. Abdul Kalam" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Cultivation of mind should be the ultimate aim of human existence.", author: "Dr. B.R. Ambedkar" },
  { text: "Education is not the learning of facts, but the training of the mind to think.", author: "Albert Einstein" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.", author: "Colin Powell" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Doubt kills more dreams than failure ever will.", author: "Suzy Kassem" },
  { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" }
];

// ─── EXAM COUNTDOWN HERO ─────────────────────────────────────────────
// Replaces the old search/orbit hero. Shows a live countdown to the
// student's nearest saved exam: a circular day-ring on the left,
// exam name + date + next-exam preview on the right. Data persists
// in localStorage (same pattern as sl_user elsewhere in this file).
// Preloaded exam dates are sourced dates as of Aug 2026 — some are
// officially confirmed, some are tentative windows; both are labelled
// honestly rather than presented as equally certain.

var EXAM_COUNTDOWN_KEY = "sl_exam_countdown";

// Preset exams, sourced as of Aug 2026. `confirmed: true` = official date
// notified by the conducting body. `confirmed: false` = expected window,
// shown honestly as tentative rather than presented with false precision.
var EXAM_PRESETS = [
  { name: "UPSC CSE Prelims 2027", date: "2027-05-23", confirmed: true, category: "UPSC", icon: "landmark" },
  { name: "UPSC CSE Mains 2027", date: "2027-08-20", confirmed: true, category: "UPSC", icon: "landmark" },
  { name: "SSC CGL 2026 Tier 1", date: "2026-09-30", confirmed: false, category: "SSC", icon: "file-check" },
  { name: "SSC CHSL 2026 Tier 1", date: "2026-09-30", confirmed: false, category: "SSC", icon: "file-check" },
  { name: "IBPS PO 2026 Prelims", date: "2026-11-01", confirmed: false, category: "Banking", icon: "bank" },
  { name: "RRB NTPC 2026", date: "2026-11-15", confirmed: false, category: "Railways", icon: "train" }
];

var EXAM_ICONS = {
  landmark: '<path d="M4 21h16M5 21V9.5M19 21V9.5M3 9.5l9-5.5 9 5.5M8 21v-7M12 21v-7M16 21v-7"/>',
  "file-check": '<path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/><path d="M9 14.5l2 2 4-4.5"/>',
  bank: '<path d="M3 10l9-6 9 6M4 10v9h16v-9M9 19v-6M15 19v-6M2 21h20"/>',
  train: '<rect x="5" y="4" width="14" height="13" rx="3"/><path d="M8 4v13M16 4v13M5 12h14"/><circle cx="8.5" cy="14.5" r="0.6" fill="currentColor"/><circle cx="15.5" cy="14.5" r="0.6" fill="currentColor"/><path d="M8 20l-2 2M16 20l2 2"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>'
};

function examIconSvg(key, color) {
  var body = EXAM_ICONS[key] || EXAM_ICONS.calendar;
  return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="' + (color || "currentColor") + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
}

function loadExamList() {
  try {
    var raw = localStorage.getItem(EXAM_COUNTDOWN_KEY);
    var list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (e) { return []; }
}

function saveExamList(list) {
  try { localStorage.setItem(EXAM_COUNTDOWN_KEY, JSON.stringify(list)); } catch (e) {}
}

function daysUntil(dateStr) {
  var target = new Date(dateStr + "T00:00:00");
  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var diffMs = target - startOfToday;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function formatExamDate(dateStr) {
  var d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function makeModernHero() {
  var wrap = el("div", {
    css: {
      position: "relative", 
      padding: "clamp(28px, 6vw, 56px) clamp(16px, 4vw, 32px) clamp(24px, 5vw, 44px)",
      overflow: "hidden", 
      marginBottom: "0px",
      backgroundImage: "radial-gradient(var(--glass-border) 1px, transparent 1px)",
      backgroundSize: "24px 24px",
      backgroundPosition: "center top"
    }
  });

  var glow1 = el("div", { 
    css: { position: "absolute", top: "-10%", left: "5%", width: "500px", height: "500px", background: "radial-gradient(circle, #6366f1 0%, transparent 60%)", opacity: "0.12", filter: "blur(80px)", pointerEvents: "none", transform: "translateZ(0)" } 
  });
  var glow2 = el("div", { 
    css: { position: "absolute", bottom: "-20%", right: "5%", width: "600px", height: "600px", background: "radial-gradient(circle, #ec4899 0%, transparent 60%)", opacity: "0.08", filter: "blur(90px)", pointerEvents: "none", transform: "translateZ(0)" } 
  });
  wrap.appendChild(glow1);
  wrap.appendChild(glow2);

  var content = el("div", { css: { position: "relative", zIndex: "1", width: "100%", maxWidth: "760px", margin: "0 auto" } });
  content.id = "exam-countdown-root";
  content.appendChild(renderExamCountdownBody());

  wrap.appendChild(content);
  return wrap;
}

function refreshExamCountdown() {
  var root = document.getElementById("exam-countdown-root");
  if (!root) return;
  root.innerHTML = "";
  root.appendChild(renderExamCountdownBody());
}

function renderExamCountdownBody() {
  var frag = el("div", {});
  var list = loadExamList();

  if (list.length === 0) {
    frag.appendChild(makeExamEmptyState());
    return frag;
  }

  var withDays = list.map(function(e, i) { return Object.assign({}, e, { _idx: i, _days: daysUntil(e.date) }); });
  var upcoming = withDays.filter(function(e) { return e._days >= 0; }).sort(function(a, b) { return a._days - b._days; });
  var expired = withDays.filter(function(e) { return e._days < 0; }).sort(function(a, b) { return b._days - a._days; });

  if (upcoming.length === 0) {
    // Every saved exam has passed — tell the user clearly instead of
    // silently reverting to the generic "set your exam date" screen.
    frag.appendChild(makeExamExpiredState(expired));
    return frag;
  }

  var primary = upcoming[0];
  var next = upcoming[1];

  frag.appendChild(makeExamCard(primary, next));

  // Passively clean up: if any exam is more than 3 days past, drop it
  // from storage so it doesn't clutter "Manage exams" forever.
  var stale = withDays.filter(function(e) { return e._days < -3; });
  if (stale.length > 0) {
    var cleaned = withDays.filter(function(e) { return e._days >= -3; }).map(function(e) {
      var copy = Object.assign({}, e);
      delete copy._idx; delete copy._days;
      return copy;
    });
    saveExamList(cleaned);
  }

  return frag;
}

// ── All saved exams have passed: acknowledge it, offer next steps ──
function makeExamExpiredState(expired) {
  var box = el("div", { css: { textAlign: "center", padding: "8px 4px" } });

  var mostRecent = expired[0];

  box.appendChild(el("div", {
    css: {
      display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 14px",
      borderRadius: "100px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
      fontSize: "0.75rem", fontWeight: "700", color: "#4ade80", marginBottom: "16px"
    }
  }, "Exam day has passed"));

  box.appendChild(el("h1", {
    css: {
      fontSize: "clamp(1.5rem, 5vw, 1.9rem)", fontWeight: "800",
      letterSpacing: "-0.03em", fontFamily: "var(--font-display)",
      color: "var(--text)", lineHeight: "1.25", marginBottom: "8px"
    },
    txt: mostRecent ? mostRecent.name : "Your exam"
  }));
  box.appendChild(el("p", {
    css: { fontSize: "0.9rem", color: "var(--muted)", marginBottom: "22px" },
    txt: mostRecent ? "Was on " + formatExamDate(mostRecent.date) + ". Hope it went well — set your next target below." : "Set your next target below."
  }));

  var chipsRow = el("div", { css: { display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "16px" } });
  EXAM_PRESETS.forEach(function(p) {
    chipsRow.appendChild(makeExamPresetChip(p));
  });
  box.appendChild(chipsRow);

  var actionRow = el("div", { css: { display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" } });

  var customBtn = el("button", {
    css: {
      padding: "10px 20px", borderRadius: "12px", border: "none",
      background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff",
      fontWeight: "700", fontSize: "0.85rem", cursor: "pointer", fontFamily: "var(--font-display)",
      boxShadow: "0 8px 20px -6px rgba(99,102,241,0.5)"
    },
    onclick: function() { openExamSettingsModal(); }
  });
  customBtn.textContent = "+ Add new exam";
  actionRow.appendChild(customBtn);

  var clearBtn = el("button", {
    css: {
      padding: "10px 20px", borderRadius: "12px", border: "1px solid var(--glass-border)",
      background: "var(--glass-bg)", color: "var(--muted)",
      fontWeight: "600", fontSize: "0.85rem", cursor: "pointer", fontFamily: "var(--font-body)"
    },
    onclick: function() {
      saveExamList([]);
      refreshExamCountdown();
    }
  });
  clearBtn.textContent = "Clear passed exams";
  actionRow.appendChild(clearBtn);

  box.appendChild(actionRow);
  return box;
}

// ── Shared preset chip: icon, name, and a clear confirmed/tentative badge ──
function makeExamPresetChip(p) {
  var chip = el("button", {
    css: {
      display: "flex", alignItems: "center", gap: "8px",
      padding: "10px 14px", borderRadius: "14px", border: "1px solid var(--glass-border)",
      background: "var(--glass-bg)", cursor: "pointer", fontFamily: "var(--font-body)",
      transition: "all 0.2s ease", textAlign: "left"
    },
    onclick: function() {
      var list = loadExamList();
      list.push({ name: p.name, date: p.date });
      saveExamList(list);
      refreshExamCountdown();
    }
  });

  var iconBox = el("div", {
    css: {
      width: "28px", height: "28px", borderRadius: "9px", flexShrink: "0",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg2)", color: "var(--accent2)"
    }
  });
  iconBox.innerHTML = examIconSvg(p.icon, "var(--accent2)");
  chip.appendChild(iconBox);

  var textCol = el("div", {});
  var nameRow = el("div", { css: { fontSize: "0.82rem", fontWeight: "700", color: "var(--text)", lineHeight: "1.3" } }, p.name);
  textCol.appendChild(nameRow);

  var statusRow = el("div", { css: { display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" } });
  statusRow.appendChild(el("span", { css: { fontSize: "0.68rem", color: "var(--subtle)", fontWeight: "600" } }, p.category));
  statusRow.appendChild(el("span", { css: { fontSize: "0.68rem", color: "var(--subtle)" } }, "·"));
  if (p.confirmed) {
    var confirmedTag = el("span", { css: { display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.68rem", color: "#4ade80", fontWeight: "700" } });
    confirmedTag.appendChild(el("span", { css: { width: "5px", height: "5px", borderRadius: "50%", background: "#4ade80" } }));
    confirmedTag.appendChild(el("span", {}, "Confirmed"));
    statusRow.appendChild(confirmedTag);
  } else {
    var tentativeTag = el("span", { css: { display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.68rem", color: "var(--muted)", fontWeight: "700" } });
    tentativeTag.appendChild(el("span", { css: { width: "5px", height: "5px", borderRadius: "50%", background: "var(--muted)" } }));
    tentativeTag.appendChild(el("span", {}, "Expected"));
    statusRow.appendChild(tentativeTag);
  }
  textCol.appendChild(statusRow);
  chip.appendChild(textCol);

  chip.addEventListener("mouseenter", function() { this.style.borderColor = "var(--accent)"; this.style.transform = "translateY(-1px)"; });
  chip.addEventListener("mouseleave", function() { this.style.borderColor = "var(--glass-border)"; this.style.transform = "translateY(0)"; });
  return chip;
}

// ── Empty state: encourage first-time setup ──
function makeExamEmptyState() {
  var box = el("div", {
    css: {
      textAlign: "center", padding: "8px 4px"
    }
  });

  box.appendChild(el("h1", {
    css: {
      fontSize: "clamp(1.7rem, 5vw, 2.2rem)", fontWeight: "800",
      letterSpacing: "-0.03em", fontFamily: "var(--font-display)",
      color: "var(--text)", lineHeight: "1.2", marginBottom: "8px"
    },
    txt: "Set your exam date"
  }));
  box.appendChild(el("p", {
    css: { fontSize: "0.95rem", color: "var(--muted)", marginBottom: "22px" },
    txt: "Track a live countdown right here on your home screen."
  }));

  var grid = el("div", {
    css: {
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "10px", maxWidth: "680px", margin: "0 auto 14px"
    }
  });
  EXAM_PRESETS.forEach(function(p) {
    grid.appendChild(makeExamPresetChip(p));
  });
  box.appendChild(grid);

  box.appendChild(el("div", {
    css: { fontSize: "0.72rem", color: "var(--subtle)", marginBottom: "18px" },
    txt: "\"Confirmed\" = official date notified · \"Expected\" = tentative window"
  }));

  var customBtn = el("button", {
    css: {
      padding: "11px 24px", borderRadius: "12px", border: "none",
      background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff",
      fontWeight: "700", fontSize: "0.9rem", cursor: "pointer", fontFamily: "var(--font-display)",
      boxShadow: "0 8px 20px -6px rgba(99,102,241,0.5)"
    },
    onclick: function() { openExamSettingsModal(); }
  });
  customBtn.textContent = "+ Add custom exam";
  box.appendChild(customBtn);

  return box;
}

// ── Main countdown card: ISRO "Mission Control" T-minus readout ──
function makeExamCard(primary, next) {
  var days0 = primary._days;
  var urgency = days0 <= 7 ? "#ef4444" : days0 <= 30 ? "#f59e0b" : "#22d3ee";

  var card = el("div", {
    cls: "mission-panel",
    css: {
      position: "relative", overflow: "hidden",
      background: "#050b14",
      border: "1px solid rgba(34,211,238,0.25)",
      borderRadius: "20px",
      padding: "clamp(24px, 5vw, 44px) clamp(16px, 4vw, 32px)",
      textAlign: "center", width: "100%"
    }
  });
  card.id = "exam-mission-panel";

  // Scanning line background (pure CSS animation, defined in styles.css)
  card.appendChild(el("div", { cls: "mission-scanline", css: { position: "absolute", inset: "0", pointerEvents: "none" } }));
  // Radar-glow pulse, color follows urgency
  var radar = el("div", { cls: "mission-radar-pulse", css: { position: "absolute", top: "50%", left: "50%", pointerEvents: "none" } });
  radar.style.setProperty("--mission-glow", urgency);
  card.appendChild(radar);
  // Faint grid overlay for a HUD feel
  card.appendChild(el("div", { cls: "mission-grid", css: { position: "absolute", inset: "0", pointerEvents: "none" } }));

  var content = el("div", { css: { position: "relative", zIndex: "1" } });

  // MISSION status pill (small, top) — live indicator only, name moved below for readability
  var header = el("div", {
    css: {
      display: "inline-flex", alignItems: "center", gap: "8px",
      padding: "5px 14px", borderRadius: "100px",
      background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.3)",
      marginBottom: "14px"
    }
  });
  header.appendChild(el("span", { cls: "mission-live-dot", css: { width: "6px", height: "6px", borderRadius: "50%", background: urgency, flexShrink: "0" } }));
  header.appendChild(el("span", {
    css: { fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.14em", color: "#7dd3fc", fontFamily: "var(--font-mono, monospace)", textTransform: "uppercase" },
    txt: days0 <= 7 ? "FINAL APPROACH" : days0 <= 30 ? "COUNTDOWN ACTIVE" : "MISSION SCHEDULED"
  }));
  content.appendChild(header);

  // Exam name — full-width, wraps naturally instead of truncating in a pill
  content.appendChild(el("div", {
    css: {
      fontSize: "clamp(1rem, 3vw, 1.35rem)", fontWeight: "700", color: "#e0fbff",
      fontFamily: "var(--font-display)", letterSpacing: "-0.01em",
      marginBottom: "22px", lineHeight: "1.3", maxWidth: "90%", marginLeft: "auto", marginRight: "auto"
    },
    txt: primary.name
  }));

  // Big glowing T-minus readout — built as separate digit blocks so each
  // unit (D/H/M/S) has a stable width and its own label, instead of one
  // reflowing text string that visually jitters as digits change width.
  var readout = el("div", {
    id: "exam-tminus-readout",
    css: {
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      gap: "clamp(4px, 1.4vw, 10px)", flexWrap: "wrap",
      marginBottom: "20px"
    }
  });
  content.appendChild(readout);
  content.appendChild(el("div", {
    css: { height: "1px", width: "56px", background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent)", margin: "0 auto 20px" }
  }));

  card.appendChild(content);

  var metaRow = el("div", {
    css: { position: "relative", zIndex: "1", fontSize: "0.8rem", color: "#7dd3fc", marginBottom: next ? "12px" : "16px", opacity: "0.85" },
    txt: "TARGET DATE · " + formatExamDate(primary.date).toUpperCase()
  });
  card.appendChild(metaRow);

  if (next) {
    var nextRow = el("div", {
      css: {
        position: "relative", zIndex: "1",
        display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px",
        borderRadius: "100px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
        fontSize: "0.72rem", color: "#8fa3ad", marginBottom: "16px", fontFamily: "var(--font-mono, monospace)",
        maxWidth: "92%", marginLeft: "auto", marginRight: "auto"
      }
    });
    nextRow.appendChild(el("span", { css: { fontWeight: "700", color: "#c7e8ee", flexShrink: "0" } }, "NEXT: "));
    nextRow.appendChild(el("span", { css: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, next.name.toUpperCase() + " · T-" + next._days + "D"));
    card.appendChild(nextRow);
  }

  var editLink = el("a", {
    css: {
      position: "relative", zIndex: "1", display: "block",
      fontSize: "0.78rem", color: "#22d3ee", fontWeight: "600", cursor: "pointer",
      textDecoration: "none", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.04em"
    },
    onclick: function() { openExamSettingsModal(); }
  });
  editLink.textContent = "[ MANAGE EXAMS ]";
  card.appendChild(editLink);

  // Live tick
  updateMissionCountdown(readout, primary, urgency);
  if (window._examClockInterval) clearInterval(window._examClockInterval);
  window._examClockInterval = setInterval(function() {
    var r = document.getElementById("exam-tminus-readout");
    if (!r) { clearInterval(window._examClockInterval); return; }
    updateMissionCountdown(r, primary, urgency);
  }, 1000);

  return card;
}

// ── One D / H / M / S digit block in the mission readout ──
function makeMissionDigitBlock(value, label, urgency, isLast) {
  var block = el("div", { css: { display: "flex", alignItems: "flex-start", gap: "clamp(2px, 1vw, 6px)" } });

  var box = el("div", {
    css: {
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(34,211,238,0.2)",
      borderRadius: "12px", padding: "clamp(8px, 2vw, 14px) clamp(6px, 1.6vw, 12px)",
      minWidth: "clamp(48px, 12vw, 76px)", display: "flex", flexDirection: "column", alignItems: "center"
    }
  });
  box.appendChild(el("div", {
    css: {
      fontFamily: "var(--font-mono, 'Courier New', monospace)", fontWeight: "800",
      fontSize: "clamp(1.4rem, 6vw, 2.6rem)", color: "#e0fbff", lineHeight: "1",
      fontVariantNumeric: "tabular-nums",
      textShadow: "0 0 10px " + urgency + "88, 0 0 22px " + urgency + "44"
    },
    txt: String(value).padStart(2, "0")
  }));
  box.appendChild(el("div", {
    css: { fontSize: "clamp(0.55rem, 1.6vw, 0.62rem)", color: "#5b7a8c", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px", fontFamily: "var(--font-mono, monospace)" },
    txt: label
  }));
  block.appendChild(box);

  if (!isLast) {
    block.appendChild(el("div", {
      css: { fontSize: "clamp(1.2rem, 4vw, 1.8rem)", fontWeight: "700", color: urgency, marginTop: "clamp(6px, 2vw, 14px)" },
      txt: ":"
    }));
  }
  return block;
}

// ── Rebuilds the T-minus digit blocks every second ──
function updateMissionCountdown(readout, primary, urgency) {
  var now = new Date();
  var target = new Date(primary.date + "T00:00:00");
  var diffMs = target - now;
  var totalSec = Math.max(0, Math.floor(diffMs / 1000));

  if (totalSec <= 0) {
    readout.innerHTML = "";
    readout.appendChild(el("div", {
      css: { fontSize: "clamp(1.6rem, 6vw, 2.4rem)", fontWeight: "800", color: urgency, fontFamily: "var(--font-display)" },
      txt: "LIFTOFF"
    }));
    return;
  }

  var days = Math.floor(totalSec / 86400);
  var hours = Math.floor((totalSec % 86400) / 3600);
  var mins = Math.floor((totalSec % 3600) / 60);
  var secs = totalSec % 60;

  readout.innerHTML = "";
  readout.appendChild(makeMissionDigitBlock(days, days === 1 ? "day" : "days", urgency, false));
  readout.appendChild(makeMissionDigitBlock(hours, "hrs", urgency, false));
  readout.appendChild(makeMissionDigitBlock(mins, "min", urgency, false));
  readout.appendChild(makeMissionDigitBlock(secs, "sec", urgency, true));
}

// ── Settings modal: add / edit / remove exams ──
function openExamSettingsModal() {
  var overlay = el("div", {
    css: {
      position: "fixed", inset: "0", background: "rgba(4,8,16,0.85)",
      backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: "100000", padding: "20px", animation: "fade-in 0.2s ease"
    }
  });
  overlay.addEventListener("click", function(e) { if (e.target === overlay) document.body.removeChild(overlay); });

  var modal = el("div", {
    css: {
      background: "var(--card)", border: "1px solid var(--border)", borderRadius: "20px",
      padding: "24px", maxWidth: "440px", width: "100%", maxHeight: "80vh", overflowY: "auto"
    }
  });

  var header = el("div", { css: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" } });
  header.appendChild(el("div", { css: { fontSize: "1.15rem", fontWeight: "800", fontFamily: "var(--font-display)", color: "var(--text)" }, txt: "Your exams" }));
  var closeBtn = el("button", {
    css: { background: "var(--card2)", border: "none", borderRadius: "50%", width: "30px", height: "30px", fontSize: "1.1rem", color: "var(--muted)", cursor: "pointer" },
    onclick: function() { document.body.removeChild(overlay); }
  });
  closeBtn.textContent = "×";
  header.appendChild(closeBtn);
  modal.appendChild(header);

  var listWrap = el("div", { css: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "18px" } });
  modal.appendChild(listWrap);

  function redrawList() {
    listWrap.innerHTML = "";
    var list = loadExamList();
    if (list.length === 0) {
      listWrap.appendChild(el("div", { css: { fontSize: "0.85rem", color: "var(--muted)", padding: "8px 0" }, txt: "No exams added yet." }));
      return;
    }
    list.forEach(function(e, i) {
      var row = el("div", {
        css: {
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 12px", background: "var(--bg2)", borderRadius: "12px", border: "1px solid var(--border)"
        }
      });
      var left = el("div", {});
      left.appendChild(el("div", { css: { fontSize: "0.88rem", fontWeight: "700", color: "var(--text)" }, txt: e.name }));
      left.appendChild(el("div", { css: { fontSize: "0.75rem", color: "var(--muted)" }, txt: formatExamDate(e.date) }));
      row.appendChild(left);

      var removeBtn = el("button", {
        css: { background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "0.8rem", fontWeight: "600" },
        onclick: function() {
          var l = loadExamList();
          l.splice(i, 1);
          saveExamList(l);
          redrawList();
          refreshExamCountdown();
        }
      });
      removeBtn.textContent = "Remove";
      row.appendChild(removeBtn);
      listWrap.appendChild(row);
    });
  }
  redrawList();

  // Add-new form
  var formRow = el("div", { css: { display: "flex", flexDirection: "column", gap: "10px", paddingTop: "14px", borderTop: "1px solid var(--border)" } });

  var nameInput = el("input", {
    type: "text",
    css: { padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: "0.88rem", outline: "none", fontFamily: "var(--font-body)" }
  });
  nameInput.placeholder = "Exam name (e.g. State PCS Prelims)";

  var dateInput = el("input", {
    type: "date",
    css: { padding: "10px 12px", borderRadius: "10px", border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--text)", fontSize: "0.88rem", outline: "none", fontFamily: "var(--font-body)" }
  });

  var addBtn = el("button", {
    css: {
      padding: "11px", borderRadius: "10px", border: "none",
      background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff",
      fontWeight: "700", fontSize: "0.88rem", cursor: "pointer", fontFamily: "var(--font-display)"
    },
    onclick: function() {
      var name = nameInput.value.trim();
      var date = dateInput.value;
      if (!name || !date) return;
      var list = loadExamList();
      list.push({ name: name, date: date });
      saveExamList(list);
      refreshExamCountdown();
      document.body.removeChild(overlay);
    }
  });
  addBtn.textContent = "Add exam";

  formRow.appendChild(nameInput);
  formRow.appendChild(dateInput);
  formRow.appendChild(addBtn);
  modal.appendChild(formRow);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}


// ─── REIMAGINED DAILY INSIGHT (AUTO-UPDATING QUOTE) ───────────────
function makeQuoteCard() {
  // 1. Calculate the Quote of the Day based on the current date
  var today = new Date();
  // We use the day of the year to pick an index, ensuring it changes daily
  var dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  var quoteIndex = dayOfYear % DAILY_QUOTES.length; 
  var currentQuote = DAILY_QUOTES[quoteIndex];

  var wrap = el("div", {
    css: {
      position: "relative", margin: "0 auto 40px", width: "100%", maxWidth: "900px",
      background: "linear-gradient(145deg, var(--glass-bg), transparent)",
      border: "1px solid var(--glass-border)",
      borderTop: "1px solid rgba(255,255,255,0.1)", 
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderRadius: "24px", padding: "clamp(28px, 6vw, 52px) clamp(20px, 5vw, 48px)", textAlign: "center",
      overflow: "hidden", cursor: "default",
      transition: "transform 0.4s var(--spring-easing), box-shadow 0.4s ease"
    }
  });

  var quoteGlow = el("div", {
    css: {
      position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
      width: "300px", height: "200px", 
      background: "radial-gradient(ellipse, var(--accent) 0%, transparent 70%)",
      opacity: "0.06", filter: "blur(50px)", pointerEvents: "none", 
      transition: "opacity 0.4s ease"
    }
  });
  wrap.appendChild(quoteGlow);

  wrap.addEventListener("mouseenter", function() {
    this.style.transform = "translateY(-4px)";
    this.style.boxShadow = "0 16px 40px rgba(0,0,0,0.08)";
    quoteGlow.style.opacity = "0.15";
  });
  wrap.addEventListener("mouseleave", function() {
    this.style.transform = "translateY(0)";
    this.style.boxShadow = "none";
    quoteGlow.style.opacity = "0.06";
  });

  var content = el("div", { css: { position: "relative", zIndex: "1" } });

  var badge = el("div", {
    css: {
      display: "inline-flex", alignItems: "center", gap: "8px",
      padding: "6px 14px", borderRadius: "100px", background: "var(--bg2)",
      border: "1px solid var(--border)", fontSize: "0.7rem", fontWeight: "700",
      color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em",
      marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
    },
    htm: "<span style='color: var(--accent); font-size: 0.9rem;'>✦</span> DAILY INSIGHT"
  });
  content.appendChild(badge);

  // Injecting the dynamic quote text — large decorative quote mark
  // set apart from the body text, like an editorial pull-quote, rather
  // than a plain glyph mashed against the first word.
  var quoteBlock = el("div", { css: { position: "relative", maxWidth: "90%", margin: "0 auto 28px" } });
  quoteBlock.appendChild(el("div", {
    css: {
      position: "absolute", top: "-28px", left: "50%", transform: "translateX(-50%)",
      fontSize: "3.2rem", fontFamily: "Georgia, serif", color: "var(--accent)",
      opacity: "0.18", lineHeight: "1", pointerEvents: "none", userSelect: "none"
    },
    txt: "“"
  }));
  quoteBlock.appendChild(el("div", {
    css: {
      position: "relative", fontSize: "clamp(1.2rem, 3.2vw, 2rem)", color: "var(--text)", fontWeight: "500", 
      lineHeight: "1.5", letterSpacing: "-0.01em",
      fontFamily: "var(--font-display)",
      textShadow: "0 4px 12px rgba(0,0,0,0.05)"
    },
    txt: currentQuote.text
  }));
  content.appendChild(quoteBlock);

  var authorRow = el("div", { 
      css: { display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" } 
  });
  
  var lineLeft = el("div", { css: { width: "40px", height: "1px", background: "var(--border)" } });
  
  // Injecting the dynamic author
  var authorText = el("div", {
    css: {
      fontSize: ".85rem", color: "var(--muted)", textTransform: "uppercase",
      letterSpacing: "0.15em", fontWeight: "700"
    },
    txt: currentQuote.author
  });
  var lineRight = el("div", { css: { width: "40px", height: "1px", background: "var(--border)" } });

  authorRow.appendChild(lineLeft);
  authorRow.appendChild(authorText);
  authorRow.appendChild(lineRight);
  
  content.appendChild(authorRow);

  content.appendChild(el("div", {
    css: { fontSize: "0.7rem", color: "var(--subtle)", marginTop: "18px", fontWeight: "500" },
    txt: "A new quote arrives here every day"
  }));

  wrap.appendChild(content);
  return wrap;
}

window.SD = {
    History: { 
        color: "#7c3aed", bg: "#f5f3ff", 
        desc: "Ancient civilizations, medieval kingdoms, freedom struggle, and world history.", 
        topics: [
            // Ancient India
            "Sources of Ancient Indian History", "Prehistoric Period", "Indus Valley Civilization",
            "Vedic Civilization", "Rise of Mahajanapadas", "Jainism", "Buddhism",
            "Shaivism", "Vaishnavism (Bhagwat Dharma)", "Islam", "Christianity", "Zoroastrianism (Parsi Dharma)",
            "Rise of Magadha", "Alexander's Invasion of India", "Mauryan Empire",
            "Shunga & Kanva Dynasties", "Indo-Greek Kingdoms in India", "Shakas", "Kushans",
            "Sangam Age", "Gupta Empire", "Vakataka Dynasty", "Maitraka Dynasty",
            "Pushyabhuti (Vardhana) Dynasty", "Major Dynasties of South India",
            "Rise of Frontier Kingdoms", "Origin of Rajput Dynasties",
            // Medieval India
            "Arab Invasions of India", "Mahmud of Ghazni", "Muhammad Ghori", "Delhi Sultanate",
            "Vijayanagara Empire", "Bahmani Kingdom", "Independent Regional Kingdoms",
            "Sufi Movement", "Bhakti Movement", "Mughal Empire", "Mughal Administration",
            "Decline of the Marathas",
            // Modern India
            "Later Mughal Emperors", "Advent of European Trading Companies",
            "British Conquest of Bengal", "Anglo-Mysore Wars", "Anglo-Sikh Wars",
            "Company Rule & Governor-Generals", "British Administrative Reforms",
            "Revolt of 1857", "Indian National Movement: Key Facts",
            "Socio-Religious Reform Movements", "Organizations of the National Movement",
            "Newspapers & Journals of the Freedom Struggle", "Slogans of the Freedom Movement",
            "Martyrs of India", "Development of the Indian Press",
            "British-Era Commissions & Committees", "Titles Conferred & Recipients",
            "Congress Sessions: Venue & Year", "Historic Battles of India",
            "Major Dynasties, Founders & Capitals", "Social Reform Acts",
            "Muslim Socio-Religious Movements & Organizations",
            // World History
            "Renaissance", "American War of Independence", "French Revolution",
            "Unification of Italy", "Unification of Germany", "Russian Revolution",
            "Industrial Revolution", "Revolution in England", "First World War",
            "Chinese Revolution", "Turkish Revolution", "Rise of Fascism in Italy",
            "Rise of Nazism in Germany", "Japanese Imperialism", "Second World War"
        ], 
        sym: ["⚔️", "🏛️", "📜", "👑", "⚛️", "🛡️"] 
    },
    Geography: { 
        color: "#059669", bg: "#ecfdf5", 
        desc: "Solar system, world geography, and the complete physical geography of India.", 
        topics: [
            "Universe & Solar System",
            "Earth's Structure & Lithosphere",
            "Continents of the World",
            "Climate of India",
            "Soils of India",
            "Agriculture of India",
            "Irrigation in India",
            "Natural Vegetation of India",
            "Mineral Resources of India",
            "Industries of India",
            "Transport in India",
            "Major River Valley Projects of India",
            "Census of India 2011",
            "Major Cities on Riverbanks",
            "Hill Stations of India",
            "Geographical Nicknames of India",
            "Capitals of Indian States & UTs",
            "Indian Tribes",
            "World's Manufacturing Industries",
            "World's Major Industrial Cities",
            "World's Major Tribes",
            "World's Major Vegetation",
            "Habitats of Tribal Peoples",
            "World's Geographical Nicknames",
            "World's Famous Places",
            "World's Major Geographical Discoveries",
            "World's Major Mountain Peaks",
            "World's Major Plateaus",
            "World's Major Deserts",
            "Capitals & Currencies of World Countries",
            "World's Landlocked Countries",
            "World-Famous Sites"
        ], 
        sym: ["🌍", "🏔️", "🌊", "🌿", "🌋", "🌎"] 
    },
    "Environment & Ecology": { 
        color: "#16a34a", bg: "#f0fdf4", 
        desc: "Ecosystems, biodiversity, climate change, and environmental conservation.", 
        topics: [
            "Environment & Sustainable Development",
            "Ecology & Ecosystems",
            "Biodiversity & Conservation",
            "Environmental Pollution",
            "Ozone Layer Depletion",
            "Greenhouse Effect & Climate Change"
        ], 
        sym: ["🌱", "🐅", "♻️", "🌳", "🌍"] 
    },
    Economy: { 
        color: "#0284c7", bg: "#f0f9ff", 
        desc: "National income, banking, poverty, and economic planning in India.", 
        topics: [
            "Economics & Economy Basics",
            "Economic Growth & Development",
            "National Income",
            "Economic Planning",
            "NITI Aayog",
            "6th Economic Census 2014",
            "Poverty & Unemployment",
            "New Economic Policy (LPG Reforms)",
            "Indian Financial System & Banking",
            "Agriculture & Economy",
            "Industry & Economy",
            "Foreign Trade & Balance of Payments",
            "Economics Exam-Relevant Facts",
            "Important Economic Terminology",
            "Miscellaneous Economic Facts"
        ], 
        sym: ["📊", "💰", "🏦", "📈", "💴"] 
    },
    Polity: { 
        color: "#dc2626", bg: "#fef2f2", 
        desc: "The Indian Constitution, Parliament, Judiciary, and governance structures.", 
        topics: [
            "History of the Constitution's Development",
            "Constituent Assembly of India",
            "Preamble of the Constitution",
            "Foreign Sources of the Constitution",
            "Schedules of the Constitution",
            "Merger of Princely States",
            "Union & its Territory",
            "Reorganization of States",
            "Indian Citizenship",
            "Fundamental Rights",
            "Directive Principles of State Policy (DPSP)",
            "Fundamental Duties",
            "Union Executive",
            "Union Parliament",
            "Judiciary (Supreme & High Courts)",
            "State Executive",
            "State Legislature",
            "Centre-State Relations",
            "Inter-State Council",
            "Election Commission",
            "UPSC & State Public Service Commissions",
            "Finance Commission",
            "GST Council",
            "National Commission for Scheduled Castes",
            "National Commission for Scheduled Tribes",
            "National Backward Classes Commission",
            "Comptroller & Auditor General (CAG)",
            "Attorney General of India",
            "National Human Rights Commission",
            "State Human Rights Commission",
            "National Commission for Women",
            "National Commission for Protection of Child Rights",
            "Delimitation Commission",
            "Central Bureau of Investigation (CBI)",
            "Consolidated Fund of India",
            "Contingency Fund of India",
            "Constitutional Amendments Overview",
            "National Development Council",
            "Order of Precedence",
            "Official Language",
            "Emergency Provisions",
            "Constitutional Status of Jammu & Kashmir",
            "National Symbols of India",
            "Financial Committees of Parliament",
            "Panchayati Raj",
            "Important Constitutional Terminology",
            "Important Articles of the Constitution",
            "Major Constitutional Amendments"
        ], 
        sym: ["⚖️", "🏛️", "📜", "🔐", "🇮🇳"] 
    },
    Physics: { 
        color: "#0ea5e9", bg: "#f0f9ff", 
        desc: "Mechanics, thermodynamics, optics, electromagnetism, and modern physics.", 
        topics: [
            "Units & Measurements",
            "Motion",
            "Work, Energy & Power",
            "Gravitation",
            "Pressure",
            "Buoyancy & Flotation",
            "Surface Tension",
            "Viscosity",
            "Elasticity",
            "Periodic Motion",
            "Waves",
            "Sound Waves",
            "Heat & Thermodynamics",
            "Light & Optics",
            "Electrostatics",
            "Electric Current",
            "Magnetism",
            "Radioactivity",
            "Nuclear Fission & Fusion",
            "Scientific Instruments",
            "Important Discoveries in Physics",
            "Conversion of Units",
            "Units of Weights & Measures",
            "Inventors of Instruments & Devices"
        ], 
        sym: ["⚡", "🧲", "💡", "🔭", "🍎"] 
    },
    Chemistry: { 
        color: "#f59e0b", bg: "#fffbeb", 
        desc: "Atomic structure, periodic table, bonding, and organic/inorganic compounds.", 
        topics: [
            "Matter & its Nature",
            "Atomic Structure",
            "Behavior of Gases",
            "Periodic Classification of Elements",
            "Chemical Reactions & Equations",
            "Chemical Bonding",
            "Oxidation & Reduction",
            "Acids, Bases & Salts",
            "Solutions",
            "Carbon & its Compounds",
            "Fuels",
            "Metals",
            "Non-metals",
            "Alloys",
            "Man-made Materials & Polymers",
            "Medicines & Chemicals",
            "Catalysis"
        ], 
        sym: ["🧪", "⚗️", "⚛️", "💊", "🔥"] 
    },
    Biology: { 
        color: "#84cc16", bg: "#f7fee7", 
        desc: "Cell biology, human anatomy, diseases, genetics, and plant physiology.", 
        topics: [
            "Classification of Living Organisms",
            "Cell Biology",
            "Biological Evolution",
            "Genetics",
            "Botany (Plant Kingdom)",
            "Zoology (Animal Kingdom)",
            "Human Body Systems",
            "Nutrients",
            "Human Nutrition",
            "Human Diseases",
            "Medical Inventions & Discoveries",
            "Major Medicines & Drugs",
            "Major Medical Instruments",
            "Founders of Branches of Zoology",
            "Fish Species & Classification",
            "Commercially Important Fishes",
            "Interesting Biological Facts",
            "Important Facts about the Human Body",
            "Major Branches of Science"
        ], 
        sym: ["🧬", "🔬", "🌿", "🩸", "🦠"] 
    },
    "Science & Technology": { 
        color: "#6366f1", bg: "#e0e7ff", 
        desc: "Space missions, defense tech, and scientific advancements.", 
        topics: [
            "Indian Space Research (ISRO)",
            "Indian Nuclear Research",
            "Indian Defence Technology (DRDO)"
        ], 
        sym: ["🚀", "🛰️", "📡", "🛡️", "🧬"] 
    },
    Computer: { 
        color: "#4f46e5", bg: "#eef2ff", 
        desc: "Basics of computers, software, hardware, internet, and networking.", 
        topics: [
            "Computer Architecture & History", "Hardware & Software", "Internet & Networking", 
            "Cyber Security Basics", "Shortcuts & Abbreviations"
        ], 
        sym: ["💻", "🖥️", "🌐", "💾", "⌨️"] 
    },
    "Art & Culture": { 
        color: "#db2777", bg: "#fdf2f8", 
        desc: "Classical dances, music, architecture, festivals, and heritage.", 
        topics: [
            "Major Indian Dance Forms",
            "Indian Music & Instruments",
            "Indian Sculpture",
            "Major Festivals of India",
            "Indian Paintings",
            "UNESCO Cultural Heritage Sites in India",
            "Cultural Institutions of India"
        ], 
        sym: ["🎭", "🎨", "🛕", "🪘", "💃", "🏛️"] 
    },
    Sports: { 
        color: "#f97316", bg: "#fff7ed", 
        desc: "Olympics, tournaments, athletes, and sports terminology.", 
        topics: [
            "Olympic Games",
            "Commonwealth Games",
            "Asian Games",
            "Major Sports & Related Facts",
            "Sports Cups & Trophies",
            "Players Per Side in Major Sports",
            "National Sports of Countries",
            "Famous Sports Grounds",
            "Playing Areas of Various Sports",
            "Sports-Related Awards",
            "Major Sports Organizations of India"
        ], 
        sym: ["🏅", "⚽", "🏏", "🎾", "🏆"] 
    },
    Miscellaneous: { 
        color: "#64748b", bg: "#f8fafc", 
        desc: "First in India/World, organizations, awards, and important dates.", 
        topics: [
            "First in India (Women)",
            "First in India (Men)",
            "First in India (Others)",
            "Largest, Longest & Tallest in India",
            "First in the World",
            "Largest, Smallest, Longest & Tallest in the World",
            "National Symbols of Major Countries",
            "International Borders",
            "National Monuments of Countries",
            "Lines on the Map",
            "News Agencies of Major Countries",
            "Government Systems of Major Countries",
            "Political Parties of Various Countries",
            "Emblems & Symbols of Major Countries",
            "National Animals & Birds of Major Countries",
            "Major Airlines of the World",
            "Major Newspapers & Publication Places",
            "Major Intelligence Agencies of the World",
            "Parliaments of Various Countries",
            "United Nations",
            "Other Major World Organizations",
            "World Organizations & their Headquarters",
            "Contemporary International Decades",
            "Important National & International Days",
            "Major Tourist Destinations",
            "Defence of India",
            "Military Training Institutions of India",
            "Internal Security System of India",
            "Formation Days of Indian States",
            "Major Research Institutions of India",
            "Memorials & Samadhi Sites",
            "Popular Nicknames of Famous Personalities",
            "Places Associated with Famous Personalities",
            "Major Awards & Honors",
            "National Awards",
            "Bharat Ratna Awardees",
            "Jnanpith Award-Winning Writers",
            "Dadasaheb Phalke Award Recipients",
            "People Associated with Great Works",
            "Authors & their Books",
            "Abbreviations"
        ], 
        sym: ["🌍", "🏢", "📅", "🥇", "📚"] 
    }
  };

// ─── AI DOUBT SOLVER ─────────────────────────────────────────────
var ADS_LOADING = false;

function makeAIDoubtSolver() {
  var wrapper = el("div", {
  id: "ai-doubt-solver",
  css: {
    marginBottom: "32px", borderRadius: "24px", overflow: "hidden",
    border: "1px solid var(--glass-border)", 
    background: "var(--glass-bg)",
    backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
    transition: "all 0.5s var(--spring-easing)" 
  }
  });

  var bar = el("div", {
    id: "ads-bar",
    css: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 18px", cursor: "pointer", background: "var(--card2)",
      transition: "background 0.2s ease", userSelect: "none"
    }
  });

  var barLeft = el("div", {css: {display: "flex", alignItems: "center", gap: "12px"}});

  var icon = el("div", {
    css: {
      width: "40px", height: "40px", flexShrink: "0", background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
      borderRadius: "11px", display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 4px 12px rgba(99,102,241,0.45)", fontFamily: "var(--font-display)", 
      fontSize: "1.1rem", fontWeight: "800", color: "#fff", letterSpacing: "-0.02em"
    }
  }, "G"); // Updated from 'S' to 'G' for Gemini

  var barText = el("div");
  barText.appendChild(el("div", {
    css: {fontFamily: "var(--font-display)", fontSize: ".93rem", fontWeight: "700", color: "var(--text)", letterSpacing: "-0.02em"}
  }, "AI Doubt Solver"));
  barText.appendChild(el("div", {
    css: {fontSize: ".73rem", color: "var(--muted)", marginTop: "2px"}
  }, "Tap to collapse..."));

  barLeft.appendChild(icon);
  barLeft.appendChild(barText);

  var arrow = el("div", {
    css: {fontSize: "1.1rem", color: "var(--muted)", transition: "transform 0.3s cubic-bezier(0.2,0.8,0.2,1)", lineHeight: "1", transform: "rotate(180deg)"}
  }, "▾");

  bar.appendChild(barLeft);
  bar.appendChild(arrow);

  var panel = el("div", {
    css: { display: "flex", flexDirection: "column", borderTop: "1px solid var(--border)" }
  });

  var chatArea = el("div", {
  id: "ads-chat-area",
  css: {
    maxHeight: "350px", overflowY: "auto", padding: "20px",
    display: "flex", flexDirection: "column", gap: "20px",
    background: "transparent"
  }
  });

  var welcome = el("div", {
    id: "ads-welcome",
    css: {textAlign: "center", padding: "20px 16px 12px"}
  });
  welcome.appendChild(el("div", {css: {fontSize: "1.8rem", marginBottom: "8px"}}, "🎓"));
  welcome.appendChild(el("div", {css: {fontWeight: "700", color: "var(--text)", marginBottom: "5px", fontFamily: "var(--font-display)"}}, "Ask me anything!"));
  
  // Updated the welcome text to reflect the 13 generated subjects
  welcome.appendChild(el("div", {css: {fontSize: ".8rem", color: "var(--muted)", lineHeight: "1.5"}}, "History, Geography, Polity, Economy, Sciences, Art & Culture, Computer & more — I'm here to help."));
  chatArea.appendChild(welcome);

  var messages = el("div", {id: "ads-messages"});
  chatArea.appendChild(messages);
  panel.appendChild(chatArea);

  var inputRow = el("div", {
    css: {
      display: "flex", alignItems: "center", gap: "8px",
      padding: "10px 14px", borderTop: "1px solid var(--border)"
    }
  });

  var input = el("input", {
    id: "ads-input", type: "text", placeholder: "e.g. What is the Preamble of India?",
    css: {
      flex: "1", background: "var(--bg2)", border: "1.5px solid var(--border)", 
      borderRadius: "10px", color: "var(--text)", fontFamily: "var(--font-body)",
      fontSize: ".85rem", padding: "9px 13px", outline: "none"
    }
  });
  input.addEventListener("focus", function() {
    this.style.borderColor = "var(--accent)"; this.style.boxShadow = "0 0 0 3px var(--accent-glow)";
  });
  input.addEventListener("blur", function() {
    this.style.borderColor = "var(--border)"; this.style.boxShadow = "none";
  });
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") sendDoubt(messages, welcome, input, sendBtn);
  });

  var sendBtn = el("button", {
    css: {
      width: "38px", height: "38px", flexShrink: "0", background: "linear-gradient(135deg, #3174F6, #5a9af8)",
      border: "none", borderRadius: "10px", color: "#fff", cursor: "pointer", 
      display: "flex", alignItems: "center", justifyContent: "center", 
      transition: "all 0.18s ease", boxShadow: "0 4px 12px rgba(49,116,246,0.35)"
    },
    onclick: function() { sendDoubt(messages, welcome, input, sendBtn); }
  });
  sendBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';
  sendBtn.addEventListener("mouseenter", function() { this.style.transform = "translateY(-2px)"; this.style.boxShadow = "0 6px 16px rgba(49,116,246,0.5)"; });
  sendBtn.addEventListener("mouseleave", function() { this.style.transform = "translateY(0)"; this.style.boxShadow = "0 4px 12px rgba(49,116,246,0.35)"; });

  inputRow.appendChild(input);
  inputRow.appendChild(sendBtn);
  panel.appendChild(inputRow);

  // Updated attribution to Gemini
  panel.appendChild(el("div", {
    css: {textAlign: "center", fontSize: ".62rem", color: "var(--subtle)", padding: "6px 14px 12px", letterSpacing: "0.04em"}
  }, "Powered by Gemini · Made for India 🇮🇳"));

  var isOpen = true; 
  
  bar.addEventListener("click", function() {
    isOpen = !isOpen;
    panel.style.display = isOpen ? "flex" : "none";
    arrow.style.transform = isOpen ? "rotate(180deg)" : "rotate(0deg)";
    barText.children[1].textContent = isOpen ? "Tap to collapse..." : "Tap to ask anything about your studies...";
    wrapper.style.boxShadow = isOpen ? "var(--shadow-elevated, 0 12px 32px rgba(0,0,0,0.12))" : "var(--shadow-card)";
    bar.style.background = isOpen ? "var(--card2)" : "transparent";
    if (isOpen) setTimeout(function() { input.focus(); }, 300);
  });

  bar.addEventListener("mouseenter", function() { if (!isOpen) this.style.background = "var(--card2)"; });
  bar.addEventListener("mouseleave", function() { if (!isOpen) this.style.background = "transparent"; });

  wrapper.appendChild(bar);
  wrapper.appendChild(panel);
  return wrapper;
}

async function sendDoubt(messages, welcome, input, sendBtn) {
  if (ADS_LOADING) return;
  var question = input.value.trim();
  if (!question) return;

  if (welcome) welcome.style.display = "none";

  input.value = "";
  ADS_LOADING = true;
  sendBtn.disabled = true;
  sendBtn.style.opacity = "0.5";

  messages.appendChild(adsCreateBubble("user", question));
  adsScrollChat();

  var typing = adsCreateTyping();
  messages.appendChild(typing);
  adsScrollChat();

  try {
    var res = await fetch("/api/doubt", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ question: question })
    });

    var data = await res.json();
    messages.removeChild(typing);

    if (data.answer) {
      messages.appendChild(adsCreateBubble("ai", data.answer));
    } else if (data.error) {
      messages.appendChild(adsCreateBubble("ai", "⚠️ " + data.error));
    } else {
      messages.appendChild(adsCreateBubble("ai", "⚠️ No response. Please try again."));
    }
  } catch(err) {
    if(messages.contains(typing)) messages.removeChild(typing);
    messages.appendChild(adsCreateBubble("ai", "⚠️ Network error. Check your connection."));
  }

  ADS_LOADING = false;
  sendBtn.disabled = false;
  sendBtn.style.opacity = "1";
  adsScrollChat();
  input.focus();
}

function adsCreateBubble(type, text) {
  var msg = el("div", {css: {display: "flex", gap: "8px", flexDirection: type === "user" ? "row-reverse" : "row", animation: "msg-pop 0.25s ease", marginBottom: "4px"}});

  var avatar = el("div", {
    css: {
      width: "26px", height: "26px", borderRadius: "50%", flexShrink: "0",
      display: "flex", alignItems: "center", justifyContent: "center",
      marginTop: "2px", fontSize: ".8rem",
      background: type === "user" ? "var(--accent)" : "linear-gradient(135deg, #6366F1, #8B5CF6)", 
      color: "#fff", fontWeight: "700", overflow: "hidden"
    }
  });
  
  if (type === "user") {
    var userName = (window.currentUser && window.currentUser.displayName)
      ? window.currentUser.displayName.trim()[0].toUpperCase()
      : "U";
    avatar.textContent = userName;
  } else {
    // Updated AI avatar from 'S' to 'G'
    avatar.textContent = "G";
    avatar.style.fontFamily = "var(--font-display)";
    avatar.style.fontWeight = "800";
    avatar.style.fontSize = ".75rem";
  }

  var bubble = el("div", {
    css: {
      maxWidth: "82%", padding: "10px 14px", fontSize: ".9rem", lineHeight: "1.6",
      color: type === "user" ? "#fff" : "var(--text)", 
      fontWeight: "500", 
      background: type === "user" ? "var(--accent)" : "var(--card)", 
      border: type === "user" ? "none" : "1.5px solid var(--border2)", 
      borderRadius: type === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
      boxShadow: type === "user" ? "0 4px 12px rgba(0,0,0,0.15)" : "0 2px 10px rgba(0,0,0,0.04)"
    }
  });
  
  var formattedText = text
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong style='color: var(--text); font-weight: 800;'>$1</strong>");
    
  bubble.innerHTML = formattedText;

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  return msg;
}

function adsCreateTyping() {
  var msg = el("div", {css: {display: "flex", gap: "8px", alignItems: "flex-end"}});
  var avatar = el("div", {
    css: {
      width: "26px", height: "26px", borderRadius: "50%", flexShrink: "0",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #6366F1, #8B5CF6)", overflow: "hidden"
    }
  });
  
  // Updated AI typing avatar from 'S' to 'G'
  avatar.textContent = "G";
  avatar.style.background = "linear-gradient(135deg, #6366F1, #8B5CF6)";
  avatar.style.fontFamily = "var(--font-display)";
  avatar.style.fontWeight = "800";
  avatar.style.fontSize = ".75rem";
  avatar.style.color = "#fff";

  var bubble = el("div", {
    css: {
      padding: "10px 14px", borderRadius: "14px 14px 14px 4px",
      background: "var(--card2)", border: "1px solid var(--border)",
      display: "flex", gap: "4px", alignItems: "center"
    }
  });
  for (var i = 0; i < 3; i++) {
    var dot = el("span", {
      css: {
        width: "6px", height: "6px", borderRadius: "50%", background: "var(--muted)", 
        display: "inline-block", animation: "typing-bounce 1.2s ease-in-out infinite", animationDelay: (i * 0.2) + "s"
      }
    });
    bubble.appendChild(dot);
  }
  msg.appendChild(avatar);
  msg.appendChild(bubble);
  return msg;
}

function adsScrollChat() {
  var area = document.getElementById("ads-chat-area");
  if (area) setTimeout(function() { area.scrollTop = area.scrollHeight; }, 50);
}

// ─── MAIN PAGE RENDER (Without Skill Tree Banner) ────────────────────
function pgHome(){
  var tot=SUBJ.reduce(function(s,k){return s+(QD[k]||[]).length;},0);
  var w=el("div",{cls:"fd"});
  w.appendChild(makeNav("home"));

  w.appendChild(makeModernHero());
  if (typeof makeQuoteCard === 'function') w.appendChild(makeQuoteCard());

  w.appendChild(makeAIDoubtSolver());

  var subjSec = el("div", { id: "ss", css: { marginBottom: "60px", position: "relative", zIndex: "2" } });
  
  var subjTitle = el("div", { css: { textAlign: "center", marginBottom: "40px" } });
  subjTitle.appendChild(el("div", { 
    css: { 
      fontSize: ".7rem", color: "var(--accent2)", textTransform: "uppercase", 
      letterSpacing: ".2em", fontWeight: "700", marginBottom: "12px", 
      fontFamily: "var(--font-display)" 
    }, 
    txt: "Explore the Modules" 
  }));
  subjTitle.appendChild(el("div", { 
    css: { 
      fontSize: "2.2rem", fontWeight: "800", letterSpacing: "-0.03em", 
      fontFamily: "var(--font-display)", color: "var(--text)" 
    }, 
    txt: "What's on the agenda?" 
  }));
  subjSec.appendChild(subjTitle);
  
  var gridWrap = el("div", {
    css: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: "24px"
    }
  });

  if (typeof SUBJ !== 'undefined') {
    SUBJ.forEach(function(s) {
      var d = window.SD[s], cnt = (typeof QD !== 'undefined' && QD[s] ? QD[s].length : 0);
      
      var row = el("div", {
        css: {
          display: "flex", flexDirection: "column", padding: "28px",
          borderRadius: "24px", background: "var(--glass-bg)", 
          border: "1px solid var(--glass-border)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          cursor: "pointer", transition: "all 0.4s var(--spring-easing)",
          position: "relative", overflow: "hidden"
        },
        onclick: function() { window.activeTopic = null; go("topiclist", s); }
      });
      
      var ambientGlow = el("div", {
        css: {
          position: "absolute", top: "-50px", right: "-50px",
          width: "150px", height: "150px", borderRadius: "50%",
          background: d.color, opacity: "0.08", filter: "blur(40px)",
          pointerEvents: "none", transition: "opacity 0.4s ease"
        }
      });
      row.appendChild(ambientGlow);

      row.addEventListener("mouseenter", function() {
        this.style.transform = "scale(1.02) translateY(-6px)";
        this.style.background = "var(--glass-border)";
        this.style.borderColor = d.color + "40"; 
        this.style.boxShadow = "0 24px 48px rgba(0,0,0,0.08), 0 0 0 1px " + d.color + "20";
        ambientGlow.style.opacity = "0.2";
      });
      row.addEventListener("mouseleave", function() {
        this.style.transform = "scale(1) translateY(0)";
        this.style.background = "var(--glass-bg)";
        this.style.borderColor = "var(--glass-border)";
        this.style.boxShadow = "none";
        ambientGlow.style.opacity = "0.08";
      });

      var ctop = el("div", { css: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", position: "relative", zIndex: "1" } });
      
      ctop.appendChild(el("div", {
        css: { fontSize: "1.5rem", fontWeight: "700", letterSpacing: "-0.02em", color: "var(--text)", fontFamily: "var(--font-display)" },
        txt: s
      }));
      
      ctop.appendChild(el("span", {
        css: { 
          fontSize: ".7rem", fontWeight: "600", padding: "6px 12px", 
          borderRadius: "100px", border: "1px solid " + d.color + "40", 
          color: d.color, letterSpacing: ".05em", background: d.color + "10"
        }
      }, cnt + " Nodes"));
      
      row.appendChild(ctop);

      row.appendChild(el("div", {
        css: { 
          fontSize: ".95rem", color: "var(--text-muted)", lineHeight: "1.6", 
          fontWeight: "300", marginBottom: "24px", flex: "1", position: "relative", zIndex: "1"
        }, 
        txt: d.desc 
      }));

      var cta = el("div", { css: { display: "flex", gap: "8px", alignItems: "center", position: "relative", zIndex: "1" } });
      cta.appendChild(el("span", {
        css: { fontSize: ".85rem", fontWeight: "600", color: d.color, letterSpacing: "0.02em" }
      }, "Access Module →"));
      row.appendChild(cta);

      gridWrap.appendChild(row);
    });
  }
  w.appendChild(gridWrap);

  var ft=el("div",{css:{paddingTop:"16px",borderTop:"1.5px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}});
  var frl=el("div",{css:{display:"flex",alignItems:"center",gap:"8px"}});
  if (typeof makeLogo === 'function') frl.appendChild(makeLogo(22));
  frl.appendChild(el("div",{css:{fontSize:".75rem",color:"var(--subtle)"},txt:"StudyLab — Your Ultimate Competitive Exam Partner"}));
  ft.appendChild(frl);
  
  var footerCredit = el("a",{
    href: "https://t.me/studylab_app", 
    target: "_blank",
    css: {fontSize:".75rem", color:"var(--accent)", textDecoration:"none", fontWeight:"600"}
  });
  footerCredit.textContent = "Created with ❤️ by Aman (@jaglan_aman)";
  ft.appendChild(footerCredit);
  
  w.appendChild(ft);
  return w;
}

// ── INTERACTIVE EMOJI FEEDBACK WIDGET ──
function createSmartFeedbackWidget() {
    var widgetWrap = el("div", { 
        css: { 
            background: "var(--card)", border: "1.5px solid var(--border)", 
            borderRadius: "24px", padding: "32px 28px", margin: "24px auto", 
            maxWidth: "680px", width: "calc(100% - 16px)", boxSizing: "border-box",
            textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
            transition: "box-shadow 0.3s ease, border-color 0.3s ease"
        } 
    });

    widgetWrap.appendChild(el("h3", { css: { margin: "0 0 6px 0", fontSize: "1.4rem", color: "var(--text)", fontFamily: "var(--font-display)", fontWeight: "800" }, txt: "Rate your experience!" }));
    widgetWrap.appendChild(el("p", { css: { margin: "0 0 20px 0", fontSize: ".9rem", color: "var(--muted)" }, txt: "Your feedback helps us improve StudyLab." }));

    var emojiDisplay = el("div", { 
        css: { fontSize: "4rem", margin: "10px 0 24px 0", transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)", display: "inline-block", transformOrigin: "center", willChange: "transform", lineHeight: "1" },
        txt: "🤔" 
    });
    var emojis = ["🤔", "😞", "😐", "🙂", "😊", "🤩"];
    var ratingText = ["Tap a star", "Needs Work", "It's Okay", "Good", "Great!", "Absolutely Amazing!"];
    var statusText = el("div", { css: { fontSize: ".95rem", fontWeight: "700", color: "var(--accent)", marginBottom: "20px", minHeight: "22px" }, txt: "Tap a star" });

    widgetWrap.appendChild(emojiDisplay);

    var starContainer = el("div", { css: { display: "flex", justifyContent: "center", gap: "10px", fontSize: "2.8rem", color: "var(--border2)", cursor: "pointer", marginBottom: "24px" } });
    var stars = [];
    var currentRating = 0; 
    var formReveal = el("div", { css: { display: "none", animation: "fade-in 0.4s ease", marginTop: "10px" } });

    for (let i = 1; i <= 5; i++) {
        let star = el("span", { txt: "★", css: { transition: "all 0.2s ease", color: "var(--border)" } });
        star.onclick = function() {
            currentRating = i;
            emojiDisplay.style.willChange = "transform";
            emojiDisplay.style.transform = "scale(1.2) rotate(5deg)";
            setTimeout(() => {
                emojiDisplay.style.transform = "scale(1) rotate(0deg)";
                setTimeout(() => { emojiDisplay.style.willChange = "auto"; }, 300);
            }, 200);
            emojiDisplay.textContent = emojis[i];
            statusText.textContent = ratingText[i];
            statusText.style.color = (i <= 2) ? "#ef4444" : (i <= 4) ? "#f59e0b" : "#10b981";

            stars.forEach((s, index) => {
                if (index < currentRating) {
                    s.style.color = "#f59e0b";
                    s.style.textShadow = "0 0 15px rgba(245, 158, 11, 0.4)";
                    s.style.transform = "scale(1.15)";
                } else {
                    s.style.color = "var(--border)";
                    s.style.textShadow = "none";
                    s.style.transform = "scale(1)";
                }
            });
            formReveal.style.display = "block";
        };
        stars.push(star);
        starContainer.appendChild(star);
    }

    widgetWrap.appendChild(starContainer);
    widgetWrap.appendChild(statusText);

    var textArea = el("textarea", { 
        css: { width: "100%", padding: "16px", borderRadius: "14px", border: "1.5px solid var(--border2)", background: "var(--bg)", color: "var(--text)", minHeight: "100px", marginBottom: "20px", fontFamily: "var(--font-body)", resize: "none", boxSizing: "border-box", display: "block", fontSize: ".95rem", lineHeight: "1.5", outline: "none", transition: "border-color 0.2s ease" } 
    });
    textArea.placeholder = "Tell us what you loved or what we can improve... (Optional)";
    textArea.onfocus = function() { textArea.style.borderColor = "var(--accent)"; };
    textArea.onblur = function() { textArea.style.borderColor = "var(--border2)"; };

    var submitBtn = el("button", { 
        css: { width: "100%", padding: "16px", background: "linear-gradient(135deg, #4F8EF7, #3b82f6)", color: "#fff", border: "none", borderRadius: "14px", fontWeight: "700", fontFamily: "var(--font-body)", cursor: "pointer", fontSize: "1.05rem", boxShadow: "0 6px 20px rgba(79,142,247,0.25)", transition: "transform 0.2s, box-shadow 0.2s", boxSizing: "border-box", display: "block" }, 
        txt: "Send Feedback 🚀" 
    });
    submitBtn.onmousedown = function() { this.style.transform = "scale(0.97)"; };
    submitBtn.onmouseup = function() { this.style.transform = "scale(1)"; };
    submitBtn.onmouseleave = function() { this.style.transform = "scale(1)"; };

    submitBtn.onclick = function() {
        if (currentRating === 0) return;
        var feedbackText = textArea.value.trim();
        var user = { name: "Guest User", phone: "No Phone" };
        try {
            var savedData = localStorage.getItem('sl_user');
            if (savedData) user = JSON.parse(savedData);
        } catch(e) {}

        if (window.STUDYLAB_FEEDBACK_URL) {
            submitBtn.textContent = "Sending...";
            submitBtn.style.opacity = "0.7";
            fetch(window.STUDYLAB_FEEDBACK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ Date: new Date().toLocaleString("en-IN"), Name: user.name, Phone: user.phone, Rating: currentRating + " stars", Message: feedbackText || "(no message)" })
            }).then(function() {
                var firstName = user.name.split(' ')[0] || "there";
                widgetWrap.innerHTML = `<div style="padding: 40px 20px; text-align: center; animation: bounce-in 0.5s ease;"><div style="font-size: 3.8rem; margin-bottom: 20px;">💖</div><div style="font-weight: 800; font-size: 1.5rem; color: var(--text); margin-bottom: 10px; font-family: var(--font-display);">You're awesome, ${firstName}!</div><div style="font-size: 1rem; color: var(--muted); line-height: 1.6;">Thank you for helping us make StudyLab the best exam partner.</div></div>`;
            }).catch(function() {
                alert("Network error. Please try again.");
                submitBtn.textContent = "Send Feedback 🚀";
                submitBtn.style.opacity = "1";
            });
        }
    };

    formReveal.appendChild(textArea);
    formReveal.appendChild(submitBtn);
    widgetWrap.appendChild(formReveal);
    return widgetWrap;
}

// ── OPEN FEEDBACK IN A POPUP MODAL ──
window.openFeedbackModal = function() {
    var overlay = el("div", {
        css: { position: "fixed", inset: "0", background: "rgba(4, 8, 16, 0.85)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "100000", padding: "20px", animation: "fade-in 0.2s ease" }
    });
    overlay.addEventListener("click", function(e) { if (e.target === overlay) document.body.removeChild(overlay); });

    var widget = createSmartFeedbackWidget();
    widget.style.margin = "0"; 
    widget.style.position = "relative"; 

    var closeBtn = el("button", {
        css: { position: "absolute", top: "16px", right: "16px", background: "var(--card2)", border: "none", borderRadius: "50%", width: "32px", height: "32px", fontSize: "1.2rem", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" },
        txt: "×",
        onclick: function() { document.body.removeChild(overlay); }
    });
    closeBtn.onmouseover = function() { this.style.color = "var(--text)"; this.style.background = "var(--border2)"; };
    closeBtn.onmouseleave = function() { this.style.color = "var(--muted)"; this.style.background = "var(--card2)"; };

    widget.appendChild(closeBtn);
    overlay.appendChild(widget);
    document.body.appendChild(overlay);
};