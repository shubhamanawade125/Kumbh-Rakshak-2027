import { NASHIK_CELL_TOWERS } from './cellTowerData';

export interface StreetCrowdReading {
  lat: number;
  lng: number;
  streetName: string;
  totalEstimatedPeopleInZone: number;
  crowdPerSquareMeter: number;
  congestionStatus: 'FREE_FLOW' | 'MODERATE' | 'HEAVY' | 'CRITICAL_CONGESTION';
  nearestTowerCode: string;
  distanceToNearestTowerMeters: number;
  walkSpeedMs: number;
  recommendedAction: string;
  confidenceScore: number;
}

// Landmark database for reverse geocoding approximation across Nashik Kumbh region
const KNOWN_LANDMARKS: { lat: number; lng: number; name: string; baseDensity: number; basePeople: number }[] = [
  { lat: 19.9996, lng: 73.7915, name: 'Ramkund Sacred Shahi Snan Ghat (रामकुंड मुख्य घाट)', baseDensity: 5.78, basePeople: 11450 },
  { lat: 20.0016, lng: 73.7944, name: 'Laxman Ghat & Godavari Sangam Promenade (लक्ष्मण घाट)', baseDensity: 2.30, basePeople: 7200 },
  { lat: 20.0005, lng: 73.7928, name: 'Godavari Foot Overbridge Stanchion (गोदावरी पादचारी पूल)', baseDensity: 4.55, basePeople: 5400 },
  { lat: 20.0039, lng: 73.7968, name: 'Panchavati Kalaram Mandir Chowk (काळाराम मंदिर परिसर)', baseDensity: 3.40, basePeople: 8200 },
  { lat: 19.9988, lng: 73.7905, name: 'Kapileshwar Mahadev Mandir Steps (कपिलेश्वर मंदिर घाट)', baseDensity: 3.80, basePeople: 4900 },
  { lat: 19.9878, lng: 73.8118, name: 'Tapovan Sadhugram Akhara City (तपोवन साधुग्राम)', baseDensity: 2.80, basePeople: 48000 },
  { lat: 19.9328, lng: 73.5312, name: 'Kushavarta Kund, Trimbakeshwar (कुशावर्त तीर्थ)', baseDensity: 4.10, basePeople: 6200 },
  { lat: 19.9575, lng: 73.8344, name: 'Nashik Road Railway Pilgrim Terminal (रेल्वे महा-टर्मिनल)', baseDensity: 3.90, basePeople: 24500 },
  { lat: 20.0000, lng: 73.7930, name: 'Godavari Riverbank Central Promenade', baseDensity: 3.10, basePeople: 6100 },
];

function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export function getStreetCrowdInsight(lat: number, lng: number): StreetCrowdReading {
  // 1. Find closest landmark
  let closestLandmark = KNOWN_LANDMARKS[0];
  let minDistance = calculateDistanceMeters(lat, lng, closestLandmark.lat, closestLandmark.lng);

  for (const lm of KNOWN_LANDMARKS) {
    const dist = calculateDistanceMeters(lat, lng, lm.lat, lm.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestLandmark = lm;
    }
  }

  // 2. Find nearest cell tower
  let nearestTower = NASHIK_CELL_TOWERS[0];
  let minTowerDist = calculateDistanceMeters(lat, lng, nearestTower.coordinates.lat, nearestTower.coordinates.lng);

  for (const t of NASHIK_CELL_TOWERS) {
    const d = calculateDistanceMeters(lat, lng, t.coordinates.lat, t.coordinates.lng);
    if (d < minTowerDist) {
      minTowerDist = d;
      nearestTower = t;
    }
  }

  // 3. Compute distance decay and localized density
  let density = closestLandmark.baseDensity;
  let estimatedPeople = closestLandmark.basePeople;
  let streetName = closestLandmark.name;

  if (minDistance > 120) {
    // Street point away from exact landmark point
    const decay = Math.max(0.3, 1 - (minDistance - 120) / 1500);
    density = Number((density * decay).toFixed(2));
    estimatedPeople = Math.round(estimatedPeople * decay);
    streetName = `Approach corridor near ${closestLandmark.name.split('(')[0].trim()} (${minDistance}m away)`;
  }

  // 4. Congestion status & actions
  let congestionStatus: StreetCrowdReading['congestionStatus'] = 'FREE_FLOW';
  let walkSpeed = 0.95;
  let action = 'Normal passage. Keep pilgrim lanes fluid with continuous monitoring.';

  if (density >= 5.0) {
    congestionStatus = 'CRITICAL_CONGESTION';
    walkSpeed = 0.18;
    action = 'Immediate crowd diversion recommended. Halt entry queue and redirect towards Laxman Promenade.';
  } else if (density >= 3.8) {
    congestionStatus = 'HEAVY';
    walkSpeed = 0.38;
    action = 'High queue volume. Deploy holding barricades and broadcast loudspeaker safety alerts.';
  } else if (density >= 2.5) {
    congestionStatus = 'MODERATE';
    walkSpeed = 0.68;
    action = 'Steady flow. Keep volunteers stationed at alleyways to prevent counter-flow blockages.';
  }

  return {
    lat,
    lng,
    streetName,
    totalEstimatedPeopleInZone: estimatedPeople,
    crowdPerSquareMeter: density,
    congestionStatus,
    nearestTowerCode: nearestTower.towerCode,
    distanceToNearestTowerMeters: minTowerDist,
    walkSpeedMs: walkSpeed,
    recommendedAction: action,
    confidenceScore: Math.round(92 - Math.min(25, minDistance / 40)),
  };
}
