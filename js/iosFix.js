(() => {
  // iOS detection (Safari + all iOS browsers are WebKit)
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
 
  if (!isIOS) return;
 
  const root = document.documentElement;
  root.classList.add("ios-webkit");
 
  const vv = window.visualViewport;
  let raf = 0;
 
  function update() {
    raf = 0;
 
    const innerH = window.innerHeight || 0;
 
    // visualViewport = visible area excluding browser UI (when supported)
    const vvH = vv ? vv.height : innerH;
    const vvTop = vv ? vv.offsetTop : 0;
 
    // Amount of browser UI taking up space at the bottom (px)
    const bottomUI = Math.max(0, Math.round(innerH - (vvH + vvTop)));
 
    root.style.setProperty("--vvh", `${Math.round(vvH)}px`);
    root.style.setProperty("--bottom-ui", `${bottomUI}px`);
  }
 
  function scheduleUpdate() {
    if (raf) return;
    raf = requestAnimationFrame(update);
  }
 
  // Initial + stabilize after layout
  update();
  requestAnimationFrame(update);
 
  // Updates on viewport/toolbars/keyboard changes
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("orientationchange", scheduleUpdate, { passive: true });
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("load", scheduleUpdate, { passive: true });
 
  if (vv) {
    vv.addEventListener("resize", scheduleUpdate, { passive: true });
    vv.addEventListener("scroll", scheduleUpdate, { passive: true }); // bar expand/collapse
  }
})();