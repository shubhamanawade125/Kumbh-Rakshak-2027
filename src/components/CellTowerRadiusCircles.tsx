import React, { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { CellTower } from '../data/cellTowerData';

declare const google: any;

interface Props {
  towers: CellTower[];
  visible: boolean;
  selectedTowerId: string | null;
  onSelectTower: (tower: CellTower) => void;
}

export const CellTowerRadiusCircles: React.FC<Props> = ({
  towers,
  visible,
  selectedTowerId,
  onSelectTower
}) => {
  const map = useMap('kumbh-google-map');
  const circlesRef = React.useRef<any[]>([]);

  useEffect(() => {
    if (!map) return;

    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];

    if (!visible) return;

    towers.forEach((tower) => {
      const isSelected = selectedTowerId === tower.id;
      const isOverload = tower.riskLevel === 'OVERLOAD';
      const isCongested = tower.riskLevel === 'CONGESTED';

      const fillColor = isOverload ? '#f43f5e' : isCongested ? '#f59e0b' : '#3b82f6';
      const strokeColor = isOverload ? '#e11d48' : isCongested ? '#d97706' : '#2563eb';

      const circle = new google.maps.Circle({
        strokeColor: strokeColor,
        strokeOpacity: isSelected ? 0.95 : 0.7,
        strokeWeight: isSelected ? 2.5 : 1.5,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.28 : 0.15,
        map: map,
        center: { lat: tower.coordinates.lat, lng: tower.coordinates.lng },
        radius: tower.cellRadiusMeters,
        clickable: true,
        zIndex: isSelected ? 20 : 10,
      });

      circle.addListener('click', () => {
        onSelectTower(tower);
      });

      circlesRef.current.push(circle);
    });

    return () => {
      circlesRef.current.forEach((c) => c.setMap(null));
      circlesRef.current = [];
    };
  }, [map, visible, towers, selectedTowerId]);

  return null;
};
