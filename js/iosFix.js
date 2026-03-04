(() => {
  // iOS detection (covers Safari + all iOS browsers, which are WebKit-based)
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!isIOS) return;
 
  document.documentElement.classList.add("ios-webkit");
 
  const root = document.documentElement;
  const vv = window.visualViewport;
 
  let raf = 0;
 
  function update() {
    raf = 0;
 
    // Fallbacks
    const innerH = window.innerHeight || 0;
 
    // visualViewport is the visible area excluding browser UI (when supported)
    const vvH = vv?.height ?? innerH;
    const vvTop = vv?.offsetTop ?? 0;
 
    // Layout viewport height is innerHeight in iOS Safari
    // The difference indicates how much browser UI is currently taking space.
    // Also account for offsetTop when the URL bar collapses/expands.
    const bottomUI = Math.max(0, Math.round(innerH - (vvH + vvTop)));
 
    // Set CSS vars (px values)
    root.style.setProperty("--vvh", `${Math.round(vvH)}px`);
    root.style.setProperty("--bottom-ui", `${bottomUI}px`);
  }
 
  function scheduleUpdate() {
    if (raf) return;
    raf = requestAnimationFrame(update);
  }
 
  // Initial
  update();
 
  // Update on events that change toolbar / viewport
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("orientationchange", scheduleUpdate, { passive: true });
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
 
  if (vv) {
    vv.addEventListener("resize", scheduleUpdate, { passive: true });
    vv.addEventListener("scroll", scheduleUpdate, { passive: true }); // fires when bars expand/collapse
  }
})();