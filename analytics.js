(function () {
  "use strict";

  const config = window.ASH_ANALYTICS_CONFIG || {};
  const token = String(config.cloudflareBeaconToken || "").trim();

  // Keep analytics off until the site owner explicitly configures a beacon token.
  if (!token || token.length > 256) return;
  if (document.querySelector('script[data-ash-cloudflare-beacon="true"]')) return;

  const script = document.createElement("script");
  script.defer = true;
  script.src = "https://static.cloudflareinsights.com/beacon.min.js";
  script.crossOrigin = "anonymous";
  script.setAttribute("data-cf-beacon", JSON.stringify({ token }));
  script.setAttribute("data-ash-cloudflare-beacon", "true");
  document.head.appendChild(script);
})();
