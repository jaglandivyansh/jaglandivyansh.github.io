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
    if (typeof trackEngagementForInstall === "function") trackEngagementForInstall(p);

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

    if(pg == "home") app.appendChild(pgHome());
    else if(pg == "topiclist") app.appendChild(pgTopicList());
    else if(pg == "alltopics") app.appendChild(pgAllTopics());
    else if(pg == "sub") app.appendChild(pgSub());
    else if(pg == "read") app.appendChild(pgRead());
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
    updateInstallDrawerItem();
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
    updateInstallDrawerItem();
});

function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function updateInstallDrawerItem() {
    var item = document.getElementById('drawer-install-item');
    if (!item) return;
    if (isAppInstalled()) {
        item.style.display = 'none';
        return;
    }
    // Show on Android/desktop once Chrome has confirmed installability,
    // and always on iOS (native prompt doesn't exist there, so we show
    // manual "Add to Home Screen" instructions instead).
    item.style.display = (deferredPrompt || isIOS()) ? 'flex' : 'none';
}

if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    console.log('Running as installed PWA');
    if (installButton) installButton.style.display = 'none';
}

function isIOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream; }
function isInStandaloneMode() { return ('standalone' in window.navigator) && (window.navigator.standalone); }

if (isIOS() && !isInStandaloneMode()) {
    setTimeout(function() { showInstallButton(); }, 2000);
}

document.addEventListener('DOMContentLoaded', updateInstallDrawerItem);
if (document.readyState !== 'loading') updateInstallDrawerItem();

// HAPTIC TAP FEEDBACK — replaces the blue tap-highlight with a short vibration
// (works on Android; iOS Safari does not expose the Vibration API, so taps
// there simply stay silent with no visual flash, which is the desired effect)
document.addEventListener('click', function(e) {
    if (!('vibrate' in navigator)) return;
    var target = e.target.closest('button, a, .nav-item, [onclick]');
    if (target) navigator.vibrate(10);
}, true);

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

// ── NON-BLOCKING ONBOARDING ──
// No forced modals on first launch. The app renders immediately; sign-in
// and install nudges show up as small, dismissible banners, and only at
// the right moment (not stacked one after another).

function checkInitialSetup() {
    localStorage.setItem('has_visited', 'true');

    // Gentle, dismissible sign-in nudge — never blocks the app.
    if (!window.currentUser && !localStorage.getItem('sl_user') && !sessionStorage.getItem('sl_signin_banner_dismissed')) {
        setTimeout(showSignInBanner, 1200);
    }
    // Install banner is triggered separately once the user shows real
    // engagement (see trackEngagementForInstall(), hooked into go()).
}

// ── SHARED: GLASS BANNER STYLES + SWIPE-TO-DISMISS ──
function injectSLBannerStyles() {
    if (document.getElementById('sl-banner-styles')) return;
    var style = document.createElement('style');
    style.id = 'sl-banner-styles';
    style.textContent =
        '@keyframes slSpringDown{0%{transform:translate(-50%,-40px) scale(.92);opacity:0}55%{transform:translate(-50%,8px) scale(1.02);opacity:1}100%{transform:translate(-50%,0) scale(1)}}' +
        '@keyframes slSpringUp{0%{transform:translate(-50%,40px) scale(.92);opacity:0}55%{transform:translate(-50%,-8px) scale(1.02);opacity:1}100%{transform:translate(-50%,0) scale(1)}}' +
        '@keyframes slPulseGlow{0%,100%{box-shadow:0 0 0 0 var(--accent-glow)}50%{box-shadow:0 0 16px 3px var(--accent-glow)}}' +
        '@keyframes slShrinkBar{from{transform:scaleX(1)}to{transform:scaleX(0)}}' +
        '.sl-glass{background:rgba(17,24,39,0.78);backdrop-filter:blur(22px) saturate(180%);-webkit-backdrop-filter:blur(22px) saturate(180%)}' +
        '.sl-cta-glow{animation:slPulseGlow 2.4s ease-in-out infinite}' +
        '.sl-drag-handle{width:36px;height:4px;border-radius:2px;background:var(--border2);margin:0 auto 10px;opacity:.6}' +
        '@media (min-width:769px){.sl-drag-handle{display:none}}';
    document.head.appendChild(style);
}

