export interface CellSector {
  sectorId: string;
  azimuthDeg: number;
  beamWidthDeg: number;
  activeAttachedSims: number;
  capacitySims: number;
  dominantOperatorShare: {
    jio: number;
    airtel: number;
    vi: number;
    bsnl: number;
  };
}

export interface CellTower {
  id: string;
  towerCode: string;
  name: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  cellRadiusMeters: number;
  totalSimCount: number;
  operator: string;
  riskLevel: 'OVERLOAD' | 'CONGESTED' | 'NORMAL';
  trendPercentage: number;
  sectors: CellSector[];
}

export const NASHIK_CELL_TOWERS: CellTower[] = [
  {
    id: 'tower-ramkund-01',
    towerCode: 'NSK-TOW-01',
    name: 'Ramkund Sacred Ghat COW Mast',
    locationName: 'Godavari Riverbank Central Watchtower',
    coordinates: { lat: 19.9996, lng: 73.7915 },
    cellRadiusMeters: 450,
    totalSimCount: 38400,
    operator: 'Jio_Airtel_Shared_COW',
    riskLevel: 'OVERLOAD',
    trendPercentage: 34.2,
    sectors: [
      {
        sectorId: 'SEC-A-WEST-STEPS',
        azimuthDeg: 270,
        beamWidthDeg: 65,
        activeAttachedSims: 16800,
        capacitySims: 15000,
        dominantOperatorShare: { jio: 44, airtel: 32, vi: 14, bsnl: 10 }
      },
      {
        sectorId: 'SEC-B-GODAVARI-POOL',
        azimuthDeg: 180,
        beamWidthDeg: 65,
        activeAttachedSims: 13200,
        capacitySims: 14000,
        dominantOperatorShare: { jio: 42, airtel: 35, vi: 12, bsnl: 11 }
      },
      {
        sectorId: 'SEC-C-DEEPSTAMBHA',
        azimuthDeg: 90,
        beamWidthDeg: 65,
        activeAttachedSims: 8400,
        capacitySims: 12000,
        dominantOperatorShare: { jio: 46, airtel: 30, vi: 15, bsnl: 9 }
      }
    ]
  },
  {
    id: 'tower-laxman-02',
    towerCode: 'NSK-TOW-02',
    name: 'Laxman Jhula Promenade Base Station',
    locationName: 'North Godavari Embankment',
    coordinates: { lat: 20.0016, lng: 73.7944 },
    cellRadiusMeters: 550,
    totalSimCount: 24600,
    operator: 'Bharti_Airtel_Micro',
    riskLevel: 'NORMAL',
    trendPercentage: 8.5,
    sectors: [
      {
        sectorId: 'SEC-A-PROMENADE-EAST',
        azimuthDeg: 60,
        beamWidthDeg: 70,
        activeAttachedSims: 11200,
        capacitySims: 18000,
        dominantOperatorShare: { jio: 40, airtel: 38, vi: 12, bsnl: 10 }
      },
      {
        sectorId: 'SEC-B-SANGAAM-APPROACH',
        azimuthDeg: 190,
        beamWidthDeg: 70,
        activeAttachedSims: 13400,
        capacitySims: 18000,
        dominantOperatorShare: { jio: 43, airtel: 33, vi: 14, bsnl: 10 }
      }
    ]
  },
  {
    id: 'tower-panchavati-03',
    towerCode: 'NSK-TOW-03',
    name: 'Panchavati Kalaram Temple Tower',
    locationName: 'Temple Heritage Chowk Mast',
    coordinates: { lat: 20.0039, lng: 73.7968 },
    cellRadiusMeters: 500,
    totalSimCount: 29800,
    operator: 'Vodafone_Idea_Jio_Shared',
    riskLevel: 'CONGESTED',
    trendPercentage: 21.4,
    sectors: [
      {
        sectorId: 'SEC-A-MANDIR-COURTYARD',
        azimuthDeg: 340,
        beamWidthDeg: 60,
        activeAttachedSims: 15600,
        capacitySims: 16000,
        dominantOperatorShare: { jio: 45, airtel: 31, vi: 16, bsnl: 8 }
      },
      {
        sectorId: 'SEC-B-MARKET-ALLEY',
        azimuthDeg: 140,
        beamWidthDeg: 60,
        activeAttachedSims: 14200,
        capacitySims: 16000,
        dominantOperatorShare: { jio: 39, airtel: 36, vi: 15, bsnl: 10 }
      }
    ]
  },
  {
    id: 'tower-tapovan-04',
    towerCode: 'NSK-TOW-04',
    name: 'Tapovan Sadhugram Macro Tower',
    locationName: 'Akhara City Staging Headquarters',
    coordinates: { lat: 19.9878, lng: 73.8118 },
    cellRadiusMeters: 1100,
    totalSimCount: 84500,
    operator: 'TRAI_Multi_Operator_Array',
    riskLevel: 'NORMAL',
    trendPercentage: 12.8,
    sectors: [
      {
        sectorId: 'SEC-A-VAISHNAVA-CAMPS',
        azimuthDeg: 45,
        beamWidthDeg: 90,
        activeAttachedSims: 28500,
        capacitySims: 40000,
        dominantOperatorShare: { jio: 47, airtel: 32, vi: 12, bsnl: 9 }
      },
      {
        sectorId: 'SEC-B-SHAHI-PROCESSION-LANE',
        azimuthDeg: 180,
        beamWidthDeg: 90,
        activeAttachedSims: 31000,
        capacitySims: 40000,
        dominantOperatorShare: { jio: 43, airtel: 34, vi: 14, bsnl: 9 }
      },
      {
        sectorId: 'SEC-C-HOLDING-GROUNDS',
        azimuthDeg: 280,
        beamWidthDeg: 90,
        activeAttachedSims: 25000,
        capacitySims: 40000,
        dominantOperatorShare: { jio: 41, airtel: 35, vi: 13, bsnl: 11 }
      }
    ]
  },
  {
    id: 'tower-railway-05',
    towerCode: 'NSK-TOW-05',
    name: 'Nashik Road Railway Ingress Hub',
    locationName: 'Nashik Road Terminal Overpass',
    coordinates: { lat: 19.9575, lng: 73.8344 },
    cellRadiusMeters: 800,
    totalSimCount: 52400,
    operator: 'RailWire_DoT_Unified',
    riskLevel: 'OVERLOAD',
    trendPercentage: 32.6,
    sectors: [
      {
        sectorId: 'SEC-A-PLATFORMS-1-4',
        azimuthDeg: 310,
        beamWidthDeg: 75,
        activeAttachedSims: 27800,
        capacitySims: 25000,
        dominantOperatorShare: { jio: 48, airtel: 30, vi: 12, bsnl: 10 }
      },
      {
        sectorId: 'SEC-B-PILGRIM-BUS-STAND',
        azimuthDeg: 130,
        beamWidthDeg: 75,
        activeAttachedSims: 24600,
        capacitySims: 25000,
        dominantOperatorShare: { jio: 44, airtel: 32, vi: 14, bsnl: 10 }
      }
    ]
  }
];
