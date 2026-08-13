// ═══════════════════════════════════════════════════════════════════
// PAGE-ALLTOPICS.JS — Complete Syllabus Directory (UPDATED)
// ═══════════════════════════════════════════════════════════════════

function pgAllTopics() {
    var w = el("div", { cls: "fd", css: { maxWidth: "800px", margin: "0 auto", paddingBottom: "80px" } });
    
    // Header
    if (typeof makeNav === 'function') {
        w.appendChild(makeNav("alltopics"));
    }

    var hd = el("div", { css: { textAlign: "center", marginBottom: "40px", paddingTop: "20px" } });
    var badge = el("div", {
      css: {
        display: "inline-flex", alignItems: "center", gap: "8px",
        padding: "6px 14px", borderRadius: "100px", background: "var(--bg2)",
        border: "1px solid var(--border)", fontSize: "0.7rem", fontWeight: "700",
        color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em",
        marginBottom: "16px"
      },
      txt: "Complete Curriculum"
    });
    hd.appendChild(badge);
    hd.appendChild(el("div", { css: { fontSize: "2.2rem", fontWeight: "800", letterSpacing: "-.04em", fontFamily: "var(--font-display)", color: "var(--text)" }, txt: "Master Syllabus Directory" }));
    hd.appendChild(el("div", { css: { fontSize: ".9rem", color: "var(--muted)", marginTop: "8px" }, txt: "All registered subjects and micro-topics across the entire exam syllabus." }));
    w.appendChild(hd);

    var subjs = typeof SUBJ !== 'undefined' ? SUBJ : [];
    var subjData = typeof SD !== 'undefined' ? SD : {};
    var allQs = typeof QD !== 'undefined' ? QD : {};

    var container = el("div", { css: { display: "flex", flexDirection: "column", gap: "24px" } });

    subjs.forEach(function(s) {
        var data = subjData[s] || { color: "#3b82f6", desc: "", topics: [] };
        var subjectQs = allQs[s] || [];
        var iconGlyph = (typeof ICON !== 'undefined' && ICON[s]) ? ICON[s] : "📖";

        var card = el("div", {
            css: {
                background: "var(--glass-bg)", border: "1px solid var(--glass-border)",
                backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                borderRadius: "20px", padding: "24px", boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
                borderLeft: "4px solid " + data.color
            }
        });

        // Subject Title Row
        var topRow = el("div", { css: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" } });
        var titleGroup = el("div", { css: { display: "flex", alignItems: "center", gap: "12px" } });
        titleGroup.appendChild(el("span", { css: { fontSize: "1.8rem" }, txt: iconGlyph }));
        titleGroup.appendChild(el("div", { css: { fontSize: "1.3rem", fontWeight: "800", fontFamily: "var(--font-display)", color: "var(--text)" }, txt: s }));
        topRow.appendChild(titleGroup);

        topRow.appendChild(el("span", { 
            css: { fontSize: ".75rem", fontWeight: "700", padding: "4px 10px", borderRadius: "20px", background: data.color + "15", color: data.color, border: "1px solid " + data.color + "30" }, 
            txt: subjectQs.length + " Total Qs" 
        }));
        card.appendChild(topRow);

        if (data.desc) {
            card.appendChild(el("div", { css: { fontSize: ".85rem", color: "var(--muted)", marginBottom: "16px", lineHeight: "1.5" }, txt: data.desc }));
        }

        // Topics Grid/List for this Subject
        var topicListWrap = el("div", { css: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "10px", marginTop: "12px" } });

        // 🎯 NEW LOGIC: Merge Hardcoded Topics with Dynamic Sheet Topics
        var combinedTopics = [];
        
        if (data.topics) {
            data.topics.forEach(function(t) {
                if (t && !combinedTopics.includes(t)) combinedTopics.push(t);
            });
        }
        
        subjectQs.forEach(function(q) {
            var qTopic = q.topic ? q.topic.trim() : "";
            if (qTopic && !combinedTopics.includes(qTopic)) {
                combinedTopics.push(qTopic);
            }
        });

        if (combinedTopics.length > 0) {
            combinedTopics.forEach(function(topicName) {
                // Count matching questions in this topic
                var count = subjectQs.filter(function(q) {
                    return q.topic && q.topic.toLowerCase().trim() === topicName.toLowerCase().trim();
                }).length;

                var topicCard = el("div", {
                    css: {
                        background: "var(--card2)", border: "1px solid var(--border)", borderRadius: "12px",
                        padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
                        cursor: count > 0 ? "pointer" : "default", transition: "all 0.2s ease",
                        opacity: count > 0 ? "1" : "0.6"
                    },
                    onclick: function() {
                        if (count === 0) {
                            if (typeof toast === 'function') toast("Questions for this topic are updating soon!", "#f59e0b");
                            return;
                        }
                        sub = s;
                        window.activeTopic = topicName;
                        go("sub", s);
                    }
                });

                if (count > 0) {
                    topicCard.addEventListener("mouseenter", function() {
                        this.style.borderColor = data.color;
                        this.style.background = "var(--card)";
                        this.style.transform = "translateY(-2px)";
                    });
                    topicCard.addEventListener("mouseleave", function() {
                        this.style.borderColor = "var(--border)";
                        this.style.background = "var(--card2)";
                        this.style.transform = "translateY(0)";
                    });
                }

                var textPart = el("div", { css: { display: "flex", flexDirection: "column" } });
                textPart.appendChild(el("div", { css: { fontSize: ".85rem", fontWeight: "700", color: "var(--text)" }, txt: topicName }));
                textPart.appendChild(el("div", { css: { fontSize: ".7rem", color: count > 0 ? "var(--subtle)" : "#f59e0b", marginTop: "2px" }, txt: count > 0 ? count + " Qs" : "Pending" }));
                topicCard.appendChild(textPart);

                topicCard.appendChild(el("div", { css: { fontSize: ".9rem", color: count > 0 ? data.color : "var(--border2)" }, txt: "→" }));

                topicListWrap.appendChild(topicCard);
            });
        }

        card.appendChild(topicListWrap);
        container.appendChild(card);
    });

    w.appendChild(container);
    return w;
}