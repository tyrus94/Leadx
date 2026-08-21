/**
 * Drop this near the top of your Mini App's entry point (e.g. main.js / index.html <script>).
 * It compares the currently-loaded build against a small version.json file
 * (which you deploy fresh with every build) and force-reloads if they differ.
 *
 * Setup:
 * 1. Create /public/version.json in your project with: {"build": "REPLACE_ME"}
 * 2. On each deploy, update "build" to something unique (timestamp, git commit hash, etc.)
 *    - If using Vercel + a build script, you can auto-generate this at build time.
 * 3. Include this script early in your app's load sequence.
 */

(async function checkForUpdate() {
  const CURRENT_BUILD = "REPLACE_ME"; // <-- must match what's baked into this loaded bundle
  const STORAGE_KEY = "leadx_build_version";

  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
    const data = await res.json();
    const latestBuild = data.build;

    const lastSeenBuild = sessionStorage.getItem(STORAGE_KEY);

    if (lastSeenBuild && lastSeenBuild !== latestBuild) {
      // Stale build detected — force a hard reload once.
      sessionStorage.setItem(STORAGE_KEY, latestBuild);
      window.location.reload(true);
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, latestBuild);

    if (CURRENT_BUILD !== latestBuild) {
      // The bundle currently running is already behind what's deployed.
      window.location.reload(true);
    }
  } catch (err) {
    console.warn("Version check failed, continuing without it:", err);
  }
})();
