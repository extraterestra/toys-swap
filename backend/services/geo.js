// Haversine distance between two lat/lng points, in kilometers.
function distanceKm(lat1, lng1, lat2, lng2) {
  if ([lat1, lng1, lat2, lng2].some(v => v === null || v === undefined || isNaN(v))) {
    return Infinity;
  }
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Very small, dependency-free geocoding stand-in for the MVP.
// In production, replace with a real geocoding API (Google/Mapbox/Nominatim).
// For local/demo purposes, we let the client send lat/lng directly (e.g. from
// a map picker or browser geolocation), so this is just a safe fallback.
function fallbackGeocode(addressText) {
  // Returns a pseudo-random but stable-ish point so demo data still varies.
  let hash = 0;
  for (let i = 0; i < (addressText || '').length; i++) {
    hash = (hash * 31 + addressText.charCodeAt(i)) % 100000;
  }
  const lat = 49.6 + (hash % 100) / 1000; // roughly southern Poland region as a placeholder
  const lng = 19.9 + (hash % 77) / 1000;
  return { lat, lng };
}

module.exports = { distanceKm, fallbackGeocode };
