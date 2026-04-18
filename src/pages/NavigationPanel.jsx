import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlass, 
  MapPinLine, 
  CheckCircle, 
  Lightbulb, 
  PersonSimpleWalk,
  ArrowRight,
  NavigationArrow
} from '@phosphor-icons/react';
import VenueMap from '../components/VenueMap';

const NavigationPanel = ({ simulationData, isEmergency, initialTarget, clearTarget }) => {
  const [search, setSearch] = useState(initialTarget || '');
  const [suggestions, setSuggestions] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const allZoneNames = simulationData.zones.map(z => z.name);

  useEffect(() => {
    if (initialTarget) {
      handleSearch(initialTarget);
      clearTarget();
    }
  }, [initialTarget]);

  useEffect(() => {
    if (search.length > 0 && !isNavigating) {
      const filtered = allZoneNames.filter(name => 
        name.toLowerCase().includes(search.toLowerCase()) && 
        name.toLowerCase() !== search.toLowerCase()
      );
      setSuggestions(filtered.slice(0, 4));
    } else {
      setSuggestions([]);
    }
  }, [search]);

  const handleSearch = (dest) => {
    if (!dest) return;
    setSearch(dest);
    setSuggestions([]);
    setLoading(true);
    setRouteInfo(null);
    setIsNavigating(false);

    setTimeout(() => {
      setLoading(false);
      setRouteInfo({
        destination: dest,
        time: Math.floor(Math.random() * 5 + 2)
      });
    }, 800);
  };

  const handleStartNavigation = () => {
    setIsNavigating(true);
    // In a real app, this would start a live GPS track.
    // Here we'll just show a "Live" status.
  };

  const handleMapClick = (zoneName) => {
    if (isEmergency) return;
    handleSearch(zoneName);
  };

  return (
    <section className="view active">
      <header className="page-header">
        <h1>Smart Navigation</h1>
        <p className="subtitle">Interactive pathfinding with real-time density avoidance.</p>
      </header>
      
      <div className="dashboard-grid">
        <div className="card col-span-1">
          <div className="search-container" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: '0.5rem', background: '#222', padding: '0.25rem', borderRadius: '8px', border: '1px solid #444' }}>
              <div style={{ padding: '0.5rem', color: '#888' }}><MagnifyingGlass size={20} /></div>
              <input 
                type="text" 
                placeholder="Where are you heading?" 
                style={{ flex: 1, padding: '0.5rem', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}
                value={search}
                disabled={isEmergency || isNavigating}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(search)}
              />
              {isNavigating && (
                <button 
                  onClick={() => setIsNavigating(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer', paddingRight: '0.5rem' }}
                >
                  EXIT
                </button>
              )}
            </div>

            {suggestions.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a1a1a', border: '1px solid #333', borderRadius: '0 0 8px 8px', zIndex: 10, boxShadow: '0 10px 20px rgba(0,0,0,0.5)' }}>
                {suggestions.map(s => (
                  <div 
                    key={s} 
                    style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #222', fontSize: '0.9rem' }}
                    className="suggestion-item"
                    onClick={() => handleSearch(s)}
                  >
                    <MapPinLine size={14} style={{ marginRight: '0.5rem' }} /> {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isNavigating && (
            <div className="mt-6">
              <h4 style={{ fontSize: '0.7rem', color: '#666', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 'bold' }}>Popular Destinations</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Gate A', 'Gate B', 'Food Court', 'Main Atrium'].map(dest => (
                  <button 
                    key={dest} 
                    className="btn btn-outline" 
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} 
                    disabled={isEmergency}
                    onClick={() => handleSearch(dest)}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {routeInfo && !isNavigating && (
            <div className="mt-8 p-4" style={{ background: 'var(--bg-cyan-dim)', borderRadius: '12px', border: '1px solid var(--accent-cyan)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '0.5rem', background: 'var(--accent-cyan)', color: '#000', borderRadius: '8px' }}><PersonSimpleWalk weight="bold" /></div>
                <div>
                  <p style={{ fontWeight: 'bold' }}>Optimal Path Found</p>
                  <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{routeInfo.time} min walk to {routeInfo.destination}</p>
                </div>
              </div>
              <button 
                className="btn btn-primary w-full mt-4" 
                style={{ padding: '0.75rem' }}
                onClick={handleStartNavigation}
              >
                Start Live Navigation
              </button>
            </div>
          )}

          {isNavigating && (
            <div className="mt-8 p-6" style={{ background: 'rgba(0, 229, 255, 0.05)', borderRadius: '16px', border: '1px solid rgba(0, 229, 255, 0.2)', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--accent-cyan)', color: '#000', borderRadius: '50%', marginBottom: '1rem' }} className="animate-pulse">
                <NavigationArrow weight="fill" size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'black' }}>Live Navigation Active</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginTop: '0.5rem', fontWeight: 'bold' }}>Follow the blue dashed path</p>
              
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888' }}>
                  <span>Distance</span>
                  <span>ETA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '0.25rem' }}>
                  <span>240m</span>
                  <span>{routeInfo?.time} min</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card col-span-2">
          <VenueMap 
            zones={simulationData.zones}
            connections={simulationData.connections}
            destination={search}
            userLocationId={simulationData.userLocation}
            onZoneClick={handleMapClick}
            isEmergency={isEmergency}
          />
          
          {loading && (
            <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--accent-cyan)' }}>
              <p className="animate-pulse">Optimizing route based on live crowd data...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NavigationPanel;
