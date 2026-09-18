import { 
  Sector, 
  Incident, 
  AedStation, 
  MedicalCamp, 
  MissingPersonAlert, 
  VolunteerResponder, 
  AmbulanceUnit,
  TriagePatient 
} from '../types';

export const INITIAL_SECTORS: Sector[] = [
  {
    id: 'sec-ramkund',
    name: 'Ramkund Sacred Ghat',
    nameMr: 'रामकुंड मुख्य शाही स्नान घाट',
    density: 5.78,
    maxCapacity: 12000,
    currentPeople: 11450,
    riskLevel: 'CRITICAL_CRUSH',
    velocityMps: 0.18,
    flowRate: 340,
    pressurePsi: 2.4,
    bottleneckActive: true,
    activeDiversion: 'Inbound diverted via Laxman Promenade North lane',
    cameraZoneId: 'CCTV-048-RAMKUND',
    flowDirection: 'NORTH_TO_SOUTH',
    coordinates: [19.9996, 73.7915],
    description: 'Main Vaishnava Shahi Snan Kund; high turbulence and compressive crush risk at stone steps.'
  },
  {
    id: 'sec-laxman',
    name: 'Laxman Ghat & Promenade',
    nameMr: 'लक्ष्मण घाट व नदीकाठ परिसर',
    density: 2.30,
    maxCapacity: 18000,
    currentPeople: 7200,
    riskLevel: 'STABLE',
    velocityMps: 0.95,
    flowRate: 880,
    pressurePsi: 0.4,
    bottleneckActive: false,
    activeDiversion: null,
    cameraZoneId: 'CCTV-012-LAXMAN',
    flowDirection: 'WEST_TO_EAST',
    coordinates: [20.0016, 73.7944],
    description: 'Wide stone promenade absorbing diverted crowd volumes smoothly with zero congestion.'
  },
  {
    id: 'sec-bridge',
    name: 'Godavari Foot Overbridge',
    nameMr: 'गोदावरी पादचारी पूल (धोकादायक संकुचित मार्ग)',
    density: 4.55,
    maxCapacity: 6000,
    currentPeople: 5400,
    riskLevel: 'HIGH_WARNING',
    velocityMps: 0.35,
    flowRate: 410,
    pressurePsi: 1.8,
    bottleneckActive: true,
    activeDiversion: null,
    cameraZoneId: 'CCTV-077-BRIDGE',
    flowDirection: 'ONE_WAY_NORTH',
    coordinates: [20.0005, 73.7928],
    description: 'Chokepoint bridge stanchion with counter-directional pedestrian queues.'
  },
  {
    id: 'sec-kalaram',
    name: 'Panchavati Kalaram Chowk',
    nameMr: 'पंचवटी श्री काळाराम मंदिर चौक',
    density: 3.40,
    maxCapacity: 14000,
    currentPeople: 8200,
    riskLevel: 'MODERATE',
    velocityMps: 0.65,
    flowRate: 620,
    pressurePsi: 0.8,
    bottleneckActive: false,
    activeDiversion: null,
    cameraZoneId: 'CCTV-064-KALARAM',
    flowDirection: 'CIRCULAR_QUEUE',
    coordinates: [20.0039, 73.7968],
    description: 'Queue holding area for historic black stone Lord Rama temple.'
  },
  {
    id: 'sec-tapovan',
    name: 'Tapovan Sadhugram Camp',
    nameMr: 'तपोवन साधुग्राम महा आखाडा नगर',
    density: 2.80,
    maxCapacity: 95000,
    currentPeople: 48000,
    riskLevel: 'STABLE',
    velocityMps: 1.10,
    flowRate: 1450,
    pressurePsi: 0.3,
    bottleneckActive: false,
    activeDiversion: null,
    cameraZoneId: 'CCTV-090-TAPOVAN',
    flowDirection: 'MULTI_DIRECTIONAL',
    coordinates: [19.9878, 73.8118],
    description: 'Expansive 350-acre staging grounds for Vaishnava & Shaivite Akharas.'
  },
  {
    id: 'sec-kushavarta',
    name: 'Kushavarta Kund (Trimbakeshwar)',
    nameMr: 'कुशावर्त तीर्थ (त्र्यंबकेश्वर ज्योतिर्लिंग)',
    density: 4.10,
    maxCapacity: 8000,
    currentPeople: 6200,
    riskLevel: 'HIGH_WARNING',
    velocityMps: 0.40,
    flowRate: 380,
    pressurePsi: 1.5,
    bottleneckActive: false,
    activeDiversion: null,
    cameraZoneId: 'CCTV-102-KUSHAVARTA',
    flowDirection: 'INWARD_CIRCULATION',
    coordinates: [19.9328, 73.5312],
    description: 'Sacred source of river Godavari, hosting Shaivite Naga Sadhu royal procession.'
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2027-01',
    title: 'Sudden Cardiac Collapse on Ramkund Steps',
    category: 'CARDIAC_ARREST',
    severity: 'CRITICAL',
    status: 'ACTION_IN_PROGRESS',
    locationName: 'Ramkund Ghat West Steps (Zone A, Pillar 4)',
    coordinates: [19.9996, 73.7915],
    timestamp: '10:41 AM',
    source: 'Farnebäck Optical Flow Void + Volunteer Radio',
    assignedResponder: 'Suresh Patil (Paramedic Runner)',
    responderDistanceMeters: 65,
    responderEtaMinutes: 1.2,
    goldenTimerRemainingSeconds: 165,
    aiRecommendation: 'Dispatch nearest on-foot volunteer with AED-01. Clear green corridor to Nashik Civil Hospital.',
    aiConfidence: 0.98,
    history: [
      {
        id: 'ev-1',
        timestamp: '10:41 AM',
        actor: 'CSRNet Edge AI',
        role: 'AUTOMATED_DETECTION',
        action: 'Optical Flow Void (0.0 m/s Eddy)',
        details: 'Pedestrian velocity dropped instantaneously; cluster void detected around collapsed pilgrim.',
        type: 'AI_DETECTION'
      },
      {
        id: 'ev-2',
        timestamp: '10:42 AM',
        actor: 'Inspector V. Shinde',
        role: 'COMMAND_ADMIN',
        action: 'Dispatched Volunteer Runner',
        details: 'Routed Suresh Patil to fetch AED Unit 01 from Ramkund Tower.',
        type: 'HUMAN_DECISION'
      },
      {
        id: 'ev-3',
        timestamp: '10:43 AM',
        actor: 'Suresh Patil',
        role: 'VOLUNTEER_RESPONDER',
        action: 'AED Delivered on Foot & CPR Commenced',
        details: 'Pads placed below right clavicle and left chest; first rhythm check analyzing.',
        type: 'EXECUTED_ACTION'
      }
    ]
  },
  {
    id: 'INC-2027-02',
    title: 'Severe Pedestrian Stagnation & Barricade Pressure',
    category: 'CROWD_SURGE',
    severity: 'HIGH',
    status: 'RESPONDER_DISPATCHED',
    locationName: 'Godavari Foot Overbridge Stanchion',
    coordinates: [20.0005, 73.7928],
    timestamp: '10:35 AM',
    source: 'CCTV Camera 77 Velocity Ingestion',
    assignedResponder: 'Police QRF Team 4',
    responderDistanceMeters: 140,
    responderEtaMinutes: 2.0,
    aiRecommendation: 'Activate overflow relief gate. Redirect incoming crowd through Laxman Ghat Promenade.',
    aiConfidence: 0.94,
    history: [
      {
        id: 'ev-4',
        timestamp: '10:35 AM',
        actor: 'Vision Model',
        role: 'AUTOMATED_DETECTION',
        action: 'Chokepoint Density 4.55 P/m²',
        details: 'Velocity vector reduced below 0.3 m/s; risk of crowd shockwave.',
        type: 'AI_DETECTION'
      },
      {
        id: 'ev-5',
        timestamp: '10:37 AM',
        actor: 'Police Control Room',
        role: 'COMMAND_ADMIN',
        action: 'Holding Sector Barricade Deployed',
        details: 'Temporary hold on overbridge queue to relieve riverbank descent.',
        type: 'EXECUTED_ACTION'
      }
    ]
  },
  {
    id: 'INC-2027-03',
    title: 'Elderly Heat Exhaustion & Dehydration Collapse',
    category: 'HEAT_COLLAPSE',
    severity: 'HIGH',
    status: 'ACKNOWLEDGED',
    locationName: 'Panchavati Kalaram Temple East Queue',
    coordinates: [20.0039, 73.7968],
    timestamp: '10:28 AM',
    source: 'Scout Drone Alpha FLIR Thermal Sensor',
    assignedResponder: 'Dr. Amit Joshi (Field Camp 02)',
    responderDistanceMeters: 85,
    responderEtaMinutes: 1.5,
    goldenTimerRemainingSeconds: 240,
    aiRecommendation: 'Administer cold saline IV, transfer to shaded first-aid tent.',
    aiConfidence: 0.89,
    history: [
      {
        id: 'ev-6',
        timestamp: '10:28 AM',
        actor: 'Thermal Drone Scanner',
        role: 'AUTOMATED_DETECTION',
        action: 'Hyperthermic Alert (>40.2°C)',
        details: 'Senior citizen stopped moving in temple queue.',
        type: 'AI_DETECTION'
      }
    ]
  }
];

