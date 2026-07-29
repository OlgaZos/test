const CAMPAIGN_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

function getCampaign() {
  const params = new URLSearchParams(window.location.search);
  return CAMPAIGN_KEYS.reduce((campaign, key) => {
    const value = params.get(key);
    if (value) campaign[key] = value.slice(0, 120);
    return campaign;
  }, {});
}

/**
 * Privacy-safe event bridge.
 * No names, contacts, voice, images or other personal data are collected.
 * To connect Yandex Metrica later, define window.YA_METRIKA_ID.
 */
export function trackEvent(name, details = {}) {
  const payload = {
    event: name,
    game: "autumn-animals",
    timestamp: new Date().toISOString(),
    campaign: getCampaign(),
    ...details
  };

  console.info("[Kro game event]", payload);

  if (window.YA_METRIKA_ID && typeof window.ym === "function") {
    window.ym(window.YA_METRIKA_ID, "reachGoal", name, payload);
  }
}
