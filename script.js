const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isLocal = ["", "localhost", "127.0.0.1"].includes(location.hostname);
if (!isLocal) root.classList.add("live");

// ---------- Theme toggle (dark by default) ----------
document.querySelector(".theme-btn").addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Mobile menu ----------
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.getElementById("nav-links");
menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// ---------- Nav background + scroll progress ----------
const nav = document.querySelector(".nav");
const bar = document.querySelector(".progress");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  nav.classList.toggle("scrolled", scrollY > 10);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Marquee: duplicate the list so it loops seamlessly ----------
const track = document.querySelector(".marquee-track");
if (track) {
  const clone = track.firstElementChild.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  track.appendChild(clone);
}

// ---------- Images ----------
// Each image tries data-src first, then data-remote (another local file) if set.
// If neither loads, the soft gradient placeholder behind it stays visible.
function loadImages(scope = document) {
  scope.querySelectorAll("img[data-src]:not([src])").forEach((img) => {
    const sources = [img.dataset.src, img.dataset.remote].filter(Boolean);
    const holder = img.parentElement;
    let i = 0;
    img.addEventListener("load", () => {
      img.classList.add("is-loaded");
      holder.classList.add("loaded");
    });
    img.addEventListener("error", () => {
      i++;
      if (i < sources.length) img.src = sources[i];
      else img.remove();
    });
    img.src = sources[0];
  });
}

// ---------- Projects: category tabs + cards (data in projects.js) ----------
const projTrack = document.getElementById("proj-track");
const projTabs = document.getElementById("proj-tabs");

function projectCard(p) {
  const cat = CATEGORIES.find((c) => c.id === p.category);
  const a = document.createElement("a");
  a.className = "pcard";
  a.href = `project.html?p=${p.slug}`;
  a.innerHTML = `
    <figure class="cover">
      <span class="chip">${cat ? cat.label : ""}</span>
      ${p.cover ? `<img data-src="${p.cover}" alt="" />` : ""}
      ${p.coverVideo ? `<video class="cover-vid" src="${p.coverVideo}" muted autoplay loop playsinline preload="auto" aria-hidden="true"></video>` : ""}
      <div class="ph art ${p.art || "a1"} show"></div>
    </figure>
    <div class="p-body">
      <p class="p-meta">${p.meta}</p>
      <h3>${p.title}</h3>
      <p>${p.short}</p>
      <span class="arrow">View project →</span>
    </div>`;
  return a;
}

function showCategory(id) {
  projTabs.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.cat === id)));
  const list = id === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === id);
  projTrack.replaceChildren(...list.map(projectCard));
  projTrack.scrollLeft = 0;
  loadImages(projTrack);
  projTrack.dispatchEvent(new Event("carousel:refresh"));
}

if (projTrack && window.PROJECTS) {
  const tabs = [{ id: "all", label: "All" }, ...CATEGORIES];
  tabs.forEach((c) => {
    const count = c.id === "all" ? PROJECTS.length : PROJECTS.filter((p) => p.category === c.id).length;
    if (!count) return;
    const t = document.createElement("button");
    t.className = "tab";
    t.role = "tab";
    t.dataset.cat = c.id;
    t.innerHTML = `${c.label}<span class="n">${count}</span>`;
    t.addEventListener("click", () => showCategory(c.id));
    projTabs.appendChild(t);
  });
  // Open on a category from the URL, e.g. index.html?cat=analytics#work
  const startCat = new URLSearchParams(location.search).get("cat");
  showCategory(tabs.some((t) => t.id === startCat) ? startCat : "all");
}

loadImages();

