var SUBJ = ["History", "Geography", "Environment & Ecology", "Economy", "Polity", "Physics", "Chemistry", "Biology", "Science & Technology", "Computer", "Art & Culture", "Sports", "Miscellaneous"];

var ICON = {
    "History": "🏛️", "Geography": "🌍", "Environment & Ecology": "🌱", "Economy": "📈",
    "Polity": "⚖️", "Physics": "⚡", "Chemistry": "🧪", "Biology": "🧬",
    "Science & Technology": "🚀", "Computer": "💻", "Art & Culture": "🎭",
    "Sports": "🏅", "Miscellaneous": "📚"
};

var AC = {
    History: "#7c3aed", Geography: "#059669", "Environment & Ecology": "#16a34a", Economy: "#0284c7",
    Polity: "#dc2626", Physics: "#0ea5e9", Chemistry: "#f59e0b", Biology: "#84cc16",
    "Science & Technology": "#6366f1", Computer: "#4f46e5", "Art & Culture": "#db2777",
    Sports: "#f97316", Miscellaneous: "#64748b"
};

var Sv = {
    get: function(k) {
        try { return JSON.parse(localStorage.getItem(k) || "null"); } catch(e) { return null; }
    },
    set: function(k,v) {
        try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {}
        // Sync to Firestore if logged in
        if(window.currentUser && window.db) {
            var uid = window.currentUser.uid;
            try {
                window.db.collection("users").doc(uid).set(
                    Object.fromEntries([[k, JSON.stringify(v)]]),
                    {merge: true}
                );
            } catch(ex) {}
        }
    },
    syncFromCloud: function(uid) {
        if(!window.db) return;
        window.db.collection("users").doc(uid).get().then(function(doc) {
            if(doc.exists) {
                var d = doc.data();
                Object.keys(d).forEach(function(k) {
                    try { localStorage.setItem(k, d[k]); } catch(e) {}
                });
                render();
                toast("Progress synced from cloud!");
            }
        }).catch(function() {});
    }
};

// --- USER SYSTEM ---
window.currentUser = Sv.get("guest_user") || null;

window.signOut = function() {
    showSignOutModal();
};

function shuf(a) {
    var b = a.slice();
    for(var i = b.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = b[i]; b[i] = b[j]; b[j] = t;
    }
    return b;
}

var tt;
function toast(m, c) {
    clearTimeout(tt);
    var d = document.createElement("div"); 
    d.className = "toast";
    d.style.background = c || "#c96442";
    d.textContent = m;
    var tc = document.getElementById("tc");
    tc.innerHTML = "";
    tc.appendChild(d);
    tt = setTimeout(function() { tc.innerHTML = ""; }, 2000);
}

function el(t, p, ch) {
    var e = document.createElement(t);
    if(p) {
        for(var k in p) {
            if(k == "cls") e.className = p[k];
            else if(k == "css") { for(var s in p[k]) e.style[s] = p[k][s]; }
            else if(k == "txt") e.textContent = p[k];
            else if(k == "htm") e.innerHTML = p[k];
            else if(k.slice(0,2) == "on") e.addEventListener(k.slice(2), p[k]);
            else e.setAttribute(k, p[k]);
        }
    }
    if(ch) {
        var a = Array.isArray(ch) ? ch : [ch]; 
        for(var i = 0; i < a.length; i++) {
            var c = a[i]; 
            if(c == null || c === false) continue; 
            if(typeof c == "string") e.appendChild(document.createTextNode(c)); 
            else e.appendChild(c);
        }
    }
    return e;
}

var pg = "home", sub = null;
window.currentPage = "home"; // expose for swipe navigation

// --- NEW: CHALLENGE URL PARSER ---
window.challengeData = null;