function attachSwipeDismiss(banner, direction, onDismiss) {
    var startY = 0, currentY = 0, dragging = false, threshold = 46;
    banner.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY; dragging = true;
        banner.style.animation = 'none';
        banner.style.transition = 'none';
    }, { passive: true });
    banner.addEventListener('touchmove', function(e) {
        if (!dragging) return;
        currentY = e.touches[0].clientY;
        var diff = currentY - startY;
        if ((direction === 'up' && diff < 0) || (direction === 'down' && diff > 0)) {
            banner.style.transform = 'translate(-50%,' + diff + 'px)';
        }
    }, { passive: true });
    banner.addEventListener('touchend', function() {
        dragging = false;
        banner.style.transition = 'transform .32s cubic-bezier(.34,1.56,.64,1)';
        var diff = currentY - startY;
        if ((direction === 'up' && diff < -threshold) || (direction === 'down' && diff > threshold)) {
            onDismiss();
        } else {
            banner.style.transform = 'translate(-50%,0)';
        }
        startY = 0; currentY = 0;
    });
}

// ── FLOATING GLASS BANNER: SIGN IN ──
function showSignInBanner() {
    if (window.currentUser || localStorage.getItem('sl_user')) return;
    if (document.getElementById('sl-signin-banner')) return;
    injectSLBannerStyles();

    var banner = el("div", {
        id: "sl-signin-banner",
        cls: "sl-glass",
        css: {
            position: "fixed", top: "calc(var(--topnav-h, 60px) + 10px)", left: "50%",
            zIndex: "10000", width: "min(92%, 420px)",
            border: "1px solid var(--border2)", borderRadius: "18px", padding: "14px 16px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
            animation: "slSpringDown .5s cubic-bezier(.34,1.56,.64,1) forwards"
        }
    });

    banner.appendChild(el("div", { cls: "sl-drag-handle" }));

    var row = el("div", { css: { display: "flex", alignItems: "center", gap: "12px" } });

    var iconWrap = el("div", {
        css: {
            width: "40px", height: "40px", borderRadius: "50%", flexShrink: "0",
            background: "var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center"
        },
        htm: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h.79a4.5 4.5 0 1 1 0 9z"/></svg>'
    });
    row.appendChild(iconWrap);

    var textCol = el("div", { css: { flex: "1", minWidth: "0" } });
    textCol.appendChild(el("div", { css: { fontSize: ".88rem", fontWeight: "700", color: "var(--text)" } }, "Save your progress"));
    textCol.appendChild(el("div", { css: { fontSize: ".76rem", color: "var(--muted)", marginTop: "1px" } }, "Sync across devices, free forever"));
    row.appendChild(textCol);

    var dismissBtn = el("button", {
        css: {
            width: "26px", height: "26px", borderRadius: "50%", border: "none",
            background: "rgba(255,255,255,0.06)", color: "var(--muted)", fontSize: ".8rem",
            cursor: "pointer", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center"
        },
        onclick: function() { dismissSignInBanner(); }
    }, "✕");
    row.appendChild(dismissBtn);

    banner.appendChild(row);

    var signInBtn = el("button", {
        cls: "sl-cta-glow",
        css: {
            width: "100%", marginTop: "12px", padding: "10px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, var(--accent), var(--accent2))", color: "#fff",
            fontSize: ".85rem", fontWeight: "700", cursor: "pointer"
        },
        onclick: function() {
            dismissSignInBanner();
            showLoginModal();
        }
    }, "Sign in");
    banner.appendChild(signInBtn);

    document.body.appendChild(banner);
    attachSwipeDismiss(banner, 'up', dismissSignInBanner);
}