// ---------- Carousels (experience + projects) ----------
// Buttons point at their carousel with data-target; dots with data-for.
document.querySelectorAll(".carousel").forEach((track) => {
  const prevBtn = document.querySelector(`.xp-btn[data-target="${track.id}"][data-dir="-1"]`);
  const nextBtn = document.querySelector(`.xp-btn[data-target="${track.id}"][data-dir="1"]`);
  const dotsBox = document.querySelector(`.dots[data-for="${track.id}"]`);
  const step = () => {
    const first = track.firstElementChild;
    return first ? first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || 24) : 1;
  };
  let dots = [];

  function buildDots() {
    if (!dotsBox) return;
    dotsBox.replaceChildren();
    // one dot per "page" position the carousel can stop at
    const positions = Math.max(1, Math.round((track.scrollWidth - track.clientWidth) / step()) + 1);
    dots = Array.from({ length: positions }, (_, i) => {
      const d = document.createElement("button");
      d.setAttribute("aria-label", `Go to item ${i + 1}`);
      d.addEventListener("click", () => track.scrollTo({ left: i * step() }));
      dotsBox.appendChild(d);
      return d;
    });
    dotsBox.hidden = positions < 2;
  }

  function update() {
    const i = Math.round(track.scrollLeft / step());
    dots.forEach((d, n) => d.classList.toggle("on", n === i));
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 2;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  }
  const refresh = () => { buildDots(); update(); };

  track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  track.addEventListener("carousel:refresh", () => requestAnimationFrame(refresh));
  addEventListener("resize", refresh);
  refresh();

  [prevBtn, nextBtn].forEach((b) =>
    b?.addEventListener("click", () => track.scrollBy({ left: Number(b.dataset.dir) * step() }))
  );
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); track.scrollBy({ left: step() }); }
    if (e.key === "ArrowLeft") { e.preventDefault(); track.scrollBy({ left: -step() }); }
  });

  // Click-and-drag on desktop (touch devices swipe natively)
  let startX = 0, startLeft = 0, down = false, moved = false;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
  });
  track.addEventListener("dragstart", (e) => e.preventDefault());
  addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4 && !moved) { moved = true; track.classList.add("dragging"); }
    if (moved) track.scrollLeft = startLeft - dx;
  });
  addEventListener("pointerup", () => {
    if (!down) return;
    down = false;
    if (!moved) return;
    track.classList.remove("dragging");
    track.scrollTo({ left: Math.round(track.scrollLeft / step()) * step() });
  });
  // A drag shouldn't count as a click on a project card
  track.addEventListener("click", (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
});

// ---------- Lightbox ----------
const lb = document.getElementById("lightbox");
const lbImg = lb.querySelector("img");
const lbCap = lb.querySelector(".lb-cap");
document.addEventListener("click", (e) => {
  const img = e.target.closest("img.zoomable.is-loaded");
  if (!img) return;
  lbImg.src = img.currentSrc || img.src;
  lbImg.alt = img.alt;
  const cap = img.closest("figure, article")?.querySelector("figcaption, h3");
  lbCap.textContent = cap ? cap.textContent : img.alt;
  lb.hidden = false;
});
const closeLb = () => { lb.hidden = true; lbImg.removeAttribute("src"); };
lb.addEventListener("click", (e) => { if (e.target !== lbImg) closeLb(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLb(); });

// ---------- Reveal on scroll (staggered) ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    let delay = 0;
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.style.transitionDelay = `${delay}ms`;
      delay += 90;
      e.target.classList.add("in");
      revealObserver.unobserve(e.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Active nav link ----------
const sectionObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.querySelectorAll("a").forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)
    );
  }),
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

// ---------- Count-up numbers ----------
function countUp(el) {
  const to = Number(el.dataset.to);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = to + suffix; return; }
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / 1400, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3))) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const statObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { countUp(e.target); statObserver.unobserve(e.target); }
  }),
  { threshold: 0.6 }
);
document.querySelectorAll(".count").forEach((el) => statObserver.observe(el));

// ---------- Copy email ----------
const copyBtn = document.querySelector(".copy");
if (copyBtn) {
  const label = copyBtn.querySelector(".copy-label");
  const email = copyBtn.dataset.email;
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      label.textContent = "Copied to clipboard ✓";
      copyBtn.classList.add("copied");
      setTimeout(() => { label.textContent = email; copyBtn.classList.remove("copied"); }, 2000);
    } catch (e) {
      location.href = "mailto:" + email;
    }
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
