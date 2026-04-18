import React, { useState, useEffect } from 'react';
import { 
  Toilet, 
  DoorOpen, 
  FirstAid, 
  CaretRight, 
  MapPin, 
  PersonSimpleWalk
} from '@phosphor-icons/react';

const FacilityFinder = ({ isEmergency, onAction }) => {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // Map IDs to actual Zone names in simulation
  const facilities = [
    { id: 'Washroom', target: 'Restrooms (L2)', title: 'Washrooms', icon: Toilet, color: 'blue', location: 'Level 2, North Wing', time: '2 mins away' },
    { id: 'Exit', target: 'Gate B', title: 'Nearest Exit', icon: DoorOpen, color: 'purple', location: 'Gate B (Central)', time: '4 mins away' },
    { id: 'Medical', target: 'Medical', title: 'Medical Help', icon: FirstAid, color: 'red', location: 'Ground Floor, Sector 3', time: '1 min away' },
  ];

  const handleSelect = (facility) => {
    setLoading(true);
    setSelected(null);
    setTimeout(() => {
      setLoading(false);
      setSelected(facility);
    }, 800);
  };

  useEffect(() => {
    if (isEmergency) {
      const exit = facilities.find(f => f.id === 'Exit');
      handleSelect(exit);
    }
  }, [isEmergency]);

  return (
    <section className="view active">
      <header className="page-header">
        <h1>Facility Finder</h1>
        <p className="subtitle">Locate essential services with precision.</p>
      </header>

      <div className="dashboard-grid">
        <div className="card col-span-1">
          <h3 className="mb-4 text-sm uppercase tracking-widest text-muted">Service Console</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {facilities.map(f => (
              <button 
                key={f.id} 
                className={`tactile-btn ${f.color} ${selected?.id === f.id ? 'active' : ''}`} 
                disabled={isEmergency && f.id !== 'Exit'}
                onClick={() => handleSelect(f)}
              >
                <div className="icon-indicator"></div>
                <f.icon weight={selected?.id === f.id ? 'fill' : 'bold'} size={20} />
                <span className="btn-label">{f.title}</span>
                <CaretRight size={14} className="text-muted" />
              </button>
            ))}
          </div>
        </div>

        <div className="card col-span-2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
          {loading ? (
            <p className="text-muted animate-pulse">Scanning venue network...</p>
          ) : selected ? (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s', width: '100%' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem', display: 'inline-block' }}>
                <MapPin size={48} className="text-cyan" weight="fill" />
              </div>
              <h2 className="text-xl font-bold">Location Identified</h2>
              <p className="text-large mt-2">{selected.location}</p>
              
              <div className="mt-4" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#222', borderRadius: '20px', fontSize: '0.8rem' }}>
                <PersonSimpleWalk />
                <span>ETA: {selected.time}</span>
              </div>
              
              <div className="mt-8" style={{ maxWidth: '300px', margin: '2rem auto 0' }}>
                <button 
                  className="btn btn-primary w-full" 
                  style={{ padding: '1rem' }}
                  onClick={() => onAction(selected.target)}
                >
                  Start Navigation
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted">
              <MapPin size={48} style={{ opacity: 0.1 }} />
              <p className="mt-4">Select a service from the console to locate.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FacilityFinder;