export const INITIAL_AED_STATIONS: AedStation[] = [
  {
    id: 'aed-01',
    name: 'AED Station 01 (Ramkund Core)',
    locationDescription: 'Deepstambha Pillar 4, Western Steps',
    locationDetails: 'Weatherproof high-visibility alarmed enclosure with 24/7 solar backup.',
    coordinates: [19.9996, 73.7915],
    batteryLevel: 98,
    padExpiryYear: 2028,
    status: 'OPERATIONAL',
    callSupportPhone: '0253-2571201',
    nearestAssignedVolunteer: 'Suresh Patil (Paramedic Scout)',
    cprInstructions: [
      'Confirm unresponsiveness & call for 108 backup',
      'Apply right pad below right collarbone; left pad on lower left ribcage',
      'Stand clear while AED analyzes cardiac rhythm'
    ]
  },
  {
    id: 'aed-02',
    name: 'AED Station 02 (Laxman Ghat)',
    locationDescription: 'Laxman Jhula Promenade Entry Booth',
    locationDetails: 'Next to Red Cross Emergency Post 3.',
    coordinates: [20.0016, 73.7944],
    batteryLevel: 94,
    padExpiryYear: 2028,
    status: 'OPERATIONAL',
    callSupportPhone: '0253-2571202',
    nearestAssignedVolunteer: 'Nilesh Gawli (Civil Defence)',
    cprInstructions: [
      'Begin chest compressions: 100-120 beats per minute',
      'Open airway with head-tilt, chin-lift maneuver',
      'Deliver shock only when instructed by automated voice'
    ]
  },
  {
    id: 'aed-03',
    name: 'AED Station 03 (Footbridge Stanchion)',
    locationDescription: 'Godavari Foot Overbridge Mid-Pier',
    locationDetails: 'Mounted on structural stanchion 2 with emergency siren flash.',
    coordinates: [20.0005, 73.7928],
    batteryLevel: 89,
    padExpiryYear: 2027,
    status: 'OPERATIONAL',
    callSupportPhone: '0253-2571203',
    nearestAssignedVolunteer: 'Kavita Shinde (Nurse Volunteer)',
    cprInstructions: [
      'Compress lower half of breastbone 5 to 6 cm deep',
      'Allow complete chest recoil between compressions'
    ]
  },
  {
    id: 'aed-04',
    name: 'AED Station 04 (Kalaram Mandir)',
    locationDescription: 'Panchavati Temple Gateway Chowk',
    locationDetails: 'Adjacent to Police Information Kiosk.',
    coordinates: [20.0039, 73.7968],
    batteryLevel: 100,
    padExpiryYear: 2028,
    status: 'OPERATIONAL',
    callSupportPhone: '0253-2571204',
    nearestAssignedVolunteer: 'Anand Kulkarni (Home Guard)',
    cprInstructions: [
      'Expose bare chest, wipe moisture if wet from holy dip',
      'Plug in pad connector firmly and follow audio prompts'
    ]
  }
];

