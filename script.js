/* COP Alternativa V2.1 : JavaScript sans dépendance, aucun appel réseau. */
(function () {
  "use strict";

  var I18N = window.I18N || {};
  var CFG = window.SITE_CONFIG || {};
  var LANGS = ["es", "fr", "en", "it", "ar"];
  /* Logo du header par langue ; l'italien utilise le logo rond (pas de variante IT). */
  var LOGOS = { es: "logo-es-sm.jpg", fr: "logo-fr-sm.jpg", en: "logo-en-sm.jpg", ar: "logo-ar-sm.jpg", it: "logo-round-sm.jpg" };
  var DEFAULT = "es";
  var PAGE = document.body.getAttribute("data-page") || "home";
  var EVENT_START = new Date(CFG.eventStart || "2027-02-01T00:00:00+01:00");
  var EVENT_END = new Date(CFG.eventEnd || "2027-02-06T00:00:00+01:00");
  var current = DEFAULT;

  function t(key) {
    var d = I18N[current] || {};
    if (Object.prototype.hasOwnProperty.call(d, key)) return d[key];
    return (I18N[DEFAULT] || {})[key] || "";
  }

  /* ---------- Configuration (contact, hébergeur) ---------- */
  function hostInfo() {
    var h = (CFG.hosts || {})[CFG.host] || {};
    return { hostName: h.name || "", hostAddress: h.address || "", hostUrl: h.url || "" };
  }
  function formatDate(iso) {
    var d = new Date(iso + "T12:00:00");
    if (isNaN(d)) return iso;
    var loc = current === "ar" ? "ar" : current;
    try { return d.toLocaleDateString(loc, { year: "numeric", month: "long", day: "numeric" }); }
    catch (e) { return iso; }
  }
  function applyConfig() {
    var values = hostInfo();
    values.email = CFG.email;
    values.phone = CFG.phone;
    values.legalUpdated = CFG.legalUpdated ? formatDate(CFG.legalUpdated) : "";
    document.querySelectorAll("[data-config]").forEach(function (el) {
      var key = el.getAttribute("data-config");
      var val = values[key];
      if (!val) return;
      el.textContent = val;
      var hrefMode = el.getAttribute("data-config-href");
      if (hrefMode === "mailto") el.setAttribute("href", "mailto:" + val);
      if (hrefMode === "url") el.setAttribute("href", val);
      if (hrefMode === "tel") el.setAttribute("href", "tel:" + val.replace(/[^+\d]/g, ""));
      if (key === "legalUpdated") el.setAttribute("datetime", CFG.legalUpdated);
    });
  }

  /* ---------- Langue ---------- */
  function pickInitialLang() {
    var fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl && LANGS.indexOf(fromUrl) > -1) return fromUrl;
    try {
      var saved = localStorage.getItem("cop-lang");
      if (saved && LANGS.indexOf(saved) > -1) return saved;
    } catch (e) {}
    var nav = (navigator.language || "").slice(0, 2).toLowerCase();
    return LANGS.indexOf(nav) > -1 ? nav : DEFAULT;
  }

  /* Liens internes : conserver la langue d'une page à l'autre */
  function localizeLinks() {
    document.querySelectorAll('a[href$=".html"], a[href*=".html#"], a[href*=".html?"]').forEach(function (a) {
      var raw = a.getAttribute("href");
      if (/^[a-z]+:/i.test(raw)) return;
      var hash = "", path = raw;
      var i = path.indexOf("#");
      if (i > -1) { hash = path.slice(i); path = path.slice(0, i); }
      path = path.split("?")[0];
      a.setAttribute("href", path + "?lang=" + current + hash);
    });
  }

  function applyLang(lang) {
    current = LANGS.indexOf(lang) > -1 ? lang : DEFAULT;
    var root = document.documentElement;
    root.lang = current;
    root.dir = current === "ar" ? "rtl" : "ltr";
    document.title = t("_title." + PAGE);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });

    var logo = document.getElementById("brand-logo");
    if (logo) {
      logo.src = "assets/logos/" + (LOGOS[current] || "logo-round-sm.jpg");
      logo.alt = t("_logoAlt");
      logo.classList.toggle("is-round", current === "it");
    }

    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === current));
    });

    try { localStorage.setItem("cop-lang", current); } catch (e) {}
    var url = new URL(location.href);
    url.searchParams.set("lang", current);
    history.replaceState(null, "", url);

    applyConfig();
    localizeLinks();
    tick();
  }

  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.dataset.lang); });
  });

  /* ---------- Compte à rebours ---------- */
  function pad(n) { return String(n).padStart(2, "0"); }
  function tick() {
    var box = document.getElementById("countdown");
    if (!box) return;
    var now = new Date();
    if (now >= EVENT_START) {
      box.innerHTML = '<p class="cd-live">' + (now < EVENT_END ? t("cd.live") : t("dates")) + "</p>";
      return;
    }
    var diff = EVENT_START - now;
    var d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60;
    var set = function (k, v) { var el = box.querySelector('[data-cd="' + k + '"]'); if (el) el.textContent = v; };
    set("days", d); set("hours", pad(h)); set("minutes", pad(m));
  }
  if (document.getElementById("countdown")) setInterval(tick, 30000);

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav-principal");
  function closeNav() { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { closeNav(); toggle.focus(); }
    });
  }

  /* ---------- Accordéons : un seul panneau ouvert par groupe ----------
     (l'attribut HTML name="" le fait nativement ; ceci couvre les anciens navigateurs) */
  document.querySelectorAll("details[name]").forEach(function (det) {
    det.addEventListener("toggle", function () {
      if (!det.open) return;
      var group = det.getAttribute("name");
      document.querySelectorAll('details[name="' + group + '"]').forEach(function (other) {
        if (other !== det && other.open) other.open = false;
      });
    });
  });

  /* ---------- Sommaire de la documentation : section active ---------- */
  var toc = document.querySelector(".docs-toc");
  if (toc && "IntersectionObserver" in window) {
    var links = {};
    toc.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var visible = {};
    var setActive = function (id) {
      Object.keys(links).forEach(function (k) {
        if (k === id) links[k].setAttribute("aria-current", "true");
        else links[k].removeAttribute("aria-current");
      });
      var a = links[id];
      if (a && window.matchMedia("(max-width: 900px)").matches) {
        var ol = toc.querySelector("ol");
        ol.scrollTo({ left: a.parentNode.offsetLeft - 16, behavior: "smooth" });
      }
    };
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var ids = Object.keys(links);
      for (var i = 0; i < ids.length; i++) { if (visible[ids[i]]) { setActive(ids[i]); return; } }
    }, { rootMargin: "-140px 0px -55% 0px", threshold: 0 });
    Object.keys(links).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) obs.observe(sec);
    });
    toc.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var target = document.getElementById(a.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", location.pathname + location.search + "#" + target.id);
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      setActive(target.id);
    });
  }

  applyLang(pickInitialLang());
})();