(function() {
    var s = window.location.search.substring(1);
    if(s) {
        var p = {};
        s.split('&').forEach(function(kv) { 
            var a = kv.split('='); 
            p[a[0]] = decodeURIComponent(a[1] || "");
        });
        
        if(p.c === '1' && p.s && p.q) {
            window.challengeData = {
                s: p.s,
                q: p.q.split('-').map(Number),
                sc: parseInt(p.sc) || 0,
                n: p.n || 'A friend'
            };
            pg = "qz"; sub = p.s; // Boot directly into the challenged quiz
            // Clean URL so it doesn't trigger again on page refresh
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
})();

function closeMobileDrawer() {
    var drawer = document.getElementById("nb-mobile-drawer");
    var hamburgerBtn = document.getElementById('nb-hamburger');
    if(drawer) {
        drawer.classList.remove('open');
    }
    if(hamburgerBtn) {
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
}

function go(p, s, skipHistory) {
    if (p !== "qz") window.activeSkillNode = null;
    pg = p;
    if (s !== undefined) sub = s;
    
    window.currentPage = p;
    closeMobileDrawer();

    if (!skipHistory) {
        history.pushState({ page: p, sub: s }, "");
    }
    
    var allNavBtns = document.querySelectorAll('#bottom-navbar button, #top-navbar .nb-links button, #nb-mobile-drawer button');
    allNavBtns.forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-page') === p);
    });

    requestAnimationFrame(function() {
        if (document.startViewTransition) {
            document.startViewTransition(function() { render(); window.scrollTo(0,0); });
        } else {
            render(); window.scrollTo(0,0);
        }
    });
}

function render() {
    var app = document.getElementById("app"); 
    app.innerHTML = "";
    
    if(pg == "home") {
        document.body.classList.remove("hide-top-sections"); 
    } else {
        document.body.classList.add("hide-top-sections");
    }

    var cac = document.getElementById("current-affairs-container");
    if(cac) cac.style.display = (pg == "digest") ? "block" : "none";

    // ── ADD THIS LINE FOR TOPIC LIST ──
    else if(pg == "topiclist") app.appendChild(pgTopicList());
    else if(pg == "alltopics") app.appendChild(pgAllTopics());

    if(pg == "home") app.appendChild(pgHome());
    else if(pg == "sub") app.appendChild(pgSub());
    else if(pg == "fcmenu") app.appendChild(pgFCMenu());
    else if(pg == "fc") app.appendChild(pgFC());
    else if(pg == "swipefc") app.appendChild(pgSwipeFC());
    else if(pg == "qz") app.appendChild(pgQZ());
    else if(pg == "bm") app.appendChild(pgBookmarks());
    else if(pg == "stats") app.appendChild(pgStats());
    else if(pg == "daily") app.appendChild(pgDaily());
    else if(pg == "digest") app.appendChild(pgDigest());
    else if(pg == "about") app.appendChild(pgAbout());
    else if(pg == "govtupdates") app.appendChild(pgGovtUpdates());
    else if(pg == "howtouse") app.appendChild(pgHowToUse());
    else if(pg == "shorts") app.appendChild(pgShorts());
    else if(pg == "skilltree") app.appendChild(pgSkillTree());
}

var QUOTES = [
    {q: "The secret of getting ahead is getting started.", a: "Mark Twain"},
    {q: "An investment in knowledge pays the best interest.", a: "Benjamin Franklin"},
    {q: "Education is the most powerful weapon which you can use to change the world.", a: "Nelson Mandela"}
];

function getDailyQuote() {
    var day = Math.floor(Date.now() / 86400000);
    return QUOTES[day % QUOTES.length];
}


// Custom StudyLab Logo
function makeLogo(sz){
sz=sz||40;
var img = document.createElement("img");
img.src = "logo.png";
img.alt = "StudyLab Logo"; // <--- ADD THIS LINE
img.style.width = sz + "px";
img.style.height = sz + "px";
img.style.borderRadius = "10px";
img.style.objectFit = "cover";
return img;
}

function showLoginModal() {
    var overlay = el("div", {
        cls: "login-modal", 
        css: {
            position: "fixed", inset: "0", background: "rgba(0,0,0,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: "10000"
        },
        onclick: function(e) { if(e.target === overlay) document.body.removeChild(overlay); }
    });

    var card = el("div", { 
        cls: "login-card",
        css: {
            background: "var(--card)", border: "1.5px solid var(--border2)",
            borderRadius: "24px", padding: "40px 36px", maxWidth: "460px",
            width: "90%", position: "relative"
        }
    });

    var lc = el("div", { css: { display: "flex", justifyContent: "center", marginBottom: "14px" } });
    lc.appendChild(makeLogo(70));
    card.appendChild(lc);

    card.appendChild(el("div", {
        css: { fontSize: "1.4rem", fontWeight: "800", marginBottom: "6px", textAlign: "center", color: "var(--text)" },
        txt: "Welcome to StudyLab"
    }));

    card.appendChild(el("div", {
        css: { fontSize: ".85rem", color: "var(--muted)", marginBottom: "24px", lineHeight: "1.6", textAlign: "center" },
        txt: "Sign in to save your progress across devices and track your improvement"
    }));

    var benefits = el("div", {
        css: { background: "var(--bg2)", borderRadius: "12px", padding: "16px", marginBottom: "24px", textAlign: "left" }
    });

    ["☁️ Progress saved to cloud", "📱 Access from any device", "📊 Personal analytics", "🔥 Streak tracking"].forEach(function(b) {
        benefits.appendChild(el("div", { css: { padding: "6px 0", fontSize: ".82rem", color: "var(--muted)" } }, b));
    });
    card.appendChild(benefits);

    var gBtn = document.createElement("button");
    gBtn.style.cssText = "width:100%; padding: 13px;border-radius: 12px; border:none; background:var(--accent); color:#fff;font-family: Poppins, inherit; font-size: .95rem;font-weight:600;cursor:pointer;display:flex;align-items:center; justify-content:center;gap: 10px; transition:all .2s;";
    gBtn.innerHTML = 'Continue as Guest';

    gBtn.addEventListener("click", function() {
        document.body.removeChild(overlay);
        showNameInputModal();
    });

    card.appendChild(gBtn);
    card.appendChild(el("div", {
        css: { fontSize: ".72rem", color: "var(--subtle)", marginTop: "14px", textAlign: "center" }
    }, "🔒 Secure login via Google. We never share your data."));

    overlay.appendChild(card);
    document.body.appendChild(overlay);
}

// Beautiful Name & Phone Input Modal
function showNameInputModal() {
    var overlay = el("div", {
        css: {
            position: "fixed", inset: "0", background: "rgba(0,0,0,0.9)",
            display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: "10000"
        }
    });

    var card = el("div", {
        css: {
            background: "var(--card)", border: "1.5px solid var(--border2)",
            borderRadius: "24px", padding: "40px 36px", maxWidth: "460px",
            width: "90%", position: "relative"
        }
    });

    // Header with icon
    var header = el("div", { css: { textAlign: "center", marginBottom: "32px" } });
    var icon = el("div", {
        css: {
            width: "80px", height: "80px", margin: "0 auto 20px",
            background: "linear-gradient(135deg, #4F8EF7, #7EB3FF)", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.5rem"
        }
    }, "🧑‍🎓");
    header.appendChild(icon);

    header.appendChild(el("h2", {
        css: { fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px"}
    }, "Welcome to StudyLab!"));
    
    header.appendChild(el("p", {
        css: { fontSize: ".9rem", color: "var(--muted)", lineHeight: "1.5" }
    }, "Let's personalize your learning experience"));
    card.appendChild(header);

    // --- 1. NAME INPUT ---
    var nameWrapper = el("div", { css: { position: "relative", marginBottom: "20px" } });
    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "";
    nameInput.style.cssText = "width: 100%; padding: 16px 18px; border-radius: 14px; border: 2px solid var(--border2); background: var(--bg2); color: var(--text); font-family: var(--font-body); font-size: .95rem; outline: none; transition: all 0.3s ease; box-sizing: border-box;";
    
    var nameLabel = el("label", {
        css: {
            position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)",
            color: "var(--muted)", fontSize: ".9rem", pointerEvents: "none",
            transition: "all 0.3s ease", background: "var(--bg2)", padding: "0 6px"
        }
    }, "Your Name");

    nameInput.addEventListener("focus", function() {
        this.style.borderColor = "var(--accent)"; 
        nameLabel.style.top = "0"; 
        nameLabel.style.fontSize = ".75rem"; 
        nameLabel.style.color = "var(--accent)"; 
        nameLabel.style.fontWeight = "600";
    });

    nameInput.addEventListener("blur", function() {
        this.style.borderColor = "var(--border2)"; 
        if (!this.value) { 
            nameLabel.style.top = "50%"; 
            nameLabel.style.fontSize = ".9rem";
            nameLabel.style.color = "var(--muted)"; 
            nameLabel.style.fontWeight = "400"; 
        }
    });

    nameInput.addEventListener("input", function() {
        if (this.value) { 
            nameLabel.style.top = "0"; 
            nameLabel.style.fontSize = ".75rem";
            nameLabel.style.color = "var(--accent)"; 
            nameLabel.style.fontWeight = "600"; 
        }
    });

    nameWrapper.appendChild(nameInput);
    nameWrapper.appendChild(nameLabel);
    card.appendChild(nameWrapper);

    // --- 2. PHONE INPUT ---
    var phoneWrapper = el("div", { css: { position: "relative", marginBottom: "28px" } });
    var phoneInput = document.createElement("input");
    phoneInput.type = "tel"; 
    phoneInput.placeholder = "";
    phoneInput.style.cssText = "width: 100%; padding: 16px 18px; border-radius: 14px; border: 2px solid var(--border2); background: var(--bg2); color: var(--text); font-family: var(--font-body); font-size: .95rem; outline: none; transition: all 0.3s ease; box-sizing: border-box;";
    
    var phoneLabel = el("label", {
        css: {
            position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)",
            color: "var(--muted)", fontSize: ".9rem", pointerEvents: "none",
            transition: "all 0.3s ease", background: "var(--bg2)", padding: "0 6px"
        }
    }, "Phone Number");

    phoneInput.addEventListener("focus", function() {
        this.style.borderColor = "var(--accent)"; 
        phoneLabel.style.top = "0"; 
        phoneLabel.style.fontSize = ".75rem"; 
        phoneLabel.style.color = "var(--accent)"; 
        phoneLabel.style.fontWeight = "600";
    });

    phoneInput.addEventListener("blur", function() {
        this.style.borderColor = "var(--border2)"; 
        if (!this.value) { 
            phoneLabel.style.top = "50%"; 
            phoneLabel.style.fontSize = ".9rem";
            phoneLabel.style.color = "var(--muted)"; 
            phoneLabel.style.fontWeight = "400"; 
        }
    });

    phoneInput.addEventListener("input", function() {
        if (this.value) { 
            phoneLabel.style.top = "0"; 
            phoneLabel.style.fontSize = ".75rem";
            phoneLabel.style.color = "var(--accent)"; 
            phoneLabel.style.fontWeight = "600"; 
        }
    });

    phoneWrapper.appendChild(phoneInput);
    phoneWrapper.appendChild(phoneLabel);
    card.appendChild(phoneWrapper);

    // Helper text
    card.appendChild(el("p", {
        css: { fontSize: ".78rem", color: "var(--subtle)", marginBottom: "24px", textAlign: "center" }
    }, "We'll use this to personalize your experience"));

    // Buttons
    var btnContainer = el("div", { css: { display: "flex", gap: "12px" } });
    var skipBtn = el("button", {
        css: {
            flex: "1", padding: "14px", borderRadius: "12px", border: "1.5px solid var(--border2)",
            background: "transparent", color: "var(--muted)", fontFamily: "var(--font-body)",
            fontSize: ".88rem", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease"
        },
        onclick: function() {
            finishGuestLogin("Guest User", "");
            document.body.removeChild(overlay);
        }
    }, "Skip");

    skipBtn.addEventListener("mouseenter", function() { 
        this.style.borderColor = "var(--accent)"; 
        this.style.color = "var(--text)"; 
    });
    skipBtn.addEventListener("mouseleave", function() { 
        this.style.borderColor = "var(--border2)"; 
        this.style.color = "var(--muted)"; 
    });

    var continueBtn = el("button", {
        css: {
            flex: "2", padding: "14px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #4F8EF7, #7EB3FF)", color: "#fff",
            fontFamily: "var(--font-body)", fontSize: ".92rem", fontWeight: "700",
            cursor: "pointer", transition: "all 0.2s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
        },
        onclick: function() {
            var name = nameInput.value.trim() || "Guest User";
            var phone = phoneInput.value.trim() || "";
            if(nameInput.value.trim() === "" || phoneInput.value.trim() === "") {
                alert("Please enter both Name and Phone number to continue.");
                return;
            }
            finishGuestLogin(name, phone);
            document.body.removeChild(overlay);
        }
    }, "Continue");

    continueBtn.addEventListener("mouseenter", function() { 
        this.style.transform = "translateY(-2px)"; 
    });
    continueBtn.addEventListener("mouseleave", function() { 
        this.style.transform = "translateY(0)"; 
    });

    btnContainer.appendChild(skipBtn);
    btnContainer.appendChild(continueBtn);
    card.appendChild(btnContainer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    setTimeout(function() { nameInput.focus(); }, 400);
}

// Updated Login Finisher to handle Phone Number
function finishGuestLogin(name, phone) {
    window.currentUser = {
        displayName: name,
        phoneNumber: phone,
        email: "guest@studylab.local",
        photoURL: null,
        isGuest: true
    };
    
    Sv.set("guest_user", window.currentUser);
    localStorage.setItem('sl_user', JSON.stringify({ name: name, phone: phone }));
    toast("Welcome, " + name + "!", "#4ade80");

    try {
        if (window.OneSignalDeferred) {
            window.OneSignalDeferred.push(async function (OneSignal) {
                var permission = await OneSignal.Notifications.permission;
                if (!permission) await OneSignal.Notifications.requestPermission();
                await OneSignal.User.addTag("name", name);
                await OneSignal.User.addTag("type", "guest");
            });
        }
    } catch(e) {}

    // Trigger the install prompt now that they are logged in!
    if (typeof triggerSmartInstallPrompt === "function") {
        setTimeout(triggerSmartInstallPrompt, 1000);
    }
    render();
}

// Beautiful Sign Out Confirmation Modal
function showSignOutModal() {
    var userName = window.currentUser ? window.currentUser.displayName : "User";
    var overlay = el("div", {
        css: {
            position: "fixed", inset: "0", background: "rgba(0,0,0,0.9)",
            display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: "10000"
        }
    });

    overlay.addEventListener("click", function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });

    var card = el("div", {
        css: {
            background: "var(--card)", border: "1.5px solid var(--border2)",
            borderRadius: "24px", padding: "40px 36px", maxWidth: "440px",
            width: "90%", position: "relative"
        }
    });

    card.addEventListener("click", function(e) { e.stopPropagation(); });

    var header = el("div", { css: { textAlign: "center", marginBottom: "28px" } });
    var icon = el("div", {
        css: {
            width: "80px", height: "80px", margin: "0 auto 20px",
            background: "linear-gradient(135deg, #f59e0b, #ef4444)", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.5rem"
        }
    }, "👋");

    header.appendChild(icon);
    header.appendChild(el("h2", {
        css: { fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }
    }, "Sign Out?"));
    
    header.appendChild(el("p", {
        css: { fontSize: ".9rem", color: "var(--muted)", lineHeight: "1.5" }
    }, "See you soon, " + userName + "!"));
    card.appendChild(header);

    var infoBox = el("div", {
        css: {
            background: "var(--bg2)", border: "1px solid var(--border)",
            borderRadius: "14px", padding: "18px", marginBottom: "28px"
        }
    });

    var infoItems = ["Your progress will be saved", "Bookmarks remain intact", "Sign back in anytime"];
    infoItems.forEach(function(item) {
        infoBox.appendChild(el("div", {
            css: { padding: "6px 0", fontSize: ".82rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "8px" }
        }, item));
    });
    card.appendChild(infoBox);

    var btnContainer = el("div", { css: { display: "flex", gap: "12px", flexDirection: "column" } });
    var signOutBtn = el("button", {
        css: {
            width: "100%", padding: "14px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff",
            fontFamily: "var(--font-body)", fontSize: ".92rem", fontWeight: "700",
            cursor: "pointer", transition: "all 0.2s ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
        },
        onclick: function() {
            Sv.set("guest_user", null);
            window.currentUser = null;
            document.body.removeChild(overlay);
            toast("Signed out successfully", "#f59e0b");
            render();
        }
    }, "Yes, Sign Out");

    signOutBtn.addEventListener("mouseenter", function() {
        this.style.transform = "translateY(-2px)";
    });
    signOutBtn.addEventListener("mouseleave", function() {
        this.style.transform = "translateY(0)";
    });

    var cancelBtn = el("button", {
        css: {
            width: "100%", padding: "14px", borderRadius: "12px", border: "1.5px solid var(--border2)",
            background: "transparent", color: "var(--text)", fontFamily: "var(--font-body)",
            fontSize: ".88rem", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease"
        },
        onclick: function() {
            document.body.removeChild(overlay);
        }
    }, "Cancel");

    cancelBtn.addEventListener("mouseenter", function() {
        this.style.borderColor = "var(--accent)";
        this.style.background = "var(--bg2)";
    });
    cancelBtn.addEventListener("mouseleave", function() {
        this.style.borderColor = "var(--border2)";
        this.style.background = "transparent";
    });

    btnContainer.appendChild(signOutBtn);
    btnContainer.appendChild(cancelBtn);
    card.appendChild(btnContainer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    var escHandler = function(e) {
        if (e.key === "Escape") {
            document.body.removeChild(overlay);
            document.removeEventListener("keydown", escHandler);
        }
    };
    document.addEventListener("keydown", escHandler);
}

function makeNav(active) {
    var btns = document.querySelectorAll('#nb-links button');
    btns.forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-page') === active); });

    var mbtns = document.querySelectorAll('#nb-mobile-drawer button');
    mbtns.forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-page') === active); });

    var bbtns = document.querySelectorAll('#bottom-navbar button');
    bbtns.forEach(function(b) { b.classList.toggle('active', b.getAttribute('data-page') === active); });

    var ua = document.getElementById('nb-user-area');
    if(ua) {
        ua.innerHTML = "";
        var user = window.currentUser;
        if(user) {
            var pill = el("div", { cls: "nb-user-pill", onclick: function() { window.signOut(); } });
            if(user.photoURL) {
                var img = document.createElement("img");
                img.src = user.photoURL;
                img.className = "user-avatar";
                img.alt = "avatar"; 
                pill.appendChild(img);
            } else {
                var av = el("div", {
                    css: {
                        width: "30px", height: "30px", borderRadius: "50%", background: "var(--accent)",
                        display: "flex", alignItems: "center", justifyContent: "center", 
                        fontWeight: "700", fontSize: ".8rem", color: "#fff"
                    }
                }, user.displayName ? user.displayName[0] : "U"); 
                pill.appendChild(av);
            }
            pill.appendChild(el("div", {
                css: { fontSize: ".78rem", fontWeight: "600" }, 
                txt: user.displayName ? user.displayName.split(" ")[0] : "User"
            }));
            ua.appendChild(pill);
        } else {
            var lb = el("button", {
                cls: "btn btnp", 
                css: { padding: "6px 16px", fontSize: ".78rem" }, 
                onclick: function() { showLoginModal(); }
            });
            lb.innerHTML = "Sign In"; 
            ua.appendChild(lb);
        }
    }
    return el("div", { css: { display: "none" } });
}

// DEADLINE COUNTDOWN WIDGET
function makeDeadlineWidget() {
    var stored = Sv.get("gu_entries") || [];
    var allData = stored.concat(GU_FALLBACK); // Assumes GU_FALLBACK is defined elsewhere
    var now = new Date();
    now.setHours(0,0,0,0);
    var closestEntry = null;
    var closestDiff = Infinity;
    var isExam = false;

    allData.forEach(function(e) {
        var dateStr = e.lastDate || e.examDate;
        if(!dateStr) return;
        var cleanDateStr = dateStr.replace(/(\d{2})[\-\.](\d{2})[\-\.](\d{4})/, '$3-$2-$1');
        var parsed = new Date(cleanDateStr);
        if (!isNaN(parsed) && parsed >= now) {
            var diff = parsed - now;
            if (diff < closestDiff) {
                closestDiff = diff;
                closestEntry = e;
                isExam = !!e.examDate;
            }
        }
    });

    if (!closestEntry || closestDiff === Infinity) return el("div", { css: { display: "none" } });

    var daysLeft = Math.ceil(closestDiff / (1000 * 60 * 60 * 24));
    if (daysLeft > 30) return el("div", { css: { display: "none" } });

    var isUrgent = daysLeft <= 3;
    var wCol = isUrgent ? "#ef4444" : "#f59e0b"; 
    var wBg = isUrgent ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)";

    var widget = el("div", {
        css: {
            background: "var(--card)", border: "1.5px solid " + wCol, borderRadius: "16px",
            padding: "16px 20px", marginBottom: "28px", display: "flex", alignItems: "center",
            justifyContent: "space-between", cursor: "pointer", transition: "transform 0.2s"
        },
        onclick: function() { go("govtupdates"); }
    });

    widget.addEventListener("mouseenter", function() { this.style.transform = "translateY(-3px)"; });
    widget.addEventListener("mouseleave", function() { this.style.transform = "translateY(0)"; });

    var left = el("div", { css: { display: "flex", alignItems: "center", gap: "14px", flex: "1", minWidth: "0" } });
    left.appendChild(el("div", {
        css: { fontSize: "2rem", flexShrink: "0" },
        txt: isExam ? "📝" : "📅"
    }));

    var textWrap = el("div", { css: { minWidth: "0" } });
    var typeText = isExam ? "Upcoming Exam" : "Application Deadline";
    textWrap.appendChild(el("div", {
        css: { fontSize: ".7rem", textTransform: "uppercase", letterSpacing: ".1em", color: wCol, fontWeight: "700", marginBottom: "2px" }
    }, typeText));
    
    textWrap.appendChild(el("div", {
        css: {
            fontSize: ".95rem", fontWeight: "700", color: "var(--text)", display: "-webkit-box", 
            WebkitLineClamp: "1", WebkitBoxOrient: "vertical", overflow: "hidden", paddingRight: "10px"
        }
    }, closestEntry.org + " - " + closestEntry.title));

    left.appendChild(textWrap);
    widget.appendChild(left);

    var right = el("div", {
        css: {
            background: wCol, color: "#fff", padding: "6px 14px", borderRadius: "10px",
            fontWeight: "800", fontSize: ".9rem", whiteSpace: "nowrap", flexShrink: "0"
        }
    }, daysLeft === 0 ? "Today!" : daysLeft + " Days");

    widget.appendChild(right);
    return widget;
}

// PWA INSTALLATION & SERVICE WORKER
let deferredPrompt;
let installButton;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        var currentOrigin = window.location.origin;
        var isLocalOrHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (isLocalOrHTTPS && !currentOrigin.includes('claudusercontent')) {
            navigator.serviceWorker.register('./sw.js')
            .then(function(registration) { console.log('ServiceWorker registered:', registration.scope); })
            .catch(function(err) {
                console.log('External SW failed, trying inline...', err.message);
                registerInlineSW();
            });
        } else {
            console.log('ServiceWorker skipped - not on proper domain.');
        }
    });
}