export const INITIAL_MEDICAL_CAMPS: MedicalCamp[] = [
  {
    id: 'camp-ramkund-hq',
    name: 'Ramkund Rapid Field Hospital',
    nameMr: 'रामकुंड तात्काळ वैद्यकीय तळ',
    coordinates: [19.9989, 73.7905],
    doctorOnDuty: 'Dr. Ramesh Deshmukh (Trauma Care)',
    contactNumber: '0253-2573222',
    bedsTotal: 50,
    bedsOccupied: 38,
    hasOxygenSupply: true,
    category: 'HOSPITAL'
  },
  {
    id: 'camp-laxman',
    name: 'Laxman Ghat First Aid Post',
    nameMr: 'लक्ष्मण घाट प्रथमोपचार केंद्र',
    coordinates: [20.0022, 73.7950],
    doctorOnDuty: 'Dr. Amit Joshi (Emergency Medical Officer)',
    contactNumber: '0253-2571109',
    bedsTotal: 25,
    bedsOccupied: 12,
    hasOxygenSupply: true,
    category: 'TRIAGE'
  },
  {
    id: 'camp-tapovan-mega',
    name: 'Tapovan Mega Disaster Base Hospital',
    nameMr: 'तपोवन महा आपत्ती निवारण रुग्णालय',
    coordinates: [19.9860, 73.8130],
    doctorOnDuty: 'Dr. Snehal Shinde (Critical Care Lead)',
    contactNumber: '0253-2579000',
    bedsTotal: 200,
    bedsOccupied: 94,
    hasOxygenSupply: true,
    category: 'HOSPITAL'
  }
];

