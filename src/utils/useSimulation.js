import { useState, useEffect, useCallback } from 'react';

export const useSimulation = () => {
  const [isEmergency, setIsEmergency] = useState(false);
  const [isPeakHour, setIsPeakHour] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Priyanshu Prakash',
    id: 'SA-9821',
    type: 'VIP', // 'Guest' or 'VIP'
    avatar: null
  });

  const [simulationData, setSimulationData] = useState({
    time: new Date(),
    zones: [
      { id: 'z1', name: 'Food Court', currentCount: 220, maxCapacity: 300, distance: 150, isExit: false, x: 100, y: 100 },
      { id: 'z2', name: 'Gate A', currentCount: 45, maxCapacity: 200, distance: 400, isExit: true, x: 100, y: 350 },
      { id: 'z3', name: 'Gate B', currentCount: 160, maxCapacity: 200, distance: 100, isExit: true, x: 600, y: 100 },
      { id: 'z4', name: 'Gate C', currentCount: 20, maxCapacity: 150, distance: 500, isExit: true, x: 600, y: 350 },
      { id: 'z5', name: 'Main Atrium', currentCount: 380, maxCapacity: 500, distance: 50, isExit: false, x: 350, y: 225 },
      { id: 'z6', name: 'Restrooms (L2)', currentCount: 35, maxCapacity: 60, distance: 200, isExit: false, x: 350, y: 70 },
      { id: 'z7', name: 'Seating Area', currentCount: 80, maxCapacity: 150, distance: 180, isExit: false, x: 350, y: 380 }
    ],
    connections: [
      { from: 'z5', to: 'z1' }, { from: 'z5', to: 'z2' }, { from: 'z5', to: 'z3' },
      { from: 'z5', to: 'z4' }, { from: 'z5', to: 'z6' }, { from: 'z5', to: 'z7' },
      { from: 'z1', to: 'z3' }, { from: 'z2', to: 'z7' }, { from: 'z4', to: 'z7' }
    ],
    foodStalls: {
      'f1': { queueSize: 12, serviceRate: 1.5 },
      'f2': { queueSize: 8, serviceRate: 2.0 },
      'f3': { queueSize: 4, serviceRate: 2.5 },
      'f4': { queueSize: 2, serviceRate: 1.0 }
    },
    userLocation: 'z5',
    history: [],
    demographics: {
      male: 45,
      female: 52,
      other: 3
    },
    categories: {
      students: 35,
      professionals: 40,
      staff: 10,
      visitors: 15
    }
  });

  const [insights, setInsights] = useState('Initializing venue telemetry...');

  const adjustCrowd = useCallback((zoneId, amount) => {
    setSimulationData(prev => ({
      ...prev,
      zones: prev.zones.map(z => z.id === zoneId ? { ...z, currentCount: Math.max(0, Math.min(z.maxCapacity, z.currentCount + amount)) } : z)
    }));
  }, []);

  const setPeakHour = useCallback((active) => setIsPeakHour(active), []);
  const toggleUserType = () => setUserProfile(prev => ({ ...prev, type: prev.type === 'VIP' ? 'Guest' : 'VIP' }));

  useEffect(() => {
    const simInterval = setInterval(() => {
      setSimulationData(prev => {
        const newZones = prev.zones.map(zone => {
          let count = zone.currentCount;
          if (isEmergency) {
            if (!zone.isExit) count -= Math.floor(Math.random() * 15);
            else count += Math.floor(Math.random() * 10);
          } else if (isPeakHour) {
            count += Math.floor(Math.random() * 15);
          } else {
            count += (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 8);
          }
          count = Math.max(0, Math.min(zone.maxCapacity, count));
          return { ...zone, currentCount: count };
        });

        // Add some noise to demographics and categories
        const totalCrowd = newZones.reduce((sum, z) => sum + z.currentCount, 0);
        const newHistory = [...prev.history, totalCrowd].slice(-20);

        return { 
          ...prev, 
          time: new Date(prev.time.getTime() + 1000 * 30), 
          zones: newZones, 
          history: newHistory,
          // Demographics stay relatively stable but fluctuate slightly
          demographics: {
            male: Math.max(30, Math.min(60, prev.demographics.male + (Math.random() > 0.5 ? 1 : -1))),
            female: Math.max(30, Math.min(60, prev.demographics.female + (Math.random() > 0.5 ? 1 : -1))),
            other: Math.max(1, Math.min(5, prev.demographics.other + (Math.random() > 0.8 ? 1 : -1)))
          }
        };
      });
    }, 4000);
    return () => clearInterval(simInterval);
  }, [isEmergency, isPeakHour]);

  return { 
    simulationData, insights, isEmergency, toggleEmergency: () => setIsEmergency(!isEmergency),
    adjustCrowd, isPeakHour, setPeakHour, userProfile, toggleUserType
  };
};
