export type RiskLevel = 'STABLE' | 'MODERATE' | 'HIGH_WARNING' | 'CRITICAL_CRUSH' | 'SAFE' | 'OVERLOAD' | 'CONGESTED';

export interface Sector {
  id: string;
  name: string;
  nameMr: string;
  density: number; // Persons / m²
  maxCapacity: number;
  currentPeople: number;
  riskLevel: RiskLevel;
  velocityMps?: number;
  flowRate: number; // persons/minute
  pressurePsi?: number;
  bottleneckActive?: boolean;
  activeDiversion?: string | null;
  cameraZoneId?: string;
  flowDirection?: string;
  coordinates: [number, number]; // [lat, lng]
  description?: string;
}

export type IncidentCategory =
  | 'CARDIAC_ARREST'
  | 'CROWD_SURGE'
  | 'HEAT_COLLAPSE'
  | 'TRAUMA_CRUSH'
  | 'MISSING_CHILD'
  | 'MISSING_ELDERLY'
  | 'ROUTE_BOTTLENECK'
  | 'BARRICADE_BREACH';

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'WATCH' | 'LOW';

export type IncidentStatus =
  | 'DETECTED'
  | 'ACKNOWLEDGED'
  | 'RESPONDER_DISPATCHED'
  | 'ACTION_IN_PROGRESS'
  | 'STABILIZED'
  | 'RESOLVED';

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  type: 'AI_DETECTION' | 'HUMAN_DECISION' | 'EXECUTED_ACTION' | 'SYSTEM_ALERT';
  performedBy?: string;
}

export interface Incident {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  locationName: string;
  coordinates: [number, number];
  timestamp: string;
  source: string;
  assignedResponder?: string;
  responderDistanceMeters?: number;
  responderEtaMinutes?: number;
  goldenTimerRemainingSeconds?: number;
  aiRecommendation: string;
  aiConfidence: number;
  history: IncidentTimelineEvent[];
  timeline?: IncidentTimelineEvent[];
}

export interface AedStation {
  id: string;
  name: string;
  locationDescription: string;
  locationDetails?: string;
  coordinates: [number, number];
  batteryLevel: number;
  padExpiryYear: number | string;
  status: 'OPERATIONAL' | 'STANDBY' | 'IN_USE' | 'MAINTENANCE';
  callSupportPhone: string;
  nearestAssignedVolunteer?: string;
  cprInstructions: string[];
}

export interface MedicalCamp {
  id: string;
  name: string;
  nameMr: string;
  coordinates: [number, number];
  doctorOnDuty: string;
  contactNumber: string;
  bedsTotal: number;
  bedsOccupied: number;
  hasOxygenSupply: boolean;
  category?: 'TRIAGE' | 'HOSPITAL' | 'FIRST_AID';
}

export type MissingPersonStatus =
  | 'REPORTED'
  | 'SEARCHING'
  | 'BROADCAST'
  | 'SIGHTING'
  | 'MATCH_REVIEW'
  | 'LOCATED'
  | 'REUNITED'
  | 'CLOSED';

export interface MissingPersonAlert {
  id: string;
  caseNumber: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  clothingDescription: string;
  lastSeenLocation: string;
  lastSeenTime: string;
  guardianName: string;
  guardianPhone: string;
  photoUrl?: string;
  specialNotes?: string;
  isBroadcastingAllScreens: boolean;
  broadcastTowerCount: number;
  status: MissingPersonStatus;
  reportedAt?: string;
  aiAttireTags?: string[];
  lastSeenCoordinates?: [number, number];
  assignedCheckpoint?: string;
}

export interface VolunteerResponder {
  id: string;
  name: string;
  phone: string;
  role: string;
  status: 'AVAILABLE' | 'DISPATCHED_TO_INCIDENT' | 'ON_SCENE' | 'OFF_DUTY' | 'EN_ROUTE_AED';
  currentLocationName: string;
  coordinates: [number, number];
  carryingAed: boolean;
  distanceMeters?: number;
  assignedIncidentId?: string;
}

export type AmbulanceStatus = 'STANDBY' | 'DISPATCHED' | 'ON_SCENE' | 'TRANSIT_TO_HOSPITAL' | 'IDLE';

export type AmbulanceType = 'ALS_CARDIAC' | 'BLS_BASIC' | 'TRAUMA_HEAVY';

export interface AmbulanceUnit {
  id: string;
  callSign: string;
  plateNumber: string;
  type: AmbulanceType;
  status: AmbulanceStatus;
  currentLocationName: string;
  coordinates: [number, number];
  driverName: string;
  driverPhone: string;
  doctorOnBoard: string;
  doctorPhone?: string;
  etaMinutes?: number;
}

export interface GreenCorridor {
  status: 'IDLE' | 'ACTIVE_TRANSIT' | 'STANDBY';
  targetHospital?: string;
  currentRoute?: string;
  trafficSignalsOverridden?: number;
  estimatedTransitMinutes?: number;
  ambulanceCallSign?: string;
  etaMinutes?: number;
  source?: string;
  destination?: string;
  waypoints?: [number, number][];
}

export type TriageCategory = 'RED_IMMEDIATE' | 'YELLOW_DELAYED' | 'GREEN_MINOR' | 'BLACK_EXPECTANT';

export interface TriagePatient {
  id: string;
  tokenNumber: string;
  name: string;
  age: number;
  gender: string;
  reportedLocation: string;
  symptoms: string;
  respirationRate: number;
  radialPulsePresent: boolean;
  mentalStatus: 'CAN_FOLLOW_COMMANDS' | 'UNRESPONSIVE' | 'CONFUSED';
  category: TriageCategory;
  cprRequired: boolean;
  assignedCampId: string;
  reportedTime: string;
  status: 'PENDING_EVACUATION' | 'IN_TREATMENT' | 'STABILIZED';
}

export type UserRole =
  | 'COMMAND_ADMIN'
  | 'POLICE_OFFICER'
  | 'MEDICAL_COORDINATOR'
  | 'VOLUNTEER_RESPONDER'
  | 'SECTOR_IN_CHARGE'
  | 'SUPER_ADMIN'
  | 'POLICE_COMMANDER'
  | 'DOCTOR_ON_DUTY'
  | 'VOLUNTEER_LEAD';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  badgeNumber: string;
  assignedSector: string;
  phone: string;
  department: string;
  createdAt?: string;
  lastLogin?: string;
}

export type SystemTab =
  | 'OVERVIEW'
  | 'TACTICAL_MAP'
  | 'CROWD_SAFETY'
  | 'MEDICAL_RESPONSE'
  | 'AMBER_PORTAL'
  | 'INCIDENTS'
  | 'VOLUNTEERS_AEDS'
  | 'AMBULANCES'
  | 'ANALYTICS'
  | 'SYSTEM_STATUS';

export type NetworkHealth = 'OPTIMAL' | 'DEGRADED' | 'OFFLINE_MESH';

export interface EmergencyBroadcast {
  id: string;
  title: string;
  textMarathi: string;
  textHindi: string;
  textEnglish: string;
  targetGhatTowers: number;
  timestamp: string;
}
