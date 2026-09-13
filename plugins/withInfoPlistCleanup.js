const { withInfoPlist } = require('expo/config-plugins');

/**
 * Removes two entries the Expo iOS template adds that this app does not want.
 *
 * A config plugin rather than a hand edit of ios/Info.plist: `ios/` is a
 * generated, gitignored folder, so a manual edit is silently reverted by the
 * next `expo prebuild` or EAS Build.
 */
module.exports = function withInfoPlistCleanup(config) {
  return withInfoPlist(config, (cfg) => {
    const plist = cfg.modResults;

    // `LSMinimumSystemVersion` is a macOS key; on iOS it is ignored, and its
    // value (12.0) contradicts the real deployment target (15.1).
    delete plist.LSMinimumSystemVersion;

    // Expo registers the bundle identifier as a second URL scheme for
    // auth-session flows. This app has no auth, so it is unused attack
    // surface — keep only the `linguacard` scheme.
    if (Array.isArray(plist.CFBundleURLTypes)) {
      plist.CFBundleURLTypes = plist.CFBundleURLTypes.map((entry) => {
        if (!Array.isArray(entry.CFBundleURLSchemes)) return entry;
        return {
          ...entry,
          CFBundleURLSchemes: entry.CFBundleURLSchemes.filter((s) => s === 'linguacard'),
        };
      }).filter((entry) => (entry.CFBundleURLSchemes?.length ?? 0) > 0);
    }

    return cfg;
  });
};