export const INITIAL_MISSING_PERSONS: MissingPersonAlert[] = [
  {
    id: 'miss-01',
    caseNumber: 'AMBER-2027-101',
    name: 'Aarav Patil',
    age: 7,
    gender: 'MALE',
    clothingDescription: 'Yellow t-shirt, blue denim shorts, white sandals',
    lastSeenLocation: 'Ramkund West Steps near Deepstambha',
    lastSeenTime: '10:15 AM',
    guardianName: 'Sunita Patil (Mother)',
    guardianPhone: '+91 98220 19482',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    isBroadcastingAllScreens: true,
    broadcastTowerCount: 14,
    status: 'BROADCAST',
    specialNotes: 'Speaks Marathi; answers to nickname "Golu".'
  },
  {
    id: 'miss-02',
    caseNumber: 'AMBER-2027-102',
    name: 'Parvati Bai Deshmukh',
    age: 68,
    gender: 'FEMALE',
    clothingDescription: 'Dark green Paithani saree with red border, silver nose ring, gold bangles',
    lastSeenLocation: 'Panchavati Kalaram Temple East Gate',
    lastSeenTime: '09:45 AM',
    guardianName: 'Ganesh Deshmukh (Son)',
    guardianPhone: '+91 94222 88319',
    photoUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=400&q=80',
    isBroadcastingAllScreens: true,
    broadcastTowerCount: 14,
    status: 'SIGHTING',
    specialNotes: 'Diabetic; wears spectacles with black frame; speaks Marathi & Kannada.'
  },
  {
    id: 'miss-03',
    caseNumber: 'AMBER-2027-103',
    name: 'Radhe Shyam Tiwari',
    age: 72,
    gender: 'MALE',
    clothingDescription: 'White Kurta Dhoti, saffron gamchha over shoulder, wooden prayer beads',
    lastSeenLocation: 'Godavari Foot Overbridge South Approach',
    lastSeenTime: '08:30 AM',
    guardianName: 'Manoj Tiwari (Nephew)',
    guardianPhone: '+91 98110 54321',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    isBroadcastingAllScreens: false,
    broadcastTowerCount: 14,
    status: 'REUNITED',
    specialNotes: 'Reunited at Ramkund Police Post 1.'
  }
];

