// ─── PROGRESS DASHBOARD (REDESIGNED) ────────────────────────────────────────
function pgStats(){
  var w=el("div",{cls:"fd"});
  w.appendChild(makeNav("stats"));

  // Inject scoped styles (always update)
  var styleId="pgstats-style";
  var existingStyle=document.getElementById(styleId);
  if(existingStyle) existingStyle.remove();
  var style=document.createElement("style");
  style.id=styleId;
    style.textContent=`
      .pg-wrap{
        max-width:520px;
        margin:0 auto;
        padding:0 16px 48px;
        box-sizing:border-box;
        width:100%;
      }
      .pg-dash-header{
        text-align:center;
        padding:4px 0 20px;
      }
      .pg-dash-header-icon{
        width:56px;height:56px;
        background:linear-gradient(135deg,var(--accent),#818cf8);
        border-radius:16px;
        display:inline-flex;align-items:center;justify-content:center;
        font-size:1.6rem;
        margin-bottom:14px;
        box-shadow:0 8px 24px rgba(0,0,0,.15);
      }
      .pg-dash-header h1{
        font-size:1.5rem;font-weight:800;letter-spacing:-.03em;
        margin:0 0 6px;line-height:1.2;
      }
      .pg-dash-header p{
        font-size:.82rem;color:var(--muted);margin:0;
      }
      /* ── 2×2 stat grid ── */
      .pg-stat-grid{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
        margin-bottom:24px;
      }
      .pg-stat-card{
        background:var(--card);
        border:1.5px solid var(--border);
        border-radius:16px;
        padding:16px 14px;
        display:flex;align-items:center;gap:12px;
        min-width:0;
        box-sizing:border-box;
      }
      .pg-stat-icon{
        width:40px;height:40px;flex-shrink:0;
        border-radius:12px;
        display:flex;align-items:center;justify-content:center;
        font-size:1.1rem;
      }
      .pg-stat-info{min-width:0;}
      .pg-stat-val{
        font-size:1.3rem;font-weight:800;letter-spacing:-.03em;
        line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
      }
      .pg-stat-lbl{
        font-size:.62rem;color:var(--muted);
        text-transform:uppercase;letter-spacing:.06em;font-weight:600;
        margin-top:2px;line-height:1.3;
      }
      /* ── Section label ── */
      .pg-section-label{
        font-size:.7rem;color:var(--muted);
        text-transform:uppercase;letter-spacing:.1em;font-weight:700;
        margin-bottom:12px;
        padding-left:2px;
      }
      /* ── Subject card ── */
      .pg-subj-list{
        display:flex;flex-direction:column;gap:10px;
        margin-bottom:24px;
      }
      .pg-subj-card{
        background:var(--card);
        border:1.5px solid var(--border);
        border-radius:16px;
        padding:16px;
        box-sizing:border-box;
        width:100%;
        overflow:hidden;
      }
      .pg-subj-top{
        display:flex;align-items:center;
        justify-content:space-between;
        margin-bottom:12px;gap:8px;
      }
      .pg-subj-name{
        display:flex;align-items:center;gap:8px;
        font-weight:700;font-size:.95rem;
        min-width:0;
      }
      .pg-subj-name span:first-child{font-size:1.2rem;flex-shrink:0;}
      .pg-subj-best{
        font-size:.72rem;font-weight:700;
        padding:3px 10px;border-radius:99px;
        flex-shrink:0;white-space:nowrap;
      }
      .pg-bar-wrap{margin-bottom:10px;}
      .pg-bar-meta{
        display:flex;justify-content:space-between;
        font-size:.7rem;color:var(--muted);margin-bottom:5px;
      }
      .pg-bar-track{
        height:5px;background:var(--border);
        border-radius:99px;overflow:hidden;
      }
      .pg-bar-fill{
        height:100%;border-radius:99px;
        transition:width .7s cubic-bezier(.4,0,.2,1);
      }
      .pg-mini-stats{
        display:flex;gap:8px;
      }
      .pg-mini-stat{
        flex:1;text-align:center;
        background:var(--bg2);border-radius:8px;
        padding:6px 4px;min-width:0;
      }
      .pg-mini-val{font-size:.85rem;font-weight:700;}
      .pg-mini-lbl{font-size:.6rem;color:var(--muted);}
      .pg-badge{
        margin-top:10px;padding:6px 10px;
        border-radius:8px;font-size:.7rem;font-weight:600;
      }
      .pg-badge.weak{
        background:rgba(248,113,113,.08);
        border:1px solid rgba(248,113,113,.2);color:#f87171;
      }
      .pg-badge.strong{
        background:rgba(74,222,128,.08);
        border:1px solid rgba(74,222,128,.2);color:#4ade80;
      }
      /* ── Recent sessions ── */
      .pg-recent-box{
        background:var(--card);
        border:1.5px solid var(--border);
        border-radius:16px;
        overflow:hidden;
        margin-bottom:24px;
      }
      .pg-session-row{
        display:flex;align-items:center;gap:12px;
        padding:12px 16px;
        box-sizing:border-box;width:100%;
      }
      .pg-session-row+.pg-session-row{
        border-top:1px solid var(--border);
      }
      .pg-session-info{flex:1;min-width:0;}
      .pg-session-name{font-size:.85rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .pg-session-meta{font-size:.7rem;color:var(--muted);}
      .pg-pct-badge{
        flex-shrink:0;font-size:.8rem;font-weight:700;
        padding:4px 12px;border-radius:99px;white-space:nowrap;
      }
      /* ── Actions ── */
      .pg-action-row{
        display:flex;gap:10px;
        margin-bottom:32px;
        flex-wrap:wrap;
      }
      .pg-action-row .btn{
        flex:1;min-width:140px;
        padding:13px 16px;font-size:.85rem;
        border-radius:12px;
        display:flex;align-items:center;justify-content:center;gap:6px;
      }
      /* ── Empty ── */
      .pg-empty{
        text-align:center;padding:40px 20px;
        background:var(--card);border:1.5px solid var(--border);
        border-radius:16px;margin-bottom:24px;
      }
      /* ── Strongest/weakest banner ── */
      .pg-highlight-row{
        display:flex;gap:10px;margin-bottom:24px;
      }
      .pg-highlight-card{
        flex:1;min-width:0;
        background:var(--card);border:1.5px solid var(--border);
        border-radius:16px;padding:14px;
        box-sizing:border-box;
      }
      .pg-highlight-lbl{
        font-size:.62rem;color:var(--muted);
        text-transform:uppercase;letter-spacing:.06em;font-weight:700;
        margin-bottom:6px;
      }
      .pg-highlight-subj{
        display:flex;align-items:center;gap:6px;
        font-weight:700;font-size:.88rem;
      }
      .pg-highlight-val{
        font-size:.72rem;color:var(--muted);margin-top:2px;
      }
      /* ── Trend + momentum ── */
      .pg-subj-trend{
        display:inline-flex;align-items:center;gap:3px;
        font-size:.7rem;font-weight:700;
      }
      .pg-trend-up{color:#4ade80;}
      .pg-trend-down{color:#f87171;}
      .pg-trend-flat{color:var(--muted);}
      .pg-subj-meta-row{
        display:flex;justify-content:space-between;align-items:center;
        margin-top:8px;font-size:.68rem;color:var(--muted);
      }
      .pg-momentum-badge{
        margin-top:10px;padding:6px 10px;
        border-radius:8px;font-size:.7rem;font-weight:600;
      }
      .pg-momentum-badge.improving{
        background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.2);color:#4ade80;
      }
      .pg-momentum-badge.declining{
        background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.2);color:#f87171;
      }
      .pg-momentum-badge.plateaued{
        background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.2);color:#f59e0b;
      }
      /* ── Consistency stat ── */
      .pg-consistency-note{
        font-size:.7rem;color:var(--muted);margin-top:4px;
      }
    `;
    document.head.appendChild(style);

  var wrap=el("div",{cls:"pg-wrap"});
  w.appendChild(wrap);

  // ── Collect stats ──────────────────────────────────────
  var totalAttempted=0,totalCorrect=0,totalSessions=0;
  var subjectStats=[];
  var allPracticeDates={}; // for consistency: distinct days across ALL subjects
  var today=new Date();

  SUBJ.forEach(function(s){
    var sv=Sv.get("qz_"+s)||{best:null,att:0,h:[]};
    var hist=(sv.h||[]).slice().sort(function(a,b){return a.date>b.date?1:-1;}); // oldest → newest
    var sessions=hist.length;
    if(sessions===0) return; // only track subjects the user has actually attempted

    hist.forEach(function(h){ allPracticeDates[h.date]=true; });

    var avgAcc=Math.round(hist.reduce(function(sum,h){return sum+h.pct;},0)/sessions);
    var best=sv.best||0;
    var total=(QD[s]||[]).length;
    var totalQ=hist.reduce(function(sum,h){return sum+h.total;},0);
    var totalC=hist.reduce(function(sum,h){return sum+h.correct;},0);
    totalAttempted+=totalQ;totalCorrect+=totalC;totalSessions+=sessions;

    // ── Weighted recent-performance score ──
    // Last 5 sessions weighted more heavily than older ones, so a subject
    // someone struggled with early but has since improved on reads accurately.
    var recent=hist.slice(-5);
    var weights=recent.map(function(_,i){return i+1;}); // 1,2,3,4,5 — most recent gets highest weight
    var weightedSum=recent.reduce(function(sum,h,i){return sum+h.pct*weights[i];},0);
    var weightTotal=weights.reduce(function(a,b){return a+b;},0);
    var weightedScore=Math.round(weightedSum/weightTotal);

    // ── Trend: last 3 sessions vs the 3 before that ──
    var trend="flat";
    if(hist.length>=2){
      var lastN=hist.slice(-3);
      var prevN=hist.slice(-6,-3);
      var lastAvg=lastN.reduce(function(s,h){return s+h.pct;},0)/lastN.length;
      if(prevN.length>0){
        var prevAvg=prevN.reduce(function(s,h){return s+h.pct;},0)/prevN.length;
        if(lastAvg-prevAvg>=5) trend="up";
        else if(prevAvg-lastAvg>=5) trend="down";
      } else if(hist.length>=2){
        // not enough history for a prior window — compare first vs last available
        var firstPct=hist[0].pct, lastPct=hist[hist.length-1].pct;
        if(lastPct-firstPct>=5) trend="up";
        else if(firstPct-lastPct>=5) trend="down";
      }
    }

    // ── Momentum label (improving / plateaued / declining) ──
    var momentum = trend==="up" ? "improving" : trend==="down" ? "declining" : "plateaued";

    // ── Recency: days since last practiced this subject ──
    var lastDateStr=hist[hist.length-1].date;
    var lastDate=new Date(lastDateStr);
    var daysSince=Math.floor((today-lastDate)/(1000*60*60*24));

    // ── Best & worst single sessions ──
    var bestSession=hist.reduce(function(m,h){return h.pct>m.pct?h:m;},hist[0]);
    var worstSession=hist.reduce(function(m,h){return h.pct<m.pct?h:m;},hist[0]);

    subjectStats.push({
      s:s, sessions:sessions, avg:avgAcc, best:best, total:total,
      totalQ:totalQ, totalC:totalC, weightedScore:weightedScore,
      trend:trend, momentum:momentum, daysSince:daysSince,
      bestSession:bestSession, worstSession:worstSession
    });
  });

  var overallAcc=totalAttempted?Math.round((totalCorrect/totalAttempted)*100):0;
  var streak=Sv.get("streak")||{count:0};
  var consistencyDays=Object.keys(allPracticeDates).length;

  // ── Strongest / weakest subject (only meaningful with 2+ attempted subjects) ──
  var strongestSubj=null, weakestSubj=null;
  if(subjectStats.length>=2){
    strongestSubj=subjectStats.reduce(function(m,st){return st.weightedScore>m.weightedScore?st:m;},subjectStats[0]);
    weakestSubj=subjectStats.reduce(function(m,st){return st.weightedScore<m.weightedScore?st:m;},subjectStats[0]);
    if(strongestSubj.s===weakestSubj.s){strongestSubj=null;weakestSubj=null;} // only one distinct score, skip banner
  }

  // ── Hero ──────────────────────────────────────────────
  var hero=el("div",{cls:"pg-dash-header"});
  hero.appendChild(el("div",{cls:"pg-dash-header-icon",txt:"📊"}));
  hero.appendChild(el("h1",{txt:"Progress Dashboard"}));
  hero.appendChild(el("p",{txt:"Track your performance across all subjects"}));
  wrap.appendChild(hero);

  // ── 2×2 Stat Grid ─────────────────────────────────────
  var sg=el("div",{cls:"pg-stat-grid"});
  [
    {icon:"📝",val:totalAttempted,lbl:"Questions\nAttempted",color:"var(--accent)",bg:"rgba(99,102,241,.12)"},
    {icon:"🎯",val:overallAcc+"%",lbl:"Overall\nAccuracy",color:"#4ade80",bg:"rgba(74,222,128,.12)"},
    {icon:"📆",val:consistencyDays,lbl:"Active\nDays",color:"#818cf8",bg:"rgba(129,140,248,.12)"},
    {icon:"🔥",val:streak.count,lbl:"Day\nStreak",color:"#f59e0b",bg:"rgba(245,158,11,.12)"}
  ].forEach(function(r){
    var card=el("div",{cls:"pg-stat-card"});
    var ico=el("div",{cls:"pg-stat-icon",css:{background:r.bg},txt:r.icon});
    card.appendChild(ico);
    var info=el("div",{cls:"pg-stat-info"});
    info.appendChild(el("div",{cls:"pg-stat-val",css:{color:r.color},txt:String(r.val)}));
    info.appendChild(el("div",{cls:"pg-stat-lbl",txt:r.lbl}));
    card.appendChild(info);
    sg.appendChild(card);
  });
  wrap.appendChild(sg);

  // ── Strongest / Weakest banner ─────────────────────────
  if(strongestSubj && weakestSubj){
    var hlRow=el("div",{cls:"pg-highlight-row"});

    var strongCard=el("div",{cls:"pg-highlight-card"});
    strongCard.appendChild(el("div",{cls:"pg-highlight-lbl",txt:"💪 Strongest"}));
    var strongSubjRow=el("div",{cls:"pg-highlight-subj"});
    strongSubjRow.appendChild(el("span",{txt:ICON[strongestSubj.s]}));
    strongSubjRow.appendChild(el("span",{txt:strongestSubj.s}));
    strongCard.appendChild(strongSubjRow);
    strongCard.appendChild(el("div",{cls:"pg-highlight-val",txt:strongestSubj.weightedScore+"% recent avg"}));
    hlRow.appendChild(strongCard);

    var weakCard=el("div",{cls:"pg-highlight-card"});
    weakCard.appendChild(el("div",{cls:"pg-highlight-lbl",txt:"🎯 Needs Focus"}));
    var weakSubjRow=el("div",{cls:"pg-highlight-subj"});
    weakSubjRow.appendChild(el("span",{txt:ICON[weakestSubj.s]}));
    weakSubjRow.appendChild(el("span",{txt:weakestSubj.s}));
    weakCard.appendChild(weakSubjRow);
    weakCard.appendChild(el("div",{cls:"pg-highlight-val",txt:weakestSubj.weightedScore+"% recent avg"}));
    hlRow.appendChild(weakCard);

    wrap.appendChild(hlRow);
  }

  // ── Subject Breakdown (only subjects the user has attempted) ──
  if(subjectStats.length>0){
    wrap.appendChild(el("div",{cls:"pg-section-label",txt:"Subject Breakdown"}));
    var list=el("div",{cls:"pg-subj-list"});
    subjectStats.forEach(function(st){
      var ac=AC[st.s];
      var card=el("div",{cls:"pg-subj-card"});

      // Top row
      var top=el("div",{cls:"pg-subj-top"});
      var nameDiv=el("div",{cls:"pg-subj-name"});
      nameDiv.appendChild(el("span",{txt:ICON[st.s]}));
      nameDiv.appendChild(el("span",{txt:st.s}));
      top.appendChild(nameDiv);
      top.appendChild(el("span",{cls:"pg-subj-best",css:{background:ac+"18",color:ac},txt:st.best?st.best+"%":"—"}));
      card.appendChild(top);

      // Accuracy bar — now driven by the weighted recent score, not flat lifetime avg
      var bw=el("div",{cls:"pg-bar-wrap"});
      var bm=el("div",{cls:"pg-bar-meta"});
      var accLabel=el("span",{txt:"Recent Accuracy"});
      bm.appendChild(accLabel);
      var accValWrap=el("span",{});
      accValWrap.appendChild(document.createTextNode(st.weightedScore+"% "));
      var trendSpan=el("span",{
        cls:"pg-subj-trend "+(st.trend==="up"?"pg-trend-up":st.trend==="down"?"pg-trend-down":"pg-trend-flat"),
        txt:st.trend==="up"?"↑":st.trend==="down"?"↓":"→"
      });
      accValWrap.appendChild(trendSpan);
      bm.appendChild(accValWrap);
      bw.appendChild(bm);
      var track=el("div",{cls:"pg-bar-track"});
      var fill=el("div",{cls:"pg-bar-fill",css:{width:st.weightedScore+"%",background:ac}});
      track.appendChild(fill);bw.appendChild(track);
      card.appendChild(bw);

      // Mini stats
      var ms=el("div",{cls:"pg-mini-stats"});
      [[st.sessions,"Sessions"],[st.totalQ,"Questions"],[st.totalC,"Correct"]].forEach(function(r){
        var s=el("div",{cls:"pg-mini-stat"});
        s.appendChild(el("div",{cls:"pg-mini-val",txt:String(r[0])}));
        s.appendChild(el("div",{cls:"pg-mini-lbl",txt:r[1]}));
        ms.appendChild(s);
      });
      card.appendChild(ms);

      // Best/worst session + recency
      var metaRow=el("div",{cls:"pg-subj-meta-row"});
      metaRow.appendChild(el("span",{txt:"Best "+st.bestSession.pct+"% · Worst "+st.worstSession.pct+"%"}));
      var recencyTxt = st.daysSince===0 ? "Practiced today" :
                        st.daysSince===1 ? "Practiced yesterday" :
                        "Last practiced "+st.daysSince+"d ago";
      metaRow.appendChild(el("span",{txt:recencyTxt}));
      card.appendChild(metaRow);

      // Momentum badge (only once there's enough history to say something meaningful)
      if(st.sessions>=2){
        var momentumTxt = st.momentum==="improving" ? "📈 Improving — keep it up!" :
                           st.momentum==="declining" ? "📉 Slipping — revisit this soon" :
                           "➖ Steady — try to push higher";
        card.appendChild(el("div",{cls:"pg-momentum-badge "+st.momentum,txt:momentumTxt}));
      } else if(st.avg<50){
        card.appendChild(el("div",{cls:"pg-badge weak",txt:"⚠️ Needs more practice"}));
      } else if(st.avg>=80){
        card.appendChild(el("div",{cls:"pg-badge strong",txt:"⭐ Strong start!"}));
      }

      list.appendChild(card);
    });
    wrap.appendChild(list);
  }

  // ── Recent Sessions ───────────────────────────────────
  var recentAll=[];
  SUBJ.forEach(function(s){
    var h=(Sv.get("qz_"+s)||{h:[]}).h||[];
    h.forEach(function(e){recentAll.push({s:s,date:e.date,pct:e.pct,correct:e.correct,total:e.total});});
  });
  recentAll.sort(function(a,b){return b.date>a.date?1:-1;});
  if(recentAll.length){
    wrap.appendChild(el("div",{cls:"pg-section-label",txt:"Recent Sessions"}));
    var rbox=el("div",{cls:"pg-recent-box"});
    recentAll.slice(0,8).forEach(function(e){
      var row=el("div",{cls:"pg-session-row"});
      row.appendChild(el("span",{css:{fontSize:"1.1rem",flexShrink:"0"},txt:ICON[e.s]}));
      var ri=el("div",{cls:"pg-session-info"});
      ri.appendChild(el("div",{cls:"pg-session-name",txt:e.s}));
      ri.appendChild(el("div",{cls:"pg-session-meta",txt:e.date+" · "+e.correct+"/"+e.total+" correct"}));
      row.appendChild(ri);
      var good=e.pct>=60;
      row.appendChild(el("span",{
        cls:"pg-pct-badge",
        css:{background:good?"rgba(74,222,128,.12)":"rgba(248,113,113,.1)",color:good?"#4ade80":"#f87171"},
        txt:e.pct+"%"
      }));
      rbox.appendChild(row);
    });
    wrap.appendChild(rbox);
  }

  // ── Actions ───────────────────────────────────────────
  var ar=el("div",{cls:"pg-action-row"});
  ar.appendChild(el("button",{cls:"btn btnp",onclick:function(){
    var text="📊 My StudyLab Progress\n\n📝 "+totalAttempted+" questions attempted\n🎯 "+overallAcc+"% overall accuracy\n🔥 "+streak.count+" day streak\n📚 "+totalSessions+" quiz sessions\n\n🌐 https://studylab-inky.vercel.app";
    if(navigator.share){navigator.share({title:"My StudyLab Progress",text:text});}
    else{navigator.clipboard.writeText(text).then(function(){toast("Stats copied! Share it 🚀");});}
  }},["📱 Share Progress"]));
  ar.appendChild(el("button",{cls:"btn btng",onclick:function(){
    var exportData={exportDate:new Date().toISOString(),stats:{totalAttempted,totalCorrect,overallAccuracy:overallAcc,totalSessions,streak:streak.count},subjects:{},recentSessions:recentAll};
    SUBJ.forEach(function(s){exportData.subjects[s]=Sv.get("qz_"+s)||{best:null,att:0,h:[]};});
    var blob=new Blob([JSON.stringify(exportData,null,2)],{type:"application/json"});
    var url=URL.createObjectURL(blob);
    var a=document.createElement("a");a.href=url;a.download="studylab_progress_"+new Date().toISOString().slice(0,10)+".json";a.click();URL.revokeObjectURL(url);
    toast("Progress exported! 💾");
  }},["💾 Export Data"]));
  wrap.appendChild(ar);

  // ── Empty State ───────────────────────────────────────
  if(totalSessions===0){
    var empty=el("div",{cls:"pg-empty"});
    empty.appendChild(el("div",{css:{fontSize:"2.5rem",marginBottom:"12px"},txt:"📚"}));
    empty.appendChild(el("div",{css:{fontSize:"1rem",fontWeight:"700",marginBottom:"8px"},txt:"No quiz sessions yet!"}));
    empty.appendChild(el("div",{css:{fontSize:".82rem",color:"var(--muted)",marginBottom:"20px"},txt:"Complete your first quiz to see your progress here"}));
    empty.appendChild(el("button",{cls:"btn btnp",onclick:function(){go("home");}},["🎯 Start a Quiz"]));
    wrap.appendChild(empty);
  }

  return w;
}