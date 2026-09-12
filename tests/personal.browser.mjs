// Compatibility entry for the existing build workflow; run the new experience's
// actual browser acceptance suite rather than asserting retired DOM selectors.
await import('./flightlog.browser.mjs');
