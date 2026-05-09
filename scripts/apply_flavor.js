(function () {
  function apply() {
    const b = getFlavorBranding();
    const isAdmin =
      /admin\.html$/i.test(location.pathname) ||
      location.pathname.endsWith("/admin");
    const isReportsPage = location.pathname.includes("reports.html");

    if (!isReportsPage) {
      document.title = isAdmin ? b.adminTitle : b.title;
    }

    const apple = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (apple) apple.setAttribute("content", b.shortName);

    const banner = document.querySelector(".banner");
    if (banner) banner.src = b.bannerSrc;

    const base = b.faviconBase.replace(/\/$/, "");
    const pairs = [
      ['link[rel="icon"][type="image/png"]', `${base}/favicon-96x96.png`],
      ['link[rel="icon"][type="image/svg+xml"]', `${base}/favicon.svg`],
      ['link[rel="shortcut icon"]', `${base}/favicon.ico`],
      ['link[rel="apple-touch-icon"]', `${base}/apple-touch-icon.png`],
      ['link[rel="manifest"]', b.manifestHref],
    ];
    for (const [sel, href] of pairs) {
      const el = document.querySelector(sel);
      if (el) el.setAttribute("href", href);
    }

    if (isAdmin) {
      const h1 = document.querySelector("body h1");
      if (h1) h1.textContent = b.adminHeading;
    }

    const flavor = getActiveFlavor();
    window.__FLAVOR_HOME__ = `/${flavor}/`;
    const navHome = document.getElementById("nav-home");
    if (navHome) navHome.setAttribute("href", window.__FLAVOR_HOME__);

    const copyEl = document.getElementById("site-copyright");
    if (copyEl && typeof COPYRIGHT_OWNER === "string") {
      const y = "2023 - " + new Date().getFullYear();
      copyEl.textContent = `© ${y} ${COPYRIGHT_OWNER}. כל הזכויות שמורות.`;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
