let currentScan = null;
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let activeTab = "pages";

$("scanBtn").addEventListener("click", runScan);
$("url").addEventListener("keydown", e => { if (e.key === "Enter") runScan(); });

async function runScan() {
  const url = $("url").value.trim();
  if (!url) return showMessage("Pehle website URL enter karein.");
  $("message").classList.add("hidden");
  $("results").classList.add("hidden");
  $("loading").classList.remove("hidden");
  $("scanBtn").disabled = true;
  try {
    const response = await fetch("/api/scrape", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({url, max_pages: Number($("maxPages").value)})
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Scraping failed.");
    currentScan = result;
    renderOverview(result);
    renderTab(activeTab);
    $("results").classList.remove("hidden");
    $("results").scrollIntoView({behavior:"smooth", block:"start"});
  } catch (err) {
    showMessage(err.message || "Unexpected error.");
  } finally {
    $("loading").classList.add("hidden");
    $("scanBtn").disabled = false;
  }
}
function showMessage(msg) { $("message").textContent = msg; $("message").classList.remove("hidden"); }
function renderOverview(r) {
  $("siteName").textContent = r.website.name || "Website results";
  $("siteDomain").textContent = r.website.domain;
  $("category").textContent = r.website.category;
  $("summary").textContent = r.website.summary || r.website.description || "No summary available.";
  $("aiStatus").textContent = r.website.ai_used ? `✦ AI classification · ${r.website.ai_confidence}` : "Rule-based category estimate";
  $("pagesCount").textContent = r.stats.pages;
  $("paragraphCount").textContent = r.stats.paragraphs;
  $("imageCount").textContent = r.stats.images;
  $("linkCount").textContent = r.stats.links;
  if (r.errors?.length) {
    $("errorsWrap").classList.remove("hidden");
    $("errorsList").innerHTML = r.errors.map(e => `<p><b>${esc(e.url)}</b> — ${esc(e.error)}</p>`).join("");
  } else $("errorsWrap").classList.add("hidden");
}
document.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active"); activeTab = btn.dataset.tab; renderTab(activeTab);
}));
function renderTab(tab) {
  if (!currentScan) return;
  let rows = [], title = "", subtitle = "";
  if (tab === "pages") {
    title = "Pages & extracted text"; subtitle = "Page titles, metadata and content overview";
    rows = currentScan.pages.map(p => `<div class="data-row"><b>${esc(p.title || p.url)}</b><a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${esc(p.url)}</a><p>${esc(p.description || p.text.slice(0,260))}</p><p>${Object.values(p.headings).flat().length} headings · ${p.paragraphs.length} paragraphs</p></div>`);
  } else if (tab === "products") {
    title = "Detected products"; subtitle = "Product information found in structured data or common page patterns";
    rows = currentScan.products.map(p => `<div class="data-row"><b>${esc(p.name || "Unnamed product")}</b><p>Price: ${esc(p.price || "Not found")} ${esc(p.currency)} · Rating: ${esc(p.rating || "Not found")} · Source: ${esc(p.source)}</p></div>`);
  } else if (tab === "images") {
    title = "Images"; subtitle = "Image references and alternative text";
    rows = currentScan.images.map(i => `<div class="data-row"><b>${esc(i.alt || "Image without alt text")}</b><a href="${esc(i.url)}" target="_blank" rel="noopener noreferrer">${esc(i.url)}</a></div>`);
  } else if (tab === "links") {
    title = "Links"; subtitle = "Links found across scanned pages";
    rows = currentScan.links.map(l => `<div class="data-row"><b>${esc(l.text || "Unlabelled link")}</b><a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.url)}</a></div>`);
  } else if (tab === "tables") {
    title = "HTML tables"; subtitle = "Rows extracted from tables";
    rows = currentScan.tables.map((t, i) => `<div class="data-row"><b>Table ${i+1} · ${esc(t.page)}</b><p>${t.rows.map(row => row.map(esc).join(" | ")).join("<br>")}</p></div>`);
  } else {
    title = "Website metadata"; subtitle = "Title, description, canonical URL and headings";
    rows = currentScan.pages.map(p => `<div class="data-row"><b>${esc(p.url)}</b><p><b>Title:</b> ${esc(p.title)}</p><p><b>Description:</b> ${esc(p.description)}</p><p><b>Canonical:</b> ${esc(p.canonical_url)}</p><p><b>Headings:</b> ${esc(Object.entries(p.headings).map(([k,v])=>k.toUpperCase()+": "+v.join(", ")).join(" · "))}</p></div>`);
  }
  $("panelTitle").textContent = title; $("panelSubtitle").textContent = subtitle;
  $("itemCount").textContent = `${rows.length} items`;
  $("dataContent").innerHTML = rows.length ? rows.join("") : '<div class="empty">Is category mein koi data detect nahi hua.</div>';
}
document.querySelectorAll(".export-btn").forEach(btn => btn.addEventListener("click", () => {
  if (!currentScan) return;
  window.location.href = `/download/${currentScan.scan_id}/${btn.dataset.format}`;
}));
