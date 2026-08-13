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

// ─── REIMAGINED HERO SECTION (Without Skill Tree Badge) ───────────────
function makeModernHero() {
  var wrap = el("div", {
    css: {
      position: "relative", 
      padding: "90px 20px 100px",
      textAlign: "center", 
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

  var content = el("div", { css: { position: "relative", zIndex: "1", maxWidth: "800px", margin: "0 auto" } });

  // High-Impact Headline
  content.appendChild(el("h1", {
    css: {
      fontSize: "clamp(2.8rem, 7vw, 4.5rem)", fontWeight: "800",
      letterSpacing: "-0.03em", fontFamily: "var(--font-display)",
      color: "var(--text)", lineHeight: "1.1", marginBottom: "24px",
      textShadow: "0 12px 32px rgba(0,0,0,0.08)"
    },
    htm: "Don't Just Study. <br><span style='background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 200% auto; animation: gradient-shift 3s ease infinite;'>Conquer the Syllabus.</span>"
  }));

  // Compelling Subtitle
  content.appendChild(el("p", {
    css: {
      fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "var(--muted)", lineHeight: "1.6",
      marginBottom: "48px", fontWeight: "400", maxWidth: "90%", margin: "0 auto 48px"
    },
    txt: "A distraction-free, gamified learning lab for UPSC & State PCS. Track your progress, unlock skills, and master concepts faster."
  }));

  // Call To Action Row
  var ctaRow = el("div", { css: { display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "48px" } });
  
  // Primary Button (Glowing & Highly Clickable)
  var primaryBtn = el("button", {
    css: {
      padding: "16px 36px", borderRadius: "16px", border: "none",
      background: "linear-gradient(135deg, #3b82f6, #6366f1)", 
      color: "#ffffff", fontWeight: "700", 
      fontSize: "1.05rem", cursor: "pointer", fontFamily: "var(--font-display)",
      boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.5), inset 0 2px 4px rgba(255,255,255,0.25)", 
      transition: "all 0.4s var(--spring-easing)",
      display: "flex", alignItems: "center", gap: "8px"
    },
    onclick: function() { go("govtupdates"); }
  });
  primaryBtn.innerHTML = "View Updates <span style='font-size: 1.1rem;'></span>";
  
  primaryBtn.addEventListener("mouseenter", function() { 
      this.style.transform = "scale(1.05) translateY(-3px)"; 
      this.style.boxShadow = "0 20px 35px -5px rgba(99, 102, 241, 0.6), inset 0 2px 4px rgba(255,255,255,0.3)"; 
  });
  primaryBtn.addEventListener("mouseleave", function() { 
      this.style.transform = "scale(1) translateY(0)"; 
      this.style.boxShadow = "0 10px 25px -5px rgba(99, 102, 241, 0.5), inset 0 2px 4px rgba(255,255,255,0.25)"; 
  });
  
  // Secondary Button (Glassmorphic)
  var secondaryBtn = el("button", {
    css: {
      padding: "16px 36px", borderRadius: "16px", border: "1px solid var(--glass-border)",
      background: "var(--glass-bg)", color: "var(--text)", fontWeight: "600",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      fontSize: "1.05rem", cursor: "pointer", fontFamily: "var(--font-body)", 
      transition: "all 0.4s var(--spring-easing)",
      display: "flex", alignItems: "center", gap: "8px"
    },
    onclick: function() { go("shorts"); }
  });
  secondaryBtn.innerHTML = "Study Shorts";
  
  secondaryBtn.addEventListener("mouseenter", function() { 
      this.style.transform = "scale(1.05) translateY(-3px)";
      this.style.background = "var(--glass-border)"; 
      this.style.borderColor = "var(--muted)";
  });
  secondaryBtn.addEventListener("mouseleave", function() { 
      this.style.transform = "scale(1) translateY(0)";
      this.style.background = "var(--glass-bg)"; 
      this.style.borderColor = "var(--glass-border)";
  });
  
  ctaRow.appendChild(primaryBtn);
  ctaRow.appendChild(secondaryBtn);
  content.appendChild(ctaRow);

  // Trust / Feature Pills (Social Proof for Students)
  var featuresRow = el("div", {
      css: {
          display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap",
          paddingTop: "24px", borderTop: "1px solid var(--glass-border)"
      }
  });

  var features = [
      { icon: "🎯", text: "Curated MCQs" },
      { icon: "🧠", text: "AI Doubt Solver" },
      { icon: "⚡", text: "Bite-sized Logic" }
  ];

  features.forEach(function(f) {
      var featCard = el("div", {
          css: {
              display: "flex", alignItems: "center", gap: "8px",
              color: "var(--muted)", fontSize: "0.85rem", fontWeight: "600",
              letterSpacing: "0.02em"
          }
      });
      featCard.innerHTML = `<span style="font-size: 1.1rem;">${f.icon}</span> <span>${f.text}</span>`;
      featuresRow.appendChild(featCard);
  });

  content.appendChild(featuresRow);
  wrap.appendChild(content);

  return wrap;
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
      position: "relative", margin: "0 auto 40px", maxWidth: "800px",
      background: "linear-gradient(145deg, var(--glass-bg), transparent)",
      border: "1px solid var(--glass-border)",
      borderTop: "1px solid rgba(255,255,255,0.1)", 
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderRadius: "24px", padding: "40px", textAlign: "center",
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

  // Injecting the dynamic quote text
  content.appendChild(el("div", {
    css: {
      fontSize: "clamp(1.2rem, 3vw, 1.6rem)", color: "var(--text)", fontWeight: "500", 
      lineHeight: "1.5", letterSpacing: "-0.01em",
      fontFamily: "var(--font-display)", maxWidth: "85%", margin: "0 auto 28px",
      textShadow: "0 4px 12px rgba(0,0,0,0.05)"
    },
    txt: "“" + currentQuote.text + "”" 
  }));

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

  wrap.appendChild(content);
  return wrap;
}

window.SD = {
    History: { 
        color: "#7c3aed", bg: "#f5f3ff", 
        desc: "Ancient civilizations, medieval kingdoms, freedom struggle, and world history.", 
        topics: [
            "Ancient Indian Sources & Prehistory", "Indus Valley Civilization", "Vedic Period", 
            "Buddhism, Jainism & Other Religions", "Mauryan & Gupta Empires", "South Indian Dynasties", 
            "Delhi Sultanate", "Mughal Empire & Marathas", "Advent of Europeans", 
            "Revolt of 1857", "Indian National Movement", "Socio-Religious Reforms", 
            "World History Basics"
        ], 
        sym: ["⚔️", "🏛️", "📜", "👑", "⚛️", "🛡️"] 
    },
    Geography: { 
        color: "#059669", bg: "#ecfdf5", 
        desc: "Solar system, world geography, and the complete physical geography of India.", 
        topics: [
            "Universe & Solar System", "Earth's Structure & Lithosphere", "World Geography & Continents", 
            "Physical Geography of India", "Indian Rivers & Lakes", "Climate & Natural Vegetation", 
            "Indian Agriculture & Soils", "Minerals & Industries", "Transport & Infrastructure", 
            "Demographics (Census 2011)"
        ], 
        sym: ["🌍", "🏔️", "🌊", "🌿", "🌋", "🌎"] 
    },
    "Environment & Ecology": { 
        color: "#16a34a", bg: "#f0fdf4", 
        desc: "Ecosystems, biodiversity, climate change, and environmental conservation.", 
        topics: [
            "Ecology & Ecosystems", "Biodiversity & Conservation", "Environmental Pollution", 
            "Climate Change & Greenhouse Effect", "Ozone Layer Depletion"
        ], 
        sym: ["🌱", "🐅", "♻️", "🌳", "🌍"] 
    },
    Economy: { 
        color: "#0284c7", bg: "#f0f9ff", 
        desc: "National income, banking, poverty, and economic planning in India.", 
        topics: [
            "Economic Planning & NITI Aayog", "National Income", "Poverty & Unemployment", 
            "Indian Banking & Finance", "Agriculture & Industries", "Foreign Trade & BOP", 
            "Important Economic Terminology"
        ], 
        sym: ["📊", "💰", "🏦", "📈", "💴"] 
    },
    Polity: { 
        color: "#dc2626", bg: "#fef2f2", 
        desc: "The Indian Constitution, Parliament, Judiciary, and governance structures.", 
        topics: [
            "Constitutional History & Assembly", "Preamble & Territory", "Fundamental Rights & Duties", 
            "Directive Principles (DPSP)", "Union Executive & Parliament", "State Executive & Legislature", 
            "Judiciary (Supreme & High Courts)", "Panchayati Raj & Local Govt", 
            "Constitutional Bodies (EC, UPSC, CAG)", "Important Amendments & Articles"
        ], 
        sym: ["⚖️", "🏛️", "📜", "🔐", "🇮🇳"] 
    },
    Physics: { 
        color: "#0ea5e9", bg: "#f0f9ff", 
        desc: "Mechanics, thermodynamics, optics, electromagnetism, and modern physics.", 
        topics: [
            "Units, Measurements & Motion", "Work, Energy & Gravity", "Properties of Matter (Fluids, Viscosity)", 
            "Heat & Thermodynamics", "Waves & Sound", "Light & Optics", 
            "Electricity & Magnetism", "Modern & Nuclear Physics", "Scientific Instruments & Discoveries"
        ], 
        sym: ["⚡", "🧲", "💡", "🔭", "🍎"] 
    },
    Chemistry: { 
        color: "#f59e0b", bg: "#fffbeb", 
        desc: "Atomic structure, periodic table, bonding, and organic/inorganic compounds.", 
        topics: [
            "Matter & Atomic Structure", "Behavior of Gases", "Periodic Table", 
            "Chemical Bonding & Reactions", "Acids, Bases & Salts", "Carbon & its Compounds", 
            "Metals, Non-metals & Alloys", "Man-made Materials & Polymers"
        ], 
        sym: ["🧪", "⚗️", "⚛️", "💊", "🔥"] 
    },
    Biology: { 
        color: "#84cc16", bg: "#f7fee7", 
        desc: "Cell biology, human anatomy, diseases, genetics, and plant physiology.", 
        topics: [
            "Classification of Organisms", "Cell Biology", "Human Anatomy & Physiology", 
            "Nutrition & Vitamins", "Human Diseases", "Genetics & Evolution", 
            "Botany (Plant Kingdom)"
        ], 
        sym: ["🧬", "🔬", "🌿", "🩸", "🦠"] 
    },
    "Science & Technology": { 
        color: "#6366f1", bg: "#e0e7ff", 
        desc: "Space missions, defense tech, and scientific advancements.", 
        topics: [
            "Space Technology & ISRO", "Defense Technology & DRDO", "Nuclear Technology"
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
            "Indian Classical & Folk Dances", "Indian Music & Instruments", "Architecture & Sculptures", 
            "Festivals & Fairs", "Indian Paintings", "UNESCO World Heritage Sites"
        ], 
        sym: ["🎭", "🎨", "🛕", "🪘", "💃", "🏛️"] 
    },
    Sports: { 
        color: "#f97316", bg: "#fff7ed", 
        desc: "Olympics, tournaments, athletes, and sports terminology.", 
        topics: [
            "Olympic & Commonwealth Games", "Asian Games", "Sports Terminology", 
            "Trophies & Cups", "Famous Athletes & Grounds", "Sports Organizations"
        ], 
        sym: ["🏅", "⚽", "🏏", "🎾", "🏆"] 
    },
    Miscellaneous: { 
        color: "#64748b", bg: "#f8fafc", 
        desc: "First in India/World, organizations, awards, and important dates.", 
        topics: [
            "First in India & World", "Superlatives (Longest, Largest, Highest)", "International Organizations (UN, WHO)", 
            "Important Dates & Days", "Major Awards & Honors", "Famous Books & Authors", 
            "Defense & Intelligence Agencies"
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
    href: "https://aratt.ai/user/@jaglan_aman", 
    target: "_blank",
    css: {fontSize:".75rem", color:"var(--accent)", textDecoration:"none", fontWeight:"600"}
  });
  footerCredit.textContent = "Created by Aman (@jaglan_aman)";
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