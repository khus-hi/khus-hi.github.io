// Renders project.html?p=<slug> from the data in projects.js
const root = document.documentElement;
document.querySelector(".theme-btn").addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});
document.getElementById("year").textContent = new Date().getFullYear();

const main = document.getElementById("project");
const slug = new URLSearchParams(location.search).get("p");
const i = PROJECTS.findIndex((p) => p.slug === slug);

if (i === -1) {
  main.innerHTML = `
    <section class="detail-empty">
      <h1>Project not found.</h1>
      <p class="sub">It may have moved. Have a look at all of them instead.</p>
      <div class="cta"><a class="btn primary" href="index.html#work">See all projects</a></div>
    </section>`;
} else {
  const p = PROJECTS[i];
  const cat = CATEGORIES.find((c) => c.id === p.category);
  const nav = PROJECTS.filter((q) => !q.hidden || q === p);
  const j = nav.indexOf(p);
  const prev = nav[(j - 1 + nav.length) % nav.length];
  const next = nav[(j + 1) % nav.length];
  const list = (items) => items.map((t) => `<li>${t}</li>`).join("");

  document.title = `${p.title} · Khushi Teli`;

  main.innerHTML = `
    <section class="d-hero">
      <div class="d-copy">
        <a class="chip-link" href="index.html?cat=${p.category}#work">${cat ? cat.label : "Project"}</a>
        <h1>${p.title}</h1>
        <p class="sub">${p.short}</p>
        <p class="d-meta">${p.meta} · ${p.date}</p>
        <div class="cta">
          ${p.github ? `
          <a class="btn primary" href="${p.github}" target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z"/></svg>
            View on GitHub
          </a>
          ` : ""}
          ${p.slides ? `<a class="btn${p.github ? "" : " primary"}" href="${p.slides}" target="_blank" rel="noopener">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/></svg>
            ${p.slidesLabel || "View presentation"}
          </a>` : ""}
          ${p.live ? `<a class="btn${p.github || p.slides ? "" : " primary"}" href="${p.live.url}" target="_blank" rel="noopener">${p.live.label} ↗</a>` : ""}
        </div>
      </div>
      <figure class="cover d-cover">
        ${p.cover ? `<img data-src="${p.cover}" alt="" />` : ""}
        ${p.coverVideo ? `<video class="cover-vid" src="${p.coverVideo}" muted autoplay loop playsinline preload="auto" aria-hidden="true"></video>` : ""}
        <div class="ph art ${p.art || "a1"} show"></div>
      </figure>
    </section>

    <section class="d-grid">
      <div class="d-block d-context">
        <h2>The context</h2>
        <p>${p.context}</p>
      </div>
      ${p.dashboards ? `<div class="d-block d-video d-dash">
        <h2>Interactive dashboards</h2>
        ${p.dashboards.length > 1 ? `<div class="dash-tabs" role="tablist">${p.dashboards.map((d, k) => `<button class="dash-tab" role="tab" data-k="${k}" aria-selected="${k === 0}">${d.title}</button>`).join("")}</div>` : ""}
        <div class="dash-frame"><iframe title="${p.dashboards[0].title}" loading="lazy" allowfullscreen></iframe></div>
        <p class="d-cap"><a class="dash-open" href="${p.dashboards[0].url}" target="_blank" rel="noopener">Open full screen on Tableau Public ↗</a></p>
      </div>` : ""}
      ${p.figure ? `<div class="d-block d-video d-figure">
        <h2>${p.figure.title || "Figure"}</h2>
        <img src="${p.figure.src}" alt="${p.figure.caption || ""}" loading="lazy" />
        ${p.figure.caption ? `<p class="d-cap">${p.figure.caption}</p>` : ""}
      </div>` : ""}
      ${p.video ? `<div class="d-block d-video">
        <h2>Demo video</h2>
        <video controls preload="metadata" playsinline poster="${p.video.poster || ""}" src="${p.video.src}"></video>
      </div>` : ""}
      <div class="d-block">
        <h2>What I did</h2>
        <ul class="d-list">${list(p.did)}</ul>
      </div>
      <div class="d-block d-results">
        <h2>Results</h2>
        <ul class="d-list">${list(p.results)}</ul>
      </div>
      <div class="d-block">
        <h2>Built with</h2>
        <div class="d-stack">${p.stack.map((t) => `<span>${t}</span>`).join("")}</div>
      </div>
    </section>

    <nav class="d-nav" aria-label="More projects">
      <a href="project.html?p=${prev.slug}"><span>← Previous</span>${prev.title}</a>
      <a href="project.html?p=${next.slug}" class="r"><span>Next →</span>${next.title}</a>
    </nav>`;

  main.querySelectorAll("img[data-src]").forEach((img) => {
    img.addEventListener("load", () => img.parentElement.classList.add("loaded"));
    img.src = img.dataset.src;
  });

  if (p.dashboards) setupDashboards(p.dashboards);
}

// Tableau Public dashboards are a fixed 1366x795, so on desktop the frame is
// scaled down to fit the column; phones get Tableau's own phone layout.
function setupDashboards(list) {
  const box = main.querySelector(".dash-frame");
  const frame = box.querySelector("iframe");
  const open = main.querySelector(".dash-open");
  const W = 1366, H = 795;
  let current = 0;
  const phone = () => box.clientWidth < 600;
  const src = (d) => `${d.url}?:embed=y&:showVizHome=no&:toolbar=yes&:device=${phone() ? "phone" : "desktop"}`;
  const fit = () => {
    if (phone()) {
      frame.style.cssText = "width:100%;height:1727px;transform:none";
      box.style.height = "auto";
    } else {
      const k = box.clientWidth / W;
      frame.style.cssText = `width:${W}px;height:${H}px;transform:scale(${k});transform-origin:0 0`;
      box.style.height = `${H * k}px`;
    }
  };
  const show = (k) => {
    current = k;
    frame.src = src(list[k]);
    frame.title = list[k].title;
    open.href = list[k].url;
    main.querySelectorAll(".dash-tab").forEach((t) => t.setAttribute("aria-selected", String(+t.dataset.k === k)));
    fit();
  };
  main.querySelectorAll(".dash-tab").forEach((t) => t.addEventListener("click", () => show(+t.dataset.k)));
  let wasPhone = phone();
  window.addEventListener("resize", () => {
    if (phone() !== wasPhone) { wasPhone = phone(); show(current); } else fit();
  });
  show(0);
}