function registerInlineSW() {
    try {
        var swCode = `
            const CACHE_NAME = 'studylab-v2';
            self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(['/']))); });
            self.skipWaiting();
            self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
            self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); });
        `;
        var blob = new Blob([swCode], { type: 'application/javascript' });
        var swUrl = URL.createObjectURL(blob);
        navigator.serviceWorker.register(swUrl)
        .then(function(reg) { console.log('Inline ServiceWorker registered'); })
        .catch(function(err) { console.log('ServiceWorker not available:', err.message); });
    } catch(e) {
        console.log('Inline SW creation failed:', e.message);
    }
}

window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
});

function triggerSmartInstallPrompt() {
    if (deferredPrompt && !sessionStorage.getItem('installPromptShown')) {
        setTimeout(function() {
            showInstallModal();
            sessionStorage.setItem('installPromptShown', 'true');
        }, 1500);
    }
}

function showInstallButton() {
    if (installButton) return;
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    installButton = el("button", {
        cls: "btn btnp",
        css: {
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            fontSize: isMobile ? ".75rem" : ".82rem", padding: isMobile ? "6px 12px" : "8px 16px",
            background: "linear-gradient(135deg, #4F8EF7, #7EB3FF)", border: "none",
            whiteSpace: "nowrap", minWidth: "fit-content"
        },
        onclick: function(e) {
            e.preventDefault();
            e.stopPropagation();
            showInstallModal();
        }
    }, isMobile ? "Install" : "Install App");

    var userArea = document.getElementById('nb-user-area');
    if (userArea) {
        userArea.insertBefore(installButton, userArea.firstChild);
    }

    var style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) { #nb-user-area { gap: 6px !important; } }
    `;
    document.head.appendChild(style);
}

function showInstallModal() {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    var overlay = el("div", {
        css: {
            position: "fixed", inset: "0", background: "rgba(0,0,0,0.9)",
            display: "flex", alignItems: isMobile ? "flex-end" : "center",
            justifyContent: "center", zIndex: "100",
            padding: isMobile ? "0" : "20px"
        }
    });

    overlay.addEventListener("click", function(e) { if (e.target === overlay) document.body.removeChild(overlay); });

    var card = el("div", {
        css: {
            background: "var(--card)", border: "1.5px solid var(--border2)",
            borderRadius: isMobile ? "24px 24px 0 0" : "24px", padding: isMobile ? "32px 24px 40px" : "40px 36px",
            maxWidth: "460px", width: isMobile ? "100%" : "90%",
            position: "relative", maxHeight: isMobile ? "90vh" : "auto", overflowY: "auto"
        }
    });

    card.addEventListener("click", function(e) { e.stopPropagation(); });

    if (isMobile) {
        var startY = 0, currentY = 0;
        card.addEventListener("touchstart", function(e) { startY = e.touches[0].clientY; });
        card.addEventListener("touchmove", function(e) {
            currentY = e.touches[0].clientY;
            var diff = currentY - startY;
            if (diff > 0 && card.scrollTop === 0) {
                e.preventDefault();
                card.style.transform = "translateY(" + diff + "px)";
            }
        });
        card.addEventListener("touchend", function(e) {
            var diff = currentY - startY;
            if (diff > 100) document.body.removeChild(overlay);
            else card.style.transform = "translateY(0)";
        });

        var dragIndicator = el("div", {
            css: { width: "40px", height: "4px", background: "var(--border2)", borderRadius: "2px", margin: "0 auto 24px", opacity: "0.5" }
        });
        card.appendChild(dragIndicator);
    }

    var header = el("div", { css: { textAlign: "center", marginBottom: "28px" } });
    var iconSize = isMobile ? "70px" : "80px";
    var icon = el("div", {
        css: {
            width: iconSize, height: iconSize, margin: "0 auto 20px", background: "linear-gradient(135deg, #4F8EF7, #7EB3FF)",
            borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: isMobile ? "2rem" : "2.5rem"
        }
    }, "📲");
    
    header.appendChild(icon);
    header.appendChild(el("h2", {
        css: { fontFamily: "var(--font-display)", fontSize: isMobile ? "1.4rem" : "1.6rem", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }
    }, "Install StudyLab"));
    
    header.appendChild(el("p", {
        css: { fontSize: isMobile ? ".85rem" : ".9rem", color: "var(--muted)", lineHeight: "1.5" }
    }, "Get the best learning experience"));
    card.appendChild(header);

    var benefits = el("div", {
        css: { background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "14px", padding: isMobile ? "16px" : "18px", marginBottom: "24px" }
    });

    var benefitsList = ["Instant access from home screen", "Works offline after install", "Faster loading times", "Get study reminders", "No storage concerns"];
    benefitsList.forEach(function(item) {
        benefits.appendChild(el("div", {
            css: { padding: "6px 0", fontSize: isMobile ? ".78rem" : ".82rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: "8px" }
        }, item));
    });
    card.appendChild(benefits);

    if (isIOS) {
        var iosInstructions = el("div", {
            css: {
                background: "linear-gradient(135deg, rgba(79,142,247,0.1), rgba(126,179,255,0.1))",
                border: "1.5px solid var(--accent)", borderRadius: "14px", padding: isMobile ? "16px" : "18px", marginBottom: "24px"
            }
        });
        
        iosInstructions.appendChild(el("div", {
            css: { fontSize: isMobile ? ".82rem" : ".88rem", fontWeight: "700", color: "var(--accent)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }
        }, "iOS Installation Steps:"));

        var steps = ["1. Tap the Share button", "2. Scroll and tap 'Add to Home Screen'", "3. Tap 'Add' to confirm", "4. Open StudyLab from your home screen!"];
        steps.forEach(function(step) {
            iosInstructions.appendChild(el("div", {
                css: { padding: "4px 0", fontSize: isMobile ? ".78rem" : ".82rem", color: "var(--text)" }
            }, step));
        });
        card.appendChild(iosInstructions);
    }

    var btnContainer = el("div", { css: { display: "flex", gap: "12px", flexDirection: isMobile ? "column-reverse" : "row" } });
    var cancelBtn = el("button", {
        css: {
            flex: "1", padding: isMobile ? "16px" : "14px", borderRadius: "12px", border: "1.5px solid var(--border2)",
            background: "transparent", color: "var(--text)", fontFamily: "var(--font-body)",
            fontSize: isMobile ? ".9rem" : ".88rem", fontWeight: "600", cursor: "pointer",
            transition: "all 0.2s ease", WebkitTapHighlightColor: "transparent"
        },
        onclick: function() { document.body.removeChild(overlay); }
    }, "Maybe Later");

    cancelBtn.addEventListener("mouseenter", function() { this.style.borderColor = "var(--accent)"; this.style.background = "var(--bg2)"; });
    cancelBtn.addEventListener("mouseleave", function() { this.style.borderColor = "var(--border2)"; this.style.background = "transparent"; });

    if (!isIOS && deferredPrompt) {
        var installBtn = el("button", {
            css: {
                flex: "2", padding: isMobile ? "16px" : "14px", borderRadius: "12px", border: "none",
                background: "linear-gradient(135deg, #4F8EF7, #7EB3FF)", color: "#fff",
                fontFamily: "var(--font-body)", fontSize: isMobile ? ".95rem" : ".92rem", fontWeight: "700",
                cursor: "pointer", transition: "all 0.2s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                WebkitTapHighlightColor: "transparent"
            },
            onclick: function() {
                installAppNow();
                document.body.removeChild(overlay);
            }
        }, "Install Now");

        installBtn.addEventListener("touchstart", function() { this.style.transform = "scale(0.98)"; });
        installBtn.addEventListener("touchend", function() { this.style.transform = "scale(1)"; });
        btnContainer.appendChild(installBtn);
    }
    
    btnContainer.appendChild(cancelBtn);
    card.appendChild(btnContainer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    if (!isMobile) {
        var escHandler = function(e) {
            if (e.key === "Escape") {
                document.body.removeChild(overlay);
                document.removeEventListener("keydown", escHandler);
            }
        };
        document.addEventListener("keydown", escHandler);
    }

    setTimeout(function() {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
    }, 4000);
}

async function installAppNow() {
    if (!deferredPrompt) {
        toast("Installation not available", "#f59e0b");
        return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
        toast("App installed successfully!", "#4ade80");
        console.log('User accepted the install prompt');
    } else {
        toast("Installation cancelled", "#8896B3");
        console.log('User dismissed the install prompt');
    }
    deferredPrompt = null;
    if (installButton) installButton.style.display = 'none';
}

function installApp() { showInstallModal(); }

window.addEventListener('appinstalled', function() {
    console.log('StudyLab has been installed');
    toast("StudyLab installed! Open from your home screen", "#4ade80");
    if (installButton) installButton.style.display = 'none';
    deferredPrompt = null;
});

if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    console.log('Running as installed PWA');
    if (installButton) installButton.style.display = 'none';
}

function isIOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; }
function isInStandaloneMode() { return ('standalone' in window.navigator) && (window.navigator.standalone); }

if (isIOS() && !isInStandaloneMode()) {
    setTimeout(function() { showInstallButton(); }, 2000);
}

// HARDWARE BACK BUTTON & EXIT CONFIRMATION ROUTING
window.addEventListener('popstate', function(e) {
    if (window.allowNativeExit) return;
    if (e.state && e.state.page === 'exit_trap') {
        showExitConfirmationModal();
        history.pushState({ page: 'home', sub: null }, "");
    } else if (e.state && e.state.page) {
        go(e.state.page, e.state.sub, true);
    }
});

function showExitConfirmationModal() {
    var overlay = el("div", {
        css: {
            position: "fixed", inset: "0", background: "rgba(0,0,0,0.9)",
            display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: "10000"
        }
    });

    var card = el("div", {
        css: {
            background: "var(--card)", border: "1.5px solid var(--border2)",
            borderRadius: "24px", padding: "32px 28px", maxWidth: "340px", width: "85%",
            textAlign: "center", position: "relative"
        }
    });

    var icon = el("div", {
        css: { fontSize: "3.2rem", marginBottom: "16px", textShadow: "0 8px 16px rgba(0,0,0,0.3)" }
    }, "🚪");
    
    var title = el("h3", {
        css: { fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--text)", marginBottom: "8px" }
    }, "Exit StudyLab?");
    
    var subtext = el("p", {
        css: { fontSize: "0.9rem", color: "var(--muted)", marginBottom: "24px" }
    }, "Are you sure you want to close the application?");
    
    var btnRow = el("div", { css: { display: "flex", gap: "10px" } });
    var stayBtn = el("button", {
        css: {
            flex: "1", padding: "13px", borderRadius: "12px", border: "1.5px solid var(--border2)",
            background: "var(--bg2)", color: "var(--text)", fontWeight: "600", cursor: "pointer", fontFamily: "var(--font-body)"
        },
        onclick: function() { document.body.removeChild(overlay); }
    }, "Stay");

        var exitBtn = el("button", {
        css: {
            flex: "1", padding: "13px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "#fff",
            fontWeight: "700", cursor: "pointer", fontFamily: "var(--font-body)"
        },
        onclick: function() {
            window.allowNativeExit = true;
            document.body.removeChild(overlay);

            var bye = document.createElement('div');
            // FIX: Changed alignItems to align-items and added text-align: center
            bye.style.cssText = 'position:fixed; inset:0; background:var(--bg); z-index:999999; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; width:100%;';

            // FIX: Added text-align: center to the inner text divs as well just to be safe
            bye.innerHTML = `<div style="font-size:3rem;margin-bottom:16px;">👋</div><div style="font-family:var(--font-display);font-size:1.2rem;font-weight:700;color:var(--text);text-align:center;">Good bye!</div><div style="font-size:.85rem;color:var(--muted);margin-top:8px;text-align:center;">See you next time</div>`;
            document.body.appendChild(bye);

            try { window.close(); } catch(e) {}
            
            setTimeout(function() {
                history.replaceState({ page: 'exit_trap' }, "");
                history.back();
                setTimeout(function() {
                    bye.innerHTML = `<div style="font-size:2.5rem;margin-bottom:16px;display:flex;justify-content:center;">🌐</div><div style="font-family:var(--font-display);font-size:1.1rem;font-weight:700;color:var(--text);text-align:center;padding:0 24px;">Close this tab manually<br>to exit StudyLab</div><button onclick="window.location.reload()" style="margin-top:20px;padding:10px 24px;border-radius:10px;border:1.5px solid var(--border2);background:var(--bg2);color:var(--text);font-size:.9rem;font-weight:600;cursor:pointer;">Go Back Instead</button>`;
                }, 800);
            }, 100);
        }
    }, "Yes, Exit");


    btnRow.appendChild(stayBtn);
    btnRow.appendChild(exitBtn);
    
    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(subtext);
    card.appendChild(btnRow);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
}

function checkInitialSetup() {
    // Check if user has ever been here
    var hasVisited = localStorage.getItem('has_visited');
    
    if (!hasVisited) {
        // First time users: Start the flow
        window.startOnboardingFlow();
        localStorage.setItem('has_visited', 'true');
    } else {
        // Returning users: Check if they need to install
        if (typeof triggerSmartInstallPrompt === 'function') {
            triggerSmartInstallPrompt();
        }
    }
}

// ── SMART ONBOARDING FLOW ──
window.startOnboardingFlow = function() {
    // 1. Welcome Modal
    showWelcomeModal();
};

function showWelcomeModal() {
    var overlay = el("div", { css: { position: "fixed", inset: "0", background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: "100000" } });
    var card = el("div", { css: { background: "var(--card)", padding: "40px", borderRadius: "24px", maxWidth: "400px", width: "90%", textAlign: "center", border: "1px solid var(--border)" } });
    
    card.appendChild(el("div", { css: { fontSize: "3rem", marginBottom: "20px" } }, "👋"));
    card.appendChild(el("h2", { css: { color: "var(--text)", marginBottom: "16px", fontFamily: "var(--font-display)" } }, "Welcome to StudyLab!"));
    card.appendChild(el("p", { css: { color: "var(--muted)", marginBottom: "32px", lineHeight: "1.6" } }, "Your ultimate exam companion. Master topics, track progress, and ace your exams effortlessly."));
    
    var btn = el("button", { 
        css: { width: "100%", padding: "14px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" },
        txt: "Get Started" 
    });
    btn.onclick = function() {
        document.body.removeChild(overlay);
        // Prompt Sign-In
        setTimeout(showLoginModal, 500);
    };
    
    card.appendChild(btn);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
}

// UPDATE THIS FUNCTION IN YOUR APP.JS
function checkInitialSetup() {
    var hasVisited = localStorage.getItem('has_visited');
    
    if (!hasVisited) {
        window.startOnboardingFlow();
        localStorage.setItem('has_visited', 'true');
    } else {
        if (window.currentUser || localStorage.getItem('sl_user')) {
            if (typeof triggerSmartInstallPrompt === 'function') triggerSmartInstallPrompt();
        }
    }
}