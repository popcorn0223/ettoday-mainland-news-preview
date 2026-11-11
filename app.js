(function () {
  "use strict";

  const data = window.DEMO_DATA;
  const state = { route: "search", entry: null, tab: "background", leftRoster: "r2012", rightRoster: "r2022" };
  const byId = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  const normalize = (value) => String(value ?? "").toLocaleLowerCase("zh-Hant-TW").replace(/[\s·・,，、()（）]/g, "");

  function toast(message) {
    const element = byId("toast");
    element.textContent = message;
    element.classList.add("show");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => element.classList.remove("show"), 2400);
  }

  function setRoute(route, updateHash = true) {
    if (!document.querySelector(`[data-view="${route}"]`)) route = "search";
    state.route = route;
    document.querySelectorAll("[data-view]").forEach((view) => {
      const active = view.dataset.view === route;
      view.hidden = !active;
      view.classList.toggle("active", active);
    });
    document.querySelectorAll(".nav-button").forEach((button) => {
      const active = button.dataset.route === route;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    byId("main-nav").classList.remove("open");
    document.querySelector(".menu-button").setAttribute("aria-expanded", "false");
    if (updateHash) history.replaceState(null, "", `#${route}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function matches(entry, query) {
    if (!query) return true;
    const haystack = [entry.canonicalName, entry.officialName, entry.type, entry.summary, ...entry.aliases].map(normalize).join("|");
    return haystack.includes(normalize(query));
  }

  function renderResults(query = "") {
    const results = data.entries.filter((entry) => matches(entry, query));
    byId("search-summary").innerHTML = `<h2>${query ? `「${escapeHtml(query)}」搜尋結果` : "公開示範條目"}</h2><span>${results.length} 筆資料</span>`;
    byId("search-results").innerHTML = results.map((entry, index) => `
      <button type="button" class="result-card" data-entry-id="${escapeHtml(entry.id)}">
        <span class="type-code">${String(index + 1).padStart(2, "0")}</span>
        <span><h3>${escapeHtml(entry.canonicalName)}</h3><p>${escapeHtml(entry.summary)}</p></span>
        <span class="result-meta"><span class="status">${escapeHtml(entry.status)}</span><span>查看資料 →</span></span>
      </button>`).join("");
    byId("empty-search").hidden = results.length !== 0;
    if (!results.some((entry) => entry.id === state.entry?.id)) {
      state.entry = null;
      byId("entry-detail").hidden = true;
    }
  }

  function sourceCards(sources) {
    return `<div class="source-grid">${sources.map((source) => `
      <article class="source-card">
        <h4>${escapeHtml(source.title)}</h4>
        <p>${escapeHtml(source.publisher)} · ${escapeHtml(source.date)}</p>
        <p>${escapeHtml(source.note)}</p>
        <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">開啟公開來源 ↗</a>
      </article>`).join("")}</div>`;
  }

  function definitionPanel(entry) {
    const card = (title, content) => `<article class="definition-card"><h4>${title}</h4>${content ? `<p>${escapeHtml(content)}</p>` : '<div class="missing-block">這一層內容尚未建立，系統不會自行補寫。</div>'}</article>`;
    return `<div class="definition-grid">${card("一般讀者版", entry.definitionPlain)}${card("專業詳細版", entry.definitionDetailed)}</div>`;
  }

  function timelinePanel(entry) {
    if (!entry.timeline.length) return '<div class="missing-block">歷史年表尚未建立，系統不會自行補寫。</div>';
    return `<div class="timeline">${entry.timeline.map((node) => `
      <article class="timeline-item"><time>${escapeHtml(node.date)}</time><h4>${escapeHtml(node.title)}</h4><p>${escapeHtml(node.detail)}</p></article>`).join("")}</div>`;
  }

  function rosterOptions(rosters, selected) {
    return rosters.map((roster) => `<option value="${escapeHtml(roster.id)}" ${roster.id === selected ? "selected" : ""}>${escapeHtml(roster.label)}｜${escapeHtml(roster.date)}</option>`).join("");
  }

  function rosterCard(roster, other) {
    const otherNames = new Set(other.members);
    return `<article class="roster-card"><header><div><h4>${escapeHtml(roster.label)}</h4><small>${escapeHtml(roster.date)} · ${escapeHtml(roster.basis)}</small></div><strong>${roster.members.length} 人</strong></header><div class="name-cloud">${roster.members.map((name) => `<span class="name-chip ${otherNames.has(name) ? "" : "diff"}">${escapeHtml(name)}</span>`).join("")}</div></article>`;
  }

  function rosterPanel(entry) {
    if (entry.rosters.length < 2) return '<div class="missing-block">可比較的歷史名單尚未建立。</div>';
    let left = entry.rosters.find((item) => item.id === state.leftRoster) || entry.rosters[0];
    let right = entry.rosters.find((item) => item.id === state.rightRoster) || entry.rosters[1];
    if (left.id === right.id) right = entry.rosters.find((item) => item.id !== left.id) || right;
    state.leftRoster = left.id;
    state.rightRoster = right.id;
    const shared = left.members.filter((name) => right.members.includes(name));
    return `
      <div class="compare-note"><strong>口徑提醒：</strong>原始當選名單與指定日期現況不能當成同一種年度統計。紅色姓名代表只出現在該側快照，不等於異動發生日期。</div>
      <div class="compare-controls">
        <label>左側快照<select id="left-roster">${rosterOptions(entry.rosters, left.id)}</select></label><span>VS</span>
        <label>右側快照<select id="right-roster">${rosterOptions(entry.rosters, right.id)}</select></label>
      </div>
      <div class="roster-grid">${rosterCard(left, right)}${rosterCard(right, left)}</div>
      <p class="compare-summary">兩份快照共有 ${shared.length} 個相同姓名；左側獨有 ${left.members.length - shared.length} 人，右側獨有 ${right.members.length - shared.length} 人。</p>`;
  }

  function activePanel(entry) {
    if (state.tab === "background") return `<p class="copy-body">${escapeHtml(entry.background) || "背景說明尚未建立。"}</p>`;
    if (state.tab === "definition") return definitionPanel(entry);
    if (state.tab === "timeline") return timelinePanel(entry);
    if (state.tab === "rosters") return rosterPanel(entry);
    return sourceCards(entry.sources);
  }

  function renderDetail(entry) {
    state.entry = entry;
    const labels = { background: "背景說明", definition: "名詞解釋", timeline: "歷史年表", rosters: "名單比較", sources: "資料來源" };
    const detail = byId("entry-detail");
    detail.hidden = false;
    detail.innerHTML = `
      <header class="detail-hero"><div class="detail-hero-row"><div><p class="eyebrow">${escapeHtml(entry.type)}</p><h2>${escapeHtml(entry.canonicalName)}</h2><p>${escapeHtml(entry.officialName)}</p></div><dl class="detail-meta"><div><dt>資料狀態</dt><dd>${escapeHtml(entry.status)}</dd></div><div><dt>查核日期</dt><dd>${escapeHtml(data.reviewedAsOf)}</dd></div></dl></div></header>
      <nav class="detail-tabs" aria-label="條目內容">${Object.entries(labels).map(([key, label]) => `<button type="button" data-detail-tab="${key}" class="${state.tab === key ? "active" : ""}">${label}</button>`).join("")}</nav>
      <section class="detail-panel"><div class="panel-head"><h3>${labels[state.tab]}</h3><button type="button" class="button outline" data-copy-panel>複製本段</button></div>${activePanel(entry)}</section>`;
    bindDetailControls();
  }

  function detailPlainText() {
    const entry = state.entry;
    if (!entry) return "";
    if (state.tab === "background") return `【${entry.canonicalName}｜背景說明】\n${entry.background || "尚未建立"}`;
    if (state.tab === "definition") return `【${entry.canonicalName}｜名詞解釋】\n一般讀者版：${entry.definitionPlain || "尚未建立"}\n\n專業詳細版：${entry.definitionDetailed || "尚未建立"}`;
    if (state.tab === "timeline") return `【${entry.canonicalName}｜歷史年表】\n${entry.timeline.map((node) => `${node.date}｜${node.title}：${node.detail}`).join("\n") || "尚未建立"}`;
    if (state.tab === "rosters") return `【${entry.canonicalName}｜名單比較】\n請至試閱網站查看互動比較；不同快照口徑不得混用。`;
    return `【${entry.canonicalName}｜資料來源】\n${entry.sources.map((source) => `${source.title}｜${source.url}`).join("\n")}`;
  }

  async function copyText(text, successMessage) {
    try {
      await navigator.clipboard.writeText(text);
      toast(successMessage);
    } catch {
      const box = document.createElement("textarea");
      box.value = text;
      box.style.position = "fixed";
      box.style.left = "-9999px";
      document.body.appendChild(box);
      box.select();
      const copied = document.execCommand("copy");
      box.remove();
      toast(copied ? successMessage : "請手動選取內容後按 Command+C。 ");
    }
  }

  function bindDetailControls() {
    document.querySelectorAll("[data-detail-tab]").forEach((button) => button.addEventListener("click", () => {
      state.tab = button.dataset.detailTab;
      renderDetail(state.entry);
    }));
    const left = byId("left-roster");
    const right = byId("right-roster");
    if (left) left.addEventListener("change", () => { state.leftRoster = left.value; renderDetail(state.entry); });
    if (right) right.addEventListener("change", () => { state.rightRoster = right.value; renderDetail(state.entry); });
    document.querySelector("[data-copy-panel]")?.addEventListener("click", () => copyText(detailPlainText(), "已複製本段內容。"));
  }

  function feedbackText() {
    const form = byId("feedback-form");
    const values = new FormData(form);
    const priorities = values.getAll("priority");
    return [
      "【ETtoday 大陸新聞智慧資料台｜同事試閱回饋】",
      `填寫時間：${new Intl.DateTimeFormat("zh-TW", { dateStyle: "medium", timeStyle: "short" }).format(new Date())}`,
      `角色：${values.get("role") || "未填寫"}`,
      `稱呼：${String(values.get("name") || "").trim() || "未填寫"}`,
      `優先功能：${priorities.length ? priorities.join("、") : "未選擇"}`,
      "",
      "最常查詢／使用情境：",
      String(values.get("useCase") || "").trim() || "未填寫",
      "",
      "修改建議：",
      String(values.get("suggestion") || "").trim() || "未填寫"
    ].join("\n");
  }

  function updateFeedbackPreview() {
    byId("feedback-preview").textContent = feedbackText();
  }

  document.addEventListener("click", (event) => {
    const routeButton = event.target.closest("[data-route]");
    if (routeButton) setRoute(routeButton.dataset.route);
    const entryButton = event.target.closest("[data-entry-id]");
    if (entryButton) {
      state.tab = "background";
      renderDetail(data.entries.find((entry) => entry.id === entryButton.dataset.entryId));
      byId("entry-detail").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  byId("search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    renderResults(byId("search-input").value.trim());
  });
  document.querySelectorAll("[data-query]").forEach((button) => button.addEventListener("click", () => {
    byId("search-input").value = button.dataset.query;
    renderResults(button.dataset.query);
  }));
  document.querySelector(".menu-button").addEventListener("click", (event) => {
    const open = byId("main-nav").classList.toggle("open");
    event.currentTarget.setAttribute("aria-expanded", String(open));
  });
  byId("feedback-form").addEventListener("input", updateFeedbackPreview);
  byId("feedback-form").addEventListener("change", updateFeedbackPreview);
  byId("feedback-form").addEventListener("submit", (event) => {
    event.preventDefault();
    copyText(feedbackText(), "回饋內容已複製，可貼到訊息或 Email。 ");
  });
  window.addEventListener("hashchange", () => setRoute(location.hash.slice(1) || "search", false));

  renderResults();
  updateFeedbackPreview();
  setRoute(location.hash.slice(1) || "search", false);
})();
