// ═══════════════════════════════════════════════════════════════════
// PAGE-DIGEST.JS — Continuous Stream, Automated Current Affairs Engine
// ═══════════════════════════════════════════════════════════════════

function pgDigest() {
    function el(type, props, children) {
        var element = document.createElement(type);
        if (props) {
            if (props.cls) element.className = props.cls;
            if (props.className) element.className = props.className;
            if (props.txt) element.textContent = props.txt;
            if (props.onclick) element.onclick = props.onclick;
            if (props.css) {
                for (var key in props.css) {
                    element.style[key] = props.css[key];
                }
            }
        }
        if (children && Array.isArray(children)) {
            children.forEach(function(child) {
                if (child) element.appendChild(child);
            });
        }
        return element;
    }

    var w = el("div", { cls: "fd" });

    if (typeof makeNav === "function") {
        w.appendChild(makeNav("digest"));
    }

    if (!document.getElementById('studylab-digest-styles')) {
        var style = document.createElement('style');
        style.id = 'studylab-digest-styles';
        style.innerHTML = `
            .news-feed-stream { overflow-y: auto; -webkit-overflow-scrolling: touch; padding-top: 10px; transform: translateZ(0); will-change: scroll-position; contain: layout style paint; }
            .rotate-sync { animation: spinSync 1s linear infinite; }
            @keyframes spinSync { 100% { transform: rotate(360deg); } }
            
            .digest-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 16px;
            }
        `;
        document.head.appendChild(style);
    }

    function decodeHTML(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    // Consolidated 9 Categories
    var CATS = [
      { id: 'national',  label: 'National',      icon: '🇮🇳', color: '#4F8EF7', desc: 'Top stories from across India.' },
      { id: 'world',     label: 'International', icon: '🌐', color: '#f87171', desc: 'Foreign relations and global events.' },
      { id: 'polity',    label: 'Polity & Law',  icon: '⚖️', color: '#dc2626', desc: 'Supreme court, bills, and constitution.' },
      { id: 'economy',   label: 'Economy',       icon: '📈', color: '#f59e0b', desc: 'RBI, GDP, budget and markets.' },
      { id: 'envgeo',    label: 'Env & Geo',     icon: '🌍', color: '#16a34a', desc: 'Environment, climate, and geography.' },
      { id: 'heritage',  label: 'Heritage',      icon: '🛕', color: '#7c3aed', desc: 'History, archaeology, and culture.' },
      { id: 'scitech',   label: 'Sci & Tech',    icon: '🚀', color: '#6366f1', desc: 'ISRO, DRDO, and innovations.' },
      { id: 'sports',    label: 'Sports',        icon: '🏆', color: '#ec4899', desc: 'Tournaments, records, and medals.' },
      { id: 'misc',      label: 'Misc & Awards', icon: '🎖️', color: '#14b8a6', desc: 'PIB, defense, and miscellaneous.' }
    ];

    var contentWrap = el("div", { css: { height: "100%", position: "relative" } });

    function getDailyProgress() {
        var today = new Date().toDateString();
        var stats = JSON.parse(localStorage.getItem('sl_digest_stats') || '{"date":"","read":0}');
        if (stats.date !== today) stats = { date: today, read: 0 };
        return stats;
    }

    function updateDailyProgress() {
        var stats = getDailyProgress();
        stats.read += 1;
        localStorage.setItem('sl_digest_stats', JSON.stringify(stats));
    }

    // ─── MAIN CATEGORY VIEW ───
    function showMain() {
        contentWrap.innerHTML = "";
        
        var bgGlow = el("div", {
          css: {
            position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)",
            width: "400px", height: "400px", background: "radial-gradient(circle, var(--accent) 0%, transparent 60%)",
            opacity: "0.08", filter: "blur(70px)", pointerEvents: "none", zIndex: "-1"
          }
        });
        contentWrap.appendChild(bgGlow);

        var wrap = el("div", { css: { maxWidth: "900px", margin: "0 auto", paddingBottom: "110px", paddingTop: "20px", paddingLeft: "20px", paddingRight: "20px" } });

        var hd = el("div", { css: { textAlign: "center", marginBottom: "40px" } });
        var badge = el("div", {
          css: {
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 14px", borderRadius: "100px", background: "var(--bg2)",
            border: "1px solid var(--border)", fontSize: "0.7rem", fontWeight: "700",
            color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em",
            marginBottom: "16px"
          },
          txt: "Deep Dive Modules"
        });
        hd.appendChild(badge);
        hd.appendChild(el("div", { css: { fontSize: "2.2rem", fontWeight: "800", letterSpacing: "-.04em", fontFamily: "var(--font-display)", color: "var(--text)", lineHeight: "1.1" }, txt: "The Knowledge Digest" }));

        var stats = getDailyProgress();
        var progressWrap = el("div", { css: { display: "inline-flex", alignItems: "center", gap: "10px", marginTop: "20px", padding: "10px 18px", background: "var(--glass-bg)", border: "1px solid var(--glass-border)", backdropFilter: "blur(12px)", borderRadius: "100px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)" } });
        progressWrap.appendChild(el("span", { css: { fontSize: "1.2rem" }, txt: "🎯" }));
        progressWrap.appendChild(el("div", { css: { fontSize: ".85rem", fontWeight: "700", color: "var(--text)" }, txt: "Daily Goal: " + stats.read + " / 5 Articles Read" }));
        hd.appendChild(progressWrap);
        wrap.appendChild(hd);

        var grid = el("div", { cls: "digest-grid" });

        CATS.forEach(function (cat) {
            var card = el("div", { 
                css: { 
                    display: "flex", alignItems: "center", gap: "16px", background: "var(--card)", 
                    border: "1px solid var(--border)", borderRadius: "20px", padding: "20px", cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)"
                }, 
                onclick: function () { showSub(cat); } 
            });
            
            card.addEventListener("mouseenter", function() {
                this.style.transform = "translateY(-4px)";
                this.style.borderColor = cat.color;
                this.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1), inset 0 0 0 1px " + cat.color + "20";
                this.style.background = "var(--card2)";
            });
            card.addEventListener("mouseleave", function() {
                this.style.transform = "translateY(0)";
                this.style.borderColor = "var(--border)";
                this.style.boxShadow = "none";
                this.style.background = "var(--card)";
            });

            var iconBox = el("div", { css: { fontSize: "2.2rem", width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", background: cat.color + "15", borderRadius: "14px", border: "1px solid " + cat.color + "40" }, txt: cat.icon });
            var txtBox = el("div", { css: { flex: "1" } });
            txtBox.appendChild(el("div", { css: { fontSize: "1.1rem", fontWeight: "800", fontFamily: "var(--font-display)", color: "var(--text)", marginBottom: "4px" }, txt: cat.label }));
            txtBox.appendChild(el("div", { css: { fontSize: ".85rem", color: "var(--muted)", lineHeight: "1.4" }, txt: cat.desc }));

            card.appendChild(iconBox);
            card.appendChild(txtBox);
            card.appendChild(el("div", { css: { fontSize: "1.2rem", color: cat.color, opacity: "0.6" }, txt: "→" }));
            grid.appendChild(card);
        });

        wrap.appendChild(grid);
        contentWrap.appendChild(wrap);
        window.scrollTo(0, 0);
    }

    // ─── INDIVIDUAL CATEGORY STREAM VIEW ───
    function showSub(cat) {
        history.pushState({ page: "digest", sub: null, digestView: "main" }, "");
        contentWrap.innerHTML = "";
        window.scrollTo(0, 0);

        var bgGlow = el("div", {
          css: {
            position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)",
            width: "400px", height: "400px", background: "radial-gradient(circle, " + cat.color + " 0%, transparent 60%)",
            opacity: "0.1", filter: "blur(80px)", pointerEvents: "none", zIndex: "-1"
          }
        });
        contentWrap.appendChild(bgGlow);

        var wrap = el("div", { css: { maxWidth: "720px", margin: "0 auto", padding: "20px 16px 110px 16px", display: "flex", flexDirection: "column", boxSizing: "border-box" } });

        var topBar = el("div", { css: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexShrink: "0" } });
        
        var leftSide = el("div", { css: { display: "flex", alignItems: "center", gap: "16px" } });
        var backBtn = el("button", { 
            css: { width: "44px", height: "44px", borderRadius: "14px", border: "1px solid var(--border)", background: "var(--card2)", color: "var(--text)", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", transition: "all 0.2s" }, 
            onclick: function () { history.back(); } 
        });
        backBtn.innerHTML = '←';
        backBtn.onmouseover = function() { this.style.borderColor = cat.color; this.style.color = cat.color; };
        backBtn.onmouseout = function() { this.style.borderColor = "var(--border)"; this.style.color = "var(--text)"; };

        var titleCol = el("div", { css: { display: "flex", flexDirection: "column" }});
        titleCol.appendChild(el("div", { css: { fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: cat.color, marginBottom: "2px" }, txt: "Live Stream" }));
        titleCol.appendChild(el("div", { css: { fontSize: "1.5rem", fontWeight: "800", fontFamily: "var(--font-display)", color: "var(--text)", lineHeight: "1" }, txt: cat.icon + " " + cat.label }));
        
        leftSide.appendChild(backBtn);
        leftSide.appendChild(titleCol);

        var syncBtn = el("button", { 
            css: { width: "44px", height: "44px", borderRadius: "14px", border: "1.5px solid var(--border)", background: "var(--glass-bg)", backdropFilter: "blur(12px)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)", transition: "all 0.15s ease", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
            onclick: function () { 
                var btn = this;
                btn.style.transform = "scale(0.85)"; 
                setTimeout(function() { btn.style.transform = "scale(1)"; }, 150);
                fetchLatestNews(cat, newsWrap, syncIcon, true); 
            }
        });

        var syncIcon = el("span", { css: { display: "flex", alignItems: "center", justifyContent: "center" } });
        syncIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path></svg>`;
        syncBtn.appendChild(syncIcon);
        topBar.appendChild(leftSide);
        topBar.appendChild(syncBtn);
        wrap.appendChild(topBar);

        var newsWrap = el("div", { className: "news-feed-stream", css: { flex: "1" } });
        wrap.appendChild(newsWrap);
        contentWrap.appendChild(wrap);

        fetchLatestNews(cat, newsWrap, syncIcon, false);
    }

    // ─── CORE FETCHING ENGINE ───
    function fetchLatestNews(cat, newsWrap, syncIcon, forceRefresh) {
        if (syncIcon) syncIcon.classList.add("rotate-sync");

        var todayStr = new Date().toDateString();
        var cacheKey = "digest_daily_" + cat.id;
        var cachedData = (typeof Sv !== 'undefined' && Sv.get) ? Sv.get(cacheKey) : null;

        if (!cachedData || !Array.isArray(cachedData.articles)) { cachedData = { date: "", articles: [] }; }

        if (cachedData.articles.length > 0 && !forceRefresh) {
            renderDiscoverStream(cachedData.articles, cat, newsWrap);
            if (syncIcon) syncIcon.classList.remove("rotate-sync");
            return;
        }

        var feeds = (typeof CA_FEEDS !== "undefined" && CA_FEEDS[cat.id]) ? CA_FEEDS[cat.id] : [];
        var fallback = (typeof CA_FALLBACK !== "undefined" && CA_FALLBACK[cat.id]) ? CA_FALLBACK[cat.id] : [];

        if (feeds.length === 0) {
            renderDiscoverStream(cachedData.articles.length ? cachedData.articles : fallback, cat, newsWrap);
            if (syncIcon) syncIcon.classList.remove("rotate-sync");
            return;
        }

        var fetchPromises = feeds.map(function(feedObj) {
            return fetch(feedObj.url)
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    if (!data.items || !data.items.length) return [];
                    
                    var cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - 10); 

                    return data.items.map(function(item) {
                        var extractedImg = item.thumbnail || (item.enclosure && item.enclosure.link) || "";
                        if (!extractedImg || extractedImg.trim() === "") {
                            var imgMatch = (item.content || item.description || "").match(/<img[^>]+src="([^">]+)"/i);
                            if (imgMatch && imgMatch[1]) extractedImg = imgMatch[1];
                        }
                        return {
                            title: decodeHTML(item.title),
                            url: item.link,
                            source: feedObj.name || cat.label,
                            pubDate: item.pubDate || new Date().toISOString(),
                            description: decodeHTML(item.description || item.contentSnippet || ""),
                            image: extractedImg
                        };
                    }).filter(function(item) {
                        return new Date(item.pubDate) >= cutoffDate;
                    });
                })
                .catch(function() { return []; });
        });

        Promise.all(fetchPromises).then(function(resultsLists) {
            var liveAggregated = [];
            resultsLists.forEach(function(list) {
                if (list && list.length) liveAggregated = liveAggregated.concat(list);
            });

            var baseList = cachedData.articles || [];
            var combined = liveAggregated.concat(baseList);

            var unique = [];
            var seen = {};
            combined.forEach(function(art) {
                if (art.url && !seen[art.url]) {
                    seen[art.url] = true;
                    unique.push(art);
                }
            });

            unique.sort(function(a, b) { return new Date(b.pubDate) - new Date(a.pubDate); });

            cachedData.articles = unique.slice(0, 120); 
            cachedData.date = todayStr;

            if (typeof Sv !== 'undefined' && Sv.set) Sv.set(cacheKey, cachedData);

            renderDiscoverStream(cachedData.articles.length ? cachedData.articles : fallback, cat, newsWrap);
        }).finally(function() {
            if (syncIcon) syncIcon.classList.remove("rotate-sync");
        });
    }

    // ─── GLASSMORPHIC TIMELINE RENDERER ───
    function renderDiscoverStream(articles, cat, newsWrap) {
        newsWrap.innerHTML = "";

        if (!articles || !articles.length) {
            newsWrap.innerHTML = '<div style="padding:40px; text-align:center; color:var(--muted); font-weight:600; line-height:1.5;">No news available in this category yet.<br><span style="font-size:0.8rem; font-weight:400;">Try syncing again later.</span></div>';
            return;
        }

        articles.forEach(function (a, idx) {
            var card = el("div", { 
                css: { 
                    background: "var(--card)", border: "1px solid var(--border)", 
                    borderRadius: "20px", overflow: "hidden", marginBottom: "24px", 
                    boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
                    borderTop: "3px solid " + cat.color,
                    animation: "slide-up 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both",
                    animationDelay: (idx * 0.05) + "s"
                } 
            });

            var imgContainer = el("div", { css: { width: "100%", height: "220px", position: "relative", borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg2)", overflow: "hidden" } });

            if (a.image && a.image.trim() !== "") {
                var sharpLayer = el("div", { css: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", backgroundImage: "url('" + a.image + "')", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center" } });
                imgContainer.appendChild(sharpLayer);
            } else {
                imgContainer.style.backgroundImage = "linear-gradient(" + cat.color + "1A 1px, transparent 1px), linear-gradient(90deg, " + cat.color + "1A 1px, transparent 1px)";
                imgContainer.style.backgroundSize = "20px 20px";
                imgContainer.style.backgroundPosition = "center center";

                var fallbackBadge = el("div", { 
                    css: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80px", height: "80px", borderRadius: "20px", backgroundColor: "var(--card)", border: "2px solid " + cat.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.8rem", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }, 
                    txt: cat.icon 
                });
                imgContainer.appendChild(fallbackBadge);
            }
            card.appendChild(imgContainer);

            var textBlock = el("div", { css: { padding: "24px" } });
            
            var metaRow = el("div", { css: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" } });
            metaRow.appendChild(el("span", { css: { color: cat.color, background: cat.color + "15", padding: "4px 10px", borderRadius: "6px", border: "1px solid " + cat.color + "30" }, txt: a.source }));

            var parsedTime = new Date(a.pubDate);
            var dateOption = { month: "short", day: "numeric" };
            if (parsedTime.getFullYear() !== new Date().getFullYear()) dateOption.year = "numeric";
            var timeStr = !isNaN(parsedTime) ? parsedTime.toLocaleDateString("en-IN", dateOption) : "Recent";

            metaRow.appendChild(el("span", { css: { color: "var(--subtle)" }, txt: timeStr }));
            textBlock.appendChild(metaRow);

            var titleEl = el("div", { css: { fontSize: "1.3rem", fontWeight: "700", lineHeight: "1.4", color: "var(--text)", fontFamily: "var(--font-body)", marginBottom: "12px" }, txt: a.title });
            textBlock.appendChild(titleEl);

            var summaryTxt = (a.description || "").replace(/<\/?[^>]+(>|$)/g, "").trim();
            if (!summaryTxt) summaryTxt = "Tap below to open the complete reference brief and view historical announcements.";
            if (summaryTxt.length > 160) summaryTxt = summaryTxt.substring(0, 155) + "...";

            var descEl = el("p", { css: { fontSize: "0.95rem", color: "var(--muted)", lineHeight: "1.6", margin: "0 0 24px 0" }, txt: summaryTxt });
            textBlock.appendChild(descEl);

            var bottomRow = el("div", { css: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "16px" } });
            
            var profileBox = el("div", { css: { display: "flex", alignItems: "center", gap: "10px" } });
            var slBadge = el("div", { 
                css: { width: "28px", height: "28px", borderRadius: "8px", backgroundColor: "var(--card)", color: "var(--text)", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontFamily: "var(--font-display)", border: "1px solid var(--border)" }, 
                txt: "SL" 
            });
            var brandText = el("div", { css: { fontSize: "0.9rem", fontWeight: "800", fontFamily: "var(--font-display)", letterSpacing: "-0.02em" } });
            brandText.innerHTML = '<span style="color: var(--text);">Study</span><span style="color: ' + cat.color + ';">Lab</span>';
            profileBox.appendChild(slBadge);
            profileBox.appendChild(brandText);
            bottomRow.appendChild(profileBox);

            var readBtn = el("button", { 
                css: { padding: "10px 18px", background: cat.color, color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer", boxShadow: "0 4px 12px " + cat.color + "60", transition: "transform 0.2s" }, 
                txt: "Read Full Brief",
                onclick: function() { 
                    updateDailyProgress(); 
                    if (a.url) window.open(a.url, "_blank"); 
                } 
            });
            readBtn.onmouseover = function() { this.style.transform = "translateY(-2px)"; };
            readBtn.onmouseout = function() { this.style.transform = "translateY(0)"; };

            bottomRow.appendChild(readBtn);

            textBlock.appendChild(bottomRow);
            card.appendChild(textBlock);
            newsWrap.appendChild(card);
        });
    }

    function onPopState(e) {
        if (!w.isConnected) { window.removeEventListener("popstate", onPopState); return; }
        if (e.state && e.state.digestView === "main") showMain();
    }
    window.addEventListener("popstate", onPopState);

    showMain();
    w.appendChild(contentWrap);
    return w;
}