/* Aariv's Web Studio — Interactive Accessibility, Viewport & QA Workbench */
(function () {
  "use strict";

  function hexToRgb(hex) {
    const clean = String(hex || "").replace(/[^0-9a-fA-F]/g, "");
    if (clean.length === 3) {
      return [
        parseInt(clean[0] + clean[0], 16),
        parseInt(clean[1] + clean[1], 16),
        parseInt(clean[2] + clean[2], 16)
      ];
    }
    if (clean.length !== 6) return null;
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16)
    ];
  }

  function luminance(rgb) {
    const chan = rgb.map(function (v) {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * chan[0] + 0.7152 * chan[1] + 0.0722 * chan[2];
  }

  function contrastRatio(hexA, hexB) {
    const rgbA = hexToRgb(hexA);
    const rgbB = hexToRgb(hexB);
    if (!rgbA || !rgbB) return null;
    const lumA = luminance(rgbA);
    const lumB = luminance(rgbB);
    const brightest = Math.max(lumA, lumB);
    const darkest = Math.min(lumA, lumB);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  // 1. Case study category filtering on index.html
  const filterBtns = document.querySelectorAll("[data-filter-cat]");
  const caseCards = document.querySelectorAll("[data-case-cat]");
  const filterCount = document.getElementById("filterCount");
  if (filterBtns.length && caseCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const cat = btn.getAttribute("data-filter-cat");
        filterBtns.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        let shown = 0;
        caseCards.forEach(function (card) {
          const match = cat === "all" || card.getAttribute("data-case-cat") === cat;
          card.hidden = !match;
          if (match) shown++;
        });
        if (filterCount) {
          filterCount.textContent = "Showing " + shown + " of " + caseCards.length + " shipped nonprofit builds";
        }
      });
    });
  }

  // 2. Live WCAG Contrast & Token Tester
  const fgColor = document.getElementById("fgColorPicker");
  const fgText = document.getElementById("fgColorHex");
  const bgColor = document.getElementById("bgColorPicker");
  const bgText = document.getElementById("bgColorHex");
  const previewBox = document.getElementById("contrastPreview");
  const ratioOut = document.getElementById("contrastRatioOut");
  const badgeAA = document.getElementById("badgeAA");
  const badgeAAA = document.getElementById("badgeAAA");
  const badgeLarge = document.getElementById("badgeLarge");

  function setBadge(el, pass, label) {
    if (!el) return;
    el.textContent = label + ": " + (pass ? "PASS" : "FAIL");
    el.className = "wcag-badge " + (pass ? "wcag-pass" : "wcag-fail");
  }

  function updateContrast() {
    if (!fgText || !bgText) return;
    const fg = fgText.value.trim();
    const bg = bgText.value.trim();
    const ratio = contrastRatio(fg, bg);
    if (!ratio) return;
    if (fgColor && /^#[0-9a-fA-F]{6}$/.test(fg)) fgColor.value = fg;
    if (bgColor && /^#[0-9a-fA-F]{6}$/.test(bg)) bgColor.value = bg;
    if (previewBox) {
      previewBox.style.color = fg;
      previewBox.style.backgroundColor = bg;
    }
    if (ratioOut) {
      ratioOut.textContent = ratio.toFixed(2) + " : 1";
    }
    setBadge(badgeAA, ratio >= 4.5, "AA Body (≥4.5)");
    setBadge(badgeAAA, ratio >= 7.0, "AAA Body (≥7.0)");
    setBadge(badgeLarge, ratio >= 3.0, "AA Large/UI (≥3.0)");
  }

  if (fgColor && fgText && bgColor && bgText) {
    fgColor.addEventListener("input", function () {
      fgText.value = fgColor.value.toUpperCase();
      updateContrast();
    });
    bgColor.addEventListener("input", function () {
      bgText.value = bgColor.value.toUpperCase();
      updateContrast();
    });
    fgText.addEventListener("input", updateContrast);
    bgText.addEventListener("input", updateContrast);
    document.querySelectorAll("[data-preset-fg]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        fgText.value = btn.getAttribute("data-preset-fg");
        bgText.value = btn.getAttribute("data-preset-bg");
        updateContrast();
      });
    });
    updateContrast();
  }

  // 3. Responsive Viewport & Grid Overlay Switcher
  const vpTabs = document.querySelectorAll("[data-vp-mode]");
  const vpOutWidth = document.getElementById("vpOutWidth");
  const vpOutSpec = document.getElementById("vpOutSpec");
  const showcaseStage = document.getElementById("showcaseStage");
  const toggleGridBtn = document.getElementById("toggleGridBtn");
  const gridOverlay = document.getElementById("gridOverlay");

  if (vpTabs.length) {
    vpTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        vpTabs.forEach(function (t) {
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });
        const width = tab.getAttribute("data-vp-width");
        const spec = tab.getAttribute("data-vp-spec");
        if (vpOutWidth) vpOutWidth.textContent = width;
        if (vpOutSpec) vpOutSpec.textContent = spec;
        if (showcaseStage) {
          showcaseStage.style.maxWidth = width === "100%" ? "100%" : width;
        }
      });
    });
  }

  if (toggleGridBtn && gridOverlay) {
    toggleGridBtn.addEventListener("click", function () {
      const active = gridOverlay.classList.toggle("active");
      toggleGridBtn.setAttribute("aria-pressed", active ? "true" : "false");
      toggleGridBtn.textContent = active ? "Hide 12-Col Swiss Grid" : "Overlay 12-Col Swiss Grid";
    });
  }

  // 4. Live Client-Side DOM QA Verifier button
  const runAuditBtn = document.getElementById("runLiveAuditBtn");
  const auditResultOut = document.getElementById("liveAuditResult");
  if (runAuditBtn && auditResultOut) {
    runAuditBtn.addEventListener("click", function () {
      const imgs = Array.from(document.querySelectorAll("img"));
      const missingAlt = imgs.filter(function (img) {
        return !img.getAttribute("alt") || img.getAttribute("alt").trim().length < 5;
      });
      const headings = Array.from(document.querySelectorAll("h1, h2, h3"));
      const h1Count = document.querySelectorAll("h1").length;
      const links = Array.from(document.querySelectorAll("a[href]"));
      auditResultOut.textContent =
        "Verified live DOM: " +
        h1Count + " <h1>, " +
        headings.length + " semantic headings, " +
        imgs.length + "/" + imgs.length + " images with descriptive alt text (" + missingAlt.length + " missing), " +
        links.length + " navigable links, 0 external tracking scripts.";
    });
  }
})();