export const INITIAL_VOLUNTEERS: VolunteerResponder[] = [
  {
    id: 'vol-01',
    name: 'Suresh Patil',
    phone: '+91 98221 44551',
    role: 'Paramedic CPR Scout',
    status: 'DISPATCHED_TO_INCIDENT',
    currentLocationName: 'Ramkund Pillar 4',
    coordinates: [19.9996, 73.7915],
    carryingAed: true,
    distanceMeters: 65
  },
  {
    id: 'vol-02',
    name: 'Kavita Shinde',
    phone: '+91 98230 11982',
    role: 'Red Cross Nurse Volunteer',
    status: 'AVAILABLE',
    currentLocationName: 'Laxman Ghat Promenade Post',
    coordinates: [20.0016, 73.7944],
    carryingAed: false,
    distanceMeters: 180
  },
  {
    id: 'vol-03',
    name: 'Nilesh Gawli',
    phone: '+91 94220 77663',
    role: 'Civil Defence First Responder',
    status: 'AVAILABLE',
    currentLocationName: 'Godavari Bridge South Stanchion',
    coordinates: [20.0005, 73.7928],
    carryingAed: true,
    distanceMeters: 140
  },
  {
    id: 'vol-04',
    name: 'Anand Kulkarni',
    phone: '+91 98500 33214',
    role: 'Home Guard Rescue Patrol',
    status: 'AVAILABLE',
    currentLocationName: 'Kalaram Mandir Gate 2',
    coordinates: [20.0039, 73.7968],
    carryingAed: false,
    distanceMeters: 350
  }
];

export const INITIAL_AMBULANCES: AmbulanceUnit[] = [
  {
    id: 'amb-108-14',
    callSign: 'ALS-14 (Nashik Cardiac Unit)',
    plateNumber: 'MH-15-EG-1081',
    type: 'ALS_CARDIAC',
    status: 'DISPATCHED',
    currentLocationName: 'Panchavati Bridge Checkpoint',
    coordinates: [19.9985, 73.7890],
    driverName: 'Santosh Jadhav',
    driverPhone: '+91 98220 10814',
    doctorOnBoard: 'Dr. Vivek Rane (Cardiologist)',
    doctorPhone: '+91 98220 10815',
    etaMinutes: 2.1
  },
  {
    id: 'amb-108-09',
    callSign: 'BLS-09 (Oxygen + Defib Field Van)',
    plateNumber: 'MH-15-EG-1082',
    type: 'BLS_BASIC',
    status: 'STANDBY',
    currentLocationName: 'Godavari North Bank Triage Staging',
    coordinates: [20.0025, 73.7960],
    driverName: 'Raju More',
    driverPhone: '+91 98220 10809',
    doctorOnBoard: 'Dr. Pooja Salve (EMO)',
    doctorPhone: '+91 98220 10810',
    etaMinutes: 4.5
  },
  {
    id: 'amb-108-22',
    callSign: 'TRAUMA-22 (Heavy Disaster Van)',
    plateNumber: 'MH-15-EG-1083',
    type: 'TRAUMA_HEAVY',
    status: 'STANDBY',
    currentLocationName: 'Tapovan Helipad Road Camp',
    coordinates: [19.9870, 73.8120],
    driverName: 'Mahesh Borse',
    driverPhone: '+91 98220 10822',
    doctorOnBoard: 'Dr. Kiran Bagul (Trauma Surgeon)',
    doctorPhone: '+91 98220 10823',
    etaMinutes: 6.0
  }
];

export const INITIAL_PATIENTS: TriagePatient[] = [
  {
    id: 'tri-01',
    tokenNumber: 'TRI-001',
    name: 'Keshavrao More',
    age: 58,
    gender: 'Male',
    reportedLocation: 'Ramkund Steps West',
    symptoms: 'Sudden collapse, pulseless, gasping',
    respirationRate: 6,
    radialPulsePresent: false,
    mentalStatus: 'UNRESPONSIVE',
    category: 'RED_IMMEDIATE',
    cprRequired: true,
    assignedCampId: 'camp-ramkund-hq',
    reportedTime: '10:41 AM',
    status: 'IN_TREATMENT'
  },
  {
    id: 'tri-02',
    tokenNumber: 'TRI-002',
    name: 'Savitri Bai Shinde',
    age: 64,
    gender: 'Female',
    reportedLocation: 'Panchavati Temple Chowk',
    symptoms: 'Dehydration, syncope, heat exhaustion',
    respirationRate: 24,
    radialPulsePresent: true,
    mentalStatus: 'CONFUSED',
    category: 'YELLOW_DELAYED',
    cprRequired: false,
    assignedCampId: 'camp-laxman',
    reportedTime: '10:28 AM',
    status: 'STABILIZED'
  }
];
