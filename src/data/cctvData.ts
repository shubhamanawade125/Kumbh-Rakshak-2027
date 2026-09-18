export interface CctvCameraLocation {
  id: string;
  camCode: string;
  name: string;
  marathiName: string;
  zone: string;
  coordinates: { lat: number; lng: number };
  initialDensity: number;
  initialCount: number;
  velocityMps: number;
  flowDirection: string;
  riskLevel: 'NORMAL' | 'CONGESTED' | 'CRITICAL_CRUSH';
  fps: number;
  resolution: string;
  image: string;
  description: string;
}

export const NASHIK_PUBLIC_CCTV_CAMERAS: CctvCameraLocation[] = [
  {
    id: 'loc-ramkund',
    camCode: 'CAM-048-RAMKUND-W',
    name: 'Ramkund Sacred Bathing Steps (Zone A)',
    marathiName: 'रामकुंड पश्चिम पायऱ्या मुख्य स्नान कुंड',
    zone: 'Ramkund Core',
    coordinates: { lat: 19.9996, lng: 73.7915 },
    initialDensity: 5.78,
    initialCount: 11450,
    velocityMps: 0.18,
    flowDirection: 'NORTH_TO_SOUTH',
    riskLevel: 'CRITICAL_CRUSH',
    fps: 30,
    resolution: '1080p60 RTSP',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Kumbhmela_Nashik_2015_-_view_across_Ramkund.JPG',
    description: 'High-turbulent bottleneck at the primary descent stairs to the holy river basin. Chokepoint monitored for stampede risk.'
  },
  {
    id: 'loc-laxman',
    camCode: 'CAM-012-LAXMAN-PR',
    name: 'Laxman Ghat & Godavari Sangam Promenade',
    marathiName: 'लक्ष्मण घाट व गोदावरी संगम विस्तीर्ण मार्ग',
    zone: 'Godavari North',
    coordinates: { lat: 20.0016, lng: 73.7944 },
    initialDensity: 2.30,
    initialCount: 7200,
    velocityMps: 0.95,
    flowDirection: 'WEST_TO_EAST',
    riskLevel: 'NORMAL',
    fps: 30,
    resolution: '1080p60 Optical',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Kumbha_mela_on_ghats_of_the_river_godavari_nashik.jpg',
    description: 'Wide paved promenade absorbing diverted queues smoothly. Direct water-safety rescue boat patrol access.'
  },
  {
    id: 'loc-bridge',
    camCode: 'CAM-077-BRIDGE-ST',
    name: 'Godavari Foot Overbridge Stanchion 02',
    marathiName: 'गोदावरी पादचारी पूल मुख्य संकुचित मार्ग',
    zone: 'Bridge Corridor',
    coordinates: { lat: 20.0005, lng: 73.7928 },
    initialDensity: 4.55,
    initialCount: 5400,
    velocityMps: 0.35,
    flowDirection: 'ONE_WAY_NORTH',
    riskLevel: 'CONGESTED',
    fps: 30,
    resolution: '1080p60 RTSP',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Godavari_River_Nashik.jpg',
    description: 'Narrow bridge approach connecting North and South riverbanks. Critical chokepoint requiring queue meter holding.'
  },
  {
    id: 'loc-panchavati',
    camCode: 'CAM-064-KALARAM-CH',
    name: 'Panchavati & Kalaram Mandir Chowk',
    marathiName: 'पंचवटी श्री काळाराम मंदिर पूर्व महाद्वार',
    zone: 'Heritage Temple',
    coordinates: { lat: 20.0039, lng: 73.7968 },
    initialDensity: 3.40,
    initialCount: 8200,
    velocityMps: 0.65,
    flowDirection: 'CIRCULAR_QUEUE',
    riskLevel: 'CONGESTED',
    fps: 30,
    resolution: '1080p60 Optical',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Kalaram_Mandir_Nashik.jpg',
    description: 'Historic Ramayana heritage temple complex. Manages dense post-snan darshan lines with barricaded holding pens.'
  },
  {
    id: 'loc-tapovan',
    camCode: 'CAM-090-TAPOVAN-SQ',
    name: 'Tapovan Sadhugram Akhara City Central Plaza',
    marathiName: 'तपोवन साधुग्राम महा आखाडा मध्यवर्ती चौक',
    zone: 'Akhara City',
    coordinates: { lat: 19.9878, lng: 73.8118 },
    initialDensity: 2.80,
    initialCount: 48000,
    velocityMps: 1.10,
    flowDirection: 'MULTI_DIRECTIONAL',
    riskLevel: 'NORMAL',
    fps: 30,
    resolution: '1080p60 RTSP',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Tapovan_Nashik.jpg',
    description: '350+ acre tent city hosting thousands of Mahants, Naga Sadhus, and Akharas. Royal procession staging ground.'
  },
  {
    id: 'loc-kapileshwar',
    camCode: 'CAM-033-KAPIL-GHAT',
    name: 'Kapileshwar Mahadev Mandir Ghat Steps',
    marathiName: 'कपिलेश्वर महादेव मंदिर घाट परिसर',
    zone: 'South Ghats',
    coordinates: { lat: 19.9988, lng: 73.7905 },
    initialDensity: 3.80,
    initialCount: 4900,
    velocityMps: 0.55,
    flowDirection: 'UPWARD_DESCENT',
    riskLevel: 'CONGESTED',
    fps: 30,
    resolution: '1080p60 Optical',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Simhastha_Kumbh_Mela_at_Nashik_in_Maharashtra_state.jpg',
    description: 'Ancient Shiva temple overlooking Godavari river; confluence point holding thousands opposite Ramkund.'
  },
  {
    id: 'loc-kushavarta',
    camCode: 'CAM-102-TRIMBAK-KUND',
    name: 'Kushavarta Kund (Trimbakeshwar Jyotirlinga)',
    marathiName: 'कुशावर्त तीर्थ (त्र्यंबकेश्वर ज्योतिर्लिंग)',
    zone: 'Trimbakeshwar Core',
    coordinates: { lat: 19.9328, lng: 73.5312 },
    initialDensity: 4.10,
    initialCount: 6200,
    velocityMps: 0.40,
    flowDirection: 'INWARD_CIRCULATION',
    riskLevel: 'CONGESTED',
    fps: 30,
    resolution: '1080p60 RTSP',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Kushavarta_Kund_Trimbakeshwar.jpg',
    description: 'Sacred source basin of river Godavari, 28km from Nashik. Epicenter of Shaivite holy dip and Naga sadhu snan.'
  },
  {
    id: 'loc-railway',
    camCode: 'CAM-118-NSK-RD-TERM',
    name: 'Nashik Road Railway Pilgrim Transit Hub',
    marathiName: 'नाशिक रोड रेल्वे महा-यात्री टर्मिनल',
    zone: 'Transit Gateway',
    coordinates: { lat: 19.9575, lng: 73.8344 },
    initialDensity: 3.90,
    initialCount: 24500,
    velocityMps: 0.70,
    flowDirection: 'CONCOURSE_DISPERSAL',
    riskLevel: 'CONGESTED',
    fps: 30,
    resolution: '1080p60 PTZ',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Nashik_Road_Railway_Station.jpg',
    description: 'Main nationwide rail gateway with dedicated Kumbh Mela platforms, holding sheds, and shuttle connections.'
  }
];

export function getNearestCctvLocation(lat: number, lng: number): { camera: CctvCameraLocation; distanceMeters: number } | null {
  if (NASHIK_PUBLIC_CCTV_CAMERAS.length === 0) return null;

  let nearest = NASHIK_PUBLIC_CCTV_CAMERAS[0];
  let minDistance = Infinity;

  const R = 6371e3;
  for (const cam of NASHIK_PUBLIC_CCTV_CAMERAS) {
    const phi1 = (lat * Math.PI) / 180;
    const phi2 = (cam.coordinates.lat * Math.PI) / 180;
    const deltaPhi = ((cam.coordinates.lat - lat) * Math.PI) / 180;
    const deltaLambda = ((cam.coordinates.lng - lng) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = Math.round(R * c);

    if (d < minDistance) {
      minDistance = d;
      nearest = cam;
    }
  }

  return { camera: nearest, distanceMeters: minDistance };
}
