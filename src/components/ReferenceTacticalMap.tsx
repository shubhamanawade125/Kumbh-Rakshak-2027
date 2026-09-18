import React from 'react';
import { GoogleTacticalMap } from './GoogleTacticalMap';
import { INITIAL_SECTORS, INITIAL_AED_STATIONS, INITIAL_MEDICAL_CAMPS } from '../data/nashikData';
import { Sector, AedStation, MedicalCamp } from '../types';

interface Props {
  sectors?: Sector[];
  aedStations?: AedStation[];
  medicalCamps?: MedicalCamp[];
  selectedSector?: Sector;
  ambulancePathActive?: boolean;
  onSelectSector?: (sector: Sector) => void;
  onOpenLiveStreetMonitor?: (locId?: string) => void;
}

export const ReferenceTacticalMap: React.FC<Props> = ({
  sectors = INITIAL_SECTORS,
  aedStations = INITIAL_AED_STATIONS,
  medicalCamps = INITIAL_MEDICAL_CAMPS,
  selectedSector,
  ambulancePathActive = true,
  onSelectSector = () => {},
  onOpenLiveStreetMonitor
}) => {
  return (
    <div className="relative w-full h-[560px] rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-950">
      <GoogleTacticalMap
        sectors={sectors}
        aedStations={aedStations}
        medicalCamps={medicalCamps}
        selectedSector={selectedSector || sectors[0]}
        ambulancePathActive={ambulancePathActive}
        onSelectSector={onSelectSector}
        onOpenLiveStreetMonitor={onOpenLiveStreetMonitor}
      />
    </div>
  );
};