function dismissSignInBanner() {
    var banner = document.getElementById('sl-signin-banner');
    sessionStorage.setItem('sl_signin_banner_dismissed', 'true');
    if (banner) {
        banner.style.animation = "none";
        banner.style.transition = "transform .3s ease, opacity .3s ease";
        banner.style.transform = "translate(-50%,-40px)";
        banner.style.opacity = "0";
        setTimeout(function() { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 300);
    }
}

// ── ENGAGEMENT-BASED INSTALL BANNER ──
// Only nudge to install once the user has actually done something in the
// app (not the instant they open it), and as a small floating banner —
// never a full-screen modal at launch.
var ENGAGEMENT_THRESHOLD = 2; // pages visited beyond home

function trackEngagementForInstall(page) {
    if (page === "home") return;
    if (sessionStorage.getItem('installPromptShown')) return;
    if (!deferredPrompt) return;

    var count = parseInt(sessionStorage.getItem('sl_engagement_count') || '0', 10) + 1;
    sessionStorage.setItem('sl_engagement_count', String(count));

    if (count >= ENGAGEMENT_THRESHOLD) {
        sessionStorage.setItem('installPromptShown', 'true');
        setTimeout(showInstallBanner, 800);
    }
}

function showInstallBanner() {
    if (!deferredPrompt) return;
    if (document.getElementById('sl-install-banner')) return;
    injectSLBannerStyles();

    var banner = el("div", {
        id: "sl-install-banner",
        cls: "sl-glass",
        css: {
            position: "fixed", left: "50%",
            bottom: "calc(var(--bottomnav-h, 64px) + env(safe-area-inset-bottom, 0px) + 12px)",
            zIndex: "10000", width: "min(92%, 420px)",
            border: "1px solid var(--border2)", borderRadius: "18px",
            padding: "14px 16px 12px", overflow: "hidden",
            boxShadow: "0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
            animation: "slSpringUp .5s cubic-bezier(.34,1.56,.64,1) forwards"
        }
    });

    var row = el("div", { css: { display: "flex", alignItems: "center", gap: "12px" } });

    var logoWrap = el("div", {
        css: {
            width: "42px", height: "42px", borderRadius: "12px", flexShrink: "0",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 0 1px var(--border2)"
        }
    });
    logoWrap.appendChild(makeLogo(42));
    row.appendChild(logoWrap);

    var mid = el("div", { css: { flex: "1", minWidth: "0" } });
    mid.appendChild(el("div", { css: { fontSize: ".88rem", fontWeight: "700", color: "var(--text)" } }, "Install StudyLab"));
    mid.appendChild(el("div", { css: { fontSize: ".76rem", color: "var(--muted)", marginTop: "1px" } }, "Faster access, works offline"));
    row.appendChild(mid);

    row.appendChild(el("button", {
        css: {
            width: "26px", height: "26px", borderRadius: "50%", border: "none",
            background: "rgba(255,255,255,0.06)", color: "var(--muted)", fontSize: ".8rem",
            cursor: "pointer", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center"
        },
        onclick: function() { dismissInstallBanner(); }
    }, "✕"));

    banner.appendChild(row);

    var installBtn = el("button", {
        cls: "sl-cta-glow",
        css: {
            width: "100%", marginTop: "12px", padding: "10px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, var(--accent), var(--accent2))", color: "#fff",
            fontSize: ".85rem", fontWeight: "700", cursor: "pointer"
        },
        onclick: function() { dismissInstallBanner(); installAppNow(); }
    }, "Install now");
    banner.appendChild(installBtn);

    var barTrack = el("div", {
        css: { position: "absolute", left: "0", right: "0", bottom: "0", height: "3px", background: "rgba(255,255,255,0.06)" }
    });
    var barFill = el("div", {
        css: {
            height: "100%", width: "100%", transformOrigin: "left",
            background: "linear-gradient(90deg, var(--accent), var(--accent2))",
            animation: "slShrinkBar 8s linear forwards"
        }
    });
    barTrack.appendChild(barFill);
    banner.appendChild(barTrack);

    banner.addEventListener('touchstart', function() { barFill.style.animationPlayState = 'paused'; }, { passive: true });
    banner.addEventListener('touchend', function() { barFill.style.animationPlayState = 'running'; });

    document.body.appendChild(banner);
    attachSwipeDismiss(banner, 'down', dismissInstallBanner);

    setTimeout(dismissInstallBanner, 8000);
}

function dismissInstallBanner() {
    var banner = document.getElementById('sl-install-banner');
    if (banner) {
        banner.style.animation = "none";
        banner.style.transition = "transform .3s ease, opacity .3s ease";
        banner.style.transform = "translate(-50%,40px)";
        banner.style.opacity = "0";
        setTimeout(function() { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 300);
    }
}